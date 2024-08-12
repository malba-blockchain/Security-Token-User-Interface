import { createWalletClient, createPublicClient, custom, formatEther, parseEther } from 'viem';
import { mainnet, polygonAmoy, sepolia } from 'viem/chains';
import Web3 from 'web3';
import { wagmiAbi } from './utils/abi';
import type { IProvider } from '@web3auth/base';
require('dotenv').config();

const privKey_claimIssuerSigningKey = process.env.REACT_APP_CLAIM_ISSUER_SIGNING_KEY || "";
const web3 = new Web3();

const ERC3643_ABI = [{ "inputs": [{ "internalType": "address", "name": "identityRegistry_", "type": "address" }, { "internalType": "address", "name": "compliance_", "type": "address" }, { "internalType": "string", "name": "name_", "type": "string" }, { "internalType": "string", "name": "symbol_", "type": "string" }, { "internalType": "uint8", "name": "decimals_", "type": "uint8" }, { "internalType": "address", "name": "onchainID_", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_userAddress", "type": "address" }, { "indexed": true, "internalType": "bool", "name": "_isFrozen", "type": "bool" }, { "indexed": true, "internalType": "address", "name": "_owner", "type": "address" }], "name": "AddressFrozen", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_compliance", "type": "address" }], "name": "ComplianceAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_identityRegistry", "type": "address" }], "name": "IdentityRegistryAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_lostWallet", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_newWallet", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_investorOnchainID", "type": "address" }], "name": "RecoverySuccess", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleRevoked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_userAddress", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "TokensFrozen", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_userAddress", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "TokensUnfrozen", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_newOnchainID", "type": "address" }], "name": "UpdatedOnchainID", "type": "event" }, { "inputs": [], "name": "AGENT_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "OWNER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "batchBurn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "fromList", "type": "address[]" }, { "internalType": "address[]", "name": "toList", "type": "address[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "batchForcedTransfer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "batchFreezePartialTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "toList", "type": "address[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "batchMint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "bool[]", "name": "freeze", "type": "bool[]" }], "name": "batchSetAddressFrozen", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "toList", "type": "address[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "batchTransfer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "fromList", "type": "address[]" }, { "internalType": "address[]", "name": "toList", "type": "address[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "batchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "batchUnfreezePartialTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "compliance", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "forcedTransfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "freezePartialTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "getFrozenTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleAdmin", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "identityRegistry", "outputs": [{ "internalType": "contract IIdentityRegistry", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "_addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "isFrozen", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "onchainID", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "lostWallet", "type": "address" }, { "internalType": "address", "name": "newWallet", "type": "address" }, { "internalType": "address", "name": "investorOnchainID", "type": "address" }], "name": "recoveryAddress", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "bool", "name": "freeze", "type": "bool" }], "name": "setAddressFrozen", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newCompliance", "type": "address" }], "name": "setCompliance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newIdentityRegistry", "type": "address" }], "name": "setIdentityRegistry", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "onchainID_", "type": "address" }], "name": "setOnchainID", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "unfreezePartialTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "pure", "type": "function" }];
const ONCHAIN_IDENTITY_ABI = [{ "inputs": [{ "internalType": "address", "name": "initialManagementKey", "type": "address" }, { "internalType": "bool", "name": "_isLibrary", "type": "bool" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "executionId", "type": "uint256" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "Approved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "claimId", "type": "bytes32" }, { "indexed": true, "internalType": "uint256", "name": "topic", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "scheme", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "issuer", "type": "address" }, { "indexed": false, "internalType": "bytes", "name": "signature", "type": "bytes" }, { "indexed": false, "internalType": "bytes", "name": "data", "type": "bytes" }, { "indexed": false, "internalType": "string", "name": "uri", "type": "string" }], "name": "ClaimAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "claimId", "type": "bytes32" }, { "indexed": true, "internalType": "uint256", "name": "topic", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "scheme", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "issuer", "type": "address" }, { "indexed": false, "internalType": "bytes", "name": "signature", "type": "bytes" }, { "indexed": false, "internalType": "bytes", "name": "data", "type": "bytes" }, { "indexed": false, "internalType": "string", "name": "uri", "type": "string" }], "name": "ClaimChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "claimId", "type": "bytes32" }, { "indexed": true, "internalType": "uint256", "name": "topic", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "scheme", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "issuer", "type": "address" }, { "indexed": false, "internalType": "bytes", "name": "signature", "type": "bytes" }, { "indexed": false, "internalType": "bytes", "name": "data", "type": "bytes" }, { "indexed": false, "internalType": "string", "name": "uri", "type": "string" }], "name": "ClaimRemoved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "executionId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "value", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "Executed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "executionId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "value", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "ExecutionFailed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "executionId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "value", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "ExecutionRequested", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "key", "type": "bytes32" }, { "indexed": true, "internalType": "uint256", "name": "purpose", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "keyType", "type": "uint256" }], "name": "KeyAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "key", "type": "bytes32" }, { "indexed": true, "internalType": "uint256", "name": "purpose", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "keyType", "type": "uint256" }], "name": "KeyRemoved", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_topic", "type": "uint256" }, { "internalType": "uint256", "name": "_scheme", "type": "uint256" }, { "internalType": "address", "name": "_issuer", "type": "address" }, { "internalType": "bytes", "name": "_signature", "type": "bytes" }, { "internalType": "bytes", "name": "_data", "type": "bytes" }, { "internalType": "string", "name": "_uri", "type": "string" }], "name": "addClaim", "outputs": [{ "internalType": "bytes32", "name": "claimRequestId", "type": "bytes32" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }, { "internalType": "uint256", "name": "_purpose", "type": "uint256" }, { "internalType": "uint256", "name": "_type", "type": "uint256" }], "name": "addKey", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "bool", "name": "_approve", "type": "bool" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" }], "name": "execute", "outputs": [{ "internalType": "uint256", "name": "executionId", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_claimId", "type": "bytes32" }], "name": "getClaim", "outputs": [{ "internalType": "uint256", "name": "topic", "type": "uint256" }, { "internalType": "uint256", "name": "scheme", "type": "uint256" }, { "internalType": "address", "name": "issuer", "type": "address" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }, { "internalType": "bytes", "name": "data", "type": "bytes" }, { "internalType": "string", "name": "uri", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_topic", "type": "uint256" }], "name": "getClaimIdsByTopic", "outputs": [{ "internalType": "bytes32[]", "name": "claimIds", "type": "bytes32[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "getKey", "outputs": [{ "internalType": "uint256[]", "name": "purposes", "type": "uint256[]" }, { "internalType": "uint256", "name": "keyType", "type": "uint256" }, { "internalType": "bytes32", "name": "key", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "getKeyPurposes", "outputs": [{ "internalType": "uint256[]", "name": "_purposes", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_purpose", "type": "uint256" }], "name": "getKeysByPurpose", "outputs": [{ "internalType": "bytes32[]", "name": "keys", "type": "bytes32[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "sig", "type": "bytes" }, { "internalType": "bytes32", "name": "dataHash", "type": "bytes32" }], "name": "getRecoveredAddress", "outputs": [{ "internalType": "address", "name": "addr", "type": "address" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "initialManagementKey", "type": "address" }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IIdentity", "name": "_identity", "type": "address" }, { "internalType": "uint256", "name": "claimTopic", "type": "uint256" }, { "internalType": "bytes", "name": "sig", "type": "bytes" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "isClaimValid", "outputs": [{ "internalType": "bool", "name": "claimValid", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }, { "internalType": "uint256", "name": "_purpose", "type": "uint256" }], "name": "keyHasPurpose", "outputs": [{ "internalType": "bool", "name": "result", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_claimId", "type": "bytes32" }], "name": "removeClaim", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }, { "internalType": "uint256", "name": "_purpose", "type": "uint256" }], "name": "removeKey", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "pure", "type": "function" }];
const IDENTITY_REGISTRY_ABI = [{ "inputs": [{ "internalType": "contract IClaimIssuersRegistry", "name": "_claimIssuersRegistry", "type": "address" }, { "internalType": "contract IClaimTopicsRegistry", "name": "_claimTopicsRegistry", "type": "address" }, { "internalType": "contract IIdentityRegistryStorage", "name": "_identityStorage", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "contract IClaimIssuersRegistry", "name": "claimIssuersRegistry", "type": "address" }], "name": "ClaimIssuersRegistrySet", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "contract IClaimTopicsRegistry", "name": "claimTopicsRegistry", "type": "address" }], "name": "ClaimTopicsRegistrySet", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "investorAddress", "type": "address" }, { "indexed": true, "internalType": "uint16", "name": "country", "type": "uint16" }], "name": "CountryUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "investorAddress", "type": "address" }, { "indexed": true, "internalType": "contract IIdentity", "name": "identity", "type": "address" }], "name": "IdentityRegistered", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "investorAddress", "type": "address" }, { "indexed": true, "internalType": "contract IIdentity", "name": "identity", "type": "address" }], "name": "IdentityRemoved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "contract IIdentityRegistryStorage", "name": "identityStorage", "type": "address" }], "name": "IdentityStorageSet", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "contract IIdentity", "name": "oldIdentity", "type": "address" }, { "indexed": true, "internalType": "contract IIdentity", "name": "newIdentity", "type": "address" }], "name": "IdentityUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleRevoked", "type": "event" }, { "inputs": [], "name": "AGENT_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "OWNER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "_userAddresses", "type": "address[]" }, { "internalType": "contract IIdentity[]", "name": "_identities", "type": "address[]" }, { "internalType": "uint16[]", "name": "_countries", "type": "uint16[]" }], "name": "batchRegisterIdentity", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }], "name": "contains", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }], "name": "deleteIdentity", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleAdmin", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }], "name": "identity", "outputs": [{ "internalType": "contract IIdentity", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "identityStorage", "outputs": [{ "internalType": "contract IIdentityRegistryStorage", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }], "name": "investorCountry", "outputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }], "name": "isVerified", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "issuersRegistry", "outputs": [{ "internalType": "contract IClaimIssuersRegistry", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }, { "internalType": "contract IIdentity", "name": "_identity", "type": "address" }, { "internalType": "uint16", "name": "_country", "type": "uint16" }], "name": "registerIdentity", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IClaimIssuersRegistry", "name": "_claimIssuersRegistry", "type": "address" }], "name": "setClaimIssuersRegistry", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IClaimTopicsRegistry", "name": "_claimTopicsRegistry", "type": "address" }], "name": "setClaimTopicsRegistry", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IIdentityRegistryStorage", "name": "_identityRegistryStorage", "type": "address" }], "name": "setIdentityRegistryStorage", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "topicsRegistry", "outputs": [{ "internalType": "contract IClaimTopicsRegistry", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }, { "internalType": "uint16", "name": "_country", "type": "uint16" }], "name": "updateCountry", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }, { "internalType": "contract IIdentity", "name": "_identity", "type": "address" }], "name": "updateIdentity", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
const CLAIM_ISSUER_ABI = [{"inputs":[{"internalType":"address","name":"initialManagementKey","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"executionId","type":"uint256"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"Approved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"claimId","type":"bytes32"},{"indexed":true,"internalType":"uint256","name":"topic","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"scheme","type":"uint256"},{"indexed":true,"internalType":"address","name":"issuer","type":"address"},{"indexed":false,"internalType":"bytes","name":"signature","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"string","name":"uri","type":"string"}],"name":"ClaimAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"claimId","type":"bytes32"},{"indexed":true,"internalType":"uint256","name":"topic","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"scheme","type":"uint256"},{"indexed":true,"internalType":"address","name":"issuer","type":"address"},{"indexed":false,"internalType":"bytes","name":"signature","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"string","name":"uri","type":"string"}],"name":"ClaimChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"claimId","type":"bytes32"},{"indexed":true,"internalType":"uint256","name":"topic","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"scheme","type":"uint256"},{"indexed":true,"internalType":"address","name":"issuer","type":"address"},{"indexed":false,"internalType":"bytes","name":"signature","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"string","name":"uri","type":"string"}],"name":"ClaimRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes","name":"signature","type":"bytes"}],"name":"ClaimRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"executionId","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"Executed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"executionId","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"ExecutionFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"executionId","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"ExecutionRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"key","type":"bytes32"},{"indexed":true,"internalType":"uint256","name":"purpose","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"keyType","type":"uint256"}],"name":"KeyAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"key","type":"bytes32"},{"indexed":true,"internalType":"uint256","name":"purpose","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"keyType","type":"uint256"}],"name":"KeyRemoved","type":"event"},{"inputs":[{"internalType":"uint256","name":"_topic","type":"uint256"},{"internalType":"uint256","name":"_scheme","type":"uint256"},{"internalType":"address","name":"_issuer","type":"address"},{"internalType":"bytes","name":"_signature","type":"bytes"},{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"string","name":"_uri","type":"string"}],"name":"addClaim","outputs":[{"internalType":"bytes32","name":"claimRequestId","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"uint256","name":"_purpose","type":"uint256"},{"internalType":"uint256","name":"_type","type":"uint256"}],"name":"addKey","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"bool","name":"_approve","type":"bool"}],"name":"approve","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"execute","outputs":[{"internalType":"uint256","name":"executionId","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_claimId","type":"bytes32"}],"name":"getClaim","outputs":[{"internalType":"uint256","name":"topic","type":"uint256"},{"internalType":"uint256","name":"scheme","type":"uint256"},{"internalType":"address","name":"issuer","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"string","name":"uri","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_topic","type":"uint256"}],"name":"getClaimIdsByTopic","outputs":[{"internalType":"bytes32[]","name":"claimIds","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getKey","outputs":[{"internalType":"uint256[]","name":"purposes","type":"uint256[]"},{"internalType":"uint256","name":"keyType","type":"uint256"},{"internalType":"bytes32","name":"key","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getKeyPurposes","outputs":[{"internalType":"uint256[]","name":"_purposes","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_purpose","type":"uint256"}],"name":"getKeysByPurpose","outputs":[{"internalType":"bytes32[]","name":"keys","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"sig","type":"bytes"},{"internalType":"bytes32","name":"dataHash","type":"bytes32"}],"name":"getRecoveredAddress","outputs":[{"internalType":"address","name":"addr","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"initialManagementKey","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"_sig","type":"bytes"}],"name":"isClaimRevoked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IIdentity","name":"_identity","type":"address"},{"internalType":"uint256","name":"claimTopic","type":"uint256"},{"internalType":"bytes","name":"sig","type":"bytes"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"isClaimValid","outputs":[{"internalType":"bool","name":"claimValid","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"uint256","name":"_purpose","type":"uint256"}],"name":"keyHasPurpose","outputs":[{"internalType":"bool","name":"result","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_claimId","type":"bytes32"}],"name":"removeClaim","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"uint256","name":"_purpose","type":"uint256"}],"name":"removeKey","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_claimId","type":"bytes32"},{"internalType":"address","name":"_identity","type":"address"}],"name":"revokeClaim","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"revokeClaimBySignature","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"","type":"bytes"}],"name":"revokedClaims","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"}]

const IDENTITY_PROXY_BYTECODE = '0x608060405234801561001057600080fd5b506040516107723803806107728339818101604052810190610032919061034a565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036100a1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610098906103e7565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610110576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610107906103e7565b60405180910390fd5b817f821f3e4d3d679f19eacc940c87acf846ea6eae24a63058ea750304437a62aafc5560008273ffffffffffffffffffffffffffffffffffffffff1663aaf10f426040518163ffffffff1660e01b8152600401602060405180830381865afa158015610180573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101a49190610407565b905060008173ffffffffffffffffffffffffffffffffffffffff16836040516024016101d09190610443565b6040516020818303038152906040527fc4d66de8000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505060405161025a91906104cf565b600060405180830381855af49150503d8060008114610295576040519150601f19603f3d011682016040523d82523d6000602084013e61029a565b606091505b50509050806102de576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102d590610532565b60405180910390fd5b50505050610552565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610317826102ec565b9050919050565b6103278161030c565b811461033257600080fd5b50565b6000815190506103448161031e565b92915050565b60008060408385031215610361576103606102e7565b5b600061036f85828601610335565b925050602061038085828601610335565b9150509250929050565b600082825260208201905092915050565b7f696e76616c696420617267756d656e74202d207a65726f206164647265737300600082015250565b60006103d1601f8361038a565b91506103dc8261039b565b602082019050919050565b60006020820190508181036000830152610400816103c4565b9050919050565b60006020828403121561041d5761041c6102e7565b5b600061042b84828501610335565b91505092915050565b61043d8161030c565b82525050565b60006020820190506104586000830184610434565b92915050565b600081519050919050565b600081905092915050565b60005b83811015610492578082015181840152602081019050610477565b60008484015250505050565b60006104a98261045e565b6104b38185610469565b93506104c3818560208601610474565b80840191505092915050565b60006104db828461049e565b915081905092915050565b7f496e697469616c697a6174696f6e206661696c65642e00000000000000000000600082015250565b600061051c60168361038a565b9150610527826104e6565b602082019050919050565b6000602082019050818103600083015261054b8161050f565b9050919050565b610211806105616000396000f3fe6080604052600436106100225760003560e01c80632307f882146100c857610023565b5b600061002d6100f3565b73ffffffffffffffffffffffffffffffffffffffff1663aaf10f426040518163ffffffff1660e01b8152600401602060405180830381865afa158015610077573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061009b9190610184565b90503660008037600080366000846127105a03f43d806000803e81600081146100c357816000f35b816000fd5b3480156100d457600080fd5b506100dd6100f3565b6040516100ea91906101c0565b60405180910390f35b6000807f821f3e4d3d679f19eacc940c87acf846ea6eae24a63058ea750304437a62aafc5490508091505090565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061015182610126565b9050919050565b61016181610146565b811461016c57600080fd5b50565b60008151905061017e81610158565b92915050565b60006020828403121561019a57610199610121565b5b60006101a88482850161016f565b91505092915050565b6101ba81610146565b82525050565b60006020820190506101d560008301846101b1565b9291505056fea264697066735822122087108c0e411bfe27737deb09117917821789f7599cced8134d2683b7969e34ae64736f6c63430008110033';

const tokenSmartContractAddress = "0x60E5799fed9ACbdaF36e752a05468f1519b03c6f";
const identityRegistrySmartContractAddress = "0x4ec843f44d361b1bDCba588705c6E218965232da";
const identityImplementationAuthorityAddress = "0x35A2980A60ddbDc8d4Da08DCf1d7cD4dbE3fC5A7";
const claimIssuerContractAddress = "0x94D2Ec1a787d97d0a4A86b8d04217f66afd23caA";


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

      return await walletClient.getAddresses();
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
      console.log(balance);
      return formatEther(balance);
    } catch (error) {
      console.error(error);
      return error as string;
    }
  }

  async getTokenAddress(): Promise<string> {
      return tokenSmartContractAddress;
  }

  async getAgentRole(): Promise<string> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider)
      })

      const agentRole: string = await publicClient.readContract({
        address: tokenSmartContractAddress,
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
        address: tokenSmartContractAddress,
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
        address: tokenSmartContractAddress,
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
        address: tokenSmartContractAddress,
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
        address: tokenSmartContractAddress,
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
        address: tokenSmartContractAddress,
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
        address: tokenSmartContractAddress,
        abi: ERC3643_ABI,
        functionName: 'ge',
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
        address: tokenSmartContractAddress,
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
        address: identityRegistrySmartContractAddress,
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
        address: tokenSmartContractAddress,
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
        address: tokenSmartContractAddress,
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
        address: tokenSmartContractAddress,
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
        address: identityRegistrySmartContractAddress,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'identity',
        args: [walletAddress]
      }) as unknown as string;

      return identityOfAccount; // Convert balance from wei to ether
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
        address: identityRegistrySmartContractAddress,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'investorCountry',
        args: [walletAddress]
      }) as unknown as string;

      return investorCountry; // Convert balance from wei to ether
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
        address: identityRegistrySmartContractAddress,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'isVerified',
        args: [walletAddress]
      }) as unknown as string;

      return isVerified; // Convert balance from wei to ether
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
        address: tokenSmartContractAddress,
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
        address: tokenSmartContractAddress,
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
        address: tokenSmartContractAddress,
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
        address: tokenSmartContractAddress,
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
        address: tokenSmartContractAddress,
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
        address: tokenSmartContractAddress,
        abi: ERC3643_ABI,
        functionName: 'totalSupply',
      }) as unknown as string;

      return web3.utils.fromWei(totalSupply, 'mwei'); // Convert balance from wei to ether;
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
      const address = await this.getAccounts();

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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'approve',
          args: [spenderAddress, amount]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const result = "Approved: " + dataDecimal.toString() + ", to: " + spenderAddress;

      return this.toObject(result);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'batchFreezePartialTokens',
          args: [_addressesList, _amounts]
        }
      )
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'batchMint',
          args: [_addressesList, _amounts]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      //const dataDecimal = BigInt(receipt.logs[0].data);
      //const result = "Minted: " + dataDecimal.toString() + ", to: "+ ;

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'batchSetAddressFrozen',
          args: [_addressesList, _booleanList]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      //const dataDecimal = BigInt(receipt.logs[0].data);
      //const result = "Minted: " + dataDecimal.toString() + ", to: "+ ;

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'batchBurn',
          args: [_addressesList, _amounts]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'batchForcedTransfer',
          args: [_fromList, _addressesList, _amounts]
        }
      )
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: identityRegistrySmartContractAddress,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'batchRegisterIdentity',
          args: [_addressesList, _identitiesList, _countriesList]
        }
      )
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
    } catch (error) {
      return error;
    }
  }

  async smartContractBatchTransfer(_addressesList: any, _amounts: any): Promise<any> {
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
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'batchTransfer',
          args: [_addressesList, _amounts]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
    } catch (error) {
      return error;
    }
  }

  async smartContractBatchTransferFrom(_fromList: any, _addressesList: any, _amounts: any): Promise<any> {
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
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'batchTransferFrom',
          args: [_fromList, _addressesList, _amounts]
        }
      )
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
    } catch (error) {
      return error;
    }
  }

  async smartContractBatchUnfreezePartialTokens(_addressesList: any, _amounts: any): Promise<any> {
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
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'batchUnfreezePartialTokens',
          args: [_addressesList, _amounts]
        }
      )
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'burn',
          args: [walletAddress, amount]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const result = "Burned: " + dataDecimal.toString() + ", from: " + walletAddress;

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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'forcedTransfer',
          args: [ownerAddress, spenderAddress, amount]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const result = "Forced transfer: " + dataDecimal.toString() + " from: " + ownerAddress + ", to: " + spenderAddress;

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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'decreaseAllowance',
          args: [spenderAddress, amount]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const result = "Total allowance: " + dataDecimal.toString() + ", to: " + spenderAddress;

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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'freezePartialTokens',
          args: [walletAddress, amount]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const result = "Freezed: " + dataDecimal.toString() + ", to: " + walletAddress;

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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'increaseAllowance',
          args: [spenderAddress, amount]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const result = "Total allowance: " + dataDecimal.toString() + ", to: " + spenderAddress;

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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'mint',
          args: [walletAddress, amount]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const result = "Minted: " + dataDecimal.toString() + ", to: " + walletAddress;

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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'recoveryAddress',
          args: [lostWalletAddress, newWalletAddress, investorOnchainID]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
    } catch (error) {
      return error;
    }
  }

  async smartContractRenounceRole(role: any, walletAddress: any): Promise<any> {
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
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'renounceRole',
          args: [role, walletAddress]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
    } catch (error) {
      return error;
    }
  }

  async smartContractRevokeRole(role: any, walletAddress: any): Promise<any> {
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
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'revokeRole',
          args: [role, walletAddress]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'grantRole',
          args: [role, walletAddress]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: identityRegistrySmartContractAddress,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'grantRole',
          args: [role, walletAddress]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: identityRegistrySmartContractAddress,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'renounceRole',
          args: [role, walletAddress]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: identityRegistrySmartContractAddress,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'revokeRole',
          args: [role, walletAddress]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: identityRegistrySmartContractAddress,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'updateCountry',
          args: [walletAddress, country]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: identityRegistrySmartContractAddress,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'updateIdentity',
          args: [walletAddress, identity]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'setAddressFrozen',
          args: [walletAddress, boolValue]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'setOnchainID',
          args: [onchainIDValue]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'transfer',
          args: [walletAddress, amount]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const result = "Transfered: " + dataDecimal.toString() + ", to: " + walletAddress;

      return this.toObject(result);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'transferFrom',
          args: [ownerAddress, walletAddress, amount]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'unfreezePartialTokens',
          args: [walletAddress, amount]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const dataDecimal = BigInt(receipt.logs[0].data);

      const result = "Unfreezed: " + dataDecimal.toString() + ", to: " + walletAddress;

      return this.toObject(result);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: identityRegistrySmartContractAddress,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'deleteIdentity',
          args: [walletAddress]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: identityRegistrySmartContractAddress,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'registerIdentity',
          args: [walletAddress, identityAddress, country]
        }
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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
        issuer: claimIssuerContractAddress, // Address of the ClaimIssuer contract
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
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      return this.toObject(claimDetails);
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

      const claimDetails: string = await publicClient.readContract({
        address: identityAddress,
        abi: ONCHAIN_IDENTITY_ABI,
        functionName: 'getClaimIdsByTopic',
        args: [
          topic //Claim Id
        ]
      }) as unknown as string;

      return this.toObject(claimDetails);
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
        address: claimIssuerContractAddress,
        abi: CLAIM_ISSUER_ABI,
        functionName: 'isClaimValid',
        args: [ 
          identityAddress,
          topic,  //Claim Id
          signature,
          data
        ]
      }) as unknown as string;

      return this.toObject(isClaimValid);
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
        address: claimIssuerContractAddress,
        abi: CLAIM_ISSUER_ABI,
        functionName: 'isClaimRevoked',
        args: [ 
          signature
        ]
      }) as unknown as string;

      return this.toObject(isClaimRevoked);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'pause',
        }
      )
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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

      // Submit transaction to the blockchain
      const hash = await walletClient.writeContract(
        {
          account: '0x7a82c50eDDc576d5Cd26b530424D7d465D311bB9',
          address: tokenSmartContractAddress,
          abi: ERC3643_ABI,
          functionName: 'unpause',
        }
      )
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
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
        abi: wagmiAbi,
        account: address[0],
        args: [identityImplementationAuthorityAddress, walletAddress],
        bytecode: IDENTITY_PROXY_BYTECODE,
      })

      // Wait for the transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const identityProxyAddress = receipt.contractAddress;

      // Return the deployed contract address
      return "Deployed smart contract identity address:" + identityProxyAddress;

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
