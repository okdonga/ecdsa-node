import { useEffect } from 'react';
import server from "./server";
import { generateNewWallet, shortenAddress } from "./util";

function Wallet({ address, setAddress, balance, setBalance, addToast }) {

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function fetchBalance() {
    if (address.startsWith('0x') && address.length === 42) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  function handleGenerateNewWallet() {
    const address = generateNewWallet();
    setAddress(address);
    addToast(`New wallet generated: ${shortenAddress(address)}`, { status: 'success' });
  }

  async function handleFaucetRequest() {
    try {
      const {
        data: { balance },
      } = await server.post(`faucet`, { sender: address });
      setBalance(balance);
      addToast(`Your wallet received: ${balance}!`, { status: 'success' });
    } catch (ex) {
      addToast(ex.response.data.message);
    }
  }

  useEffect(() => {
    if (address) {
      fetchBalance(); 
    }
  }, [address]);

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <p>📍You can either use the test account below or generate a new wallet</p>

      <label>
        Ethereum address
        <input placeholder="Type an ethereum address (eg. 0x123456...)" value={address} onChange={setValue(setAddress)}></input>
      </label>

      <div className="balance">Balance: {balance}</div>

      <button type="button" className="button" onClick={handleGenerateNewWallet}>Generate a new wallet</button>
      <button type="button" className="button abc" onClick={handleFaucetRequest}>Request faucet</button>
    </div>
  );
}

export default Wallet;
