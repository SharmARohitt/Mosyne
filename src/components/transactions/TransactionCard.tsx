'use client';

import { motion } from 'framer-motion';
import { cn, formatAddress, getTimeAgo, getRiskColor } from '@/lib/utils';
import { Transaction } from '@/lib/store';
import { Badge, GlassCard } from '../ui/Cards';
import {
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  Wallet,
  FileCode,
  ChevronRight,
  Loader2,
} from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
}

export function TransactionCard({ transaction, onClick }: TransactionCardProps) {
  const typeIcons = {
    transfer: <ArrowUpRight className="w-4 h-4" />,
    swap: <RefreshCw className="w-4 h-4" />,
    approve: <Shield className="w-4 h-4" />,
    stake: <ArrowDownRight className="w-4 h-4" />,
    unstake: <ArrowUpRight className="w-4 h-4" />,
    bridge: <RefreshCw className="w-4 h-4" />,
    unknown: <FileCode className="w-4 h-4" />,
  };

  const statusColors = {
    pending: 'text-neon-orange bg-neon-orange/20',
    success: 'text-neon-green bg-neon-green/20',
    failed: 'text-neon-red bg-neon-red/20',
  };

  const statusIcons = {
    pending: <Loader2 className="w-3 h-3 animate-spin" />,
    success: <CheckCircle className="w-3 h-3" />,
    failed: <AlertTriangle className="w-3 h-3" />,
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, x: 4 }}
      onClick={onClick}
      className="glass-card p-4 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        {/* Left: Type & Addresses */}
        <div className="flex items-center gap-4">
          {/* Type Icon */}
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            'bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-white/10'
          )}>
            {typeIcons[transaction.type]}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white capitalize">{transaction.type}</span>
              <span className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs',
                statusColors[transaction.status]
              )}>
                {statusIcons[transaction.status]}
                {transaction.status}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
              <Wallet className="w-3 h-3" />
              <span className="font-mono">{formatAddress(transaction.from)}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="font-mono">{formatAddress(transaction.to)}</span>
            </div>
          </div>
        </div>

        {/* Right: Value & Risk */}
        <div className="flex items-center gap-6">
          {/* Value */}
          <div className="text-right">
            <p className="font-mono font-medium text-white">{transaction.value} ETH</p>
            <p className="text-xs text-white/50">{getTimeAgo(transaction.timestamp)}</p>
          </div>

          {/* Risk Score */}
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center font-bold font-mono',
            transaction.riskScore > 0.7 
              ? 'bg-neon-red/20 text-neon-red border border-neon-red/30'
              : transaction.riskScore > 0.4
              ? 'bg-neon-orange/20 text-neon-orange border border-neon-orange/30'
              : 'bg-neon-green/20 text-neon-green border border-neon-green/30'
          )}>
            {(transaction.riskScore * 100).toFixed(0)}
          </div>

          {/* External Link */}
          <button className="p-2 rounded-xl hover:bg-white/5 text-white/30 hover:text-white transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Matched Patterns */}
      {transaction.matchedPatterns.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-neon-orange" />
            <span className="text-xs text-white/50">Matched patterns:</span>
            {transaction.matchedPatterns.slice(0, 3).map((patternId, i) => (
              <Badge key={i} variant="warning" size="sm">
                Pattern {patternId.split('-')[1]}
              </Badge>
            ))}
            {transaction.matchedPatterns.length > 3 && (
              <span className="text-xs text-white/40">+{transaction.matchedPatterns.length - 3} more</span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

interface TransactionSimulationProps {
  transaction: Transaction | null;
  isAnalyzing: boolean;
  onProceed: () => void;
  onReject: () => void;
}

export function TransactionSimulation({
  transaction,
  isAnalyzing,
  onProceed,
  onReject,
}: TransactionSimulationProps) {
  if (!transaction) return null;

  return (
    <GlassCard className="p-6" glow={transaction.riskScore > 0.7 ? 'pink' : 'cyan'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            isAnalyzing 
              ? 'bg-neon-cyan/20 animate-pulse' 
              : transaction.riskScore > 0.7 
              ? 'bg-neon-red/20' 
              : 'bg-neon-green/20'
          )}>
            {isAnalyzing ? (
              <Loader2 className="w-6 h-6 text-neon-cyan animate-spin" />
            ) : transaction.riskScore > 0.7 ? (
              <AlertTriangle className="w-6 h-6 text-neon-red" />
            ) : (
              <CheckCircle className="w-6 h-6 text-neon-green" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {isAnalyzing ? 'Analyzing Transaction...' : 'Memory Analysis Complete'}
            </h3>
            <p className="text-sm text-white/50">
              {isAnalyzing ? 'Querying historical patterns' : `Risk Score: ${(transaction.riskScore * 100).toFixed(0)}%`}
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <div className="space-y-3 mb-6">
          {['Fetching transaction context', 'Querying Envio memory', 'Matching patterns', 'Computing risk score'].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.5 }}
              className="flex items-center gap-3"
            >
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center',
                i < 3 ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-cyan/20 text-neon-cyan'
              )}>
                {i < 3 ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
              </div>
              <span className="text-sm text-white/70">{step}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Risk Assessment */}
      {!isAnalyzing && (
        <>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/50">Historical Pattern Match</span>
              <Badge variant={transaction.riskScore > 0.7 ? 'danger' : 'info'}>
                {transaction.matchedPatterns.length} patterns matched
              </Badge>
            </div>
            
            {transaction.riskScore > 0.7 && (
              <div className="p-3 rounded-lg bg-neon-red/10 border border-neon-red/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-neon-red flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-neon-red font-medium">High Risk Detected</p>
                    <p className="text-xs text-white/60 mt-1">
                      This transaction matches historical patterns that resulted in fund loss in 72% of cases.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onReject}
              className="flex-1 py-3 rounded-xl bg-neon-red/20 text-neon-red border border-neon-red/30 font-medium hover:bg-neon-red/30 transition-colors"
            >
              Reject Transaction
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onProceed}
              className={cn(
                'flex-1 py-3 rounded-xl font-medium transition-colors',
                transaction.riskScore > 0.7
                  ? 'bg-white/10 text-white/70 border border-white/20'
                  : 'bg-neon-green/20 text-neon-green border border-neon-green/30 hover:bg-neon-green/30'
              )}
            >
              {transaction.riskScore > 0.7 ? 'Proceed Anyway' : 'Approve'}
            </motion.button>
          </div>
        </>
      )}
    </GlassCard>
  );
}

interface TransactionListProps {
  transactions: Transaction[];
  onSelect?: (tx: Transaction) => void;
}

export function TransactionList({ transactions, onSelect }: TransactionListProps) {
  return (
    <div className="space-y-3">
      {transactions.map((tx, i) => (
        <motion.div
          key={tx.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <TransactionCard transaction={tx} onClick={() => onSelect?.(tx)} />
        </motion.div>
      ))}
    </div>
  );
}
