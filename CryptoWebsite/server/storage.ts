import { randomBytes } from "crypto";

export interface CurrentBlock {
  hash: string;
  target: string;
  reward: number;
}

export interface IStorage {
  // Block management
  getCurrentBlock(): CurrentBlock;
  getBlockNumber(): number;
  generateNewBlock(): void;
  setDifficulty(target: string): void;
  
  // Miner balance management
  getMinerBalance(username: string): number;
  addCoinsToMiner(username: string, amount: number): number;
  getAllBalances(): Map<string, number>;
}

export class MemStorage implements IStorage {
  private currentBlock: CurrentBlock;
  private blockNumber: number;
  private balances: Map<string, number>;

  constructor() {
    this.currentBlock = {
      hash: randomBytes(32).toString("hex"),
      target: "0000",
      reward: 3,
    };
    this.blockNumber = 1;
    this.balances = new Map();
  }

  getCurrentBlock(): CurrentBlock {
    return { ...this.currentBlock };
  }

  getBlockNumber(): number {
    return this.blockNumber;
  }

  generateNewBlock(): void {
    this.currentBlock = {
      hash: randomBytes(32).toString("hex"),
      target: this.currentBlock.target,
      reward: this.currentBlock.reward,
    };
    this.blockNumber++;
  }

  setDifficulty(target: string): void {
    this.currentBlock.target = target;
  }

  getMinerBalance(username: string): number {
    return this.balances.get(username) || 0;
  }

  addCoinsToMiner(username: string, amount: number): number {
    const currentBalance = this.getMinerBalance(username);
    const newBalance = currentBalance + amount;
    this.balances.set(username, newBalance);
    return newBalance;
  }

  getAllBalances(): Map<string, number> {
    return new Map(this.balances);
  }
}

export const storage = new MemStorage();
