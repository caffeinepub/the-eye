import { motion } from "motion/react";

interface RankFeature {
  text: string;
}

interface RankCardProps {
  name: string;
  price: string;
  priceLabel: string;
  features: RankFeature[];
  buttonLabel: string;
  badge?: string;
  variant: "vip" | "eggchan" | "mod";
  ocid: string;
  buttonOcid: string;
}

function RankCard({
  name,
  price,
  priceLabel,
  features,
  buttonLabel,
  badge,
  variant,
  ocid,
  buttonOcid,
}: RankCardProps) {
  const styles = {
    vip: {
      borderColor: "#fbbf24",
      glowClass: "rank-gold-glow",
      nameColor: "#fbbf24",
      priceColor: "#f59e0b",
      btnBg: "linear-gradient(135deg, #fbbf24, #d97706)",
      btnShadow: "0 0 15px #fbbf2466",
      badgeBg: "#fbbf2422",
      badgeColor: "#fbbf24",
      badgeBorder: "#fbbf2444",
      checkColor: "#fbbf24",
      bg: "linear-gradient(135deg, oklch(0.14 0.018 60) 0%, oklch(0.11 0.012 20) 100%)",
    },
    eggchan: {
      borderColor: "#ef4444",
      glowClass: "rank-red-glow",
      nameColor: "#ff6b6b",
      priceColor: "#ef4444",
      btnBg: "linear-gradient(135deg, #ef4444, #b91c1c)",
      btnShadow: "0 0 20px #ef444466",
      badgeBg: "#ef444422",
      badgeColor: "#ef4444",
      badgeBorder: "#ef444444",
      checkColor: "#ef4444",
      bg: "linear-gradient(135deg, oklch(0.16 0.025 22) 0%, oklch(0.11 0.012 20) 100%)",
    },
    mod: {
      borderColor: "#a855f7",
      glowClass: "rank-mod-glow",
      nameColor: "#c084fc",
      priceColor: "#a855f7",
      btnBg: "linear-gradient(135deg, #a855f7, #7c3aed)",
      btnShadow: "0 0 20px #a855f766",
      badgeBg: "#a855f722",
      badgeColor: "#c084fc",
      badgeBorder: "#a855f744",
      checkColor: "#c084fc",
      bg: "linear-gradient(135deg, oklch(0.13 0.018 300) 0%, oklch(0.11 0.012 20) 100%)",
    },
  };

  const s = styles[variant];
  const isEggchan = variant === "eggchan";

  return (
    <motion.div
      data-ocid={ocid}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: variant === "vip" ? 0 : variant === "eggchan" ? 0.1 : 0.2,
      }}
      className={`relative rounded-xl p-6 flex flex-col gap-5 ${s.glowClass}`}
      style={{
        background: s.bg,
        border: `2px solid ${s.borderColor}`,
      }}
    >
      {/* Badge */}
      {badge && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest"
          style={{
            background: s.btnBg,
            color: "#fff",
            boxShadow: s.btnShadow,
          }}
        >
          {badge}
        </div>
      )}

      {/* Name + price */}
      <div className="text-center pt-1">
        <h3
          className={`text-2xl font-black tracking-tight ${variant === "mod" ? "mod-name-glow" : ""}`}
          style={{ color: s.nameColor }}
        >
          {name}
        </h3>
        <div className="mt-2">
          <span
            className="text-3xl font-black"
            style={{ color: variant === "mod" ? "#c084fc" : s.priceColor }}
          >
            {price}
          </span>
          <span
            className="text-sm ml-1 opacity-70"
            style={{ color: s.nameColor }}
          >
            {priceLabel}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${s.borderColor}66, transparent)`,
        }}
      />

      {/* Features */}
      <ul className="flex flex-col gap-2.5 flex-1">
        {features.map((feat) => (
          <li key={feat.text} className="flex items-start gap-2.5">
            <span
              className="text-sm mt-0.5 flex-shrink-0"
              style={{ color: s.checkColor }}
            >
              ✦
            </span>
            <span className="text-sm" style={{ color: "oklch(0.78 0.03 25)" }}>
              {feat.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button
        type="button"
        data-ocid={buttonOcid}
        className="w-full py-3 rounded-lg font-bold text-sm tracking-wide text-white transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2"
        style={{
          background: s.btnBg,
          boxShadow: isEggchan
            ? `${s.btnShadow}, 0 4px 12px oklch(0 0 0 / 0.3)`
            : `${s.btnShadow}`,
          fontSize: isEggchan ? "0.95rem" : "0.875rem",
        }}
      >
        {buttonLabel}
      </button>
    </motion.div>
  );
}

export default function RanksTab() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2
          className="eye-section-glow text-xl font-black uppercase tracking-[0.2em]"
          style={{ color: "#ff6b6b" }}
        >
          ⚡ RANKS & UPGRADES
        </h2>
        <p className="text-sm" style={{ color: "oklch(0.5 0.04 25)" }}>
          Unlock exclusive features and support THE EYE
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <RankCard
          name="VIP"
          price="$2.99"
          priceLabel="/month"
          variant="vip"
          ocid="ranks.vip.card"
          buttonOcid="ranks.vip.button"
          buttonLabel="Upgrade to VIP"
          features={[
            { text: "Custom profile badge" },
            { text: "Up to 3 server listings" },
            { text: "Priority support" },
            { text: "VIP tag on your servers" },
            { text: "Early community access" },
          ]}
        />
        <RankCard
          name="Eggchan"
          price="$30.00"
          priceLabel="/month"
          variant="eggchan"
          ocid="ranks.eggchan.card"
          buttonOcid="ranks.eggchan.button"
          buttonLabel="Upgrade to Eggchan"
          badge="MOST POPULAR"
          features={[
            { text: "Everything in VIP" },
            { text: "Unlimited server listings" },
            { text: "Featured server slots" },
            { text: "Eggchan exclusive badge" },
            { text: "Early access to new features" },
            { text: "Direct line to the dev" },
          ]}
        />
        <RankCard
          name="Mod"
          price="FREE"
          priceLabel="Discord Only"
          variant="mod"
          ocid="ranks.mod.card"
          buttonOcid="ranks.mod.button"
          buttonLabel="Join Discord"
          badge="EXCLUSIVE"
          features={[
            { text: "Moderator badge" },
            { text: "Server verification powers" },
            { text: "Purple glowing name" },
            { text: "Discord exclusive role" },
            { text: "Mod-only channels access" },
            { text: "Direct staff contact" },
          ]}
        />
      </div>
    </div>
  );
}
