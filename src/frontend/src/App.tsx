import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Eye,
  Loader2,
  LogOut,
  Search,
  ServerIcon,
  Wifi,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import BestTab from "./components/BestTab";
import RanksTab from "./components/RanksTab";
import SectionHeader from "./components/SectionHeader";
import ServerCard from "./components/ServerCard";
import SubmitServerTab from "./components/SubmitServerTab";
import { ALL_SERVERS } from "./data/serverData";
import type { ServerWithPlayers } from "./data/serverData";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useAllServers } from "./hooks/useQueries";
import type { Server } from "./hooks/useQueries";

// Merge backend servers with player counts from static data
function mergeWithPlayers(backendServers: Server[]): ServerWithPlayers[] {
  return backendServers.map((bs) => {
    const match = ALL_SERVERS.find((s) => s.ip === bs.ip);
    return {
      ...bs,
      players: match?.players ?? Math.floor(Math.random() * 2000) + 200,
    };
  });
}

function filterServers(
  servers: ServerWithPlayers[],
  query: string,
): ServerWithPlayers[] {
  if (!query.trim()) return servers;
  const q = query.toLowerCase();
  return servers.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.ip.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q)) ||
      s.subcategory.toLowerCase().includes(q),
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function ServerGridSkeleton() {
  return (
    <div
      data-ocid="servers.loading_state"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map((key) => (
        <div
          key={key}
          className="rounded-lg p-5 border border-border bg-card space-y-3"
        >
          <Skeleton className="h-5 w-3/4 bg-muted" />
          <Skeleton className="h-4 w-full bg-muted" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full bg-muted" />
            <Skeleton className="h-5 w-20 rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ query }: { query: string }) {
  return (
    <div
      data-ocid="servers.empty_state"
      className="flex flex-col items-center justify-center py-20 gap-4"
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{
          background: "oklch(0.52 0.21 25 / 0.1)",
          border: "1px solid oklch(0.52 0.21 25 / 0.25)",
        }}
      >
        <ServerIcon
          className="w-8 h-8"
          style={{ color: "oklch(0.52 0.21 25)" }}
        />
      </div>
      <p
        className="text-sm text-center max-w-xs"
        style={{ color: "oklch(0.5 0.04 25)" }}
      >
        {query
          ? `No servers matching "${query}"`
          : "No servers in this category yet."}
      </p>
    </div>
  );
}

// ─── Server Grid ──────────────────────────────────────────────────────────────
function ServerGrid({ servers }: { servers: ServerWithPlayers[] }) {
  if (servers.length === 0) return <EmptyState query="" />;
  return (
    <div
      data-ocid="servers.list"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <AnimatePresence mode="popLayout">
        {servers.map((server, idx) => (
          <motion.div
            key={server.ip + server.name}
            data-ocid={`server.item.${idx + 1}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
          >
            <ServerCard server={server} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Additional Tab — sectioned ───────────────────────────────────────────────
type SubSection = "All" | "Survival/SMP" | "PvP/Minigames" | "Crossplay";

function AdditionalSection({
  servers,
  query,
}: {
  servers: ServerWithPlayers[];
  query: string;
}) {
  const [subFilter, setSubFilter] = useState<SubSection>("All");
  const sections = ["Survival/SMP", "PvP/Minigames", "Crossplay"] as const;
  const filtered = filterServers(servers, query);

  const displaySections: readonly (
    | "Survival/SMP"
    | "PvP/Minigames"
    | "Crossplay"
  )[] =
    subFilter === "All" ? sections : [subFilter as Exclude<SubSection, "All">];

  return (
    <div className="space-y-8">
      {/* Sub-filter buttons */}
      <div className="flex flex-wrap gap-2">
        {(
          ["All", "Survival/SMP", "PvP/Minigames", "Crossplay"] as SubSection[]
        ).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setSubFilter(f)}
            className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all"
            style={{
              background:
                subFilter === f ? "oklch(0.52 0.21 25)" : "oklch(0.16 0.02 22)",
              color: subFilter === f ? "#fff" : "oklch(0.52 0.06 25)",
              border:
                subFilter === f
                  ? "1px solid oklch(0.52 0.21 25 / 0.7)"
                  : "1px solid oklch(0.25 0.035 25)",
              boxShadow:
                subFilter === f ? "0 0 10px oklch(0.52 0.21 25 / 0.3)" : "none",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {displaySections.map((section) => {
        const sectionServers = filtered.filter(
          (s) => s.subcategory === section,
        );
        return (
          <div key={section}>
            <SectionHeader label={section} />
            {sectionServers.length === 0 ? (
              <EmptyState query={query} />
            ) : (
              <ServerGrid servers={sectionServers} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Auth Section ─────────────────────────────────────────────────────────────
function AuthSection() {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  if (isInitializing) {
    return (
      <div className="flex items-center gap-2">
        <Loader2
          className="w-4 h-4 animate-spin"
          style={{ color: "oklch(0.52 0.21 25)" }}
        />
      </div>
    );
  }

  if (isAuthenticated) {
    const principal = identity.getPrincipal().toString();
    const shortPrincipal = `${principal.slice(0, 5)}...${principal.slice(-4)}`;
    return (
      <div className="flex items-center gap-2">
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono"
          style={{
            background: "oklch(0.16 0.02 22)",
            border: "1px solid oklch(0.25 0.04 25)",
            color: "oklch(0.68 0.12 28)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e88" }}
          />
          {shortPrincipal}
        </div>
        <button
          type="button"
          data-ocid="auth.sign_out.button"
          onClick={clear}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02]"
          style={{
            background: "oklch(0.52 0.21 25 / 0.12)",
            border: "1px solid oklch(0.52 0.21 25 / 0.3)",
            color: "oklch(0.68 0.18 28)",
          }}
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        data-ocid="auth.sign_in.button"
        onClick={login}
        disabled={isLoggingIn}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "oklch(0.16 0.02 22)",
          border: "1px solid oklch(0.28 0.05 25)",
          color: "oklch(0.72 0.08 25)",
        }}
      >
        {isLoggingIn ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          "Sign In"
        )}
      </button>
      <button
        type="button"
        data-ocid="auth.log_in.button"
        onClick={login}
        disabled={isLoggingIn}
        className="px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.52 0.21 25), oklch(0.42 0.18 23))",
          boxShadow: "0 0 12px oklch(0.52 0.21 25 / 0.3)",
        }}
      >
        {isLoggingIn ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          "Log In"
        )}
      </button>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [query, setQuery] = useState("");
  const { data: backendServers, isLoading, isError } = useAllServers();

  // Merge backend data with player counts, fallback to static
  const allServers: ServerWithPlayers[] = useMemo(() => {
    if (backendServers && backendServers.length > 0) {
      return mergeWithPlayers(backendServers);
    }
    return ALL_SERVERS;
  }, [backendServers]);

  const crossplayServers = useMemo(
    () =>
      filterServers(
        allServers.filter((s) => s.category === "crossplay"),
        query,
      ),
    [allServers, query],
  );
  const pvpServers = useMemo(
    () =>
      filterServers(
        allServers.filter((s) => s.category === "pvp"),
        query,
      ),
    [allServers, query],
  );
  const additionalServers = useMemo(
    () => allServers.filter((s) => s.category === "additional"),
    [allServers],
  );

  const TAB_DEFS = [
    {
      value: "crossplay",
      label: "🌍 Crossplay & Survival",
      ocid: "nav.crossplay_survival.tab",
    },
    { value: "pvp", label: "⚔️ PvP & Lifesteal", ocid: "nav.pvp_lifesteal.tab" },
    {
      value: "additional",
      label: "🚀 Additional Popular",
      ocid: "nav.additional_popular.tab",
    },
    {
      value: "best",
      label: "🏆 Best & Most Played",
      ocid: "nav.best_most_played.tab",
    },
    {
      value: "submit",
      label: "📤 Submit Server",
      ocid: "nav.submit_server.tab",
    },
    { value: "ranks", label: "⚡ Ranks", ocid: "nav.ranks.tab" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster position="bottom-right" />

      {/* ── HEADER ── */}
      <header
        className="relative overflow-hidden border-b"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.07 0.01 20) 0%, oklch(0.12 0.035 25) 40%, oklch(0.09 0.02 22) 100%)",
          borderColor: "oklch(0.2 0.03 25)",
        }}
      >
        {/* Scanline */}
        <div className="absolute inset-0 pointer-events-none scanline-bg" />
        {/* Glow orb */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-40 pointer-events-none rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.52 0.21 25 / 0.35) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-start justify-between gap-4">
            {/* Left spacer (desktop) */}
            <div className="hidden lg:block w-48 flex-shrink-0" />

            {/* Center: Title */}
            <div className="flex-1 flex flex-col items-center text-center gap-2">
              {/* Eye icon */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
                style={{
                  background: "oklch(0.52 0.21 25 / 0.15)",
                  boxShadow:
                    "0 0 30px oklch(0.52 0.21 25 / 0.4), inset 0 0 20px oklch(0.52 0.21 25 / 0.1)",
                  border: "1px solid oklch(0.52 0.21 25 / 0.4)",
                }}
              >
                <Eye
                  className="w-6 h-6"
                  style={{ color: "oklch(0.75 0.18 28)" }}
                />
              </div>

              <motion.h1
                data-ocid="header.title"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="eye-title-neon text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none"
                style={{
                  letterSpacing: "-0.04em",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}
              >
                THE <span className="eye-title-neon-word">EYE</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-xs sm:text-sm tracking-[0.25em] uppercase font-semibold"
                style={{ color: "oklch(0.62 0.1 25)" }}
              >
                Minecraft Server Finder
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex items-center gap-2"
              >
                <Wifi
                  className="w-3 h-3"
                  style={{ color: "oklch(0.52 0.21 25)" }}
                />
                <span
                  className="text-xs"
                  style={{ color: "oklch(0.42 0.04 25)" }}
                >
                  {allServers.length} servers indexed
                </span>
              </motion.div>
            </div>

            {/* Right: Auth */}
            <div className="flex-shrink-0 flex items-start">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <AuthSection />
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Error state */}
        {isError && (
          <div
            data-ocid="servers.error_state"
            className="flex items-center gap-3 p-4 rounded-lg border mb-6"
            style={{
              borderColor: "oklch(0.52 0.21 25 / 0.4)",
              background: "oklch(0.52 0.21 25 / 0.08)",
            }}
          >
            <AlertTriangle
              className="w-5 h-5 flex-shrink-0"
              style={{ color: "oklch(0.68 0.22 27)" }}
            />
            <p className="text-sm" style={{ color: "oklch(0.75 0.08 25)" }}>
              Backend unavailable — displaying local server data.
            </p>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="crossplay" className="w-full">
          {/* Tab Bar */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="overflow-x-auto pb-1">
              <TabsList
                className="flex w-max min-w-full p-1 rounded-lg gap-1"
                style={{
                  background: "oklch(0.13 0.015 20)",
                  border: "1px solid oklch(0.22 0.035 25)",
                }}
              >
                {TAB_DEFS.map(({ value, label, ocid }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    data-ocid={ocid}
                    className="whitespace-nowrap text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-md transition-all"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Search bar — only for server tabs */}
            <div className="relative max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "oklch(0.52 0.21 25)" }}
              />
              <Input
                data-ocid="search.search_input"
                type="text"
                placeholder="Search servers, tags, IPs…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4 h-10 rounded-lg text-sm"
                style={{
                  background: "oklch(0.13 0.015 20)",
                  borderColor: "oklch(0.22 0.035 25)",
                  color: "oklch(0.92 0.01 90)",
                }}
              />
            </div>
          </div>

          {/* Tab Content */}
          {isLoading ? (
            <ServerGridSkeleton />
          ) : (
            <>
              {/* Crossplay & Survival */}
              <TabsContent value="crossplay" className="mt-0">
                <SectionHeader label="Crossplay & Survival" />
                <div className="mb-4 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    style={{
                      background: "oklch(0.52 0.21 25 / 0.1)",
                      color: "oklch(0.65 0.12 28)",
                      borderColor: "oklch(0.52 0.21 25 / 0.3)",
                    }}
                  >
                    {crossplayServers.length} servers
                  </Badge>
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.42 0.04 25)" }}
                  >
                    Java + Bedrock crossplay servers
                  </span>
                </div>
                {crossplayServers.length === 0 ? (
                  <EmptyState query={query} />
                ) : (
                  <ServerGrid servers={crossplayServers} />
                )}
              </TabsContent>

              {/* PvP & Lifesteal */}
              <TabsContent value="pvp" className="mt-0">
                <SectionHeader label="PvP & Lifesteal" />
                <div className="mb-4 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    style={{
                      background: "oklch(0.52 0.21 25 / 0.1)",
                      color: "oklch(0.65 0.12 28)",
                      borderColor: "oklch(0.52 0.21 25 / 0.3)",
                    }}
                  >
                    {pvpServers.length} servers
                  </Badge>
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.42 0.04 25)" }}
                  >
                    Competitive PvP, Lifesteal & Anarchy
                  </span>
                </div>
                {pvpServers.length === 0 ? (
                  <EmptyState query={query} />
                ) : (
                  <ServerGrid servers={pvpServers} />
                )}
              </TabsContent>

              {/* Additional Popular */}
              <TabsContent value="additional" className="mt-0">
                <AdditionalSection servers={additionalServers} query={query} />
              </TabsContent>

              {/* Best & Most Played */}
              <TabsContent value="best" className="mt-0">
                <BestTab />
              </TabsContent>

              {/* Submit Server */}
              <TabsContent value="submit" className="mt-0">
                <SubmitServerTab />
              </TabsContent>

              {/* Ranks */}
              <TabsContent value="ranks" className="mt-0">
                <RanksTab />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>

      {/* ── FOOTER ── */}
      <footer
        className="border-t mt-auto py-6 text-center space-y-2"
        style={{
          borderColor: "oklch(0.18 0.025 25)",
          background: "oklch(0.09 0.012 20)",
        }}
      >
        {/* vantaredmc attribution — user requested */}
        <p
          className="text-sm font-semibold"
          style={{ color: "oklch(0.45 0.06 25)" }}
        >
          vantaredmc made this for{" "}
          <span
            className="mod-name-glow font-black"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            evil_eggchan
          </span>{" "}
          <span style={{ color: "oklch(0.55 0.08 25)" }}>:)</span>
        </p>
        <p className="text-xs" style={{ color: "oklch(0.32 0.03 25)" }}>
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:underline"
            style={{ color: "oklch(0.45 0.08 25)" }}
          >
            Built with ♥ using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
