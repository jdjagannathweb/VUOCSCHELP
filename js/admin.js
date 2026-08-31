/**
 * VUO CSC HELP - Administrator Panel
 * Member management, link updates, training video curation, announcements and support inbox
 */

const VUO_ADMIN = {
  activeTab: 'members',

  init() {
    this.bindEvents();
    this.renderAll();
  },

  bindEvents() {
    // Admin Tabs
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-admin-tab');
        this.switchTab(tab);
      });
    });

    // Member search
    const memSearch = document.getElementById('adminMemberSearch');
    if (memSearch) {
      memSearch.addEventListener('input', () => this.renderMembers());
    }

    // Add Link Form
    const addLinkForm = document.getElementById('adminAddLinkForm');
    if (addLinkForm) {
      addLinkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddLink();
      });
    }

    // Add Video Form
    const addVideoForm = document.getElementById('adminAddVideoForm');
    if (addVideoForm) {
      addVideoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddVideo();
      });
    }

    // Add Announcement Form
    const addAnnForm = document.getElementById('adminAddAnnForm');
    if (addAnnForm) {
      addAnnForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddAnnouncement();
      });
    }

    // Change Password Form
    const changePassForm = document.getElementById('adminChangePasswordForm');
    if (changePassForm) {
      changePassForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleChangePassword();
      });
    }
  },

  switchTab(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      if (btn.getAttribute('data-admin-tab') === tabName) {
        btn.className = 'admin-nav-btn flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-sky-600 text-white shadow-sm';
      } else {
        btn.className = 'admin-nav-btn flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100';
      }
    });

    document.querySelectorAll('.admin-tab-pane').forEach(pane => {
      if (pane.id === `admin_pane_${tabName}`) {
        pane.classList.remove('hidden');
      } else {
        pane.classList.add('hidden');
      }
    });

    this.renderAll();
  },

  renderAll() {
    this.renderMembers();
    this.renderLinksTable();
    this.renderVideosTable();
    this.renderAnnouncementsTable();
    this.renderSupportTickets();
    this.renderSecurityInfo();
  },

  // ---------------- 1. MEMBERS ---------------- //
  renderMembers() {
    const tbody = document.getElementById('adminMembersTbody');
    if (!tbody) return;

    let members = VUO_AUTH.getAllMembers();
    const query = document.getElementById('adminMemberSearch')?.value.toLowerCase().trim() || '';

    if (query) {
      members = members.filter(m => 
        m.fullName.toLowerCase().includes(query) ||
        m.memberNo.toLowerCase().includes(query) ||
        m.cscId.includes(query) ||
        m.district.toLowerCase().includes(query) ||
        m.mobile.includes(query)
      );
    }

    document.getElementById('adminTotalMembersCount').textContent = members.length;

    tbody.innerHTML = members.map((m, idx) => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 text-xs">
        <td class="p-3 font-mono font-bold text-sky-700">${m.memberNo}</td>
        <td class="p-3 font-semibold text-slate-800">${m.fullName}</td>
        <td class="p-3 font-mono text-slate-600">${m.cscId}</td>
        <td class="p-3 text-slate-600">${m.district} / ${m.block}</td>
        <td class="p-3 text-slate-600">${m.mobile}</td>
        <td class="p-3">
          <span class="px-2 py-0.5 rounded-full font-bold text-[10px] ${m.status.includes('Active') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
            ${m.status}
          </span>
        </td>
        <td class="p-3 text-right">
          <button onclick="VUO_ADMIN.toggleMemberStatus('${m.memberNo}')" class="text-sky-600 hover:text-sky-800 font-bold mr-2 text-[11px]">
            ${m.status.includes('Active') ? 'Deactivate' : 'Verify & Activate'}
          </button>
          <button onclick="VUO_ADMIN.deleteMember('${m.memberNo}')" class="text-rose-500 hover:text-rose-700 font-bold text-[11px]">
            Delete
          </button>
        </td>
      </tr>
    `).join('');
  },

  toggleMemberStatus(memberNo) {
    const members = VUO_AUTH.getAllMembers();
    const mem = members.find(m => m.memberNo === memberNo);
    if (mem) {
      mem.status = mem.status.includes('Active') ? 'Inactive (Pending Review)' : 'Active (Verified VLE)';
      VUO_AUTH.saveMembers(members);
      this.renderMembers();
      showToast(`Updated status for ${mem.fullName}`, "success");
    }
  },

  deleteMember(memberNo) {
    if (!confirm(`Are you sure you want to delete member ${memberNo}?`)) return;
    let members = VUO_AUTH.getAllMembers();
    members = members.filter(m => m.memberNo !== memberNo);
    VUO_AUTH.saveMembers(members);
    this.renderMembers();
    showToast("Member deleted.", "info");
  },

  exportMembersCsv() {
    const members = VUO_AUTH.getAllMembers();
    let csv = "Member Number,Full Name,CSC ID,District,Block,Gram Panchayat,Mobile,Email,Status,Joining Date\n";
    members.forEach(m => {
      csv += `"${m.memberNo}","${m.fullName}","${m.cscId}","${m.district}","${m.block}","${m.gp}","${m.mobile}","${m.email}","${m.status}","${m.joiningDate}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `VUO_Members_List_${Date.now()}.csv`;
    link.click();
    showToast("Exported members list to CSV.", "success");
  },

  // ---------------- 2. IMPORTANT LINKS ---------------- //
  renderLinksTable() {
    const tbody = document.getElementById('adminLinksTbody');
    if (!tbody) return;
    const links = VUO_LINKS.getAllLinks();

    tbody.innerHTML = links.map(l => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 text-xs">
        <td class="p-3 font-semibold text-slate-800">
          ${l.title}
          ${l.important ? '<span class="ml-1 text-amber-500 font-bold">★</span>' : ''}
        </td>
        <td class="p-3 text-slate-500 font-odia">${l.titleOdia || '-'}</td>
        <td class="p-3 font-mono text-[11px] text-sky-600 truncate max-w-[150px]"><a href="${l.url}" target="_blank">${l.url}</a></td>
        <td class="p-3"><span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold text-[10px]">${l.categoryName}</span></td>
        <td class="p-3 text-right">
          <button onclick="VUO_ADMIN.deleteLink('${l.id}')" class="text-rose-500 hover:text-rose-700 font-bold text-[11px]">
            Delete
          </button>
        </td>
      </tr>
    `).join('');
  },

  // Helper: Extract Clean YouTube Video ID from any format
  extractYouTubeId(input) {
    if (!input) return '';
    const trimmed = input.trim();
    // Raw 11-char alphanumeric ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    // URLs (watch?v=, youtu.be/, embed/, shorts/, live/, etc.)
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/;
    const match = trimmed.match(regExp);
    if (match && match[1]) {
      return match[1];
    }
    // Fallback split if standard match fails
    if (trimmed.includes('youtu.be/')) {
      return trimmed.split('youtu.be/')[1].split('?')[0].split('&')[0];
    } else if (trimmed.includes('v=')) {
      return trimmed.split('v=')[1].split('&')[0].split('?')[0];
    }
    return trimmed;
  },

  handleAddLink() {
    const title = document.getElementById('adminLinkTitle').value.trim();
    const titleOdia = document.getElementById('adminLinkTitleOdia').value.trim();
    let url = document.getElementById('adminLinkUrl').value.trim();
    const category = document.getElementById('adminLinkCategory').value;
    const desc = document.getElementById('adminLinkDesc').value.trim();
    const important = document.getElementById('adminLinkImportant').checked;

    if (!title || !url) {
      showToast("Please fill in Portal Title and URL.", "warning");
      return;
    }

    // Auto-normalize web URL if user missed https://
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('#') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
      url = 'https://' + url;
    }

    const catMap = {
      csc: "CSC Services",
      gov: "Government Services",
      banking: "Banking & Insurance",
      vuo: "VUO CSC HELP"
    };

    const links = VUO_LINKS.getAllLinks();
    const newLink = {
      id: `link-${Date.now()}`,
      title,
      titleOdia,
      url,
      category,
      categoryName: catMap[category] || "General",
      desc: desc || "Official portal service for CSC VLEs.",
      important: !!important
    };

    links.unshift(newLink);
    VUO_LINKS.saveLinks(links);
    document.getElementById('adminAddLinkForm').reset();
    this.renderLinksTable();
    VUO_LINKS.renderLinks();
    showToast("New portal link saved and published live!", "success");
  },

  deleteLink(linkId) {
    if (!confirm("Are you sure you want to remove this portal link?")) return;
    let links = VUO_LINKS.getAllLinks();
    links = links.filter(l => l.id !== linkId);
    VUO_LINKS.saveLinks(links);
    this.renderLinksTable();
    VUO_LINKS.renderLinks();
    showToast("Portal link deleted.", "info");
  },

  // ---------------- 3. TRAINING VIDEOS ---------------- //
  renderVideosTable() {
    const tbody = document.getElementById('adminVideosTbody');
    if (!tbody) return;
    const videos = VUO_TRAINING.getAllVideos();

    if (videos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-slate-400 text-xs">No training tutorials added yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = videos.map(v => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 text-xs">
        <td class="p-3 font-semibold text-slate-800">${v.title}</td>
        <td class="p-3"><span class="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-semibold text-[10px]">${v.category}</span></td>
        <td class="p-3 font-mono text-[11px] text-sky-700">
          <a href="https://www.youtube.com/watch?v=${v.youtubeId}" target="_blank" class="hover:underline flex items-center gap-1">
            <i class="fa-brands fa-youtube text-rose-600"></i> ${v.youtubeId}
          </a>
        </td>
        <td class="p-3 text-right">
          <button onclick="VUO_ADMIN.deleteVideo('${v.id}')" class="text-rose-500 hover:text-rose-700 font-bold text-[11px]">
            Delete
          </button>
        </td>
      </tr>
    `).join('');
  },

  handleAddVideo() {
    const title = document.getElementById('adminVideoTitle').value.trim();
    const titleOdia = document.getElementById('adminVideoTitleOdia').value.trim();
    const youtubeInput = document.getElementById('adminVideoUrl').value.trim();
    const category = document.getElementById('adminVideoCategory').value;
    const desc = document.getElementById('adminVideoDesc').value.trim();

    if (!title || !youtubeInput) {
      showToast("Please fill in Video Title and YouTube Link or ID.", "warning");
      return;
    }

    const ytId = this.extractYouTubeId(youtubeInput);
    if (!ytId) {
      showToast("Could not extract a valid YouTube video ID.", "error");
      return;
    }

    const videos = VUO_TRAINING.getAllVideos();
    const newVideo = {
      id: `tr-${Date.now()}`,
      title,
      titleOdia,
      category,
      youtubeId: ytId,
      desc: desc || "CSC VLE practical step-by-step training tutorial.",
      duration: "10:00 min",
      views: "1.0K"
    };

    videos.unshift(newVideo);
    VUO_TRAINING.saveVideos(videos);
    document.getElementById('adminAddVideoForm').reset();
    this.renderVideosTable();
    VUO_TRAINING.renderVideos();
    showToast("Training video tutorial added and published live!", "success");
  },

  deleteVideo(vidId) {
    if (!confirm("Are you sure you want to remove this training video?")) return;
    let videos = VUO_TRAINING.getAllVideos();
    videos = videos.filter(v => v.id !== vidId);
    VUO_TRAINING.saveVideos(videos);
    this.renderVideosTable();
    VUO_TRAINING.renderVideos();
    showToast("Training video deleted.", "info");
  },

  // ---------------- 4. ANNOUNCEMENTS ---------------- //
  renderAnnouncementsTable() {
    const tbody = document.getElementById('adminAnnTbody');
    if (!tbody) return;
    const anns = JSON.parse(localStorage.getItem('vuo_announcements') || '[]');

    tbody.innerHTML = anns.map(a => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 text-xs">
        <td class="p-3 text-slate-800">${a.text}</td>
        <td class="p-3 text-slate-600 font-odia">${a.textOdia || '-'}</td>
        <td class="p-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${a.urgent ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'}">
            ${a.urgent ? 'Urgent' : 'Normal'}
          </span>
        </td>
        <td class="p-3 text-right">
          <button onclick="VUO_ADMIN.deleteAnnouncement('${a.id}')" class="text-rose-500 hover:text-rose-700 font-bold text-[11px]">
            Delete
          </button>
        </td>
      </tr>
    `).join('');
  },

  handleAddAnnouncement() {
    const text = document.getElementById('adminAnnText').value.trim();
    const textOdia = document.getElementById('adminAnnTextOdia').value.trim();
    const urgent = document.getElementById('adminAnnUrgent').checked;

    if (!text) {
      showToast("Please enter announcement text.", "warning");
      return;
    }

    const anns = JSON.parse(localStorage.getItem('vuo_announcements') || '[]');
    const newAnn = {
      id: `ann-${Date.now()}`,
      text,
      textOdia,
      date: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      urgent
    };

    anns.unshift(newAnn);
    localStorage.setItem('vuo_announcements', JSON.stringify(anns));
    document.getElementById('adminAddAnnForm').reset();
    this.renderAnnouncementsTable();
    renderAnnouncementsTicker();
    showToast("Announcement published live!", "success");
  },

  deleteAnnouncement(annId) {
    let anns = JSON.parse(localStorage.getItem('vuo_announcements') || '[]');
    anns = anns.filter(a => a.id !== annId);
    localStorage.setItem('vuo_announcements', JSON.stringify(anns));
    this.renderAnnouncementsTable();
    renderAnnouncementsTicker();
    showToast("Announcement removed.", "info");
  },

  // ---------------- 5. SUPPORT TICKETS INBOX ---------------- //
  renderSupportTickets() {
    const tbody = document.getElementById('adminTicketsTbody');
    if (!tbody) return;
    const tickets = JSON.parse(localStorage.getItem('vuo_tickets') || '[]');

    if (tickets.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400 text-xs">No support inquiries received yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = tickets.map((t, idx) => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 text-xs">
        <td class="p-3 font-mono font-bold text-sky-700">${t.ticketId}</td>
        <td class="p-3 font-semibold text-slate-800">${t.name} <span class="text-slate-400 font-normal">(${t.mobile})</span></td>
        <td class="p-3 font-semibold text-slate-700">${t.subject}</td>
        <td class="p-3 text-slate-600 max-w-[200px] truncate">${t.message}</td>
        <td class="p-3">
          <span class="px-2 py-0.5 rounded font-bold text-[10px] ${t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
            ${t.status || 'Pending'}
          </span>
        </td>
        <td class="p-3 text-right">
          <button onclick="VUO_ADMIN.toggleTicketStatus(${idx})" class="text-sky-600 hover:text-sky-800 font-bold text-[11px]">
            ${t.status === 'Resolved' ? 'Reopen' : 'Mark Resolved'}
          </button>
        </td>
      </tr>
    `).join('');
  },

  toggleTicketStatus(idx) {
    const tickets = JSON.parse(localStorage.getItem('vuo_tickets') || '[]');
    if (tickets[idx]) {
      tickets[idx].status = tickets[idx].status === 'Resolved' ? 'Pending' : 'Resolved';
      localStorage.setItem('vuo_tickets', JSON.stringify(tickets));
      this.renderSupportTickets();
      showToast("Updated ticket status.", "info");
    }
  },

  // ---------------- 6. SECURITY & PASSWORD ---------------- //
  renderSecurityInfo() {
    const updatedEl = document.getElementById('adminPassLastUpdated');
    if (updatedEl) {
      const lastUpdated = localStorage.getItem('vuo_admin_password_updated') || 'Default setup';
      updatedEl.textContent = lastUpdated;
    }
  },

  handleChangePassword() {
    const currPass = document.getElementById('adminCurrentPassword').value;
    const newPass = document.getElementById('adminNewPassword').value;
    const confirmPass = document.getElementById('adminConfirmPassword').value;

    if (!currPass || !newPass || !confirmPass) {
      showToast("Please fill in all password fields.", "warning");
      return;
    }

    if (newPass !== confirmPass) {
      showToast("New passwords do not match! Please check.", "error");
      return;
    }

    if (newPass.length < 4) {
      showToast("New password must be at least 4 characters.", "warning");
      return;
    }

    const res = VUO_AUTH.updateAdminPassword(currPass, newPass);
    if (res.success) {
      document.getElementById('adminChangePasswordForm').reset();
      this.renderSecurityInfo();
      showToast(res.message, "success");
    } else {
      showToast(res.message, "error");
    }
  }
};
