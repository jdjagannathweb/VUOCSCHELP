/**
 * VUO CSC HELP - Firebase Cloud Database Integration
 * Enables real-time synchronization across all devices and public users.
 * Supports: Links, Training Videos, Announcements, Registered Members, and Support Tickets.
 */

const VUO_DB = {
  db: null,
  isInitialized: false,

  // Default Firebase configuration (Can be updated live from Admin Panel)
  defaultConfig: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  },

  init() {
    try {
      const savedConfigStr = localStorage.getItem('vuo_firebase_config');
      const config = savedConfigStr ? JSON.parse(savedConfigStr) : this.defaultConfig;

      if (config && config.projectId && typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
          firebase.initializeApp(config);
        }
        this.db = firebase.firestore();
        this.isInitialized = true;
        console.log("✅ VUO Firebase Firestore Cloud DB connected successfully!");
        this.setupRealtimeListeners();
      } else {
        console.log("ℹ️ VUO running in LocalStorage mode (Firebase config pending).");
      }
    } catch (e) {
      console.warn("Firebase initialization warning (falling back to local storage):", e);
      this.isInitialized = false;
    }
  },

  isConfigured() {
    const savedConfigStr = localStorage.getItem('vuo_firebase_config');
    if (!savedConfigStr) return false;
    try {
      const cfg = JSON.parse(savedConfigStr);
      return !!(cfg && cfg.projectId && cfg.apiKey);
    } catch (e) {
      return false;
    }
  },

  getSavedConfig() {
    try {
      const saved = localStorage.getItem('vuo_firebase_config');
      return saved ? JSON.parse(saved) : this.defaultConfig;
    } catch (e) {
      return this.defaultConfig;
    }
  },

  saveConfig(configObj) {
    try {
      localStorage.setItem('vuo_firebase_config', JSON.stringify(configObj));
      // Re-initialize
      if (typeof firebase !== 'undefined' && configObj.projectId) {
        if (!firebase.apps.length) {
          firebase.initializeApp(configObj);
        }
        this.db = firebase.firestore();
        this.isInitialized = true;
        this.setupRealtimeListeners();
      }
      return { success: true, message: "Firebase configuration saved successfully!" };
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  // ---------------- REALTIME LISTENERS ---------------- //
  setupRealtimeListeners() {
    if (!this.isInitialized || !this.db) return;

    // 1. Links Realtime Sync
    this.db.collection('vuo_links').onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        const links = [];
        snapshot.forEach(doc => links.push(doc.data()));
        links.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        localStorage.setItem('vuo_links', JSON.stringify(links));
        if (typeof VUO_LINKS !== 'undefined' && VUO_LINKS.renderLinks) {
          VUO_LINKS.renderLinks();
        }
        if (typeof VUO_ADMIN !== 'undefined' && VUO_ADMIN.renderLinksTable) {
          VUO_ADMIN.renderLinksTable();
        }
      }
    }, (err) => console.warn("Links listener error:", err));

    // 2. Training Videos Realtime Sync
    this.db.collection('vuo_training').onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        const videos = [];
        snapshot.forEach(doc => videos.push(doc.data()));
        videos.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        localStorage.setItem('vuo_training', JSON.stringify(videos));
        if (typeof VUO_TRAINING !== 'undefined' && VUO_TRAINING.renderVideos) {
          VUO_TRAINING.renderVideos();
        }
        if (typeof VUO_ADMIN !== 'undefined' && VUO_ADMIN.renderVideosTable) {
          VUO_ADMIN.renderVideosTable();
        }
      }
    }, (err) => console.warn("Training listener error:", err));

    // 3. Announcements Realtime Sync
    this.db.collection('vuo_announcements').onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        const anns = [];
        snapshot.forEach(doc => anns.push(doc.data()));
        anns.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        localStorage.setItem('vuo_announcements', JSON.stringify(anns));
        if (typeof renderAnnouncementsTicker === 'function') {
          renderAnnouncementsTicker();
        }
        if (typeof VUO_ADMIN !== 'undefined' && VUO_ADMIN.renderAnnouncementsTable) {
          VUO_ADMIN.renderAnnouncementsTable();
        }
      }
    }, (err) => console.warn("Announcements listener error:", err));
  },

  // ---------------- CLOUD CRUD HELPERS ---------------- //
  // Links
  async cloudSaveLink(linkObj) {
    if (this.isInitialized && this.db) {
      try {
        linkObj.createdAt = linkObj.createdAt || Date.now();
        await this.db.collection('vuo_links').doc(linkObj.id).set(linkObj);
        console.log("☁️ Link saved to Firebase Cloud!");
      } catch (e) {
        console.warn("Could not save link to cloud:", e);
      }
    }
  },

  async cloudDeleteLink(linkId) {
    if (this.isInitialized && this.db) {
      try {
        await this.db.collection('vuo_links').doc(linkId).delete();
        console.log("☁️ Link deleted from Firebase Cloud!");
      } catch (e) {
        console.warn("Could not delete link from cloud:", e);
      }
    }
  },

  // Training Videos
  async cloudSaveVideo(videoObj) {
    if (this.isInitialized && this.db) {
      try {
        videoObj.createdAt = videoObj.createdAt || Date.now();
        await this.db.collection('vuo_training').doc(videoObj.id).set(videoObj);
        console.log("☁️ Training video saved to Firebase Cloud!");
      } catch (e) {
        console.warn("Could not save video to cloud:", e);
      }
    }
  },

  async cloudDeleteVideo(videoId) {
    if (this.isInitialized && this.db) {
      try {
        await this.db.collection('vuo_training').doc(videoId).delete();
        console.log("☁️ Training video deleted from Firebase Cloud!");
      } catch (e) {
        console.warn("Could not delete video from cloud:", e);
      }
    }
  },

  // Announcements
  async cloudSaveAnnouncement(annObj) {
    if (this.isInitialized && this.db) {
      try {
        annObj.createdAt = annObj.createdAt || Date.now();
        await this.db.collection('vuo_announcements').doc(annObj.id).set(annObj);
        console.log("☁️ Announcement saved to Firebase Cloud!");
      } catch (e) {
        console.warn("Could not save announcement to cloud:", e);
      }
    }
  },

  async cloudDeleteAnnouncement(annId) {
    if (this.isInitialized && this.db) {
      try {
        await this.db.collection('vuo_announcements').doc(annId).delete();
        console.log("☁️ Announcement deleted from Firebase Cloud!");
      } catch (e) {
        console.warn("Could not delete announcement from cloud:", e);
      }
    }
  },

  // Member Registration
  async cloudSaveMember(memberObj) {
    if (this.isInitialized && this.db) {
      try {
        memberObj.createdAt = memberObj.createdAt || Date.now();
        await this.db.collection('vuo_members').doc(memberObj.memberNo).set(memberObj);
        console.log("☁️ Member saved to Firebase Cloud!");
      } catch (e) {
        console.warn("Could not save member to cloud:", e);
      }
    }
  },

  async cloudDeleteMember(memberNo) {
    if (this.isInitialized && this.db) {
      try {
        await this.db.collection('vuo_members').doc(memberNo).delete();
        console.log("☁️ Member deleted from Firebase Cloud!");
      } catch (e) {
        console.warn("Could not delete member from cloud:", e);
      }
    }
  },

  // Support Tickets
  async cloudSaveTicket(ticketObj) {
    if (this.isInitialized && this.db) {
      try {
        ticketObj.createdAt = ticketObj.createdAt || Date.now();
        await this.db.collection('vuo_tickets').doc(ticketObj.ticketId).set(ticketObj);
        console.log("☁️ Support ticket saved to Firebase Cloud!");
      } catch (e) {
        console.warn("Could not save ticket to cloud:", e);
      }
    }
  },

  // Initial Cloud Seed (Uploads local defaults to Cloud if empty)
  async seedCloudDefaults() {
    if (!this.isInitialized || !this.db) return;
    try {
      // Check Links
      const linksSnap = await this.db.collection('vuo_links').limit(1).get();
      if (linksSnap.empty && VUO_DATA.links) {
        for (const l of VUO_DATA.links) {
          await this.cloudSaveLink(l);
        }
      }

      // Check Videos
      const vidsSnap = await this.db.collection('vuo_training').limit(1).get();
      if (vidsSnap.empty && VUO_DATA.trainingVideos) {
        for (const v of VUO_DATA.trainingVideos) {
          await this.cloudSaveVideo(v);
        }
      }

      // Check Announcements
      const annSnap = await this.db.collection('vuo_announcements').limit(1).get();
      if (annSnap.empty && VUO_DATA.announcements) {
        for (const a of VUO_DATA.announcements) {
          await this.cloudSaveAnnouncement(a);
        }
      }

      console.log("☁️ Cloud database seeded with initial VUO default data.");
    } catch (e) {
      console.warn("Cloud seed notice:", e);
    }
  }
};
