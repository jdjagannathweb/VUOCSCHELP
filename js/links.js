/**
 * VUO CSC HELP - Important Links Hub
 * Categorized government, banking and CSC links with real-time search & filter
 */

const VUO_LINKS = {
  currentCategory: 'all',
  searchQuery: '',

  init() {
    this.bindEvents();
    this.renderLinks();
  },

  bindEvents() {
    // Category tabs
    document.querySelectorAll('.link-cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.link-cat-btn').forEach(b => {
          b.className = 'link-cat-btn px-4 py-2 text-xs md:text-sm font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all';
        });
        const target = e.currentTarget;
        target.className = 'link-cat-btn px-4 py-2 text-xs md:text-sm font-semibold rounded-lg bg-sky-600 border border-sky-600 text-white shadow-sm transition-all';
        this.currentCategory = target.getAttribute('data-cat');
        this.renderLinks();
      });
    });

    // Search input
    const searchInput = document.getElementById('linksSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderLinks();
      });
    }

    window.addEventListener('languageChanged', () => {
      this.renderLinks();
    });
  },

  getAllLinks() {
    try {
      const stored = localStorage.getItem('vuo_links');
      return stored ? JSON.parse(stored) : VUO_DATA.links;
    } catch (e) {
      return VUO_DATA.links;
    }
  },

  renderLinks() {
    const container = document.getElementById('linksGridContainer');
    if (!container) return;

    let links = this.getAllLinks();

    // Filter by Category
    if (this.currentCategory !== 'all') {
      links = links.filter(l => l.category === this.currentCategory);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      links = links.filter(l => 
        l.title.toLowerCase().includes(this.searchQuery) ||
        (l.titleOdia && l.titleOdia.toLowerCase().includes(this.searchQuery)) ||
        (l.desc && l.desc.toLowerCase().includes(this.searchQuery)) ||
        l.categoryName.toLowerCase().includes(this.searchQuery)
      );
    }

    if (links.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-500">
          <svg class="w-12 h-12 mx-auto text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p class="font-semibold text-slate-600">No portal links found matching your search.</p>
          <p class="text-xs text-slate-400 mt-1">Try searching for "Subhadra", "e-District", "PAN", "DigiPay" or "Bhulekh".</p>
        </div>
      `;
      return;
    }

    container.innerHTML = links.map(link => {
      const title = currentLanguage === 'or' && link.titleOdia ? link.titleOdia : link.title;
      const categoryBadge = link.category === 'gov' ? 'bg-amber-100 text-amber-800' :
                            link.category === 'csc' ? 'bg-sky-100 text-sky-800' :
                            link.category === 'banking' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800';

      return `
        <div class="feature-card bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md flex flex-col justify-between relative overflow-hidden group">
          ${link.important ? `
            <div class="absolute top-0 right-0">
              <div class="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg shadow-sm flex items-center gap-1">
                <span>★ Important</span>
              </div>
            </div>
          ` : ''}

          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full ${categoryBadge}">
                ${link.categoryName}
              </span>
            </div>

            <h3 class="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors mt-1 font-heading">
              ${title}
            </h3>
            
            ${currentLanguage === 'en' && link.titleOdia ? `
              <p class="text-xs text-slate-500 font-odia mt-0.5">${link.titleOdia}</p>
            ` : ''}

            <p class="text-xs text-slate-600 mt-2 leading-relaxed">
              ${link.desc || 'Direct access to official portal services for CSC VLEs.'}
            </p>
          </div>

          <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-[11px] text-slate-400 font-mono truncate max-w-[160px]">${link.url}</span>
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm">
              <span>Open Portal</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          </div>
        </div>
      `;
    }).join('');
  }
};
