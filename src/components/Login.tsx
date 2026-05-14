import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { motion } from 'motion/react';
import { LogIn, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { 
        loginIdentifier: email, 
        password,
        role_required: 'admin'
      });
      const { success, token, user, message } = response.data;

      if (success) {
        if (user.role === 'admin') {
          login(token, user);
        } else {
          setError('Bạn không có quyền truy cập trang quản trị.');
        }
      } else {
        setError(message || 'Đăng nhập thất bại.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_50%)]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-surface-container-low rounded-[2.5rem] p-10 shadow-2xl border border-outline-variant/10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
        
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-primary-container/20 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-lg shadow-primary/10">
              <LogIn className="w-8 h-8" />
            </div>
            <h1 className="font-display text-4xl font-black text-on-surface tracking-tight">Histra Admin</h1>
            <p className="font-body text-on-surface-variant mt-2 text-sm font-medium opacity-60">Đăng nhập để quản lý hệ thống</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-error-container/20 border border-error/20 p-4 rounded-2xl flex items-center gap-3 text-error text-xs font-bold uppercase tracking-wider"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@histra.com"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold ml-1">Mật khẩu</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-label text-xs font-black uppercase tracking-[0.25em] py-5 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
