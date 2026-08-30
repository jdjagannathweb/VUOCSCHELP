/**
 * VUO CSC HELP - Official VLE UNION ODISHA I-Card Generator
 * High resolution identity card creation with dynamic QR verification, front/back views and PDF export
 */

const VUO_ICARDMAKER = {
  photoDataUrl: null,

  init() {
    this.bindEvents();
    this.populateInitialData();
    this.updateCard();
  },

  bindEvents() {
    const inputs = [
      'icardName', 'icardMemberNo', 'icardCscId', 'icardDesignation',
      'icardDistrict', 'icardBlock', 'icardGp', 'icardMobile', 'icardBlood', 'icardValidity'
    ];

    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => this.updateCard());
    });

    const districtSelect = document.getElementById('icardDistrict');
    if (districtSelect) {
      districtSelect.addEventListener('change', () => {
        populateBlockDropdown('icardDistrict', 'icardBlock');
        this.updateCard();
      });
    }

    const photoInput = document.getElementById('icardPhotoInput');
    if (photoInput) {
      photoInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            this.photoDataUrl = ev.target.result;
            this.updateCard();
          };
          reader.readAsDataURL(e.target.files[0]);
        }
      });
    }
  },

  populateInitialData() {
    populateDistrictDropdown('icardDistrict', 'Puri');
    populateBlockDropdown('icardDistrict', 'icardBlock', 'Satyabadi');

    const user = VUO_AUTH.getCurrentUser();
    if (user) {
      if (document.getElementById('icardName')) document.getElementById('icardName').value = user.fullName;
      if (document.getElementById('icardMemberNo')) document.getElementById('icardMemberNo').value = user.memberNo;
      if (document.getElementById('icardCscId')) document.getElementById('icardCscId').value = user.cscId;
      if (document.getElementById('icardDesignation')) document.getElementById('icardDesignation').value = user.designation || "VLE Member";
      if (document.getElementById('icardGp')) document.getElementById('icardGp').value = user.gp;
      if (document.getElementById('icardMobile')) document.getElementById('icardMobile').value = user.mobile;
      if (document.getElementById('icardBlood')) document.getElementById('icardBlood').value = user.bloodGroup || "O+";
    }
  },

  loadMyProfileIntoCard() {
    const user = VUO_AUTH.getCurrentUser();
    if (!user) {
      showToast("Please log in as a member to auto-fill your profile.", "info");
      return;
    }
    this.populateInitialData();
    this.updateCard();
    showToast("Loaded your VLE profile into I-Card generator.", "success");
  },

  updateCard() {
    const name = document.getElementById('icardName')?.value || "Jagannath Mohanty";
    const memberNo = document.getElementById('icardMemberNo')?.value || "VUO-2026-OD-1082";
    const cscId = document.getElementById('icardCscId')?.value || "782910482910";
    const designation = document.getElementById('icardDesignation')?.value || "VLE Coordinator";
    const district = document.getElementById('icardDistrict')?.value || "Puri";
    const block = document.getElementById('icardBlock')?.value || "Satyabadi";
    const gp = document.getElementById('icardGp')?.value || "Satyabadi";
    const mobile = document.getElementById('icardMobile')?.value || "9937037131";
    const blood = document.getElementById('icardBlood')?.value || "O+";
    const validity = document.getElementById('icardValidity')?.value || "2026 - 2029";

    // Update Front Card Elements
    if (document.getElementById('cardPrevName')) document.getElementById('cardPrevName').textContent = name;
    if (document.getElementById('cardPrevMemberNo')) document.getElementById('cardPrevMemberNo').textContent = memberNo;
    if (document.getElementById('cardPrevCscId')) document.getElementById('cardPrevCscId').textContent = cscId;
    if (document.getElementById('cardPrevDesignation')) document.getElementById('cardPrevDesignation').textContent = designation;
    if (document.getElementById('cardPrevDistrict')) document.getElementById('cardPrevDistrict').textContent = district;
    if (document.getElementById('cardPrevBlock')) document.getElementById('cardPrevBlock').textContent = block;
    if (document.getElementById('cardPrevGp')) document.getElementById('cardPrevGp').textContent = gp;
    if (document.getElementById('cardPrevMobile')) document.getElementById('cardPrevMobile').textContent = `+91 ${mobile}`;
    if (document.getElementById('cardPrevBlood')) document.getElementById('cardPrevBlood').textContent = blood;
    if (document.getElementById('cardPrevValidity')) document.getElementById('cardPrevValidity').textContent = validity;

    // Update Photo
    const photoEl = document.getElementById('cardPrevPhoto');
    if (photoEl) {
      if (this.photoDataUrl) {
        photoEl.src = this.photoDataUrl;
      } else {
        photoEl.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";
      }
    }

    // Render Live Verification QR Code
    this.renderVerificationQr(name, memberNo, cscId, district);
  },

  renderVerificationQr(name, memberNo, cscId, district) {
    const qrCanvas = document.getElementById('cardQrCanvas');
    if (!qrCanvas) return;

    const verifyString = `VERIFIED VUO CSC HELP MEMBER\nName: ${name}\nMember No: ${memberNo}\nCSC ID: ${cscId}\nDistrict: ${district}\nContact: 9937037131\nAddress: Satyabadi, Puri, Odisha\nStatus: Active VLE (2026)`;

    if (window.QRious) {
      new QRious({
        element: qrCanvas,
        value: verifyString,
        size: 80,
        level: 'H'
      });
    }
  },

  downloadFrontPng() {
    const cardEl = document.getElementById('icardFrontContainer');
    if (!cardEl || !window.html2canvas) return;

    showToast("Generating Front I-Card...", "info");
    html2canvas(cardEl, { scale: 3, useCORS: true }).then(canvas => {
      const link = document.createElement('a');
      const memNo = document.getElementById('icardMemberNo')?.value || 'Member';
      link.download = `VUO_ICard_Front_${memNo}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast("Front I-Card downloaded successfully!", "success");
    });
  },

  downloadBackPng() {
    const cardEl = document.getElementById('icardBackContainer');
    if (!cardEl || !window.html2canvas) return;

    showToast("Generating Back I-Card...", "info");
    html2canvas(cardEl, { scale: 3, useCORS: true }).then(canvas => {
      const link = document.createElement('a');
      const memNo = document.getElementById('icardMemberNo')?.value || 'Member';
      link.download = `VUO_ICard_Back_${memNo}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast("Back I-Card downloaded successfully!", "success");
    });
  },

  downloadFullPdf() {
    const frontEl = document.getElementById('icardFrontContainer');
    const backEl = document.getElementById('icardBackContainer');
    if (!frontEl || !backEl || !window.html2canvas || !window.jspdf) return;

    showToast("Generating Printable I-Card Sheet...", "info");
    Promise.all([
      html2canvas(frontEl, { scale: 3, useCORS: true }),
      html2canvas(backEl, { scale: 3, useCORS: true })
    ]).then(([frontCanvas, backCanvas]) => {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');

      // CR80 Standard ID Card Dimensions: 85.6mm x 54mm
      const cardW = 85.6;
      const cardH = 54;

      // Header on PDF sheet
      pdf.setFontSize(14);
      pdf.setTextColor(11, 30, 54);
      pdf.text("VUO CSC HELP — Official Member Identity Card", 20, 25);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text("Cut along dotted guidelines and laminate using standard ID Card pouch.", 20, 32);

      // Add Front Card
      const frontData = frontCanvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(frontData, 'JPEG', 20, 45, cardW, cardH);

      // Add Back Card side-by-side or below
      const backData = backCanvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(backData, 'JPEG', 110, 45, cardW, cardH);

      const memNo = document.getElementById('icardMemberNo')?.value || 'Member';
      pdf.save(`VUO_ID_Card_${memNo}.pdf`);
      showToast("Printable I-Card PDF downloaded!", "success");
    });
  },

  printCard() {
    window.print();
  }
};
