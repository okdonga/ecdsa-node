import { useState } from "react";
import server from "./server";
import { hashMessage, shortenAddress, signTx } from "./util";

function Transfer({ address, setBalance, addToast }) {
  const [sendAmount, setSendAmount] = useState("1");
  const [recipient, setRecipient] = useState("");
 
  const setValue = (setter) => (evt) => setter(evt.target.value);
 
  function validate(sendAmount, recipient) {
    if (!sendAmount || isNaN(parseInt(sendAmount))) {
      addToast("Please enter a valid send amount");
      return false;
    }
    if (!recipient || !recipient.startsWith("0x") || recipient.length !== 42) {
      addToast("Please enter a valid recipient address");
      return false;
    }
    return true;
  }

  async function transfer(evt) {
    evt.preventDefault();
    if (!validate(sendAmount, recipient)) return;

    try {
      const transaction = {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      }
      const msgHash = hashMessage(JSON.stringify(transaction));
      const [signature, recovery, msgHashString] = await signTx(msgHash, address);

      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
        recovery,
        msgHash: msgHashString,
      });
      setBalance(balance);
      addToast(`Transferred ${parseInt(sendAmount)} to ${shortenAddress(address)}`, { status: 'success' });
    } catch (ex) {
      const errorMessage = ex.response ? ex.response.data.message : ex.message;
      addToast(errorMessage);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer} validate="true">
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient's address
        <input
          placeholder="Type an address (eg. 0x98765...)"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
