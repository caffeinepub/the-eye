# THE EYE

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full app called "THE EYE" — a Minecraft PvP server finder website
- Red and white color theme with glowing neon text effects on headings and tab labels
- "THE EYE" title with pulsing red fire glow and flicker animation
- Navigation tabs organizing servers by category:
  - **Crossplay & Survival** — 30 servers (Java + Bedrock)
  - **PvP & Lifesteal** — 20 servers (Java + Bedrock / Java Specific)
  - **Additional Popular** — extra servers (Survival/SMP, PvP/Minigames, Crossplay sub-tabs)
  - **Best & Most Played** — curated top servers with simulated player counts
  - **Ranks** — VIP ($2.99), Eggchan ($30.00), Mod (glowing purple, Discord-only)
- Each server card shows: name, IP address, tags (survival, pvp, skyblock, etc.), description, and approximate player count
- Sign In / Login buttons in top-right corner
- User profile system via authorization component
- Logged-in users can post their own servers with:
  - Server name
  - Server IP
  - At least 4 images (via blob-storage)
  - Description
  - Tags (survival, skyblock, pvp, lifesteal, bedwars, factions, anarchy, rpg, economy, minigames)
- Footer on all tabs: "vantaredmc made this for evil_eggchan :)"
- Ranks tab details:
  - VIP — $2.99, basic extra features, up to 3 server listings
  - Eggchan — $30.00, premium features, unlimited server listings
  - Mod — glowing purple badge, Discord-only role, special recognition

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Select authorization and blob-storage components
2. Generate Motoko backend:
   - User profiles with rank field (free, vip, eggchan, mod)
   - Server listing CRUD: name, ip, description, tags, imageIds (blob refs), ownerId
   - Query methods: getServersByCategory, getAllServers, getUserServers, getFeaturedServers
   - Rank purchase record keeping (mock, no real payment)
3. Frontend:
   - App shell with glowing "THE EYE" header, nav tabs, auth buttons top-right
   - Tab components: CrossplaySurvival, PvPLifesteal, AdditionalPopular, BestMostPlayed, Ranks
   - Server card component with name, ip, tags, player count badge, images carousel
   - Submit Server modal (auth-gated): form with name, ip, description, tag multi-select, image upload (min 4)
   - Ranks tab: three rank cards with pricing, features, glowing styles
   - Footer with attribution text
   - All glowing neon CSS animations for headings and tab labels
