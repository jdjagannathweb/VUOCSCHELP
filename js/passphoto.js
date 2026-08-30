/**
 * VUO CSC HELP - Pass Photo Maker Tool
 * High precision passport photo creator, background adjuster, and multi-copy A4 sheet generator
 */

const VUO_PASSPHOTO = {
  cropper: null,
  uploadedImage: null,
  currentPreset: 'passport', // 'passport', 'stamp', 'pan', 'aadhaar', 'custom'
  bgColor: '#ffffff',
  copies: 8,
  addBorder: true,
  brightness: 100,
  contrast: 100,

  // Dimension presets in millimeters
  presets: {
    passport: { name: 'Indian Passport (3.5 x 4.5 cm)', w: 35, h: 45, ratio: 35 / 45 },
    stamp: { name: 'Stamp Size (2.0 x 2.5 cm)', w: 20, h: 25, ratio: 20 / 25 },
    pan: { name: 'PAN Card (2.5 x 3.5 cm)', w: 25, h: 35, ratio: 25 / 35 },
    aadhaar: { name: 'Aadhaar / Exam (3.5 x 3.5 cm)', w: 35, h: 35, ratio: 1 },
    custom: { name: 'Custom Dimension', w: 35, h: 45, ratio: 35 / 45 }
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

    // Background color presets
    document.querySelectorAll('.passphoto-bg-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.passphoto-bg-btn').forEach(b => b.classList.remove('ring-2', 'ring-sky-500', 'scale-110'));
        const target = e.currentTarget;
        target.classList.add('ring-2', 'ring-sky-500', 'scale-110');
        this.bgColor = target.getAttribute('data-color');
        const customColorInput = document.getElementById('passPhotoCustomBg');
        if (customColorInput) customColorInput.value = this.bgColor;
        this.generateSheet();
      });
    });

    const customColorInput = document.getElementById('passPhotoCustomBg');
    if (customColorInput) {
      customColorInput.addEventListener('input', (e) => {
        this.bgColor = e.target.value;
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

  getSingleProcessedPhotoCanvas() {
    if (!this.cropper) return null;

    // Get cropped canvas from Cropper.js
    const cropped = this.cropper.getCroppedCanvas({
      width: 413, // 35mm at 300 DPI
      height: 531, // 45mm at 300 DPI
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    });

    if (!cropped) return null;

    // Create target canvas with background & filter effects
    const target = document.createElement('canvas');
    target.width = cropped.width;
    target.height = cropped.height;
    const ctx = target.getContext('2d');

    // Apply background color if selected
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, target.width, target.height);

    // Apply brightness & contrast
    ctx.filter = `brightness(${this.brightness}%) contrast(${this.contrast}%)`;
    ctx.drawImage(cropped, 0, 0);
    ctx.filter = 'none';

    // Optional border
    if (this.addBorder) {
      ctx.strokeStyle = '#1e293b';
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

    // A4 Dimension at 300 DPI for high print fidelity: 2480 x 3508 px
    const a4Canvas = document.getElementById('passPhotoSheetCanvas');
    if (!a4Canvas) return;

    // Scale canvas resolution: A4 ratio (1 : 1.414)
    a4Canvas.width = 1240;
    a4Canvas.height = 1754;
    const ctx = a4Canvas.getContext('2d');

    // White paper background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, a4Canvas.width, a4Canvas.height);

    // Header info on print sheet for VLE identification
    ctx.fillStyle = '#64748b';
    ctx.font = '600 13px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('VUO CSC HELP — Professional Passport Photo Print Sheet', 40, 35);
    ctx.textAlign = 'right';
    ctx.fillText(`Print Size: A4 | Copies: ${this.copies} | Date: ${new Date().toLocaleDateString()}`, a4Canvas.width - 40, 35);

    // Divider line
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 45);
    ctx.lineTo(a4Canvas.width - 40, 45);
    ctx.stroke();

    // Determine Grid Dimensions (Columns x Rows)
    let cols = 4, rows = 2;
    let photoW = 220, photoH = 280; // Scaled pixel size on sheet
    const startX = 60;
    let startY = 80;
    const gapX = 35;
    const gapY = 40;

    if (this.copies === 1) {
      cols = 1; rows = 1;
      photoW = 350; photoH = 450;
      startY = 150;
    } else if (this.copies === 4) {
      cols = 2; rows = 2;
      photoW = 260; photoH = 330;
      gapX = 60; gapY = 60;
    } else if (this.copies === 6) {
      cols = 3; rows = 2;
      photoW = 230; photoH = 295;
    } else if (this.copies === 8) {
      cols = 4; rows = 2;
      photoW = 220; photoH = 280;
    } else if (this.copies === 12) {
      cols = 4; rows = 3;
      photoW = 210; photoH = 270;
      gapY = 30;
    } else if (this.copies === 16) {
      cols = 4; rows = 4;
      photoW = 200; photoH = 255;
      gapY = 25;
    } else if (this.copies === 32) {
      cols = 4; rows = 8;
      photoW = 180; photoH = 180 * (singlePhoto.height / singlePhoto.width);
      gapX = 25; gapY = 20;
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
        ctx.strokeRect(posX - 4, posY - 4, photoW + 8, photoH + 8);
        ctx.setLineDash([]); // Reset dash

        count++;
      }
    }
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
  }
};
