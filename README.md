# Bitcoin Web Wallet (Next.js & Vercel)

A minimal, real-use Bitcoin wallet interface deployable on Vercel.

## Features
- Create/import Bitcoin wallet (BIP39, non-custodial)
- View address & QR code
- View live balance & transaction history (Blockstream API)
- **Send Bitcoin UI** (full signing/broadcasting can be added)

## Security
- Mnemonics and private keys never leave your browser.
- Always back up your recovery phrase!
- For best security, use on a trusted device and consider hardware wallets for large sums.

## Running locally
```bash
npm install
npm run dev
```

## Deploying on Vercel
1. Push to GitHub.
2. Import the repo at [vercel.com/import](https://vercel.com/import).
3. Deploy!

## Extend
- Add transaction signing/broadcasting for full send support.
- Integrate persistent user auth if desired.
- Add multi-address, SegWit, or multisig features (ask for help!).

---

> **Note:** This is a demo wallet. Use with caution, and do not store large amounts!
