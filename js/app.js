/**
 * VUO CSC HELP - Core Application Router, Global Search & View Controller
 */

// Toast Notifications Helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-600' :
                  type === 'error' ? 'bg-rose-600' :
                  type === 'warning' ? 'bg-amber-600' : 'bg-slate-800';

  toast.className = `flex items-center gap-2 px-4 py-3 text-white text-xs font-semibold rounded-xl shadow-xl transition-all transform translate-y-2 opacity-0 ${bgClass}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" class="ml-2 opacity-70 hover:opacity-100">&times;</button>
  `;

  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  // Auto remove after 3.5s
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Global Announcements Ticker Renderer
function renderAnnouncementsTicker() {
  const track = document.getElementById('newsTickerTrack');
  if (!track) return;

  const anns = JSON.parse(localStorage.getItem('vuo_announcements') || '[]');
  if (anns.length === 0) {
    track.innerHTML = '<span class="px-6 text-xs text-sky-200">📢 Welcome to VUO CSC HELP — Your Digital Partner for CSC Services in Odisha.</span>';
    return;
  }

  const itemsHtml = anns.map(a => {
    const text = currentLanguage === 'or' && a.textOdia ? a.textOdia : a.text;
    return `
      <span class="inline-flex items-center gap-2 px-6 text-xs font-medium text-slate-100">
        ${a.urgent ? '<span class="bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded text-[10px]">NEW</span>' : '•'}
        <span>${text}</span>
      </span>
    `;
  }).join('');

  // Duplicate for seamless loop
  track.innerHTML = itemsHtml + itemsHtml;
}

// Global Search System
const VUO_SEARCH = {
  init() {
    // Keyboard shortcut Ctrl+K / Cmd+K
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      } else if (e.key === 'Escape') {
        this.close();
      }
    });

    const searchInput = document.getElementById('globalSearchModalInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    }
  },

  open() {
    const modal = document.getElementById('globalSearchModal');
    const input = document.getElementById('globalSearchModalInput');
    if (modal) {
      modal.classList.remove('hidden');
      if (input) {
        input.value = '';
        input.focus();
        this.handleSearch('');
      }
    }
  },

  close() {
    const modal = document.getElementById('globalSearchModal');
    if (modal) modal.classList.add('hidden');
  },

  handleSearch(query) {
    const q = query.toLowerCase().trim();
    const resultsContainer = document.getElementById('globalSearchResults');
    if (!resultsContainer) return;

    const tools = [
      { name: "Pass Photo Maker", nameOdia: "ପାସ ଫଟୋ ମେକର", hash: "#passphoto", type: "Tool", icon: "📷", desc: "Create A4 passport sheets & adjust photo backgrounds" },
      { name: "Image Compressor", nameOdia: "ଫଟୋ କମ୍ପ୍ରେସ୍", hash: "#imagetools", type: "Tool", icon: "🖼️", desc: "Compress image file size for portal limits" },
      { name: "Signature Resizer", nameOdia: "ସାଇନ (Signature) ରିସାଇଜ୍", hash: "#imagetools", type: "Tool", icon: "✍️", desc: "PAN and government portal signature optimizer" },
      { name: "CSC Bill Maker", nameOdia: "CSC ବିଲ୍ ମେକର", hash: "#billmaker", type: "Tool", icon: "🧾", desc: "Generate professional customer receipts with shop details" },
      { name: "PDF Tools Suite", nameOdia: "PDF ଟୁଲ୍ସ ସୁଇଟ୍", hash: "#pdftools", type: "Tool", icon: "📄", desc: "JPG to PDF, merge, split, and watermark documents" },
      { name: "Resume Maker", nameOdia: "ରେଜ୍ୟୁମେ / ବାୟୋଡାଟା ମେକର", hash: "#resumemaker", type: "Tool", icon: "📋", desc: "Modern job resume and bio-data builder" },
      { name: "I-Card Maker", nameOdia: "VLE ଆଇ-କାର୍ଡ ମେକର", hash: "#icardmaker", type: "Tool", icon: "🪪", desc: "VLE UNION ODISHA official identity card generator" }
    ];

    const links = VUO_LINKS.getAllLinks().map(l => ({
      name: l.title,
      nameOdia: l.titleOdia,
      url: l.url,
      type: "Portal Link",
      icon: "🔗",
      desc: l.desc
    }));

    const videos = VUO_TRAINING.getAllVideos().map(v => ({
      name: v.title,
      nameOdia: v.titleOdia,
      hash: "#training",
      type: "Training Video",
      icon: "🎓",
      desc: v.desc
    }));

    const allItems = [...tools, ...links, ...videos];

    const filtered = q ? allItems.filter(item => 
      item.name.toLowerCase().includes(q) || 
      (item.nameOdia && item.nameOdia.toLowerCase().includes(q)) ||
      (item.desc && item.desc.toLowerCase().includes(q)) ||
      item.type.toLowerCase().includes(q)
    ) : allItems.slice(0, 8); // show top items by default

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div class="py-8 text-center text-slate-400 text-xs">
          No matches found for "${query}". Try searching for "Subhadra", "Photo", "Bill", "PDF", or "DigiPay".
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = filtered.map(item => {
      const displayName = currentLanguage === 'or' && item.nameOdia ? item.nameOdia : item.name;
      const isExternal = !!item.url;
      const targetAction = isExternal ? 
        `href="${item.url}" target="_blank"` : 
        `href="${item.hash}" onclick="VUO_SEARCH.close()"`;

      return `
        <a ${targetAction} class="flex items-center justify-between p-3 rounded-lg hover:bg-sky-50 border border-transparent hover:border-sky-200 transition-all group">
          <div class="flex items-center gap-3">
            <span class="text-xl">${item.icon}</span>
            <div>
              <div class="flex items-center gap-2">
                <p class="text-xs font-bold text-slate-800 group-hover:text-sky-700">${displayName}</p>
                <span class="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-semibold">${item.type}</span>
              </div>
              <p class="text-[11px] text-slate-500 truncate max-w-sm">${item.desc || ''}</p>
            </div>
          </div>
          <span class="text-slate-400 group-hover:text-sky-600 text-xs">➔</span>
        </a>
      `;
    }).join('');
  }
};

// Main Single Page Application Router
const VUO_APP = {
  init() {
    this.bindGlobalEvents();
    this.handleRoute();
    window.addEventListener('hashchange', () => this.handleRoute());

    // Initialize Submodules & Firebase Cloud DB
    if (typeof VUO_DB !== 'undefined') {
      VUO_DB.init();
    }
    VUO_SEARCH.init();
    renderAnnouncementsTicker();
    VUO_AUTH.updateAuthUI();

    // Listen for language changes
    window.addEventListener('languageChanged', () => {
      renderAnnouncementsTicker();
    });
  },

  bindGlobalEvents() {
    // Mobile Drawer Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const closeMobileDrawer = document.getElementById('closeMobileDrawer');

    if (mobileMenuBtn && mobileDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileDrawer.classList.remove('hidden');
      });
    }

    if (closeMobileDrawer && mobileDrawer) {
      closeMobileDrawer.addEventListener('click', () => {
        mobileDrawer.classList.add('hidden');
      });
    }

    // Close mobile drawer on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileDrawer) mobileDrawer.classList.add('hidden');
      });
    });

    // Language Toggle Buttons
    const langEnBtn = document.getElementById('langToggleEn');
    const langOrBtn = document.getElementById('langToggleOr');

    if (langEnBtn) langEnBtn.addEventListener('click', () => setLanguage('en'));
    if (langOrBtn) langOrBtn.addEventListener('click', () => setLanguage('or'));

    // Member Login Form
    const loginForm = document.getElementById('memberLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('loginIdentifier').value;
        const pass = document.getElementById('loginPassword').value;
        const res = VUO_AUTH.login(id, pass);
        if (res.success) {
          showToast(`Welcome, ${res.member.fullName}!`, "success");
          window.location.hash = "#dashboard";
        } else {
          showToast(res.message, "error");
        }
      });
    }

    // Member Registration Form
    const regForm = document.getElementById('memberRegForm');
    if (regForm) {
      // District change populates block
      const distSelect = document.getElementById('regDistrict');
      if (distSelect) {
        distSelect.addEventListener('change', () => populateBlockDropdown('regDistrict', 'regBlock'));
      }

      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pass = document.getElementById('regPassword').value;
        const confirmPass = document.getElementById('regConfirmPassword').value;
        const terms = document.getElementById('regTerms').checked;

        if (!terms) {
          showToast("Please agree to the VUO CSC HELP terms.", "warning");
          return;
        }

        if (pass !== confirmPass) {
          showToast("Passwords do not match.", "error");
          return;
        }

        const formData = {
          fullName: document.getElementById('regFullName').value,
          cscId: document.getElementById('regCscId').value,
          memberNo: document.getElementById('regMemberNo').value,
          mobile: document.getElementById('regMobile').value,
          email: document.getElementById('regEmail').value,
          district: document.getElementById('regDistrict').value,
          block: document.getElementById('regBlock').value,
          gp: document.getElementById('regGp').value,
          password: pass
        };

        const res = VUO_AUTH.register(formData);
        if (res.success) {
          showToast("Registration successful! Welcome to VUO CSC HELP.", "success");
          window.location.hash = "#dashboard";
        } else {
          showToast(res.message, "error");
        }
      });
    }

    // Admin Login Form
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
      adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const passInput = document.getElementById('adminPasswordInput') || document.getElementById('adminPinInput');
        const pass = passInput ? passInput.value : '';
        const res = VUO_AUTH.adminLogin(pass);
        if (res.success) {
          const modal = document.getElementById('adminLoginModal');
          if (modal) modal.classList.add('hidden');
          if (passInput) passInput.value = '';
          showToast("Admin access unlocked successfully!", "success");
          
          const adminView = document.getElementById('view_admin');
          if (adminView) adminView.classList.remove('hidden');
          VUO_ADMIN.init();
        } else {
          showToast(res.message || "Invalid Admin Password. Access Denied!", "error");
          if (passInput) {
            passInput.value = '';
            passInput.focus();
          }
        }
      });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('vuoContactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const ticketId = `VUO-TKT-${Math.floor(1000 + Math.random() * 9000)}`;
        const name = document.getElementById('contactName').value;
        const mobile = document.getElementById('contactMobile').value;
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value;

        const newTicket = {
          ticketId,
          name,
          mobile,
          subject,
          message,
          date: new Date().toLocaleDateString(),
          status: 'Pending'
        };

        const tickets = JSON.parse(localStorage.getItem('vuo_tickets') || '[]');
        tickets.unshift(newTicket);
        localStorage.setItem('vuo_tickets', JSON.stringify(tickets));
        if (typeof VUO_DB !== 'undefined') {
          VUO_DB.cloudSaveTicket(newTicket);
        }

        contactForm.reset();
        showToast(`Your support ticket #${ticketId} has been registered! Our VUO CSC HELP team will reach out at 9937037131 soon.`, "success");
      });
    }
  },

  handleRoute() {
    const hash = window.location.hash || '#home';
    const viewName = hash.replace('#', '') || 'home';

    // Hide all view containers
    document.querySelectorAll('.view-container').forEach(el => {
      el.classList.add('hidden');
    });

    // Update active nav link classes
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href') === hash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Show target view (With strict admin guard)
    if (viewName === 'admin' && !VUO_AUTH.isAdmin()) {
      const homeView = document.getElementById('view_home');
      if (homeView) homeView.classList.remove('hidden');
      const adminModal = document.getElementById('adminLoginModal');
      if (adminModal) {
        adminModal.classList.remove('hidden');
        const passInput = document.getElementById('adminPasswordInput') || document.getElementById('adminPinInput');
        if (passInput) passInput.focus();
      }
    } else {
      const targetView = document.getElementById(`view_${viewName}`);
      if (targetView) {
        targetView.classList.remove('hidden');
      } else {
        const homeView = document.getElementById('view_home');
        if (homeView) homeView.classList.remove('hidden');
      }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Initialize specific view modules on route entry
    if (viewName === 'passphoto') {
      VUO_PASSPHOTO.init();
    } else if (viewName === 'imagetools') {
      VUO_IMAGETOOLS.init();
    } else if (viewName === 'billmaker') {
      VUO_BILLMAKER.init();
    } else if (viewName === 'pdftools') {
      VUO_PDFTOOLS.init();
    } else if (viewName === 'resumemaker') {
      VUO_RESUMEMAKER.init();
    } else if (viewName === 'icardmaker') {
      VUO_ICARDMAKER.init();
    } else if (viewName === 'links') {
      VUO_LINKS.init();
    } else if (viewName === 'training') {
      VUO_TRAINING.init();
    } else if (viewName === 'signup') {
      populateDistrictDropdown('regDistrict');
      populateBlockDropdown('regDistrict', 'regBlock');
    } else if (viewName === 'dashboard') {
      this.loadMemberDashboard();
    } else if (viewName === 'admin') {
      if (VUO_AUTH.isAdmin()) {
        VUO_ADMIN.init();
      }
    }

    applyTranslations();
  },

  loadMemberDashboard() {
    const user = VUO_AUTH.getCurrentUser();
    if (!user) {
      showToast("Please login to access your Member Dashboard.", "warning");
      window.location.hash = "#login";
      return;
    }

    // Populate dashboard view
    if (document.getElementById('dashMemberName')) document.getElementById('dashMemberName').textContent = user.fullName;
    if (document.getElementById('dashMemberNo')) document.getElementById('dashMemberNo').textContent = user.memberNo;
    if (document.getElementById('dashCscId')) document.getElementById('dashCscId').textContent = user.cscId;
    if (document.getElementById('dashDistrict')) document.getElementById('dashDistrict').textContent = user.district;
    if (document.getElementById('dashBlock')) document.getElementById('dashBlock').textContent = user.block;
    if (document.getElementById('dashGp')) document.getElementById('dashGp').textContent = user.gp;
    if (document.getElementById('dashJoiningDate')) document.getElementById('dashJoiningDate').textContent = user.joiningDate;
    if (document.getElementById('dashDesignation')) document.getElementById('dashDesignation').textContent = user.designation || "VLE Member";
    
    const statusEl = document.getElementById('dashStatusBadge');
    if (statusEl) {
      statusEl.textContent = user.status;
    }
  }
};

// Initialize App on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  VUO_APP.init();
});
