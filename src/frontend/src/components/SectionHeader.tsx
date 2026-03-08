interface SectionHeaderProps {
  label: string;
}

const SECTION_ICONS: Record<string, string> = {
  "Survival/SMP": "🌲",
  "PvP/Minigames": "⚔️",
  Crossplay: "🔗",
  "Best & Most Played": "🏆",
  "Submit Server": "📤",
};

export default function SectionHeader({ label }: SectionHeaderProps) {
  const icon = SECTION_ICONS[label] ?? "📋";
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-lg">{icon}</span>
      <h2
        className="eye-section-glow text-sm font-black uppercase tracking-[0.2em]"
        style={{ color: "#ff6b6b" }}
      >
        {label}
      </h2>
      <div
        className="flex-1 h-px"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.52 0.21 25 / 0.4) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
