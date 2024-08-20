import { createWalletClient, createPublicClient, custom, formatEther, parseEther } from 'viem';
import { mainnet, polygonAmoy, sepolia } from 'viem/chains';
import Web3 from 'web3';
import type { IProvider } from '@web3auth/base';
import { IDENTITY_PROXY_ABI, ERC3643_ABI, ONCHAIN_IDENTITY_ABI, IDENTITY_REGISTRY_ABI, 
  CLAIM_ISSUER_ABI, IDENTITY_PROXY_BYTECODE } from './utils/abi';
import { TOKEN_SMART_CONTRACT_ADDRESS, IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS, 
  IDENTITY_IMPLEMENTATION_AUTHORITY_ADDRESS, CLAIM_ISSUER_CONTRACT_ADDRESS } from './utils/addresses';

require('dotenv').config();

const privKey_claimIssuerSigningKey = process.env.REACT_APP_CLAIM_ISSUER_SIGNING_KEY || "";
const web3 = new Web3();

export default class EthereumRpc {
  private provider: IProvider;

  private contractABI = [
    {
      "inputs": [],
      "name": "retrieve",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "num",
          "type": "uint256"
        }
      ],
      "name": "store",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  constructor(provider: IProvider) {
    this.provider = provider;
  }

  getViewChain() {
    switch (this.provider.chainId) {
      case "1":
        return mainnet;
      case "0x13882":
        return polygonAmoy;
      case "0xaa36a7":
        return sepolia;
      default:
        return mainnet;
    }
  }
  
  async getChainId(): Promise<any> {
    try {
      const walletClient = createWalletClient({
        transport: custom(this.provider)
      })

      const chainId = await walletClient.getChainId();
      
      return chainId.toString();
    } catch (error) {
      return error;
    }
  }
  
  async getAddresses(): Promise<any> {
    try {
      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      return await walletClient.getAddresses();
    } catch (error) {
      return error;
    }
  }
  async getAccounts(): Promise<any> {
    try {

      const address = await this.getAddresses()

      return address;
    } catch (error) {
      return error;
    }
  }

  async getPrivateKey(): Promise<any> {
    try {
      const privateKey = await this.provider.request({
        method: "eth_private_key",
      });

      return privateKey;
    } catch (error) {
      return error as string;
    }
  }

  async getBalance(): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider),
      });
  
      let address = await this.getAccounts();

      console.log(address);
  
      // Ensure the address has the '0x' prefix
      if (!address[0].startsWith('0x')) {
        address[0] = '0x' + address[0];
      }

      console.log(address[0]);
  
      const balance = await publicClient.getBalance({ address: address[0] });
      return formatEther(balance);
    } catch (error) {
      return error as string;
    }
  }

  async balanceOf(address: any): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const balance = await publicClient.getBalance({ address: address });

      return formatEther(balance);
    } catch (error) {
      console.error(error);
      return error as string;
    }
  }

  async getMyTokenBalance(): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const address = await this.getAccounts();

      const myTokenBalance: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'balanceOf',
        args: [address[0]]
      }) as unknown as string;

      const response = "My token balance is: " + web3.utils.fromWei(myTokenBalance, 'mwei');

      return this.toObject(response); // Convert balance from wei to ether
    } catch (error) {
      console.error(error);
      return error instanceof Error ? error.message : "An error occurred";
    }
}

  async getTokenAddress(): Promise<string> {
      return TOKEN_SMART_CONTRACT_ADDRESS;
  }

  async getAgentRole(): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const agentRole: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'AGENT_ROLE',
      }) as unknown as string;

      return agentRole;
    } catch (error) {
      return error as string;
    }
  }

  async getDeFaultAdminRole(): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const defaultAdminRole: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'DEFAULT_ADMIN_ROLE',
      }) as unknown as string;

      return defaultAdminRole;
    } catch (error) {
      return error as string;
    }
  }

  async getOwnerRole(): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const ownerRole: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'OWNER_ROLE',
      }) as unknown as string;

      return ownerRole;
    } catch (error) {
      return error as string;
    }
  }

  async smartContractBalanceOf(walletAddress: any): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const balance: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'balanceOf',
        args: [walletAddress]
      }) as unknown as string;

      return web3.utils.fromWei(balance, 'mwei'); // Convert balance from wei to ether
    } catch (error) {
      console.error(error);
      return error instanceof Error ? error.message : "An error occurred";
    }
  }

  async smartContractAllowance(ownerAddress: any, spenderAddress: any): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const allowance: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'allowance',
        args: [ownerAddress, spenderAddress]
      }) as unknown as string;

      return web3.utils.fromWei(allowance, 'mwei'); // Convert balance from wei to ether
    } catch (error) {
      console.error(error);
      return error instanceof Error ? error.message : "An error occurred";
    }
  }

  async smartContractGetFrozenTokens(walletAddress: any): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const frozenTokens: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'getFrozenTokens',
        args: [walletAddress]
      }) as unknown as string;

      return web3.utils.fromWei(frozenTokens, 'mwei'); // Convert balance from wei to ether
    } catch (error) {
      console.error(error);
      return error instanceof Error ? error.message : "An error occurred";
    }
  }

  async smartContractGetRoleAdmin(role: any): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const adminRole: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'getRoleAdmin',
        args: [role]
      }) as unknown as string;

      return adminRole; // Convert balance from wei to ether
    } catch (error) {
      console.error(error);
      return error instanceof Error ? error.message : "An error occurred";
    }
  }

  async smartContractHasRoleInToken(role: any, walletAddress: any): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const hasRole: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'hasRole',
        args: [role, walletAddress]
      }) as unknown as string;

      return hasRole;
    } catch (error) {
      console.error(error);
      return error instanceof Error ? error.message : "An error occurred";
    }
  }

  async smartContractHasRoleInIdentityRegistry(role: any, walletAddress: any): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const hasRole: string = await publicClient.readContract({
        address: IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'hasRole',
        args: [role, walletAddress]
      }) as unknown as string;

      return hasRole;
    } catch (error) {
      console.error(error);
      return error instanceof Error ? error.message : "An error occurred";
    }
  }

  async getCompliance(): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const compliance: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'compliance',
      }) as unknown as string;

      return compliance;
    } catch (error) {
      return error as string;
    }
  }

  async getDecimals(): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const decimals: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'decimals',
      }) as unknown as string;

      return decimals;
    } catch (error) {
      return error as string;
    }
  }

  async smartContractIsFrozen(walletAddress: any): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const frozenTokens: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'isFrozen',
        args: [walletAddress]
      }) as unknown as string;

      return frozenTokens; // Convert balance from wei to ether
    } catch (error) {
      console.error(error);
      return error instanceof Error ? error.message : "An error occurred";
    }
  }

  async smartContractIdentityOfAccount(walletAddress: any): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const identityOfAccount: string = await publicClient.readContract({
        address: IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'identity',
        args: [walletAddress]
      }) as unknown as string;
      
      const response = "The Onchain identity of the address: " + walletAddress 
        + ", in the identity registry of address: " + IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS 
        + ", is: " + identityOfAccount;

      return this.toObject(response); 

    } catch (error) {
      console.error(error);
      return error instanceof Error ? error.message : "An error occurred";
    }
  }

  async smartContractInvestorCountry(walletAddress: any): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const investorCountry: string = await publicClient.readContract({
        address: IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'investorCountry',
        args: [walletAddress]
      }) as unknown as string;

      const response = "The investor country code of wallet address: " + walletAddress
        + ", in the identity registry of address: " + IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS 
        + ", is code: " + investorCountry;

      return this.toObject(response); 
    } catch (error) {
      console.error(error);
      return error instanceof Error ? error.message : "An error occurred";
    }
  }

  async smartContractAccountIsVerified(walletAddress: any): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const isVerified: string = await publicClient.readContract({
        address: IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'isVerified',
        args: [walletAddress]
      }) as unknown as string;

      const response = "The verified status of address: "+ walletAddress
        + ", in the identity registry of address: " + IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS 
        + ", is: " + isVerified;

      return this.toObject(response);
    } catch (error) {
      console.error(error);
      return error instanceof Error ? error.message : "An error occurred";
    }
  }

  async getIdentityRegistry(): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const identityRegistry: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'identityRegistry',
      }) as unknown as string;

      return identityRegistry;
    } catch (error) {
      return error as string;
    }
  }

  async getName(): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const name: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'name',
      }) as unknown as string;

      return name;
    } catch (error) {
      return error as string;
    }
  }

  async getOnchainID(): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const onchainID: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'onchainID',
      }) as unknown as string;

      return onchainID;
    } catch (error) {
      return error as string;
    }
  }

  async getIsPaused(): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const paused: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'paused',
      }) as unknown as string;
      
      return paused;
    } catch (error) {
      return error as string;
    }
  }

  async getSymbol(): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const symbol: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'symbol',
      }) as unknown as string;

      return symbol;
    } catch (error) {
      return error as string;
    }
  }

  async getTotalSupply(): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const totalSupply: string = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: ERC3643_ABI,
        functionName: 'totalSupply',
      }) as unknown as string;

      return web3.utils.fromWei(totalSupply, 'mwei'); // Convert balance from wei to ether;
    } catch (error) {
      return error as string;
    }
  }

  async sendTransaction(walletAddresss:any, amount:any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      // data for the transaction
      const address = await this.getAccounts();

      // Submit transaction to the blockchain
      const hash = await walletClient.sendTransaction({
        account: address[0],
        to: walletAddresss,
        value: parseEther(amount),
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const data = receipt["logs"][0]["data"];

      const valueHex = data.slice(0, 66); // The first 32 bytes (64 hex characters) represent the value
    
      // Convert the hexadecimal value to a BigInt
      const valueBigInt = BigInt(valueHex);
      
      // Convert the value from wei (the smallest unit of Ether) to Ether
      const valueEther = Number(valueBigInt) / 1e18;

      const response = "Sent: "+ valueEther 
        + ", from: "+ receipt["from"] 
        + ", to: " + receipt["to"] ;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractApproveBalance(spenderAddress: any, amount: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0],
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'approve',
          args: [spenderAddress, amount]
        }
      );

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const response = "Wallet owner: "+ receipt["from"] + ", approved token amount: " + dataDecimal.toString() 
      + ", to: " + receipt["to"] + ". Transaction hash: " + hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractBatchFreezePartialTokens(_addressesList: any, _amounts: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0],
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'batchFreezePartialTokens',
          args: [_addressesList, _amounts]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "Batch partial freeze of tokens for the addresses: " +  _addressesList 
        + ", the amounts: " + _amounts 
        + ". Transaction hash: " + hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractBatchMint(_addressesList: any, _amounts: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'batchMint',
          args: [_addressesList, _amounts]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "Minted batch of tokens for the addresses: " + _addressesList 
        + ", the amounts: " + _amounts 
        + ". Transaction hash: " + hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractBatchSetAddressFrozen(_addressesList: any, _booleanList: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'batchSetAddressFrozen',
          args: [_addressesList, _booleanList]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "Batch set frozen addresses: " + _addressesList 
        + ", with the values: " + _booleanList 
        + ". Transaction hash: " + hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractBatchBurn(_addressesList: any, _amounts: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts(); 

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'batchBurn',
          args: [_addressesList, _amounts]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });


      const response = "Burned tokens from addresses: " + _addressesList 
        + ", the amounts: " + _amounts 
        + ". Transaction hash: " +  hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractBatchForcedTransfer(_fromList: any, _addressesList: any, _amounts: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0],
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'batchForcedTransfer',
          args: [_fromList, _addressesList, _amounts]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "Forced batch transfer from addresses: " + _fromList 
        + ", to addresses: " + _addressesList 
        + ", the amounts: " + _amounts 
        + ". Transaction hash: " + hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractBatchRegisterIdentity(_addressesList: any, _identitiesList: any, _countriesList: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0],
          address: IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'batchRegisterIdentity',
          args: [_addressesList, _identitiesList, _countriesList]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "Batch identity registration of the wallet addresses: " +  _addressesList 
        + ", with the identities: " + _identitiesList
        + ", and the countries: " + _countriesList
        + ", has been sent. Transaction hash: " + hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractBatchTransfer(_addressesList: any, _amounts: any): Promise<any> {
    try {

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'batchTransfer',
          args: [_addressesList, _amounts]
        }
      );

      const response = "Batch transfer of tokens to the addresses: " + _addressesList 
        + ", with the amounts: " + _amounts 
        + ". Transaction hash: " + hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractBatchTransferFrom(_fromList: any, _addressesList: any, _amounts: any): Promise<any> {
    try {

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'batchTransferFrom',
          args: [_fromList, _addressesList, _amounts]
        }
      );

      const response = "Batch transfer of tokens from the address: " + accountAddress[0] 
        +  ", to the addresses:" + _addressesList 
        + ", with the amounts: " + _amounts 
        + ". Transaction hash: " + hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractBatchUnfreezePartialTokens(_addressesList: any, _amounts: any): Promise<any> {
    try {

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'batchUnfreezePartialTokens',
          args: [_addressesList, _amounts]
        }
      );

      const response = "Batch partial unfreeze of tokens for the addresses: " +  _addressesList 
        + ", the amounts: " + _amounts 
        + ". Transaction hash: " + hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractBurnTokens(walletAddress: any, amount: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'burn',
          args: [walletAddress, amount]
        }
      );

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const result = "Burned token amount: " + dataDecimal.toString() 
        + ", from: " + walletAddress 
        + ". Transaction hash: " + hash;

      return this.toObject(result);
    } catch (error) {
      return error;
    }
  }

  async smartContractForcedTransfer(ownerAddress: any, spenderAddress: any, amount: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'forcedTransfer',
          args: [ownerAddress, spenderAddress, amount]
        }
      );

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const result = "Forced transfer of token amount: " + dataDecimal.toString() 
        + " from: " + ownerAddress 
        + ", to: " + spenderAddress 
        + ". Transaction hash: " + hash;

      return this.toObject(result);
    } catch (error) {
      return error;
    }
  }

  async smartContractDecreaseAllowance(spenderAddress: any, amount: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'decreaseAllowance',
          args: [spenderAddress, amount]
        }
      );

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const result = "Total token allowance: " + dataDecimal.toString() 
        + ", from owner address: " + accountAddress[0] 
        + ", to: " + spenderAddress 
        + ". Transaction hash: " + hash;

      return this.toObject(result);
    } catch (error) {
      return error;
    }
  }

  async smartContractFreezePartialTokens(walletAddress: any, amount: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'freezePartialTokens',
          args: [walletAddress, amount]
        }
      );

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const result = "Freezed: " + dataDecimal.toString()
        + " tokens, to: " + walletAddress
        + ". Transaction hash" + hash;

      return this.toObject(result);
    } catch (error) {
      return error;
    }
  }

  async smartContractIncreaseAllowance(spenderAddress: any, amount: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'increaseAllowance',
          args: [spenderAddress, amount]
        }
      );

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const result = "Total token allowance: " + dataDecimal.toString() 
        + ", from owner address: " + accountAddress[0] 
        + ", to: " + spenderAddress 
        + ". Transaction hash: " + hash;

      return this.toObject(result);
    } catch (error) {
      return error;
    }
  }

  async smartContractMintTokens(walletAddress: any, amount: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts(); 

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'mint',
          args: [walletAddress, amount]
        }
      );

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const result = "Minted token amount: " + dataDecimal.toString() 
        + ", to: " + walletAddress
        + ". Transaction hash: " + hash;

      return this.toObject(result);
    } catch (error) {
      return error;
    }
  }

  async smartContractRecoveryAddress(lostWalletAddress: any, newWalletAddress: any, investorOnchainID: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'recoveryAddress',
          args: [lostWalletAddress, newWalletAddress, investorOnchainID],
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "Lost wallet address: " + lostWalletAddress 
        + " has been updated with the new wallet address: " + newWalletAddress 
        + ", for the investor On-chain ID: " + investorOnchainID 
        + ". Transaction hash: "+ hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractAddAddressIdentityRecover(lostWalletAddress: any, newWalletAddress: any, investorOnchainID: any): Promise<any> {

    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: lostWalletAddress,
          address: investorOnchainID,
          abi: ONCHAIN_IDENTITY_ABI,
          functionName: 'addKey',
          args: [web3.utils.keccak256(
            web3.eth.abi.encodeParameters(
              ["address"], // Key type
              [newWalletAddress] //
            )
          ),
            1, // Purpose of the key
            1]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "Added recovery address: " + newWalletAddress 
        + " for the previous wallet address: " + lostWalletAddress 
        + ", for the investor On-chain ID: " + investorOnchainID 
        + ". Transaction hash: "+ hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractRemoveAddressIdentityRecover(lostWalletAddress: any, investorOnchainID: any): Promise<any> {

    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0],
          address: investorOnchainID,
          abi: ONCHAIN_IDENTITY_ABI,
          functionName: 'removeKey',
          args: [web3.utils.keccak256(
            web3.eth.abi.encodeParameters(
              ["address"], // Key type
              [lostWalletAddress] //
            )
          ),
            1, // Purpose of the key
          ]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "Removed recovery address: " + lostWalletAddress 
        + ", from the investor On-chain ID: " + investorOnchainID 
        + ". Transaction hash: "+ hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractRenounceRoleInToken(role: any, walletAddress: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0],
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'renounceRole',
          args: [role, walletAddress]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "The address: " + walletAddress 
        + ", renounced the role: " + role 
        + ", in the token contract. Transaction hash: "+ hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractRevokeRoleInToken(role: any, walletAddress: any): Promise<any> {
    try {

      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0],
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'revokeRole',
          args: [role, walletAddress]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "The address: " + accountAddress[0] 
        + ", revoked the role: " + role 
        + ", to the address: " + walletAddress
        + ", in the token contract. Transaction hash: "+ hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractGrantRoleInToken(role: any, walletAddress: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'grantRole',
          args: [role, walletAddress]
        }
      );

     await publicClient.waitForTransactionReceipt({ hash });

     const response = "The address: " + accountAddress[0] 
      + ", granted the role: " + role 
      + ", to the address: " + walletAddress
      + ", in the token contract. Transaction hash: "+ hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractGrantRoleInIdentityRegistry(role: any, walletAddress: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'grantRole',
          args: [role, walletAddress]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "The address: " + accountAddress[0] 
        + ", granted the role: " + role 
        + ", to the address: " + walletAddress
        + ", in the identity registry. Transaction hash: "+ hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractRenounceRoleInIdentityRegistry(role: any, walletAddress: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'renounceRole',
          args: [role, walletAddress]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "The address: " + walletAddress 
      + ", renounced the role: " + role 
      + ", in the identity registry. Transaction hash: "+ hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractRevokeRoleInIdentityRegistry(role: any, walletAddress: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'revokeRole',
          args: [role, walletAddress]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "The address: " + accountAddress[0] 
        + ", revoked the role: " + role 
        + ", to the address: " + walletAddress
        + ", in the identity registry. Transaction hash: "+ hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractUpdateCountry(walletAddress: any, country: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'updateCountry',
          args: [walletAddress, country]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "The address: " + accountAddress[0] 
        + ", updated the country of the address: " + walletAddress
        + ", with the country code: " + country
        + ", in the identity registry. Transaction hash: "+ hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractUpdateIdentity(walletAddress: any, identity: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'updateIdentity',
          args: [walletAddress, identity]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "The address: " + accountAddress[0] 
        + ", updated the identity of the address: " + walletAddress
        + ", with the new identity address: " + identity
        + ", in the identity registry. Transaction hash: "+ hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractSetAddressFrozen(walletAddress: any, boolValue: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'setAddressFrozen',
          args: [walletAddress, boolValue]
        }
      );

    await publicClient.waitForTransactionReceipt({ hash });

      const response = "The address: " + walletAddress 
        + ", frozen status has been set to: " + boolValue 
        + ". Transaction hash: "+ hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractSetOnchainID(onchainIDValue: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'setOnchainID',
          args: [onchainIDValue]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "The token smart contract of address: " + TOKEN_SMART_CONTRACT_ADDRESS 
        + ", Onchain Identity address has been changed to: " + onchainIDValue 
        + ". Transaction hash: "+ hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractTransferTokens(walletAddress: any, amount: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'transfer',
          args: [walletAddress, amount]
        }
      );

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const response = "Transfered: " + dataDecimal.toString() 
        + " tokens, from: " + accountAddress[0] 
        + " to: " + walletAddress 
        + ". Transaction hash: " + hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractTransferFrom(ownerAddress: any, walletAddress: any, amount: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'transferFrom',
          args: [ownerAddress, walletAddress, amount]
        }
      );

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const response = "Transfered: " + dataDecimal.toString() 
        + " tokens, from: " + ownerAddress 
        + ", to: " + walletAddress 
        + ", by: " + accountAddress[0] 
        + ". Transaction hash: " + hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractUnfreezePartialTokens(walletAddress: any, amount: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'unfreezePartialTokens',
          args: [walletAddress, amount]
        }
      );

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const response = "Unfreezed: " + dataDecimal.toString() 
        + " tokens, to: " + walletAddress
        + ". Transaction hash: " + hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractDeleteIdentity(walletAddress: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts(); 

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'deleteIdentity',
          args: [walletAddress]
        }
      );
      
      await publicClient.waitForTransactionReceipt({ hash });

      const response = "Deleted identity for wallet address: " + accountAddress[0]
        + " in identity registry: " + IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS
        + ". Transaction hash" + hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractRegisterIdentity(walletAddress: any, identityAddress: any, country: any): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: IDENTITY_REGISTRY_SMART_CONTRACT_ADDRESS,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'registerIdentity',
          args: [walletAddress, identityAddress, country]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "Identity registration of the wallet addresses: " +  walletAddress 
        + ", with the identity: " + identityAddress
        + ", and the country: " + country
        + ", has been sent. Transaction hash: " + hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }


  async addIdentityClaimSmartContract(identityAddress: any, topic: any, data: any): Promise<any> {

    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      data = data || "Some claim public data";
      topic = topic || 0;

      const claimTopics = [web3.utils.keccak256("CLAIM_TOPIC")];

      // Define the claim data for user
      const claimForUser = {
        data: web3.utils.utf8ToHex(data), // Public claim data for user
        issuer: CLAIM_ISSUER_CONTRACT_ADDRESS, // Address of the ClaimIssuer contract
        topic: claimTopics[topic], // Claim topic
        scheme: 1, // Scheme of the claim
        identity: identityAddress, // Address of Users's Identity contract
        signature: "", // Placeholder for the claim signature
      };

      // Encode the claim data
      const encodedData = web3.eth.abi.encodeParameters(
        ["address", "uint256", "bytes"], // Types of the claim data
        [claimForUser.identity, claimForUser.topic, claimForUser.data] // Claim data for the user
      );

      // Hash the encoded data
      const realHashedData = web3.utils.keccak256(encodedData);

      //Turn into an array the encoded data
      const arrayifyData = web3.utils.hexToBytes(realHashedData);

      // Check if arrayifyData is correctly generated
      if (arrayifyData) {

        // Sign the hashed data using the private key
        const claimIssuerSigningKey = web3.eth.accounts.privateKeyToAccount(privKey_claimIssuerSigningKey);
        const signedData = claimIssuerSigningKey.sign(web3.utils.bytesToHex(arrayifyData));
        // Assign the signature to claimForUser
        claimForUser.signature = signedData.signature;
      } else {
        console.error('Error generating signedData');
      }

      const accountAddress = await this.getAccounts();      

      // Send transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0],
          address: identityAddress,
          abi: ONCHAIN_IDENTITY_ABI ,
          functionName: 'addClaim',
          args: [
            claimForUser.topic,  // Claim topic
            claimForUser.scheme, // Claim scheme
            claimForUser.issuer, // Address of the ClaimIssuer contract
            claimForUser.signature, // Signed claim data
            claimForUser.data, //Data of the claim
            "", // Additional data (optional)
          ]
        }
      );

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "The claim for the Onchain identity address: " +  identityAddress 
        + ", with the topic: " + topic
        + " and data: " + data
        + ", has been added with the claim ID: " + receipt['logs'][0]['topics'][1]
        + ". Transaction hash: " + hash;

      return this.toObject(response);;
    } catch (error) {
      return error;
    }
  }

  async revokeIdentityClaimSmartContract(identityAddress:any, claimId: any): Promise<any> {

    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();      

      // Send transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0],
          address: CLAIM_ISSUER_CONTRACT_ADDRESS,
          abi: CLAIM_ISSUER_ABI ,
          functionName: 'revokeClaim',
          args: [
            claimId, //Claim Id
            identityAddress //Identity Address
          ]
        }
      );
      
      await publicClient.waitForTransactionReceipt({ hash });

      const response = "The claim for the Onchain identity address: " +  identityAddress 
        + ", and claim ID " + claimId
        + " has been revoked from the claim issuer contract."
        + " Transaction hash: " + hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async removeIdentityClaimSmartContract(identityAddress:any, claimId: any): Promise<any> {

    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();      

      // Send transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0],
          address: identityAddress,
          abi: ONCHAIN_IDENTITY_ABI ,
          functionName: 'removeClaim',
          args: [
            claimId //Claim Id
          ]
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "The claim ID: " +  claimId 
      + " has been removed from the Onchain Identity of the address: " + identityAddress
      + ". Transaction hash: " + hash;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async getClaimDetailsClaimSmartContract(identityAddress:any, claimId: any): Promise<any> {

    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const claimDetails: string = await publicClient.readContract({
        address: identityAddress,
        abi: ONCHAIN_IDENTITY_ABI,
        functionName: 'getClaim',
        args: [
          claimId //Claim Id
        ]
      }) as unknown as string;

      const response = "The claim ID: " + claimId 
        + ", of the Onchain ID address: " + identityAddress 
        + ", has the topic: " + claimDetails[0]
        + ", scheme: " + claimDetails[1]
        + ", claim issuer address: " + claimDetails[2]
        + ", signature: " + claimDetails[3]
        + " and data: " + claimDetails[4]

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractGetClaimsByTopic(identityAddress:any, topic: any): Promise<any> {

    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const claimsByTopic: string = await publicClient.readContract({
        address: identityAddress,
        abi: ONCHAIN_IDENTITY_ABI,
        functionName: 'getClaimIdsByTopic',
        args: [
          topic //Topic ID
        ]
      }) as unknown as string;

      const response = "The Onchain ID address: " + identityAddress 
        + ", containes the topic: " + topic 
        + ", with the following claims: " + claimsByTopic;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractIsClaimValid(identityAddress:any, topic: any, signature: any, data:any): Promise<any> {

    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const isClaimValid: string = await publicClient.readContract({
        address: CLAIM_ISSUER_CONTRACT_ADDRESS,
        abi: CLAIM_ISSUER_ABI,
        functionName: 'isClaimValid',
        args: [ 
          identityAddress,
          topic,  //Claim Id
          signature,
          data
        ]
      }) as unknown as string;

      const response = "The claim for the Onchain ID address: " + identityAddress 
        + ", topic: " + topic
        + ", signature: " + signature 
        + " and data: " + data
        + ", valid status is: " + isClaimValid;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractIsClaimRevoked(signature: any): Promise<any> {

    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const isClaimRevoked: string = await publicClient.readContract({
        address: CLAIM_ISSUER_CONTRACT_ADDRESS,
        abi: CLAIM_ISSUER_ABI,
        functionName: 'isClaimRevoked',
        args: [ 
          signature
        ]
      }) as unknown as string;

      const response = "The the claim with signature: " + signature 
        + ", revoked status is: " + isClaimRevoked;

      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractPause(): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'pause',
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "Smart contract paused. Transaction hash: " + hash;
      
      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async smartContractUnpause(): Promise<any> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const accountAddress = await this.getAccounts();  

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: accountAddress[0], 
          address: TOKEN_SMART_CONTRACT_ADDRESS,
          abi: ERC3643_ABI,
          functionName: 'unpause',
        }
      )

      await publicClient.waitForTransactionReceipt({ hash });

      const response = "Smart contract unpaused. Transaction hash: " + hash;
      
      return this.toObject(response);
    } catch (error) {
      return error;
    }
  }

  async deployIdentitySmartContract(walletAddress: any): Promise<any> {

    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      const address = await this.getAccounts();

      const hash = await walletClient.deployContract({
        abi: IDENTITY_PROXY_ABI,
        account: address[0],
        args: [IDENTITY_IMPLEMENTATION_AUTHORITY_ADDRESS, walletAddress],
        bytecode: IDENTITY_PROXY_BYTECODE,
      });

      // Wait for the transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const identityProxyAddress = receipt.contractAddress;

      const response = "The identity for the wallet address: " + walletAddress
        + ", has been deployed with the identity implementation authority address: " + IDENTITY_IMPLEMENTATION_AUTHORITY_ADDRESS
        + ", with the smart contract identity address: " + identityProxyAddress
        + ". Transaction hash: " + hash;

      // Return the deployed contract address
      return this.toObject(response);

    } catch (error) {
      return error;
    }
  }

  async signMessage() {
    try {
      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      // data for signing
      const address = await this.getAccounts();
      const originalMessage = "YOUR_MESSAGE";

      // Sign the message
      const hash = await walletClient.signMessage({
        account: address[0],
        message: originalMessage
      });

      return hash.toString();
    } catch (error) {
      return error;
    }
  }

  async readContract() {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const number = await publicClient.readContract({
        address: TOKEN_SMART_CONTRACT_ADDRESS,
        abi: this.contractABI,
        functionName: 'retrieve'
      })

      return this.toObject(number);
    } catch (error) {
      return error;
    }
  }

  async writeContract() {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });

      // data for writing to the contract
      const address = await this.getAccounts();
      const randomNumber = Math.floor(Math.random() * 9000) + 1000;

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: address[0],
          address: "0x9554a5CC8F600F265A89511e5802945f2e8A5F5D",
          abi: this.contractABI,
          functionName: 'store',
          args: [randomNumber]
        }
      );

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
    } catch (error) {
      return error;
    }
  }

  toObject(data: any) {
    // can't serialize a BigInt so this hack
    return JSON.parse(JSON.stringify(data, (key, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value // return everything else unchanged
    ));
  }
}
