
import React, { useState } from 'react';
import { NumerologyReport, PlanType } from '../types';
import { Lock, Star, Activity, Briefcase, Heart, Smartphone, ShieldCheck, User, Gem, Car, Download, Share2, Loader2, PenTool, Users } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ReportViewProps {
  data: NumerologyReport;
  plan: PlanType;
  onUpgrade: () => void;
}

// --- Layout Components ---

interface PageProps {
  children?: React.ReactNode;
  className?: string;
  pageNum?: string;
  id?: string;
  borderColor?: string;
}

// Visual Enhancement: Decorative Vedic Borders
const Page: React.FC<PageProps> = ({ children, className = "", pageNum, id, borderColor = "border-gold-500" }) => (
  <div id={id} className={`report-page bg-paper w-full max-w-[210mm] mx-auto min-h-[297mm] p-0 mb-8 shadow-2xl relative flex flex-col print:shadow-none print:w-full print:max-w-none print:min-h-[297mm] print:mb-0 print:break-after-page overflow-hidden ${className}`}>
    {/* Decorative Border Frame */}
    <div className={`absolute inset-4 border-2 ${borderColor} opacity-50 pointer-events-none rounded-lg z-0`}></div>
    <div className={`absolute inset-5 border ${borderColor} opacity-30 pointer-events-none rounded z-0`}></div>
    
    {/* Corner Decorations */}
    <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-gold-600 rounded-tl-xl z-0"></div>
    <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-gold-600 rounded-tr-xl z-0"></div>
    <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-gold-600 rounded-bl-xl z-0"></div>
    <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-gold-600 rounded-br-xl z-0"></div>

    <div className="flex-grow p-12 relative z-10">{children}</div>
    
    {/* Footer */}
    <div className="px-12 pb-6 relative z-10 flex justify-between items-center text-[10px] text-gray-500 font-sans uppercase tracking-widest border-t border-gold-200 mx-12">
      <span className="font-bold text-gold-700">महाज्योतिष प्रीमियम</span>
      <span>पृष्ठ {pageNum}</span>
      <span>mahajyotish.com</span>
    </div>
  </div>
);

const SectionHeading = ({ title, icon: Icon }: { title: string, icon?: any }) => (
  <div className="flex items-center gap-4 mb-8 pb-3 border-b-2 border-gold-400 bg-gradient-to-r from-gold-50 to-transparent p-2 rounded-l-lg">
    {Icon && (
      <div className="bg-gold-100 p-2 rounded-full border border-gold-300">
        <Icon className="text-gold-700 w-6 h-6" />
      </div>
    )}
    <h2 className="text-3xl font-bold text-indigo-950 font-marathi drop-shadow-sm">{title}</h2>
  </div>
);

const DataCard = ({ label, value, color = "blue" }: { label: string, value: string | number, color?: string }) => (
  <div className={`p-5 rounded-xl bg-white border-l-4 border-${color}-500 shadow-sm`}>
    <div className={`text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider`}>{label}</div>
    <div className={`text-2xl font-bold text-${color}-900 font-marathi`}>{value}</div>
  </div>
);

const ListSection = ({ items, title }: { items: string[], title: string }) => (
  <div className="mb-8 bg-white p-6 rounded-xl border border-gold-100 shadow-sm">
    <h4 className="font-bold text-xl mb-4 text-indigo-900 border-b border-gray-100 pb-2">{title}</h4>
    <ul className="space-y-3">
      {items?.map((item, i) => (
        <li key={i} className="flex gap-3 text-gray-800 text-lg leading-relaxed">
          <span className="text-gold-600 mt-1.5 text-xl">✦</span> 
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// --- Visualizers ---

const LoShuGrid = ({ numbers }: { numbers: number[] }) => {
  const gridMap = [4, 9, 2, 3, 5, 7, 8, 1, 6];
  return (
    <div className="w-64 h-64 mx-auto grid grid-cols-3 gap-2 bg-gradient-to-br from-gold-400 to-gold-600 p-2 rounded-lg shadow-xl">
      {gridMap.map((num) => {
        const hasNum = numbers.includes(num);
        return (
          <div key={num} className={`flex items-center justify-center rounded-md transition-all ${hasNum ? 'bg-white text-indigo-900 font-bold text-4xl shadow-inner' : 'bg-gold-500/50 text-gold-700/30'}`}>
            {hasNum ? num : ''}
          </div>
        );
      })}
    </div>
  );
};

export const ReportView: React.FC<ReportViewProps> = ({ data, plan, onUpgrade }) => {
  const isPremium = plan === 'premium';
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true });
      const pages = Array.from(document.querySelectorAll('.report-page'));
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const canvas = await html2canvas(page, {
          scale: 2, // Higher scale for better text quality
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#FFFDF5' // Paper color
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        if (i > 0) doc.addPage();
        doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      }
      doc.save(`MahaJyotish_${data.driver}_${data.conductor}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Error generating PDF");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 py-8 font-marathi print:bg-white print:py-0 text-gray-900 pb-32">
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-2 no-print">
        <button 
          onClick={handleDownloadPDF} 
          disabled={isGenerating}
          className="bg-gold-500 hover:bg-gold-400 text-black font-bold py-3 px-8 rounded-full shadow-2xl flex items-center gap-3 transition-transform hover:scale-105 border-2 border-white"
        >
          {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          {isGenerating ? 'PDF बनवत आहे...' : 'PDF डाउनलोड करा'}
        </button>
      </div>

      {/* ---------------- PAGE 1: COVER ---------------- */}
      <Page className="bg-gradient-to-b from-indigo-950 to-indigo-900 text-gold-400 flex flex-col justify-center items-center text-center !p-0" borderColor="border-gold-500/30">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12">
            <Star className="w-32 h-32 text-gold-500 mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(255,214,67,0.5)]" />
            <h1 className="text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">महाज्योतिष</h1>
            <div className="h-1.5 w-40 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-12"></div>
            
            <h2 className="text-3xl font-bold text-gold-200 uppercase tracking-[0.2em] mb-20 bg-indigo-900/50 px-8 py-4 rounded-full border border-gold-500/30">
            {isPremium ? 'प्रीमियम जीवन मार्ग अहवाल' : 'मोफत अंकशास्त्र अहवाल'}
            </h2>
            
            <div className="bg-white/10 p-12 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
            <div className="text-9xl font-bold text-white mb-2 flex items-center gap-4">
                {data.driver} <span className="text-gold-500 text-5xl font-light">/</span> {data.conductor}
            </div>
            <p className="text-gold-200 tracking-wider text-xl font-medium uppercase">मूलांक आणि भाग्यांक</p>
            </div>

            <div className="mt-auto text-gray-400 text-sm font-sans tracking-widest">
            CONFIDENTIAL REPORT • {data.generatedDate || '2025'}
            </div>
        </div>
      </Page>

      {/* ---------------- PAGE 2: DISCLAIMER & INTRO ---------------- */}
      <Page pageNum="02">
        <SectionHeading title="महत्वाची माहिती" icon={ShieldCheck} />
        <div className="space-y-8 text-justify text-gray-800 leading-relaxed text-lg">
          <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-gold-600 first-letter:mr-2 float-left">
            न
          </p>
          <p>
            मस्कार! हा अहवाल तुमच्या जन्मतारखेवर आधारित सखोल विश्लेषण आहे. अंकशास्त्र हे एक प्राचीन शास्त्र आहे जे आपल्या आयुष्यातील लपलेले पैलू उलगडण्यास मदत करते.
          </p>
          <div className="bg-red-50 p-8 rounded-xl border-l-8 border-red-500 shadow-sm my-10">
            <h4 className="font-bold text-red-800 text-xl mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5"/> सूचना (Disclaimer)
            </h4>
            <p className="text-red-900/80 italic">
              हा अहवाल मार्गदर्शनासाठी आहे. तुमचे नशीब तुमच्या कर्मांवर अवलंबून असते. कोणत्याही मोठ्या निर्णयासाठी तज्ञांचा सल्ला घ्यावा. आम्ही १००% निकालाची हमी देत नाही.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
             <div className="bg-indigo-50 p-6 rounded-lg text-center">
                <User className="w-8 h-8 mx-auto text-indigo-600 mb-3" />
                <h5 className="font-bold text-indigo-900">स्वभाव</h5>
             </div>
             <div className="bg-purple-50 p-6 rounded-lg text-center">
                <Star className="w-8 h-8 mx-auto text-purple-600 mb-3" />
                <h5 className="font-bold text-purple-900">नशीब</h5>
             </div>
             <div className="bg-emerald-50 p-6 rounded-lg text-center">
                <Gem className="w-8 h-8 mx-auto text-emerald-600 mb-3" />
                <h5 className="font-bold text-emerald-900">उपाय</h5>
             </div>
          </div>
        </div>
      </Page>

      {/* ---------------- PAGE 3: SUMMARY SNAPSHOT ---------------- */}
      <Page pageNum="03">
        <SectionHeading title="थोडक्यात माहिती (Snapshot)" icon={Activity} />
        
        <div className="flex gap-8 mb-10">
          <div className="flex-1 bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-2xl text-center text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full"></div>
             <div className="text-indigo-200 font-bold mb-2 uppercase tracking-wide">मूलांक (Driver)</div>
             <div className="text-7xl font-bold mb-2 drop-shadow-md">{data.driver}</div>
             <p className="text-sm text-indigo-100 opacity-80">तुमचे व्यक्तिमत्त्व आणि स्वभाव</p>
          </div>
          <div className="flex-1 bg-gradient-to-br from-purple-600 to-purple-800 p-8 rounded-2xl text-center text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full"></div>
             <div className="text-purple-200 font-bold mb-2 uppercase tracking-wide">भाग्यांक (Conductor)</div>
             <div className="text-7xl font-bold mb-2 drop-shadow-md">{data.conductor}</div>
             <p className="text-sm text-purple-100 opacity-80">तुमचे नशीब आणि कर्म</p>
          </div>
        </div>

        <div className="bg-amber-50 p-8 rounded-2xl border-2 border-amber-200 mb-10 text-center shadow-md">
          <h3 className="font-bold text-amber-800 mb-3 text-xl uppercase tracking-widest">✨ जीवनाचा उद्देश ✨</h3>
          <p className="text-2xl text-indigo-950 font-serif italic leading-relaxed">"{data.summary?.lifeTheme}"</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-10">
           <DataCard label="लकी नंबर" value={data.summary?.favorableNumbers?.join(', ') || '-'} color="emerald" />
           <DataCard label="लकी वार" value={data.summary?.favorableDays?.join(', ') || '-'} color="blue" />
           <DataCard label="लकी रंग" value={data.summary?.favorableColors?.join(', ') || '-'} color="pink" />
        </div>

        <div className="bg-white p-6 rounded-xl border-l-4 border-gold-500 shadow-sm">
           <h4 className="font-bold text-gray-800 mb-4 text-lg">महत्त्वाचा सल्ला (Key Advice)</h4>
           <ul className="grid grid-cols-1 gap-3">
             {data.summary?.keyAdvice?.map((advice, i) => (
               <li key={i} className="flex gap-3 text-gray-700 items-start">
                   <div className="min-w-[6px] h-[6px] rounded-full bg-gold-500 mt-2"></div> 
                   {advice}
                </li>
             ))}
           </ul>
        </div>
      </Page>

      {/* ---------------- GATED CONTENT ---------------- */}
      
      {isPremium ? (
        <>
        {/* ---------------- PAGE 4: BIRTH CHART ---------------- */}
        <Page pageNum="04">
          <SectionHeading title="लो शु ग्रिड (जन्म कुंडली)" icon={Activity} />
          
          <div className="bg-indigo-950 p-10 rounded-3xl mb-10 text-center shadow-2xl relative overflow-hidden">
             {/* Background Pattern */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-12">
                <LoShuGrid numbers={data.loShuGrid || []} />
                <div className="text-left text-white max-w-xs">
                    <h4 className="text-gold-400 font-bold text-xl mb-2">ग्रिड कसे वाचावे?</h4>
                    <p className="text-indigo-200 text-sm leading-relaxed">
                        हे ग्रिड लक्ष्मी यंत्रावर आधारित आहे. जे अंक चौकटीत आहेत, ती तुमची जमेची बाजू (Strength) आहे. रिकाम्या जागा म्हणजे जिथे तुम्हाला काम करावे लागेल.
                    </p>
                </div>
             </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg">
            <h3 className="font-bold text-2xl mb-6 text-indigo-900 border-b pb-2">कुंडलीचे विश्लेषण</h3>
            <p className="text-justify leading-loose text-gray-700 text-lg">{data.birthChartAnalysis}</p>
          </div>
        </Page>

        {/* ---------------- PAGE 5: DETAILED ANALYSIS ---------------- */}
        <Page pageNum="05">
           <SectionHeading title="स्वभाव आणि नशीब विश्लेषण" icon={User} />
           
           <div className="space-y-8">
             <div className="bg-gradient-to-r from-blue-50 to-white p-8 rounded-2xl border border-blue-100 shadow-sm">
               <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                 <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">{data.driver}</span>
                 मूलांक विश्लेषण (स्वभाव)
               </h3>
               <p className="text-gray-800 leading-relaxed text-justify">{data.driverAnalysis}</p>
             </div>

             <div className="bg-gradient-to-r from-purple-50 to-white p-8 rounded-2xl border border-purple-100 shadow-sm">
               <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                 <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">{data.conductor}</span>
                 भाग्यांक विश्लेषण (नशीब)
               </h3>
               <p className="text-gray-800 leading-relaxed text-justify">{data.conductorAnalysis}</p>
             </div>

             <div className="bg-amber-50 p-8 rounded-2xl border-l-4 border-amber-500">
               <h3 className="text-xl font-bold text-amber-900 mb-4">दोघांचा संयोग (Combination)</h3>
               <p className="text-gray-800 leading-relaxed text-justify font-medium">{data.combinationAnalysis}</p>
             </div>
           </div>
        </Page>

        {/* ---------------- PAGE 6: STRENGTHS & WEAKNESSES ---------------- */}
        <Page pageNum="06">
          <SectionHeading title="ताकद आणि कमजोरी" icon={Activity} />
          <div className="flex flex-col gap-8 h-full">
             <div className="flex-1 bg-white p-0 rounded-2xl shadow-md border border-gray-100 overflow-hidden">
               <div className="bg-emerald-600 p-4 text-white font-bold text-xl text-center">तुमची ताकद (Strengths)</div>
               <div className="p-8 bg-emerald-50/30 h-full">
                 <ul className="space-y-4">
                    {data.strengths?.map((s, i) => (
                        <li key={i} className="flex gap-4 items-start">
                            <div className="bg-emerald-100 p-1 rounded text-emerald-600"><CheckCircleIcon /></div>
                            <span className="text-lg text-gray-700">{s}</span>
                        </li>
                    ))}
                 </ul>
               </div>
             </div>

             <div className="flex-1 bg-white p-0 rounded-2xl shadow-md border border-gray-100 overflow-hidden">
               <div className="bg-red-500 p-4 text-white font-bold text-xl text-center">सुधारणा हवी (Weaknesses)</div>
               <div className="p-8 bg-red-50/30 h-full">
                 <ul className="space-y-4">
                    {data.weaknesses?.map((w, i) => (
                        <li key={i} className="flex gap-4 items-start">
                            <div className="bg-red-100 p-1 rounded text-red-600 font-bold text-xs">⚠</div>
                            <span className="text-lg text-gray-700">{w}</span>
                        </li>
                    ))}
                 </ul>
               </div>
             </div>
          </div>
        </Page>

        {/* ---------------- PAGE 7: SIGNATURE ANALYSIS (NEW) ---------------- */}
        <Page pageNum="07">
            <SectionHeading title="सहीचे विश्लेषण (Signature Analysis)" icon={PenTool} />
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mb-8">
                <h3 className="font-bold text-xl text-indigo-900 mb-6">तुमची सही (Your Signature)</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex justify-center items-center bg-gray-50 min-h-[150px]">
                    {data.userSignatureImage ? (
                        <img src={data.userSignatureImage} alt="User Signature" className="max-h-32 object-contain" />
                    ) : (
                        <span className="text-gray-400 italic">सही उपलब्ध नाही</span>
                    )}
                </div>
            </div>

            {/* AI Visual Analysis */}
            <div className="bg-fuchsia-50 p-8 rounded-2xl border-l-4 border-fuchsia-600 shadow-sm mb-8">
                <h3 className="font-bold text-xl text-fuchsia-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5"/> ग्राफोलोजी विश्लेषण (Visual Analysis)
                </h3>
                <p className="text-gray-800 leading-relaxed text-justify text-lg">
                    {data.signatureVisualAnalysis || "तुम्ही सहीचा फोटो न दिल्यामुळे व्हिज्युअल विश्लेषण उपलब्ध नाही."}
                </p>
            </div>

            {/* General Tips */}
            <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
                <h3 className="font-bold text-xl text-indigo-900 mb-4">यशासाठी टिप्स</h3>
                <p className="text-gray-800 leading-relaxed text-justify text-lg">{data.signatureAnalysis}</p>
            </div>
        </Page>

        {/* ---------------- PAGE 8: FAMILY BOND (NEW) ---------------- */}
        <Page pageNum="08">
            <SectionHeading title="कौटुंबिक योग (Family Bond)" icon={Users} />
            
            {/* Spouse Analysis */}
            <div className="mb-10 relative">
                <div className="absolute top-0 left-6 -mt-3 bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md z-10">
                    जोडीदार (Spouse)
                </div>
                <div className="bg-white p-8 pt-10 rounded-2xl border border-pink-200 shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-pink-50 rounded-bl-[100px] z-0"></div>
                    <p className="text-gray-800 leading-relaxed text-justify text-lg relative z-10">
                        {data.spouseAnalysis ? data.spouseAnalysis : "जोडीदाराची माहिती दिली नसल्याने विश्लेषण उपलब्ध नाही."}
                    </p>
                </div>
            </div>

            {/* Child Analysis */}
            <div className="mb-10 relative">
                <div className="absolute top-0 left-6 -mt-3 bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md z-10">
                    संतान योग (Child)
                </div>
                <div className="bg-white p-8 pt-10 rounded-2xl border border-teal-200 shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-teal-50 rounded-bl-[100px] z-0"></div>
                    <p className="text-gray-800 leading-relaxed text-justify text-lg relative z-10">
                        {data.childAnalysis ? data.childAnalysis : "मुलाची माहिती दिली नसल्याने विश्लेषण उपलब्ध नाही."}
                    </p>
                </div>
            </div>

             <div className="bg-amber-50 p-6 rounded-xl border-l-4 border-amber-500">
                <h4 className="font-bold text-amber-900 mb-2">कौटुंबिक सुसंवाद टिप</h4>
                <p className="text-amber-800 italic">"{data.familyDynamics}"</p>
             </div>
        </Page>

        {/* ---------------- PAGE 9: NAME, MOBILE & CAR ---------------- */}
        <Page pageNum="09">
           <SectionHeading title="अंकशास्त्र विश्लेषण" icon={Smartphone} />
           
           <div className="grid grid-cols-1 gap-8">
                {/* Name */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-500">
                    <h3 className="text-xl font-bold text-indigo-900 mb-2 flex items-center gap-2">
                        <User className="w-5 h-5" /> नाव विश्लेषण
                    </h3>
                    <p className="text-gray-700 mb-4">{data.nameAnalysis}</p>
                    {data.nameCorrection && (
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 text-center">
                            <span className="text-xs font-bold text-indigo-500 uppercase">सुचवलेले नाव</span>
                            <div className="text-3xl font-bold text-indigo-900 mt-1">{data.nameCorrection}</div>
                        </div>
                    )}
                </div>

                {/* Mobile */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                            <Smartphone className="w-5 h-5" /> मोबाईल
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${data.mobileScore?.includes('शुभ') ? 'bg-green-500' : 'bg-red-500'}`}>
                        {data.mobileScore}
                        </span>
                    </div>
                    <p className="text-gray-700">{data.mobileAnalysis}</p>
                </div>

                {/* Car */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-md text-white">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Car className="w-5 h-5 text-gold-400" /> वाहन विश्लेषण
                        </h3>
                        <span className="text-xs border border-white/30 px-2 py-1 rounded text-gold-400">{data.carScore}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed opacity-90">
                        {data.carAnalysis}
                    </p>
                </div>
           </div>
        </Page>

        {/* ---------------- PAGE 10: CAREER & FINANCE ---------------- */}
        <Page pageNum="10">
           <SectionHeading title="नोकरी, व्यवसाय आणि पैसा" icon={Briefcase} />
           
           <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
             <h3 className="font-bold text-xl text-indigo-900 mb-4">करिअर सल्ला</h3>
             <p className="text-gray-700 leading-relaxed text-justify text-lg">{data.careerAnalysis}</p>
           </div>
           
           <ListSection title="तुमच्यासाठी योग्य क्षेत्रे" items={data.suitableProfessions} />

           <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
             <h3 className="font-bold text-xl text-indigo-900 mb-4">आर्थिक स्थिती</h3>
             <p className="text-gray-700 leading-relaxed text-justify text-lg">{data.financeAnalysis}</p>
           </div>

           <div className="bg-emerald-600 text-white p-8 rounded-2xl shadow-lg text-center">
              <h4 className="font-bold text-emerald-200 mb-2 uppercase tracking-widest text-sm">मनी मंत्र</h4>
              <p className="text-2xl font-serif italic">"{data.wealthMindset}"</p>
           </div>
        </Page>

        {/* ---------------- PAGE 11: HEALTH ---------------- */}
        <Page pageNum="11">
           <SectionHeading title="आरोग्य (Health)" icon={Heart} />
           
           <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
               <div className="w-full md:w-1/3">
                    <div className="bg-teal-100 rounded-full w-48 h-48 flex items-center justify-center mx-auto border-8 border-teal-50">
                        <Heart className="w-20 h-20 text-teal-600" />
                    </div>
               </div>
               <div className="w-full md:w-2/3">
                    <p className="text-gray-700 leading-relaxed text-justify text-lg bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        {data.healthAnalysis}
                    </p>
               </div>
           </div>

           <ListSection title="आरोग्यासाठी उपाय" items={data.healthRemedies} />
        </Page>

        {/* ---------------- FUTURE PREDICTIONS ---------------- */}
        {data.futurePredictions?.map((yearData, index) => (
          <Page key={yearData.year} pageNum={`${12 + index}`}>
            <SectionHeading title={`भविष्यवाणी - वर्ष ${yearData.year}`} icon={Activity} />
            
            <div className="bg-indigo-900 text-gold-400 p-8 rounded-3xl mb-10 shadow-2xl text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
               <h3 className="text-6xl font-bold mb-2 relative z-10">{yearData.year}</h3>
               <p className="text-2xl font-medium text-white relative z-10">" {yearData.theme} "</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <PredictionCard title="नोकरी आणि व्यवसाय" text={yearData.career} color="blue" />
              <PredictionCard title="आर्थिक स्थिती" text={yearData.finance} color="green" />
              <PredictionCard title="नातेसंबंध" text={yearData.relationship} color="pink" />
              <PredictionCard title="आरोग्य" text={yearData.health} color="teal" />
            </div>

            <div className="mt-10 bg-yellow-50 p-6 rounded-xl border border-yellow-200 text-center">
              <span className="font-bold text-yellow-800 uppercase tracking-wide block mb-2">💡 या वर्षाचा उपाय</span>
              <p className="text-lg text-gray-800 font-medium">{yearData.remedy}</p>
            </div>
          </Page>
        ))}

        {/* ---------------- LAST PAGE: REMEDIES ---------------- */}
        <Page pageNum={`${12 + (data.futurePredictions?.length || 0)}`}>
           <SectionHeading title="महत्त्वाचे उपाय (Remedies)" icon={Gem} />

           <div className="mb-10 bg-red-50 p-8 rounded-2xl border border-red-100">
             <h3 className="font-bold text-red-800 text-2xl mb-6 flex items-center gap-3">
                 <div className="w-2 h-8 bg-red-600 rounded-full"></div> लाल किताब उपाय
             </h3>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {data.remedies?.lalKitab?.map((r, i) => (
                 <li key={i} className="bg-white p-4 rounded-xl border border-red-100 text-red-900 shadow-sm flex gap-3 items-center">
                   <div className="w-2 h-2 rounded-full bg-red-500"></div> {r}
                 </li>
               ))}
             </ul>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-white p-6 rounded-2xl shadow-md border-t-8 border-purple-500">
                <h4 className="font-bold text-gray-800 mb-2 text-lg">💎 शुभ रत्न (Gemstone)</h4>
                <p className="text-gray-600">{data.remedies?.crystals}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md border-t-8 border-orange-500">
                <h4 className="font-bold text-gray-800 mb-2 text-lg">🕉️ सिद्ध यंत्र (Yantra)</h4>
                <p className="text-gray-600">{data.remedies?.yantra}</p>
              </div>
           </div>

           <ListSection title="जीवनशैलीत बदल (Lifestyle Changes)" items={data.remedies?.lifestyle || []} />

           <div className="bg-indigo-950 text-gold-400 p-10 rounded-3xl text-center mt-12 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
             <h3 className="text-2xl font-bold mb-6 relative z-10">यशाचे नियम (Golden Rules)</h3>
             <ul className="space-y-4 text-indigo-100 text-lg relative z-10">
               {data.goldenRules?.map((rule, i) => <li key={i}>✨ {rule}</li>)}
             </ul>
           </div>
        </Page>
        </>
      ) : (
        /* ---------------- FREE PLAN CTA ---------------- */
        <div className="max-w-[210mm] mx-auto mt-8 p-12 bg-white rounded-3xl shadow-2xl text-center border-4 border-double border-gold-500 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-400 via-gold-600 to-gold-400"></div>
           <Lock className="w-20 h-20 text-gray-300 mx-auto mb-6" />
           <h3 className="text-3xl font-bold text-gray-900 mb-4">पुढील माहिती फक्त प्रीमियम सदस्यांसाठी</h3>
           <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg">
             ५ वर्षांचे भविष्य, नाव दुरुस्ती, सही विश्लेषण, जोडीदार योग आणि लाल किताब उपाय जाणून घेण्यासाठी आजच अपग्रेड करा.
           </p>
           <button onClick={onUpgrade} className="bg-gradient-to-r from-gold-600 to-gold-400 text-black font-bold py-4 px-10 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-3 mx-auto text-lg">
             <Star className="w-6 h-6" />
             संपूर्ण अहवाल अनलॉक करा (₹१११)
           </button>
        </div>
      )}
    </div>
  );
};

// Helper Component for Predictions
const PredictionCard = ({ title, text, color }: { title: string, text: string, color: string }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-l-8 border-${color}-500`}>
        <h4 className={`font-bold text-${color}-700 mb-2 text-lg`}>{title}</h4>
        <p className="text-gray-600 leading-relaxed">{text}</p>
    </div>
);

// Simple check icon
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);
