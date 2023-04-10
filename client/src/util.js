import * as secp from 'ethereum-cryptography/secp256k1';
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, hexToBytes, bytesToHex, toHex } from 'ethereum-cryptography/utils';

export const addressToPrivateKey = {
    "0x9949e39006a4391d300763e86b010dac648a149a": "0x7b9c43a1c110489e981ff01a5e2488d8e7f31267db3f90a44891837047c131d0",
    "0xb1e1b8ec6308daaadb99f61a52260a0b7e5dbb70": "0xea8254355c8294d566e160bb17bfc5f3f9c3e0d4d44f9ce1752198caccbd15a0",
    "0x187e80ec827120e8e5757fca66dda55cdecf1f35": "0x04245144791131434596a85422bd5258cde6bc67a2495553cf85453b7ae2e303"
}

export function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
}

export async function signTx(msgHash, address) {
    // 1. find private key 
    if (!localStorage.getItem(PK) && !addressToPrivateKey[address]) {
        throw new Error('Private key not found');
    }
    const privateKey = (addressToPrivateKey[address] || localStorage.getItem(PK)).slice(2);
    try {
        // 2. sign transaction
        const [signature, recovery] = await secp.sign(msgHash, hexToBytes(privateKey), {recovered: true});
        return [bytesToHex(signature), recovery, bytesToHex(msgHash)]; // important to convert this to hex string to send as payload
    } catch(ex) {
        throw new Error('Failed to sign transaction');
    }
}

const PK = 'alchemy.bootcamp.week1.wallet.pk';
const ADDRESS = 'alchemy.bootcamp.week1.wallet.address';

export function generateNewWallet() {
    // find if private key is saved in local storage 
    // if (!localStorage.getItem(PK)) {
        const privateKey = secp.utils.randomPrivateKey();
        const publicKey = secp.getPublicKey(privateKey);
        console.log(publicKey);
        const pubKey = publicKey.slice(1);
        const hashedPubKey = keccak256(pubKey);
        const address = `0x${toHex(hashedPubKey.slice(-20))}`;
        localStorage.setItem(PK, `0x${bytesToHex(privateKey)}`);
        localStorage.setItem(ADDRESS, address);
        return address;
    // }
    // return getActivatedAddress();
}

// function getActivatedAddress() {
//     return localStorage.getItem(ADDRESS);
// }


async function recoverKey(msgHash, signature, recovery) {
    return secp.recoverPublicKey(msgHash, signature, recovery);
}

export function shortenAddress(address) {
    return `0x${address.slice(0, 3)}...${address.slice(-4)}`;
}