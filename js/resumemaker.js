/**
 * VUO CSC HELP - Resume Maker & Bio-Data Generator
 * Comprehensive multi-template CV builder with live A4 preview and 1-click PDF download
 */

const VUO_RESUMEMAKER = {
  template: 'modern', // 'modern', 'classic', 'minimal', 'biodata'
  photoDataUrl: null,
  educations: [],
  experiences: [],

  init() {
    this.initDefaultData();
    this.bindEvents();
    this.renderEducationRows();
    this.renderExperienceRows();
    this.updatePreview();
  },

  initDefaultData() {
    this.educations = [
      { degree: "Bachelor of Arts (B.A)", school: "Utkal University, Bhubaneswar", year: "2022", score: "72.5%" },
      { degree: "+2 Arts / Intermediate", school: "BJB Higher Secondary School", year: "2019", score: "76.0%" },
      { degree: "Matriculation (10th)", school: "Govt High School, Salepur", year: "2017", score: "81.2%" }
    ];

    this.experiences = [
      { role: "CSC Center Operator / VLE", company: "Odisha Digital Seva Kendra", period: "2022 - Present", desc: "Delivering government citizen services, e-District certificates, PAN cards, and banking AEPS cash transactions." }
    ];
  },

  bindEvents() {
    // Template Selector
    document.querySelectorAll('.resume-template-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.resume-template-btn').forEach(b => b.classList.remove('ring-2', 'ring-sky-500', 'bg-sky-50'));
        const target = e.currentTarget;
        target.classList.add('ring-2', 'ring-sky-500', 'bg-sky-50');
        this.template = target.getAttribute('data-template');
        this.updatePreview();
      });
    });

    // Form input listeners
    const ids = [
      'resFullName', 'resJobTitle', 'resPhone', 'resEmail', 'resAddress', 'resObjective',
      'resSkills', 'resCertifications', 'resLanguages', 'resDob', 'resGender', 'resFather', 'resPlace'
    ];

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => this.updatePreview());
    });

    // Photo input
    const photoInput = document.getElementById('resPhotoInput');
    if (photoInput) {
      photoInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            this.photoDataUrl = ev.target.result;
            this.updatePreview();
          };
          reader.readAsDataURL(e.target.files[0]);
        }
      });
    }

    // Add Education button
    const addEduBtn = document.getElementById('resAddEduBtn');
    if (addEduBtn) {
      addEduBtn.addEventListener('click', () => {
        this.educations.push({ degree: "Degree / Course", school: "College / Board", year: "2024", score: "75%" });
        this.renderEducationRows();
        this.updatePreview();
      });
    }

    // Add Experience button
    const addExpBtn = document.getElementById('resAddExpBtn');
    if (addExpBtn) {
      addExpBtn.addEventListener('click', () => {
        this.experiences.push({ role: "Job Title", company: "Company / Shop", period: "2023 - 2024", desc: "Brief description of responsibilities" });
        this.renderExperienceRows();
        this.updatePreview();
      });
    }
  },

  renderEducationRows() {
    const container = document.getElementById('resEduContainer');
    if (!container) return;
    container.innerHTML = '';

    this.educations.forEach((edu, idx) => {
      const div = document.createElement('div');
      div.className = 'grid grid-cols-1 md:grid-cols-4 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg mb-2 relative';
      div.innerHTML = `
        <div>
          <label class="text-[11px] text-slate-500 font-semibold">Degree / Exam</label>
          <input type="text" value="${edu.degree}" class="w-full text-xs px-2 py-1 border border-slate-200 rounded" 
            oninput="VUO_RESUMEMAKER.updateEdu(${idx}, 'degree', this.value)" />
        </div>
        <div>
          <label class="text-[11px] text-slate-500 font-semibold">School / University</label>
          <input type="text" value="${edu.school}" class="w-full text-xs px-2 py-1 border border-slate-200 rounded" 
            oninput="VUO_RESUMEMAKER.updateEdu(${idx}, 'school', this.value)" />
        </div>
        <div>
          <label class="text-[11px] text-slate-500 font-semibold">Passing Year</label>
          <input type="text" value="${edu.year}" class="w-full text-xs px-2 py-1 border border-slate-200 rounded" 
            oninput="VUO_RESUMEMAKER.updateEdu(${idx}, 'year', this.value)" />
        </div>
        <div class="flex items-end gap-1">
          <div class="flex-1">
            <label class="text-[11px] text-slate-500 font-semibold">% / CGPA</label>
            <input type="text" value="${edu.score}" class="w-full text-xs px-2 py-1 border border-slate-200 rounded" 
              oninput="VUO_RESUMEMAKER.updateEdu(${idx}, 'score', this.value)" />
          </div>
          <button type="button" onclick="VUO_RESUMEMAKER.removeEdu(${idx})" class="p-1 text-rose-500 hover:text-rose-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      `;
      container.appendChild(div);
    });
  },

  updateEdu(idx, key, val) {
    if (this.educations[idx]) {
      this.educations[idx][key] = val;
      this.updatePreview();
    }
  },

  removeEdu(idx) {
    this.educations.splice(idx, 1);
    this.renderEducationRows();
    this.updatePreview();
  },

  renderExperienceRows() {
    const container = document.getElementById('resExpContainer');
    if (!container) return;
    container.innerHTML = '';

    this.experiences.forEach((exp, idx) => {
      const div = document.createElement('div');
      div.className = 'p-2.5 bg-slate-50 border border-slate-200 rounded-lg mb-2 relative space-y-1.5';
      div.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label class="text-[11px] text-slate-500 font-semibold">Job Title / Designation</label>
            <input type="text" value="${exp.role}" class="w-full text-xs px-2 py-1 border border-slate-200 rounded" 
              oninput="VUO_RESUMEMAKER.updateExp(${idx}, 'role', this.value)" />
          </div>
          <div>
            <label class="text-[11px] text-slate-500 font-semibold">Company / Shop Name</label>
            <input type="text" value="${exp.company}" class="w-full text-xs px-2 py-1 border border-slate-200 rounded" 
              oninput="VUO_RESUMEMAKER.updateExp(${idx}, 'company', this.value)" />
          </div>
          <div class="flex items-end gap-1">
            <div class="flex-1">
              <label class="text-[11px] text-slate-500 font-semibold">Period / Duration</label>
              <input type="text" value="${exp.period}" class="w-full text-xs px-2 py-1 border border-slate-200 rounded" 
                oninput="VUO_RESUMEMAKER.updateExp(${idx}, 'period', this.value)" />
            </div>
            <button type="button" onclick="VUO_RESUMEMAKER.removeExp(${idx})" class="p-1 text-rose-500 hover:text-rose-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </div>
        <div>
          <label class="text-[11px] text-slate-500 font-semibold">Key Responsibilities / Description</label>
          <input type="text" value="${exp.desc}" class="w-full text-xs px-2 py-1 border border-slate-200 rounded" 
            oninput="VUO_RESUMEMAKER.updateExp(${idx}, 'desc', this.value)" />
        </div>
      `;
      container.appendChild(div);
    });
  },

  updateExp(idx, key, val) {
    if (this.experiences[idx]) {
      this.experiences[idx][key] = val;
      this.updatePreview();
    }
  },

  removeExp(idx) {
    this.experiences.splice(idx, 1);
    this.renderExperienceRows();
    this.updatePreview();
  },

  updatePreview() {
    const name = document.getElementById('resFullName')?.value || "Rakesh Kumar Jena";
    const jobTitle = document.getElementById('resJobTitle')?.value || "Computer Operator & Citizen Service Associate";
    const phone = document.getElementById('resPhone')?.value || "+91 98612 34567";
    const email = document.getElementById('resEmail')?.value || "rakesh.jena@email.com";
    const address = document.getElementById('resAddress')?.value || "At/PO: Salepur, Cuttack, Odisha - 754202";
    const objective = document.getElementById('resObjective')?.value || "Hardworking and customer-oriented professional with strong computer literacy and expertise in CSC e-governance services, seeking a challenging position to deliver exceptional digital services.";
    const skills = document.getElementById('resSkills')?.value.split(',').map(s => s.trim()).filter(Boolean) || ["MS Office & Excel", "Internet & Web Portals", "Document Scanning & OCR", "Fast Odia & English Typing", "Customer Assistance"];
    const certs = document.getElementById('resCertifications')?.value.split(',').map(s => s.trim()).filter(Boolean) || ["DCA (Diploma in Computer Applications)", "CSC Academy VLE Certified", "BCC (Basic Computer Course)"];
    const languages = document.getElementById('resLanguages')?.value || "Odia (Native), English, Hindi";
    const dob = document.getElementById('resDob')?.value || "15-May-2000";
    const gender = document.getElementById('resGender')?.value || "Male";
    const father = document.getElementById('resFather')?.value || "Suresh Chandra Jena";
    const place = document.getElementById('resPlace')?.value || "Cuttack";

    const previewContainer = document.getElementById('resumeA4Preview');
    if (!previewContainer) return;

    const photoHtml = this.photoDataUrl ? 
      `<img src="${this.photoDataUrl}" class="w-24 h-28 object-cover rounded border-2 border-slate-300 shadow-sm" />` :
      `<div class="w-24 h-28 bg-slate-100 border-2 border-dashed border-slate-300 rounded flex flex-col items-center justify-center text-slate-400 text-[10px] text-center p-1"><span>Passport Photo</span></div>`;

    if (this.template === 'modern') {
      // Template 1: Modern Navy & Cyan Accent
      previewContainer.innerHTML = `
        <div class="p-8 text-slate-800 font-sans text-xs bg-white min-h-[950px] flex flex-col justify-between">
          <div>
            <!-- Header -->
            <div class="flex justify-between items-start pb-5 border-b-2 border-sky-600">
              <div>
                <h1 class="text-2xl font-black text-slate-900 tracking-tight">${name.toUpperCase()}</h1>
                <p class="text-sm font-bold text-sky-700 uppercase mt-0.5">${jobTitle}</p>
                <div class="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600 mt-2">
                  <span>📱 ${phone}</span>
                  <span>✉️ ${email}</span>
                  <span>📍 ${address}</span>
                </div>
              </div>
              <div>${photoHtml}</div>
            </div>

            <!-- Objective -->
            <div class="mt-4 resume-section" style="break-inside: avoid; page-break-inside: avoid;">
              <h2 class="text-xs font-black uppercase text-sky-800 tracking-wider bg-sky-50 px-2 py-1 rounded border-l-4 border-sky-600">Career Objective</h2>
              <p class="mt-2 text-slate-700 leading-relaxed text-[11.5px]">${objective}</p>
            </div>

            <!-- Education -->
            <div class="mt-4 resume-section" style="break-inside: avoid; page-break-inside: avoid;">
              <h2 class="text-xs font-black uppercase text-sky-800 tracking-wider bg-sky-50 px-2 py-1 rounded border-l-4 border-sky-600">Educational Qualification</h2>
              <table class="w-full mt-2 text-left border-collapse">
                <thead>
                  <tr class="bg-slate-100 text-slate-700 font-bold text-[11px]">
                    <th class="p-1.5 border border-slate-200">Degree / Exam</th>
                    <th class="p-1.5 border border-slate-200">School / Board / University</th>
                    <th class="p-1.5 border border-slate-200 text-center">Year</th>
                    <th class="p-1.5 border border-slate-200 text-right">% / CGPA</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.educations.map(e => `
                    <tr class="border-b border-slate-200 text-[11px]">
                      <td class="p-1.5 font-semibold text-slate-900 border border-slate-200">${e.degree}</td>
                      <td class="p-1.5 border border-slate-200">${e.school}</td>
                      <td class="p-1.5 text-center border border-slate-200">${e.year}</td>
                      <td class="p-1.5 text-right font-bold text-slate-800 border border-slate-200">${e.score}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Experience -->
            ${this.experiences.length > 0 ? `
              <div class="mt-4 resume-section" style="break-inside: avoid; page-break-inside: avoid;">
                <h2 class="text-xs font-black uppercase text-sky-800 tracking-wider bg-sky-50 px-2 py-1 rounded border-l-4 border-sky-600">Work Experience</h2>
                <div class="mt-2 space-y-2">
                  ${this.experiences.map(exp => `
                    <div class="border-l-2 border-slate-300 pl-3 mb-2">
                      <div class="flex justify-between font-bold text-slate-900 text-[11.5px]">
                        <span>${exp.role} — <span class="text-sky-700 font-semibold">${exp.company}</span></span>
                        <span class="text-slate-500 text-[11px]">${exp.period}</span>
                      </div>
                      <p class="text-slate-600 text-[11px] mt-0.5">${exp.desc}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Skills & Certifications -->
            <div class="grid grid-cols-2 gap-4 mt-4 resume-section" style="break-inside: avoid; page-break-inside: avoid;">
              <div>
                <h2 class="text-xs font-black uppercase text-sky-800 tracking-wider bg-sky-50 px-2 py-1 rounded border-l-4 border-sky-600">Key Skills</h2>
                <div class="flex flex-wrap gap-1.5 mt-2">
                  ${skills.map(s => `<span class="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 font-semibold rounded text-[10.5px]">${s}</span>`).join('')}
                </div>
              </div>
              <div>
                <h2 class="text-xs font-black uppercase text-sky-800 tracking-wider bg-sky-50 px-2 py-1 rounded border-l-4 border-sky-600">Certifications</h2>
                <ul class="list-disc list-inside mt-2 text-[11px] text-slate-700 space-y-1">
                  ${certs.map(c => `<li>${c}</li>`).join('')}
                </ul>
              </div>
            </div>

            <!-- Personal Profile -->
            <div class="mt-4 resume-section" style="break-inside: avoid; page-break-inside: avoid;">
              <h2 class="text-xs font-black uppercase text-sky-800 tracking-wider bg-sky-50 px-2 py-1 rounded border-l-4 border-sky-600">Personal Details</h2>
              <div class="grid grid-cols-2 gap-x-6 gap-y-1 mt-2 text-[11px] text-slate-700">
                <div><strong>Father's Name:</strong> ${father}</div>
                <div><strong>Date of Birth:</strong> ${dob}</div>
                <div><strong>Gender:</strong> ${gender}</div>
                <div><strong>Languages Known:</strong> ${languages}</div>
              </div>
            </div>
          </div>

          <!-- Declaration -->
          <div class="mt-6 pt-3 border-t border-slate-200 resume-section" style="break-inside: avoid; page-break-inside: avoid;">
            <p class="text-[10px] text-slate-500 italic">I hereby declare that all the information provided above is true and authentic to the best of my knowledge.</p>
            <div class="flex justify-between items-end mt-4 text-[11px]">
              <div>
                <p><strong>Place:</strong> ${place}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
              </div>
              <div class="text-center">
                <div class="w-32 border-b border-slate-400 mb-1"></div>
                <p class="font-bold text-slate-800">(${name})</p>
                <p class="text-[10px] text-slate-500">Signature</p>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Classic & Bio-Data Formats
      previewContainer.innerHTML = `
        <div class="p-8 text-slate-900 font-serif text-xs bg-white min-h-[950px] flex flex-col justify-between">
          <div>
            <div class="text-center border-b pb-3 mb-4 resume-section" style="break-inside: avoid; page-break-inside: avoid;">
              <h1 class="text-xl font-bold tracking-wide uppercase">CURRICULUM VITAE</h1>
              <h2 class="text-lg font-bold text-slate-800 mt-1">${name}</h2>
              <p class="text-[11px] text-slate-600">${address} | Mob: ${phone} | Email: ${email}</p>
            </div>

            <div class="space-y-4">
              <div class="resume-section" style="break-inside: avoid; page-break-inside: avoid;">
                <h3 class="font-bold text-xs uppercase border-b border-slate-300 pb-0.5">Career Objective</h3>
                <p class="mt-1 text-[11px] leading-relaxed text-slate-700">${objective}</p>
              </div>

              <div class="resume-section" style="break-inside: avoid; page-break-inside: avoid;">
                <h3 class="font-bold text-xs uppercase border-b border-slate-300 pb-0.5">Academic Credentials</h3>
                <table class="w-full mt-1 text-left border text-[11px]">
                  <tr class="bg-slate-100 font-bold">
                    <th class="border p-1">Qualification</th>
                    <th class="border p-1">Institution</th>
                    <th class="border p-1 text-center">Year</th>
                    <th class="border p-1 text-right">Marks</th>
                  </tr>
                  ${this.educations.map(e => `
                    <tr>
                      <td class="border p-1 font-semibold">${e.degree}</td>
                      <td class="border p-1">${e.school}</td>
                      <td class="border p-1 text-center">${e.year}</td>
                      <td class="border p-1 text-right">${e.score}</td>
                    </tr>
                  `).join('')}
                </table>
              </div>

              <div class="resume-section" style="break-inside: avoid; page-break-inside: avoid;">
                <h3 class="font-bold text-xs uppercase border-b border-slate-300 pb-0.5">Technical & Professional Skills</h3>
                <p class="mt-1 text-[11px] text-slate-700">${skills.join(', ')}</p>
              </div>

              <div class="resume-section" style="break-inside: avoid; page-break-inside: avoid;">
                <h3 class="font-bold text-xs uppercase border-b border-slate-300 pb-0.5">Personal Details</h3>
                <div class="grid grid-cols-2 gap-2 mt-1 text-[11px]">
                  <div>Father's Name: ${father}</div>
                  <div>Date of Birth: ${dob}</div>
                  <div>Gender: ${gender}</div>
                  <div>Languages: ${languages}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-2 border-t text-[11px] resume-section" style="break-inside: avoid; page-break-inside: avoid;">
            <p class="text-[10px] text-slate-600">Declaration: The above particulars are correct to the best of my knowledge.</p>
            <div class="flex justify-between items-end mt-4">
              <div>
                <p>Date: ${new Date().toLocaleDateString('en-GB')}</p>
                <p>Place: ${place}</p>
              </div>
              <div class="text-center font-bold">
                <div class="w-32 border-b border-slate-500 mb-1"></div>
                <p>${name}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },

  printResume() {
    const el = document.getElementById('resumeA4Preview');
    if (!el) return;

    const printWin = window.open('', '_blank');
    if (!printWin) {
      showToast("Please allow popups in your browser to print directly.", "warning");
      return;
    }

    const name = document.getElementById('resFullName')?.value || 'Resume';
    const resumeHtml = el.innerHTML;

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Resume - ${name}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css">
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm 18mm 15mm 18mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            background: #ffffff;
            color: #1e293b;
            margin: 0;
            padding: 0;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          .resume-print-root {
            width: 100%;
            max-width: 180mm;
            margin: 0 auto;
            padding: 5mm 0;
          }
          .resume-section {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 14px;
          }
          table {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          @media screen {
            body {
              padding: 25px;
            }
          }
        </style>
      </head>
      <body>
        <div class="resume-print-root">
          ${resumeHtml}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 350);
          };
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  },

  downloadPdf() {
    const el = document.getElementById('resumeA4Preview');
    if (!el || !window.html2canvas || !window.jspdf) {
      showToast("PDF generator library loading, please try again in a moment.", "info");
      return;
    }

    showToast("Generating Multi-Page Resume PDF with Margins...", "info");

    html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollY: 0,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight
    }).then(canvas => {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 is 210 x 297 mm
      
      // Professional Margins on ALL 4 sides of every page:
      const marginX = 12; // 12mm Left & Right Margin
      const marginTop = 15; // 15mm Top Margin
      const marginBottom = 15; // 15mm Bottom Margin

      const pdfPageWidth = 210;
      const pdfPageHeight = 297;
      const printableWidth = pdfPageWidth - (2 * marginX); // 186mm
      const printableHeight = pdfPageHeight - marginTop - marginBottom; // 267mm

      const canvasWidth = canvas.width;
      const sliceHeightPx = Math.floor(canvasWidth * (printableHeight / printableWidth));
      const totalSlices = Math.ceil(canvas.height / sliceHeightPx);

      for (let i = 0; i < totalSlices; i++) {
        const sourceY = i * sliceHeightPx;
        const currentSliceHeight = Math.min(sliceHeightPx, canvas.height - sourceY);

        if (currentSliceHeight <= 5) break;

        // Create isolated slice canvas for this specific page
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvasWidth;
        sliceCanvas.height = currentSliceHeight;
        const sliceCtx = sliceCanvas.getContext('2d');

        // White page background
        sliceCtx.fillStyle = '#ffffff';
        sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        sliceCtx.drawImage(canvas, 0, sourceY, canvasWidth, currentSliceHeight, 0, 0, canvasWidth, currentSliceHeight);

        const sliceImgData = sliceCanvas.toDataURL('image/jpeg', 0.98);
        const drawnHeightMm = (currentSliceHeight * printableWidth) / canvasWidth;

        if (i > 0) {
          pdf.addPage('a4', 'p');
        }

        // Draw slice with precise top, bottom and side margins
        pdf.addImage(sliceImgData, 'JPEG', marginX, marginTop, printableWidth, drawnHeightMm);
      }

      const name = document.getElementById('resFullName')?.value || 'Resume';
      const cleanName = name.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`Resume_${cleanName}.pdf`);
      showToast("Resume PDF downloaded with 15mm bottom & top margins!", "success");
    }).catch(err => {
      console.error(err);
      showToast("Error generating PDF. Please use the Print A4 button.", "error");
    });
  }
};
