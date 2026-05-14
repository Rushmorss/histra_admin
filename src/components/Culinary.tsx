import { useEffect, useState } from "react";
import { Search, Filter, Plus, Edit2, Trash2, Star, MapPin, Tag, Utensils, Loader2, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import api from "../lib/api";

export default function Culinary() {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    imageUrl: '',
    rating: '5',
    address: '',
    destinationId: ''
  });

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/foods', {
        params: { keyword, page, limit: 10 }
      });
      setFoods(res.data.data);
      setTotal(res.data.pagination.total);
    } catch (err) {
      console.error("Failed to fetch foods", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchFoods, 300);
    return () => clearTimeout(timer);
  }, [keyword, page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFood) {
        await api.put(`/admin/foods/${editingFood.id}`, formData);
      } else {
        await api.post('/admin/foods', formData);
      }
      setShowModal(false);
      fetchFoods();
      resetForm();
    } catch (err) {
      alert("Lưu thông tin thất bại");
    }
  };

  const deleteFood = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa món ăn này?")) return;
    try {
      await api.delete(`/admin/foods/${id}`);
      fetchFoods();
    } catch (err) {
      alert("Xóa món ăn thất bại");
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      imageUrl: '',
      rating: '5',
      address: '',
      destinationId: ''
    });
    setEditingFood(null);
  };

  const openEdit = (food: any) => {
    setEditingFood(food);
    setFormData({
      name: food.name || '',
      description: food.description || '',
      category: food.category || '',
      price: food.price?.toString() || '',
      imageUrl: food.imageUrl || '',
      rating: food.rating?.toString() || '5',
      address: food.address || '',
      destinationId: food.destinationId?.toString() || ''
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-12 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="font-display text-5xl font-extrabold text-on-surface tracking-tight">Culinary Directory</h2>
          <p className="font-body text-on-surface-variant mt-4 text-lg/relaxed max-w-xl font-medium opacity-70">
            Manage local food specialties, restaurant listings, and culinary experiences.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Search culinary..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-64 shadow-sm"
              />
           </div>
           <button 
             onClick={() => { resetForm(); setShowModal(true); }}
             className="bg-primary text-on-primary font-label text-xs font-black uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-3"
           >
              <Plus className="w-5 h-5" />
              Add Specialty
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading && foods.length === 0 ? (
          <div className="col-span-full p-20 text-center opacity-50 font-label text-sm uppercase tracking-widest">Loading specialties...</div>
        ) : foods.length === 0 ? (
          <div className="col-span-full p-20 text-center opacity-50 font-label text-sm uppercase tracking-widest">No specialties found.</div>
        ) : foods.map((food, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            key={food.id} 
            className="bg-surface-container-low rounded-[2.5rem] overflow-hidden border border-outline-variant/10 shadow-xl shadow-on-surface/5 flex flex-col group"
          >
            <div className="h-64 relative overflow-hidden bg-surface-container-high">
               <img src={food.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={food.name} />
               <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8 gap-3">
                  <button 
                    onClick={() => openEdit(food)}
                    className="flex-1 bg-surface/90 backdrop-blur-md text-on-surface font-label text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2"
                  >
                     <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button 
                    onClick={() => deleteFood(food.id)}
                    className="p-3 bg-error-container/20 backdrop-blur-md text-error rounded-xl hover:bg-error hover:text-on-error transition-all"
                  >
                     <Trash2 className="w-4 h-4" />
                  </button>
               </div>
               <div className="absolute top-6 right-6 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-xl font-label text-[10px] font-black uppercase tracking-widest text-primary border border-outline-variant/10 flex items-center gap-1.5">
                  <Star className="w-3 h-3 fill-primary" /> {food.rating || "N/A"}
               </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
               <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-primary-container/20 text-primary rounded-lg font-label text-[10px] font-black uppercase tracking-widest">
                    {food.category || "General"}
                  </span>
                  {food.price && (
                    <span className="font-label text-xs font-black text-on-surface-variant opacity-60">
                      ~ {Number(food.price).toLocaleString()} VND
                    </span>
                  )}
               </div>
               
               <h3 className="font-display text-2xl font-black text-on-surface mb-3 tracking-tight group-hover:text-primary transition-colors">{food.name}</h3>
               <p className="font-body text-on-surface-variant text-sm/relaxed line-clamp-3 mb-6 font-medium">
                  {food.description}
               </p>

               <div className="mt-auto flex flex-col gap-3">
                  {food.address && (
                    <div className="flex items-start gap-2 text-on-surface-variant opacity-70">
                       <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                       <span className="font-body text-xs font-semibold leading-tight">{food.address}</span>
                    </div>
                  )}
                  {food.destination && (
                    <div className="flex items-center gap-2 text-secondary">
                       <Tag className="w-3.5 h-3.5" />
                       <span className="font-label text-[10px] font-black uppercase tracking-widest">{food.destination.name}</span>
                    </div>
                  )}
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-container-low rounded-[2.5rem] shadow-2xl overflow-hidden border border-outline-variant/10"
            >
               <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
                  <h3 className="font-display text-3xl font-black text-on-surface tracking-tight">
                    {editingFood ? "Edit Specialty" : "Add New Specialty"}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="p-3 hover:bg-surface-container-high rounded-2xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
               </div>
               
               <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold ml-1">Specialty Name</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-5 py-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                          placeholder="e.g. Phở Bát Đàn"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold ml-1">Category</label>
                        <input 
                          type="text" 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-5 py-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                          placeholder="e.g. Noodle Soup"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold ml-1">Description</label>
                     <textarea 
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-5 py-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm resize-none"
                        placeholder="Describe this dish and its history..."
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold ml-1">Price (VND)</label>
                        <input 
                          type="number" 
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-5 py-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                          placeholder="50000"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold ml-1">Rating (1-5)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          min="1"
                          max="5"
                          value={formData.rating}
                          onChange={(e) => setFormData({...formData, rating: e.target.value})}
                          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-5 py-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold ml-1">Image URL</label>
                     <div className="relative group">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                        <input 
                          type="text" 
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                          placeholder="https://..."
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold ml-1">Primary Address</label>
                     <input 
                        type="text" 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-5 py-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                        placeholder="123 Bat Dan, Hoan Kiem, Hanoi"
                     />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary text-on-primary font-label text-xs font-black uppercase tracking-[0.25em] py-5 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all mt-4"
                  >
                     {editingFood ? "Save Changes" : "Create Listing"}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
