# Cryptocurrency Mining Simulator

## Project Overview
A real-time cryptocurrency mining simulator web application featuring a hybrid crypto dashboard/gaming aesthetic. Users can compete to solve SHA-256 proof-of-work blocks and earn rewards on a live leaderboard.

## Architecture
- **Frontend**: React with TypeScript, Wouter routing, shadcn/ui components
- **Backend**: Express server with WebSocket support on `/ws` endpoint
- **Storage**: In-memory storage (MemStorage) for blocks and miner balances
- **Design**: Hybrid crypto dashboard/gaming theme with dark mode support

## Key Features

### Mining Client (`/` route)
- **Stats Ticker**: Real-time display of network hash rate, total blocks, active miners
- **Mining Control Panel**: Configure hash rate (10-100 h/s), start/stop mining
- **Activity Log**: Live feed of mining events (blocks solved, difficulty changes)
- **Statistics Dashboard**: Personal stats (balance, blocks mined, hash rate)
- **Leaderboard**: Top miners ranked by balance with medal icons for top 3

### Admin Panel (`/admin` route)
- **Authentication**: Password-protected admin access (password: "admin123")
- **Difficulty Control**: Preset difficulties (None, Easy, Medium, Hard, Extreme) or custom hex prefix
- **System Monitor**: Real-time network statistics and active connections

## Technical Details

### WebSocket Messages
**Client → Server**:
- `blockSolved`: `{ user: string, hash: string }` - Submit solved block
- `setDifficulty`: `{ targetPrefix: string, password: string }` - Change mining difficulty

**Server → Client**:
- `newBlock`: New block created with number, hash, target, reward
- `blockSolved`: User solved a block with updated balance
- `difficultyChanged`: New difficulty prefix set
- `authFailed`: Admin authentication failed

### Mining Algorithm
- **Proof-of-Work**: SHA-256 hashing with configurable difficulty
- **Target Prefix**: Blocks must start with specified hex prefix (e.g., "0000")
- **Rewards**: Fixed 10 coins per block solved
- **Hash Rate**: Configurable 10-100 hashes per second

### Data Models
- **Block**: `{ blockNumber, hash, target, reward }`
- **MinerBalance**: `{ username, balance }`

## Design System
- **Primary Color**: Vibrant cyan/blue (#00D4FF)
- **Fonts**: Space Grotesk (headings), JetBrains Mono (code/numbers)
- **Theme**: Dark mode optimized with neon accents
- **Components**: Custom shadcn/ui components with hover/active states

## Routes
- `/` - Mining Client interface
- `/admin` - Admin Panel (password protected)

## Environment Variables
- `SESSION_SECRET` - Session encryption key (managed by Replit)
- Admin password is hardcoded as "admin123" in the WebSocket server

## Development
- Run `npm run dev` to start both Express and Vite servers on port 5000
- WebSocket endpoint: `ws://localhost:5000/ws` (or wss:// in production)
- Frontend binds to 0.0.0.0:5000 for Replit compatibility

## Testing Notes
- All interactive elements have unique `data-testid` attributes
- Dynamic leaderboard rows use format: `leaderboard-rank-{rank}-{username}`
- Mining events are logged in real-time to the activity feed
- WebSocket reconnection is handled automatically with exponential backoff
