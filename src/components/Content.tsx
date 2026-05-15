import { useEffect, useState } from "react";
import { Search, Trash2, MessageSquare, ThumbsUp, MapPin, Image as ImageIcon } from "lucide-react";
import { motion } from "motion/react";
import api from "../lib/api";

// Thay thế đúng Port backend của bạn tại đây (Ví dụ: http://localhost:5000)
const BASE_URL = "http://localhost:5000"; 

export default function Content() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/posts', {
        params: { keyword, page, limit: 10 }
      });
      setPosts(res.data.data);
      setTotal(res.data.pagination.total);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchPosts, 300);
    return () => clearTimeout(timer);
  }, [keyword, page]);

  // Hàm chuẩn hóa URL để hiển thị ảnh từ server
  const getFullImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Nếu đường dẫn dạng /uploads/abc.png hoặc uploads/abc.png
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${BASE_URL}${cleanUrl}`;
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/admin/posts/${postId}`);
      setPosts(posts.filter((p: any) => p.id !== postId));
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="font-display text-5xl font-extrabold text-on-surface tracking-tight">Content Moderation</h2>
          <p className="font-body text-on-surface-variant mt-4 text-lg/relaxed max-w-xl font-medium opacity-70">
            Monitor community posts, manage trails, and moderate user discussions.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Search posts..." 
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-80 shadow-sm"
              />
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-surface-container-low rounded-[2.5rem] animate-pulse" />
            ))
          ) : posts.map((post: any, i: number) => {
            
            // LOGIC LẤY ẢNH BÀI ĐĂNG: 
            // Ưu tiên thumbnailUrl, nếu không có thì lấy fileUrl của phần tử đầu tiên trong mảng mediaFiles
            const rawImgUrl = post.thumbnailUrl || (post.mediaFiles && post.mediaFiles[0]?.fileUrl);
            const displayImage = getFullImageUrl(rawImgUrl);
            
            // LOGIC LẤY AVATAR USER
            const displayAvatar = getFullImageUrl(post.user?.avatarUrl);

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={post.id} 
                className="bg-surface-container-low rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-xl shadow-on-surface/5 flex flex-col lg:flex-row gap-8 group"
              >
                {/* KHU VỰC ẢNH BÀI ĐĂNG */}
                <div className="w-full lg:w-72 h-52 rounded-3xl overflow-hidden bg-surface-container-high border border-outline-variant/10 shrink-0 relative flex items-center justify-center">
                  {rawImgUrl ? (
                    <img 
                      src={displayImage} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={post.title || "Post media"} 
                      onError={(e) => { 
                        // Nếu ảnh lỗi thì thay bằng ảnh giữ chỗ tạm thời
                        e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Found"; 
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 opacity-20">
                      <ImageIcon className="w-12 h-12" />
                      <span className="text-[10px] font-black uppercase tracking-widest">No Media</span>
                    </div>
                  )}

                  {/* Hiển thị badge số lượng media nếu có mảng mediaFiles */}
                  {post.mediaFiles && post.mediaFiles.length > 0 && (
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl font-label text-[10px] font-black uppercase tracking-widest text-white border border-white/10 shadow-lg">
                       {post.mediaFiles.length} MEDIA
                    </div>
                  )}
                </div>
                
                {/* THÔNG TIN BÀI ĐĂNG */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                       
                       {/* KHU VỰC AVATAR USER */}
                       <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/20 shrink-0">
                         <img 
                            src={post.user?.avatarUrl ? displayAvatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.fullName || post.user?.username || 'U')}&background=random`} 
                            className="w-full h-full object-cover" 
                            alt="avatar"
                            onError={(e) => {
                              // Dự phòng nếu link avatar từ DB bị lỗi hoặc die
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.fullName || 'U')}&background=random`;
                            }}
                         />
                       </div>

                       <div>
                         <p className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors">
                           {post.user?.fullName || post.user?.username || "Ẩn danh"}
                         </p>
                         <p className="font-label text-[10px] text-on-surface-variant font-black uppercase tracking-widest opacity-50">
                           {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
                         </p>
                       </div>
                     </div>
                     
                     <div className="flex gap-2">
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-3 bg-error-container/10 text-error rounded-2xl hover:bg-error hover:text-on-error transition-all border border-error/10"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                  </div>

                  <h3 className="font-display text-2xl font-black text-on-surface mb-3 tracking-tight">
                    {post.title || "Untitled Post"}
                  </h3>
                  <p className="font-body text-on-surface-variant text-sm/relaxed line-clamp-3 mb-6 font-medium">
                    {post.content || "No content provided."}
                  </p>

                  <div className="mt-auto pt-6 border-t border-outline-variant/10 flex flex-wrap gap-6 items-center">
                     <div className="flex items-center gap-2 text-on-surface-variant">
                        <ThumbsUp className="w-4 h-4 opacity-40" />
                        <span className="font-label text-xs font-black">{post._count?.postLikes || 0}</span>
                     </div>
                     <div className="flex items-center gap-2 text-on-surface-variant">
                        <MessageSquare className="w-4 h-4 opacity-40" />
                        <span className="font-label text-xs font-black">{post._count?.comments || 0}</span>
                     </div>
                     {post.postLocations && post.postLocations.length > 0 && (
                       <div className="flex items-center gap-2 text-primary">
                          <MapPin className="w-4 h-4" />
                          <span className="font-label text-xs font-black uppercase tracking-widest">
                            {post.postLocations[0].destination?.name}
                          </span>
                       </div>
                     )}
                  </div>
                </div>
              </motion.div>
            );
          })
        }

        {/* PHÂN TRANG */}
        {total > 10 && (
          <div className="flex justify-center mt-8 gap-4">
              <button 
                onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0,0); }}
                disabled={page === 1}
                className="px-6 py-3 bg-surface-container-low rounded-2xl font-label text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all disabled:opacity-30 border border-outline-variant/10"
              >Previous</button>
              <button 
                onClick={() => { setPage(p => p + 1); window.scrollTo(0,0); }}
                disabled={page * 10 >= total}
                className="px-6 py-3 bg-surface-container-low rounded-2xl font-label text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all disabled:opacity-30 border border-outline-variant/10"
              >Next</button>
          </div>
        )}
      </div>
    </div>
  );
}