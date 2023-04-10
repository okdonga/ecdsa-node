const secp = require('ethereum-cryptography/secp256k1');

const { hexToBytes, toHex, utf8ToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require("ethereum-cryptography/keccak");

function getAddress(publicKey) {
     // remove the first byte because it indicates the format of the key (length: 130 bytes)
    const pubKey = publicKey.slice(1);
    
    // hash the public key
    const hashedPubKey = keccak256(pubKey);

    // return the last 20 bytes of the hash
    return hashedPubKey.slice(-20);
}

function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
}

async function recoverKey(msgHash, signature, recovery) {
    return secp.recoverPublicKey(msgHash, signature, recovery);
    // return secp.recoverPublicKey(msgHash, signature);
}

(async () => {
    const privateKey = secp.utils.randomPrivateKey();
    console.log('private key:', toHex(privateKey));
    const publicKey = secp.getPublicKey(privateKey);
    console.log('public key: ', toHex(publicKey))
    const address = getAddress(publicKey);
    console.log('address', toHex(address))
    const messageHash = hashMessage('hello안녕');
    const [signature, recovery] = await secp.sign(messageHash,  privateKey, { recovered: true });
    console.log('tohex:', toHex(signature));
    console.log('signature:', signature)
    const isSigned = secp.verify(signature, messageHash, publicKey);
    const pubKeyRecovered = await recoverKey(messageHash, signature, recovery);
    console.log(toHex(publicKey) === toHex(pubKeyRecovered))
    console.log('isSigned', isSigned)
})();


module.exports = { getAddress, hashMessage, recoverKey };