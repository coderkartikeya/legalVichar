"use client";
import { useState, useEffect } from "react";
import { FaGavel, FaFolderOpen, FaChartLine, FaCalendarAlt, FaEnvelope, FaCog, FaSignOutAlt, FaLightbulb, FaUserCircle, FaBell, FaComments, FaHistory, FaClock, FaEye, FaPlus, FaEllipsisV, FaPaperclip } from "react-icons/fa";
import { HiOutlineSwitchHorizontal, HiMenuAlt3, HiX } from "react-icons/hi";
import { useUser } from '@clerk/nextjs';
import useUserTypeStore from "../store/userTypeStore";
import UserTypeModal from "./UserTypeModal";
import AddCaseModal from "./AddCaseModal";

const navItems = [
  { name: "Dashboard", icon: <FaChartLine />, active: true },
  { name: "Cases", icon: <FaGavel /> },
  { name: "Documents", icon: <FaFolderOpen /> },
  { name: "Insights", icon: <FaLightbulb /> },
  { name: "Calendar", icon: <FaCalendarAlt /> },
  { name: "Messages", icon: <FaEnvelope /> },
  { name: "Settings", icon: <FaCog /> },
  { name: "Logout", icon: <FaSignOutAlt /> },
];

export default function MainDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const userType = useUserTypeStore(state => state.userType);
  const username = useUserTypeStore(state => state.username);
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [addCaseOpen, setAddCaseOpen] = useState(false);

  // Dashboard data state
  const [cases, setCases] = useState([]);
  const [casesLoading, setCasesLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  useEffect(() => {
    if (!userType) {
      setShowModal(true);
    }
  }, [userType]);

  // Fetch dashboard data
  useEffect(() => {
    async function fetchData() {
      setCasesLoading(true);
      try {
        const userId = user?.id;
        const casesUrl = userId ? `/api/case?userId=${encodeURIComponent(userId)}` : '/api/case';
        const docsUrl = userId ? `/api/document?userId=${encodeURIComponent(userId)}` : '/api/document';
        const msgsUrl = userId ? `/api/message?userId=${encodeURIComponent(userId)}` : '/api/message';
        const apptsUrl = userId ? `/api/appointment?userId=${encodeURIComponent(userId)}` : '/api/appointment';
        const [casesRes, docsRes, msgsRes, apptsRes, insightsRes] = await Promise.all([
          fetch(casesUrl),
          fetch(docsUrl),
          fetch(msgsUrl),
          fetch(apptsUrl),
          fetch('/api/insight'),
        ]);
        const casesData = await casesRes.json();
        const docsData = await docsRes.json();
        const msgsData = await msgsRes.json();
        const apptsData = await apptsRes.json();
        const insightsData = await insightsRes.json();
        setCases(casesData.cases || []);
        setDocuments(docsData.documents || []);
        setMessages(msgsData.messages || []);
        setAppointments(apptsData.appointments || []);
        setInsights(insightsData.insights || []);
      } catch (err) {
        setCases([]);
        setDocuments([]);
        setMessages([]);
        setAppointments([]);
        setInsights([]);
      }
      setCasesLoading(false);
    }
    if (user) fetchData();
  }, [user]);

  // Use real user data if available
  const displayName = username || user?.fullName || user?.username || user?.firstName || "User";
  const displayRole = userType || "Client";
  const avatarUrl = user?.imageUrl || "https://images.unsplash.com/photo-1494790108755-2616b332c5cd?w=150&h=150&fit=crop&crop=face";

  // Dynamic quick stats
  const quickStats = [
    {
      label: "Active Cases",
      value: cases.length,
      icon: <FaGavel className="text-blue-600" />,
      color: "from-blue-50 to-indigo-50",
      bgIcon: "bg-blue-100",
      trend: cases.length > 0 ? `+${cases.length} this week` : "No cases",
      trendUp: cases.length > 0
    },
    {
      label: "New Messages",
      value: messages.length,
      icon: <FaEnvelope className="text-emerald-600" />,
      color: "from-emerald-50 to-green-50",
      bgIcon: "bg-emerald-100",
      trend: messages.length > 0 ? `${messages.length} unread` : "No messages",
      trendUp: messages.length > 0
    },
    {
      label: "AI Insights",
      value: insights.length,
      icon: <FaLightbulb className="text-amber-600" />,
      color: "from-amber-50 to-yellow-50",
      bgIcon: "bg-amber-100",
      trend: insights.length > 0 ? `${insights.length} new insights` : "No insights",
      trendUp: insights.length > 0
    },
    {
      label: "Deadlines",
      value: 0, // Placeholder, update with real deadlines if available
      icon: <FaCalendarAlt className="text-red-600" />,
      color: "from-red-50 to-pink-50",
      bgIcon: "bg-red-100",
      trend: "Next: -",
      trendUp: false
    },
  ];

  // Dynamic appointments (show up to 3)
  const displayedAppointments = appointments.slice(0, 3);

  // Dynamic recent activity (show up to 4, fallback if empty)
  const recentActivity = cases.length > 0 ? cases.slice(0, 4).map((c, idx) => ({
    type: "case",
    title: c.title || `Case #${idx + 1}`,
    description: c.description || "No description",
    time: c.updatedAt ? new Date(c.updatedAt).toLocaleString() : "-",
    icon: <FaGavel className="text-blue-600" />,
    iconBg: "bg-blue-100",
    hasAttachment: false
  })) : [];

  const aiSuggestions = [
    "You have 2 critical filings due this week that require attention.",
    "Case ABC-2024 has similar precedents - would you like a comprehensive summary?",
    "3 new documents uploaded by clients need urgent review and processing.",
  ];

  const handleNavClick = (navName) => {
    setActiveNav(navName);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  // Refetch dashboard data
  const fetchDashboardData = async () => {
    setCasesLoading(true);
    try {
      const userId = user?.id;
      const casesUrl = userId ? `/api/case?userId=${encodeURIComponent(userId)}` : '/api/case';
      const docsUrl = userId ? `/api/document?userId=${encodeURIComponent(userId)}` : '/api/document';
      const msgsUrl = userId ? `/api/message?userId=${encodeURIComponent(userId)}` : '/api/message';
      const apptsUrl = userId ? `/api/appointment?userId=${encodeURIComponent(userId)}` : '/api/appointment';
      const [casesRes, docsRes, msgsRes, apptsRes, insightsRes] = await Promise.all([
        fetch(casesUrl),
        fetch(docsUrl),
        fetch(msgsUrl),
        fetch(apptsUrl),
        fetch('/api/insight'),
      ]);
      const casesData = await casesRes.json();
      const docsData = await docsRes.json();
      const msgsData = await msgsRes.json();
      const apptsData = await apptsRes.json();
      const insightsData = await insightsRes.json();
      setCases(casesData.cases || []);
      setDocuments(docsData.documents || []);
      setMessages(msgsData.messages || []);
      setAppointments(apptsData.appointments || []);
      setInsights(insightsData.insights || []);
    } catch (err) {
      setCases([]);
      setDocuments([]);
      setMessages([]);
      setAppointments([]);
      setInsights([]);
    }
    setCasesLoading(false);
  };

  return (
    <>
      <UserTypeModal open={showModal} onClose={() => setShowModal(false)} />
      <AddCaseModal open={addCaseOpen} onClose={() => setAddCaseOpen(false)} onCaseAdded={fetchDashboardData} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Mobile overlay */}
        <div 
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-all duration-300 ${
            sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`} 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className="flex min-h-screen">
          {/* Fixed Sidebar */}
          <aside className={`
            fixed top-0 left-0 z-50 h-screen w-72 bg-white/95 backdrop-blur-xl 
            shadow-2xl border-r border-slate-200/50 flex flex-col transition-all duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `} style={{ minHeight: '100vh' }}>
            {/* Logo Section */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
                  <FaGavel className="text-white text-xl" />
                </div>
                <span className="font-serif text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                  LegalVichar
                </span>
              </div>
              <button 
                className="lg:hidden text-slate-500 hover:text-slate-700 transition-colors p-1"
                onClick={() => setSidebarOpen(false)}
              >
                <HiX className="text-xl" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <button 
                  key={item.name}
                  onClick={() => handleNavClick(item.name)}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-200
                    group hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/20
                    ${activeNav === item.name 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                    }
                  `}
                >
                  <span className={`text-lg transition-transform group-hover:scale-110 ${
                    activeNav === item.name ? 'text-white' : ''
                  }`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.name}</span>
                  {activeNav === item.name && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-white/80 animate-pulse" />
                  )}
                </button>
              ))}
            </nav>

            {/* User Profile Section */}
            <div className="mt-auto px-4 py-4 border-t border-slate-100">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200/50">
                <img 
                  src={avatarUrl} 
                  alt="avatar" 
                  className="w-12 h-12 rounded-xl border-2 border-white shadow-md object-cover" 
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 truncate text-sm">
                    {displayName}
                  </div>
                  <div className="text-xs text-slate-500 capitalize">
                    {displayRole}
                  </div>
                </div>
              </div>
            </div>
          </aside>
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-screen lg:ml-72">
            {/* Enhanced Top Navigation */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                <div className="flex items-center gap-4">
                  <button 
                    className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Open sidebar"
                  >
                    <HiMenuAlt3 className="text-xl text-slate-700" />
                  </button>
                  <div className="hidden sm:block">
                    <h1 className="font-serif text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      Dashboard
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">Welcome back, {displayName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Notifications */}
                  <div className="relative">
                    <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all duration-200 hover:scale-105">
                      <FaBell className="text-slate-600 text-lg" />
                    </button>
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                      3
                    </span>
                  </div>

                  {/* Role Switcher */}
                  <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-slate-100 to-blue-50 rounded-xl px-3 py-2 border border-slate-200/50">
                    <HiOutlineSwitchHorizontal className="text-blue-600 text-lg" />
                    <span className="text-slate-700 font-medium text-sm capitalize">{displayRole}</span>
                  </div>

                  {/* User Avatar */}
                  <div className="relative group">
                    <img 
                      src={avatarUrl} 
                      alt="avatar" 
                      className="w-10 h-10 rounded-xl border-2 border-white shadow-md object-cover cursor-pointer hover:scale-105 transition-transform" 
                    />
                    <div className="invisible group-hover:visible absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 z-50 border border-slate-200/50 backdrop-blur-xl">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="font-semibold text-slate-800 text-sm">{displayName}</div>
                        <div className="text-xs text-slate-500 capitalize">{displayRole}</div>
                      </div>
                      <button className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 text-sm transition-colors">Profile Settings</button>
                      <button className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 text-sm transition-colors">Preferences</button>
                      <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 text-sm transition-colors">Sign Out</button>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Dashboard Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto" style={{ minHeight: '100vh' }}>
              {/* Welcome Section */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 mb-2">
                      Good morning, {displayName.split(' ')[0]}
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base">{currentDate}</p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      All systems operational
                    </div>
                  </div>
                  <button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 font-semibold flex items-center gap-2 text-sm sm:text-base"
                    onClick={() => setAddCaseOpen(true)}
                  >
                    <FaPlus /> New Case
                  </button>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {quickStats.map((stat, idx) => (
                  <div 
                    key={stat.label} 
                    className={`
                      bg-gradient-to-br ${stat.color} rounded-2xl shadow-lg hover:shadow-xl 
                      p-6 transition-all duration-300 hover:scale-105 border border-white/50 
                      backdrop-blur-sm group cursor-pointer
                    `}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bgIcon} group-hover:scale-110 transition-transform duration-300`}>
                        {stat.icon}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        stat.trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {stat.trendUp ? '↗' : '→'} {stat.trend}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                        {stat.value}
                      </h3>
                      <p className="text-slate-600 font-medium text-sm">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                {/* Recent Activity - Takes 2 columns on xl screens */}
                <div className="xl:col-span-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                          <FaHistory className="text-white text-xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-serif font-semibold text-slate-800">Recent Activity</h3>
                          <p className="text-sm text-slate-500">Latest updates across all cases</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50">
                        View All
                      </button>
                    </div>

                    <div className="space-y-4">
                      {recentActivity.length === 0 ? (
                        <div className="text-center text-slate-400 py-8 text-sm">No recent case activity.</div>
                      ) : (
                        recentActivity.map((activity, idx) => (
                          <div key={idx} className="group hover:bg-slate-50 p-4 -mx-4 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-200">
                            <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-xl ${activity.iconBg} group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                                {activity.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                                      {activity.title}
                                    </h4>
                                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                      {activity.description}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-slate-400 whitespace-nowrap">
                                    <FaClock />
                                    {activity.time}
                                  </div>
                                </div>
                                
                                <div className="mt-3 flex items-center gap-3">
                                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center gap-1 hover:underline">
                                    <FaEye /> View Details
                                  </button>
                                  {activity.hasAttachment && (
                                    <button className="text-xs text-slate-500 hover:text-slate-700 font-medium transition-colors flex items-center gap-1 hover:underline">
                                      <FaPaperclip /> Attachment
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Sidebar Content */}
                <div className="space-y-6">
                  {/* AI Assistant */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg border border-amber-200/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                          <FaLightbulb className="text-white text-xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-serif font-semibold text-slate-800">AI Assistant</h3>
                          <p className="text-sm text-slate-500">Powered by advanced AI</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {aiSuggestions.map((suggestion, idx) => (
                        <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-amber-200/30 hover:border-amber-300/50 group">
                          <div className="flex items-start gap-3">
                            <FaComments className="text-amber-600 mt-0.5 group-hover:scale-110 transition-transform" />
                            <p className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors flex-1">
                              {suggestion}
                            </p>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-lg hover:bg-amber-200 transition-colors font-medium">
                              View
                            </button>
                            <button className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1 rounded-lg hover:bg-slate-100 transition-colors">
                              Dismiss
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 font-semibold">
                      <FaComments /> Ask AI Assistant
                    </button>
                  </div>

                  {/* Upcoming Appointments */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <FaCalendarAlt className="text-white text-xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-serif font-semibold text-slate-800">Upcoming</h3>
                          <p className="text-sm text-slate-500">Next 3 appointments</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <FaPlus className="text-indigo-600 text-sm" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {displayedAppointments.length === 0 ? (
                        <div className="text-center text-slate-400 py-8 text-sm">No appointments scheduled.</div>
                      ) : (
                        displayedAppointments.map((appointment, idx) => (
                          <div key={idx} className="group hover:bg-slate-50 p-3 -mx-3 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-200">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 flex flex-col items-center justify-center text-xs font-bold">
                                <span>{appointment.date.split(' ')[1]}</span>
                                <span className="text-xs font-normal">{appointment.date.split(' ')[0]}</span>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm truncate">
                                    {appointment.title}
                                  </h4>
                                  <button className="text-slate-400 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100">
                                    <FaEllipsisV className="text-xs" />
                                  </button>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                  <FaClock />
                                  <span>{appointment.time}</span>
                                  <span className="text-slate-300">•</span>
                                  <span className="truncate">{appointment.location}</span>
                                </div>
                                
                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex -space-x-2">
                                    {appointment.participants.map((participant, pIdx) => (
                                      <div 
                                        key={pIdx} 
                                        className={`w-6 h-6 rounded-full ${participant.color} flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm`}
                                      >
                                        {participant.initials}
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <button className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors font-medium">
                                    {appointment.type === 'court' ? 'Join' : 'View'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>

          {/* Floating Action Button */}
          <button className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 hover:scale-105 transition-all duration-200 font-semibold text-sm sm:text-base">
            <FaComments className="text-xl" />
            <span className="hidden sm:inline">Legal AI</span>
          </button>
        </div>
      </div>
    </>
  );
}