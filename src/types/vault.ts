export interface Vault {
    id: string;
    collateralAmount: bigint;
    debtAmount: bigint;
    healthFactor: number;
    owner: string;
}
