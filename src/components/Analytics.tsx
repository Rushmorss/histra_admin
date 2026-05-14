import { useEffect, useState } from "react";
import { Users, Map, Utensils, MessageSquare, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import api from "../lib/api";

export default function Analytics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const performanceCards = [
    { label: "User Acquisition", value: stats?.newUsersThisWeek || 0, trend: "+12.4%", positive: true, icon: Users, color: "text-primary" },
    { label: "Content Velocity", value: stats?.totalPosts || 0, trend: "+5.2%", positive: true, icon: Map, color: "text-secondary" },
    { label: "Culinary Growth", value: stats?.totalFoods || 0, trend: "-2.1%", positive: false, icon: Utensils, color: "text-tertiary" },
    { label: "Engagement Rate", value: "68%", trend: "+8.9%", positive: true, icon: MessageSquare, color: "text-primary-container" },
  ];

  return (
    <div className="space-y-12 pb-12">
      <header>
        <p className="font-label text-sm uppercase tracking-[0.2em] text-primary font-bold mb-2">Advanced Metrics</p>
        <h2 className="font-display text-5xl font-extrabold text-on-surface tracking-tight">System Analytics</h2>
        <p className="font-body text-on-surface-variant mt-4 text-lg/relaxed max-w-xl font-medium opacity-70">
          Deep dive into platform growth, content performance, and user engagement trends.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceCards.map((card, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={card.label} 
            className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 shadow-xl shadow-on-surface/5 group"
          >
             <div className="flex justify-between items-start mb-6">
                <div className={cn("p-3 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10", card.color)}>
                   <card.icon className="w-5 h-5" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-lg font-label text-[10px] font-black",
                  card.positive ? "bg-primary-container/20 text-primary" : "bg-error-container/20 text-error"
                )}>
                   {card.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                   {card.trend}
                </div>
             </div>
             <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.15em] font-bold opacity-60 mb-1">{card.label}</p>
             <h4 className="font-headline text-3xl font-black text-on-surface tracking-tight">{loading ? "..." : card.value}</h4>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-surface-container-low rounded-[2.5rem] p-10 border border-outline-variant/10 shadow-2xl shadow-on-surface/5">
            <div className="flex justify-between items-center mb-10">
               <h3 className="font-headline text-2xl font-black text-on-surface tracking-tight">Growth Trajectory</h3>
               <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="font-label text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Active Users</span>
               </div>
            </div>
            <div className="h-64 flex items-end gap-3">
               {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                 <motion.div 
                   initial={{ height: 0 }}
                   animate={{ height: `${h}%` }}
                   transition={{ delay: i * 0.05, duration: 1, ease: "easeOut" }}
                   key={i} 
                   className="flex-1 bg-primary/20 rounded-t-lg relative group"
                 >
                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                 </motion.div>
               ))}
            </div>
            <div className="flex justify-between mt-6 px-1 font-label text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">
               <span>Jan</span>
               <span>Mar</span>
               <span>May</span>
               <span>Jul</span>
               <span>Sep</span>
               <span>Nov</span>
            </div>
         </div>

         <div className="bg-surface-container-low rounded-[2.5rem] p-10 border border-outline-variant/10 shadow-2xl shadow-on-surface/5 flex flex-col justify-between">
            <div>
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-secondary-container/20 rounded-xl text-secondary">
                     <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="font-headline text-2xl font-black text-on-surface tracking-tight">Real-time Engagement</h3>
               </div>
               <p className="font-body text-on-surface-variant font-medium leading-relaxed opacity-70">
                  Engagement is currently <span className="text-primary font-black">15% higher</span> than the last 24-hour period. Most activity is centered around the "Heritage Trails" content category.
               </p>
            </div>

            <div className="space-y-6 mt-10">
               {[
                 { label: "Content Interactions", value: 85, color: "bg-primary" },
                 { label: "AI Trip Generations", value: 62, color: "bg-secondary" },
                 { label: "User Registrations", value: 48, color: "bg-tertiary" },
               ].map((item, i) => (
                 <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                       <span className="font-label text-[10px] font-black uppercase tracking-widest text-on-surface">{item.label}</span>
                       <span className="font-label text-xs font-black text-on-surface-variant">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${item.value}%` }}
                         transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                         className={cn("h-full rounded-full", item.color)} 
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
