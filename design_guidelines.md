# Cryptocurrency Mining Simulator - Design Guidelines

## Design Approach

**Hybrid Approach**: Combining crypto dashboard aesthetics (Binance, Coinbase) with gaming UI elements for an engaging, data-rich mining simulation experience.

**Core Philosophy**: Create a futuristic, tech-forward interface that balances real-time data visualization with gaming excitement. The design should feel like a professional crypto mining operation while maintaining playful engagement.

---

## Typography System

**Primary Font**: 'Space Grotesk' (Google Fonts) - Modern, technical aesthetic perfect for crypto/tech
**Monospace Font**: 'JetBrains Mono' (Google Fonts) - For hash displays, logs, and technical data

**Hierarchy**:
- Page Titles: text-4xl font-bold (Space Grotesk)
- Section Headers: text-2xl font-semibold
- Stats/Metrics: text-3xl font-bold (monospace for numbers)
- Body Text: text-base font-normal
- Log Entries: text-sm font-mono
- Labels: text-sm font-medium uppercase tracking-wide

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, and 12 consistently
- Component padding: p-6 or p-8
- Section gaps: gap-6 or gap-8
- Page margins: m-4 or m-8
- Vertical rhythm: space-y-6

**Grid System**:
- Desktop: 2-column layout (stats sidebar + main content area)
- Tablet: Single column with stacked sections
- Mobile: Full-width single column

---

## Mining Client Interface (index.html)

### Layout Structure

**Full-Screen Dashboard Layout**:
- Top bar: Branding + real-time stats ticker
- Main content: 3-column grid on desktop (lg:grid-cols-3), single column on mobile
  - Left Column: Mining controls + user configuration
  - Center Column: Live activity log (featured, larger)
  - Right Column: Statistics panel + leaderboard
- Bottom: Quick actions + admin link

### Key Components

**Stats Ticker (Top Bar)**:
- Fixed position header with dark treatment
- Displays: Current Block Number | Coins Balance | Mining Status | Target Difficulty
- Animated counters for numbers
- Pulsing indicator dot for active mining status
- Height: h-16

**Mining Control Panel**:
- Card-style container with distinct elevation
- Large, prominent "Start Mining" / "Stop Mining" toggle button
- Input fields for miner name and hash rate
- Visual mining status indicator (animated when active)
- Mining rate visualization (simple animated bars)

**Activity Log Panel**:
- Terminal-style display with monospace font
- Dark background treatment for contrast
- Auto-scrolling with newest entries at top
- Color-coded log entries:
  - Block discoveries: Highlighted with success treatment
  - System messages: Neutral treatment
  - Difficulty changes: Warning treatment
- Fixed height with internal scroll: h-96
- Timestamps for each entry
- Icons for different event types (🧱 blocks, ✅ solutions, 🔧 system)

**Statistics Dashboard**:
- Multi-metric display cards
- Large numbers with labels
- Visual progress indicators
- Real-time balance display with cryptocurrency styling
- Block solving history (mini timeline)
- Mining efficiency meter

**Leaderboard Section**:
- Top miners ranked by balance
- Animated position changes
- User highlight when they appear
- Medal icons for top 3 positions

---

## Admin Panel Interface (admin.html)

### Layout Structure

**Focused Admin Dashboard**:
- Centered container with max-w-2xl
- Security-first design with clear authentication section
- Two-column layout for controls and system status
- Real-time activity monitor

### Key Components

**Authentication Card**:
- Prominent lock icon
- Password input with visibility toggle
- Clear visual feedback on auth status
- Positioned at top for security emphasis

**Difficulty Control Panel**:
- Large, accessible controls
- Preset difficulty buttons (Easy, Medium, Hard, Extreme)
- Custom difficulty input with prefix validator
- Visual preview of difficulty impact
- Apply button with confirmation state

**System Status Monitor**:
- Live connection count
- Current block information
- Recent difficulty changes timeline
- System health indicators

**Admin Activity Log**:
- Similar to client log but admin-focused
- Shows all miner activities
- Difficulty change history
- Authentication attempts

---

## Visual Components Library

### Cards & Containers
- Standard elevation with subtle border
- Rounded corners: rounded-xl
- Padding: p-8
- Background treatment distinct from page background

### Buttons
**Primary Actions** (Start/Stop Mining):
- Large size: px-8 py-4
- Font: text-lg font-semibold
- Full width on mobile, auto on desktop
- Active state with scale transform

**Secondary Actions** (Admin controls):
- Standard size: px-6 py-3
- Inline with content

**Icon Buttons**:
- Square: w-10 h-10
- Centered icons

### Form Inputs
- Height: h-12
- Padding: px-4
- Monospace font for technical inputs (hash rates, targets)
- Clear labels above inputs
- Validation feedback below inputs

### Data Displays
**Metric Cards**:
- Label + value stacked vertically
- Large value display
- Icon representation
- Trend indicators where applicable

**Progress Indicators**:
- Mining progress bars
- Difficulty visualization
- Balance growth charts

---

## Responsive Behavior

**Desktop (lg:)**:
- 3-column main layout
- Side-by-side stats and controls
- Full leaderboard visible

**Tablet (md:)**:
- 2-column layout
- Stacked stats
- Collapsible panels

**Mobile (base)**:
- Single column
- Tab navigation for switching views (Mining / Stats / Log)
- Sticky action buttons
- Condensed stats ticker

---

## Interactive States

### Mining Active State
- Pulsing animation on mining indicator
- Animated hash rate visualization
- Live updating stats with smooth transitions
- Disabled configuration inputs during mining

### Real-time Updates
- Smooth fade-in for new log entries
- Counter animations for balance changes
- Block number transitions
- Celebratory animation on block solve

### Admin Actions
- Loading states for difficulty changes
- Confirmation feedback for settings applied
- Error states for auth failures

---

## Images & Icons

**Icons**: Use Heroicons (outline style) via CDN
- Mining: ChipIcon, CpuChipIcon
- Blocks: CubeIcon
- Stats: ChartBarIcon
- Admin: LockClosedIcon, CogIcon
- Success: CheckCircleIcon
- Activity: BoltIcon

**Images**: No hero images needed - this is a functional dashboard application

---

## Accessibility

- Clear focus states on all interactive elements
- Sufficient contrast for log readability
- Keyboard navigation for all controls
- Screen reader labels for icons
- Status announcements for mining events

---

## Animations

**Use Sparingly**:
- Mining status pulse (subtle, continuous during active mining)
- Balance counter increment on rewards
- Log entry fade-in
- Success celebration on block solve (brief, 1-2 seconds)

**Avoid**: Excessive scroll animations, parallax, decorative motion