"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import clsx from "clsx";
import { motion } from "framer-motion";

interface ProvidersGridProps {
  providers: Provider[];
}

export const ProvidersGrid = memo<ProvidersGridProps>(({ providers }) => {
  const isEmpty = !providers || providers.length === 0;

  const { topWinRateId, fastestId } = useMemo(() => {
    let topWinRateId: string | null = null;
    let bestWin = -Infinity;
    let fastestId: string | null = null;
    let bestTime = Infinity;

    for (const p of providers ?? []) {
      if (Number.isFinite(p.winRate) && p.winRate > bestWin) {
        bestWin = p.winRate;
        topWinRateId = p.id;
      }
      if (Number.isFinite(p.avgResponse) && p.avgResponse < bestTime) {
        bestTime = p.avgResponse;
        fastestId = p.id;
      }
    }
    return { topWinRateId, fastestId };
  }, [providers]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mb-12"
    >
      <div className="bg-gradient-to-br from-gradient-verde-from to-gradient-verde-to p-2.5 rounded-xl">
        <div
          className={clsx(
            "gap-2.5 grid grid-cols-6",
            "[&>.provider-card]:col-span-6",
            "sm:[&>.provider-card]:col-span-3",
            "lg:[&>.provider-card]:col-span-2",
            "sm:[&>.provider-card:last-child:nth-child(2n+1)]:col-span-6",
            "lg:[&>.provider-card:nth-last-child(2):nth-child(3n+1)]:col-span-3",
            "lg:[&>.provider-card:last-child:nth-child(3n+2)]:col-span-3",
            "lg:[&>.provider-card:last-child:nth-child(3n+1)]:col-span-6"
          )}
        >
          {isEmpty
            ? Array.from({ length: 6 }).map((_, i) => (
                <SkeletonProviderCard key={`sk-${i}`} />
              ))
            : providers.map((provider, index) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  index={index}
                  isTopWin={provider.id === topWinRateId}
                  isFastest={provider.id === fastestId}
                />
              ))}
        </div>
      </div>
    </motion.div>
  );
});

ProvidersGrid.displayName = "ProvidersGrid";

interface ProviderCardProps {
  provider: Provider;
  index: number;
  isTopWin?: boolean;
  isFastest?: boolean;
}

const pct = (v: number) => `${Number.isFinite(v) ? v.toFixed(2) : "0.00"}%`;
const sec = (s: number) => (Number.isFinite(s) ? `${s.toFixed(2)}s` : "—");

export const ProviderCard = memo<ProviderCardProps>(
  ({ provider, index, isTopWin, isFastest }) => {
    const winPct = Number.isFinite(provider.winRate) ? provider.winRate : 0;
    const partPct = Number.isFinite(provider.participation)
      ? provider.participation
      : 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -2, opacity: 1 }}
        transition={{ delay: index * 0.06 }}
        className="bg-background-secondary opacity-90 hover:opacity-100 rounded-xl h-full provider-card"
      >
        <div className="p-6 gradient-border-content h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-5">
            <div className="flex items-center gap-3">
              <span className="text-xl">
                <Image
                  src={provider.icon}
                  alt={provider.name}
                  width={1080}
                  height={1080}
                  className="rounded-xl w-12"
                />
              </span>
              <div className="leading-tight">
                <h3 className="font-semibold text-primary text-2xl">
                  {provider.name}
                </h3>
                <div className="text-secondary text-xs">
                  {provider.totalQuotes} quotes • {provider.errors} errors
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isTopWin && (
                <span className="hidden lg:block opacity-80 hover:opacity-100 px-2.5 py-0.5 border border-emerald-400 rounded-full font-medium text-emerald-400 text-xs transition-all">
                  Top Win Rate
                </span>
              )}
              {isFastest && (
                <span className="hidden lg:block opacity-80 hover:opacity-100 px-2.5 py-0.5 border border-blue-300 rounded-full font-medium text-blue-300 text-xs transition-all">
                  Fastest
                </span>
              )}
              <div className="opacity-80 hover:opacity-100 px-2.5 py-0.5 border border-green-primary rounded-full font-medium text-green-primary text-xs transition-all">
                {provider.wins} wins
              </div>
            </div>
          </div>

          <div className="gap-2 grid grid-cols-2">
            {/* Win Rate */}
            <div className="space-y-0.5">
              <div className="text-secondary text-sm">Win Rate</div>
              <div className={clsx("font-bold text-primary text-xl")}>
                {pct(winPct)}
              </div>
            </div>

            {/* Participation */}
            <div className="space-y-0.5">
              <div className="text-secondary text-sm">Participation</div>
              <div className={clsx("font-bold text-primary text-xl")}>
                {pct(partPct)}
              </div>
            </div>

            {/* Successful Trades */}
            <div className="space-y-0.5">
              <div className="text-secondary text-sm">Successful Trades</div>
              <div className="font-bold text-primary text-xl">
                {provider.successfulTrades} / {provider.totalTrades}
              </div>
            </div>

            {/* Avg Response */}
            <div className="space-y-0.5">
              <div className="text-secondary text-sm">Avg Response</div>
              <div className={clsx("font-bold text-primary text-xl")}>
                {sec(provider.avgResponse)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

ProviderCard.displayName = "ProviderCard";

const SkeletonProviderCard = () => (
  <div className="bg-background-secondary opacity-80 rounded-xl h-full provider-card">
    <div className="p-6 gradient-border-content h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 rounded-full w-6 h-6 animate-pulse" />
          <div className="bg-white/10 rounded w-24 h-4 animate-pulse" />
        </div>
        <div className="bg-white/10 rounded-full w-16 h-5 animate-pulse" />
      </div>

      <div className="gap-4 grid grid-cols-2 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="bg-white/10 mb-1 rounded w-20 h-3 animate-pulse" />
            <div className="bg-white/10 rounded w-24 h-5 animate-pulse" />
            <div className="bg-white/10 mt-1 rounded w-full h-1.5 overflow-hidden">
              <div className="bg-white/20 w-1/3 h-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-gray-400 text-xs">
        <div className="bg-white/10 rounded w-24 h-4 animate-pulse" />
        <div className="bg-white/10 rounded w-16 h-4 animate-pulse" />
      </div>
    </div>
  </div>
);
