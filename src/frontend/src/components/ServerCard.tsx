import { Badge } from "@/components/ui/badge";
import { Check, Copy, Server } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { ServerWithPlayers } from "../data/serverData";

interface ServerCardProps {
  server: ServerWithPlayers;
  rank?: number;
  featured?: boolean;
}

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> =
  {
    PvP: {
      bg: "oklch(0.52 0.21 25 / 0.15)",
      text: "oklch(0.72 0.18 27)",
      border: "oklch(0.52 0.21 25 / 0.3)",
    },
    Survival: {
      bg: "oklch(0.42 0.14 145 / 0.15)",
      text: "oklch(0.72 0.16 145)",
      border: "oklch(0.42 0.14 145 / 0.3)",
    },
    Skyblock: {
      bg: "oklch(0.5 0.15 220 / 0.15)",
      text: "oklch(0.72 0.15 220)",
      border: "oklch(0.5 0.15 220 / 0.3)",
    },
    Lifesteal: {
      bg: "oklch(0.52 0.21 25 / 0.12)",
      text: "oklch(0.68 0.17 27)",
      border: "oklch(0.52 0.21 25 / 0.25)",
    },
    BedWars: {
      bg: "oklch(0.5 0.15 280 / 0.15)",
      text: "oklch(0.7 0.15 280)",
      border: "oklch(0.5 0.15 280 / 0.3)",
    },
    SkyWars: {
      bg: "oklch(0.5 0.15 200 / 0.15)",
      text: "oklch(0.7 0.15 200)",
      border: "oklch(0.5 0.15 200 / 0.3)",
    },
    Factions: {
      bg: "oklch(0.52 0.15 50 / 0.15)",
      text: "oklch(0.72 0.15 50)",
      border: "oklch(0.52 0.15 50 / 0.3)",
    },
    Economy: {
      bg: "oklch(0.5 0.14 80 / 0.15)",
      text: "oklch(0.72 0.14 80)",
      border: "oklch(0.5 0.14 80 / 0.3)",
    },
    Minigames: {
      bg: "oklch(0.5 0.15 180 / 0.15)",
      text: "oklch(0.7 0.15 180)",
      border: "oklch(0.5 0.15 180 / 0.3)",
    },
    RPG: {
      bg: "oklch(0.5 0.15 300 / 0.15)",
      text: "oklch(0.7 0.14 300)",
      border: "oklch(0.5 0.15 300 / 0.3)",
    },
    Anarchy: {
      bg: "oklch(0.28 0.05 25 / 0.25)",
      text: "oklch(0.55 0.08 25)",
      border: "oklch(0.3 0.06 25 / 0.35)",
    },
    Prison: {
      bg: "oklch(0.45 0.12 35 / 0.15)",
      text: "oklch(0.68 0.12 35)",
      border: "oklch(0.45 0.12 35 / 0.3)",
    },
    Parkour: {
      bg: "oklch(0.5 0.15 160 / 0.15)",
      text: "oklch(0.7 0.15 160)",
      border: "oklch(0.5 0.15 160 / 0.3)",
    },
    default: {
      bg: "oklch(0.52 0.21 25 / 0.08)",
      text: "oklch(0.65 0.1 28)",
      border: "oklch(0.52 0.21 25 / 0.2)",
    },
  };

function getTagStyle(tag: string) {
  const key =
    Object.keys(TAG_COLORS).find((k) =>
      tag.toLowerCase().includes(k.toLowerCase()),
    ) ?? "default";
  return TAG_COLORS[key] ?? TAG_COLORS.default;
}

function formatPlayerCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

export default function ServerCard({
  server,
  rank,
  featured,
}: ServerCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(server.ip);
      setCopied(true);
      toast.success("IP copied!", {
        description: server.ip,
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy IP");
    }
  }, [server.ip]);

  return (
    <article
      className="eye-card-hover relative rounded-lg p-5 flex flex-col gap-3 h-full"
      style={{
        background: featured
          ? "linear-gradient(135deg, oklch(0.16 0.025 22) 0%, oklch(0.13 0.018 20) 100%)"
          : "oklch(0.13 0.015 20)",
        border: featured
          ? "1px solid oklch(0.52 0.21 25 / 0.5)"
          : "1px solid oklch(0.22 0.035 25)",
        boxShadow: featured
          ? "0 4px 20px oklch(0.52 0.21 25 / 0.15), 0 2px 8px oklch(0 0 0 / 0.3)"
          : "0 4px 20px oklch(0 0 0 / 0.35), inset 0 1px 0 oklch(1 0 0 / 0.03)",
      }}
    >
      {/* Rank badge + player count row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {rank !== undefined && (
            <span
              className="text-[11px] font-black w-6 h-6 rounded flex items-center justify-center"
              style={{
                background:
                  rank <= 3 ? "oklch(0.52 0.21 25)" : "oklch(0.22 0.035 25)",
                color: rank <= 3 ? "#fff" : "oklch(0.55 0.05 25)",
                boxShadow:
                  rank <= 3 ? "0 0 8px oklch(0.52 0.21 25 / 0.4)" : "none",
              }}
            >
              {rank}
            </span>
          )}
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
            style={{
              background: "oklch(0.52 0.21 25 / 0.12)",
              color: "oklch(0.68 0.18 28)",
              border: "1px solid oklch(0.52 0.21 25 / 0.25)",
            }}
          >
            {server.category === "crossplay"
              ? "Crossplay"
              : server.category === "pvp"
                ? "PvP"
                : "Popular"}
          </span>
        </div>
        {/* Player count */}
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full pulse-dot flex-shrink-0"
            style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e99" }}
          />
          <span
            className="text-xs font-bold font-mono"
            style={{ color: "oklch(0.7 0.15 145)" }}
          >
            {formatPlayerCount(server.players)}
          </span>
        </div>
      </div>

      {/* Server name */}
      <div className="flex items-start gap-2">
        <Server
          className="w-4 h-4 mt-0.5 flex-shrink-0"
          style={{ color: "oklch(0.52 0.21 25 / 0.6)" }}
        />
        <h3
          className="font-bold text-base leading-tight"
          style={{ color: "oklch(0.93 0.01 90)" }}
        >
          {server.name}
        </h3>
      </div>

      {/* IP address row */}
      <div
        className="flex items-center gap-2 rounded-md px-3 py-2"
        style={{
          background: "oklch(0.09 0.01 20)",
          border: "1px solid oklch(0.2 0.028 25)",
        }}
      >
        <code
          className="flex-1 text-xs font-mono truncate"
          style={{
            color: "oklch(0.72 0.12 28)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {server.ip}
        </code>
        <button
          type="button"
          data-ocid="server.copy_ip.button"
          onClick={handleCopy}
          aria-label={copied ? "Copied!" : "Copy IP"}
          title={copied ? "Copied!" : "Copy IP address"}
          className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-1"
          style={{
            background: copied
              ? "oklch(0.55 0.18 145 / 0.2)"
              : "oklch(0.52 0.21 25 / 0.15)",
            color: copied ? "oklch(0.72 0.2 145)" : "oklch(0.68 0.18 28)",
            border: copied
              ? "1px solid oklch(0.55 0.18 145 / 0.4)"
              : "1px solid oklch(0.52 0.21 25 / 0.3)",
          }}
        >
          {copied ? (
            <Check className="w-3 h-3" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Tags */}
      {server.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {server.tags.slice(0, 4).map((tag) => {
            const style = getTagStyle(tag);
            return (
              <Badge
                key={tag}
                variant="outline"
                className="text-[10px] px-2 py-0 h-5 rounded-full font-semibold border"
                style={{
                  background: style.bg,
                  color: style.text,
                  borderColor: style.border,
                }}
              >
                {tag}
              </Badge>
            );
          })}
        </div>
      )}
    </article>
  );
}
