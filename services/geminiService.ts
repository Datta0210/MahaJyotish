
import { GoogleGenAI } from "@google/genai";
import { BirthDetails, Language, NumerologyReport } from '../types';

const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY' });

export const generateNumerologyReport = async (details: BirthDetails, lang: Language): Promise<NumerologyReport> => {
  const isPremium = details.isPremium;
  
  if (!apiKey) {
    return getMockData(details); 
  }

  const currentYear = new Date().getFullYear();

  // Prepare input parts (Text + Optional Image)
  const inputParts: any[] = [];

  const textPrompt = `
    Act as a World-Class Celebrity Numerologist and Graphologist.
    Create a ${isPremium ? 'PREMIUM EXTENSIVE' : 'BASIC'} Numerology Report.
    
    USER DETAILS:
    Name: ${details.name}
    DOB: ${details.date}
    Gender: ${details.gender}
    Mobile: ${details.phoneNumber || 'N/A'}
    Car: ${details.carNumber || 'N/A'} (${details.carColor || 'N/A'})
    
    FAMILY DETAILS (For Compatibility Analysis):
    Spouse Name: ${details.spouseName || 'Not Provided'}
    Spouse DOB: ${details.spouseDOB || 'Not Provided'}
    Child Name: ${details.childName || 'Not Provided'}
    Child DOB: ${details.childDOB || 'Not Provided'}
    
    LANGUAGE: MARATHI (Devanagari). 
    TONE: Professional, Deep, Spiritual, Encouraging. Use "Vedic" style formatting.
    
    INSTRUCTIONS:
    1. If a signature image is provided, analyze the slant, pressure, size, and underlines.
    2. If Spouse/Child details are provided, calculate their Driver/Conductor numbers internally and provide a compatibility report.
    3. The report must be detailed and descriptive.
    
    OUTPUT FORMAT: Strictly Valid JSON.
    
    JSON SCHEMA:
    {
      "driver": number,
      "conductor": number,
      "summary": {
        "lifeTheme": "string",
        "luckyElements": ["string"],
        "keyAdvice": ["string"],
        "favorableNumbers": [number],
        "favorableDays": ["string"],
        "favorableColors": ["string"]
      },
      "loShuGrid": [number],
      "birthChartAnalysis": "string (Detailed paragraph)",
      "driverAnalysis": "string (Detailed paragraph)",
      "conductorAnalysis": "string (Detailed paragraph)",
      "combinationAnalysis": "string (Detailed paragraph)",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "missingNumbers": [number],
      "missingNumberAnalysis": "string",
      "missingNumberRemedies": ["string"],
      "nameAnalysis": "string",
      "nameCorrection": "string",
      "mobileAnalysis": "string",
      "mobileScore": "string",
      "carAnalysis": "string (Vibrational analysis)",
      "carScore": "string",
      "signatureAnalysis": "string (General tips)",
      "signatureVisualAnalysis": "string (Specific analysis of the drawn signature image provided. If no image, say 'No signature provided'.)",
      "spouseAnalysis": "string (Compatibility report based on DOBs. If not provided, return null/empty string)",
      "childAnalysis": "string (Parent-Child bond analysis. If not provided, return null/empty string)",
      "healthAnalysis": "string",
      "healthRemedies": ["string"],
      "careerAnalysis": "string",
      "suitableProfessions": ["string"],
      "financeAnalysis": "string",
      "wealthMindset": "string",
      "relationshipAnalysis": "string",
      "familyDynamics": "string",
      "futurePredictions": [
        { "year": ${currentYear}, "theme": "string", "career": "string", "health": "string", "relationship": "string", "finance": "string", "remedy": "string" },
        { "year": ${currentYear + 1}, "theme": "string", "career": "string", "health": "string", "relationship": "string", "finance": "string", "remedy": "string" },
        { "year": ${currentYear + 2}, "theme": "string", "career": "string", "health": "string", "relationship": "string", "finance": "string", "remedy": "string" },
        { "year": ${currentYear + 3}, "theme": "string", "career": "string", "health": "string", "relationship": "string", "finance": "string", "remedy": "string" },
        { "year": ${currentYear + 4}, "theme": "string", "career": "string", "health": "string", "relationship": "string", "finance": "string", "remedy": "string" }
      ],
      "remedies": {
        "lalKitab": ["string"],
        "lifestyle": ["string"],
        "crystals": "string",
        "yantra": "string"
      },
      "actionPlan": ["string"],
      "goldenRules": ["string"]
    }
  `;

  inputParts.push({ text: textPrompt });

  // Add signature image if exists
  if (details.signatureBase64) {
    // Remove data URL prefix for API
    const base64Data = details.signatureBase64.split(',')[1];
    inputParts.push({
      inlineData: {
        mimeType: 'image/png',
        data: base64Data
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: inputParts },
      config: { responseMimeType: 'application/json' }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return { 
        ...data, 
        generatedDate: new Date().toLocaleDateString('mr-IN'),
        userSignatureImage: details.signatureBase64 // Pass image back to report
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return getMockData(details);
  }
};

const getMockData = (details: BirthDetails): NumerologyReport => ({
  driver: 1,
  conductor: 1,
  generatedDate: new Date().toLocaleDateString('mr-IN'),
  summary: {
    lifeTheme: "नेतृत्व आणि स्वातंत्र्य",
    luckyElements: ["सूर्य", "अग्नी"],
    keyAdvice: ["रागावर नियंत्रण ठेवा", "नवीन गोष्टी शिका"],
    favorableNumbers: [1, 5, 9],
    favorableDays: ["रविवार", "बुधवार"],
    favorableColors: ["नारंगी", "सोनेरी"]
  },
  loShuGrid: [1, 5, 9],
  birthChartAnalysis: "तुमच्या पत्रिकेत सूर्य प्रबळ आहे.",
  driverAnalysis: "तुम्ही एक जन्मजात नेते आहात. तुम्हाला कोणाच्या हाताखाली काम करणे आवडत नाही.",
  conductorAnalysis: "तुमचे नशीब तुम्हाला राजकारणात किंवा प्रशासकीय सेवेत नेईल.",
  combinationAnalysis: "१ आणि १ चा संयोग खूप शक्तिशाली आहे.",
  strengths: ["आत्मविश्वास", "इच्छाशक्ती", "स्पष्टता"],
  weaknesses: ["अहंकार", "अतिघाई", "राग"],
  missingNumbers: [2, 3, 4],
  missingNumberAnalysis: "भावनेचा अभाव असू शकतो.",
  missingNumberRemedies: ["चांदीच्या ग्लासमध्ये पाणी प्या"],
  nameAnalysis: "नावाची स्पेलिंग बदलल्यास अधिक यश मिळेल.",
  nameCorrection: `${details.name}A`,
  mobileAnalysis: "मोबाईल नंबर चांगला आहे.",
  mobileScore: "शुभ",
  carAnalysis: "गाडीचा नंबर तुमच्यासाठी लकी आहे.",
  carScore: "शुभ",
  signatureAnalysis: "सही ४५ अंशात वर जावी.",
  signatureVisualAnalysis: "तुमची सही अस्पष्ट आहे, ज्यामुळे विचार गोंधळलेले दिसतात. ती अधिक स्पष्ट करा.",
  userSignatureImage: details.signatureBase64,
  spouseAnalysis: details.spouseName ? "तुमची आणि जोडीदाराची मैत्री चांगली राहील. दोघांचा स्वभाव एकमेकांना पूरक आहे." : "",
  childAnalysis: details.childName ? "मुलाच्या शिक्षणासाठी तुम्हाला थोडे लक्ष द्यावे लागेल." : "",
  healthAnalysis: "पोटाचे विकार आणि उष्णतेचे त्रास होऊ शकतात.",
  healthRemedies: ["सूर्य नमस्कार करा"],
  careerAnalysis: "सरकारी नोकरी किंवा स्वतःचा व्यवसाय उत्तम राहील.",
  suitableProfessions: ["राजकारण", "व्यवस्थापन", "प्रशासन"],
  financeAnalysis: "वयाच्या ३५ नंतर प्रचंड धनलाभ होईल.",
  wealthMindset: "पैसा साठवण्यापेक्षा तो गुंतवा.",
  relationshipAnalysis: "नात्यात प्रामाणिक राहा.",
  familyDynamics: "वडिलांशी संबंध चांगले राहतील.",
  futurePredictions: [],
  remedies: { lalKitab: [], lifestyle: [], crystals: "माणिक (Ruby)", yantra: "सूर्य यंत्र" },
  actionPlan: ["रोज सकाळी लवकर उठा"],
  goldenRules: ["सत्य बोला"]
});
