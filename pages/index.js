'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [status, setStatus] = useState('');
  const [inputAddress, setInputAddress] = useState('');
  const [txCount, setTxCount] = useState(null);

  const rpc = "https://tea-sepolia.g.alchemy.com/v2/DxSN5yU-0iqKwiaJgnHhBNu7vtQkYL83";

  const contractAddress = "0x17fC56B4D518983cFD81b459D04E952D67BFC101";
  const abi = ["function gm() external"];

  async function sendGM() {
    if (!window.ethereum) return setStatus('⚠️ Wallet not found');

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const tx = await contract.gm();
      const shortHash = shortenHash(tx.hash);
      setStatus(
        `✅ TX Sent! <a href="https://sepolia.tea.xyz/tx/${tx.hash}" target="_blank" class="underline text-pink-400">${shortHash}</a>`
      );

      await tx.wait();
      setStatus(
        `✅ Confirmed! <a href="https://sepolia.tea.xyz/tx/${tx.hash}" target="_blank" class="underline text-pink-400">${shortHash}</a>`
      );
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
    }
  }

  async function checkTotalTx() {
    if (!ethers.isAddress(inputAddress)) {
      setStatus('❌ Invalid address');
      setTxCount(null);
      return;
    }

    const provider = new ethers.JsonRpcProvider(rpc);

    try {
      const count = await provider.getTransactionCount(inputAddress);
      setTxCount(count);
      setStatus('');
    } catch (err) {
      setStatus(`❌ Failed to fetch TX count: ${err.message}`);
    }
  }

  function shortenHash(hash) {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-md bg-[#111] rounded-2xl border border-[#222] p-6 shadow-xl space-y-4">
        <h1 className="text-3xl font-semibold text-center">🌅 Good Morning, Tea</h1>
        <p className="text-sm text-center text-gray-400">Start your day with an onchain gm ☕</p>

        <button
          onClick={sendGM}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white font-medium py-3 rounded-lg transition-all"
        >
          Send GM
        </button>

        {/* Check Total TX */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Paste wallet address..."
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[#1a1a1a] border border-[#333] text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={checkTotalTx}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white text-sm py-2 rounded-md transition-all"
          >
            Check Total TX
          </button>
          {txCount !== null && (
            <div className="text-sm text-center text-pink-400">
              ✅ {inputAddress.slice(0, 6)}...{inputAddress.slice(-4)} has sent <b>{txCount}</b> total TXs on Tea Sepolia.
            </div>
          )}
        </div>

        {/* Contract info */}
        <div className="text-sm text-gray-300 space-y-1 text-center">
          <p>
            🔗 Contract:{' '}
            <a
              href={`https://sepolia.tea.xyz/address/${contractAddress}`}
              target="_blank"
              className="underline text-pink-400 hover:text-pink-300"
            >
              {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
            </a>
          </p>
          <p>⛓️ Chain ID: 10218</p>
        </div>

        {status && (
          <div
            className="mt-2 bg-[#1a1a1a] text-sm text-gray-300 p-3 rounded-md border border-[#333] break-all"
            dangerouslySetInnerHTML={{ __html: status }}
          />
        )}
      </div>

      <footer className="text-xs mt-6 text-gray-500 hover:text-pink-400 transition-all">
        Built by{' '}
        <a
          href="https://github.com/H15S"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          H15S
        </a>
      </footer>
    </div>
  );
}
