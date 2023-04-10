import { addressToPrivateKey } from "./util";

function Debug() {
  return (
    <div className="container debug">
      <h1>[For Debug] Test accounts </h1>
      <p>[Note] Make sure you have a private key for your wallet saved in your local storage to sign a transaction</p>
      <ul>
        {Object.keys(addressToPrivateKey).map(addr => {
            return <li key={addr}>Address: {addr} <br></br> Private key: {addressToPrivateKey[addr]}</li>
        })}
      </ul>
    </div>
  );
}

export default Debug;
