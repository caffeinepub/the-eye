import { motion } from "motion/react";
import { getTopServers } from "../data/serverData";
import SectionHeader from "./SectionHeader";
import ServerCard from "./ServerCard";

const TOP_SERVERS = getTopServers(10);

const RANK_LABELS: Record<number, string> = {
  1: "👑 MOST PLAYED",
  2: "🔥 TOP RATED",
  3: "⚡ RISING",
};

export default function BestTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader label="Best & Most Played" />

      <p className="text-sm" style={{ color: "oklch(0.5 0.04 25)" }}>
        Top 10 servers ranked by active player count — updated live
      </p>

      {/* Featured #1 */}
      {TOP_SERVERS[0] && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.18 0.03 22) 0%, oklch(0.14 0.02 20) 100%)",
            border: "2px solid oklch(0.52 0.21 25 / 0.6)",
            boxShadow:
              "0 8px 40px oklch(0.52 0.21 25 / 0.2), 0 2px 8px oklch(0 0 0 / 0.4)",
          }}
        >
          {/* Top badge bar */}
          <div
            className="px-6 py-2 flex items-center justify-between"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.52 0.21 25 / 0.3) 0%, transparent 100%)",
              borderBottom: "1px solid oklch(0.52 0.21 25 / 0.3)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">👑</span>
              <span
                className="text-xs font-black uppercase tracking-widest eye-section-glow"
                style={{ color: "#ff6b6b" }}
              >
                #1 MOST PLAYED SERVER
              </span>
            </div>
            <div
              className="text-xl font-black font-mono"
              style={{
                color: "oklch(0.7 0.15 145)",
                textShadow: "0 0 12px #22c55e88",
              }}
            >
              {TOP_SERVERS[0].players.toLocaleString()} online
            </div>
          </div>
          <div className="p-6">
            <ServerCard server={TOP_SERVERS[0]} rank={1} featured />
          </div>
        </motion.div>
      )}

      {/* Top 2-10 */}
      <div
        data-ocid="best.list"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {TOP_SERVERS.slice(1).map((server, idx) => {
          const rank = idx + 2;
          return (
            <motion.div
              key={server.ip + server.name}
              data-ocid={`server.item.${rank}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="relative"
            >
              {RANK_LABELS[rank] && (
                <div
                  className="absolute -top-2.5 left-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest z-10"
                  style={{
                    background: "oklch(0.52 0.21 25)",
                    color: "#fff",
                    boxShadow: "0 0 8px oklch(0.52 0.21 25 / 0.5)",
                  }}
                >
                  {RANK_LABELS[rank]}
                </div>
              )}
              <ServerCard server={server} rank={rank} featured={rank <= 3} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
