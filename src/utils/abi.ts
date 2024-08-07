import { Abi } from 'viem';

export const wagmiAbi: Abi = [
  {
    inputs: [{ name: '_implementationAuthority', type: 'address' }, { name: 'initialManagementKey', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    inputs: [],
    name: 'implementationAuthority',
    outputs: [{ name: 'output', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const; 

  