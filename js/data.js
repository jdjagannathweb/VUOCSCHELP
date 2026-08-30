/**
 * VUO CSC HELP - Seed Database & Global Constants
 * Odisha Districts, Government Portals, Training Resources, Announcements
 */

const VUO_DATA = {
  // All 30 Districts of Odisha
  districts: [
    { name: "Angul", blocks: ["Angul", "Athmallik", "Banarpal", "Chhendipada", "Kaniha", "Kishorenagar", "Pallahara", "Talcher"] },
    { name: "Balangir", blocks: ["Agalpur", "Balangir", "Belpara", "Deogaon", "Gudvella", "Khaprakhol", "Loisingha", "Muribahal", "Patnagarh", "Puintala", "Saintala", "Titilagarh", "Turekela"] },
    { name: "Balasore", blocks: ["Bahanaga", "Balasore", "Baliapal", "Basta", "Bhograi", "Jaleswar", "Khaira", "Nilgiri", "Oupada", "Remuna", "Simulia", "Soro"] },
    { name: "Bargarh", blocks: ["Ambabhona", "Attabira", "Barpali", "Bargarh", "Bhatli", "Bheden", "Bijepur", "Gaisilet", "Jharbandh", "Padampur", "Paikmal", "Sohela"] },
    { name: "Bhadrak", blocks: ["Basudevpur", "Bhadrak", "Bhandaripokhari", "Bonth", "Chandabali", "Dhamnagar", "Tihidi"] },
    { name: "Boudh", blocks: ["Boudh", "Harbhanga", "Kantamal"] },
    { name: "Cuttack", blocks: ["Athagarh", "Banki", "Baramba", "Barang", "Cuttack Sadar", "Kantapada", "Mahanga", "Narsinghpur", "Niali", "Nischintakoili", "Salepur", "Tangi-Choudwar", "Tigiria"] },
    { name: "Deogarh", blocks: ["Barkote", "Reamal", "Tileibani"] },
    { name: "Dhenkanal", blocks: ["Bhuban", "Dhenkanal", "Gondia", "Hindol", "Kamakhyanagar", "Kankadahad", "Odapada", "Parjang"] },
    { name: "Gajapati", blocks: ["Guma", "Kashinagar", "Mohana", "Nuagada", "Rayagada", "R.Udayagiri"] },
    { name: "Ganjam", blocks: ["Aska", "Bellaguntha", "Bhanjanagar", "Buguda", "Chhatrapur", "Chikiti", "Digapahandi", "Ganjam", "Hinjilicut", "Jagannathprasad", "Kabisuryanagar", "Khallikote", "Kukudakhandi", "Patrapur", "Polasara", "Purushottampur", "Rangeilunda", "Sanakhemundi", "Sheragada", "Surada"] },
    { name: "Jagatsinghpur", blocks: ["Balikuda", "Biridi", "Erasama", "Jagatsinghpur", "Kujang", "Naugaon", "Raghunathpur", "Tirtol"] },
    { name: "Jajpur", blocks: ["Badachana", "Bari", "Binjharpur", "Danagadi", "Dharmasala", "Jajpur", "Korei", "Rasulpur", "Sukinda"] },
    { name: "Jharsuguda", blocks: ["Jharsuguda", "Kirirmira", "Kolabira", "Laikera", "Lakhanpur"] },
    { name: "Kalahandi", blocks: ["Bhawanipatna", "Dharamgarh", "Golamunda", "Jaipatna", "Junagarh", "Kalampur", "Karlamunda", "Kesinga", "Kokasara", "Lanjigarh", "Madanpur Rampur", "Narla", "Thuamul Rampur"] },
    { name: "Kandhamal", blocks: ["Balliguda", "Chakapad", "Daringbadi", "G.Udayagiri", "K.Nuagaon", "Khajuripada", "Kotagarh", "Phiringia", "Phulbani", "Raikia", "Tikabali", "Tumudibandha"] },
    { name: "Kendrapara", blocks: ["Aul", "Derabish", "Garadpur", "Kendrapara", "Mahakalapara", "Marsaghai", "Pattamundai", "Rajkanika", "Rajnagar"] },
    { name: "Kendujhar (Keonjhar)", blocks: ["Anandapur", "Banspal", "Champua", "Ghashipura", "Ghatgaon", "Harichandanpur", "Hatadihi", "Jhumpura", "Joda", "Keonjhar", "Patna", "Saharpada", "Telkoi"] },
    { name: "Khordha", blocks: ["Balianta", "Balipatna", "Banapur", "Begunia", "Bhubaneswar", "Bolagarh", "Chilika", "Jatni", "Khordha", "Tangi"] },
    { name: "Koraput", blocks: ["Bandhugaon", "Baipariguda", "Borigumma", "Dasamantapur", "Jeypore", "Koraput", "Kotpad", "Kundra", "Lamtaput", "Laxmipur", "Nandapur", "Narayanpatna", "Pottangi", "Semiliguda"] },
    { name: "Malkangiri", blocks: ["Chitrakonda", "Kalimela", "Khairput", "Korkunda", "Malkangiri", "Mathili", "Podia"] },
    { name: "Mayurbhanj", blocks: ["Badasahi", "Bahalda", "Bangiriposi", "Baripada", "Betnoti", "Bijatala", "Bisoi", "Gopabandhunagar", "Jamda", "Jharpokharia", "Kaptipada", "Karanjia", "Khunta", "Kuliana", "Kusumi", "Morada", "Rairangpur", "Raruan", "Rasgovindpur", "Samakhunta", "Saraskana", "Sukruli", "Suliapada", "Tiring", "Udala"] },
    { name: "Nabarangpur", blocks: ["Chandahandi", "Dabugam", "Jharigam", "Kodinga", "Kosagumuda", "Nabarangpur", "Nandahandi", "Papdahandi", "Raighar", "Tentulikhunti", "Umerkote"] },
    { name: "Nayagarh", blocks: ["Bhapur", "Daspalla", "Gania", "Khandapada", "Nayagarh", "Nuagaon", "Odagaon", "Ranpur"] },
    { name: "Nuapada", blocks: ["Boden", "Khariar", "Komna", "Nuapada", "Sinapali"] },
    { name: "Puri", blocks: ["Astaranga", "Brahmagiri", "Delanga", "Gop", "Kakatpur", "Kanas", "Krushnaprasad", "Nimapada", "Pipili", "Puri Sadar", "Satyabadi"] },
    { name: "Rayagada", blocks: ["Bishamkatak", "Chandrapur", "Gudari", "Gunupur", "Kalyansinghpur", "Kashipur", "Kolnara", "Muniguda", "Padmapur", "Ramanaguda", "Rayagada"] },
    { name: "Sambalpur", blocks: ["Bamra", "Dhankauda", "Jamankira", "Jujomura", "Kochinda", "Maneswar", "Naktideul", "Rairakhol", "Rengali"] },
    { name: "Subarnapur (Sonepur)", blocks: ["Birmaharajpur", "Dunguripali", "Tarbha", "Sonepur", "Ullunda", "Binka"] },
    { name: "Sundargarh", blocks: ["Bargaon", "Bisra", "Bonaigarh", "Gurundia", "Hemgir", "Koida", "Kuanrmunda", "Kutra", "Lathikata", "Lahunipara", "Lephripara", "Nuagaon", "Rajgangpur", "Subdega", "Sundargarh", "Tangarpali"] }
  ],

  // Important Portal Links
  links: [
    // CSC Central
    {
      id: "csc-1",
      title: "Digital Seva Portal",
      titleOdia: "ଡିଜିଟାଲ ସେବା ପୋର୍ଟାଲ",
      url: "https://digitalseva.csc.gov.in/",
      category: "csc",
      categoryName: "CSC Services",
      desc: "Official CSC Login for VLEs for all central & state services",
      important: true,
      icon: "laptop"
    },
    {
      id: "csc-2",
      title: "CSC Registration Portal",
      titleOdia: "CSC ପଞ୍ଜୀକରଣ ପୋର୍ଟାଲ",
      url: "https://register.csc.gov.in/",
      category: "csc",
      categoryName: "CSC Services",
      desc: "Apply for new VLE, check application status, credentials update",
      important: true,
      icon: "user-plus"
    },
    {
      id: "csc-3",
      title: "DigiPay Banking & AEPS",
      titleOdia: "ଡିଜିପେ ବ୍ୟାଙ୍କିଙ୍ଗ ଏବଂ AEPS",
      url: "https://digipay.csccloud.in/",
      category: "csc",
      categoryName: "CSC Services",
      desc: "Micro ATM, AEPS Cash Withdrawal, Balance Enquiry & DMT",
      important: true,
      icon: "credit-card"
    },
    {
      id: "csc-4",
      title: "CSC Academy / Tele-Law",
      titleOdia: "CSC ଏକାଡେମୀ / ଟେଲି-ଲ",
      url: "https://cscacademy.org/",
      category: "csc",
      categoryName: "CSC Services",
      desc: "Skill courses, certification exams, Tele-Law legal consultations",
      important: false,
      icon: "graduation-cap"
    },
    {
      id: "csc-5",
      title: "CSC Grameen e-Store",
      titleOdia: "CSC ଗ୍ରାମୀଣ ଇ-ଷ୍ଟୋର",
      url: "https://cscestore.in/",
      category: "csc",
      categoryName: "CSC Services",
      desc: "Rural eCommerce distribution and merchant portal",
      important: false,
      icon: "shopping-bag"
    },

    // Odisha Government Portals
    {
      id: "od-1",
      title: "Subhadra Yojana Portal",
      titleOdia: "ସୁଭଦ୍ରା ଯୋଜନା ପୋର୍ଟାଲ (Odisha)",
      url: "https://subhadra.odisha.gov.in/",
      category: "gov",
      categoryName: "Government Services",
      desc: "Odisha Govt financial empowerment scheme for women (VLE application & status check)",
      important: true,
      icon: "award"
    },
    {
      id: "od-2",
      title: "Odisha One Citizen Portal",
      titleOdia: "ଓଡ଼ିଶା ୱାନ ନାଗରିକ ପୋର୍ଟାଲ",
      url: "https://odishaone.gov.in/",
      category: "gov",
      categoryName: "Government Services",
      desc: "Single window portal for state citizen services, utilities & certificates",
      important: true,
      icon: "grid"
    },
    {
      id: "od-3",
      title: "e-District Odisha (Edistrict)",
      titleOdia: "ଇ-ଡିଷ୍ଟ୍ରିକ୍ଟ ଓଡ଼ିଶା",
      url: "https://edistrict.odisha.gov.in/",
      category: "gov",
      categoryName: "Government Services",
      desc: "Apply for Caste, Income, Residence, Legal Heir, SEBC & OBC Certificates",
      important: true,
      icon: "file-text"
    },
    {
      id: "od-4",
      title: "Bhulekh Odisha (Land Records / RoR)",
      titleOdia: "ଭୂଲେଖ ଓଡ଼ିଶା (ଜମି ପଟ୍ଟା / RoR)",
      url: "http://bhulekh.ori.nic.in/",
      category: "gov",
      categoryName: "Government Services",
      desc: "Search, view and print RoR Land Records & Map for all Tahasils",
      important: true,
      icon: "map"
    },
    {
      id: "od-5",
      title: "Madhu Babu Pension Yojana (MBPY / SSEPD)",
      titleOdia: "ମଧୁବାବୁ ପେନସନ ଯୋଜନା (SSEPD)",
      url: "https://ssepd.odisha.gov.in/",
      category: "gov",
      categoryName: "Government Services",
      desc: "Social security pension application for Old Age, Widow & Disability",
      important: false,
      icon: "heart"
    },
    {
      id: "od-6",
      title: "State Scholarship Portal Odisha",
      titleOdia: "ରାଜ୍ୟ ଛାତ୍ରବୃତ୍ତି ପୋର୍ଟାଲ ଓଡ଼ିଶା",
      url: "https://scholarship.odisha.gov.in/",
      category: "gov",
      categoryName: "Government Services",
      desc: "Post-matric and pre-matric scholarships for SC/ST/OBC/SEBC students",
      important: false,
      icon: "book-open"
    },
    {
      id: "od-7",
      title: "e-PDS Odisha (Ration Card Portal)",
      titleOdia: "ଇ-ପିଡିଏସ ଓଡ଼ିଶା (ରାସନ କାର୍ଡ)",
      url: "http://pdsodisha.gov.in/",
      category: "gov",
      categoryName: "Government Services",
      desc: "NFSA / SFSS Ration card beneficiary list, apply & e-KYC status",
      important: true,
      icon: "archive"
    },
    {
      id: "od-8",
      title: "Kalia Portal / Krushak Odisha",
      titleOdia: "କାଳିଆ ଯୋଜନା / କୃଷକ ଓଡ଼ିଶା",
      url: "https://kalia.odisha.gov.in/",
      category: "gov",
      categoryName: "Government Services",
      desc: "Farmer income support scheme, e-KYC and beneficiary verification",
      important: false,
      icon: "sun"
    },
    {
      id: "od-9",
      title: "Sarathi Parivahan (Driving Licence Odisha)",
      titleOdia: "ସାରଥୀ ପରିବହନ (ଡ୍ରାଇଭିଂ ଲାଇସେନ୍ସ)",
      url: "https://parivahan.gov.in/parivahan/",
      category: "gov",
      categoryName: "Government Services",
      desc: "Learning License, Driving License, Vehicle RC services",
      important: false,
      icon: "truck"
    },

    // Banking & Insurance
    {
      id: "bnk-1",
      title: "PM-KISAN Samman Nidhi",
      titleOdia: "ପିଏମ କିଷାନ ସମ୍ମାନ ନିଧି",
      url: "https://pmkisan.gov.in/",
      category: "banking",
      categoryName: "Banking & Insurance",
      desc: "Beneficiary status, Aadhaar OTP/Biometric e-KYC, New farmer registration",
      important: true,
      icon: "dollar-sign"
    },
    {
      id: "bnk-2",
      title: "UTI & NSDL PAN Portal (CSC)",
      titleOdia: "UTI / NSDL PAN କାର୍ଡ ପୋର୍ଟାଲ",
      url: "https://www.psaonline.utiitsl.com/psaonline/",
      category: "banking",
      categoryName: "Banking & Insurance",
      desc: "Apply for new PAN Card (Form 49A) & PAN correction / re-print",
      important: true,
      icon: "id-card"
    },
    {
      id: "bnk-3",
      title: "PM Suraksha / Jeevan Jyoti Bima",
      titleOdia: "ପିଏମ ସୁରକ୍ଷା ଓ ଜୀବନ ଜ୍ୟୋତି ବୀମା",
      url: "https://www.jansuraksha.gov.in/",
      category: "banking",
      categoryName: "Banking & Insurance",
      desc: "PMSBY, PMJJBY, APY Atal Pension Yojana insurance rules and claims",
      important: false,
      icon: "shield"
    },

    // VUO CSC HELP Official
    {
      id: "vuo-1",
      title: "VUO CSC HELP Official Portal",
      titleOdia: "VUO CSC HELP ଅଫିସିଆଲ ପୋର୍ଟାଲ",
      url: "#",
      category: "vuo",
      categoryName: "VUO CSC HELP",
      desc: "Digital assistance portal, tools, state updates and resources for CSC VLEs",
      important: true,
      icon: "flag"
    },
    {
      id: "vuo-2",
      title: "VUO CSC HELP Support & District Coordinators",
      titleOdia: "VUO CSC ସହାୟତା ଓ ଜିଲ୍ଲା ସଂଯୋଜକ",
      url: "#contact",
      category: "vuo",
      categoryName: "VUO CSC HELP",
      desc: "Direct contact numbers: 9937037131 | Satyabadi, Puri, Odisha",
      important: true,
      icon: "phone-call"
    }
  ],

  // Training Videos
  trainingVideos: [
    {
      id: "tr-1",
      title: "Subhadra Yojana Online Form Fillup Complete Guide (VLE Guide)",
      titleOdia: "ସୁଭଦ୍ରା ଯୋଜନା ଫର୍ମ ଆବେଦନ ସମ୍ପୂର୍ଣ୍ଣ ପ୍ରଣାଳୀ",
      category: "Government Schemes",
      youtubeId: "dQw4w9WgXcQ", // Embed placeholder or tutorial
      desc: "Step-by-step guidance for CSC VLEs for seamless Subhadra scheme application, photo upload, and OTP verification.",
      duration: "14:20 min",
      views: "18.5K",
      badge: "Featured"
    },
    {
      id: "tr-2",
      title: "e-District Odisha: How to Apply Caste, Income & Residence Certificates",
      titleOdia: "ଇ-ଡିଷ୍ଟ୍ରିକ୍ଟ ଓଡ଼ିଶା: ଜାତି, ଆୟ ଏବଂ ବାସସ୍ଥାନ ପ୍ରମାଣପତ୍ର ଆବେଦନ",
      category: "e-Governance",
      youtubeId: "dQw4w9WgXcQ",
      desc: "Detailed walkthrough of RoR document upload, land verification, self-declaration format, and certificate issuance.",
      duration: "19:45 min",
      views: "24.1K",
      badge: "Popular"
    },
    {
      id: "tr-3",
      title: "DigiPay & Micro-ATM Setup, Transaction Errors and Settlement Guide",
      titleOdia: "ଡିଜିପେ ଏବଂ ମାଇକ୍ରୋ-ATM ସେଟଅପ୍ ଓ ଟ୍ରାନଜାକ୍ସନ ସମାଧାନ",
      category: "Banking",
      youtubeId: "dQw4w9WgXcQ",
      desc: "Resolving 2FA biometric issues, DigiPay wallet cash-out to bank account, and daily reconciliation report.",
      duration: "12:10 min",
      views: "15.3K",
      badge: "Essential"
    },
    {
      id: "tr-4",
      title: "Mantra MFS100 / Morpho RD Service Driver Installation on Windows 10/11",
      titleOdia: "Mantra ଓ Morpho ଫିଙ୍ଗରପ୍ରିଣ୍ଟ ଡ୍ରାଇଭର ସେଟଅପ୍ ପ୍ରଣାଳୀ",
      category: "Technical Training",
      youtubeId: "dQw4w9WgXcQ",
      desc: "Complete driver installation, chrome flags setup, telemetry error fixes for all biometric devices.",
      duration: "08:50 min",
      views: "31.2K",
      badge: "Tech"
    },
    {
      id: "tr-5",
      title: "UTI / NSDL PAN Card Instant e-KYC 49A Application Process",
      titleOdia: "PAN କାର୍ଡ ତୁରନ୍ତ e-KYC ୪୯A ଆବେଦନ ନିୟମ",
      category: "CSC Training",
      youtubeId: "dQw4w9WgXcQ",
      desc: "Paperless PAN card generation with Aadhaar OTP and Biometric within 2 hours delivery of e-PAN.",
      duration: "11:30 min",
      views: "9.8K",
      badge: "CSC"
    },
    {
      id: "tr-6",
      title: "How to Increase Daily Income at CSC Centre: VLE Business Strategies",
      titleOdia: "CSC ସେଣ୍ଟରରୁ ଦୈନିକ ରୋଜଗାର ବୃଦ୍ଧି କରିବାର ଉପାୟ",
      category: "VLE Business",
      youtubeId: "dQw4w9WgXcQ",
      desc: "Best practices, customer management, high-margin services, and VUO CSC HELP tips.",
      duration: "16:05 min",
      views: "12.7K",
      badge: "Business"
    }
  ],

  // Latest Announcements / News Ticker
  announcements: [
    {
      id: "ann-1",
      text: "📢 VUO CSC HELP: All VLEs are requested to download their 2026 digital membership I-Card from the portal.",
      textOdia: "📢 VUO CSC HELP: ସମସ୍ତ VLE ନିଜର ୨୦୨୬ ଡିଜିଟାଲ ପରିଚୟ ପତ୍ର (I-Card) ପୋର୍ଟାଲରୁ ଡାଉନଲୋଡ଼ କରନ୍ତୁ।",
      date: "August 2026",
      urgent: true
    },
    {
      id: "ann-2",
      text: "🚀 New Feature: 8-Photo & 16-Photo A4 Pass Photo Print Maker is now live with 1-click background tinting!",
      textOdia: "🚀 ନୂତନ ଫିଚର: A4 ପାସପୋର୍ଟ ଫଟୋ ପ୍ରିଣ୍ଟ ମେକର ଏବେ ଲାଇଭ୍ ହୋଇଛି!",
      date: "August 2026",
      urgent: false
    },
    {
      id: "ann-3",
      text: "🔔 Subhadra Yojana Form submission ongoing across all CSC Kendra in Odisha — Check training videos for guidelines.",
      textOdia: "🔔 ସୁଭଦ୍ରା ଯୋଜନା ଆବେଦନ ଜାରି ରହିଛି — ସହାୟତା ପାଇଁ ଟ୍ରେନିଂ ଭିଡ଼ିଓ ଦେଖନ୍ତୁ।",
      date: "August 2026",
      urgent: true
    },
    {
      id: "ann-4",
      text: "📄 CSC Bill Maker now supports saving shop details and generating instant thermal & A4 customer receipts with QR.",
      textOdia: "📄 CSC ବିଲ୍ ମେକର ଦ୍ୱାରା ନିଜ ଦୋକାନ ନାମରେ ଗ୍ରାହକ ବିଲ୍ ତିଆରି କରନ୍ତୁ।",
      date: "August 2026",
      urgent: false
    }
  ],

  // Standard CSC Bill Services Presets
  billServices: [
    { name: "Aadhaar Card Color PVC Print & Lamination", rate: 50 },
    { name: "New PAN Card Application (Form 49A)", rate: 150 },
    { name: "PAN Card Correction / Duplicate", rate: 150 },
    { name: "e-District Caste / Income / Residence Certificate", rate: 60 },
    { name: "Subhadra Yojana Application & Document Upload", rate: 50 },
    { name: "Bhulekh Land RoR / Patta Print (Per Page)", rate: 20 },
    { name: "Electricity Bill Payment (Discom Odisha)", rate: 20 },
    { name: "PM Kisan Samman Nidhi e-KYC Biometric", rate: 30 },
    { name: "Ration Card e-KYC / Member Addition", rate: 40 },
    { name: "AEPS Cash Withdrawal Banking Service", rate: 20 },
    { name: "Fastag Recharge / New Fastag Issuance", rate: 100 },
    { name: "Passport Size Photograph (8 Copies Sheet)", rate: 50 },
    { name: "Passport Size Photograph (16 Copies Sheet)", rate: 80 },
    { name: "Police Clearance Certificate (PCC)", rate: 100 },
    { name: "State Scholarship Online Application", rate: 70 },
    { name: "Job Resume / Bio-Data Typing & Print", rate: 60 },
    { name: "Colour Document Scan & Email / PDF", rate: 20 },
    { name: "Black & White Xerox / Print (Per Page)", rate: 5 }
  ],

  // Sample Pre-registered VLE Members (for instant preview & test)
  sampleMembers: [
    {
      memberNo: "VUO-2026-OD-1082",
      cscId: "782910482910",
      fullName: "Jagannath Mohanty",
      mobile: "9937037131",
      email: "jdjagannath@gmail.com",
      district: "Puri",
      block: "Satyabadi",
      gp: "Satyabadi",
      status: "Active (Verified VLE)",
      designation: "VLE Coordinator",
      joiningDate: "12-Jan-2024",
      validity: "2026 - 2029",
      bloodGroup: "O+",
      passwordHash: "123456" // demo test
    },
    {
      memberNo: "VUO-2026-OD-2491",
      cscId: "654819201948",
      fullName: "Priyanka Sahoo",
      mobile: "9937037131",
      email: "jdjagannath@gmail.com",
      district: "Puri",
      block: "Satyabadi",
      gp: "Satyabadi",
      status: "Active (Verified VLE)",
      designation: "Active VLE Member",
      joiningDate: "05-May-2024",
      validity: "2026 - 2029",
      bloodGroup: "B+",
      passwordHash: "123456"
    }
  ]
};

// Initialize LocalStorage Data Store
function initVuoStore() {
  localStorage.setItem('vuo_members', JSON.stringify(VUO_DATA.sampleMembers));
  localStorage.setItem('vuo_links', JSON.stringify(VUO_DATA.links));
  localStorage.setItem('vuo_training', JSON.stringify(VUO_DATA.trainingVideos));
  localStorage.setItem('vuo_announcements', JSON.stringify(VUO_DATA.announcements));
  if (!localStorage.getItem('vuo_tickets')) {
    localStorage.setItem('vuo_tickets', JSON.stringify([]));
  }
}

initVuoStore();
