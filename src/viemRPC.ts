import { createWalletClient, createPublicClient, custom, formatEther, parseEther } from 'viem';
import { mainnet, polygonAmoy, sepolia } from 'viem/chains';
import Web3 from 'web3';

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProvider } from "@web3auth/base";

const web3 = new Web3();

const ERC3643_ABI = [{ "inputs": [{ "internalType": "address", "name": "identityRegistry_", "type": "address" }, { "internalType": "address", "name": "compliance_", "type": "address" }, { "internalType": "string", "name": "name_", "type": "string" }, { "internalType": "string", "name": "symbol_", "type": "string" }, { "internalType": "uint8", "name": "decimals_", "type": "uint8" }, { "internalType": "address", "name": "onchainID_", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_userAddress", "type": "address" }, { "indexed": true, "internalType": "bool", "name": "_isFrozen", "type": "bool" }, { "indexed": true, "internalType": "address", "name": "_owner", "type": "address" }], "name": "AddressFrozen", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_compliance", "type": "address" }], "name": "ComplianceAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_identityRegistry", "type": "address" }], "name": "IdentityRegistryAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_lostWallet", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_newWallet", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_investorOnchainID", "type": "address" }], "name": "RecoverySuccess", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleRevoked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_userAddress", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "TokensFrozen", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_userAddress", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "TokensUnfrozen", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_newOnchainID", "type": "address" }], "name": "UpdatedOnchainID", "type": "event" }, { "inputs": [], "name": "AGENT_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "OWNER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "batchBurn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "fromList", "type": "address[]" }, { "internalType": "address[]", "name": "toList", "type": "address[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "batchForcedTransfer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "batchFreezePartialTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "toList", "type": "address[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "batchMint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "bool[]", "name": "freeze", "type": "bool[]" }], "name": "batchSetAddressFrozen", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "toList", "type": "address[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "batchTransfer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "fromList", "type": "address[]" }, { "internalType": "address[]", "name": "toList", "type": "address[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "batchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "batchUnfreezePartialTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "compliance", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "forcedTransfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "freezePartialTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "getFrozenTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleAdmin", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "identityRegistry", "outputs": [{ "internalType": "contract IIdentityRegistry", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "_addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "isFrozen", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "onchainID", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "lostWallet", "type": "address" }, { "internalType": "address", "name": "newWallet", "type": "address" }, { "internalType": "address", "name": "investorOnchainID", "type": "address" }], "name": "recoveryAddress", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "bool", "name": "freeze", "type": "bool" }], "name": "setAddressFrozen", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newCompliance", "type": "address" }], "name": "setCompliance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newIdentityRegistry", "type": "address" }], "name": "setIdentityRegistry", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "onchainID_", "type": "address" }], "name": "setOnchainID", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "unfreezePartialTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "pure", "type": "function" }];
const ONCHAIN_IDENTITY_ABI = [{"inputs":[{"internalType":"address","name":"initialManagementKey","type":"address"},{"internalType":"bool","name":"_isLibrary","type":"bool"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"executionId","type":"uint256"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"Approved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"claimId","type":"bytes32"},{"indexed":true,"internalType":"uint256","name":"topic","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"scheme","type":"uint256"},{"indexed":true,"internalType":"address","name":"issuer","type":"address"},{"indexed":false,"internalType":"bytes","name":"signature","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"string","name":"uri","type":"string"}],"name":"ClaimAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"claimId","type":"bytes32"},{"indexed":true,"internalType":"uint256","name":"topic","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"scheme","type":"uint256"},{"indexed":true,"internalType":"address","name":"issuer","type":"address"},{"indexed":false,"internalType":"bytes","name":"signature","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"string","name":"uri","type":"string"}],"name":"ClaimChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"claimId","type":"bytes32"},{"indexed":true,"internalType":"uint256","name":"topic","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"scheme","type":"uint256"},{"indexed":true,"internalType":"address","name":"issuer","type":"address"},{"indexed":false,"internalType":"bytes","name":"signature","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"string","name":"uri","type":"string"}],"name":"ClaimRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"executionId","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"Executed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"executionId","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"ExecutionFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"executionId","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"ExecutionRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"key","type":"bytes32"},{"indexed":true,"internalType":"uint256","name":"purpose","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"keyType","type":"uint256"}],"name":"KeyAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"key","type":"bytes32"},{"indexed":true,"internalType":"uint256","name":"purpose","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"keyType","type":"uint256"}],"name":"KeyRemoved","type":"event"},{"inputs":[{"internalType":"uint256","name":"_topic","type":"uint256"},{"internalType":"uint256","name":"_scheme","type":"uint256"},{"internalType":"address","name":"_issuer","type":"address"},{"internalType":"bytes","name":"_signature","type":"bytes"},{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"string","name":"_uri","type":"string"}],"name":"addClaim","outputs":[{"internalType":"bytes32","name":"claimRequestId","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"uint256","name":"_purpose","type":"uint256"},{"internalType":"uint256","name":"_type","type":"uint256"}],"name":"addKey","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"bool","name":"_approve","type":"bool"}],"name":"approve","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"execute","outputs":[{"internalType":"uint256","name":"executionId","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_claimId","type":"bytes32"}],"name":"getClaim","outputs":[{"internalType":"uint256","name":"topic","type":"uint256"},{"internalType":"uint256","name":"scheme","type":"uint256"},{"internalType":"address","name":"issuer","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"string","name":"uri","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_topic","type":"uint256"}],"name":"getClaimIdsByTopic","outputs":[{"internalType":"bytes32[]","name":"claimIds","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getKey","outputs":[{"internalType":"uint256[]","name":"purposes","type":"uint256[]"},{"internalType":"uint256","name":"keyType","type":"uint256"},{"internalType":"bytes32","name":"key","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getKeyPurposes","outputs":[{"internalType":"uint256[]","name":"_purposes","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_purpose","type":"uint256"}],"name":"getKeysByPurpose","outputs":[{"internalType":"bytes32[]","name":"keys","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"sig","type":"bytes"},{"internalType":"bytes32","name":"dataHash","type":"bytes32"}],"name":"getRecoveredAddress","outputs":[{"internalType":"address","name":"addr","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"initialManagementKey","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IIdentity","name":"_identity","type":"address"},{"internalType":"uint256","name":"claimTopic","type":"uint256"},{"internalType":"bytes","name":"sig","type":"bytes"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"isClaimValid","outputs":[{"internalType":"bool","name":"claimValid","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"uint256","name":"_purpose","type":"uint256"}],"name":"keyHasPurpose","outputs":[{"internalType":"bool","name":"result","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_claimId","type":"bytes32"}],"name":"removeClaim","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"uint256","name":"_purpose","type":"uint256"}],"name":"removeKey","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"}];
const IDENTITY_REGISTRY_ABI = [{"inputs":[{"internalType":"contract IClaimIssuersRegistry","name":"_claimIssuersRegistry","type":"address"},{"internalType":"contract IClaimTopicsRegistry","name":"_claimTopicsRegistry","type":"address"},{"internalType":"contract IIdentityRegistryStorage","name":"_identityStorage","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IClaimIssuersRegistry","name":"claimIssuersRegistry","type":"address"}],"name":"ClaimIssuersRegistrySet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IClaimTopicsRegistry","name":"claimTopicsRegistry","type":"address"}],"name":"ClaimTopicsRegistrySet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"investorAddress","type":"address"},{"indexed":true,"internalType":"uint16","name":"country","type":"uint16"}],"name":"CountryUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"investorAddress","type":"address"},{"indexed":true,"internalType":"contract IIdentity","name":"identity","type":"address"}],"name":"IdentityRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"investorAddress","type":"address"},{"indexed":true,"internalType":"contract IIdentity","name":"identity","type":"address"}],"name":"IdentityRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IIdentityRegistryStorage","name":"identityStorage","type":"address"}],"name":"IdentityStorageSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IIdentity","name":"oldIdentity","type":"address"},{"indexed":true,"internalType":"contract IIdentity","name":"newIdentity","type":"address"}],"name":"IdentityUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"inputs":[],"name":"AGENT_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"OWNER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"_userAddresses","type":"address[]"},{"internalType":"contract IIdentity[]","name":"_identities","type":"address[]"},{"internalType":"uint16[]","name":"_countries","type":"uint16[]"}],"name":"batchRegisterIdentity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"contains","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"deleteIdentity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"identity","outputs":[{"internalType":"contract IIdentity","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"identityStorage","outputs":[{"internalType":"contract IIdentityRegistryStorage","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"investorCountry","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"isVerified","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"issuersRegistry","outputs":[{"internalType":"contract IClaimIssuersRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"},{"internalType":"contract IIdentity","name":"_identity","type":"address"},{"internalType":"uint16","name":"_country","type":"uint16"}],"name":"registerIdentity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IClaimIssuersRegistry","name":"_claimIssuersRegistry","type":"address"}],"name":"setClaimIssuersRegistry","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IClaimTopicsRegistry","name":"_claimTopicsRegistry","type":"address"}],"name":"setClaimTopicsRegistry","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IIdentityRegistryStorage","name":"_identityRegistryStorage","type":"address"}],"name":"setIdentityRegistryStorage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"topicsRegistry","outputs":[{"internalType":"contract IClaimTopicsRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"},{"internalType":"uint16","name":"_country","type":"uint16"}],"name":"updateCountry","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"},{"internalType":"contract IIdentity","name":"_identity","type":"address"}],"name":"updateIdentity","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const tokenSmartContractAddress = "0x60E5799fed9ACbdaF36e752a05468f1519b03c6f";
const identityRegistrySmartContractAddress = "0x4ec843f44d361b1bDCba588705c6E218965232da";

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
          args: [ web3.utils.keccak256(
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

  async smartContractRegisterIdentity(walletAddress: any, identityAddress:any, country:any): Promise<any> {
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
