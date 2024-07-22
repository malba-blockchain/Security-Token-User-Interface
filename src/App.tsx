import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { WALLET_ADAPTERS, CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import "./App.css";

// import RPC from "./web3RPC"; // for using web3.js
// import RPC from './ethersRPC' // for using ethers.js
import RPC from './viemRPC' // for using viem

const clientId = "BH855-UE0U6H-Cvq1O2ukHMU09JPtllkDAZkFUhiSQEg86iVoD1yaCxpMUa1TzYpWLuXuBsp_VvFnFUUUhJoV1Q"; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  const [showMaticInput, setShowMaticInput] = useState<boolean>(false);
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);
  const [showAllowanceInput, setShowAllowanceInput] = useState<boolean>(false);
  const [showGetFrozenTokensInput, setShowGetFrozenTokensInput] = useState<boolean>(false);
  const [showIsFrozenClickInput, setShowIsFrozenClickInput] = useState<boolean>(false);
  const [showApproveBalanceInput, setShowApproveBalanceInput] = useState<boolean>(false);
  const [showBatchMintInput, setShowBatchMintInput] = useState<boolean>(false);
  const [showBatchBurnInput, setShowBatchBurnInput] = useState<boolean>(false);
  const [showBatchTransferInput, setShowBatchTransferInput] = useState<boolean>(false);
  const [showBurnTokensInput, setShowBurnTokensInput] = useState<boolean>(false);
  const [showFreezePartialTokensInput, setShowFreezePartialTokensInput] = useState<boolean>(false);
  const [showMintTokensInput, setShowMintTokensInput] = useState<boolean>(false);
  const [showUnfreezePartialTokensInput, setShowUnfreezePartialTokensInput] = useState<boolean>(false);
  const [showTransferTokensInput, setShowTransferTokensInput] = useState<boolean>(false);
  const [showRecoveryAddressInput, setShowRecoveryAddressInput] = useState<boolean>(false);

  
  const [address, setAddress] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [ownerAddress, setOwnerAddress] = useState<string>("");
  const [spenderAddress, setSpenderAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [addressesList, setAddressesList] = useState<string>("");
  const [amounts, setAmounts] = useState<string>("");
  const [lostWalletAddress, setLostWalletAddress] = useState<string>("");
  const [newWalletAddress, setNewWalletAddress] = useState<string>("");
  const [investorOnchainID, setInvestorOnchainID] = useState<string>("");


  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x13882", // Please use 0x1 for Mainnet
          rpcTarget: "https://rpc.ankr.com/polygon_amoy",
          displayName: "Polygon Amoy",
          blockExplorer: "https://polygonscan.com/",
          ticker: "MATIC",
          tickerName: "Polygon",
          logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
        };

        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

        const web3auth = new Web3AuthNoModal({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider,
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            clientId: clientId, //Optional - Provide only if you haven't provided it in the Web3Auth Instantiation Code
            uxMode: "popup",
            loginConfig: {
              google: {
                verifier: "web3auth-google-verifier001",
                typeOfLogin: "google",
                clientId: "947022819304-okcm8e1nq14m0vm8i8bmocpim6th1hep.apps.googleusercontent.com", //use your app client id you got from google
              },
            },
          },
          privateKeyProvider,
        });

        web3auth.configureAdapter(openloginAdapter);
        setWeb3auth(web3auth);

        await web3auth.init();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: "google",
    });
    setProvider(web3authProvider);
    window.location.reload();
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setLoggedIn(false);
    setProvider(null);
  };

  const getChainId = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };
  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole(address);
  };

  const getMaticBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const balanceOf = async (address: string) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.balanceOf(address);
    uiConsole(balance);
  };

  const smartContractBalanceOf = async (walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.smartContractBalanceOf(walletAddress);
    uiConsole(balance);
  };

  const smartContractAllowance = async (ownerAddress: any, spenderAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const allowance = await rpc.smartContractAllowance(ownerAddress, spenderAddress);
    uiConsole(allowance);
  };

  const smartContractGetFrozenTokens = async (walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const frozenTokens = await rpc.smartContractGetFrozenTokens(walletAddress);
    uiConsole(frozenTokens);
  };

  const getCompliance= async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const compliance = await rpc.getCompliance();
    uiConsole(compliance);
  };

  const getDecimals= async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const decimals = await rpc.getDecimals();
    uiConsole(decimals);
  };

  const smartContractIsFrozen = async (walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const isFrozen = await rpc.smartContractIsFrozen(walletAddress);
    uiConsole(isFrozen);
  };

  const smartContractApproveBalance = async (spenderAddress: any, amount:any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing approval...");
    const approveBalance = await rpc.smartContractApproveBalance(spenderAddress, amount);
    uiConsole(approveBalance);
  };

  const smartContractBatchMint = async (addressesList: any, amounts:any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    // Split the comma-separated strings into arrays
    const _addressesList = addressesList.split(',');
    const _amounts = amounts.split(',');

    const rpc = new RPC(provider);
    uiConsole("Processing batch mint...");
    const batchMint = await rpc.smartContractBatchMint(_addressesList, _amounts);
    uiConsole(batchMint);
  };

  const smartContractBatchBurn = async (addressesList: any, amounts:any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    // Split the comma-separated strings into arrays
    const _addressesList = addressesList.split(',');
    const _amounts = amounts.split(',');

    const rpc = new RPC(provider);
    uiConsole("Processing batch burn...");
    const batchBurn = await rpc.smartContractBatchBurn(_addressesList, _amounts);
    uiConsole(batchBurn);
  };

  const smartContractBatchTransfer = async (addressesList: any, amounts:any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    // Split the comma-separated strings into arrays
    const _addressesList = addressesList.split(',');
    const _amounts = amounts.split(',');

    const rpc = new RPC(provider);
    uiConsole("Processing batch transfer...");
    const batchTransfer = await rpc.smartContractBatchTransfer(_addressesList, _amounts);
    uiConsole(batchTransfer);
  };

  const smartContractBurnTokens = async (walletAddress: any, amount:any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing burn tokens...");
    const burnTokens = await rpc.smartContractBurnTokens(walletAddress, amount);
    uiConsole(burnTokens);
  };

  const smartContractFreezePartialTokens = async (walletAddress: any, amount:any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing partial tokens freeze...");
    const partialTokenFreeze = await rpc.smartContractFreezePartialTokens(walletAddress, amount);
    uiConsole(partialTokenFreeze);
  };

  const smartContractMintTokens = async (walletAddress: any, amount:any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing mint tokens...");
    const mintTokens = await rpc.smartContractMintTokens(walletAddress, amount);
    uiConsole(mintTokens);
  };

  const smartContractRecoveryAddress = async (lostWalletAddress: any, newWalletAddress:any, investorOnchainID:any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing recovery address...");
    const recoveryAddress = await rpc.smartContractRecoveryAddress(lostWalletAddress, newWalletAddress, investorOnchainID);
    uiConsole(recoveryAddress);
  };

  const smartContractTransferTokens = async (walletAddress: any, amount:any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing tokens transfer...");
    const tokenTransfer = await rpc.smartContractTransferTokens(walletAddress, amount);
    uiConsole(tokenTransfer);
  };

  const smartContractUnfreezePartialTokens = async (walletAddress: any, amount:any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing partial tokens unfreeze...");
    const partialTokenUnfreeze = await rpc.smartContractUnfreezePartialTokens(walletAddress, amount);
    uiConsole(partialTokenUnfreeze);
  };

  const getName= async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const name = await rpc.getName();
    uiConsole(name);
  };

  const getOnchainID= async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const onchainID = await rpc.getOnchainID();
    uiConsole(onchainID);
  };

  const getIsPaused= async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const isPaused = await rpc.getIsPaused();
    uiConsole(isPaused);
  };

  const getSymbol= async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const symbol = await rpc.getSymbol();
    uiConsole(symbol);
  };

  const pauseSmartContract= async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Pausing smart contract...");
    const pause = await rpc.smartContractPause();
    uiConsole(pause);
  };
  
  const unpauseSmartContract= async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Unpausing smart contract...");
    const unpause = await rpc.smartContractUnpause();
    uiConsole(unpause);
  };

  const getTotalSupply= async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const totalSupply = await rpc.getTotalSupply();
    uiConsole(totalSupply);
  };


  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    uiConsole(privateKey);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Update the state variable based on the input field's ID
    if (event.target.id === 'address') {
      setAddress(event.target.value);
    }
    else if (event.target.id === 'walletAddress') {
      setWalletAddress(event.target.value);
    }
    else if (event.target.id === 'ownerAddress') {
      setOwnerAddress(event.target.value);
    }
    else if (event.target.id === 'spenderAddress') {
      setSpenderAddress(event.target.value);
    }
    else if (event.target.id === 'amount') {
      setAmount(event.target.value);
    }
    else if (event.target.id === 'addressesList') {
      setAddressesList(event.target.value);
    }
    else if (event.target.id === 'amounts') {
      setAmounts(event.target.value);
    }
    else if (event.target.id === 'lostWalletAddress') {
      setLostWalletAddress(event.target.value);
    }
    else if (event.target.id === 'newWalletAddress') {
      setNewWalletAddress(event.target.value);
    }
    else if (event.target.id === 'investorOnchainID') {
      setInvestorOnchainID(event.target.value);
    }
  };

  const handleCheckBalance = () => {
    balanceOf(address);
    setAddress("");
  };

  const handleMaticBalanceOfClick = () => {
    setShowMaticInput(!showMaticInput); // Toggle Matic input visibility
    setAddress("");
  };

  const handleTokenBalanceOfClick = () => {
    setShowTokenInput(!showTokenInput); // Toggle Token input visibility
    setWalletAddress("");
  };

  const handleCheckSmartContractBalance = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    smartContractBalanceOf(walletAddress);
    setWalletAddress("");
  };

  const handleAllowanceClick = () => {
    setShowAllowanceInput(!showAllowanceInput); // Toggle Token input visibility
    setOwnerAddress("");
    setSpenderAddress("");
  };

  const handleCheckAllowance = () => {
    const ownerAddress = (document.getElementById('ownerAddress') as HTMLInputElement).value;
    const spenderAddress = (document.getElementById('spenderAddress') as HTMLInputElement).value;
    smartContractAllowance(ownerAddress, spenderAddress);
    setOwnerAddress("");
    setSpenderAddress("");
  };

  const handleGetFrozenTokensClick = () => {
    setShowGetFrozenTokensInput(!showGetFrozenTokensInput); // Toggle Token input visibility
    setWalletAddress("");
  };
  
  const handleGetFrozenTokens = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    smartContractGetFrozenTokens(walletAddress);
    setWalletAddress("");
  };

  const handleIsFrozenClick = () => {
    setShowIsFrozenClickInput(!showIsFrozenClickInput); // Toggle Token input visibility
    setWalletAddress("");
  };
  
  const handleIsFrozen = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    smartContractIsFrozen(walletAddress);
    setWalletAddress("");
  };

  const handleApproveBalanceClick = () => {
    setShowApproveBalanceInput(!showApproveBalanceInput); // Toggle Token input visibility
    setSpenderAddress("");
    setAmount("");
  };

  const handleApproveBalance= () => {
    const spenderAddress = (document.getElementById('spenderAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    smartContractApproveBalance(spenderAddress, amount);
    setSpenderAddress("");
    setAmount("");
  };

  const handleBatchMintClick = () => {
    setShowBatchMintInput(!showBatchMintInput); // Toggle Token input visibility
    setAddressesList("");
    setAmounts("");
  };

  const handleBatchMint= () => {
    const addressesList = (document.getElementById('addressesList') as HTMLInputElement).value;
    const amounts = (document.getElementById('amounts') as HTMLInputElement).value;
    smartContractBatchMint(addressesList, amounts);
    setAddressesList("");
    setAmounts("");
  };

  const handleBatchBurnClick = () => {
    setShowBatchBurnInput(!showBatchBurnInput); // Toggle Token input visibility
    setAddressesList("");
    setAmounts("");
  };

  const handleBatchBurn= () => {
    const addressesList = (document.getElementById('addressesList') as HTMLInputElement).value;
    const amounts = (document.getElementById('amounts') as HTMLInputElement).value;
    smartContractBatchBurn(addressesList, amounts);
    setAddressesList("");
    setAmounts("");
  };

  const handleBatchTransferClick = () => {
    setShowBatchTransferInput(!showBatchTransferInput); // Toggle Token input visibility
    setAddressesList("");
    setAmounts("");
  };

  const handleBatchTransfer= () => {
    const addressesList = (document.getElementById('addressesList') as HTMLInputElement).value;
    const amounts = (document.getElementById('amounts') as HTMLInputElement).value;
    smartContractBatchTransfer(addressesList, amounts);
    setAddressesList("");
    setAmounts("");
  };

  const handleBurnTokensClick = () => {
    setShowBurnTokensInput(!showBurnTokensInput); // Toggle Token input visibility
    setWalletAddress("");
    setAmount("");
  };

  const handleBurnTokens= () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    smartContractBurnTokens(walletAddress, amount);
    setWalletAddress("");
    setAmount("");
  };

  const handleFreezePartialTokensClick = () => {
    setShowFreezePartialTokensInput(!showFreezePartialTokensInput); // Toggle Token input visibility
    setWalletAddress("");
    setAmount("");
  };

  const handleFreezePartialTokens= () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    smartContractFreezePartialTokens(walletAddress, amount);
    setWalletAddress("");
    setAmount("");
  };

  const handleMintTokensClick = () => {
    setShowMintTokensInput(!showMintTokensInput); // Toggle Token input visibility
    setWalletAddress("");
    setAmount("");
  };

  const handleMintTokens= () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    smartContractMintTokens(walletAddress, amount);
    setWalletAddress("");
    setAmount("");
  };

  const handleRecoveryAddressClick = () => {
    setShowRecoveryAddressInput(!showRecoveryAddressInput); // Toggle Token input visibility
    setLostWalletAddress("");
    setNewWalletAddress("");
    setInvestorOnchainID("");
  };

  const handleRecoveryAddress= () => {
    const lostWalletAddress = (document.getElementById('lostWalletAddress') as HTMLInputElement).value;
    const newWalletAddress = (document.getElementById('newWalletAddress') as HTMLInputElement).value;
    const investorOnchainID = (document.getElementById('investorOnchainID') as HTMLInputElement).value;

    smartContractRecoveryAddress(lostWalletAddress, newWalletAddress, investorOnchainID);
    setLostWalletAddress("");
    setNewWalletAddress("");
    setInvestorOnchainID("");
  };

  const handleTransferTokensClick = () => {
    setShowTransferTokensInput(!showTransferTokensInput); // Toggle Token input visibility
    setWalletAddress("");
    setAmount("");
  };

  const handleTransferTokens= () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    smartContractTransferTokens(walletAddress, amount);
    setWalletAddress("");
    setAmount("");
  };

  const handleUnfreezePartialTokensClick = () => {
    setShowUnfreezePartialTokensInput(!showUnfreezePartialTokensInput); // Toggle Token input visibility
    setWalletAddress("");
    setAmount("");
  };

  const handleUnfreezePartialTokens= () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    smartContractUnfreezePartialTokens(walletAddress, amount);
    setWalletAddress("");
    setAmount("");
  };


  const loggedInView = (
    <>
      <h3>Web3Auth functions</h3>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={getChainId} className="card">
            Get Chain ID
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getMaticBalance} className="card">
            Get Matic Balance
          </button>
        </div>
        <div>
          <button onClick={handleMaticBalanceOfClick} className="card">
            Matic Balance Of
          </button>
          {showMaticInput && (
            <div>
              <input type="text" value={address} id="address" onChange={handleInputChange} placeholder="Enter address" />
              <button onClick={handleCheckBalance} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Check Matic Balance
              </button>
            </div>
          )}
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={getPrivateKey} className="card">
            Get Private Key
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>

      <h3>Smart contract read functions</h3>
      <div className="flex-container">
        <div>
          <button onClick={handleTokenBalanceOfClick} className="card">
            Token Balance Of
          </button>
          {showTokenInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <button onClick={handleCheckSmartContractBalance} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Check Token Balance
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleAllowanceClick} className="card">
            Allowance
          </button>
          {showAllowanceInput && (
            <div>
              <input type="text" value={ownerAddress} id="ownerAddress" onChange={handleInputChange} placeholder="Enter owner address" />
              <input type="text" value={spenderAddress} id="spenderAddress" onChange={handleInputChange} placeholder="Enter spender address" />
              <button onClick={handleCheckAllowance} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Check User Allowance
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleGetFrozenTokensClick} className="card">
            Get Frozen Tokens
          </button>
          {showGetFrozenTokensInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <button onClick={handleGetFrozenTokens} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Check User Frozen Tokens
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={getCompliance} className="card">
            Get Compliance
          </button>
        </div>

        <div>
          <button onClick={getDecimals} className="card">
            Get Decimals
          </button>
        </div>

        <div>
          <button onClick={handleIsFrozenClick} className="card">
            Is Frozen
          </button>
          {showIsFrozenClickInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <button onClick={handleIsFrozen} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Check If Wallet is Frozen
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={getName} className="card">
            Get Name
          </button>
        </div>

        <div>
          <button onClick={getOnchainID} className="card">
            Get Onchain ID
          </button>
        </div>

        <div>
          <button onClick={getIsPaused} className="card">
            Is Smart Contract Paused
          </button>
        </div>

        <div>
          <button onClick={getSymbol} className="card">
            Get Symbol
          </button>
        </div>

        <div>
          <button onClick={getTotalSupply} className="card">
            Get Total Supply
          </button>
        </div>
      </div>

      <h3>Smart contract write functions</h3>
      <div className="flex-container">
        <div>
          <button onClick={handleApproveBalanceClick} className="card">
            Approve Balance
          </button>
          {showApproveBalanceInput && (
            <div>
              <input type="text" value={spenderAddress} id="spenderAddress" onChange={handleInputChange} placeholder="Enter spender address" />
              <input type="text" value={amount} id="amount" onChange={handleInputChange} placeholder="Enter amount" />
              <button onClick={handleApproveBalance} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Approve
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleBatchMintClick} className="card">
            Batch Mint
          </button>
          {showBatchMintInput && (
            <div>
              <input type="text" value={addressesList} id="addressesList" onChange={handleInputChange} placeholder="Addresses list, comma separated" />
              <input type="text" value={amounts} id="amounts" onChange={handleInputChange} placeholder="Amount list, comma separated" />
              <button onClick={handleBatchMint} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Batch Mint
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleBatchBurnClick} className="card">
            Batch Burn
          </button>
          {showBatchBurnInput && (
            <div>
              <input type="text" value={addressesList} id="addressesList" onChange={handleInputChange} placeholder="Addresses list, comma separated" />
              <input type="text" value={amounts} id="amounts" onChange={handleInputChange} placeholder="Amount list, comma separated" />
              <button onClick={handleBatchBurn} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Batch Burn
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleBatchTransferClick} className="card">
            Batch Transfer
          </button>
          {showBatchTransferInput && (
            <div>
              <input type="text" value={addressesList} id="addressesList" onChange={handleInputChange} placeholder="Addresses list, comma separated" />
              <input type="text" value={amounts} id="amounts" onChange={handleInputChange} placeholder="Amount list, comma separated" />
              <button onClick={handleBatchTransfer} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Batch Transfer
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleBurnTokensClick} className="card">
            Burn Tokens
          </button>
          {showBurnTokensInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <input type="text" value={amount} id="amount" onChange={handleInputChange} placeholder="Enter amount" />
              <button onClick={handleBurnTokens} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
              Burn
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleFreezePartialTokensClick} className="card">
            Freeze Partial Tokens
          </button>
          {showFreezePartialTokensInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <input type="text" value={amount} id="amount" onChange={handleInputChange} placeholder="Enter amount" />
              <button onClick={handleFreezePartialTokens} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
              Freeze Partial Tokens
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleMintTokensClick} className="card">
            Mint Tokens
          </button>
          {showMintTokensInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <input type="text" value={amount} id="amount" onChange={handleInputChange} placeholder="Enter amount" />
              <button onClick={handleMintTokens} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
              Mint
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={pauseSmartContract} className="card">
            Pause smart contract
          </button>
        </div>

        <div>
          <button onClick={handleRecoveryAddressClick} className="card">
            Recovery Address
          </button>
          {showRecoveryAddressInput && (
            <div>
              <input type="text" value={lostWalletAddress} id="lostWalletAddress" onChange={handleInputChange} placeholder="Enter lost wallet address" />
              <input type="text" value={newWalletAddress} id="newWalletAddress" onChange={handleInputChange} placeholder="Enter new wallet address" />
              <input type="text" value={investorOnchainID} id="investorOnchainID" onChange={handleInputChange} placeholder="Enter investor OnchainID" />
              <button onClick={handleRecoveryAddress} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Recover
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleTransferTokensClick} className="card">
            Transfer Tokens
          </button>
          {showTransferTokensInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <input type="text" value={amount} id="amount" onChange={handleInputChange} placeholder="Enter amount" />
              <button onClick={handleTransferTokens} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
              Transfer
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleUnfreezePartialTokensClick} className="card">
            Unfreeze Partial Tokens
          </button>
          {showUnfreezePartialTokensInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <input type="text" value={amount} id="amount" onChange={handleInputChange} placeholder="Enter amount" />
              <button onClick={handleUnfreezePartialTokens} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
              Unfreeze Partial Tokens
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={unpauseSmartContract} className="card">
            Unpause smart contract
          </button>
        </div>


      </div>

      <h3>|||Console returns|||</h3>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}>Logged in Successfully!</p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        Web3Auth Google Login
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/custom-authentication/single-verifier-examples/google-no-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fcustom-authentication%2Fsingle-verifier-examples%2Fgoogle-no-modal-example&project-name=w3a-google-no-modal&repository-name=w3a-google-no-modal">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </footer>
    </div>
  );
}

export default App;
