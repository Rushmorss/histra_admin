import { useEffect, useState } from "react";
import { Compass, Users as UsersIcon, Smartphone, Cloud, TrendingUp, AlertTriangle, CheckCircle2, Map } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import api from "../lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const metrics = [
    { label: "Total Active Trips", value: stats?.totalTrips?.toLocaleString() || "0", icon: Compass, color: "text-primary" },
    { label: "Total Users", value: stats?.totalUsers?.toLocaleString() || "0", change: stats?.newUsersThisWeek > 0 ? `+${stats.newUsersThisWeek}` : "", icon: UsersIcon, color: "text-secondary" },
    { label: "Total Posts", value: stats?.totalPosts?.toLocaleString() || "0", icon: Map, color: "text-tertiary" },
    { label: "Destinations", value: stats?.totalDestinations?.toLocaleString() || "0", icon: CheckCircle2, color: "text-primary-container" },
  ];

  return (
    <div className="space-y-12">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="font-label text-sm uppercase tracking-[0.2em] text-primary font-bold mb-2">Live Data Overview</p>
          <h2 className="font-display text-5xl font-extrabold text-on-surface leading-tight tracking-tight">Dashboard Overview</h2>
          <p className="font-body text-on-surface-variant mt-4 text-lg/relaxed max-w-xl">
            Monitoring The Modern Pathfinder network activity, user growth, and AI engagement across Vietnam.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-surface-container-lowest px-6 py-4 rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/10 shrink-0">
          <Cloud className="text-primary w-6 h-6" />
          <div>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">System Status</p>
            <p className="font-headline font-bold text-on-surface">
              {loading ? "Checking Status..." : "All Systems Operational"}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={metric.label} 
            className="bg-surface-container-low rounded-3xl p-6 relative overflow-hidden group hover:bg-surface-container transition-all duration-300 border border-outline-variant/10"
          >
             <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
             <div className="relative z-10 flex justify-between items-start mb-8">
               <div className={cn("p-3 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10", metric.color)}>
                 <metric.icon className="w-5 h-5" />
               </div>
               {metric.change && (
                 <span className="font-label text-[10px] font-bold text-primary bg-primary-container/20 px-2 py-1 rounded-full uppercase">
                   {metric.change}
                 </span>
               )}
             </div>
             <div className="relative z-10">
               <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.15em] font-bold mb-1 opacity-70">
                 {metric.label}
               </p>
               <div className="flex items-baseline gap-2">
                 <p className="font-headline text-4xl font-extrabold text-on-surface tracking-tight">{loading ? "..." : metric.value}</p>
               </div>
             </div>
          </motion.div>
        ))}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-container-low rounded-3xl p-6 lg:col-span-2 relative overflow-hidden group border border-outline-variant/10"
        >
          <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent z-0" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-surface-container-lowest rounded-xl text-secondary shadow-sm border border-outline-variant/10">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.15em] font-bold opacity-70">Moderation</p>
                  <p className="font-headline font-bold text-on-surface">Pending Reports</p>
                </div>
              </div>
              <span className="font-label text-[10px] font-bold text-secondary bg-secondary-container/20 px-2 py-1 rounded-full uppercase">
                {stats?.pendingReports || 0} Issues
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row items-end gap-6 w-full">
              <div className="flex-1 w-full">
                <div className="flex justify-between font-label text-xs mb-2">
                  <span className="text-on-surface font-bold">New Foods</span>
                  <span className="text-on-surface-variant font-medium">{stats?.totalFoods || 0}</span>
                </div>
                <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[100%]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10 shadow-xl shadow-on-surface/5">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">Recent Activity</h3>
            <button className="text-primary font-label text-xs font-bold uppercase tracking-widest hover:text-primary-container transition-colors">
              Refresh
            </button>
          </div>
          <div className="space-y-8">
            <p className="font-body text-on-surface-variant text-center py-12 opacity-50">Real-time activity log coming soon.</p>
          </div>
        </div>

        <div className="bg-tertiary-container/20 rounded-3xl p-8 border border-tertiary-container/30 h-fit">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-headline text-xl font-extrabold text-tertiary filter contrast-[0.8] mb-1">Reports Queue</h4>
              <p className="font-body text-sm text-on-surface-variant font-semibold">{stats?.pendingReports || 0} pending reports.</p>
            </div>
            <div className="p-3 bg-tertiary-container/20 rounded-xl text-tertiary">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <button className="w-full bg-tertiary text-on-tertiary font-label text-xs font-black uppercase tracking-[0.15em] py-4 rounded-xl shadow-lg shadow-tertiary/20 hover:bg-tertiary/90 transition-all mt-6">
            Review Queue
          </button>
        </div>
      </div>
    </div>
  );
}
