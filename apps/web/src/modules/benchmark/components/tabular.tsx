"use client";

import { memo, useState, useMemo } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface DetailedResultsTableProps {
  tradeResults: TradeResult[];
  providers: Provider[]; // Provider MUST have .key (normalized: 'gluex','liqdswap','zerox','1inch', etc.)
}

type SortField = "tradingPair" | "amount" | "winner" | "outputDiff";
type SortDirection = "asc" | "desc";
const fmtMoney = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  currencyDisplay: "narrowSymbol",
});

const fmtNum0 = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const fmtPct = new Intl.NumberFormat(undefined, {
  style: "percent",
  maximumFractionDigits: 4,
});

export const DetailedResultsTable = memo<DetailedResultsTableProps>(
  ({ tradeResults, providers }) => {
    const [sortField, setSortField] = useState<SortField>("amount");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const sortedResults = useMemo(() => {
      return [...tradeResults].sort((a, b) => {
        let aValue: any = a[sortField];
        let bValue: any = b[sortField];

        if (sortField === "amount") {
          aValue = Number(aValue);
          bValue = Number(bValue);
        } else if (sortField === "outputDiff") {
          aValue = a.outputDiff ?? -Infinity;
          bValue = b.outputDiff ?? -Infinity;
        } else if (sortField === "tradingPair" || sortField === "winner") {
          aValue = String(aValue ?? "");
          bValue = String(bValue ?? "");
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }, [tradeResults, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("desc");
      }
    };

    const toggleRowExpansion = (rowId: string) => {
      setExpandedRows((prev) => {
        const next = new Set(prev);
        next.has(rowId) ? next.delete(rowId) : next.add(rowId);
        return next;
      });
    };

    const SortButton = ({
      field,
      children,
    }: {
      field: SortField;
      children: React.ReactNode;
    }) => (
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-1 hover:text-primary text-sm transition-colors cursor-pointer"
      >
        {children}
        {sortField === field ? (
          sortDirection === "asc" ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )
        ) : (
          <ArrowUpDown className="opacity-50 w-4 h-4" />
        )}
      </button>
    );

    const formatTime = (v: number | null | undefined) =>
      typeof v === "number" && Number.isFinite(v) ? `${v.toFixed(3)}s` : "—";

    const formatOutput = (v: number | null | undefined) =>
      typeof v === "number" && Number.isFinite(v) ? fmtNum0.format(v) : "N/A";

    const formatPct = (v: number | null | undefined) =>
      typeof v === "number" && Number.isFinite(v) ? fmtPct.format(v) : "—";

    if (!sortedResults.length) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="overflow-hidden"
        >
          <div className="mb-6">
            <h2 className="mb-1 font-bold text-primary text-2xl">
              Detailed Results
            </h2>
            <p className="text-secondary">
              Complete trading data with provider performance, response times,
              outputs and winner analysis
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="bg-background-secondary rounded-xl w-full">
              <thead>
                <tr className="font-aeonik text-tertiary text-sm whitespace-nowrap">
                  <th className="px-5 py-4">Trading Pair</th>
                  <th className="px-5 py-4">Amount (USD)</th>

                  {providers.map((p) => (
                    <th key={`${p.id}-time`} className="px-5 py-4">
                      {p.name} Time
                    </th>
                  ))}

                  {providers.map((p) => (
                    <th key={`${p.id}-output`} className="px-5 py-4">
                      {p.name} Output
                    </th>
                  ))}

                  <th className="px-5 py-4">Output Diff</th>
                  <th className="px-5 py-4">Winner</th>
                </tr>
              </thead>

              <tbody className="text-tertiary">
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="opacity-50 blur-[0.5px]">
                    <td className="px-5 py-2.5">
                      <div className="bg-tertiary mx-auto rounded w-24 h-4 animate-pulse" />
                    </td>
                    <td className="px-5 py-2.5">
                      <div className="bg-tertiary mx-auto rounded w-20 h-4 animate-pulse" />
                    </td>

                    {providers.map((p) => (
                      <td key={`sk-${i}-${p.id}-t`} className="px-5 py-2.5">
                        <div className="bg-tertiary mx-auto rounded w-16 h-4 animate-pulse" />
                      </td>
                    ))}
                    {providers.map((p) => (
                      <td key={`sk-${i}-${p.id}-o`} className="px-5 py-2.5">
                        <div className="bg-tertiary mx-auto rounded w-16 h-4 animate-pulse" />
                      </td>
                    ))}

                    <td className="px-5 py-2.5">
                      <div className="bg-tertiary mx-auto rounded w-16 h-4 animate-pulse" />
                    </td>
                    <td className="px-5 py-2.5">
                      <div className="bg-tertiary mx-auto rounded w-16 h-5 animate-pulse" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 text-gray-500 text-center">
            No trading data available
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="overflow-hidden"
      >
        <div className="mb-6">
          <h2 className="mb-1 font-bold text-primary text-2xl">
            Detailed Results
          </h2>
          <p className="text-secondary">
            Complete trading data with provider performance, response times,
            outputs and winner analysis
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="bg-background-secondary rounded-xl w-full">
            <thead>
              <tr className="font-aeonik text-tertiary text-sm whitespace-nowrap">
                {/* <th className="px-5 py-2.5">Trading Pair</th> */}
                <th className="px-5 py-2.5">From Token</th>

                <th className="px-5 py-2.5">To Token</th>

                <th className="px-5 py-2.5">
                  <SortButton field="amount">Amount (USD)</SortButton>
                </th>

                {providers.map((provider) => (
                  <th key={`${provider.id}-time`} className="px-5 py-2.5">
                    {provider.name} Time
                  </th>
                ))}

                {providers.map((provider) => (
                  <th key={`${provider.id}-output`} className="px-5 py-2.5">
                    {provider.name} Output
                  </th>
                ))}

                <th className="px-5 py-2.5">
                  <SortButton field="outputDiff">Output Diff</SortButton>
                </th>

                <th className="px-5 py-2.5">
                  <SortButton field="winner">Winner</SortButton>
                </th>
              </tr>
            </thead>

            <tbody className="text-tertiary text-sm">
              {sortedResults.map((result, index) => {
                // Per-row best/worst computations
                const times = providers
                  .map((p) => result.providers[p.key]?.time)
                  .filter(
                    (v): v is number =>
                      typeof v === "number" && Number.isFinite(v)
                  );
                const minTime = times.length ? Math.min(...times) : null;

                const outputs = providers
                  .map((p) => result.providers[p.key]?.output)
                  .filter(
                    (v): v is number =>
                      typeof v === "number" && Number.isFinite(v)
                  );
                const maxOutput = outputs.length ? Math.max(...outputs) : null;

                return (
                  <motion.tr
                    key={result.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                    title={result.tradingPair}
                  >
                    {/* <td className="px-5 py-2.5 font-medium text-primary/90 text-center">
                      <span
                        className="inline-block max-w-[14ch] truncate"
                        title={result.tradingPair}
                      >
                        {result.tradingPair}
                      </span>
                    </td> */}

                    <td className="px-5 py-2.5 font-medium text-primary/90 text-center">
                      <span
                        className="inline-block max-w-[14ch] truncate"
                        title={result.fromToken}
                      >
                        {result.fromToken}
                      </span>
                    </td>

                    <td className="px-5 py-2.5 font-medium text-primary/90 text-center">
                      <span
                        className="inline-block max-w-[14ch] truncate"
                        title={result.toToken}
                      >
                        {result.toToken}
                      </span>
                    </td>

                    <td className="px-5 py-2.5 text-primary/80 text-center">
                      {fmtMoney.format(Number(result.amount || 0))}
                    </td>

                    {providers.map((provider) => {
                      const t = result.providers[provider.key]?.time ?? null;
                      const isBest =
                        minTime != null &&
                        t != null &&
                        Math.abs(t - minTime) < 1e-9;
                      const isSlow = typeof t === "number" && t > 6;

                      const timeClass =
                        t == null
                          ? "text-xs"
                          : isBest
                          ? "text-[#01CF7A]"
                          : isSlow
                          ? "text-[#EF4444]"
                          : "";

                      return (
                        <td
                          key={`${result.id}-${provider.id}-time`}
                          className={`px-5 py-2.5 text-center ${timeClass}`}
                          title={t == null ? "No quote" : `${t.toFixed(3)}s`}
                        >
                          {formatTime(t)}
                        </td>
                      );
                    })}

                    {/* Outputs */}
                    {providers.map((provider) => {
                      const o = result.providers[provider.key]?.output ?? null;
                      const isBest =
                        maxOutput != null &&
                        o != null &&
                        Math.abs(o - maxOutput) < 1e-9;

                      const outClass =
                        o == null ? "text-xs" : isBest ? "text-[#01CF7A]" : "";

                      return (
                        <td
                          key={`${result.id}-${provider.id}-output`}
                          className={`px-5 py-2.5 text-center ${outClass}`}
                          title={o == null ? "No quote" : fmtNum0.format(o)}
                        >
                          {formatOutput(o)}
                        </td>
                      );
                    })}

                    {/* Output Diff */}
                    <td className="px-5 py-2.5 text-center">
                      <span
                        className={clsx(
                          result.outputDiff && result.outputDiff > 0
                            ? "text-[#01CF7A]"
                            : result.outputDiff === 0 ||
                              result.outputDiff == null
                            ? "text-xs"
                            : "text-[#EF4444]"
                        )}
                        title={
                          result.outputDiff != null
                            ? `${(result.outputDiff * 100).toFixed(
                                result.outputDiff * 100 > 0 ? 2 : 4
                              )}%`
                            : "—"
                        }
                      >
                        {result.outputDiff === 0
                          ? "—"
                          : formatPct(result.outputDiff)}
                      </span>
                    </td>

                    {/* Winner */}
                    <td className="px-6 py-2.5">
                      {result.winner === "All Error" ? (
                        <></>
                      ) : result.winner === "GlueX" ? (
                        <span className="px-2 py-1 border border-green-tertiary rounded-xl font-medium text-green-primary text-xs">
                          GlueX
                        </span>
                      ) : (
                        <span className="px-2 py-1 border border-border-secondary rounded-xl font-medium text-xs">
                          {providers.find((p) => p.name === result.winner)
                            ?.name || result.winner}
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  }
);

DetailedResultsTable.displayName = "DetailedResultsTable";
