import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import Debug from "./Debug";
import { addressToPrivateKey } from "./util";
import ToastContainer from "./ToastContainer";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState();
  const [toasts, setToasts] = useState([]);
  
  const addToast = (message, options) => {
    const id = Date.now();
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, message, onClose: () => removeToast(id), options },
    ]);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) =>
      prevToasts.filter((toast) => toast.id !== id)
    );
  };

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        addToast={addToast}
      />
      <Transfer setBalance={setBalance} address={address} addToast={addToast} />
      <Debug />
      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default App;
