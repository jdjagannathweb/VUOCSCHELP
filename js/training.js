/**
 * VUO CSC HELP - Training Section
 * YouTube video tutorials hub for CSC VLEs with interactive player modal and category filters
 */

const VUO_TRAINING = {
  currentCategory: 'all',

  init() {
    this.bindEvents();
    this.renderVideos();
  },

  bindEvents() {
    // Training category filter buttons
    document.querySelectorAll('.training-cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.training-cat-btn').forEach(b => {
          b.className = 'training-cat-btn px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all';
        });
        const target = e.currentTarget;
        target.className = 'training-cat-btn px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 border border-sky-600 text-white shadow-sm transition-all';
        this.currentCategory = target.getAttribute('data-cat');
        this.renderVideos();
      });
    });

    window.addEventListener('languageChanged', () => {
      this.renderVideos();
    });
  },

  getAllVideos() {
    try {
      const stored = localStorage.getItem('vuo_training');
      return stored ? JSON.parse(stored) : VUO_DATA.trainingVideos;
    } catch (e) {
      return VUO_DATA.trainingVideos;
    }
  },

  saveVideos(videos) {
    try {
      localStorage.setItem('vuo_training', JSON.stringify(videos));
      return true;
    } catch (e) {
      console.error("Error saving training videos to storage:", e);
      return false;
    }
  },

  renderVideos() {
    const container = document.getElementById('trainingGridContainer');
    if (!container) return;

    let videos = this.getAllVideos();

    if (this.currentCategory !== 'all') {
      videos = videos.filter(v => v.category === this.currentCategory);
    }

    container.innerHTML = videos.map(video => {
      const title = currentLanguage === 'or' && video.titleOdia ? video.titleOdia : video.title;

      return `
        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <!-- Video Thumbnail Header -->
            <div class="relative bg-slate-900 aspect-video flex items-center justify-center cursor-pointer overflow-hidden" 
              onclick="VUO_TRAINING.openVideoModal('${video.id}')">
              <!-- Backdrop gradient / poster -->
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent"></div>
              
              <!-- Tech Grid Pattern -->
              <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]"></div>

              <!-- Play Button Overlay -->
              <div class="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-rose-500 transition-transform z-10">
                <svg class="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>

              <!-- Duration badge -->
              <span class="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-mono font-semibold z-10">
                ${video.duration}
              </span>

              <!-- Category Badge -->
              <span class="absolute top-2 left-2 px-2 py-0.5 rounded bg-sky-600/90 text-white text-[10px] font-bold z-10">
                ${video.category}
              </span>
            </div>

            <!-- Content Details -->
            <div class="p-4">
              <h3 class="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
                ${title}
              </h3>
              <p class="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                ${video.desc}
              </p>
            </div>
          </div>

          <div class="px-4 pb-4 pt-1 flex items-center justify-between border-t border-slate-100">
            <span class="text-[11px] text-slate-400">👁️ ${video.views} views</span>
            <button onclick="VUO_TRAINING.openVideoModal('${video.id}')" 
              class="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1">
              <span>Watch Video</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  openVideoModal(videoId) {
    const videos = this.getAllVideos();
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    const modal = document.getElementById('videoPlayerModal');
    const modalTitle = document.getElementById('videoModalTitle');
    const modalDesc = document.getElementById('videoModalDesc');
    const playerContainer = document.getElementById('videoPlayerFrameContainer');

    if (!modal || !playerContainer) return;

    modalTitle.textContent = currentLanguage === 'or' && video.titleOdia ? video.titleOdia : video.title;
    modalDesc.textContent = video.desc;

    // Responsive embed or simulated player with YouTube iframe
    playerContainer.innerHTML = `
      <div class="relative w-full aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center">
        <iframe class="w-full h-full" src="https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0" 
          title="${video.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>
        </iframe>
      </div>
    `;

    modal.classList.remove('hidden');
  },

  closeVideoModal() {
    const modal = document.getElementById('videoPlayerModal');
    const playerContainer = document.getElementById('videoPlayerFrameContainer');
    if (modal) modal.classList.add('hidden');
    if (playerContainer) playerContainer.innerHTML = ''; // Stop video playback
  }
};
