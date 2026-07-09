import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navbar & Footer
      "Home": "Home",
      "All Projects": "All Projects",
      "Categories": "Categories",
      "About": "About",
      "Admin Login": "Admin Login",
      "Solapur Municipal Corporation": "Solapur Municipal Corporation",
      "Government of Maharashtra": "Government of Maharashtra",
      "Quick Links": "Quick Links",
      "Contact Us": "Contact Us",
      "Address": "Rajwada Chowk, Solapur - 413002",
      "Phone": "Phone",
      "Email": "Email",
      "Contact SMC": "Contact SMC",
      "About this Portal": "About this Portal",
      "Footer About": "This is the official project tracking portal of Solapur Municipal Corporation. Citizens can track all civic development projects in real-time.",
      "Footer Copyright": "© 2024 Solapur Municipal Corporation | Maharashtra Government | All Rights Reserved",
      
      // Accessibility Bar
      "Font Size": "Font Size",
      "Spacing": "Spacing",
      "Normal": "Normal",
      "Wide": "Wide",
      "Theme": "Theme",
      "Light": "Light",
      "Dark": "Dark",
      "Read": "Read",
      "Pause": "Pause",
      "Resume": "Resume",
      "Stop": "Stop",

      // About Page
      "About SMC Project Tracker": "About SMC Project Tracker",
      "Our Mission": "Our Mission",
      "Mission Text": "The Solapur Municipal Corporation (SMC) is committed to transparency, efficiency, and citizen engagement. The SMC Project Tracker is an official initiative to provide citizens with real-time visibility into civic development projects happening across our city.",
      "What We Track": "What We Track",
      "What We Track Text": "This portal tracks all major infrastructure and civic projects, including but not limited to:",
      "Road Construction & Maintenance": "Road Construction & Maintenance",
      "Road Construction Text": "Improving city connectivity and safety.",
      "Water Supply Text": "Expanding and maintaining drinking water networks.",
      "Drainage & Sewage": "Drainage & Sewage",
      "Drainage Text": "Upgrading sanitation infrastructure.",
      "Parks & Recreation": "Parks & Recreation",
      "Parks Text": "Developing green spaces for public wellbeing.",
      "Public Buildings Text": "Constructing community halls, hospitals, and schools.",
      "Contact Us Text": "If you have any questions or feedback regarding civic projects, please reach out to us:",
      "Website": "Website",

      // Home Page
      "Project Tracker": "Project Tracker",
      "Hero Description": "Track the progress of city development projects in real-time. Transparency and accountability for a better Solapur.",
      "Total Projects": "Total Projects",
      "In Progress": "In Progress",
      "Completed": "Completed",
      "Total Budget (Cr)": "Total Budget (Cr)",
      "Latest Projects": "Latest Projects",
      "Search Placeholder": "Search projects by name, ward, or location...",
      "Search": "Search",

      // Filters
      "Category": "Category",
      "All Categories": "All Categories",
      "Status": "Status",
      "All Statuses": "All Statuses",
      "Ward": "Ward",
      "All Wards": "All Wards",
      
      // Projects
      "No projects found": "No projects found matching your criteria.",
      
      // Categories options
      "Road": "Road",
      "Water Supply": "Water Supply",
      "Drainage": "Drainage",
      "Park/Garden": "Park/Garden",
      "Public Building": "Public Building",
      "Building": "Building",
      "Electricity": "Electricity",
      "Other": "Other",

      // Statuses
      "Planned": "Planned",
      "Tender Issued": "Tender Issued",
      "On Hold": "On Hold",
      "Cancelled": "Cancelled",

      // Project Card
      "Expected": "Expected",
      "View Details": "View Details"
    }
  },
  mr: {
    translation: {
      // Navbar & Footer
      "Home": "मुखपृष्ठ",
      "All Projects": "सर्व प्रकल्प",
      "Categories": "श्रेणी",
      "About": "आमच्याबद्दल",
      "Admin Login": "प्रशासन लॉगिन",
      "Solapur Municipal Corporation": "सोलापूर महानगरपालिका",
      "Government of Maharashtra": "महाराष्ट्र शासन",
      "Quick Links": "महत्वाचे दुवे",
      "Contact Us": "संपर्क साधा",
      "Address": "राजवाडा चौक, सोलापूर - ४१३००२",
      "Phone": "फोन",
      "Email": "ई-मेल",
      "Contact SMC": "SMC शी संपर्क साधा",
      "About this Portal": "या पोर्टल बद्दल",
      "Footer About": "हे सोलापूर महानगरपालिकेचे अधिकृत प्रकल्प ट्रॅकिंग पोर्टल आहे. नागरिक सर्व नागरी विकास प्रकल्पांचा रिअल-टाइम मागोवा घेऊ शकतात.",
      "Footer Copyright": "© 2024 सोलापूर महानगरपालिका | महाराष्ट्र शासन | सर्व हक्क राखीव",
      
      // Accessibility Bar
      "Font Size": "फॉन्ट आकार",
      "Spacing": "अंतर",
      "Normal": "सामान्य",
      "Wide": "रुंद",
      "Theme": "थीम",
      "Light": "प्रकाश",
      "Dark": "गडद",
      "Read": "वाचा",
      "Pause": "थांबा",
      "Resume": "सुरू करा",
      "Stop": "बंद करा",

      // About Page
      "About SMC Project Tracker": "SMC प्रकल्प ट्रॅकर बद्दल",
      "Our Mission": "आमचे ध्येय",
      "Mission Text": "सोलापूर महानगरपालिका (SMC) पारदर्शकता, कार्यक्षमता आणि नागरिक सहभागासाठी वचनबद्ध आहे. SMC प्रकल्प ट्रॅकर हा शहरातील नागरी विकास प्रकल्पांची रिअल-टाइम माहिती नागरिकांना देण्यासाठी एक अधिकृत उपक्रम आहे.",
      "What We Track": "आम्ही काय ट्रॅक करतो",
      "What We Track Text": "हे पोर्टल सर्व प्रमुख पायाभूत सुविधा आणि नागरी प्रकल्पांचा मागोवा घेते, ज्यामध्ये खालील गोष्टींचा समावेश आहे:",
      "Road Construction & Maintenance": "रस्ते बांधकाम आणि देखभाल",
      "Road Construction Text": "शहरातील कनेक्टिव्हिटी आणि सुरक्षितता सुधारणे.",
      "Water Supply Text": "पिण्याच्या पाण्याचे नेटवर्क विस्तारणे आणि देखभाल करणे.",
      "Drainage & Sewage": "ड्रेनेज आणि सांडपाणी",
      "Drainage Text": "स्वच्छता पायाभूत सुविधा अपग्रेड करणे.",
      "Parks & Recreation": "उद्याने आणि मनोरंजन",
      "Parks Text": "सार्वजनिक कल्याणासाठी हरित जागा विकसित करणे.",
      "Public Buildings Text": "कम्युनिटी हॉल, रुग्णालये आणि शाळांचे बांधकाम.",
      "Contact Us Text": "नागरी प्रकल्पांबद्दल तुम्हाला काही प्रश्न किंवा अभिप्राय असल्यास, कृपया आमच्याशी संपर्क साधा:",
      "Website": "वेबसाइट",

      // Home Page
      "Project Tracker": "प्रकल्प ट्रॅकर",
      "Hero Description": "शहरातील विकास प्रकल्पांच्या प्रगतीचा रिअल-टाइम मागोवा घ्या. उत्तम सोलापूरसाठी पारदर्शकता आणि उत्तरदायित्व.",
      "Total Projects": "एकूण प्रकल्प",
      "In Progress": "प्रगतीपथावर",
      "Completed": "पूर्ण झालेले",
      "Total Budget (Cr)": "एकूण बजेट (कोटी)",
      "Latest Projects": "नवीनतम प्रकल्प",
      "Search Placeholder": "नाव, प्रभाग किंवा स्थानानुसार प्रकल्प शोधा...",
      "Search": "शोधा",

      // Filters
      "Category": "श्रेणी",
      "All Categories": "सर्व श्रेणी",
      "Status": "स्थिती",
      "All Statuses": "सर्व स्थिती",
      "Ward": "प्रभाग",
      "All Wards": "सर्व प्रभाग",
      
      // Projects
      "No projects found": "तुमच्या निकषांशी जुळणारे कोणतेही प्रकल्प आढळले नाहीत.",

      // Categories options
      "Road": "रस्ते",
      "Water Supply": "पाणीपुरवठा",
      "Drainage": "ड्रेनेज",
      "Park/Garden": "उद्याने",
      "Public Building": "सार्वजनिक इमारती",
      "Building": "इमारती",
      "Electricity": "वीज",
      "Other": "इतर",

      // Statuses
      "Planned": "नियोजित",
      "Tender Issued": "निविदा जारी",
      "On Hold": "प्रलंबित",
      "Cancelled": "रद्द",

      // Project Card
      "Expected": "अपेक्षित",
      "View Details": "तपशील पहा"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
