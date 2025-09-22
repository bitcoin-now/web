import { useState, useEffect } from 'react';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import QRCode from 'qrcode.react';

const BLOCKSTREAM_API = 'https://blockstream.info/api';

async function fetchBalance(address) {
  const res = await fetch(`${BLOCKSTREAM_API}/address/${address}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
}

async function fetchTransactions(address) {
  const res = await fetch(`${BLOCKSTREAM_API}/address/${address}/txs`);
  if (!res.ok) return [];
  return await res.json();
}

export default function Home() {
  const [mnemonic, setMnemonic] = useState('');
  const [address, setAddress] = useState('');
  const [showWallet, setShowWallet] = useState(false);
  const [balance, setBalance] = useState(null);
  const [txs, setTxs] = useState([]);
  const [importValue, setImportValue] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');

  useEffect(() => {
    if (address) {
      fetchBalance(address).then(setBalance);
      fetchTransactions(address).then(setTxs);
    }
  }, [address]);

  const createWallet = async () => {
    const mnem = bip39.generateMnemonic();
    setMnemonic(mnem);
    const seed = await bip39.mnemonicToSeed(mnem);
    const root = bitcoin.bip32.fromSeed(seed);
    const child = root.derivePath("m/44'/0'/0'/0/0");
    const { address } = bitcoin.payments.p2pkh({ pubkey: child.publicKey });
    setAddress(address);
    setShowWallet(true);
  };

  const importWallet = async () => {
    if (!bip39.validateMnemonic(importValue)) {
      alert('Invalid mnemonic!');
      return;
    }
    setMnemonic(importValue);
    const seed = await bip39.mnemonicToSeed(importValue);
    const root = bitcoin.bip32.fromSeed(seed);
    const child = root.derivePath("m/44'/0'/0'/0/0");
    const { address } = bitcoin.payments.p2pkh({ pubkey: child.publicKey });
    setAddress(address);
    setShowWallet(true);
  };

  // Stub: Sending BTC (UI only, needs UTXO fetching/signing/broadcast logic)
  const sendBitcoin = async () => {
    alert('Sending BTC: This feature needs UTXO fetching, signing, and broadcasting. Not implemented yet.');
  };

  return (
    <div style={{ margin: '2em', maxWidth: 700 }}>
      <h1>Bitcoin Web Wallet (Vercel Demo)</h1>
      {!showWallet ? (
        <>
          <button onClick={createWallet}>Create New Wallet</button>
          <div style={{ marginTop: '1em' }}>
            <input
              type="text"
              placeholder="Paste mnemonic to import"
              value={importValue}
              onChange={e => setImportValue(e.target.value)}
              style={{ width: '300px', marginRight: '1em' }}
            />
            <button onClick={importWallet}>Import Wallet</button>
          </div>
        </>
      ) : (
        <div>
          <h2>Your Bitcoin Address:</h2>
          <p style={{ fontFamily: 'monospace', fontSize: '1.1em' }}>{address}</p>
          <QRCode value={address} />
          <h3>Your Recovery Mnemonic:</h3>
          <p style={{ background: '#eee', padding: '1em', wordBreak: 'break-word' }}>{mnemonic}</p>
          <p style={{ color: 'red' }}><b>Back up your recovery phrase! Your funds depend on it.</b></p>
          <h3>Balance: {balance !== null ? `${balance / 1e8} BTC` : '...'} </h3>
          <h3>Send Bitcoin:</h3>
          <input
            type="text"
            placeholder="Recipient Address"
            value={sendTo}
            onChange={e => setSendTo(e.target.value)}
            style={{ width: '300px', marginRight: '1em' }}
          />
          <input
            type="number"
            placeholder="Amount in BTC"
            value={sendAmount}
            onChange={e => setSendAmount(e.target.value)}
            style={{ width: '120px', marginRight: '1em' }}
          />
          <button onClick={sendBitcoin}>Send</button>
          <h3 style={{ marginTop: '2em' }}>Recent Transactions:</h3>
          <ul>
            {txs.map(tx => (
              <li key={tx.txid} style={{ marginBottom: '1em' }}>
                <a href={`https://blockstream.info/tx/${tx.txid}`} target="_blank" rel="noopener noreferrer">{tx.txid}</a>
                <br />
                <span>Confirmed: {tx.status.confirmed ? 'Yes' : 'No'}</span>
              </li>
            ))}
            {txs.length === 0 && <li>No transactions found.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
