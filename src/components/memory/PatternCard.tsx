'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatAddress, getTimeAgo, getRiskColor, getRiskLabel } from '@/lib/utils';
import { MemoryPattern } from '@/lib/store';
import { GlassCard, Badge } from '../ui/Cards';
import { Button } from '../ui/Buttons';
import {
  Brain,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Clock,
  Activity,
  Eye,
  Zap,
  X,
} from 'lucide-react';

interface PatternCardProps {
  pattern: MemoryPattern;
  onClick?: () => void;
  compact?: boolean;
}

export function PatternCard({ pattern, onClick, compact = false }: PatternCardProps) {
  const categoryColors = {
    exploit: 'from-red-500/20 to-red-600/10 border-red-500/30',
    rug_pull: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
    governance: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    drain: 'from-pink-500/20 to-pink-600/10 border-pink-500/30',
    safe: 'from-green-500/20 to-green-600/10 border-green-500/30',
  };

  const categoryIcons = {
    exploit: <AlertTriangle className="w-4 h-4" />,
    rug_pull: <XCircle className="w-4 h-4" />,
    governance: <Activity className="w-4 h-4" />,
    drain: <Zap className="w-4 h-4" />,
    safe: <CheckCircle className="w-4 h-4" />,
  };

  const categoryLabels = {
    exploit: 'Exploit',
    rug_pull: 'Rug Pull',
    governance: 'Governance',
    drain: 'Drain',
    safe: 'Safe',
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.01, x: 4 }}
        onClick={onClick}
        className={cn(
          'flex items-center justify-between p-4 rounded-xl cursor-pointer',
          'bg-gradient-to-r border transition-all duration-200',
          categoryColors[pattern.category]
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg bg-white/10', getRiskColor(pattern.riskScore))}>
            {categoryIcons[pattern.category]}
          </div>
          <div>
            <h4 className="font-medium text-white text-sm">{pattern.name}</h4>
            <p className="text-xs text-white/50">{pattern.occurrences.toLocaleString()} occurrences</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={pattern.riskScore > 0.7 ? 'danger' : pattern.riskScore > 0.4 ? 'warning' : 'success'}>
            {(pattern.riskScore * 100).toFixed(0)}%
          </Badge>
          <ChevronRight className="w-4 h-4 text-white/30" />
        </div>
      </motion.div>
    );
  }

  return (
    <GlassCard className="p-0 overflow-hidden" hover>
      <div
        className={cn(
          'p-5 cursor-pointer',
          'bg-gradient-to-br',
          categoryColors[pattern.category]
        )}
        onClick={onClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              'bg-white/10 backdrop-blur-sm'
            )}>
              <Brain className={cn('w-6 h-6', getRiskColor(pattern.riskScore))} />
            </div>
            <div>
              <h3 className="font-semibold text-white">{pattern.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={pattern.riskScore > 0.7 ? 'danger' : pattern.riskScore > 0.4 ? 'warning' : 'success'}>
                  {categoryLabels[pattern.category]}
                </Badge>
                <span className="text-xs text-white/40">
                  {getTimeAgo(pattern.lastSeen)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Risk Score */}
          <div className={cn('text-right')}>
            <p className={cn('text-2xl font-bold font-mono', getRiskColor(pattern.riskScore))}>
              {(pattern.riskScore * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-white/50">{getRiskLabel(pattern.riskScore)}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-white/60 mb-4 line-clamp-2">
          {pattern.description}
        </p>

        {/* Sequence Preview */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {pattern.sequence.slice(0, 4).map((step, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <span className="px-2 py-1 text-xs bg-white/10 rounded-lg text-white/70">
                {step}
              </span>
              {i < Math.min(pattern.sequence.length, 4) - 1 && (
                <ChevronRight className="w-3 h-3 text-white/30" />
              )}
            </div>
          ))}
          {pattern.sequence.length > 4 && (
            <span className="text-xs text-white/40">+{pattern.sequence.length - 4} more</span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Activity className="w-3.5 h-3.5" />
              {pattern.occurrences.toLocaleString()} matches
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Clock className="w-3.5 h-3.5" />
              {getTimeAgo(pattern.lastSeen)}
            </div>
          </div>
          <Button size="sm" variant="ghost">
            <Eye className="w-4 h-4" />
            View Details
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

interface PatternDetailModalProps {
  pattern: MemoryPattern | null;
  onClose: () => void;
}

export function PatternDetailModal({ pattern, onClose }: PatternDetailModalProps) {
  if (!pattern) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl glass-card p-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{pattern.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={pattern.riskScore > 0.7 ? 'danger' : pattern.riskScore > 0.4 ? 'warning' : 'success'}>
                    Risk: {(pattern.riskScore * 100).toFixed(0)}%
                  </Badge>
                  <span className="text-sm text-white/50">
                    {pattern.occurrences.toLocaleString()} occurrences
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white/70 mb-2">Description</h3>
            <p className="text-white/60">{pattern.description}</p>
          </div>

          {/* Sequence */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white/70 mb-3">Behavioral Sequence</h3>
            <div className="space-y-3">
              {pattern.sequence.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-white/80">{step}</span>
                  </div>
                  {i < pattern.sequence.length - 1 && (
                    <div className="absolute left-4 top-full h-3 w-0.5 bg-neon-cyan/30" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" glow>
              Add to Watchlist
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface MemorySequenceProps {
  sequence: string[];
  animated?: boolean;
}

export function MemorySequence({ sequence, animated = true }: MemorySequenceProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
      {sequence.map((step, i) => (
        <motion.div
          key={i}
          initial={animated ? { opacity: 0, scale: 0.8 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-neon-cyan animate-ping opacity-50" />
          </div>
          <span className="px-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white/80">
            {step}
          </span>
          {i < sequence.length - 1 && (
            <div className="w-8 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-50" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
