import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Block table - represents a mining block
export const blocks = pgTable("blocks", {
  blockNumber: integer("block_number").notNull(),
  hash: text("hash").notNull(),
  target: text("target").notNull(),
  reward: integer("reward").notNull(),
});

export const insertBlockSchema = createInsertSchema(blocks).omit({
  blockNumber: true,
});

export type InsertBlock = z.infer<typeof insertBlockSchema>;
export type Block = typeof blocks.$inferSelect;

// Miner balance table - tracks miner earnings
export const minerBalances = pgTable("miner_balances", {
  username: text("username").primaryKey().notNull(),
  balance: integer("balance").notNull().default(0),
});

export const insertMinerBalanceSchema = createInsertSchema(minerBalances);

export type InsertMinerBalance = z.infer<typeof insertMinerBalanceSchema>;
export type MinerBalance = typeof minerBalances.$inferSelect;

// WebSocket message schemas
export const blockSolvedMessageSchema = z.object({
  user: z.string(),
  hash: z.string(),
});

export type BlockSolvedMessage = z.infer<typeof blockSolvedMessageSchema>;

export const setDifficultyMessageSchema = z.object({
  targetPrefix: z.string(),
  password: z.string(),
});

export type SetDifficultyMessage = z.infer<typeof setDifficultyMessageSchema>;

// Server response schemas
export const newBlockResponseSchema = z.object({
  blockNumber: z.number(),
  currentBlock: z.object({
    hash: z.string(),
    target: z.string(),
    reward: z.number(),
  }),
});

export type NewBlockResponse = z.infer<typeof newBlockResponseSchema>;

export const blockSolvedResponseSchema = z.object({
  user: z.string(),
  hash: z.string(),
  newBalance: z.number(),
  blockNumber: z.number(),
});

export type BlockSolvedResponse = z.infer<typeof blockSolvedResponseSchema>;

export const difficultyChangedResponseSchema = z.object({
  targetPrefix: z.string(),
});

export type DifficultyChangedResponse = z.infer<typeof difficultyChangedResponseSchema>;

export const authFailedResponseSchema = z.object({
  message: z.string(),
});

export type AuthFailedResponse = z.infer<typeof authFailedResponseSchema>;

// Mining event schema for frontend logging
export const miningEventSchema = z.object({
  type: z.enum(['blockSolved', 'newBlock', 'difficultyChanged', 'authFailed']),
  timestamp: z.number(),
  user: z.string().optional(),
  blockNumber: z.number().optional(),
  hash: z.string().optional(),
  newBalance: z.number().optional(),
  targetPrefix: z.string().optional(),
  message: z.string().optional(),
});

export type MiningEvent = z.infer<typeof miningEventSchema>;
