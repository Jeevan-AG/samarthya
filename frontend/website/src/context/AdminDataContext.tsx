import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import defaultEvents from '../data/events.json';
import defaultTeam from '../data/team.json';
import defaultFaculty from '../data/faculty.json';
import defaultGallery from '../data/gallery.json';
import type {
  SamarthyaEvent,
  SamarthyaTeamMember,
  SamarthyaFaculty,
  SamarthyaGalleryItem,
  SamarthyaApplication,
  RegisteredAdmin,
  SamarthyaSiteConfig,
  CMSTab,
} from '../types/admin';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEFAULT_SITE_CONFIG: SamarthyaSiteConfig = {
  name: 'SAMARTHYA',
  fullName: 'SAMARTHYA — ECE Department Technical Society',
  department: 'Electronics & Communication Engineering',
  institution: 'St Joseph Engineering College, Vamanjoor, Mangaluru',
  tagline: 'Signal. Circuit. Field. Hardware First, Theory with Solder on it.',
  aboutText:
    'Official technical club of the Electronics & Communication Engineering department. Dedicated to bridging theoretical classroom fundamentals with hands-on PCB fabrication, embedded systems design, and next-generation hardware architecture.',
  contactEmail: 'samarthya@sjec.ac.in',
  officeLocation: 'ECE Block, SJEC Campus, Vamanjoor, Mangaluru - 575028',
  motto: 'HARDWARE FIRST. THEORY WITH SOLDER ON IT.',
  recruitmentOpen: true,
};

interface AdminDataContextType {
  events: SamarthyaEvent[];
  team: SamarthyaTeamMember[];
  faculty: SamarthyaFaculty[];
  gallery: SamarthyaGalleryItem[];
  applications: SamarthyaApplication[];
  adminUsers: RegisteredAdmin[];
  siteConfig: SamarthyaSiteConfig;
  isCloudConnected: boolean;
  activeTab: CMSTab;
  setActiveTab: (tab: CMSTab) => void;
  statusNotification: string | null;
  showNotification: (msg: string) => void;

  // Events
  addEvent: (event: SamarthyaEvent) => void;
  updateEvent: (id: string, updated: Partial<SamarthyaEvent>) => void;
  deleteEvent: (id: string) => void;
  reorderEvents: (startIndex: number, endIndex: number) => void;

  // Team
  addMember: (member: SamarthyaTeamMember) => void;
  updateMember: (id: string, updated: Partial<SamarthyaTeamMember>) => void;
  deleteMember: (id: string) => void;
  reorderTeam: (startIndex: number, endIndex: number) => void;

  // Faculty
  addFaculty: (faculty: SamarthyaFaculty) => void;
  updateFaculty: (id: string, updated: Partial<SamarthyaFaculty>) => void;
  deleteFaculty: (id: string) => void;
  reorderFaculty: (startIndex: number, endIndex: number) => void;

  // Gallery
  addGalleryItem: (item: SamarthyaGalleryItem) => void;
  updateGalleryItem: (id: string, updated: Partial<SamarthyaGalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  reorderGallery: (startIndex: number, endIndex: number) => void;

  // Applications
  deleteApplication: (id: string) => Promise<void>;
  refreshApplications: () => Promise<void>;

  // Admin Approvals
  approveAdmin: (username: string) => Promise<{ success: boolean; error?: string }>;
  rejectAdmin: (username: string) => Promise<{ success: boolean; error?: string }>;
  deleteAdmin: (username: string) => Promise<{ success: boolean; error?: string }>;
  refreshAdminUsers: () => Promise<void>;

  // Site Config
  updateSiteConfig: (updated: Partial<SamarthyaSiteConfig>) => void;

  // Export / Import / Reset
  exportJSON: (type: 'events' | 'team' | 'faculty' | 'gallery' | 'all') => void;
  importJSON: (file: File, type: 'events' | 'team' | 'faculty' | 'gallery') => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<SamarthyaEvent[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('samarthya_admin_events');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return defaultEvents as unknown as SamarthyaEvent[];
  });

  const [team, setTeam] = useState<SamarthyaTeamMember[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('samarthya_admin_team');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return defaultTeam as unknown as SamarthyaTeamMember[];
  });

  const [faculty, setFaculty] = useState<SamarthyaFaculty[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('samarthya_admin_faculty');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return defaultFaculty as unknown as SamarthyaFaculty[];
  });

  const [gallery, setGallery] = useState<SamarthyaGalleryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('samarthya_admin_gallery');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return defaultGallery as unknown as SamarthyaGalleryItem[];
  });

  const [applications, setApplications] = useState<SamarthyaApplication[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('samarthya_admin_applications');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [];
  });

  const [adminUsers, setAdminUsers] = useState<RegisteredAdmin[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('samarthya_admin_users_list');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        username: 'admin',
        status: 'approved',
        role: 'head_admin',
        registeredAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      },
      {
        username: 'Jeevan',
        status: 'approved',
        role: 'head_admin',
        registeredAt: new Date(Date.now() - 86400000 * 14).toISOString(),
      },
    ];
  });

  const [siteConfig, setSiteConfig] = useState<SamarthyaSiteConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('samarthya_admin_site_config');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_SITE_CONFIG;
  });

  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(isSupabaseConfigured);
  const [activeTab, setActiveTab] = useState<CMSTab>('events');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const showNotification = useCallback((msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3500);
  }, []);

  // Save to localStorage & sync with Supabase club_content
  const persist = useCallback(
    async (key: string, data: unknown) => {
      // 1. LocalStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`samarthya_admin_${key}`, JSON.stringify(data));
        } catch (e) {
          console.warn(`[Local Storage Error] Failed to persist ${key}:`, e);
        }
      }

      // 2. Supabase Cloud Database (table: club_content)
      if (isSupabaseConfigured) {
        try {
          const supabaseKey =
            key === 'admin_users_list'
              ? 'admin_users_list'
              : key.startsWith('samarthya_')
              ? key
              : `samarthya_${key}`;

          const { error } = await supabase.from('club_content').upsert(
            {
              key: supabaseKey,
              value: data,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'key' }
          );

          // Mirror to common keys so Supabase club_content always reflects live Samarthya data
          let mirrorKey: string | null = null;
          if (key === 'events' || key === 'samarthya_events') mirrorKey = 'events';
          if (key === 'team' || key === 'samarthya_team') mirrorKey = 'leadership';
          if (key === 'faculty' || key === 'samarthya_faculty') mirrorKey = 'faculty';
          if (key === 'gallery' || key === 'samarthya_gallery') mirrorKey = 'archive';
          if (key === 'site_config' || key === 'samarthya_site_config') mirrorKey = 'siteConfig';

          if (mirrorKey) {
            await supabase.from('club_content').upsert(
              {
                key: mirrorKey,
                value: data,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'key' }
            );
          }

          if (!error) {
            setIsCloudConnected(true);
          } else {
            console.warn(`Supabase upsert warning for ${supabaseKey}:`, error.message);
          }
        } catch (err) {
          console.warn(`[Supabase Cloud Sync Notice for ${key}]:`, err);
          setIsCloudConnected(false);
        }
      }
    },
    []
  );

  // Sync to/from Supabase on mount
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function loadCloudData() {
      try {
        // Fetch all content from club_content
        const { data, error } = await supabase.from('club_content').select('*');
        if (!error && Array.isArray(data)) {
          setIsCloudConnected(true);
          data.forEach((row) => {
            if (row.key === 'admin_users_list' && Array.isArray(row.value)) {
              setAdminUsers(row.value);
              try {
                localStorage.setItem('samarthya_admin_users_list', JSON.stringify(row.value));
              } catch {
                // ignore
              }
            }
            if ((row.key === 'samarthya_events' || row.key === 'events') && Array.isArray(row.value) && row.value.length > 0) {
              const isSamarthya = row.value.some((e: any) => e.title?.includes('Circuit Craft') || e.venue?.includes('ECE'));
              if (isSamarthya || row.key === 'samarthya_events') {
                setEvents(row.value);
              }
            }
            if ((row.key === 'samarthya_team' || row.key === 'leadership') && Array.isArray(row.value) && row.value.length > 0) {
              const isSamarthya = row.value.some((t: any) => t.name?.includes('Winston') || t.name?.includes('Jeevan') || t.name?.includes('Iris'));
              if (isSamarthya || row.key === 'samarthya_team') {
                setTeam(row.value);
              }
            }
            if ((row.key === 'samarthya_faculty' || row.key === 'faculty') && Array.isArray(row.value) && row.value.length > 0) {
              setFaculty(row.value);
            }
            if ((row.key === 'samarthya_gallery' || row.key === 'archive') && Array.isArray(row.value) && row.value.length > 0) {
              const isSamarthya = row.value.some((g: any) => g.title?.includes('Prototyping') || g.title?.includes('Circuit Craft'));
              if (isSamarthya || row.key === 'samarthya_gallery') {
                setGallery(row.value);
              }
            }
            if ((row.key === 'samarthya_site_config' || row.key === 'siteConfig') && row.value) {
              if (row.value.name === 'SAMARTHYA' || row.key === 'samarthya_site_config') {
                setSiteConfig(row.value);
              }
            }
          });
        }

        // Fetch applications from Supabase applications table
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select('*')
          .order('created_at', { ascending: false });

        if (!appsError && Array.isArray(appsData)) {
          setApplications(appsData);
          try {
            localStorage.setItem('samarthya_admin_applications', JSON.stringify(appsData));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.warn('Supabase cloud sync error:', err);
      }
    }

    loadCloudData();
  }, []);

  // ---------------- EVENTS ----------------
  const addEvent = useCallback(
    (item: SamarthyaEvent) => {
      setEvents((prev) => {
        const next = [item, ...prev];
        persist('events', next);
        return next;
      });
    },
    [persist]
  );

  const updateEvent = useCallback(
    (id: string, updated: Partial<SamarthyaEvent>) => {
      setEvents((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
        persist('events', next);
        return next;
      });
    },
    [persist]
  );

  const deleteEvent = useCallback(
    (id: string) => {
      setEvents((prev) => {
        const next = prev.filter((item) => item.id !== id);
        persist('events', next);
        return next;
      });
    },
    [persist]
  );

  const reorderEvents = useCallback(
    (startIdx: number, endIdx: number) => {
      setEvents((prev) => {
        if (endIdx < 0 || endIdx >= prev.length) return prev;
        const copy = [...prev];
        const [moved] = copy.splice(startIdx, 1);
        copy.splice(endIdx, 0, moved);
        persist('events', copy);
        return copy;
      });
    },
    [persist]
  );

  // ---------------- TEAM ----------------
  const addMember = useCallback(
    (item: SamarthyaTeamMember) => {
      setTeam((prev) => {
        const next = [item, ...prev];
        persist('team', next);
        return next;
      });
    },
    [persist]
  );

  const updateMember = useCallback(
    (id: string, updated: Partial<SamarthyaTeamMember>) => {
      setTeam((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
        persist('team', next);
        return next;
      });
    },
    [persist]
  );

  const deleteMember = useCallback(
    (id: string) => {
      setTeam((prev) => {
        const next = prev.filter((item) => item.id !== id);
        persist('team', next);
        return next;
      });
    },
    [persist]
  );

  const reorderTeam = useCallback(
    (startIdx: number, endIdx: number) => {
      setTeam((prev) => {
        if (endIdx < 0 || endIdx >= prev.length) return prev;
        const copy = [...prev];
        const [moved] = copy.splice(startIdx, 1);
        copy.splice(endIdx, 0, moved);
        persist('team', copy);
        return copy;
      });
    },
    [persist]
  );

  // ---------------- FACULTY ----------------
  const addFaculty = useCallback(
    (item: SamarthyaFaculty) => {
      setFaculty((prev) => {
        const next = [...prev, item];
        persist('faculty', next);
        return next;
      });
    },
    [persist]
  );

  const updateFaculty = useCallback(
    (id: string, updated: Partial<SamarthyaFaculty>) => {
      setFaculty((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
        persist('faculty', next);
        return next;
      });
    },
    [persist]
  );

  const deleteFaculty = useCallback(
    (id: string) => {
      setFaculty((prev) => {
        const next = prev.filter((item) => item.id !== id);
        persist('faculty', next);
        return next;
      });
    },
    [persist]
  );

  const reorderFaculty = useCallback(
    (startIdx: number, endIdx: number) => {
      setFaculty((prev) => {
        if (endIdx < 0 || endIdx >= prev.length) return prev;
        const copy = [...prev];
        const [moved] = copy.splice(startIdx, 1);
        copy.splice(endIdx, 0, moved);
        persist('faculty', copy);
        return copy;
      });
    },
    [persist]
  );

  // ---------------- GALLERY ----------------
  const addGalleryItem = useCallback(
    (item: SamarthyaGalleryItem) => {
      setGallery((prev) => {
        const next = [item, ...prev];
        persist('gallery', next);
        return next;
      });
    },
    [persist]
  );

  const updateGalleryItem = useCallback(
    (id: string, updated: Partial<SamarthyaGalleryItem>) => {
      setGallery((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
        persist('gallery', next);
        return next;
      });
    },
    [persist]
  );

  const deleteGalleryItem = useCallback(
    (id: string) => {
      setGallery((prev) => {
        const next = prev.filter((item) => item.id !== id);
        persist('gallery', next);
        return next;
      });
    },
    [persist]
  );

  const reorderGallery = useCallback(
    (startIdx: number, endIdx: number) => {
      setGallery((prev) => {
        if (endIdx < 0 || endIdx >= prev.length) return prev;
        const copy = [...prev];
        const [moved] = copy.splice(startIdx, 1);
        copy.splice(endIdx, 0, moved);
        persist('gallery', copy);
        return copy;
      });
    },
    [persist]
  );

  // ---------------- APPLICATIONS ----------------
  const deleteApplication = useCallback(
    async (id: string) => {
      setApplications((prev) => {
        const next = prev.filter((item) => item.id !== id);
        try {
          localStorage.setItem('samarthya_admin_applications', JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      if (isSupabaseConfigured) {
        try {
          await supabase.from('applications').delete().eq('id', id);
        } catch (err) {
          console.warn('Error deleting application from Supabase:', err);
        }
      }
    },
    []
  );

  const refreshApplications = useCallback(async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          setApplications(data);
          try {
            localStorage.setItem('samarthya_admin_applications', JSON.stringify(data));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.warn('Applications fetch warning:', err);
      }
    }
  }, []);

  // ---------------- ADMIN APPROVALS ----------------
  const refreshAdminUsers = useCallback(async () => {
    if (isSupabaseConfigured) {
      try {
        const { data } = await supabase
          .from('club_content')
          .select('value')
          .eq('key', 'admin_users_list')
          .maybeSingle();
        if (Array.isArray(data?.value)) {
          setAdminUsers(data.value);
          try {
            localStorage.setItem('samarthya_admin_users_list', JSON.stringify(data.value));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.warn('Admin users fetch warning:', err);
      }
    }
  }, []);

  const approveAdmin = useCallback(
    async (username: string) => {
      try {
        let updatedList: RegisteredAdmin[] = [];
        setAdminUsers((prev) => {
          updatedList = prev.map((u) =>
            u.username.toLowerCase() === username.toLowerCase()
              ? { ...u, status: 'approved', approvedAt: new Date().toISOString() }
              : u
          );
          return updatedList;
        });

        // Persist to Supabase and localStorage
        await persist('admin_users_list', updatedList);
        return { success: true };
      } catch (err) {
        return { success: false, error: String(err) };
      }
    },
    [persist]
  );

  const rejectAdmin = useCallback(
    async (username: string) => {
      try {
        let updatedList: RegisteredAdmin[] = [];
        setAdminUsers((prev) => {
          updatedList = prev.map((u) =>
            u.username.toLowerCase() === username.toLowerCase()
              ? { ...u, status: 'rejected' }
              : u
          );
          return updatedList;
        });

        await persist('admin_users_list', updatedList);
        return { success: true };
      } catch (err) {
        return { success: false, error: String(err) };
      }
    },
    [persist]
  );

  const deleteAdmin = useCallback(
    async (username: string) => {
      try {
        let updatedList: RegisteredAdmin[] = [];
        setAdminUsers((prev) => {
          updatedList = prev.filter((u) => u.username.toLowerCase() !== username.toLowerCase());
          return updatedList;
        });

        await persist('admin_users_list', updatedList);
        return { success: true };
      } catch (err) {
        return { success: false, error: String(err) };
      }
    },
    [persist]
  );

  // ---------------- SITE CONFIG ----------------
  const updateSiteConfig = useCallback(
    (updated: Partial<SamarthyaSiteConfig>) => {
      setSiteConfig((prev) => {
        const next = { ...prev, ...updated };
        persist('site_config', next);
        return next;
      });
    },
    [persist]
  );

  // ---------------- JSON EXPORT ----------------
  const exportJSON = useCallback(
    (type: 'events' | 'team' | 'faculty' | 'gallery' | 'all') => {
      let payload: unknown;
      let filename: string;

      if (type === 'events') {
        payload = events;
        filename = 'events.json';
      } else if (type === 'team') {
        payload = team;
        filename = 'team.json';
      } else if (type === 'faculty') {
        payload = faculty;
        filename = 'faculty.json';
      } else if (type === 'gallery') {
        payload = gallery;
        filename = 'gallery.json';
      } else {
        payload = {
          events,
          team,
          faculty,
          gallery,
          siteConfig,
          exportedAt: new Date().toISOString(),
          version: '1.0.0-samarthya',
        };
        filename = 'samarthya_complete_backup.json';
      }

      const dataStr =
        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showNotification(`Exported and downloaded ${filename}`);
    },
    [events, team, faculty, gallery, siteConfig, showNotification]
  );

  // ---------------- JSON IMPORT ----------------
  const importJSON = useCallback(
    async (file: File, type: 'events' | 'team' | 'faculty' | 'gallery') => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const parsed = JSON.parse(text);

          if (!Array.isArray(parsed)) {
            alert('Invalid JSON file: Root object must be an array of items.');
            return;
          }

          if (type === 'events') {
            setEvents(parsed);
            persist('events', parsed);
          } else if (type === 'team') {
            setTeam(parsed);
            persist('team', parsed);
          } else if (type === 'faculty') {
            setFaculty(parsed);
            persist('faculty', parsed);
          } else if (type === 'gallery') {
            setGallery(parsed);
            persist('gallery', parsed);
          }

          showNotification(`Successfully imported ${parsed.length} ${type} records.`);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error importing JSON.';
          alert('Import failed: ' + msg);
        }
      };
      reader.readAsText(file);
    },
    [persist, showNotification]
  );

  // ---------------- RESET TO DEFAULTS ----------------
  const resetToDefaults = useCallback(async () => {
    if (
      !confirm(
        'Are you sure you want to reset all data to repository defaults? This will erase local modifications.'
      )
    ) {
      return;
    }

    setEvents(defaultEvents as unknown as SamarthyaEvent[]);
    setTeam(defaultTeam as unknown as SamarthyaTeamMember[]);
    setFaculty(defaultFaculty as unknown as SamarthyaFaculty[]);
    setGallery(defaultGallery as unknown as SamarthyaGalleryItem[]);
    setSiteConfig(DEFAULT_SITE_CONFIG);

    if (typeof window !== 'undefined') {
      [
        'samarthya_admin_events',
        'samarthya_admin_team',
        'samarthya_admin_faculty',
        'samarthya_admin_gallery',
        'samarthya_admin_applications',
        'samarthya_admin_site_config',
      ].forEach((key) => localStorage.removeItem(key));
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('club_content').upsert([
          { key: 'samarthya_events', value: defaultEvents, updated_at: new Date().toISOString() },
          { key: 'events', value: defaultEvents, updated_at: new Date().toISOString() },
          { key: 'samarthya_team', value: defaultTeam, updated_at: new Date().toISOString() },
          { key: 'leadership', value: defaultTeam, updated_at: new Date().toISOString() },
          { key: 'samarthya_faculty', value: defaultFaculty, updated_at: new Date().toISOString() },
          { key: 'faculty', value: defaultFaculty, updated_at: new Date().toISOString() },
          { key: 'samarthya_gallery', value: defaultGallery, updated_at: new Date().toISOString() },
          { key: 'archive', value: defaultGallery, updated_at: new Date().toISOString() },
          { key: 'samarthya_site_config', value: DEFAULT_SITE_CONFIG, updated_at: new Date().toISOString() },
          { key: 'siteConfig', value: DEFAULT_SITE_CONFIG, updated_at: new Date().toISOString() },
        ]);
      } catch (err) {
        console.warn('Supabase reset warning:', err);
      }
    }

    showNotification('Restored all data to repository defaults.');
  }, [showNotification]);

  return (
    <AdminDataContext.Provider
      value={{
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
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
