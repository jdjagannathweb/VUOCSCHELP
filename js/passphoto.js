/**
 * VUO CSC HELP - Pass Photo Maker Tool
 * High precision passport photo creator, background adjuster, and multi-copy A4 sheet generator
 */

const VUO_PASSPHOTO = {
  cropper: null,
  uploadedImage: null,
  currentPreset: 'size_12x15', // 'size_12x15', 'passport', 'stamp', 'pan', 'aadhaar', 'custom'
  bgColor: 'original', // 'original' (no change), '#ffffff', '#bae6fd', '#1e40af', '#e2e8f0', '#dc2626', or custom hex
  bgTolerance: 45,
  copies: 6,
  addBorder: true,
  brightness: 100,
  contrast: 100,
  sharpness: 25, // 0 to 100%
  clarity: 15, // 0 to 100%
  autoEnhance: false,
  viewMode: 'fit', // 'fit' (entire A4 visible) or 'zoom' (100% actual pixels)

  // Dimension presets in millimeters & inches
  presets: {
    size_12x15: { name: '1.2 x 1.5 Inch (6 Photos Per Line)', w: 30.48, h: 38.1, ratio: 1.2 / 1.5, cols: 6 },
    passport: { name: 'Indian Passport (3.5 x 4.5 cm)', w: 35, h: 45, ratio: 35 / 45, cols: 4 },
    stamp: { name: 'Stamp Size (2.0 x 2.5 cm)', w: 20, h: 25, ratio: 20 / 25, cols: 4 },
    pan: { name: 'PAN Card (2.5 x 3.5 cm)', w: 25, h: 35, ratio: 25 / 35, cols: 4 },
    aadhaar: { name: 'Aadhaar / Exam (3.5 x 3.5 cm)', w: 35, h: 35, ratio: 1, cols: 4 },
    custom: { name: 'Custom Dimension', w: 35, h: 45, ratio: 35 / 45, cols: 4 }
  },

  init() {
    this.bindEvents();
    this.renderDefaultPreview();
  },

  bindEvents() {
    const fileInput = document.getElementById('passPhotoFileInput');
    const dropZone = document.getElementById('passPhotoDropZone');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.loadFile(e.target.files[0]);
        }
      });
    }

    if (dropZone) {
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-sky-500', 'bg-sky-50');
      });
      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('border-sky-500', 'bg-sky-50');
      });
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-sky-500', 'bg-sky-50');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.loadFile(e.dataTransfer.files[0]);
        }
      });
    }

    // Size preset change
    const presetSelect = document.getElementById('passPhotoPreset');
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        this.currentPreset = e.target.value;
        const customControls = document.getElementById('passPhotoCustomControls');
        if (customControls) {
          if (this.currentPreset === 'custom') {
            customControls.classList.remove('hidden');
          } else {
            customControls.classList.add('hidden');
          }
        }
        if (this.cropper) {
          const ratio = this.presets[this.currentPreset].ratio;
          this.cropper.setAspectRatio(ratio);
        }
        // Auto-select recommended copies for 1.2x1.5 inch
        if (this.currentPreset === 'size_12x15' && this.copies === 8) {
          this.copies = 6;
          const copiesSelect = document.getElementById('passPhotoCopies');
          if (copiesSelect) copiesSelect.value = "6";
        }
        this.generateSheet();
      });
    }

    // Copies change
    const copiesSelect = document.getElementById('passPhotoCopies');
    if (copiesSelect) {
      copiesSelect.addEventListener('change', (e) => {
        this.copies = parseInt(e.target.value, 10);
        this.generateSheet();
      });
    }

    // Border toggle
    const borderCheck = document.getElementById('passPhotoBorder');
    if (borderCheck) {
      borderCheck.addEventListener('change', (e) => {
        this.addBorder = e.target.checked;
        this.generateSheet();
      });
    }

    // Background color / Original presets
    document.querySelectorAll('.passphoto-bg-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.passphoto-bg-btn').forEach(b => {
          b.classList.remove('ring-2', 'ring-sky-500', 'scale-105', 'scale-110', 'bg-sky-50');
        });
        const target = e.currentTarget;
        target.classList.add('ring-2', 'ring-sky-500', 'scale-105');
        this.bgColor = target.getAttribute('data-color');
        
        const labelEl = document.getElementById('passPhotoBgLabel');
        if (labelEl) {
          if (this.bgColor === 'original') labelEl.textContent = 'Original (No Change)';
          else if (this.bgColor === '#ffffff') labelEl.textContent = 'Studio White';
          else if (this.bgColor === '#bae6fd') labelEl.textContent = 'Sky Blue';
          else if (this.bgColor === '#1e40af') labelEl.textContent = 'Studio Navy';
          else if (this.bgColor === '#e2e8f0') labelEl.textContent = 'Light Gray';
          else if (this.bgColor === '#dc2626') labelEl.textContent = 'Studio Red';
          else labelEl.textContent = 'Custom Color';
        }

        const customColorInput = document.getElementById('passPhotoCustomBg');
        if (customColorInput && this.bgColor !== 'original') {
          customColorInput.value = this.bgColor;
        }

        const tolContainer = document.getElementById('passPhotoTolContainer');
        if (tolContainer) {
          if (this.bgColor === 'original') {
            tolContainer.classList.add('hidden');
          } else {
            tolContainer.classList.remove('hidden');
          }
        }

        this.generateSheet();
      });
    });

    const customColorInput = document.getElementById('passPhotoCustomBg');
    if (customColorInput) {
      customColorInput.addEventListener('input', (e) => {
        this.bgColor = e.target.value;
        const labelEl = document.getElementById('passPhotoBgLabel');
        if (labelEl) labelEl.textContent = 'Custom Color';
        const tolContainer = document.getElementById('passPhotoTolContainer');
        if (tolContainer) tolContainer.classList.remove('hidden');
        this.generateSheet();
      });
    }

    // Background Tolerance Slider
    const tolSlider = document.getElementById('passPhotoBgTolerance');
    if (tolSlider) {
      tolSlider.addEventListener('input', (e) => {
        this.bgTolerance = parseInt(e.target.value, 10) || 48;
        const valEl = document.getElementById('passPhotoBgToleranceVal');
        if (valEl) valEl.textContent = `${this.bgTolerance}`;
        this.generateSheet();
      });
    }

    // Brightness and Contrast sliders
    const brightSlider = document.getElementById('passPhotoBrightness');
    const contrastSlider = document.getElementById('passPhotoContrast');

    if (brightSlider) {
      brightSlider.addEventListener('input', (e) => {
        this.brightness = e.target.value;
        document.getElementById('passPhotoBrightnessVal').textContent = `${this.brightness}%`;
        this.generateSheet();
      });
    }

    if (contrastSlider) {
      contrastSlider.addEventListener('input', (e) => {
        this.contrast = e.target.value;
        document.getElementById('passPhotoContrastVal').textContent = `${this.contrast}%`;
        this.generateSheet();
      });
    }

    // Sharpness Slider
    const sharpSlider = document.getElementById('passPhotoSharpness');
    if (sharpSlider) {
      sharpSlider.addEventListener('input', (e) => {
        this.sharpness = parseInt(e.target.value, 10) || 0;
        const sVal = document.getElementById('passPhotoSharpnessVal');
        if (sVal) sVal.textContent = `${this.sharpness}%`;
        this.generateSheet();
      });
    }

    // Auto Enhance Toggle
    const enhanceBtn = document.getElementById('passPhotoAutoEnhance');
    if (enhanceBtn) {
      enhanceBtn.addEventListener('click', () => {
        this.autoEnhance = !this.autoEnhance;
        if (this.autoEnhance) {
          enhanceBtn.classList.add('bg-amber-500', 'text-white', 'shadow-sm');
          enhanceBtn.classList.remove('bg-slate-100', 'text-slate-700');
          showToast("Photo Auto-Enhancement Enabled ✨", "success");
        } else {
          enhanceBtn.classList.remove('bg-amber-500', 'text-white', 'shadow-sm');
          enhanceBtn.classList.add('bg-slate-100', 'text-slate-700');
          showToast("Photo Auto-Enhancement Disabled", "info");
        }
        this.generateSheet();
      });
    }
  },

  loadFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast("Please upload an image file (JPG, PNG).", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.uploadedImage = img;
        this.initCropper(e.target.result);
        document.getElementById('passPhotoEditor').classList.remove('hidden');
        document.getElementById('passPhotoEmptyNotice').classList.add('hidden');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  initCropper(imageSrc) {
    const cropImgEl = document.getElementById('passPhotoCropImage');
    if (!cropImgEl) return;

    if (this.cropper) {
      this.cropper.destroy();
    }

    cropImgEl.src = imageSrc;

    const currentRatio = this.presets[this.currentPreset].ratio;

    this.cropper = new Cropper(cropImgEl, {
      aspectRatio: currentRatio,
      viewMode: 1,
      autoCropArea: 0.85,
      responsive: true,
      crop: () => {
        // Debounced sheet generation
        if (this._cropTimeout) clearTimeout(this._cropTimeout);
        this._cropTimeout = setTimeout(() => {
          this.generateSheet();
        }, 150);
      }
    });
  },

  rotate(degrees) {
    if (this.cropper) {
      this.cropper.rotate(degrees);
    }
  },

  resetCrop() {
    if (this.cropper) {
      this.cropper.reset();
      this.brightness = 100;
      this.contrast = 100;
      document.getElementById('passPhotoBrightness').value = 100;
      document.getElementById('passPhotoContrast').value = 100;
      document.getElementById('passPhotoBrightnessVal').textContent = '100%';
      document.getElementById('passPhotoContrastVal').textContent = '100%';
      this.generateSheet();
    }
  },

  loadSamplePhoto() {
    // Generate an illustrative sample avatar onto a canvas for instant demo
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');

    // Studio background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 500);
    grad.addColorStop(0, '#bae6fd');
    grad.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 500);

    // Shoulders / Coat
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(200, 470, 160, 100, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shirt collar
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(170, 370);
    ctx.lineTo(200, 420);
    ctx.lineTo(230, 370);
    ctx.closePath();
    ctx.fill();

    // Tie
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(195, 410);
    ctx.lineTo(205, 410);
    ctx.lineTo(208, 480);
    ctx.lineTo(200, 495);
    ctx.lineTo(192, 480);
    ctx.closePath();
    ctx.fill();

    // Neck
    ctx.fillStyle = '#f6d8b8';
    ctx.fillRect(180, 340, 40, 50);

    // Head
    ctx.beginPath();
    ctx.ellipse(200, 240, 75, 95, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fcd34d';
    ctx.fillStyle = '#fbd38d';
    ctx.fill();

    // Hair
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(200, 200, 80, Math.PI, 0, false);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(175, 235, 5, 0, Math.PI * 2);
    ctx.arc(225, 235, 5, 0, Math.PI * 2);
    ctx.fill();

    // Gentle smile
    ctx.beginPath();
    ctx.arc(200, 275, 20, 0.15 * Math.PI, 0.85 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#9a3412';
    ctx.stroke();

    const dataUrl = canvas.toDataURL('image/jpeg');
    const img = new Image();
    img.onload = () => {
      this.uploadedImage = img;
      this.initCropper(dataUrl);
      document.getElementById('passPhotoEditor').classList.remove('hidden');
      document.getElementById('passPhotoEmptyNotice').classList.add('hidden');
    };
    img.src = dataUrl;
  },

  renderDefaultPreview() {
    const sheetCanvas = document.getElementById('passPhotoSheetCanvas');
    if (!sheetCanvas) return;
    const ctx = sheetCanvas.getContext('2d');
    sheetCanvas.width = 794; // A4 at 96 DPI: 794 x 1123 px
    sheetCanvas.height = 1123;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 18px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Upload or choose a sample photo to generate print-ready A4 sheet', sheetCanvas.width / 2, sheetCanvas.height / 2);
  },

  hexToRgb(hex) {
    if (!hex) return null;
    let c = hex.trim().replace(/^#/, '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    if (c.length === 6) {
      const num = parseInt(c, 16);
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    }
    return null;
  },

  replaceBackground(sourceCanvas, targetColorHex, tolerance = 42) {
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;

    const workCanvas = document.createElement('canvas');
    workCanvas.width = width;
    workCanvas.height = height;
    const ctx = workCanvas.getContext('2d');
    ctx.drawImage(sourceCanvas, 0, 0);

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const targetRgb = this.hexToRgb(targetColorHex) || { r: 255, g: 255, b: 255 };

    // Sample background colors strictly from top corners (away from hair & shoulders)
    const bgSamples = [];
    const cornerSize = Math.max(4, Math.floor(width * 0.08));

    // Top-Left corner samples
    for (let y = 1; y < cornerSize; y++) {
      for (let x = 1; x < cornerSize; x++) {
        const idx = (y * width + x) * 4;
        bgSamples.push([data[idx], data[idx + 1], data[idx + 2]]);
      }
    }

    // Top-Right corner samples
    for (let y = 1; y < cornerSize; y++) {
      for (let x = width - cornerSize; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        bgSamples.push([data[idx], data[idx + 1], data[idx + 2]]);
      }
    }

    if (bgSamples.length === 0) bgSamples.push([255, 255, 255]);

    // Color distance helper using weighted perceptual Euclidean formula
    function getMinColorDist(r, g, b) {
      let minDist = 999999;
      for (let s = 0; s < bgSamples.length; s++) {
        const sr = bgSamples[s][0], sg = bgSamples[s][1], sb = bgSamples[s][2];
        // Perceptual color distance
        const rmean = (r + sr) / 2;
        const dr = r - sr;
        const dg = g - sg;
        const db = b - sb;
        const dist = Math.sqrt((((512 + rmean) * dr * dr) >> 8) + 4 * dg * dg + (((767 - rmean) * db * db) >> 8));
        if (dist < minDist) minDist = dist;
      }
      return minDist;
    }

    // Mask (0 = unvisited, 1 = background, 2 = person/foreground)
    const mask = new Uint8Array(width * height);
    const queue = [];

    // Seed ONLY from top boundary (y = 0)
    for (let x = 0; x < width; x++) {
      const idx = x * 4;
      if (getMinColorDist(data[idx], data[idx + 1], data[idx + 2]) < tolerance * 1.5) {
        mask[x] = 1;
        queue.push(x, 0);
      }
    }

    // Seed top sides only down to 25% height (strictly above shoulders)
    const upperSideLimit = Math.floor(height * 0.25);
    for (let y = 1; y < upperSideLimit; y++) {
      const leftIdx = y * width * 4;
      if (getMinColorDist(data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]) < tolerance * 1.5) {
        mask[y * width] = 1;
        queue.push(0, y);
      }
      const rightIdx = (y * width + (width - 1)) * 4;
      if (getMinColorDist(data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]) < tolerance * 1.5) {
        mask[y * width + (width - 1)] = 1;
        queue.push(width - 1, y);
      }
    }

    let head = 0;
    while (head < queue.length) {
      const qx = queue[head++];
      const qy = queue[head++];

      const neighbors = [
        [qx + 1, qy], [qx - 1, qy], [qx, qy + 1], [qx, qy - 1]
      ];

      for (let i = 0; i < 4; i++) {
        const nx = neighbors[i][0];
        const ny = neighbors[i][1];

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nMaskIdx = ny * width + nx;
          if (mask[nMaskIdx] === 0) {
            // Check body protection zones:
            // 1. Lower torso / chest (y > 58% height and central x) is unconditionally PROTECTED
            if (ny > height * 0.58 && nx > width * 0.18 && nx < width * 0.82) {
              mask[nMaskIdx] = 2; // Person / Suit
              continue;
            }

            // 2. Shoulders region (y > 45% height): strict threshold so suits/shirts are not eaten
            const nDataIdx = nMaskIdx * 4;
            const nr = data[nDataIdx], ng = data[nDataIdx + 1], nb = data[nDataIdx + 2];
            const distFromSample = getMinColorDist(nr, ng, nb);

            const effectiveTolerance = (ny > height * 0.40) ? (tolerance * 0.85) : tolerance;

            if (distFromSample <= effectiveTolerance) {
              mask[nMaskIdx] = 1; // Background
              queue.push(nx, ny);
            } else {
              mask[nMaskIdx] = 2; // Foreground (Person, Hair, Clothes)
            }
          }
        }
      }
    }

    // Replace background pixels with smooth anti-aliased edge blending
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const mIdx = y * width + x;
        const dIdx = mIdx * 4;
        if (mask[mIdx] === 1) {
          // Pure Background -> Replace with target studio color
          data[dIdx] = targetRgb.r;
          data[dIdx + 1] = targetRgb.g;
          data[dIdx + 2] = targetRgb.b;
        } else if (mask[mIdx] === 2) {
          // Check if adjacent to background for soft anti-aliased edge blending
          const dist = getMinColorDist(data[dIdx], data[dIdx + 1], data[dIdx + 2]);
          if (dist < tolerance * 1.15 && (y < height * 0.55 || x < width * 0.2 || x > width * 0.8)) {
            const blend = Math.max(0, Math.min(0.85, (tolerance - dist) / (tolerance * 0.4)));
            data[dIdx] = Math.round(data[dIdx] * (1 - blend) + targetRgb.r * blend);
            data[dIdx + 1] = Math.round(data[dIdx + 1] * (1 - blend) + targetRgb.g * blend);
            data[dIdx + 2] = Math.round(data[dIdx + 2] * (1 - blend) + targetRgb.b * blend);
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return workCanvas;
  },

  // ---------------- PHOTO ENHANCEMENT & SHARPENING FILTERS ---------------- //
  applySharpen(canvas, amount = 30) {
    if (amount <= 0) return canvas;
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, width, height);
    const src = imgData.data;

    const output = ctx.createImageData(width, height);
    const dst = output.data;

    // 3x3 Unsharp Mask Sharpening Kernel
    const k = (amount / 100) * 0.75;
    // Kernel:
    // [  0, -k,  0 ]
    // [ -k, 1+4k, -k ]
    // [  0, -k,  0 ]

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;

        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          dst[idx] = src[idx];
          dst[idx + 1] = src[idx + 1];
          dst[idx + 2] = src[idx + 2];
          dst[idx + 3] = src[idx + 3];
          continue;
        }

        const top = ((y - 1) * width + x) * 4;
        const bot = ((y + 1) * width + x) * 4;
        const left = (y * width + (x - 1)) * 4;
        const right = (y * width + (x + 1)) * 4;

        for (let c = 0; c < 3; c++) {
          const val = src[idx + c] * (1 + 4 * k) - (src[top + c] + src[bot + c] + src[left + c] + src[right + c]) * k;
          dst[idx + c] = Math.max(0, Math.min(255, val));
        }
        dst[idx + 3] = src[idx + 3];
      }
    }

    ctx.putImageData(output, 0, 0);
    return canvas;
  },

  applyAutoEnhance(canvas) {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // 1. Calculate min and max luminance for dynamic range stretching
    let minLum = 255, maxLum = 0;
    for (let i = 0; i < data.length; i += 16) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (lum < minLum) minLum = lum;
      if (lum > maxLum) maxLum = lum;
    }

    minLum = Math.max(0, minLum - 10);
    maxLum = Math.min(255, maxLum + 10);
    const range = Math.max(1, maxLum - minLum);

    // 2. Dynamic stretch & vibrance boost
    for (let i = 0; i < data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        // Contrast stretch
        let val = ((data[i + c] - minLum) / range) * 255;
        // Gentle S-curve
        val = val < 128 ? (2 * val * val) / 255 : 255 - (2 * (255 - val) * (255 - val)) / 255;
        data[i + c] = Math.max(0, Math.min(255, val));
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
  },

  getSingleProcessedPhotoCanvas() {
    if (!this.cropper) return null;

    // Get cropped canvas from Cropper.js
    const currentPresetObj = this.presets[this.currentPreset] || this.presets.size_12x15;
    const targetW = Math.round(currentPresetObj.w * 11.81); // approx 300 DPI
    const targetH = Math.round(currentPresetObj.h * 11.81);

    const cropped = this.cropper.getCroppedCanvas({
      width: targetW || 360,
      height: targetH || 450,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    });

    if (!cropped) return null;

    // 1. Smart Background Replacement if a color is chosen
    let photoToDraw = cropped;
    if (this.bgColor && this.bgColor !== 'original' && this.bgColor !== 'none') {
      const tol = this.bgTolerance || 45;
      photoToDraw = this.replaceBackground(cropped, this.bgColor, tol);
    }

    // 2. Create target canvas with brightness & contrast
    const target = document.createElement('canvas');
    target.width = photoToDraw.width;
    target.height = photoToDraw.height;
    const ctx = target.getContext('2d');

    ctx.filter = `brightness(${this.brightness}%) contrast(${this.contrast}%)`;
    ctx.drawImage(photoToDraw, 0, 0);
    ctx.filter = 'none';

    // 3. Apply Auto-Enhance if enabled
    if (this.autoEnhance) {
      this.applyAutoEnhance(target);
    }

    // 4. Apply Unsharp Masking / Sharpness filter
    if (this.sharpness > 0) {
      this.applySharpen(target, this.sharpness);
    }

    // 5. Optional cutting border
    if (this.addBorder) {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, target.width - 2, target.height - 2);
    }

    return target;
  },

  generateSheet() {
    const singlePhoto = this.getSingleProcessedPhotoCanvas();
    if (!singlePhoto) return;

    // Also update the single preview canvas
    const singleCanvas = document.getElementById('passPhotoSingleCanvas');
    if (singleCanvas) {
      singleCanvas.width = singlePhoto.width;
      singleCanvas.height = singlePhoto.height;
      const sCtx = singleCanvas.getContext('2d');
      sCtx.drawImage(singlePhoto, 0, 0);
    }

    // A4 Dimension at high fidelity: 1240 x 1754 px
    const a4Canvas = document.getElementById('passPhotoSheetCanvas');
    if (!a4Canvas) return;

    a4Canvas.width = 1240;
    a4Canvas.height = 1754;
    const ctx = a4Canvas.getContext('2d');

    // White paper background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, a4Canvas.width, a4Canvas.height);

    const ratio = singlePhoto.width / singlePhoto.height;
    const presetName = this.presets[this.currentPreset]?.name || 'Passport Size';

    // Determine Grid Dimensions (Columns x Rows) with Minimal Margins (25px top, 25px left & right)
    let cols = 6;
    let rows = Math.ceil(this.copies / 6);
    let photoW = 180;
    let photoH = Math.round(photoW / ratio);
    let startX = 25; // Minimal tight left margin
    let startY = 25; // Minimal tight top margin (no wasted paper at top!)
    let gapX = 22;
    let gapY = 20;

    const is6ColMode = (this.currentPreset === 'size_12x15') || 
                       (this.copies === 6 || this.copies === 12 || this.copies === 18 || this.copies === 24 || this.copies === 30 || this.copies === 36);

    if (this.copies === 1) {
      cols = 1; rows = 1;
      photoW = 280; photoH = Math.round(photoW / ratio);
      startX = 25;
      startY = 25;
    } else if (this.copies === 4) {
      cols = 2; rows = 2;
      photoW = 320; photoH = Math.round(photoW / ratio);
      startX = 25; startY = 25;
      gapX = 35; gapY = 30;
    } else if (is6ColMode) {
      // 6 Photos in a single line / row layout with minimal margins
      cols = 6;
      rows = Math.ceil(this.copies / 6);
      photoW = 180;
      photoH = Math.round(photoW / ratio);
      startX = 25; // 25 + 6*180 + 5*22 = 1215px (25px right margin on 1240px A4)
      startY = 25; // Clean 25px top margin
      gapX = 22;
      gapY = 20;
    } else if (this.copies === 8) {
      cols = 4; rows = 2;
      photoW = 265; photoH = Math.round(photoW / ratio);
      startX = 25; startY = 25;
      gapX = 40; gapY = 30;
    } else if (this.copies === 16) {
      cols = 4; rows = 4;
      photoW = 265; photoH = Math.round(photoW / ratio);
      startX = 25; startY = 25;
      gapX = 40; gapY = 25;
    } else if (this.copies === 32) {
      cols = 4; rows = 8;
      photoW = 265; photoH = Math.round(photoW / ratio);
      startX = 25; startY = 25;
      gapX = 40; gapY = 16;
    } else {
      cols = 4;
      rows = Math.ceil(this.copies / 4);
      photoW = 265;
      photoH = Math.round(photoW / ratio);
      startX = 25; startY = 25;
      gapX = 40; gapY = 25;
    }

    let count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (count >= this.copies) break;

        const posX = startX + c * (photoW + gapX);
        const posY = startY + r * (photoH + gapY);

        // Draw photo
        ctx.drawImage(singlePhoto, posX, posY, photoW, photoH);

        // Cutting Guideline crosses around corners
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 3]);
        
        // Guideline lines
        ctx.strokeRect(posX - 3, posY - 3, photoW + 6, photoH + 6);
        ctx.setLineDash([]); // Reset dash

        count++;
      }
    }

    // Small footer info placed at the very bottom edge of A4 sheet (No space wasted at top!)
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`VUO CSC HELP — ${presetName} | ${this.copies} Photos | ${new Date().toLocaleDateString('en-GB')}`, a4Canvas.width / 2, 1735);
  },

  downloadSingleJpg() {
    const single = this.getSingleProcessedPhotoCanvas();
    if (!single) {
      showToast("Please upload a photo first.", "warning");
      return;
    }
    const link = document.createElement('a');
    link.download = `VUO_Passport_Photo_${Date.now()}.jpg`;
    link.href = single.toDataURL('image/jpeg', 0.95);
    link.click();
    showToast("Passport Photo downloaded successfully!", "success");
  },

  downloadSheetJpg() {
    const sheet = document.getElementById('passPhotoSheetCanvas');
    if (!sheet) return;
    const link = document.createElement('a');
    link.download = `VUO_A4_Passport_Sheet_${this.copies}_Copies_${Date.now()}.jpg`;
    link.href = sheet.toDataURL('image/jpeg', 0.95);
    link.click();
    showToast(`A4 Sheet (${this.copies} copies) downloaded!`, "success");
  },

  downloadSheetPdf() {
    const sheet = document.getElementById('passPhotoSheetCanvas');
    if (!sheet) return;

    if (!window.jspdf || !window.jspdf.jsPDF) {
      showToast("PDF generator library loading, please try again in a moment.", "info");
      return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4'); // A4 is 210 x 297 mm
    const imgData = sheet.toDataURL('image/jpeg', 0.98);

    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    pdf.save(`VUO_Passport_Sheet_${this.copies}Copies_${Date.now()}.pdf`);
    showToast("Print-Ready A4 PDF generated and downloaded!", "success");
  },

  printSheet() {
    const sheet = document.getElementById('passPhotoSheetCanvas');
    if (!sheet) return;

    const dataUrl = sheet.toDataURL('image/jpeg', 1.0);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast("Please allow popups to print directly.", "warning");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>VUO CSC HELP - Passport Photo Print</title>
          <style>
            @page { size: A4; margin: 0mm; }
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: #fff; }
            img { width: 100vw; height: auto; max-height: 100vh; object-fit: contain; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <img src="${dataUrl}" />
        </body>
      </html>
    `);
    printWindow.document.close();
  },

  setViewMode(mode) {
    this.viewMode = mode;
    const canvas = document.getElementById('passPhotoSheetCanvas');
    const fitBtn = document.getElementById('passPhotoViewFit');
    const zoomBtn = document.getElementById('passPhotoViewZoom');

    if (mode === 'zoom') {
      if (canvas) canvas.classList.add('zoom-actual');
      if (zoomBtn) {
        zoomBtn.className = 'px-2.5 py-1 rounded-md bg-white text-sky-700 shadow-xs transition-all flex items-center gap-1 font-bold';
      }
      if (fitBtn) {
        fitBtn.className = 'px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1 font-bold';
      }
      showToast("A4 Sheet: 100% Actual Pixel View", "info");
    } else {
      if (canvas) canvas.classList.remove('zoom-actual');
      if (fitBtn) {
        fitBtn.className = 'px-2.5 py-1 rounded-md bg-white text-sky-700 shadow-xs transition-all flex items-center gap-1 font-bold';
      }
      if (zoomBtn) {
        zoomBtn.className = 'px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1 font-bold';
      }
      showToast("A4 Sheet: Full Page Fit View", "info");
    }
  }
};
