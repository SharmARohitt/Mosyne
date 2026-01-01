'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Scatter,
  ScatterChart,
  ZAxis,
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-white/10">
        <p className="text-sm text-white/60 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Animated Counter
function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

// Memory Timeline Chart
interface TimelineData {
  date: string;
  patterns: number;
  transactions: number;
  threats: number;
}

export function MemoryTimelineChart({ data }: { data: TimelineData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="colorPatterns" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bf00ff" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#bf00ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} />
          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="transactions"
            name="Transactions"
            stroke="#bf00ff"
            fill="url(#colorTransactions)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="patterns"
            name="Patterns"
            stroke="#00f5ff"
            strokeWidth={3}
            dot={{ fill: '#00f5ff', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#00f5ff' }}
          />
          <Bar dataKey="threats" name="Threats" fill="#ff3366" opacity={0.8} radius={[4, 4, 0, 0]} />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Risk Distribution Donut Chart
interface RiskData {
  name: string;
  value: number;
  color: string;
}

export function RiskDistributionChart({ data }: { data: RiskData[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-[280px] relative"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke={entry.color}
                strokeWidth={activeIndex === index ? 3 : 1}
                style={{
                  filter: activeIndex === index ? `drop-shadow(0 0 10px ${entry.color})` : 'none',
                  transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: 'center',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-3xl font-bold gradient-text">
            <AnimatedCounter value={data.reduce((acc, d) => acc + d.value, 0)} />%
          </p>
          <p className="text-xs text-white/60">Total Risk</p>
        </div>
      </div>
    </motion.div>
  );
}

// Network Activity Heatmap Chart
interface NetworkData {
  hour: number;
  transactions: number;
  risk: number;
}

export function NetworkActivityChart({ data }: { data: NetworkData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-[250px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f5ff" stopOpacity={1} />
              <stop offset="100%" stopColor="#bf00ff" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="hour"
            stroke="rgba(255,255,255,0.3)"
            fontSize={10}
            tickFormatter={(value) => `${value}:00`}
          />
          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="transactions"
            name="Transactions"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Chain Distribution Chart
interface ChainData {
  chain: string;
  transactions: number;
  percentage: number;
}

export function ChainDistributionChart({ data }: { data: ChainData[] }) {
  const colors = ['#00f5ff', '#bf00ff', '#ff00ff', '#00ff88', '#ff8800'];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full h-[250px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          data={data}
          startAngle={180}
          endAngle={-180}
        >
          <RadialBar
            background={{ fill: 'rgba(255,255,255,0.05)' }}
            dataKey="percentage"
            cornerRadius={10}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </RadialBar>
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadialBarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Memory Depth Analysis Chart
interface MemoryDepthData {
  depth: string;
  memories: number;
}

export function MemoryDepthChart({ data }: { data: MemoryDepthData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[220px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff00ff" stopOpacity={0.6} />
              <stop offset="50%" stopColor="#bf00ff" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#00f5ff" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="depth" stroke="rgba(255,255,255,0.3)" fontSize={10} />
          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="memories"
            name="Memories"
            stroke="#ff00ff"
            fill="url(#memoryGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Risk Scatter Plot
interface ScatterData {
  x: number;
  y: number;
  z: number;
  name: string;
}

export function RiskScatterChart({ data }: { data: ScatterData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            type="number"
            dataKey="x"
            name="Time"
            stroke="rgba(255,255,255,0.3)"
            fontSize={10}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Risk"
            stroke="rgba(255,255,255,0.3)"
            fontSize={10}
          />
          <ZAxis type="number" dataKey="z" range={[50, 400]} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter name="Patterns" data={data} fill="#00f5ff">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.y > 0.7 ? '#ff3366' : entry.y > 0.4 ? '#ff8800' : '#00ff88'}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Live Pulse Chart (Real-time simulation)
export function LivePulseChart() {
  const [data, setData] = useState<{ time: number; value: number }[]>([]);

  useEffect(() => {
    // Initialize data
    const initialData = Array.from({ length: 50 }, (_, i) => ({
      time: i,
      value: Math.random() * 50 + 25,
    }));
    setData(initialData);

    // Simulate live updates
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: prev[prev.length - 1].time + 1,
          value: Math.max(0, Math.min(100, prev[prev.length - 1].value + (Math.random() - 0.5) * 20)),
        });
        return newData;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[150px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#00f5ff"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="value"
            fill="url(#pulseGradient)"
            stroke="none"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
