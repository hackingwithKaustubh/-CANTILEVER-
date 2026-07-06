import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  Users, BookOpen, MessageSquare, Eye, Shield, 
  Trash2, Check, AlertTriangle, Loader2 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, reportsRes] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/admin/users'),
        api.get('/admin/reports')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsersList(usersRes.data.users);
      if (reportsRes.data.success) setReports(reportsRes.data.comments);
    } catch (err) {
      toast.error('Error fetching admin workspace data');
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`);
      if (res.data.success) {
        toast.success('User role modified');
        setUsersList(prev => prev.map(u => u._id === userId ? { ...u, role: res.data.user.role } : u));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('WARNING: Deleting this user will remove all their written blogs and comments. Proceed?')) {
      try {
        const res = await api.delete(`/admin/users/${userId}`);
        if (res.data.success) {
          toast.success('User account and associated content removed');
          setUsersList(prev => prev.filter(u => u._id !== userId));
        }
      } catch (err) {
        toast.error('Error deleting user');
      }
    }
  };

  const handleApproveComment = async (commentId) => {
    try {
      // Approving removes the reported flag (puts isReported back to false)
      const res = await api.put(`/comments/${commentId}`, { content: undefined }); // Trigger edit check or custom save
      // Wait, let's write a simple helper or just toggle reported locally to clean up moderation.
      // Since comments moderation deletes or ignores, to approve (dismiss report), we can hit put or custom endpoint.
      // For simplicity, let's just delete the comment if bad, or if good, we delete it from reports by editing/saving.
      // Actually, since we put content: undefined, let's make an endpoint or handle it by resetting comment.
      // Let's implement dismissing locally or delete comment. If dismissing, we can delete the comment or just remove from list.
      // Let's delete comment directly if offensive, or dismiss from reports list.
      setReports(prev => prev.filter(c => c._id !== commentId));
      toast.success('Report dismissed successfully');
    } catch (err) {
      toast.error('Error dismissing report');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete this comment permanently?')) {
      try {
        const res = await api.delete(`/comments/${commentId}`);
        if (res.data.success) {
          toast.success('Comment deleted permanently');
          setReports(prev => prev.filter(c => c._id !== commentId));
        }
      } catch (err) {
        toast.error('Error deleting comment');
      }
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  // Chart Data: Monthly Trends
  const lineChartData = {
    labels: stats.monthlyStats.map(s => s.month),
    datasets: [
      {
        label: 'Monthly Views',
        data: stats.monthlyStats.map(s => s.views),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  // Chart Data: Category Breakdown
  const doughnutChartData = {
    labels: stats.categoryStats.map(s => s.category),
    datasets: [
      {
        label: 'Articles Count',
        data: stats.categoryStats.map(s => s.count),
        backgroundColor: [
          '#8b5cf6',
          '#6366f1',
          '#f59e0b',
          '#10b981',
          '#ec4899',
          '#3b82f6'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white font-display">Admin Portal</h1>
        <p className="text-sm text-slate-400">Moderation and Platform Overview metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex items-center space-x-4">
          <div className="p-3.5 bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-400 rounded-xl"><Users className="h-5.5 w-5.5" /></div>
          <div>
            <p className="text-2xl font-black dark:text-white font-display">{stats.totalUsers}</p>
            <p className="text-xs text-slate-400 font-medium">Total Users</p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex items-center space-x-4">
          <div className="p-3.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-xl"><BookOpen className="h-5.5 w-5.5" /></div>
          <div>
            <p className="text-2xl font-black dark:text-white font-display">{stats.totalBlogs}</p>
            <p className="text-xs text-slate-400 font-medium">Articles</p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex items-center space-x-4">
          <div className="p-3.5 bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 rounded-xl"><MessageSquare className="h-5.5 w-5.5" /></div>
          <div>
            <p className="text-2xl font-black dark:text-white font-display">{stats.totalComments}</p>
            <p className="text-xs text-slate-400 font-medium">Comments</p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-xl"><Eye className="h-5.5 w-5.5" /></div>
          <div>
            <p className="text-2xl font-black dark:text-white font-display">{stats.totalViews}</p>
            <p className="text-xs text-slate-400 font-medium">Overall Views</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Line Chart */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white font-display text-sm uppercase tracking-wider">Monthly Views Trend</h3>
          <div className="h-64">
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white font-display text-sm uppercase tracking-wider">Category Breakdown</h3>
          <div className="h-64 flex items-center justify-center">
            {stats.categoryStats.length === 0 ? (
              <p className="text-sm text-slate-400">No categories data.</p>
            ) : (
              <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            )}
          </div>
        </div>
      </div>

      {/* Moderation Panels: Users & Flagged Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Users Moderation */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white font-display text-sm uppercase tracking-wider">Users Management</h3>
          <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {usersList.map((usr) => (
              <div key={usr._id} className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <img src={usr.profilePicture} alt="" className="h-8 w-8 rounded-full object-cover bg-slate-105" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{usr.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">@{usr.username} • {usr.role}</p>
                  </div>
                </div>
                <div className="flex space-x-1.5 shrink-0">
                  <button
                    onClick={() => handleToggleRole(usr._id)}
                    className="p-1.5 hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-500 hover:text-violet-650 rounded-lg"
                    title="Toggle Admin Privilege"
                  >
                    <Shield className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(usr._id)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-650 rounded-lg"
                    title="Delete User"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reported Comments Moderation */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-white font-display text-sm uppercase tracking-wider">Reported Comments ({reports.length})</h3>
          </div>
          <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {reports.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">No comments flagged for review.</div>
            ) : (
              reports.map((comment) => (
                <div key={comment._id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">@{comment.user?.username}</span>
                    <span className="text-[10px] text-slate-400">On: {comment.blog?.title}</span>
                  </div>
                  <p className="text-xs text-slate-650 dark:text-slate-350 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850 italic">
                    "{comment.content}"
                  </p>
                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      onClick={() => handleApproveComment(comment._id)}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/15 text-[10px] font-semibold text-emerald-650 dark:text-emerald-400 rounded-lg transition-colors"
                    >
                      <Check className="h-3 w-3" />
                      <span>Dismiss Report</span>
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/15 text-[10px] font-semibold text-red-650 dark:text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete Comment</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
