import { useEffect, useState } from "react";
import { Search, Filter, Shield, ShieldAlert, Trash2, Mail, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import api from "../lib/api";
export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', {
        params: { keyword, page, limit: 10 }
      });
      setUsers(res.data.data);
      setTotal(res.data.pagination.total);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [keyword, page]);

  const toggleStatus = async (user: any) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    if (!confirm(`Bạn có chắc muốn ${newStatus === 'blocked' ? 'khóa' : 'mở khóa'} người dùng này?`)) return;
    
    try {
      await api.patch(`/admin/users/${user.id}/status`, { status: newStatus });
      fetchUsers();
    } catch (err) {
      alert("Cập nhật trạng thái thất bại");
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này? Thao tác này không thể hoàn tác.")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Xóa người dùng thất bại");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div className="space-y-12 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="font-display text-5xl font-extrabold text-on-surface tracking-tight">User Explorer</h2>
          <p className="font-body text-on-surface-variant mt-4 text-lg/relaxed max-w-xl font-medium opacity-70">
            Review community activity, moderate accounts, and verify expert guides.
          </p>
        </div>
        <div className="flex gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Search users..." 
                value={keyword}
                onChange={handleSearch}
                className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-80 shadow-sm"
              />
           </div>
           <button className="bg-surface-container-lowest text-on-surface-variant p-4 rounded-2xl border border-outline-variant/30 hover:bg-surface-container transition-all shadow-xl shadow-on-surface/5">
              <Filter className="w-5 h-5" />
           </button>
        </div>
      </header>

      <div className="bg-surface-container-low rounded-[2.5rem] overflow-hidden border border-outline-variant/10 shadow-2xl shadow-on-surface/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/40 text-on-surface-variant font-label text-[10px] font-black uppercase tracking-[0.2em] border-b border-outline-variant/10">
                <th className="p-8">Identity</th>
                <th className="p-8">Role & Status</th>
                <th className="p-8">Activity</th>
                <th className="p-8">Joined Date</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm divide-y divide-outline-variant/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="p-20 text-center opacity-50">Loading users...</td></tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center opacity-50">No users found.</td></tr>
              ) : users.map((user: any, i: number) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={user.id} 
                  className="hover:bg-surface-container-low/30 transition-colors group"
                >
                  <td className="p-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-surface-container-high border border-outline-variant/10 shrink-0">
                        <img 
                          src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username)}&background=6366f1&color=fff`} 
                          className="w-full h-full object-cover" 
                          alt={user.username} 
                        />
                      </div>
                      <div>
                        <div className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors">{user.fullName || user.username}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-3 h-3 text-on-surface-variant/40" />
                          <span className="text-xs text-on-surface-variant font-medium opacity-60">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex flex-col gap-2">
                       <span className={cn(
                         "px-3 py-1.5 rounded-xl font-label text-[10px] font-black uppercase tracking-widest w-fit",
                         user.role === 'admin' ? "bg-primary-container/20 text-primary" : "bg-surface-container-high text-on-surface-variant"
                       )}>
                         {user.role}
                       </span>
                       <div className="flex items-center gap-2 font-label text-[10px] font-bold uppercase tracking-wider">
                          {user.status === 'active' ? (
                            <><CheckCircle2 className="w-3 h-3 text-primary" /> <span className="text-primary">Active</span></>
                          ) : (
                            <><XCircle className="w-3 h-3 text-error" /> <span className="text-error">Blocked</span></>
                          )}
                       </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex gap-4 items-center">
                       <div className="flex flex-col">
                          <span className="font-headline font-black text-on-surface">{user._count?.posts || 0}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Posts</span>
                       </div>
                       <div className="w-px h-8 bg-outline-variant/10" />
                       <div className="flex flex-col">
                          <span className="font-headline font-black text-on-surface">{user._count?.trips || 0}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Trips</span>
                       </div>
                    </div>
                  </td>
                  <td className="p-8 text-on-surface-variant font-semibold opacity-70">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 opacity-40" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => toggleStatus(user)}
                        title={user.status === 'active' ? "Block" : "Unblock"}
                        className={cn(
                          "p-3 rounded-xl transition-all shadow-lg shadow-on-surface/5 border border-outline-variant/10",
                          user.status === 'active' ? "bg-error-container/10 text-error hover:bg-error hover:text-on-error" : "bg-primary-container/10 text-primary hover:bg-primary hover:text-on-primary"
                        )}
                      >
                        {user.status === 'active' ? <ShieldAlert className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                      </button>
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="p-3 bg-surface-container-lowest text-on-surface-variant rounded-xl hover:bg-error hover:text-on-error transition-all shadow-lg shadow-on-surface/5 border border-outline-variant/10"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 bg-surface-container-low/40 border-t border-outline-variant/10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-8">
           <span>Showing {(page-1)*10 + 1}-{Math.min(page*10, total)} of {total} users</span>
           <div className="flex gap-6">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="hover:text-primary transition-colors disabled:opacity-30 font-black uppercase tracking-widest"
              >Previous</button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page * 10 >= total}
                className="hover:text-primary transition-colors disabled:opacity-30 font-black uppercase tracking-widest"
              >Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
