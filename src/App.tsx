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
  const [showGetRoleAdminInput, setShowRoleAdminInput] = useState<boolean>(false);

  const [showSendTransactionInput, setShowSendTransactionInput] = useState<boolean>(false);
  
  const [showHasRoleInTokenInput, setShowHasRoleInTokenInput] = useState<boolean>(false);
  const [showHasRoleInIdentityRegistryInput, setShowHasRoleInIdentityRegistryInput] = useState<boolean>(false);

  const [showIsFrozenInput, setShowIsFrozenInput] = useState<boolean>(false);
  const [showIdentityOfAccountInput, setShowIdentityOfAccountInput] = useState<boolean>(false);
  const [showInvestorCountryInput, setShowInvestorCountryInput] = useState<boolean>(false);

  const [showAccountIsVerifiedInput, setShowAccountIsVerifiedInput] = useState<boolean>(false);

  const [showApproveBalanceInput, setShowApproveBalanceInput] = useState<boolean>(false);

  const [showBatchMintInput, setShowBatchMintInput] = useState<boolean>(false);
  const [showBatchFreezePartialTokensInput, setShowBatchFreezePartialTokensInput] = useState<boolean>(false);
  const [showBatchBurnInput, setShowBatchBurnInput] = useState<boolean>(false);
  const [showBatchSetAddressFrozenInput, setShowBatchSetAddressFrozenInput] = useState<boolean>(false);

  const [showBatchForcedTransferInput, setShowBatchForcedTransferInput] = useState<boolean>(false);
  const [showBatchRegisterIdentityInput, setShowBatchRegisterIdentityInput] = useState<boolean>(false);

  const [showBatchTransferInput, setShowBatchTransferInput] = useState<boolean>(false);
  const [showBatchTransferFromInput, setShowBatchTransferFromInput] = useState<boolean>(false);

  const [showBurnTokensInput, setShowBurnTokensInput] = useState<boolean>(false);

  const [showForcedTransferInput, setShowForcedTransferInput] = useState<boolean>(false);
  const [showDecreaseAllowanceInput, setShowDecreaseAllowanceInput] = useState<boolean>(false);

  const [showFreezePartialTokensInput, setShowFreezePartialTokensInput] = useState<boolean>(false);
  const [showBatchUnfreezePartialTokensInput, setShowBatchUnfreezePartialTokensInput] = useState<boolean>(false);

  const [showIncreaseAllowanceInput, setShowIncreaseAllowanceInput] = useState<boolean>(false);

  const [showMintTokensInput, setShowMintTokensInput] = useState<boolean>(false);
  const [showUnfreezePartialTokensInput, setShowUnfreezePartialTokensInput] = useState<boolean>(false);

  const [showDeleteIdentityInput, setShowDeleteIdentityInput] = useState<boolean>(false);

  const [showRegisterIdentityInput, setShowRegisterIdentityInput] = useState<boolean>(false);

  const [showRenounceRoleInTokenInput, setshowRenounceRoleInTokenInput] = useState<boolean>(false);

  const [showRevokeRoleInTokenInput, setshowRevokeRoleInTokenInput] = useState<boolean>(false);

  const [showGrantRoleInTokenInput, setShowGrantRoleInTokenInput] = useState<boolean>(false);

  const [showGrantRoleInIdentityRegistryInput, setShowGrantRoleInIdentityRegistryInput] = useState<boolean>(false);

  const [showRenounceRoleInIdentityRegistryInput, setShowRenounceRoleInIdentityRegistryInput] = useState<boolean>(false);

  const [showRevokeRoleInIdentityRegistryInput, setShowRevokeRoleInIdentityRegistryInput] = useState<boolean>(false);

  const [showDeployIdentitySmartContractInput, setShowDeployIdentitySmartContractInput] = useState<boolean>(false);

  const [showAddIdentityClaimInput, setShowAddIdentityClaimInput] = useState<boolean>(false);

  const [showRemoveIdentityClaimInput, setShowRemoveIdentityClaimInput] = useState<boolean>(false);

  const [showRevokeIdentityClaimInput, setShowRevokeIdentityClaimInput] = useState<boolean>(false);

  const [showGetClaimDetailsInput, setShowGetClaimDetailsInput] = useState<boolean>(false);

  const [showGetClaimsByTopicInput, setShowGetClaimsByTopicInput] = useState<boolean>(false);

  const [showIsClaimValidInput, setShowIsClaimValidInput] = useState<boolean>(false);

  const [showIsClaimRevokedInput, setShowIsClaimRevokedInput] = useState<boolean>(false);

  const [showUpdateCountryInput, setUpdateCountryInput] = useState<boolean>(false);

  const [showUpdateIdentityInput, setUpdateIdentityInput] = useState<boolean>(false);

  const [showSetAddressFrozenInput, setShowSetAddressFrozen] = useState<boolean>(false);

  const [showTransferTokensInput, setShowTransferTokensInput] = useState<boolean>(false);
  const [showTransferFromInput, setShowTransferFromInput] = useState<boolean>(false);

  const [showSetOnchainIDInput, setShowSetOnchainIDInput] = useState<boolean>(false);

  const [showRecoveryAddressInput, setShowRecoveryAddressInput] = useState<boolean>(false);

  const [showAddAddressIdentityRecoverInput, setShowAddAddressIdentityRecoverInput] = useState<boolean>(false);

  const [showRemoveAddressIdentityRecoverInput, setShowRemoveAddressIdentityRecoverInput] = useState<boolean>(false);


  const [address, setAddress] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [identityAddress, setIdentityAddress] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [claimId, setClaimId] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [ownerAddress, setOwnerAddress] = useState<string>("");
  const [spenderAddress, setSpenderAddress] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [addressesList, setAddressesList] = useState<string>("");
  const [identitiesList, setIdentitiesList] = useState<string>("");
  const [countriesList, setCountriesList] = useState<string>("");
  const [fromList, setFromList] = useState<string>("");
  const [amounts, setAmounts] = useState<string>("");
  const [booleanList, setBooleanList] = useState<string>("");
  const [lostWalletAddress, setLostWalletAddress] = useState<string>("");
  const [newWalletAddress, setNewWalletAddress] = useState<string>("");
  const [investorOnchainID, setInvestorOnchainID] = useState<string>("");
  const [boolValue, setBoolValue] = useState<string>("");
  const [onchainIDValue, setOnchainIDValue] = useState<string>("");


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
    uiConsole("ID Token", idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole("User Info", user);
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
    uiConsole("Chain ID of current blockchain", chainId);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole("Account address", address);
  };

  const getMaticBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole("Matic balance of current account", balance);
  };

  const getMyTokenBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const myTokenBalance = await rpc.getMyTokenBalance();
    uiConsole(myTokenBalance);
  };

  const getTokenAddress = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const tokenAddress = await rpc.getTokenAddress();
    uiConsole("Token address", tokenAddress);
  };

  const getAgentRole = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const agentRole = await rpc.getAgentRole();
    uiConsole("Agent role", agentRole);
  };

  const getDeFaultAdminRole = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const defaultAdminRole = await rpc.getDeFaultAdminRole();
    uiConsole("Default admin role", defaultAdminRole);
  };

  const getOwnerRole = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const ownerRole = await rpc.getOwnerRole();
    uiConsole("Owner role", ownerRole);
  };

  const balanceOf = async (address: string) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.balanceOf(address);
    uiConsole("Balance of", address,"is", balance);
  };

  const smartContractBalanceOf = async (walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.smartContractBalanceOf(walletAddress);
    uiConsole("Token balance of wallet:", walletAddress, "is", balance);
  };

  const smartContractAllowance = async (ownerAddress: any, spenderAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const allowance = await rpc.smartContractAllowance(ownerAddress, spenderAddress);
    uiConsole("Allowance of owner wallet", ownerAddress, "with spender wallet", spenderAddress, "is", allowance);
  };

  const smartContractGetFrozenTokens = async (walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const frozenTokens = await rpc.smartContractGetFrozenTokens(walletAddress);
    uiConsole("Frozen tokens balance of wallet", walletAddress, "is", frozenTokens);
  };

  const smartContractGetRoleAdmin = async (role: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const adminRole = await rpc.smartContractGetRoleAdmin(role);
    uiConsole("Admin role:", adminRole);
  };

  const smartContractHasRoleInToken = async (role: any, walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const hasRole = await rpc.smartContractHasRoleInToken(role, walletAddress);
    uiConsole("The property of role", role, "in wallet", walletAddress, "over the token contract is", hasRole);
  };

  const smartContractHasRoleInIdentityRegistry = async (role: any, walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const hasRole = await rpc.smartContractHasRoleInIdentityRegistry(role, walletAddress);
    uiConsole("The property of role", role, "in wallet", walletAddress, "over the identity registry contract is", hasRole);
  };

  const getCompliance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const compliance = await rpc.getCompliance();
    uiConsole("Compliance address", compliance);
  };

  const getDecimals = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const decimals = await rpc.getDecimals();
    uiConsole("Token decimals", decimals);
  };

  const smartContractIsFrozen = async (walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const isFrozen = await rpc.smartContractIsFrozen(walletAddress);
    uiConsole("Frozen status of wallet", walletAddress, "is", isFrozen);
  };

  const smartContractIdentityOfAccount = async (walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const identityOfAccout = await rpc.smartContractIdentityOfAccount(walletAddress);
    uiConsole(identityOfAccout);
  };

  const smartContractInvestorCountry = async (walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const investorCountry = await rpc.smartContractInvestorCountry(walletAddress);
    uiConsole(investorCountry);
  };

  const smartContractAccountIsVerified = async (walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const accountIsVerified = await rpc.smartContractAccountIsVerified(walletAddress);
    uiConsole(accountIsVerified);
  };

  const smartContractApproveBalance = async (spenderAddress: any, amount: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing approval...");
    const approveBalance = await rpc.smartContractApproveBalance(spenderAddress, amount);
    uiConsole(approveBalance);
  };

  const smartContractBatchFreezePartialTokens = async (addressesList: any, amounts: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    // Split the comma-separated strings into arrays
    const _addressesList = addressesList.split(',');
    const _amounts = amounts.split(',');

    const rpc = new RPC(provider);
    uiConsole("Processing batch freeze partial tokens...");
    const batchFreezePartialTokens = await rpc.smartContractBatchFreezePartialTokens(_addressesList, _amounts);
    uiConsole(batchFreezePartialTokens);
  };

  const smartContractBatchMint = async (addressesList: any, amounts: any) => {
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

  const smartContractBatchSetAddressFrozen = async (addressesList: any, booleanList: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    // Split the comma-separated strings into arrays
    const _addressesList = addressesList.split(',');
    const _booleanList = booleanList.split(',').map((value: string) => value === 'true');

    const rpc = new RPC(provider);
    const batchSetAddressFrozen = await rpc.smartContractBatchSetAddressFrozen(_addressesList, _booleanList);
    uiConsole(batchSetAddressFrozen);
  };

  const smartContractBatchBurn = async (addressesList: any, amounts: any) => {
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

  const smartContractBatchForcedTransfer = async (fromList: any, addressesList: any, amounts: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    // Split the comma-separated strings into arrays
    const _fromList = fromList.split(',');
    const _addressesList = addressesList.split(',');
    const _amounts = amounts.split(',');

    const rpc = new RPC(provider);
    uiConsole("Processing batch forced transfer...");
    const batchForcedTransfer = await rpc.smartContractBatchForcedTransfer(_fromList, _addressesList, _amounts);
    uiConsole(batchForcedTransfer);
  };

  const smartContractBatchRegisterIdentity = async (addressesList: any, identitiesList: any, countriesList: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    // Split the comma-separated strings into arrays
    const _addressesList = addressesList.split(',');
    const _identitiesList = identitiesList.split(',');
    const _countriesList = countriesList.split(',');

    const rpc = new RPC(provider);
    uiConsole("Processing batch register identity...");
    const batchRegisterIdentityTransfer = await rpc.smartContractBatchRegisterIdentity(_addressesList, _identitiesList, _countriesList);
    uiConsole(batchRegisterIdentityTransfer);
  };

  const smartContractBatchTransfer = async (addressesList: any, amounts: any) => {
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

  const smartContractBatchTransferFrom = async (fromList: any, addressesList: any, amounts: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    // Split the comma-separated strings into arrays
    const _fromList = fromList.split(',');
    const _addressesList = addressesList.split(',');
    const _amounts = amounts.split(',');

    const rpc = new RPC(provider);
    uiConsole("Processing batch transfer from...");
    const batchTransferFrom = await rpc.smartContractBatchTransferFrom(_fromList, _addressesList, _amounts);
    uiConsole(batchTransferFrom);
  };

  const smartContractBatchUnfreezePartialTokens = async (addressesList: any, amounts: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    // Split the comma-separated strings into arrays
    const _addressesList = addressesList.split(',');
    const _amounts = amounts.split(',');

    const rpc = new RPC(provider);
    uiConsole("Processing batch unfreeze partial tokens...");
    const batchUnfreezePartialTokens = await rpc.smartContractBatchUnfreezePartialTokens(_addressesList, _amounts);
    uiConsole(batchUnfreezePartialTokens);
  };

  const smartContractBurnTokens = async (walletAddress: any, amount: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing burn tokens...");
    const burnTokens = await rpc.smartContractBurnTokens(walletAddress, amount);
    uiConsole(burnTokens);
  };

  const smartContractForcedTransfer = async (ownerAddress: any, spenderAddress: any, amount: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing forced transfer...");
    const forcedTransfer = await rpc.smartContractForcedTransfer(ownerAddress, spenderAddress, amount);
    uiConsole(forcedTransfer);
  };

  const smartContractDecreaseAllowance = async (spenderAddress: any, amount: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing decrease allowance...");
    const decreaseAllowance = await rpc.smartContractDecreaseAllowance(spenderAddress, amount);
    uiConsole(decreaseAllowance);
  };

  const smartContractFreezePartialTokens = async (walletAddress: any, amount: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing partial tokens freeze...");
    const partialTokenFreeze = await rpc.smartContractFreezePartialTokens(walletAddress, amount);
    uiConsole(partialTokenFreeze);
  };

  const smartContractIncreaseAllowance = async (spenderAddress: any, amount: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing increase allowance...");
    const increasellowance = await rpc.smartContractIncreaseAllowance(spenderAddress, amount);
    uiConsole(increasellowance);
  };

  const smartContractMintTokens = async (walletAddress: any, amount: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing mint tokens...");
    const mintTokens = await rpc.smartContractMintTokens(walletAddress, amount);
    uiConsole(mintTokens);
  };

  const smartContractRecoveryAddress = async (lostWalletAddress: any, newWalletAddress: any, investorOnchainID: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing recovery address...");
    const recoveryAddress = await rpc.smartContractRecoveryAddress(lostWalletAddress, newWalletAddress, investorOnchainID);
    uiConsole(recoveryAddress);
  };

  const smartContractAddAddressIdentityRecover = async (lostWalletAddress: any, newWalletAddress: any, investorOnchainID: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing add address for recovery...");
    const addAddressForRecovery = await rpc.smartContractAddAddressIdentityRecover(lostWalletAddress, newWalletAddress, investorOnchainID);
    uiConsole(addAddressForRecovery);
  };

  const smartContractRemoveAddressIdentityRecover = async (lostWalletAddress: any, investorOnchainID: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing remove address for recovery...");
    const removeAddressForRecovery = await rpc.smartContractRemoveAddressIdentityRecover(lostWalletAddress, investorOnchainID);
    uiConsole(removeAddressForRecovery);
  };

  const smartContractRenounceRoleInToken = async (role: any, walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing renounce role...");
    const renounceRole = await rpc.smartContractRenounceRoleInToken(role, walletAddress);
    uiConsole(renounceRole);
  };

  const smartContractRevokeRoleInToken = async (role: any, walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing revoke role...");
    const revokeRole = await rpc.smartContractRevokeRoleInToken(role, walletAddress);
    uiConsole(revokeRole);
  };

  const smartContractGrantRoleInToken = async (role: any, walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing grant role...");
    const grantRoleInToken = await rpc.smartContractGrantRoleInToken(role, walletAddress);
    uiConsole(grantRoleInToken);
  };

  const smartContractGrantRoleInIdentityRegistry = async (role: any, walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing grant role...");
    const grantRoleInIdentityRegistry = await rpc.smartContractGrantRoleInIdentityRegistry(role, walletAddress);
    uiConsole(grantRoleInIdentityRegistry);
  };

  const smartContractRenounceRoleInIdentityRegistry = async (role: any, walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing renounce role...");
    const renounceRoleInIdentityRegistry = await rpc.smartContractRenounceRoleInIdentityRegistry(role, walletAddress);
    uiConsole(renounceRoleInIdentityRegistry);
  };

  const smartContractRevokeRoleInIdentityRegistry = async (role: any, walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing revoke role...");
    const revokeRoleInIdentityRegistry = await rpc.smartContractRevokeRoleInIdentityRegistry(role, walletAddress);
    uiConsole(revokeRoleInIdentityRegistry);
  };

  const deployIdentitySmartContract = async (walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing identity smart contract deployment...");
    const deployidentitySmartContract = await rpc.deployIdentitySmartContract(walletAddress);
    uiConsole(deployidentitySmartContract);
  };

  const addIdentityClaim = async (identityAddress: any, topic: any, data:any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing add identity claim...");
    const addIdentityClaim = await rpc.addIdentityClaimSmartContract(identityAddress, topic, data);
    uiConsole(addIdentityClaim);
  };

  const revokeIdentityClaim = async (identityAddress: any, claimId: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing revoke identity claim...");
    const revokeIdentityClaim = await rpc.revokeIdentityClaimSmartContract(identityAddress, claimId);
    uiConsole(revokeIdentityClaim);
  };

  const removeIdentityClaim = async (identityAddress: any, claimId: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing remove identity claim...");
    const removeIdentityClaim = await rpc.removeIdentityClaimSmartContract(identityAddress, claimId);
    uiConsole(removeIdentityClaim);
  };

  const getClaimDetails = async (identityAddress: any, claimId: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const getClaimDetails = await rpc.getClaimDetailsClaimSmartContract(identityAddress, claimId);
    uiConsole(getClaimDetails);
  };

  const getClaimsByTopic = async (identityAddress: any, topic: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const getClaimsByTopic = await rpc.smartContractGetClaimsByTopic(identityAddress, topic);
    uiConsole(getClaimsByTopic);
  };

  const isClaimValid = async (identityAddress: any, topic: any, signature: any, data:any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const isClaimValid = await rpc.smartContractIsClaimValid(identityAddress, topic, signature, data);
    uiConsole(isClaimValid);
  };

  const isClaimRevoked = async (signature: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const isClaimRevoked = await rpc.smartContractIsClaimRevoked(signature);
    uiConsole(isClaimRevoked);
  };

  const smartContractUpdateCountry = async (walletAddress: any, country: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing update country...");
    const updateCountry = await rpc.smartContractUpdateCountry(walletAddress, country);
    uiConsole(updateCountry);
  };

  const smartContractUpdateIdentity = async (walletAddress: any, identityAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing update identity...");
    const updateIdentity = await rpc.smartContractUpdateIdentity(walletAddress, identityAddress);
    uiConsole(updateIdentity);
  };

  const smartContractSetAddressFrozen = async (walletAddress: any, boolValue: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    var _boolValue = (boolValue === 'true');
    const rpc = new RPC(provider);
    uiConsole("Processing set address frozen...");
    const setAddressFrozen = await rpc.smartContractSetAddressFrozen(walletAddress, _boolValue);
    uiConsole(setAddressFrozen);
  };

  const smartContractSetOnchainID = async (onchainIDValue: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing set Onchain ID...");
    const setOnchainID = await rpc.smartContractSetOnchainID(onchainIDValue);
    uiConsole(setOnchainID);
  };

  const smartContractTransferTokens = async (walletAddress: any, amount: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing tokens transfer...");
    const tokenTransfer = await rpc.smartContractTransferTokens(walletAddress, amount);
    uiConsole(tokenTransfer);
  };

  const smartContractTransferFrom = async (ownerAddress: any, walletAddress: any, amount: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing transfer from ...");
    const transferFrom = await rpc.smartContractTransferFrom(ownerAddress, walletAddress, amount);
    uiConsole(transferFrom);
  };

  const smartContractUnfreezePartialTokens = async (walletAddress: any, amount: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing partial tokens unfreeze...");
    const partialTokenUnfreeze = await rpc.smartContractUnfreezePartialTokens(walletAddress, amount);
    uiConsole(partialTokenUnfreeze);
  };

  const smartContractDeleteIdentity = async (walletAddress: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing delete identity...");
    const deleteIdentity = await rpc.smartContractDeleteIdentity(walletAddress);
    uiConsole(deleteIdentity);
  };

  const smartContractRegisterIdentity = async (walletAddress: any, identityAddress: any, country: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing register identity...");
    const registerIdentity = await rpc.smartContractRegisterIdentity(walletAddress, identityAddress, country);
    uiConsole(registerIdentity);
  };

  const getIdentityRegistry = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const identityRegistry = await rpc.getIdentityRegistry();
    uiConsole("Identity registry address", identityRegistry);
  };

  const getName = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const name = await rpc.getName();
    uiConsole("Name of token contract", name);
  };

  const getOnchainID = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const onchainID = await rpc.getOnchainID();
    uiConsole("On-chain ID of token", onchainID);
  };

  const getIsPaused = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const isPaused = await rpc.getIsPaused();
    uiConsole("Paused status of smart contract", isPaused);
  };

  const getSymbol = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const symbol = await rpc.getSymbol();
    uiConsole("Smart contract symbol", symbol);
  };

  const pauseSmartContract = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Pausing smart contract...");
    const pause = await rpc.smartContractPause();
    uiConsole(pause);
  };

  const unpauseSmartContract = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Unpausing smart contract...");
    const unpause = await rpc.smartContractUnpause();
    uiConsole(unpause);
  };

  const getTotalSupply = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const totalSupply = await rpc.getTotalSupply();
    uiConsole("Total supply of tokens", totalSupply);
  };

  const sendTransaction = async (walletAddresss:any, amount:any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    uiConsole("Processing send transaction...");
    const receipt = await rpc.sendTransaction(walletAddresss, amount);
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole("Default signed message", signedMessage);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    uiConsole("Private key", privateKey);
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
    else if (event.target.id === 'role') {
      setRole(event.target.value);
    }
    else if (event.target.id === 'amount') {
      setAmount(event.target.value);
    }
    else if (event.target.id === 'fromList') {
      setFromList(event.target.value);
    }
    else if (event.target.id === 'addressesList') {
      setAddressesList(event.target.value);
    }
    else if (event.target.id === 'booleanList') {
      setBooleanList(event.target.value);
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
    else if (event.target.id === 'boolValue') {
      setBoolValue(event.target.value);
    }
    else if (event.target.id === 'onchainIDValue') {
      setOnchainIDValue(event.target.value);
    }
    else if (event.target.id === 'identityAddress') {
      setIdentityAddress(event.target.value);
    }
    else if (event.target.id === 'country') {
      setCountry(event.target.value);
    }
    else if (event.target.id === 'identitiesList') {
      setIdentitiesList(event.target.value);
    }
    else if (event.target.id === 'countriesList') {
      setCountriesList(event.target.value);
    }
    else if (event.target.id === 'topic') {
      setTopic(event.target.value);
    }
    else if (event.target.id === 'data') {
      setData(event.target.value);
    }
    else if (event.target.id === 'claimId') {
      setClaimId(event.target.value);
    }
    else if (event.target.id === 'signature') {
      setSignature(event.target.value);
    }
  };

  const handleCheckBalance = () => {
    balanceOf(address);
    //setAddress("");
  };

  const handleMaticBalanceOfClick = () => {
    setShowMaticInput(!showMaticInput); // Toggle Matic input visibility
    setAddress("");
  };

  const handleTokenBalanceOfClick = () => {
    setShowTokenInput(!showTokenInput); // Toggle Token input visibility
    setWalletAddress("");
  };

  const handleSendTransactionClick = () => {
    setShowSendTransactionInput(!showSendTransactionInput); // Toggle Token input visibility
    setWalletAddress("");
    setAmount("");
  };
  
  const handleSendTransaction = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    sendTransaction(walletAddress, amount);
    //setWalletAddress("");
    //setAmount("");
  };
  
  const handleCheckSmartContractBalance = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    smartContractBalanceOf(walletAddress);
    //setWalletAddress("");
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
    //setOwnerAddress("");
    //setSpenderAddress("");
  };

  const handleGetFrozenTokensClick = () => {
    setShowGetFrozenTokensInput(!showGetFrozenTokensInput); // Toggle Token input visibility
    setWalletAddress("");
  };

  const handleGetFrozenTokens = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    smartContractGetFrozenTokens(walletAddress);
    //setWalletAddress("");
  };

  const handleGetRoleAdminClick = () => {
    setShowRoleAdminInput(!showGetRoleAdminInput); // Toggle Token input visibility
    setRole("");
  };

  const handleGetRoleAdmin = () => {
    const role = (document.getElementById('role') as HTMLInputElement).value;
    smartContractGetRoleAdmin(role);
    //setRole("");
  };

  const handleHasRoleInTokenClick = () => {
    setShowHasRoleInTokenInput(!showHasRoleInTokenInput); // Toggle Token input visibility
    setRole("");
    setWalletAddress("");
  };

  const handleHasRoleInToken = () => {
    const role = (document.getElementById('role') as HTMLInputElement).value;
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;

    smartContractHasRoleInToken(role, walletAddress);
    //setRole("");
    //setWalletAddress("");
  };

  const handleHasRoleInIdentityRegistryClick = () => {
    setShowHasRoleInIdentityRegistryInput(!showHasRoleInIdentityRegistryInput); // Toggle Token input visibility
    setRole("");
    setWalletAddress("");
  };

  const handleHasRoleInIdentityRegistry = () => {
    const role = (document.getElementById('role') as HTMLInputElement).value;
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;

    smartContractHasRoleInIdentityRegistry(role, walletAddress);
    //setRole("");
    //setWalletAddress("");
  };

  const handleIsFrozenClick = () => {
    setShowIsFrozenInput(!showIsFrozenInput); // Toggle Token input visibility
    setWalletAddress("");
  };

  const handleIsFrozen = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    smartContractIsFrozen(walletAddress);
    //setWalletAddress("");
  };

  const handleIdentityOfAccountClick = () => {
    setShowIdentityOfAccountInput(!showIdentityOfAccountInput); // Toggle Token input visibility
    setWalletAddress("");
  };

  const handleIdentityOfAccount = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    smartContractIdentityOfAccount(walletAddress);
    //setWalletAddress("");
  };

  const handleInvestorCountryClick = () => {
    setShowInvestorCountryInput(!showInvestorCountryInput); // Toggle Token input visibility
    setWalletAddress("");
  };

  const handleInvestorCountry = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    smartContractInvestorCountry(walletAddress);
    //setWalletAddress("");
  };

  const handleAccountIsVerifiedClick = () => {
    setShowAccountIsVerifiedInput(!showAccountIsVerifiedInput); // Toggle Token input visibility
    setWalletAddress("");
  };

  const handleAccountIsVerified = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    smartContractAccountIsVerified(walletAddress);
    //setWalletAddress("");
  };
  const handleApproveBalanceClick = () => {
    setShowApproveBalanceInput(!showApproveBalanceInput); // Toggle Token input visibility
    setSpenderAddress("");
    setAmount("");
  };

  const handleApproveBalance = () => {
    const spenderAddress = (document.getElementById('spenderAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    smartContractApproveBalance(spenderAddress, amount);
    ////setSpenderAddress("");
    //setAmount("");
  };

  const handleBatchFreezePartialTokensClick = () => {
    setShowBatchFreezePartialTokensInput(!showBatchFreezePartialTokensInput); // Toggle Token input visibility
    setAddressesList("");
    setAmounts("");
  };

  const handleBatchFreezePartialTokens = () => {
    const addressesList = (document.getElementById('addressesList') as HTMLInputElement).value;
    const amounts = (document.getElementById('amounts') as HTMLInputElement).value;
    smartContractBatchFreezePartialTokens(addressesList, amounts);
    //setAddressesList("");
    //setAmounts("");
  };

  const handleBatchMintClick = () => {
    setShowBatchMintInput(!showBatchMintInput); // Toggle Token input visibility
    setAddressesList("");
    setAmounts("");
  };

  const handleBatchMint = () => {
    const addressesList = (document.getElementById('addressesList') as HTMLInputElement).value;
    const amounts = (document.getElementById('amounts') as HTMLInputElement).value;
    smartContractBatchMint(addressesList, amounts);
    //setAddressesList("");
    //setAmounts("");
  };

  const handleBatchSetAddressFrozenClick = () => {
    setShowBatchSetAddressFrozenInput(!showBatchSetAddressFrozenInput); // Toggle Token input visibility
    setAddressesList("");
    setBooleanList("");
  };

  const handleBatchSetAddressFrozen = () => {
    const addressesList = (document.getElementById('addressesList') as HTMLInputElement).value;
    const booleanList = (document.getElementById('booleanList') as HTMLInputElement).value;
    smartContractBatchSetAddressFrozen(addressesList, booleanList);
    //setAddressesList("");
    //setBooleanList("");
  };

  const handleBatchBurnClick = () => {
    setShowBatchBurnInput(!showBatchBurnInput); // Toggle Token input visibility
    setAddressesList("");
    setAmounts("");
  };

  const handleBatchBurn = () => {
    const addressesList = (document.getElementById('addressesList') as HTMLInputElement).value;
    const amounts = (document.getElementById('amounts') as HTMLInputElement).value;
    smartContractBatchBurn(addressesList, amounts);
    //setAddressesList("");
    //setAmounts("");
  };

  const handleBatchForcedTransferClick = () => {
    setShowBatchForcedTransferInput(!showBatchForcedTransferInput); // Toggle Token input visibility
    setFromList("");
    setAddressesList("");
    setAmounts("");
  };

  const handleBatchForcedTransfer = () => {
    const fromList = (document.getElementById('fromList') as HTMLInputElement).value;
    const addressesList = (document.getElementById('addressesList') as HTMLInputElement).value;
    const amounts = (document.getElementById('amounts') as HTMLInputElement).value;
    smartContractBatchForcedTransfer(fromList, addressesList, amounts);
    //setFromList("");
    //setAddressesList("");
    //setAmounts("");
  };

  const handleBatchRegisterIdentityClick = () => {
    setShowBatchRegisterIdentityInput(!showBatchRegisterIdentityInput); // Toggle Token input visibility
    setAddressesList("");
    setIdentitiesList("");
    setCountriesList("");
  };

  const handleBatchRegisterIdentity = () => {
    const addressesList = (document.getElementById('addressesList') as HTMLInputElement).value;
    const identitiesList = (document.getElementById('identitiesList') as HTMLInputElement).value;
    const countriesList = (document.getElementById('countriesList') as HTMLInputElement).value;
    smartContractBatchRegisterIdentity(addressesList, identitiesList, countriesList);
    //setAddressesList("");
    //setIdentitiesList("");
    //setCountriesList("");
  };

  const handleBatchTransferClick = () => {
    setShowBatchTransferInput(!showBatchTransferInput); // Toggle Token input visibility
    setAddressesList("");
    setAmounts("");
  };

  const handleBatchTransfer = () => {
    const addressesList = (document.getElementById('addressesList') as HTMLInputElement).value;
    const amounts = (document.getElementById('amounts') as HTMLInputElement).value;
    smartContractBatchTransfer(addressesList, amounts);
    //setAddressesList("");
    //setAmounts("");
  };

  const handleBatchTransferFromClick = () => {
    setShowBatchTransferFromInput(!showBatchTransferFromInput); // Toggle Token input visibility
    setFromList("");
    setAddressesList("");
    setAmounts("");
  };

  const handleBatchTransferFrom = () => {
    const fromList = (document.getElementById('fromList') as HTMLInputElement).value;
    const addressesList = (document.getElementById('addressesList') as HTMLInputElement).value;
    const amounts = (document.getElementById('amounts') as HTMLInputElement).value;
    smartContractBatchTransferFrom(fromList, addressesList, amounts);
    //setFromList("");
    //setAddressesList("");
    //setAmounts("");
  };

  const handleBatchUnfreezePartialTokensClick = () => {
    setShowBatchUnfreezePartialTokensInput(!showBatchUnfreezePartialTokensInput); // Toggle Token input visibility
    setAddressesList("");
    setAmounts("");
  };

  const handleBatchUnfreezePartialTokens = () => {
    const addressesList = (document.getElementById('addressesList') as HTMLInputElement).value;
    const amounts = (document.getElementById('amounts') as HTMLInputElement).value;
    smartContractBatchUnfreezePartialTokens(addressesList, amounts);
    //setAddressesList("");
    //setAmounts("");
  };

  const handleBurnTokensClick = () => {
    setShowBurnTokensInput(!showBurnTokensInput); // Toggle Token input visibility
    setWalletAddress("");
    setAmount("");
  };

  const handleBurnTokens = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    smartContractBurnTokens(walletAddress, amount);
    //setWalletAddress("");
    //setAmount("");
  };

  const handleForcedTransferClick = () => {
    setShowForcedTransferInput(!showForcedTransferInput); // Toggle Token input visibility
    setOwnerAddress("");
    setSpenderAddress("");
    setAmount("");
  };

  const handleForcedTransfer = () => {
    const ownerAddress = (document.getElementById('ownerAddress') as HTMLInputElement).value;
    const spenderAddress = (document.getElementById('spenderAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    smartContractForcedTransfer(ownerAddress, spenderAddress, amount);
    //setSpenderAddress("");
    //setAmount("");
  };

  const handleDecreaseAllowanceClick = () => {
    setShowDecreaseAllowanceInput(!showDecreaseAllowanceInput); // Toggle Token input visibility
    setSpenderAddress("");
    setAmount("");
  };

  const handleDecreaseAllowance = () => {
    const spenderAddress = (document.getElementById('spenderAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    smartContractDecreaseAllowance(spenderAddress, amount);
    //setSpenderAddress("");
    //setAmount("");
  };

  const handleFreezePartialTokensClick = () => {
    setShowFreezePartialTokensInput(!showFreezePartialTokensInput); // Toggle Token input visibility
    setWalletAddress("");
    setAmount("");
  };

  const handleFreezePartialTokens = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    smartContractFreezePartialTokens(walletAddress, amount);
    //setWalletAddress("");
    //setAmount("");
  };

  const handleIncreaseAllowanceClick = () => {
    setShowIncreaseAllowanceInput(!showIncreaseAllowanceInput); // Toggle Token input visibility
    setSpenderAddress("");
    setAmount("");
  };

  const handleIncreaseAllowance = () => {
    const spenderAddress = (document.getElementById('spenderAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    smartContractIncreaseAllowance(spenderAddress, amount);
    //setSpenderAddress("");
    //setAmount("");
  };

  const handleMintTokensClick = () => {
    setShowMintTokensInput(!showMintTokensInput); // Toggle Token input visibility
    setWalletAddress("");
    setAmount("");
  };

  const handleMintTokens = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    smartContractMintTokens(walletAddress, amount);
    //setWalletAddress("");
    //setAmount("");
  };

  const handleRecoveryAddressClick = () => {
    setShowRecoveryAddressInput(!showRecoveryAddressInput); // Toggle Token input visibility
    setLostWalletAddress("");
    setNewWalletAddress("");
    setInvestorOnchainID("");
  };

  const handleRecoveryAddress = () => {
    const lostWalletAddress = (document.getElementById('lostWalletAddress') as HTMLInputElement).value;
    const newWalletAddress = (document.getElementById('newWalletAddress') as HTMLInputElement).value;
    const investorOnchainID = (document.getElementById('investorOnchainID') as HTMLInputElement).value;

    smartContractRecoveryAddress(lostWalletAddress, newWalletAddress, investorOnchainID);
    //setLostWalletAddress("");
    //setNewWalletAddress("");
    //setInvestorOnchainID("");
  };

  const handleAddAddressIdentityRecoverClick = () => {
    setShowAddAddressIdentityRecoverInput(!showAddAddressIdentityRecoverInput); // Toggle Token input visibility
    setLostWalletAddress("");
    setNewWalletAddress("");
    setInvestorOnchainID("");
  };

  const handleAddAddressIdentityRecover = () => {
    const lostWalletAddress = (document.getElementById('lostWalletAddress') as HTMLInputElement).value;
    const newWalletAddress = (document.getElementById('newWalletAddress') as HTMLInputElement).value;
    const investorOnchainID = (document.getElementById('investorOnchainID') as HTMLInputElement).value;

    smartContractAddAddressIdentityRecover(lostWalletAddress, newWalletAddress, investorOnchainID);
    //setLostWalletAddress("");
    //setNewWalletAddress("");
    //setInvestorOnchainID("");
  };
  
  const handleRemoveAddressIdentityRecoverClick = () => {
    setShowRemoveAddressIdentityRecoverInput(!showRemoveAddressIdentityRecoverInput); // Toggle Token input visibility
    setLostWalletAddress("");
    setInvestorOnchainID("");
  };

  const handleRemoveAddressIdentityRecover = () => {
    const lostWalletAddress = (document.getElementById('lostWalletAddress') as HTMLInputElement).value;
    const investorOnchainID = (document.getElementById('investorOnchainID') as HTMLInputElement).value;
    
    smartContractRemoveAddressIdentityRecover(lostWalletAddress, investorOnchainID);
    //setLostWalletAddress("");
    //setInvestorOnchainID("");
  };

  const handleRenounceRoleInTokenClick = () => {
    setshowRenounceRoleInTokenInput(!showRenounceRoleInTokenInput); // Toggle Token input visibility
    setRole("");
    setWalletAddress("");
  };

  const handleRenounceRoleInToken = () => {
    const role = (document.getElementById('role') as HTMLInputElement).value;
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    smartContractRenounceRoleInToken(role, walletAddress);
    //setRole("");
    //setWalletAddress("");
  };

  const handleRevokeRoleInTokenClick = () => {
    setshowRevokeRoleInTokenInput(!showRevokeRoleInTokenInput); // Toggle Token input visibility
    setRole("");
    setWalletAddress("");
  };

  const handleRevokeRoleInToken = () => {
    const role = (document.getElementById('role') as HTMLInputElement).value;
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    smartContractRevokeRoleInToken(role, walletAddress);
    //setRole("");
    //setWalletAddress("");
  };

  const handleGrantRoleInTokenClick = () => {
    setShowGrantRoleInTokenInput(!showGrantRoleInTokenInput); // Toggle Token input visibility
    setRole("");
    setWalletAddress("");
  };

  const handleGrantRoleInToken = () => {
    const role = (document.getElementById('role') as HTMLInputElement).value;
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    smartContractGrantRoleInToken(role, walletAddress);
    //setRole("");
    //setWalletAddress("");
  };

  const handleGrantRoleInIdentityRegistryClick = () => {
    setShowGrantRoleInIdentityRegistryInput(!showGrantRoleInIdentityRegistryInput); // Toggle Token input visibility
    setRole("");
    setWalletAddress("");
  };

  const handleGrantRoleInIdentityRegistry = () => {
    const role = (document.getElementById('role') as HTMLInputElement).value;
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    smartContractGrantRoleInIdentityRegistry(role, walletAddress);
    //setRole("");
    //setWalletAddress("");
  };

  const handleRenounceRoleInIdentityRegistryClick = () => {
    setShowRenounceRoleInIdentityRegistryInput(!showRenounceRoleInIdentityRegistryInput); // Toggle Token input visibility
    setRole("");
    setWalletAddress("");
  };

  const handleRenounceRoleInIdentityRegistry = () => {
    const role = (document.getElementById('role') as HTMLInputElement).value;
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    smartContractRenounceRoleInIdentityRegistry(role, walletAddress);
    //setRole("");
    //setWalletAddress("");
  };

  const handleRevokeRoleInIdentityRegistryClick = () => {
    setShowRevokeRoleInIdentityRegistryInput(!showRevokeRoleInIdentityRegistryInput); // Toggle Token input visibility
    setRole("");
    setWalletAddress("");
  };

  const handleRevokeRoleInIdentityRegistry = () => {
    const role = (document.getElementById('role') as HTMLInputElement).value;
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    smartContractRevokeRoleInIdentityRegistry(role, walletAddress);
    //setRole("");
    //setWalletAddress("");
  };

  const handleDeployIdentitySmartContractClick = () => {
    setShowDeployIdentitySmartContractInput(!showDeployIdentitySmartContractInput); // Toggle Token input visibility
    setWalletAddress("");
  };

  const handleDeployIdentitySmartContract = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    deployIdentitySmartContract(walletAddress);
    //setWalletAddress("");
  };

  const handleAddIdentityClaimClick = () => {
    setShowAddIdentityClaimInput(!showAddIdentityClaimInput); // Toggle Token input visibility
    setIdentityAddress("");
    setTopic("");
    setData("");
  };

  const handleAddIdentityClaim = () => {
    const identityAddress = (document.getElementById('identityAddress') as HTMLInputElement).value;
    const topic = (document.getElementById('topic') as HTMLInputElement).value;
    const data = (document.getElementById('data') as HTMLInputElement).value;
    addIdentityClaim(identityAddress, topic, data);
    //setIdentityAddress("");
    //setTopic("");
    //setData("");
  };

  const handleRevokeIdentityClaimClick = () => {
    setShowRevokeIdentityClaimInput(!showRevokeIdentityClaimInput); // Toggle Token input visibility
    setClaimId("");
    setIdentityAddress("");
  };

  const handleRevokeIdentityClaim= () => {
    const identityAddress = (document.getElementById('identityAddress') as HTMLInputElement).value;
    const claimId = (document.getElementById('claimId') as HTMLInputElement).value;
    revokeIdentityClaim(identityAddress, claimId);
    //setIdentityAddress("");
    //setClaimId("");
  };

  const handleRemoveIdentityClaimClick = () => {
    setShowRemoveIdentityClaimInput(!showRemoveIdentityClaimInput); // Toggle Token input visibility
    setClaimId("");
    setIdentityAddress("");
  };

  const handleRemoveIdentityClaim= () => {
    const identityAddress = (document.getElementById('identityAddress') as HTMLInputElement).value;
    const claimId = (document.getElementById('claimId') as HTMLInputElement).value;
    removeIdentityClaim(identityAddress, claimId);
    //setIdentityAddress("");
    //setClaimId("");
  };

  const handleGetClaimDetailsClick = () => {
    setShowGetClaimDetailsInput(!showGetClaimDetailsInput); // Toggle Token input visibility
    setIdentityAddress("");
    setClaimId("");
  };

  const handleGetClaimDetails = () => {
    const identityAddress = (document.getElementById('identityAddress') as HTMLInputElement).value;
    const claimId = (document.getElementById('claimId') as HTMLInputElement).value;
    getClaimDetails(identityAddress, claimId);
    //setIdentityAddress("");
    //setClaimId("");
  };

  const handleGetClaimsByTopicClick = () => {
    setShowGetClaimsByTopicInput(!showGetClaimsByTopicInput); // Toggle Token input visibility
    setIdentityAddress("");
    setTopic("");
  };

  const handleGetClaimsByTopic = () => {
    const identityAddress = (document.getElementById('identityAddress') as HTMLInputElement).value;
    const topic = (document.getElementById('topic') as HTMLInputElement).value;
    getClaimsByTopic(identityAddress, topic);
    //setIdentityAddress("");
    //setTopic("");
  };

  const handleIsClaimValidClick = () => {
    setShowIsClaimValidInput(!showIsClaimValidInput); // Toggle Token input visibility
    setIdentityAddress("");
    setTopic("");
    setSignature("");
    setData("");
  };

  const handleIsClaimValid = () => {
    const identityAddress = (document.getElementById('identityAddress') as HTMLInputElement).value;
    const topic = (document.getElementById('topic') as HTMLInputElement).value;
    const signature = (document.getElementById('signature') as HTMLInputElement).value;
    const data = (document.getElementById('data') as HTMLInputElement).value;
    
    isClaimValid(identityAddress, topic, signature, data);

    //setIdentityAddress("");
    //setTopic("");
    //setSignature("");
    //setData("");
  };
  
  const handleIsClaimRevokedClick = () => {
    setShowIsClaimRevokedInput(!showIsClaimRevokedInput); // Toggle Token input visibility
    setSignature("");
  };

  const handleIsClaimRevoked= () => {
    const signature = (document.getElementById('signature') as HTMLInputElement).value;
    isClaimRevoked(signature);
    //setSignature("");
  };
  
  const handleUpdateCountryClick = () => {
    setUpdateCountryInput(!showUpdateCountryInput); // Toggle Token input visibility
    setWalletAddress("");
    setCountry("");
  };

  const handleUpdateCountry = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    const country = (document.getElementById('country') as HTMLInputElement).value;
    smartContractUpdateCountry(walletAddress, country);
    //setWalletAddress("");
    //setCountry("");
  };

  const handleUpdateIdentityClick = () => {
    setUpdateIdentityInput(!showUpdateIdentityInput); // Toggle Token input visibility
    setWalletAddress("");
    setIdentityAddress("");
  };

  const handleUpdateIdentity = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    const identityAddress = (document.getElementById('identityAddress') as HTMLInputElement).value;
    smartContractUpdateIdentity(walletAddress, identityAddress);
    //setWalletAddress("");
    //setIdentityAddress("");
  };

  const handleSetAddressFrozenClick = () => {
    setShowSetAddressFrozen(!showSetAddressFrozenInput); // Toggle Token input visibility
    setWalletAddress("");
    setBoolValue("");
  };

  const handleSetAddressFrozen = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    const boolValue = (document.getElementById('boolValue') as HTMLInputElement).value;

    smartContractSetAddressFrozen(walletAddress, boolValue);
    //setWalletAddress("");
    //setBoolValue("");
  };

  const handleSetOnchainIDClick = () => {
    setShowSetOnchainIDInput(!showSetOnchainIDInput); // Toggle Token input visibility
    setOnchainIDValue("");
  };

  const handleSetOnchainID = () => {
    const onchainIDValue = (document.getElementById('onchainIDValue') as HTMLInputElement).value;
    smartContractSetOnchainID(onchainIDValue);
    //setOnchainIDValue("");
  };


  const handleTransferTokensClick = () => {
    setShowTransferTokensInput(!showTransferTokensInput); // Toggle Token input visibility
    setWalletAddress("");
    setAmount("");
  };

  const handleTransferTokens = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    smartContractTransferTokens(walletAddress, amount);
    //setWalletAddress("");
    //setAmount("");
  };

  const handleTransferFromClick = () => {
    setShowTransferFromInput(!showTransferFromInput); // Toggle Token input visibility
    setOwnerAddress("");
    setWalletAddress("");
    setAmount("");
  };

  const handleTransferFrom = () => {
    const ownerAddress = (document.getElementById('ownerAddress') as HTMLInputElement).value;
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    smartContractTransferFrom(ownerAddress, walletAddress, amount);
    //setOwnerAddress("");
    //setWalletAddress("");
    //setAmount("");
  };

  const handleUnfreezePartialTokensClick = () => {
    setShowUnfreezePartialTokensInput(!showUnfreezePartialTokensInput); // Toggle Token input visibility
    setWalletAddress("");
    setAmount("");
  };

  const handleUnfreezePartialTokens = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    const amount = (document.getElementById('amount') as HTMLInputElement).value;
    smartContractUnfreezePartialTokens(walletAddress, amount);
    //setWalletAddress("");
    //setAmount("");
  };

  const handleDeleteIdentityClick = () => {
    setShowDeleteIdentityInput(!showDeleteIdentityInput); // Toggle Token input visibility
    setWalletAddress("");
    setAmount("");
  };

  const handleDeleteIdentity = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    smartContractDeleteIdentity(walletAddress);
    //setWalletAddress("");
  };

  const handleRegisterIdentityClick = () => {
    setShowRegisterIdentityInput(!showRegisterIdentityInput); // Toggle Token input visibility
    setWalletAddress("");
    setIdentityAddress("");
    setCountry("");
  };

  const handleRegisterIdentity = () => {
    const walletAddress = (document.getElementById('walletAddress') as HTMLInputElement).value;
    const identityAddress = (document.getElementById('identityAddress') as HTMLInputElement).value;
    const country = (document.getElementById('country') as HTMLInputElement).value;
    smartContractRegisterIdentity(walletAddress, identityAddress, country);
    //setWalletAddress("");
    //setIdentityAddress("");
    //setCountry("");
  };




  const loggedInView = (
    <>
      <h3>Web3Auth Functions</h3>
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
            Get Account Address
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
          <button onClick={handleSendTransactionClick} className="card">
            Send Transaction
          </button>
          {showSendTransactionInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter address" />
              <input type="text" value={amount} id="amount" onChange={handleInputChange} placeholder="Enter amount" />
              <button onClick={handleSendTransaction} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
              Send Transaction
              </button>
            </div>
          )}
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

      <h3>Token Smart Contract Read Functions</h3>

      <div className="flex-container">

      <div>
          <button onClick={getMyTokenBalance} className="card">
            My Token Balance
          </button>
        </div>

      <div>
          <button onClick={getTokenAddress} className="card">
            Get Token Address
          </button>
        </div>

        <div>
          <button onClick={getAgentRole} className="card">
            Get Agent Role
          </button>
        </div>

        <div>
          <button onClick={getDeFaultAdminRole} className="card">
            Get Default Admin Role
          </button>
        </div>

        <div>
          <button onClick={getOwnerRole} className="card">
            Get Owner Role
          </button>
        </div>

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
          <button onClick={handleGetRoleAdminClick} className="card">
            Get Role Admin
          </button>
          {showGetRoleAdminInput && (
            <div>
              <input type="text" value={role} id="role" onChange={handleInputChange} placeholder="Enter role" />
              <button onClick={handleGetRoleAdmin} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Get Role Admin
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleHasRoleInTokenClick} className="card">
            Has Role in Token
          </button>
          {showHasRoleInTokenInput && (
            <div>
              <input type="text" value={role} id="role" onChange={handleInputChange} placeholder="Enter role" />
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <button onClick={handleHasRoleInToken} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Has Role in Token
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={getIdentityRegistry} className="card">
            Get Identity Registry
          </button>
        </div>

        <div>
          <button onClick={handleIsFrozenClick} className="card">
            Is Frozen
          </button>
          {showIsFrozenInput && (
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

      <h3>Token Smart Contract Write Functions</h3>
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
          <button onClick={handleBatchForcedTransferClick} className="card">
            Batch Forced Transfer
          </button>
          {showBatchForcedTransferInput && (
            <div>
              <input type="text" value={fromList} id="fromList" onChange={handleInputChange} placeholder="From list, comma separated" />
              <input type="text" value={addressesList} id="addressesList" onChange={handleInputChange} placeholder="To list, comma separated" />
              <input type="text" value={amounts} id="amounts" onChange={handleInputChange} placeholder="Amount list, comma separated" />
              <button onClick={handleBatchForcedTransfer} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Batch Force Transfer
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleBatchFreezePartialTokensClick} className="card">
            Batch Freeze Partial Tokens
          </button>
          {showBatchFreezePartialTokensInput && (
            <div>
              <input type="text" value={addressesList} id="addressesList" onChange={handleInputChange} placeholder="Addresses list, comma separated" />
              <input type="text" value={amounts} id="amounts" onChange={handleInputChange} placeholder="Amount list, comma separated" />
              <button onClick={handleBatchFreezePartialTokens} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Batch Freeze Partial Tokens
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
          <button onClick={handleBatchSetAddressFrozenClick} className="card">
            Batch Set Address Frozen
          </button>
          {showBatchSetAddressFrozenInput && (
            <div>
              <input type="text" value={addressesList} id="addressesList" onChange={handleInputChange} placeholder="Addresses list, comma separated" />
              <input type="text" value={booleanList} id="booleanList" onChange={handleInputChange} placeholder="Boolean list, comma separated" />
              <button onClick={handleBatchSetAddressFrozen} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Batch Set Address Frozen
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
          <button onClick={handleBatchTransferFromClick} className="card">
            Batch Transfer From
          </button>
          {showBatchTransferFromInput && (
            <div>
              <input type="text" value={fromList} id="fromList" onChange={handleInputChange} placeholder="From list, comma separated" />
              <input type="text" value={addressesList} id="addressesList" onChange={handleInputChange} placeholder="To list, comma separated" />
              <input type="text" value={amounts} id="amounts" onChange={handleInputChange} placeholder="Amount list, comma separated" />
              <button onClick={handleBatchTransferFrom} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Batch Transfer From
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleBatchUnfreezePartialTokensClick} className="card">
            Batch Unfreeze Partial Tokens
          </button>
          {showBatchUnfreezePartialTokensInput && (
            <div>
              <input type="text" value={addressesList} id="addressesList" onChange={handleInputChange} placeholder="Addresses list, comma separated" />
              <input type="text" value={amounts} id="amounts" onChange={handleInputChange} placeholder="Amount list, comma separated" />
              <button onClick={handleBatchUnfreezePartialTokens} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Batch Unfreeze Partial Tokens
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
          <button onClick={handleForcedTransferClick} className="card">
            Forced Transfer
          </button>
          {showForcedTransferInput && (
            <div>
              <input type="text" value={ownerAddress} id="ownerAddress" onChange={handleInputChange} placeholder="Enter owner address" />
              <input type="text" value={spenderAddress} id="spenderAddress" onChange={handleInputChange} placeholder="Enter destination address" />
              <input type="text" value={amount} id="amount" onChange={handleInputChange} placeholder="Enter amount" />
              <button onClick={handleForcedTransfer} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Force Transfer
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleDecreaseAllowanceClick} className="card">
            Decrease Allowance
          </button>
          {showDecreaseAllowanceInput && (
            <div>
              <input type="text" value={spenderAddress} id="spenderAddress" onChange={handleInputChange} placeholder="Enter spender address" />
              <input type="text" value={amount} id="amount" onChange={handleInputChange} placeholder="Enter amount" />
              <button onClick={handleDecreaseAllowance} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Decrease Allowance
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
          <button onClick={handleIncreaseAllowanceClick} className="card">
            Increase Allowance
          </button>
          {showIncreaseAllowanceInput && (
            <div>
              <input type="text" value={spenderAddress} id="spenderAddress" onChange={handleInputChange} placeholder="Enter spender address" />
              <input type="text" value={amount} id="amount" onChange={handleInputChange} placeholder="Enter amount" />
              <button onClick={handleIncreaseAllowance} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Increase Allowance
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
          <button onClick={handleAddAddressIdentityRecoverClick} className="card">
            Add Address for Identity Recover
          </button>
          {showAddAddressIdentityRecoverInput && (
            <div>
              <input type="text" value={lostWalletAddress} id="lostWalletAddress" onChange={handleInputChange} placeholder="Enter current wallet address" />
              <input type="text" value={newWalletAddress} id="newWalletAddress" onChange={handleInputChange} placeholder="Enter new wallet address" />
              <input type="text" value={investorOnchainID} id="investorOnchainID" onChange={handleInputChange} placeholder="Enter investor OnchainID" />
              <button onClick={handleAddAddressIdentityRecover} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Add Address
              </button>
            </div>
          )}
        </div>
        
        <div>
          <button onClick={handleRemoveAddressIdentityRecoverClick} className="card">
            Remove Address for Identity Recover
          </button>
          {showRemoveAddressIdentityRecoverInput && (
            <div>
              <input type="text" value={lostWalletAddress} id="lostWalletAddress" onChange={handleInputChange} placeholder="Enter wallet address to remove" />
              <input type="text" value={investorOnchainID} id="investorOnchainID" onChange={handleInputChange} placeholder="Enter investor OnchainID" />
              <button onClick={handleRemoveAddressIdentityRecover} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Remove Address
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleRenounceRoleInTokenClick} className="card">
            Renounce Role 
          </button>
          {showRenounceRoleInTokenInput && (
            <div>
              <input type="text" value={role} id="role" onChange={handleInputChange} placeholder="Enter role" />
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <button onClick={handleRenounceRoleInToken} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Renounce Role
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleRevokeRoleInTokenClick} className="card">
            Revoke Role
          </button>
          {showRevokeRoleInTokenInput && (
            <div>
              <input type="text" value={role} id="role" onChange={handleInputChange} placeholder="Enter role" />
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <button onClick={handleRevokeRoleInToken} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Revoke Role
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleGrantRoleInTokenClick} className="card">
            Grant Role
          </button>
          {showGrantRoleInTokenInput && (
            <div>
              <input type="text" value={role} id="role" onChange={handleInputChange} placeholder="Enter role" />
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <button onClick={handleGrantRoleInToken} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Grant Role
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleSetAddressFrozenClick} className="card">
            Set Address Frozen
          </button>
          {showSetAddressFrozenInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <input type="text" value={boolValue} id="boolValue" onChange={handleInputChange} placeholder="Enter boolean value" />
              <button onClick={handleSetAddressFrozen} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Set Address Frozen
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleSetOnchainIDClick} className="card">
            Set Onchain ID
          </button>
          {showSetOnchainIDInput && (
            <div>
              <input type="text" value={onchainIDValue} id="onchainIDValue" onChange={handleInputChange} placeholder="Enter new Onchain ID" />
              <button onClick={handleSetOnchainID} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Set Onchain ID
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
          <button onClick={handleTransferFromClick} className="card">
            Transfer Tokens From
          </button>
          {showTransferFromInput && (
            <div>
              <input type="text" value={ownerAddress} id="ownerAddress" onChange={handleInputChange} placeholder="Enter address from" />
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter address to" />
              <input type="text" value={amount} id="amount" onChange={handleInputChange} placeholder="Enter amount" />
              <button onClick={handleTransferFrom} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Transfer From
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

      <h3>Identity Registry Smart Contract Read Functions</h3>
      <div className="flex-container">

        <div>
          <button onClick={handleHasRoleInIdentityRegistryClick} className="card">
            Has Role in Identity Registry
          </button>
          {showHasRoleInIdentityRegistryInput && (
            <div>
              <input type="text" value={role} id="role" onChange={handleInputChange} placeholder="Enter role" />
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <button onClick={handleHasRoleInIdentityRegistry} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Has Role in Identity Registry
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleIdentityOfAccountClick} className="card">
            Identity of Account
          </button>
          {showIdentityOfAccountInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <button onClick={handleIdentityOfAccount} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Identity of Account
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleInvestorCountryClick} className="card">
            Investor Country
          </button>
          {showInvestorCountryInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <button onClick={handleInvestorCountry} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Investor Country
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleAccountIsVerifiedClick} className="card">
            Account is Verified
          </button>
          {showAccountIsVerifiedInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <button onClick={handleAccountIsVerified} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Is Verified
              </button>
            </div>
          )}
        </div>
      </div>

      <h3>Identity Registry Smart Contract Write Functions</h3>
      <div className="flex-container">

        <div>
          <button onClick={handleBatchRegisterIdentityClick} className="card">
            Batch Register Identity
          </button>
          {showBatchRegisterIdentityInput && (
            <div>
              <input type="text" value={addressesList} id="addressesList" onChange={handleInputChange} placeholder="Addresses list, comma separated" />
              <input type="text" value={identitiesList} id="identitiesList" onChange={handleInputChange} placeholder="Identities list, comma separated" />
              <input type="text" value={countriesList} id="countriesList" onChange={handleInputChange} placeholder="Countries list, comma separated" />
              <button onClick={handleBatchRegisterIdentity} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Batch Register Identity
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleDeleteIdentityClick} className="card">
            Delete Identity
          </button>
          {showDeleteIdentityInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <button onClick={handleDeleteIdentity} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Delete Identity
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleRegisterIdentityClick} className="card">
            Register Identity
          </button>
          {showRegisterIdentityInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <input type="text" value={identityAddress} id="identityAddress" onChange={handleInputChange} placeholder="Enter identity address" />
              <input type="text" value={country} id="country" onChange={handleInputChange} placeholder="Enter country code" />
              <button onClick={handleRegisterIdentity} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Register Identity
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleGrantRoleInIdentityRegistryClick} className="card">
            Grant Role
          </button>
          {showGrantRoleInIdentityRegistryInput && (
            <div>
              <input type="text" value={role} id="role" onChange={handleInputChange} placeholder="Enter role" />
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <button onClick={handleGrantRoleInIdentityRegistry} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Grant Role
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleUpdateCountryClick} className="card">
            Update Country
          </button>
          {showUpdateCountryInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <input type="text" value={country} id="country" onChange={handleInputChange} placeholder="Enter country" />
              <button onClick={handleUpdateCountry} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Update Country
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleUpdateIdentityClick} className="card">
            Update Identity
          </button>
          {showUpdateIdentityInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <input type="text" value={identityAddress} id="identityAddress" onChange={handleInputChange} placeholder="Enter identity address" />
              <button onClick={handleUpdateIdentity} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Update Identity
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleRenounceRoleInIdentityRegistryClick} className="card">
            Renounce Role
          </button>
          {showRenounceRoleInIdentityRegistryInput && (
            <div>
              <input type="text" value={role} id="role" onChange={handleInputChange} placeholder="Enter role" />
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <button onClick={handleRenounceRoleInIdentityRegistry} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Renounce Role
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleRevokeRoleInIdentityRegistryClick} className="card">
            Revoke Role
          </button>
          {showRevokeRoleInIdentityRegistryInput && (
            <div>
              <input type="text" value={role} id="role" onChange={handleInputChange} placeholder="Enter role" />
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="Enter wallet address" />
              <button onClick={handleRevokeRoleInIdentityRegistry} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Revoke Role
              </button>
            </div>
          )}
        </div>

      </div>

      <h3>Identity & Claim Registration Read Functions</h3>
      <div className="flex-container">

        <div>
          <button onClick={handleGetClaimDetailsClick} className="card">
            Get Claim Details
          </button>
          {showGetClaimDetailsInput && (
            <div>
              <input type="text" value={identityAddress} id="identityAddress" onChange={handleInputChange} placeholder="Enter identity address" />
              <input type="text" value={claimId} id="claimId" onChange={handleInputChange} placeholder="Enter claim ID" />
              <button onClick={handleGetClaimDetails} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Get Claim Details
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleGetClaimsByTopicClick} className="card">
            Get Claims by Topic
          </button>
          {showGetClaimsByTopicInput && (
            <div>
              <input type="text" value={identityAddress} id="identityAddress" onChange={handleInputChange} placeholder="Enter identity address" />
              <input type="text" value={topic} id="topic" onChange={handleInputChange} placeholder="Enter topic value" />
              <button onClick={handleGetClaimsByTopic} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Get Claims by Topic
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleIsClaimValidClick} className="card">
            Is Claim Valid
          </button>
          {showIsClaimValidInput && (
            <div>
              <input type="text" value={identityAddress} id="identityAddress" onChange={handleInputChange} placeholder="Enter identity address" />
              <input type="text" value={topic} id="topic" onChange={handleInputChange} placeholder="Enter topic value" />
              <input type="text" value={signature} id="signature" onChange={handleInputChange} placeholder="Enter signature value" />
              <input type="text" value={data} id="data" onChange={handleInputChange} placeholder="Enter data value" />
              
              <button onClick={handleIsClaimValid} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Is Claim Valid
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleIsClaimRevokedClick} className="card">
            Is Claim Revoked
          </button>
          {showIsClaimRevokedInput && (
            <div>
              <input type="text" value={signature} id="signature" onChange={handleInputChange} placeholder="Enter signature value" />
              <button onClick={handleIsClaimRevoked} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Is Claim Revoked
              </button>
            </div>
          )}
        </div>

      </div>

      <h3>Identity & Claim Registration Write Functions</h3>
      <div className="flex-container">

        <div>
          <button onClick={handleDeployIdentitySmartContractClick} className="card">
            Deploy Identity Smart Contract
          </button>
          {showDeployIdentitySmartContractInput && (
            <div>
              <input type="text" value={walletAddress} id="walletAddress" onChange={handleInputChange} placeholder="User wallet address" />
              <button onClick={handleDeployIdentitySmartContract} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
                Deploy Identity Smart Contract
              </button>
            </div>
          )}
        </div>
 
        <div>
          <button onClick={handleAddIdentityClaimClick} className="card">
            Add Identity Claim
          </button>
          {showAddIdentityClaimInput && (
            <div>
              <input type="text" value={identityAddress} id="identityAddress" onChange={handleInputChange} placeholder="Enter identity address" />
              <input type="text" value={topic} id="topic" onChange={handleInputChange} placeholder="Enter topic" />
              <input type="text" value={data} id="data" onChange={handleInputChange} placeholder="Enter data" />
              <button onClick={handleAddIdentityClaim} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
              Add Identity Claim
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleRemoveIdentityClaimClick} className="card">
            Remove Identity Claim
          </button>
          {showRemoveIdentityClaimInput && (
            <div>
              <input type="text" value={identityAddress} id="identityAddress" onChange={handleInputChange} placeholder="Enter identity address" />
              <input type="text" value={claimId} id="claimId" onChange={handleInputChange} placeholder="Enter claim ID" />
              <button onClick={handleRemoveIdentityClaim} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
              Remove Identity Claim
              </button>
            </div>
          )}
        </div>

        <div>
          <button onClick={handleRevokeIdentityClaimClick} className="card">
            Revoke Identity Claim (Claim issuer execution)
          </button>
          {showRevokeIdentityClaimInput && (
            <div>
              <input type="text" value={identityAddress} id="identityAddress" onChange={handleInputChange} placeholder="Enter identity address" />
              <input type="text" value={claimId} id="claimId" onChange={handleInputChange} placeholder="Enter claim ID" />
              <button onClick={handleRevokeIdentityClaim} className="card" style={{ backgroundColor: '#0070f3', color: 'white' }}>
              Revoke Identity Claim
              </button>
            </div>
          )}
        </div>

      </div>

      <h3>|||Console Returns|||</h3>
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
