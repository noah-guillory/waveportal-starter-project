import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const contractABI = abi.abi;
const contractAddress = "0xec659848AB08F8D27E3Ca66Eb6d60316f5805310";


export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWaves, setTotalWaves] = useState(0);
  const [loading, setLoading] = useState(false);



  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Ethereum object does not exist!');
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      let count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());


      /*
      * Execute the actual wave from your smart contract
      */
      const waveTxn = await wavePortalContract.wave();
      console.log("Mining...", waveTxn.hash);

      setLoading(true);

      await waveTxn.wait();
      console.log("Mined -- ", waveTxn.hash);

      setLoading(false);

      count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());

      setTotalWaves(count.toNumber());

    } catch (error) {
      console.error(error);
    }
  }

  const getWaves = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Ethereum object does not exist!');
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      let count = await wavePortalContract.getTotalWaves();
      console.log(count.toNumber())

      setTotalWaves(count.toNumber());
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, []);

  useEffect(() => {
    getWaves();
  })

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I'm Noah! Connect your Ethereum wallet and wave at me!
        </div>

        <div>
          Total Waves: {totalWaves}
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {loading && (
          <div>
            Mining your wave...
          </div>
        )}
      </div>
    </div>
  );
}
