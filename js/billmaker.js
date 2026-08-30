/**
 * VUO CSC HELP - CSC Bill Maker & Customer Receipt Generator
 * Generates official receipts with VLE details, dynamic line items, auto calculations, UPI QR, and PDF/Print export
 */

const VUO_BILLMAKER = {
  items: [],
  billNoCounter: parseInt(localStorage.getItem('vuo_last_bill_no') || '1001', 10),

  init() {
    this.loadSavedShopInfo();
    this.initDefaultItems();
    this.bindEvents();
    this.renderItemsTable();
    this.updateBillPreview();
  },

  bindEvents() {
    // Save shop info button
    const saveShopBtn = document.getElementById('billSaveShopBtn');
    if (saveShopBtn) {
      saveShopBtn.addEventListener('click', () => this.saveShopInfo());
    }

    // Add Item button
    const addItemBtn = document.getElementById('billAddItemBtn');
    if (addItemBtn) {
      addItemBtn.addEventListener('click', () => this.addNewItem());
    }

    // Live form inputs trigger preview updates
    const inputsToWatch = [
      'billShopName', 'billVleName', 'billCscId', 'billShopPhone', 'billShopAddress', 'billUpiId',
      'billCustomerName', 'billCustomerPhone', 'billCustomerAddress', 'billNo', 'billDate',
      'billDiscount', 'billTax', 'billPaymentMode', 'billPaymentStatus', 'billNotes'
    ];

    inputsToWatch.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.updateBillPreview());
      }
    });

    // Populate service preset dropdown
    const presetSelect = document.getElementById('billServicePreset');
    if (presetSelect) {
      presetSelect.innerHTML = '<option value="">-- Add Standard CSC Service (ଚୟନ କରନ୍ତୁ) --</option>';
      VUO_DATA.billServices.forEach(s => {
        const opt = document.createElement('option');
        opt.value = JSON.stringify(s);
        opt.textContent = `${s.name} (₹${s.rate})`;
        presetSelect.appendChild(opt);
      });

      presetSelect.addEventListener('change', (e) => {
        if (e.target.value) {
          const service = JSON.parse(e.target.value);
          this.addNewItem(service.name, 1, service.rate);
          e.target.value = '';
        }
      });
    }
  },

  loadSavedShopInfo() {
    const user = VUO_AUTH.getCurrentUser();
    const savedShop = localStorage.getItem('vuo_saved_shop_info');

    let shopData = {
      shopName: "VUO CSC HELP DIGITAL SEVA KENDRA",
      vleName: user ? user.fullName : "Jagannath Mohanty",
      cscId: user ? user.cscId : "782910482910",
      phone: user ? user.mobile : "9937037131",
      address: user ? `${user.gp}, ${user.block}, ${user.district}` : "Satyabadi, Puri, Odisha",
      upiId: "9937037131@upi"
    };

    if (savedShop) {
      try {
        shopData = { ...shopData, ...JSON.parse(savedShop) };
      } catch (e) {}
    }

    // Set input values
    if (document.getElementById('billShopName')) document.getElementById('billShopName').value = shopData.shopName;
    if (document.getElementById('billVleName')) document.getElementById('billVleName').value = shopData.vleName;
    if (document.getElementById('billCscId')) document.getElementById('billCscId').value = shopData.cscId;
    if (document.getElementById('billShopPhone')) document.getElementById('billShopPhone').value = shopData.phone;
    if (document.getElementById('billShopAddress')) document.getElementById('billShopAddress').value = shopData.address;
    if (document.getElementById('billUpiId')) document.getElementById('billUpiId').value = shopData.upiId;

    // Set initial Bill Details
    if (document.getElementById('billNo')) document.getElementById('billNo').value = `CSC-${this.billNoCounter}`;
    if (document.getElementById('billDate')) document.getElementById('billDate').value = new Date().toISOString().split('T')[0];
    if (document.getElementById('billCustomerName')) document.getElementById('billCustomerName').value = "Ramesh Chandra Das";
    if (document.getElementById('billCustomerPhone')) document.getElementById('billCustomerPhone').value = "9438012345";
  },

  saveShopInfo() {
    const shopData = {
      shopName: document.getElementById('billShopName').value,
      vleName: document.getElementById('billVleName').value,
      cscId: document.getElementById('billCscId').value,
      phone: document.getElementById('billShopPhone').value,
      address: document.getElementById('billShopAddress').value,
      upiId: document.getElementById('billUpiId').value
    };
    localStorage.setItem('vuo_saved_shop_info', JSON.stringify(shopData));
    showToast("Shop information saved successfully for future bills!", "success");
    this.updateBillPreview();
  },

  initDefaultItems() {
    this.items = [
      { id: 1, name: "Aadhaar Card Color PVC Print & Lamination", qty: 2, rate: 50 },
      { id: 2, name: "Subhadra Yojana Online Application", qty: 1, rate: 50 },
      { id: 3, name: "e-District Caste & Income Certificate", qty: 1, rate: 60 }
    ];
  },

  addNewItem(name = "CSC Citizen Service", qty = 1, rate = 50) {
    const newItem = {
      id: Date.now() + Math.random(),
      name,
      qty: parseInt(qty, 10) || 1,
      rate: parseFloat(rate) || 0
    };
    this.items.push(newItem);
    this.renderItemsTable();
    this.updateBillPreview();
  },

  removeItem(index) {
    this.items.splice(index, 1);
    this.renderItemsTable();
    this.updateBillPreview();
  },

  renderItemsTable() {
    const tbody = document.getElementById('billItemsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    this.items.forEach((item, idx) => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-100';
      tr.innerHTML = `
        <td class="py-2 pr-2">
          <input type="text" value="${item.name}" class="w-full text-xs font-medium px-2 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-sky-500" 
            onchange="VUO_BILLMAKER.updateItem(${idx}, 'name', this.value)" />
        </td>
        <td class="py-2 px-1 w-20">
          <input type="number" min="1" value="${item.qty}" class="w-full text-xs text-center px-1 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-sky-500" 
            onchange="VUO_BILLMAKER.updateItem(${idx}, 'qty', this.value)" />
        </td>
        <td class="py-2 px-1 w-24">
          <input type="number" min="0" value="${item.rate}" class="w-full text-xs text-right px-2 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-sky-500" 
            onchange="VUO_BILLMAKER.updateItem(${idx}, 'rate', this.value)" />
        </td>
        <td class="py-2 px-2 w-24 text-xs font-bold text-slate-800 text-right">
          ₹${(item.qty * item.rate).toFixed(2)}
        </td>
        <td class="py-2 pl-1 w-10 text-center">
          <button type="button" onclick="VUO_BILLMAKER.removeItem(${idx})" class="text-rose-500 hover:text-rose-700 p-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  updateItem(index, key, val) {
    if (!this.items[index]) return;
    if (key === 'qty') this.items[index].qty = parseInt(val, 10) || 1;
    else if (key === 'rate') this.items[index].rate = parseFloat(val) || 0;
    else this.items[index][key] = val;

    this.renderItemsTable();
    this.updateBillPreview();
  },

  updateBillPreview() {
    const shopName = document.getElementById('billShopName')?.value || "VUO CSC HELP DIGITAL SEVA KENDRA";
    const vleName = document.getElementById('billVleName')?.value || "Jagannath Mohanty";
    const cscId = document.getElementById('billCscId')?.value || "782910482910";
    const shopPhone = document.getElementById('billShopPhone')?.value || "9937037131";
    const shopAddress = document.getElementById('billShopAddress')?.value || "Satyabadi, Puri, Odisha";
    const upiId = document.getElementById('billUpiId')?.value || "9937037131@upi";

    const customerName = document.getElementById('billCustomerName')?.value || "Valued Customer";
    const customerPhone = document.getElementById('billCustomerPhone')?.value || "-";
    const customerAddress = document.getElementById('billCustomerAddress')?.value || "-";
    const billNo = document.getElementById('billNo')?.value || `CSC-${this.billNoCounter}`;
    const billDate = document.getElementById('billDate')?.value || new Date().toISOString().split('T')[0];

    const discount = parseFloat(document.getElementById('billDiscount')?.value || 0);
    const tax = parseFloat(document.getElementById('billTax')?.value || 0);
    const paymentMode = document.getElementById('billPaymentMode')?.value || "Cash";
    const paymentStatus = document.getElementById('billPaymentStatus')?.value || "PAID";
    const notes = document.getElementById('billNotes')?.value || "Thank you for visiting our Common Services Center! For queries contact VLE.";

    // Calculate totals
    let subtotal = 0;
    this.items.forEach(i => { subtotal += i.qty * i.rate; });
    const grandTotal = Math.max(0, subtotal - discount + tax);

    // Update Preview Elements
    if (document.getElementById('prevShopName')) document.getElementById('prevShopName').textContent = shopName;
    if (document.getElementById('prevVleName')) document.getElementById('prevVleName').textContent = vleName;
    if (document.getElementById('prevCscId')) document.getElementById('prevCscId').textContent = cscId;
    if (document.getElementById('prevShopPhone')) document.getElementById('prevShopPhone').textContent = shopPhone;
    if (document.getElementById('prevShopAddress')) document.getElementById('prevShopAddress').textContent = shopAddress;

    if (document.getElementById('prevCustomerName')) document.getElementById('prevCustomerName').textContent = customerName;
    if (document.getElementById('prevCustomerPhone')) document.getElementById('prevCustomerPhone').textContent = customerPhone;
    if (document.getElementById('prevCustomerAddress')) document.getElementById('prevCustomerAddress').textContent = customerAddress;
    if (document.getElementById('prevBillNo')) document.getElementById('prevBillNo').textContent = billNo;
    if (document.getElementById('prevBillDate')) document.getElementById('prevBillDate').textContent = billDate;

    if (document.getElementById('prevPaymentMode')) document.getElementById('prevPaymentMode').textContent = paymentMode;
    const statusBadge = document.getElementById('prevPaymentStatus');
    if (statusBadge) {
      statusBadge.textContent = paymentStatus;
      statusBadge.className = paymentStatus === 'PAID' ? 
        'px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300' : 
        'px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-300';
    }

    if (document.getElementById('prevNotes')) document.getElementById('prevNotes').textContent = notes;

    // Render Preview Items Table
    const prevItemsTbody = document.getElementById('prevBillItemsTbody');
    if (prevItemsTbody) {
      prevItemsTbody.innerHTML = '';
      this.items.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-200 text-xs';
        tr.innerHTML = `
          <td class="py-2 text-center text-slate-500 font-medium">${idx + 1}</td>
          <td class="py-2 text-slate-800 font-semibold">${item.name}</td>
          <td class="py-2 text-center text-slate-600">${item.qty}</td>
          <td class="py-2 text-right text-slate-600">₹${item.rate.toFixed(2)}</td>
          <td class="py-2 text-right text-slate-900 font-bold">₹${(item.qty * item.rate).toFixed(2)}</td>
        `;
        prevItemsTbody.appendChild(tr);
      });
    }

    if (document.getElementById('prevSubtotal')) document.getElementById('prevSubtotal').textContent = `₹${subtotal.toFixed(2)}`;
    if (document.getElementById('prevDiscount')) document.getElementById('prevDiscount').textContent = `₹${discount.toFixed(2)}`;
    if (document.getElementById('prevTax')) document.getElementById('prevTax').textContent = `₹${tax.toFixed(2)}`;
    if (document.getElementById('prevGrandTotal')) document.getElementById('prevGrandTotal').textContent = `₹${grandTotal.toFixed(2)}`;
    if (document.getElementById('prevTotalWords')) document.getElementById('prevTotalWords').textContent = `${this.numberToWords(grandTotal)} Rupees Only`;

    // Render UPI QR Code if QRious / QRCode exists
    this.renderUpiQr(upiId, grandTotal, shopName);
  },

  renderUpiQr(upiId, amount, shopName) {
    const qrCanvas = document.getElementById('prevUpiQrCanvas');
    if (!qrCanvas) return;

    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(shopName)}&am=${amount.toFixed(2)}&cu=INR`;
    
    if (window.QRious) {
      new QRious({
        element: qrCanvas,
        value: upiUri,
        size: 90,
        level: 'M'
      });
    }
  },

  numberToWords(num) {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    num = Math.floor(num);
    if (num === 0) return 'Zero';

    function inWords(n) {
      if (n < 20) return a[n];
      const digit = n % 10;
      if (n < 100) return b[Math.floor(n / 10)] + (digit ? ' ' + a[digit] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + (n % 100 === 0 ? '' : 'and ' + inWords(n % 100));
      if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 === 0 ? '' : inWords(n % 1000));
      if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 === 0 ? '' : inWords(n % 100000));
      return inWords(Math.floor(n / 10000000)) + 'Crore ' + (n % 10000000 === 0 ? '' : inWords(n % 10000000));
    }

    return inWords(num).trim();
  },

  printBill() {
    const billCard = document.getElementById('printableBillArea');
    if (!billCard) return;

    window.print();

    // Increment bill counter
    this.billNoCounter++;
    localStorage.setItem('vuo_last_bill_no', this.billNoCounter.toString());
    document.getElementById('billNo').value = `CSC-${this.billNoCounter}`;
  },

  downloadPdf() {
    const billElement = document.getElementById('printableBillArea');
    if (!billElement || !window.html2canvas || !window.jspdf) {
      showToast("Required libraries loading, please wait a second.", "info");
      return;
    }

    showToast("Generating PDF invoice...", "info");

    html2canvas(billElement, { scale: 2, useCORS: true }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 10, pdfWidth, pdfHeight);
      const billNo = document.getElementById('billNo')?.value || 'Receipt';
      pdf.save(`CSC_Bill_${billNo}.pdf`);
      showToast("PDF Bill downloaded successfully!", "success");
    });
  },

  downloadImage() {
    const billElement = document.getElementById('printableBillArea');
    if (!billElement || !window.html2canvas) return;

    html2canvas(billElement, { scale: 2, useCORS: true }).then(canvas => {
      const link = document.createElement('a');
      const billNo = document.getElementById('billNo')?.value || 'Receipt';
      link.download = `CSC_Bill_${billNo}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast("Bill image downloaded successfully!", "success");
    });
  }
};
