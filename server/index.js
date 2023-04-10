const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require('ethereum-cryptography/secp256k1');
const { hexToBytes, toHex, utf8ToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require("ethereum-cryptography/keccak");
const { getAddress } = require("./scripts/generate");

app.use(cors());
app.use(express.json());

const balances = {
  "0x9949e39006a4391d300763e86b010dac648a149a": 100,
  "0xb1e1b8ec6308daaadb99f61a52260a0b7e5dbb70": 50,
  "0x187e80ec827120e8e5757fca66dda55cdecf1f35": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, msgHash, recovery } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);
  const publicKey = secp.recoverPublicKey(hexToBytes(msgHash), hexToBytes(signature), recovery);
  // verify that last 20 bytes of the public key are the same as the address
  const address = getAddress(publicKey);
  const isValidPubKey = toHex(address) === sender.slice(2);
  if (!isValidPubKey) {
    return res.status(400).send({ message: "Signature is not signed by the sender" });
  }
  // verify that the signature and message are coming from the owner of the public key
  const isSigned = secp.verify(hexToBytes(signature), hexToBytes(msgHash), publicKey);

  if (!isSigned) {
    return res.status(400).send({ message: "Invalid signature!" });
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.post("/faucet", (req, res) => {
  const { sender } = req.body;
  if (!sender || !(sender.startsWith('0x') && sender.length === 42)) {
    return res.status(400).send({ message: 'Invalid sender address' });
  }
  if (balances[sender]) {
    return res.status(400).send({ message: 'Already requested a faucet!' });
  }
  balances[sender] = 100;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
