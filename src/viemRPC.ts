import { createWalletClient, createPublicClient, custom, formatEther, parseEther} from 'viem';
import { mainnet, polygonAmoy, sepolia } from 'viem/chains';
import Web3 from 'web3';

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProvider } from "@web3auth/base";

const web3 = new Web3();

const ERC3643_ABI = [{"inputs":[{"internalType":"address","name":"identityRegistry_","type":"address"},{"internalType":"address","name":"compliance_","type":"address"},{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"},{"internalType":"address","name":"onchainID_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_userAddress","type":"address"},{"indexed":true,"internalType":"bool","name":"_isFrozen","type":"bool"},{"indexed":true,"internalType":"address","name":"_owner","type":"address"}],"name":"AddressFrozen","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_compliance","type":"address"}],"name":"ComplianceAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_identityRegistry","type":"address"}],"name":"IdentityRegistryAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_lostWallet","type":"address"},{"indexed":true,"internalType":"address","name":"_newWallet","type":"address"},{"indexed":true,"internalType":"address","name":"_investorOnchainID","type":"address"}],"name":"RecoverySuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_userAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"TokensFrozen","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_userAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"TokensUnfrozen","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_newOnchainID","type":"address"}],"name":"UpdatedOnchainID","type":"event"},{"inputs":[],"name":"AGENT_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"OWNER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"batchBurn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"fromList","type":"address[]"},{"internalType":"address[]","name":"toList","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"batchForcedTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"batchFreezePartialTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"toList","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"batchMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"bool[]","name":"freeze","type":"bool[]"}],"name":"batchSetAddressFrozen","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"toList","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"batchTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"fromList","type":"address[]"},{"internalType":"address[]","name":"toList","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"batchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"batchUnfreezePartialTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"compliance","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"_subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"forcedTransfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"freezePartialTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getFrozenTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"identityRegistry","outputs":[{"internalType":"contract IIdentityRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"_addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isFrozen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"onchainID","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"lostWallet","type":"address"},{"internalType":"address","name":"newWallet","type":"address"},{"internalType":"address","name":"investorOnchainID","type":"address"}],"name":"recoveryAddress","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bool","name":"freeze","type":"bool"}],"name":"setAddressFrozen","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newCompliance","type":"address"}],"name":"setCompliance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newIdentityRegistry","type":"address"}],"name":"setIdentityRegistry","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"onchainID_","type":"address"}],"name":"setOnchainID","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"unfreezePartialTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"}];

const mainSmartContractAddress = "0x60E5799fed9ACbdaF36e752a05468f1519b03c6f";

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
           
          const address = await walletClient.getAddresses()
          console.log(address)
          
        const chainId = await walletClient.getChainId()
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
           
        return  await walletClient.getAddresses();
    } catch (error) {
        return error;
    }
}
  async getAccounts(): Promise<any> {
    try {
        
        const address = this.getAddresses();
          
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
          transport: custom(this.provider)
        })
        
      const address = await this.getAccounts();
      const balance = await publicClient.getBalance({address: address[0]});
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
  
      const balance = await publicClient.getBalance({address: address });
      console.log(balance);
      return formatEther(balance);
    } catch (error) {
      console.error(error);
      return error as string;
    }
  }

  async smartContractBalanceOf(walletAddress: any, smartContractAddress: any): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      });
  
      const balance: string = await publicClient.readContract({
        //address: smartContractAddress,
        address: "0x60E5799fed9ACbdaF36e752a05468f1519b03c6f",
        abi: ERC3643_ABI,
        functionName: 'balanceOf',
        args: [walletAddress]
      }) as unknown as string;

      return web3.utils.fromWei(balance, 'ether'); // Convert balance from wei to ether
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
        address: mainSmartContractAddress,
        abi: ERC3643_ABI,
        functionName: 'allowance',
        args: [ownerAddress, spenderAddress]
      }) as unknown as string;
  
      return web3.utils.fromWei(allowance, 'ether'); // Convert balance from wei to ether
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
        address: mainSmartContractAddress,
        abi: ERC3643_ABI,
        functionName: 'getFrozenTokens',
        args: [walletAddress]
      }) as unknown as string;
  
      return web3.utils.fromWei(frozenTokens, 'ether'); // Convert balance from wei to ether
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
        address: mainSmartContractAddress,
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
        address: mainSmartContractAddress,
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
        address: mainSmartContractAddress,
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

  async getName(): Promise<string> {
    try {
      const publicClient = createPublicClient({
          chain: this.getViewChain(),
          transport: custom(this.provider)
        })
        
      const name: string = await publicClient.readContract({
        address: mainSmartContractAddress,
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
        address: mainSmartContractAddress,
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
        address: mainSmartContractAddress,
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
        address: mainSmartContractAddress,
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
        address: mainSmartContractAddress,
        abi: ERC3643_ABI,
        functionName: 'totalSupply',
      }) as unknown as string;
      
      return web3.utils.fromWei(totalSupply, 'ether'); // Convert balance from wei to ether;
    } catch (error) {
      return error as string;
    }
  }
  

  async sendTransaction(): Promise<any> {
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
      const destination = "0xc6442dbED945a1cf0B747994510a3bCCB8ECb693";
      const amount = parseEther("0.0001");
      const address =  await this.getAccounts();

      // Submit transaction to the blockchain
      const hash = await walletClient.sendTransaction({
          account: address[0],
          to: destination,
          value: amount,
        });
      console.log(hash)
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      

      return this.toObject(receipt); 
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
      const address =  await this.getAccounts();
      const originalMessage = "YOUR_MESSAGE";

      // Sign the message
      const hash = await walletClient.signMessage({
          account: address[0],
          message: originalMessage
        });

      console.log(hash)

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
          address: "0x60E5799fed9ACbdaF36e752a05468f1519b03c6f",
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
      const address =  await this.getAccounts();
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
      )

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
