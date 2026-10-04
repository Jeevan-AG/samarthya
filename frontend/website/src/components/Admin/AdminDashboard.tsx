import React, { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Plus,
  Eye,
  Check,
  Calendar,
  Users,
  Archive,
  Inbox,
  Settings as SettingsIcon,
  X,
  ExternalLink,
  LogOut,
  RefreshCw,
  UserCheck,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  Search,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  AlertOctagon,
  GraduationCap,
  Image as ImageIcon,
  Cpu,
} from 'lucide-react';
import type {
  SamarthyaEvent,
  SamarthyaTeamMember,
  SamarthyaFaculty,
  SamarthyaGalleryItem,
  CMSTab,
} from '../../types/admin';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import type { AdminUser } from '../../hooks/useAdminAuth';
import { soundEffects } from '../../utils/soundEffects';
import { handleImageError } from '../../utils/imageFallback';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onLogout?: () => void;
  currentUser?: AdminUser | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToSite,
  onLogout,
  currentUser: propUser,
}) => {
  const {
    events,
    team,
    faculty,
    gallery,
    applications,
    adminUsers,
    siteConfig,
    isCloudConnected,
    activeTab,
    setActiveTab,
    statusNotification,
    showNotification,
    addEvent,
    updateEvent,
    deleteEvent,
    reorderEvents,
    addMember,
    updateMember,
    deleteMember,
    reorderTeam,
    addFaculty,
    updateFaculty,
    deleteFaculty,
    reorderFaculty,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    reorderGallery,
    deleteApplication,
    refreshApplications,
    approveAdmin,
    rejectAdmin,
    deleteAdmin,
    refreshAdminUsers,
    updateSiteConfig,
    exportJSON,
    importJSON,
    resetToDefaults,
  } = useAdminData();

  const { currentUser: authUser } = useAdminAuth();
  const currentUser = propUser || authUser;

  // Search & Filter States
  const [eventSearch, setEventSearch] = useState('');
  const [teamCategoryFilter, setTeamCategoryFilter] = useState('ALL');
  const [teamSearch, setTeamSearch] = useState('');
  const [appDomainFilter, setAppDomainFilter] = useState('ALL');

  // Modals
  const [editingEvent, setEditingEvent] = useState<SamarthyaEvent | null>(null);
  const [editingMember, setEditingMember] = useState<SamarthyaTeamMember | null>(null);
  const [editingFaculty, setEditingFaculty] = useState<SamarthyaFaculty | null>(null);
  const [editingGallery, setEditingGallery] = useState<SamarthyaGalleryItem | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'event' | 'team' | 'faculty' | 'gallery';
    id: string;
    name: string;
  } | null>(null);

  const [isMuted, setIsMuted] = useState(() => soundEffects.isMuted());

  const toggleSound = () => {
    const next = soundEffects.toggleMute();
    setIsMuted(next);
    showNotification(next ? 'Sound FX muted' : 'Sound FX enabled');
  };

  // Helper for image upload with canvas resizing
  const handlePhotoUpload = (file: File, callback: (dataUrl: string) => void) => {
    if (!file || !file.type.startsWith('image/')) {
      showNotification('Please select a valid image file (PNG, JPG, WebP).');
      soundEffects.playError();
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) return;

      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedUrl = canvas.toDataURL('image/webp', 0.85);
          callback(optimizedUrl);
          soundEffects.playSuccess();
          showNotification('Photo processed and WebP compressed.');
        } else {
          callback(rawDataUrl);
          soundEffects.playClick();
          showNotification('Photo attached.');
        }
      };
      img.onerror = () => {
        callback(rawDataUrl);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const pendingAdminCount = adminUsers.filter((u) => u.status === 'pending').length;

  // Filtered lists
  const filteredEvents = events.filter(
    (ev) =>
      ev.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
      ev.category.toLowerCase().includes(eventSearch.toLowerCase()) ||
      ev.description.toLowerCase().includes(eventSearch.toLowerCase())
  );

  const teamCategories = ['ALL', ...Array.from(new Set(team.map((m) => m.category)))];
  const filteredTeam = team.filter((m) => {
    const matchCat = teamCategoryFilter === 'ALL' || m.category === teamCategoryFilter;
    const matchSearch =
      m.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(teamSearch.toLowerCase()) ||
      m.domain.toLowerCase().includes(teamSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const appDomains = [
    'ALL',
    ...Array.from(new Set(applications.map((a) => a.domain).filter(Boolean))),
  ];
  const filteredApps = applications.filter((a) => {
    if (appDomainFilter === 'ALL') return true;
    return a.domain === appDomainFilter;
  });

  return (
    <div className="min-h-screen bg-[#03060d] text-paper font-mono pb-24 selection:bg-cyan selection:text-[#03060d]">
      {/* ════════════ TOP ADMIN HEADER ════════════ */}
      <header className="sticky top-0 z-40 border-b border-line/40 bg-[#070d18]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/30 text-cyan">
              <Cpu size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-bold tracking-wider text-cyan">
                  SAMARTHYA // ADMIN CMS
                </h1>
                <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-0.5 text-[10px] text-cyan">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
                  HARDWARE &amp; CONTENT CONTROLLER
                </span>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Status indicator */}
            <div
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] ${
                isCloudConnected
                  ? 'border-cyan/30 bg-cyan/10 text-cyan'
                  : 'border-white/10 bg-[#0b1526] text-[#7d8ea3]'
              }`}
              title={
                isCloudConnected
                  ? 'Connected to Supabase Cloud Database'
                  : 'Local Storage Cache Mode'
              }
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isCloudConnected ? 'bg-cyan animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="hidden sm:inline">
                {isCloudConnected ? 'CLOUD SYNC ON' : 'LOCAL CACHE'}
              </span>
            </div>

            {/* Sound Mute Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-lg border border-line bg-[#03060d] text-[#7d8ea3] hover:text-cyan hover:border-cyan/50 transition-colors"
              title={isMuted ? 'Unmute procedural sound FX' : 'Mute sound FX'}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-cyan" />}
            </button>

            {/* Public Site Button */}
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onBackToSite();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-cyan bg-cyan px-3.5 py-1.5 text-xs font-bold text-[#03060d] hover:bg-cyan-dim transition-all shadow-[0_0_15px_rgba(0,229,224,0.3)]"
            >
              <Eye size={13} />
              <span>PUBLIC PORTAL</span>
            </button>

            {/* User Badge */}
            {currentUser && (
              <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-line bg-[#03060d] px-2.5 py-1 text-[11px] text-[#7d8ea3]">
                <span className="text-cyan font-semibold">{currentUser.username}</span>
                <span className="text-[10px] text-[#4e6178]">({currentUser.role})</span>
              </div>
            )}

            {/* Logout */}
            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  onLogout();
                }}
                className="flex items-center gap-1.5 rounded-lg border border-line bg-[#070d18] px-3 py-1.5 text-xs text-[#7d8ea3] hover:border-[#ff5f56] hover:text-[#ff5f56] transition-colors"
                title="Log out of CMS"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">LOGOUT</span>
              </button>
            )}
          </div>
        </div>

        {/* ════════════ NAVIGATION TABS ════════════ */}
        <div className="mx-auto max-w-7xl mt-3 flex overflow-x-auto gap-2 border-t border-line/40 pt-2.5 pb-0.5 no-scrollbar">
          <TabButton
            active={activeTab === 'events'}
            onClick={() => {
              soundEffects.playHover();
              setActiveTab('events');
            }}
            icon={<Calendar size={14} />}
            label={`Events (${events.length})`}
          />
          <TabButton
            active={activeTab === 'team'}
            onClick={() => {
              soundEffects.playHover();
              setActiveTab('team');
            }}
            icon={<Users size={14} />}
            label={`Team (${team.length})`}
          />
          <TabButton
            active={activeTab === 'faculty'}
            onClick={() => {
              soundEffects.playHover();
              setActiveTab('faculty');
            }}
            icon={<GraduationCap size={14} />}
            label={`Faculty (${faculty.length})`}
          />
          <TabButton
            active={activeTab === 'gallery'}
            onClick={() => {
              soundEffects.playHover();
              setActiveTab('gallery');
            }}
            icon={<ImageIcon size={14} />}
            label={`Media Archive (${gallery.length})`}
          />
          <TabButton
            active={activeTab === 'applications'}
            onClick={() => {
              soundEffects.playHover();
              setActiveTab('applications');
            }}
            icon={<Inbox size={14} />}
            label={`Applications (${applications.length})`}
          />
          <TabButton
            active={activeTab === 'approvals'}
            onClick={() => {
              soundEffects.playHover();
              setActiveTab('approvals');
            }}
            icon={<UserCheck size={14} />}
            label={`Admin Approvals ${
              pendingAdminCount > 0
                ? `(${pendingAdminCount} Pending)`
                : `(${adminUsers.length})`
            }`}
          />
          <TabButton
            active={activeTab === 'settings'}
            onClick={() => {
              soundEffects.playHover();
              setActiveTab('settings');
            }}
            icon={<SettingsIcon size={14} />}
            label="Site Settings &amp; Backup"
          />
        </div>
      </header>

      {/* Floating Status Notification Toast */}
      {statusNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-cyan bg-[#070d18] px-4 py-3 text-xs text-cyan shadow-[0_0_25px_rgba(0,229,224,0.4)]">
          <Check size={16} className="text-cyan shrink-0" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* ════════════ MAIN CONTENT CONTAINER ════════════ */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 pt-8">
        {/* =========================================================
            TAB 1: EVENTS & WORKSHOPS MANAGEMENT
            ========================================================= */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-paper">
                  Events &amp; Workshops Management
                </h2>
                <p className="text-xs text-[#7d8ea3] mt-1">
                  Control workshop cards, Circuit Craft editions, reorder positions, and update photos.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    const newEv: SamarthyaEvent = {
                      id: 'evt-' + Date.now(),
                      title: 'New Hardware Workshop',
                      subtitle: 'Hands-on Embedded Engineering Session',
                      description: 'Comprehensive practical session on electronics and circuits.',
                      date: new Date().toISOString().split('T')[0],
                      time: '10:00 AM - 5:00 PM',
                      venue: 'ECE Systems & Hardware Lab',
                      category: 'Workshop',
                      status: 'upcoming',
                      featured: false,
                      highlights: ['PCB Design fundamentals', 'Soldering practice'],
                    };
                    addEvent(newEv);
                    setEditingEvent(newEv);
                    showNotification('New event draft created.');
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-cyan px-4 py-2 text-xs font-bold text-[#03060d] hover:bg-cyan-dim transition-all shadow-[0_0_15px_rgba(0,229,224,0.3)]"
                >
                  <Plus size={14} />
                  <span>ADD EVENT</span>
                </button>
              </div>
            </div>

            {/* Search Filter */}
            <div className="relative max-w-md">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d8ea3]"
              />
              <input
                type="text"
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                placeholder="Search events by title, category, or keyword..."
                className="w-full rounded-xl border border-line bg-[#070d18] pl-9 pr-4 py-2 text-xs text-paper placeholder-[#4e6178] focus:border-cyan focus:outline-none"
              />
            </div>

            {/* Events List */}
            <div className="grid grid-cols-1 gap-4">
              {filteredEvents.map((ev, index) => (
                <div
                  key={ev.id}
                  className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 rounded-2xl border border-line bg-[#070d18] p-5 hover:border-cyan/50 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* Event Photo / Icon */}
                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-line bg-[#0b1526] flex items-center justify-center">
                      {ev.image ? (
                        <img
                          src={ev.image}
                          alt={ev.title}
                          className="h-full w-full object-cover"
                          onError={handleImageError}
                        />
                      ) : (
                        <Cpu className="text-cyan/60" size={28} />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[11px] flex-wrap">
                        <span className="font-bold text-cyan uppercase">{ev.category}</span>
                        <span className="text-[#4e6178]">·</span>
                        <span className="text-[#7d8ea3]">{ev.date}</span>
                        {ev.edition && (
                          <span className="rounded bg-cyan/20 border border-cyan/40 px-1.5 py-0.2 text-[10px] text-cyan font-bold">
                            v{ev.edition}
                          </span>
                        )}
                        <span
                          className={`rounded px-1.5 py-0.2 text-[10px] uppercase font-bold ${
                            ev.status === 'upcoming'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : ev.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-white/10 text-[#7d8ea3]'
                          }`}
                        >
                          {ev.status}
                        </span>
                        {ev.featured && (
                          <span className="rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 text-[10px] font-bold">
                            FEATURED
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-lg font-bold text-paper truncate">
                        {ev.title}
                      </h3>

                      <p className="text-xs text-[#7d8ea3] line-clamp-1 max-w-2xl">
                        {ev.subtitle || ev.description}
                      </p>

                      {ev.highlights && ev.highlights.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap pt-1">
                          {ev.highlights.slice(0, 3).map((h, i) => (
                            <span
                              key={i}
                              className="text-[10px] text-[#4e6178] bg-[#03060d] px-2 py-0.5 rounded border border-line"
                            >
                              • {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order & Action buttons */}
                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => {
                        soundEffects.playClick();
                        reorderEvents(index, index - 1);
                        showNotification(`Moved "${ev.title}" UP`);
                      }}
                      className="p-2 rounded-lg border border-line bg-[#03060d] text-[#7d8ea3] hover:text-cyan hover:border-cyan disabled:opacity-20 transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={index === filteredEvents.length - 1}
                      onClick={() => {
                        soundEffects.playClick();
                        reorderEvents(index, index + 1);
                        showNotification(`Moved "${ev.title}" DOWN`);
                      }}
                      className="p-2 rounded-lg border border-line bg-[#03060d] text-[#7d8ea3] hover:text-cyan hover:border-cyan disabled:opacity-20 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playClick();
                        setEditingEvent(ev);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-cyan/40 bg-cyan/10 text-xs text-cyan hover:bg-cyan/20 transition-all font-semibold"
                    >
                      <Edit2 size={13} />
                      <span>EDIT</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playHover();
                        setDeleteTarget({ type: 'event', id: ev.id, name: ev.title });
                      }}
                      className="p-2 rounded-lg border border-[#ff5f56]/30 bg-[#ff5f56]/10 text-[#ff5f56] hover:bg-[#ff5f56]/20 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: TEAM & LEADERSHIP MANAGEMENT
            ========================================================= */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-paper">
                  Leadership Team Management
                </h2>
                <p className="text-xs text-[#7d8ea3] mt-1">
                  Manage executive bearers, domain leads, student coordinators, and headshots.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  const newMember: SamarthyaTeamMember = {
                    id: 'tm-' + Date.now(),
                    name: 'New Executive Member',
                    role: 'Lead Coordinator',
                    category: 'Executive Leadership',
                    year: 'Third Year',
                    semester: 'V Sem',
                    domain: 'Hardware & Embedded',
                    image: '',
                    linkedin: 'https://linkedin.com/',
                  };
                  addMember(newMember);
                  setEditingMember(newMember);
                  showNotification('New member added.');
                }}
                className="flex items-center gap-1.5 rounded-lg bg-cyan px-4 py-2 text-xs font-bold text-[#03060d] hover:bg-cyan-dim transition-all shadow-[0_0_15px_rgba(0,229,224,0.3)]"
              >
                <Plus size={14} />
                <span>ADD MEMBER</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d8ea3]"
                />
                <input
                  type="text"
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  placeholder="Search by name, role, or domain..."
                  className="w-full rounded-xl border border-line bg-[#070d18] pl-9 pr-4 py-2 text-xs text-paper placeholder-[#4e6178] focus:border-cyan focus:outline-none"
                />
              </div>

              <select
                value={teamCategoryFilter}
                onChange={(e) => setTeamCategoryFilter(e.target.value)}
                className="rounded-xl border border-line bg-[#070d18] px-3 py-2 text-xs text-paper focus:border-cyan focus:outline-none"
              >
                {teamCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Member Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTeam.map((member, index) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-[#070d18] p-5 hover:border-cyan/50 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-cyan/40 bg-[#0b1526]">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="h-full w-full object-cover"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center font-display text-xl text-cyan bg-cyan/10">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-cyan">{member.role}</span>
                        <span className="text-[10px] text-[#4e6178]">({member.semester})</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-paper truncate">
                        {member.name}
                      </h3>
                      <p className="text-xs text-[#7d8ea3] truncate">{member.domain}</p>
                      <p className="text-[10px] text-[#4e6178]">{member.category}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => {
                        soundEffects.playClick();
                        reorderTeam(index, index - 1);
                        showNotification(`Moved "${member.name}" UP`);
                      }}
                      className="p-1.5 rounded-lg border border-line bg-[#03060d] text-[#7d8ea3] hover:text-cyan disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={index === filteredTeam.length - 1}
                      onClick={() => {
                        soundEffects.playClick();
                        reorderTeam(index, index + 1);
                        showNotification(`Moved "${member.name}" DOWN`);
                      }}
                      className="p-1.5 rounded-lg border border-line bg-[#03060d] text-[#7d8ea3] hover:text-cyan disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playClick();
                        setEditingMember(member);
                      }}
                      className="p-2 rounded-lg border border-cyan/40 bg-cyan/10 text-cyan hover:bg-cyan/20 transition-all"
                      title="Edit Member"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playHover();
                        setDeleteTarget({ type: 'team', id: member.id, name: member.name });
                      }}
                      className="p-2 rounded-lg border border-[#ff5f56]/30 bg-[#ff5f56]/10 text-[#ff5f56] hover:bg-[#ff5f56]/20 transition-colors"
                      title="Delete Member"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: FACULTY COORDINATORS MANAGEMENT
            ========================================================= */}
        {activeTab === 'faculty' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-paper">
                  Faculty Coordinators Management
                </h2>
                <p className="text-xs text-[#7d8ea3] mt-1">
                  Manage department faculty advisors, office locations, and academic qualifications.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  const newFac: SamarthyaFaculty = {
                    id: 'fac-' + Date.now(),
                    name: 'Faculty Coordinator',
                    role: 'Faculty Coordinator',
                    designation: 'Assistant Professor',
                    department: 'Electronics & Communication Engineering',
                    image: '',
                    linkedin: 'https://linkedin.com/',
                    office: 'ECE Faculty Block, SJEC',
                    qualifications: ['M.Tech in VLSI Systems'],
                  };
                  addFaculty(newFac);
                  setEditingFaculty(newFac);
                  showNotification('New faculty coordinator added.');
                }}
                className="flex items-center gap-1.5 rounded-lg bg-cyan px-4 py-2 text-xs font-bold text-[#03060d] hover:bg-cyan-dim transition-all shadow-[0_0_15px_rgba(0,229,224,0.3)]"
              >
                <Plus size={14} />
                <span>ADD FACULTY</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faculty.map((fac, index) => (
                <div
                  key={fac.id}
                  className="rounded-2xl border border-line bg-[#070d18] p-6 hover:border-cyan/50 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-cyan/40 bg-[#0b1526]">
                        {fac.image ? (
                          <img
                            src={fac.image}
                            alt={fac.name}
                            className="h-full w-full object-cover"
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center font-display text-xl text-cyan bg-cyan/10">
                            {fac.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-cyan">{fac.role}</span>
                        <h3 className="font-display text-xl font-bold text-paper">{fac.name}</h3>
                        <p className="text-xs text-[#7d8ea3]">{fac.designation}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          soundEffects.playClick();
                          setEditingFaculty(fac);
                        }}
                        className="p-2 rounded-lg border border-cyan/40 bg-cyan/10 text-cyan hover:bg-cyan/20"
                        title="Edit Faculty"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          soundEffects.playHover();
                          setDeleteTarget({ type: 'faculty', id: fac.id, name: fac.name });
                        }}
                        className="p-2 rounded-lg border border-[#ff5f56]/30 bg-[#ff5f56]/10 text-[#ff5f56] hover:bg-[#ff5f56]/20"
                        title="Delete Faculty"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-line bg-[#03060d] p-3 text-xs space-y-1.5">
                    <div className="text-[#7d8ea3]">
                      <span className="text-paper font-semibold">Office:</span> {fac.office}
                    </div>
                    {fac.qualifications && (
                      <div className="text-[#7d8ea3]">
                        <span className="text-paper font-semibold">Qualifications:</span>{' '}
                        {fac.qualifications.join(' • ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: MEDIA ARCHIVE & GALLERY
            ========================================================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-paper">
                  Media Archive &amp; Gallery
                </h2>
                <p className="text-xs text-[#7d8ea3] mt-1">
                  Manage department photo gallery, workshop moments, and exhibition archives.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  const newItem: SamarthyaGalleryItem = {
                    id: 'gal-' + Date.now(),
                    title: 'New Hardware Verification Session',
                    category: 'Circuit Craft',
                    tag: 'Workshop',
                    image: '',
                    alt: 'Students assembling prototype hardware circuits',
                    caption: 'Students assembling and debugging hardware circuits in lab.',
                  };
                  addGalleryItem(newItem);
                  setEditingGallery(newItem);
                  showNotification('New gallery photo added.');
                }}
                className="flex items-center gap-1.5 rounded-lg bg-cyan px-4 py-2 text-xs font-bold text-[#03060d] hover:bg-cyan-dim transition-all shadow-[0_0_15px_rgba(0,229,224,0.3)]"
              >
                <Plus size={14} />
                <span>ADD PHOTO</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-line bg-[#070d18] overflow-hidden hover:border-cyan/50 transition-all flex flex-col justify-between"
                >
                  <div className="relative h-44 bg-[#0b1526] overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.alt || item.title}
                        className="h-full w-full object-cover"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-cyan/50">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 rounded-full bg-[#03060d]/80 backdrop-blur-md border border-cyan/40 px-2.5 py-0.5 text-[10px] text-cyan font-bold">
                      {item.tag}
                    </span>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-cyan tracking-wider">
                        {item.category}
                      </div>
                      <h3 className="font-display text-base font-bold text-paper mt-0.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#7d8ea3] line-clamp-2 mt-1">{item.caption}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-line/40 pt-3 mt-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => {
                            soundEffects.playClick();
                            reorderGallery(index, index - 1);
                          }}
                          className="p-1 rounded text-[#7d8ea3] hover:text-cyan disabled:opacity-20"
                          title="Move Left/Up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={index === gallery.length - 1}
                          onClick={() => {
                            soundEffects.playClick();
                            reorderGallery(index, index + 1);
                          }}
                          className="p-1 rounded text-[#7d8ea3] hover:text-cyan disabled:opacity-20"
                          title="Move Right/Down"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            soundEffects.playClick();
                            setEditingGallery(item);
                          }}
                          className="p-1.5 rounded-lg border border-cyan/40 bg-cyan/10 text-cyan hover:bg-cyan/20"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            soundEffects.playHover();
                            setDeleteTarget({ type: 'gallery', id: item.id, name: item.title });
                          }}
                          className="p-1.5 rounded-lg border border-[#ff5f56]/30 bg-[#ff5f56]/10 text-[#ff5f56] hover:bg-[#ff5f56]/20"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: STUDENT APPLICATIONS / RECRUITS
            ========================================================= */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-paper">
                  Student Recruitment Applications
                </h2>
                <p className="text-xs text-[#7d8ea3] mt-1">
                  Submissions from aspiring members, hardware engineers, and student leads.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    soundEffects.playClick();
                    await refreshApplications();
                    showNotification('Refreshed application records.');
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-cyan/40 bg-cyan/10 px-3.5 py-1.5 text-xs text-cyan hover:bg-cyan/20 transition-all font-semibold"
                >
                  <RefreshCw size={13} />
                  <span>REFRESH LIST</span>
                </button>
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#7d8ea3]">Domain Filter:</span>
              <select
                value={appDomainFilter}
                onChange={(e) => setAppDomainFilter(e.target.value)}
                className="rounded-lg border border-line bg-[#070d18] px-3 py-1.5 text-xs text-paper focus:border-cyan focus:outline-none"
              >
                {appDomains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {filteredApps.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line p-12 text-center text-xs text-[#7d8ea3]">
                No applications found under this filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-2xl border border-line bg-[#070d18] p-6 space-y-4 hover:border-cyan/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-display text-xl font-bold text-paper">{app.name}</h3>
                          {app.usn && (
                            <span className="rounded bg-[#03060d] border border-line px-2 py-0.5 text-[11px] text-cyan font-bold">
                              USN: {app.usn}
                            </span>
                          )}
                          {app.semester && (
                            <span className="text-xs text-[#7d8ea3]">({app.semester})</span>
                          )}
                        </div>
                        <div className="text-xs text-cyan mt-1">{app.email}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[#4e6178]">
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            soundEffects.playHover();
                            deleteApplication(app.id);
                            showNotification(`Dismissed application from ${app.name}`);
                          }}
                          className="p-1.5 rounded-lg text-[#ff5f56] hover:bg-[#ff5f56]/10"
                          title="Delete Application"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-line bg-[#03060d] p-4 text-xs space-y-2">
                      <div className="text-cyan font-semibold">
                        Domain Interest: {app.domain || 'General Hardware Society'}
                      </div>
                      <p className="text-paper/90 leading-relaxed whitespace-pre-wrap">
                        {app.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 6: ADMIN APPROVALS & ROLES
            ========================================================= */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-paper flex items-center gap-2.5">
                  <UserCheck className="text-cyan" />
                  <span>Admin Registration Approvals</span>
                </h2>
                <p className="text-xs text-[#7d8ea3] mt-1">
                  Newly registered admin accounts require approval from the Head Administrator before
                  sign-in is authorized.
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  soundEffects.playClick();
                  await refreshAdminUsers();
                  showNotification('Refreshed admin accounts.');
                }}
                className="flex items-center gap-1.5 rounded-lg border border-cyan/40 bg-cyan/10 px-3.5 py-1.5 text-xs text-cyan hover:bg-cyan/20 transition-all font-semibold"
              >
                <RefreshCw size={13} />
                <span>REFRESH</span>
              </button>
            </div>

            <div className="grid gap-4">
              {adminUsers.map((user) => (
                <div
                  key={user.username}
                  className="rounded-2xl border border-line bg-[#070d18] p-5 transition-all hover:border-cyan/50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-bold text-base text-paper">{user.username}</span>
                        <span className="text-xs text-[#7d8ea3]">
                          ({user.username}@samarthya.sjec.ac.in)
                        </span>

                        {/* Status Badges */}
                        {user.status === 'pending' && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-400/20 border border-amber-400/40 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                            <Clock size={11} />
                            <span>PENDING APPROVAL</span>
                          </span>
                        )}
                        {user.status === 'approved' && (
                          <span className="flex items-center gap-1 rounded-full bg-cyan/20 border border-cyan/40 px-2.5 py-0.5 text-[11px] font-bold text-cyan">
                            <CheckCircle size={11} />
                            <span>APPROVED</span>
                          </span>
                        )}
                        {user.status === 'rejected' && (
                          <span className="flex items-center gap-1 rounded-full bg-[#ff5f56]/20 border border-[#ff5f56]/40 px-2.5 py-0.5 text-[11px] font-bold text-[#ff5f56]">
                            <XCircle size={11} />
                            <span>REJECTED</span>
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-[#4e6178]">
                        Role: {user.role || 'lead_admin'}
                        {user.registeredAt &&
                          ` • Registered: ${new Date(user.registeredAt).toLocaleString()}`}
                        {user.approvedAt &&
                          ` • Approved: ${new Date(user.approvedAt).toLocaleString()}`}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {user.status !== 'approved' && (
                        <button
                          type="button"
                          onClick={async () => {
                            soundEffects.playSuccess();
                            const res = await approveAdmin(user.username);
                            if (res.success) {
                              showNotification(`Approved admin access for "${user.username}".`);
                            }
                          }}
                          className="flex items-center gap-1.5 rounded-lg bg-cyan px-3 py-1.5 text-xs font-bold text-[#03060d] hover:bg-cyan-dim transition-colors"
                        >
                          <CheckCircle size={13} />
                          <span>Approve</span>
                        </button>
                      )}

                      {user.status !== 'rejected' && user.username !== 'admin' && (
                        <button
                          type="button"
                          onClick={async () => {
                            soundEffects.playHover();
                            const res = await rejectAdmin(user.username);
                            if (res.success) {
                              showNotification(`Rejected admin access for "${user.username}".`);
                            }
                          }}
                          className="flex items-center gap-1.5 rounded-lg border border-[#ff5f56]/50 px-3 py-1.5 text-xs text-[#ff5f56] hover:bg-[#ff5f56]/10 transition-colors"
                        >
                          <XCircle size={13} />
                          <span>Reject</span>
                        </button>
                      )}

                      {user.username !== 'admin' && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm(`Permanently remove admin user "${user.username}"?`)) {
                              soundEffects.playHover();
                              await deleteAdmin(user.username);
                              showNotification(`Deleted account "${user.username}".`);
                            }
                          }}
                          className="p-1.5 rounded-lg border border-line text-[#7d8ea3] hover:text-[#ff5f56] hover:border-[#ff5f56]/50"
                          title="Delete Account"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 7: SITE SETTINGS, DATA EXPORT & REPOSITORY BACKUP
            ========================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-paper">
                Site Branding, Settings &amp; Git Repository Sync
              </h2>
              <p className="text-xs text-[#7d8ea3] mt-1">
                Customize department headlines, official contacts, and export pure JSON for direct
                commit to Git.
              </p>
            </div>

            {/* General Site Config Form */}
            <div className="rounded-2xl border border-line bg-[#070d18] p-6 space-y-4 text-xs">
              <h3 className="font-display text-lg font-bold text-cyan tracking-wider">
                Department &amp; Club Identity
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Club Full Name</label>
                  <input
                    type="text"
                    value={siteConfig.fullName}
                    onChange={(e) => updateSiteConfig({ fullName: e.target.value })}
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2.5 text-paper focus:border-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Official Contact Email</label>
                  <input
                    type="email"
                    value={siteConfig.contactEmail}
                    onChange={(e) => updateSiteConfig({ contactEmail: e.target.value })}
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2.5 text-paper focus:border-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-paper/80 mb-1 font-semibold">Hero Tagline</label>
                <input
                  type="text"
                  value={siteConfig.tagline}
                  onChange={(e) => updateSiteConfig({ tagline: e.target.value })}
                  className="w-full rounded-lg border border-line bg-[#03060d] p-2.5 text-paper focus:border-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-paper/80 mb-1 font-semibold">About Text Copy</label>
                <textarea
                  rows={3}
                  value={siteConfig.aboutText}
                  onChange={(e) => updateSiteConfig({ aboutText: e.target.value })}
                  className="w-full rounded-lg border border-line bg-[#03060d] p-2.5 text-paper focus:border-cyan focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Office Location</label>
                  <input
                    type="text"
                    value={siteConfig.officeLocation}
                    onChange={(e) => updateSiteConfig({ officeLocation: e.target.value })}
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2.5 text-paper focus:border-cyan focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Motto</label>
                  <input
                    type="text"
                    value={siteConfig.motto}
                    onChange={(e) => updateSiteConfig({ motto: e.target.value })}
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2.5 text-paper focus:border-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSuccess();
                    showNotification('Site settings updated.');
                  }}
                  className="rounded-lg bg-cyan px-4 py-2 text-xs font-bold text-[#03060d] hover:bg-cyan-dim"
                >
                  SAVE BRANDING CONFIG
                </button>
              </div>
            </div>

            {/* ════════════ PURE JSON EXPORT / REPO SYNC ════════════ */}
            <div className="rounded-2xl border border-cyan/40 bg-[#070d18] p-6 space-y-4 text-xs shadow-[0_0_40px_rgba(0,229,224,0.1)]">
              <div className="flex items-center gap-2">
                <Download className="text-cyan" size={18} />
                <h3 className="font-display text-lg font-bold text-cyan tracking-wider">
                  Git Repository JSON Exporter
                </h3>
              </div>
              <p className="text-[#7d8ea3] leading-relaxed">
                Download pure JSON files formatted identically to the codebase in{' '}
                <code className="text-cyan">src/data/</code>. Organizers can drop these downloaded files
                directly into the repository or commit them to GitHub to update the public build!
              </p>

              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    exportJSON('events');
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-cyan/40 bg-[#03060d] px-3.5 py-2 text-xs text-cyan hover:bg-cyan/10 transition-colors font-semibold"
                >
                  <Download size={13} />
                  <span>Download events.json</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    exportJSON('team');
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-cyan/40 bg-[#03060d] px-3.5 py-2 text-xs text-cyan hover:bg-cyan/10 transition-colors font-semibold"
                >
                  <Download size={13} />
                  <span>Download team.json</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    exportJSON('faculty');
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-cyan/40 bg-[#03060d] px-3.5 py-2 text-xs text-cyan hover:bg-cyan/10 transition-colors font-semibold"
                >
                  <Download size={13} />
                  <span>Download faculty.json</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    exportJSON('gallery');
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-cyan/40 bg-[#03060d] px-3.5 py-2 text-xs text-cyan hover:bg-cyan/10 transition-colors font-semibold"
                >
                  <Download size={13} />
                  <span>Download gallery.json</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSuccess();
                    exportJSON('all');
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-cyan px-4 py-2 text-xs font-bold text-[#03060d] hover:bg-cyan-dim transition-all shadow-[0_0_20px_rgba(0,229,224,0.3)]"
                >
                  <Sparkles size={14} />
                  <span>Complete Backup (All Data)</span>
                </button>
              </div>
            </div>

            {/* ════════════ PURE JSON IMPORTER ════════════ */}
            <div className="rounded-2xl border border-line bg-[#070d18] p-6 space-y-4 text-xs">
              <div className="flex items-center gap-2">
                <Upload className="text-cyan" size={18} />
                <h3 className="font-display text-lg font-bold text-paper tracking-wider">
                  Import JSON File
                </h3>
              </div>
              <p className="text-[#7d8ea3]">
                Upload any JSON file to instantly overwrite and sync that collection.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {(['events', 'team', 'faculty', 'gallery'] as const).map((type) => (
                  <label
                    key={type}
                    className="flex flex-col items-center justify-center border border-dashed border-line hover:border-cyan rounded-xl p-4 cursor-pointer bg-[#03060d] transition-colors group"
                  >
                    <Upload size={18} className="text-[#7d8ea3] group-hover:text-cyan mb-2" />
                    <span className="uppercase text-[11px] font-bold text-paper group-hover:text-cyan">
                      Import {type}.json
                    </span>
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          soundEffects.playClick();
                          importJSON(file, type);
                          e.target.value = '';
                        }
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* ════════════ FACTORY RESET ════════════ */}
            <div className="rounded-2xl border border-[#ff5f56]/30 bg-[#ff5f56]/5 p-6 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-[#ff5f56]">
                <AlertOctagon size={18} />
                <h3 className="font-display text-lg font-bold">Factory Reset</h3>
              </div>
              <p className="text-[#7d8ea3]">
                Restore all events, team members, faculty, and media back to the original source
                files in the code repository.
              </p>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playHover();
                  resetToDefaults();
                }}
                className="rounded-lg border border-[#ff5f56]/60 bg-[#ff5f56]/10 px-4 py-2 text-xs font-bold text-[#ff5f56] hover:bg-[#ff5f56]/20 transition-colors"
              >
                RESTORE REPOSITORY DEFAULTS
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ═════════════════════════════════════════════════════
          EVENT EDIT / ADD MODAL
          ═════════════════════════════════════════════════════ */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
          <div className="my-auto w-full max-w-2xl rounded-2xl border border-cyan/50 bg-[#070d18] p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(0,229,224,0.2)]">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-display text-xl font-bold text-cyan">
                Edit Event: {editingEvent.title}
              </h3>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="text-[#7d8ea3] hover:text-cyan"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-paper/80 mb-1 font-semibold">Event Title *</label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full rounded-lg border border-line bg-[#03060d] p-2.5 text-paper focus:border-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Category</label>
                  <input
                    type="text"
                    value={editingEvent.category}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                    placeholder="Flagship Workshop, Symposium, etc."
                  />
                </div>
                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Edition (e.g. 2.0)</label>
                  <input
                    type="text"
                    value={editingEvent.edition || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, edition: e.target.value })}
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                    placeholder="1.0, 2.0, 3.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Time</label>
                  <input
                    type="text"
                    value={editingEvent.time || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                    placeholder="10:00 AM - 5:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Status</label>
                  <select
                    value={editingEvent.status}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        status: e.target.value as 'completed' | 'upcoming' | 'past' | 'live',
                      })
                    }
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                  >
                    <option value="upcoming">upcoming</option>
                    <option value="completed">completed</option>
                    <option value="past">past</option>
                    <option value="live">live</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-paper/80 mb-1 font-semibold">Venue</label>
                <input
                  type="text"
                  value={editingEvent.venue || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                  className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                  placeholder="ECE Systems & Hardware Lab"
                />
              </div>

              <div>
                <label className="block text-paper/80 mb-1 font-semibold">Subtitle / Summary</label>
                <input
                  type="text"
                  value={editingEvent.subtitle || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, subtitle: e.target.value })}
                  className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-paper/80 mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={editingEvent.description}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none resize-none"
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-paper/80 mb-1 font-semibold">
                  Highlights (one per line)
                </label>
                <textarea
                  rows={3}
                  value={(editingEvent.highlights || []).join('\n')}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      highlights: e.target.value.split('\n').filter((l) => l.trim()),
                    })
                  }
                  className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none resize-none font-mono text-[11px]"
                  placeholder="Custom PCB layout with EDA tools&#10;Hands-on soldering & component assembly"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-paper/80 mb-1 font-semibold">Event Photo</label>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-[#03060d] p-3 hover:border-cyan/40">
                  <div className="space-y-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-cyan px-3.5 py-1.5 text-xs font-bold text-[#03060d] hover:bg-cyan-dim transition-colors">
                      <Upload size={13} />
                      <span>Upload &amp; Compress Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handlePhotoUpload(file, (dataUrl) => {
                              setEditingEvent((prev) => (prev ? { ...prev, image: dataUrl } : null));
                            });
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>
                    <p className="text-[11px] text-[#7d8ea3]">
                      Auto-compressed to WebP format for high-speed page loads.
                    </p>
                  </div>
                  {editingEvent.image && (
                    <div className="h-14 w-20 rounded border border-cyan/40 overflow-hidden shrink-0">
                      <img
                        src={editingEvent.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="evt_featured"
                  checked={editingEvent.featured}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, featured: e.target.checked })
                  }
                  className="rounded text-cyan focus:ring-cyan"
                />
                <label htmlFor="evt_featured" className="text-xs text-paper cursor-pointer">
                  Pin as Flagship Featured Event on Homepage &amp; Events page
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 text-xs border border-line rounded-lg text-[#7d8ea3] hover:text-paper"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSuccess();
                  updateEvent(editingEvent.id, editingEvent);
                  setEditingEvent(null);
                  showNotification(`Event "${editingEvent.title}" saved.`);
                }}
                className="px-5 py-2 text-xs bg-cyan text-[#03060d] font-bold rounded-lg hover:bg-cyan-dim"
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════
          TEAM MEMBER EDIT / ADD MODAL
          ═════════════════════════════════════════════════════ */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-cyan/50 bg-[#070d18] p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(0,229,224,0.2)]">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-display text-xl font-bold text-cyan">
                Edit Member: {editingMember.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="text-[#7d8ea3] hover:text-cyan"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-paper/80 mb-1 font-semibold">Full Name *</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Role Title</label>
                  <input
                    type="text"
                    value={editingMember.role}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                    placeholder="President, Deputy President, etc."
                  />
                </div>
                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Category</label>
                  <input
                    type="text"
                    value={editingMember.category}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                    placeholder="Executive Leadership, Secretariat, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Year</label>
                  <input
                    type="text"
                    value={editingMember.year}
                    onChange={(e) => setEditingMember({ ...editingMember, year: e.target.value })}
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                    placeholder="Final Year, Third Year"
                  />
                </div>
                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Semester</label>
                  <input
                    type="text"
                    value={editingMember.semester}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, semester: e.target.value })
                    }
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                    placeholder="VII A, V B"
                  />
                </div>
              </div>

              <div>
                <label className="block text-paper/80 mb-1 font-semibold">Technical Domain</label>
                <input
                  type="text"
                  value={editingMember.domain}
                  onChange={(e) => setEditingMember({ ...editingMember, domain: e.target.value })}
                  className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                  placeholder="Hardware & Embedded, VLSI, Robotics"
                />
              </div>

              <div>
                <label className="block text-paper/80 mb-1 font-semibold">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={editingMember.linkedin}
                  onChange={(e) => setEditingMember({ ...editingMember, linkedin: e.target.value })}
                  className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none font-mono text-[11px]"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-paper/80 mb-1 font-semibold">Profile Photo</label>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-[#03060d] p-3 hover:border-cyan/40">
                  <div className="space-y-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-cyan px-3.5 py-1.5 text-xs font-bold text-[#03060d] hover:bg-cyan-dim transition-colors">
                      <Upload size={13} />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handlePhotoUpload(file, (dataUrl) => {
                              setEditingMember((prev) => (prev ? { ...prev, image: dataUrl } : null));
                            });
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>
                    <p className="text-[11px] text-[#7d8ea3]">
                      Square aspect ratio recommended.
                    </p>
                  </div>
                  {editingMember.image && (
                    <div className="h-14 w-14 rounded-full border border-cyan overflow-hidden shrink-0">
                      <img
                        src={editingMember.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="px-4 py-2 text-xs border border-line rounded-lg text-[#7d8ea3] hover:text-paper"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSuccess();
                  updateMember(editingMember.id, editingMember);
                  setEditingMember(null);
                  showNotification(`Member "${editingMember.name}" saved.`);
                }}
                className="px-5 py-2 text-xs bg-cyan text-[#03060d] font-bold rounded-lg hover:bg-cyan-dim"
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════
          FACULTY EDIT / ADD MODAL
          ═════════════════════════════════════════════════════ */}
      {editingFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-cyan/50 bg-[#070d18] p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(0,229,224,0.2)]">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-display text-xl font-bold text-cyan">
                Edit Faculty: {editingFaculty.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingFaculty(null)}
                className="text-[#7d8ea3] hover:text-cyan"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-paper/80 mb-1 font-semibold">Faculty Name *</label>
                <input
                  type="text"
                  value={editingFaculty.name}
                  onChange={(e) => setEditingFaculty({ ...editingFaculty, name: e.target.value })}
                  className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Role</label>
                  <input
                    type="text"
                    value={editingFaculty.role}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, role: e.target.value })}
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Designation</label>
                  <input
                    type="text"
                    value={editingFaculty.designation}
                    onChange={(e) =>
                      setEditingFaculty({ ...editingFaculty, designation: e.target.value })
                    }
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-paper/80 mb-1 font-semibold">Office Location</label>
                <input
                  type="text"
                  value={editingFaculty.office}
                  onChange={(e) => setEditingFaculty({ ...editingFaculty, office: e.target.value })}
                  className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-paper/80 mb-1 font-semibold">
                  Qualifications (one per line)
                </label>
                <textarea
                  rows={2}
                  value={(editingFaculty.qualifications || []).join('\n')}
                  onChange={(e) =>
                    setEditingFaculty({
                      ...editingFaculty,
                      qualifications: e.target.value.split('\n').filter((l) => l.trim()),
                    })
                  }
                  className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none resize-none font-mono text-[11px]"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-paper/80 mb-1 font-semibold">Faculty Photo</label>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-[#03060d] p-3 hover:border-cyan/40">
                  <div className="space-y-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-cyan px-3.5 py-1.5 text-xs font-bold text-[#03060d] hover:bg-cyan-dim transition-colors">
                      <Upload size={13} />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handlePhotoUpload(file, (dataUrl) => {
                              setEditingFaculty((prev) => (prev ? { ...prev, image: dataUrl } : null));
                            });
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>
                  </div>
                  {editingFaculty.image && (
                    <div className="h-14 w-14 rounded-2xl border border-cyan overflow-hidden shrink-0">
                      <img
                        src={editingFaculty.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setEditingFaculty(null)}
                className="px-4 py-2 text-xs border border-line rounded-lg text-[#7d8ea3] hover:text-paper"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSuccess();
                  updateFaculty(editingFaculty.id, editingFaculty);
                  setEditingFaculty(null);
                  showNotification(`Faculty "${editingFaculty.name}" saved.`);
                }}
                className="px-5 py-2 text-xs bg-cyan text-[#03060d] font-bold rounded-lg hover:bg-cyan-dim"
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════
          GALLERY EDIT / ADD MODAL
          ═════════════════════════════════════════════════════ */}
      {editingGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-cyan/50 bg-[#070d18] p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(0,229,224,0.2)]">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-display text-xl font-bold text-cyan">
                Edit Gallery Photo: {editingGallery.title}
              </h3>
              <button
                type="button"
                onClick={() => setEditingGallery(null)}
                className="text-[#7d8ea3] hover:text-cyan"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-paper/80 mb-1 font-semibold">Title *</label>
                <input
                  type="text"
                  value={editingGallery.title}
                  onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                  className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Category</label>
                  <input
                    type="text"
                    value={editingGallery.category}
                    onChange={(e) =>
                      setEditingGallery({ ...editingGallery, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                    placeholder="Circuit Craft, Symposium"
                  />
                </div>
                <div>
                  <label className="block text-paper/80 mb-1 font-semibold">Tag</label>
                  <input
                    type="text"
                    value={editingGallery.tag}
                    onChange={(e) => setEditingGallery({ ...editingGallery, tag: e.target.value })}
                    className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none"
                    placeholder="Workshop, Lab Session"
                  />
                </div>
              </div>

              <div>
                <label className="block text-paper/80 mb-1 font-semibold">Caption / Story</label>
                <textarea
                  rows={2}
                  value={editingGallery.caption}
                  onChange={(e) => setEditingGallery({ ...editingGallery, caption: e.target.value })}
                  className="w-full rounded-lg border border-line bg-[#03060d] p-2 text-paper focus:border-cyan focus:outline-none resize-none"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-paper/80 mb-1 font-semibold">Gallery Image</label>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-[#03060d] p-3 hover:border-cyan/40">
                  <div className="space-y-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-cyan px-3.5 py-1.5 text-xs font-bold text-[#03060d] hover:bg-cyan-dim transition-colors">
                      <Upload size={13} />
                      <span>Upload &amp; Optimize Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handlePhotoUpload(file, (dataUrl) => {
                              setEditingGallery((prev) => (prev ? { ...prev, image: dataUrl } : null));
                            });
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>
                  </div>
                  {editingGallery.image && (
                    <div className="h-14 w-20 rounded border border-cyan overflow-hidden shrink-0">
                      <img
                        src={editingGallery.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setEditingGallery(null)}
                className="px-4 py-2 text-xs border border-line rounded-lg text-[#7d8ea3] hover:text-paper"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSuccess();
                  updateGalleryItem(editingGallery.id, editingGallery);
                  setEditingGallery(null);
                  showNotification(`Gallery photo saved.`);
                }}
                className="px-5 py-2 text-xs bg-cyan text-[#03060d] font-bold rounded-lg hover:bg-cyan-dim"
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════
          CONFIRM PERMANENT DELETION MODAL
          ═════════════════════════════════════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-[#ff5f56]/50 bg-[#070d18] p-6 space-y-4 shadow-[0_0_40px_rgba(255,95,86,0.25)]">
            <div className="flex items-center gap-3 text-[#ff5f56]">
              <Trash2 size={24} />
              <h3 className="font-display text-xl font-bold">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-paper leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="font-bold text-[#ff5f56]">"{deleteTarget.name}"</span>? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs border border-line rounded-lg text-[#7d8ea3] hover:text-paper"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playHover();
                  if (deleteTarget.type === 'event') {
                    deleteEvent(deleteTarget.id);
                  } else if (deleteTarget.type === 'team') {
                    deleteMember(deleteTarget.id);
                  } else if (deleteTarget.type === 'faculty') {
                    deleteFaculty(deleteTarget.id);
                  } else if (deleteTarget.type === 'gallery') {
                    deleteGalleryItem(deleteTarget.id);
                  }
                  showNotification(`Deleted "${deleteTarget.name}".`);
                  setDeleteTarget(null);
                }}
                className="px-5 py-2 text-xs bg-[#ff5f56] text-white font-bold rounded-lg hover:bg-[#ff3b30] shadow-[0_0_15px_rgba(255,95,86,0.3)]"
              >
                YES, DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for CMS tab button
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
      active
        ? 'bg-cyan text-[#03060d] font-bold shadow-[0_0_15px_rgba(0,229,224,0.35)]'
        : 'text-[#7d8ea3] hover:text-paper hover:bg-[#0b1526]'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
