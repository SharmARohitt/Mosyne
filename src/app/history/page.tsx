'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout, PageHeader, Grid } from '@/components/ui/Layout';
import { GlassCard, StatCard, Badge, PulseIndicator } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Buttons';
import { TransactionCard, TransactionList } from '@/components/transactions/TransactionCard';
import { realTransactions, MOSYNE_CORE_STATS } from '@/lib/data/realData';
import {
  Clock,
  Calendar,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
  Layers,
} from 'lucide-react';

export default function HistoryPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const dateRanges = [
    { id: '24h', label: '24H' },
    { id: '7d', label: '7D' },
    { id: '30d', label: '30D' },
    { id: '90d', label: '90D' },
    { id: 'all', label: 'All' },
  ];

  const typeFilters = [
    { id: 'all', label: 'All Types', icon: <Layers className="w-4 h-4" /> },
    { id: 'send', label: 'Sent', icon: <ArrowUpRight className="w-4 h-4" /> },
    { id: 'receive', label: 'Received', icon: <ArrowDownRight className="w-4 h-4" /> },
    { id: 'swap', label: 'Swaps', icon: <ArrowRightLeft className="w-4 h-4" /> },
    { id: 'approval', label: 'Approvals', icon: <CheckCircle className="w-4 h-4" /> },
  ];

  // Mock history data
  const historyData = [
    { date: '2024-01-15', transactions: 45, volume: '$12,450', avgRisk: 23 },
    { date: '2024-01-14', transactions: 32, volume: '$8,200', avgRisk: 18 },
    { date: '2024-01-13', transactions: 58, volume: '$24,100', avgRisk: 42 },
    { date: '2024-01-12', transactions: 41, volume: '$15,800', avgRisk: 28 },
    { date: '2024-01-11', transactions: 29, volume: '$7,500', avgRisk: 15 },
    { date: '2024-01-10', transactions: 67, volume: '$31,200', avgRisk: 38 },
    { date: '2024-01-09', transactions: 51, volume: '$18,900', avgRisk: 31 },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Transaction History"
        subtitle="Complete timeline of your on-chain activity and pattern matches"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'History' },
        ]}
        action={
          <Button variant="primary" size="sm">
            <Download className="w-4 h-4" />
            Export History
          </Button>
        }
      />

      {/* Stats */}
      <Grid cols={4} className="mb-8">
        <StatCard
          title="Total Transactions"
          value={MOSYNE_CORE_STATS.transactionsToday.toLocaleString()}
          icon={<Activity />}
          trend={12}
          color="cyan"
        />
        <StatCard
          title="This Week"
          value={(MOSYNE_CORE_STATS.transactionsThisWeek).toLocaleString()}
          icon={<Calendar />}
          trend={-5}
          color="purple"
        />
        <StatCard
          title="Flagged"
          value={realTransactions.filter(t => t.riskScore > 0.6).length.toString()}
          icon={<AlertTriangle />}
          color="yellow"
        />
        <StatCard
          title="Total Volume"
          value="$458K"
          icon={<TrendingUp />}
          trend={23}
          color="green"
        />
      </Grid>

      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by hash, address, or amount..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-neon-cyan/50"
          />
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl">
          {dateRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setDateRange(range.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                dateRange === range.id
                  ? 'bg-neon-cyan/20 text-neon-cyan'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button variant="secondary" size="sm">
            <Calendar className="w-4 h-4" />
            Custom
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Type Filters */}
        <div className="lg:col-span-1">
          <GlassCard className="sticky top-4">
            <h3 className="text-sm font-medium text-white/50 mb-4">Transaction Type</h3>
            <div className="space-y-2">
              {typeFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTypeFilter(filter.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    typeFilter === filter.id
                      ? 'bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {filter.icon}
                  <span className="text-sm">{filter.label}</span>
                </button>
              ))}
            </div>

            {/* Daily Summary */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-sm font-medium text-white/50 mb-4">Daily Summary</h3>
              <div className="space-y-3">
                {historyData.slice(0, 5).map((day) => (
                  <div
                    key={day.date}
                    className="flex items-center justify-between py-2 border-b border-white/5"
                  >
                    <div>
                      <p className="text-sm text-white">{day.date}</p>
                      <p className="text-xs text-white/40">{day.transactions} txns</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neon-cyan font-mono">{day.volume}</p>
                      <p className="text-xs text-white/40">Risk: {day.avgRisk}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Timeline Header */}
          <GlassCard className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-neon-cyan" />
                <div>
                  <h3 className="font-semibold text-white">Activity Timeline</h3>
                  <p className="text-sm text-white/50">Showing {realTransactions.length} transactions</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <PulseIndicator color="green" />
                <span className="text-white/50">Live Updates</span>
              </div>
            </div>
          </GlassCard>

          {/* Transaction List */}
          <div className="space-y-3">
            {realTransactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <TransactionCard transaction={tx} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-white/50">
              Showing 1-10 of 2,847 transactions
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[1, 2, 3, '...', 285].map((page, i) => (
                  <button
                    key={i}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm transition-all ${
                      page === currentPage
                        ? 'bg-neon-cyan/20 text-neon-cyan'
                        : 'text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
