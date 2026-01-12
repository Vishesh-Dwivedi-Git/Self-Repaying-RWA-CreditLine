export type ContractAddress = `0x${string}`;

export interface ContractConfig {
    address: ContractAddress;
    abi: any[];
}
