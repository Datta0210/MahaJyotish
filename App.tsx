
import React, { useState, useRef, useContext, createContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { 
  Sun, Star, ChevronLeft, Loader2, PenTool, Eraser, Users
} from 'lucide-react';
import { TRANSLATIONS } from './constants';
import { Language, BirthDetails, PlanType, NumerologyReport } from './types';
import { generateNumerologyReport } from './services/geminiService';
import { LandingPage } from './components/LandingPage';
import { ReportView } from './components/ReportView';

const LangContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}>({ lang: 'mr', setLang: () => {}, t: () => '' });

const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('mr');
  const t = (key: string) => TRANSLATIONS[key] ? TRANSLATIONS[key][lang] : key;
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
};

// --- Signature Pad Component ---
const SignaturePad = ({ onSave }: { onSave: (data: string | undefined) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = 200; // Fixed height
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current && hasSignature) {
      onSave(canvasRef.current.toDataURL('image/png'));
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    };
  };

  const clearCanvas = (e: React.MouseEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
      onSave(undefined);
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 border border-gray-600">
       <div className="flex justify-between items-center mb-2">
         <label className="text-gray-800 text-sm font-bold flex items-center gap-2">
           <PenTool className="w-4 h-4" /> तुमची सही करा (Draw Signature)
         </label>
         <button onClick={clearCanvas} className="text-xs text-red-600 flex items-center gap-1 font-bold">
           <Eraser className="w-3 h-3" /> पुसा
         </button>
       </div>
       <canvas
         ref={canvasRef}
         className="w-full bg-gray-50 border border-gray-300 rounded touch-none cursor-crosshair"
         onMouseDown={startDrawing}
         onMouseMove={draw}
         onMouseUp={stopDrawing}
         onMouseLeave={stopDrawing}
         onTouchStart={startDrawing}
         onTouchMove={draw}
         onTouchEnd={stopDrawing}
       />
       <p className="text-[10px] text-gray-500 mt-1">येथे बोटाने किंवा माऊसने सही करा. हे AI विश्लेषणासाठी वापरले जाईल.</p>
    </div>
  );
};

const Header = () => {
  return (
    <nav className="bg-midnight border-b border-gray-800 sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <Sun className="h-8 w-8 text-gold-500" />
            <span className="text-xl font-bold text-white tracking-wide font-marathi">
              महाज्योतिष
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

const NumerologyFlow = () => {
  const [stage, setStage] = useState<'landing' | 'form' | 'processing' | 'report'>('landing');
  const [plan, setPlan] = useState<PlanType>('free');
  const [details, setDetails] = useState<BirthDetails>({
    name: '', date: '', time: '12:00', place: '', gender: 'male',
    phoneNumber: '', email: '', carNumber: '', carColor: ''
  });
  const [reportData, setReportData] = useState<NumerologyReport | null>(null);

  const handlePlanSelect = (selectedPlan: PlanType) => {
    setPlan(selectedPlan);
    setStage('form');
    window.scrollTo(0,0);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStage('processing');
    
    const finalDetails = { ...details, isPremium: plan === 'premium' };
    const data = await generateNumerologyReport(finalDetails, 'mr');
    
    setReportData(data);
    setStage('report');
    window.scrollTo(0,0);
  };

  if (stage === 'landing') {
    return <LandingPage onStartReport={handlePlanSelect} lang="mr" />;
  }

  if (stage === 'processing') {
    return (
      <div className="min-h-screen bg-midnight flex flex-col items-center justify-center text-white font-marathi">
        <Loader2 className="w-16 h-16 text-gold-500 animate-spin mb-6" />
        <h2 className="text-2xl font-bold mb-2">माहिती विश्लेषित करत आहे...</h2>
        <p className="text-gray-400">तारे जुळवत आहोत, कृपया प्रतीक्षा करा</p>
      </div>
    );
  }

  if (stage === 'report' && reportData) {
    return <ReportView data={reportData} plan={plan} onUpgrade={() => handlePlanSelect('premium')} />;
  }

  return (
    <div className="min-h-screen bg-midnight py-12 px-4 font-marathi">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setStage('landing')} className="text-gray-400 flex items-center gap-2 mb-6 hover:text-white">
          <ChevronLeft /> मागे जा
        </button>
        
        <div className="bg-deep-800 rounded-2xl p-6 md:p-8 border border-gray-700 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">तुमची माहिती भरा</h2>
            <p className="text-gray-400 text-sm">
              {plan === 'premium' 
                ? 'अचूक माहिती दिल्यास अचूक भविष्य मिळेल.' 
                : 'मोफत अहवालासाठी मूलभूत माहिती द्या.'}
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">पूर्ण नाव</label>
              <input required type="text" className="w-full bg-deep-900 border border-gray-600 rounded p-3 text-white focus:border-gold-500 outline-none" 
                value={details.name} onChange={e => setDetails({...details, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">जन्म तारीख</label>
                <input required type="date" className="w-full bg-deep-900 border border-gray-600 rounded p-3 text-white focus:border-gold-500 outline-none" 
                   value={details.date} onChange={e => setDetails({...details, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">लिंग</label>
                <select className="w-full bg-deep-900 border border-gray-600 rounded p-3 text-white focus:border-gold-500 outline-none"
                   value={details.gender} onChange={e => setDetails({...details, gender: e.target.value as any})}
                >
                  <option value="male">पुरुष</option>
                  <option value="female">स्त्री</option>
                </select>
              </div>
            </div>

            {plan === 'premium' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-4 bg-gold-500/10 border border-gold-500/30 rounded-lg space-y-4">
                  <h3 className="text-gold-400 text-sm font-bold flex items-center gap-2">
                    <Star className="w-4 h-4 fill-current" /> प्रीमियम माहिती (Family)
                  </h3>
                  
                  {/* Family Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs text-gray-400 mb-1">जोडीदाराचे नाव (Spouse)</label>
                        <input type="text" className="w-full bg-deep-900 border border-gray-600 rounded p-2 text-white focus:border-gold-500 text-sm"
                          value={details.spouseName || ''} onChange={e => setDetails({...details, spouseName: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-xs text-gray-400 mb-1">जोडीदाराची जन्मतारीख</label>
                        <input type="date" className="w-full bg-deep-900 border border-gray-600 rounded p-2 text-white focus:border-gold-500 text-sm"
                          value={details.spouseDOB || ''} onChange={e => setDetails({...details, spouseDOB: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-xs text-gray-400 mb-1">मुलाचे नाव (Son/Child)</label>
                        <input type="text" className="w-full bg-deep-900 border border-gray-600 rounded p-2 text-white focus:border-gold-500 text-sm"
                          value={details.childName || ''} onChange={e => setDetails({...details, childName: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-xs text-gray-400 mb-1">मुलाची जन्मतारीख</label>
                        <input type="date" className="w-full bg-deep-900 border border-gray-600 rounded p-2 text-white focus:border-gold-500 text-sm"
                          value={details.childDOB || ''} onChange={e => setDetails({...details, childDOB: e.target.value})}
                        />
                     </div>
                  </div>

                  <hr className="border-gray-700 my-2"/>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">व्हॉट्सअॅप नंबर</label>
                      <input required type="tel" placeholder="+91" className="w-full bg-deep-900 border border-gray-600 rounded p-3 text-white focus:border-gold-500 outline-none" 
                         value={details.phoneNumber} onChange={e => setDetails({...details, phoneNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">गाडी नंबर (ऐच्छिक)</label>
                      <input type="text" placeholder="MH 12 AB 1234" className="w-full bg-deep-900 border border-gray-600 rounded p-3 text-white focus:border-gold-500 outline-none" 
                         value={details.carNumber} onChange={e => setDetails({...details, carNumber: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Signature Pad */}
                  <SignaturePad onSave={(data) => setDetails({...details, signatureBase64: data})} />

                </div>

                <div className="flex items-center gap-3">
                   <input type="checkbox" required id="privacy" className="w-4 h-4 accent-gold-500" />
                   <label htmlFor="privacy" className="text-sm text-gray-400">मी नियम आणि अटी मान्य करतो</label>
                </div>
              </div>
            )}

            <button type="submit" className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-transform hover:scale-[1.02] active:scale-95 ${
              plan === 'premium' 
                ? 'bg-gradient-to-r from-gold-600 to-gold-400 text-black' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}>
              {plan === 'premium' ? '₹१११ भरा आणि अहवाल मिळवा' : 'मोफत अहवाल तयार करा'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <LangProvider>
      <HashRouter>
        <div className="min-h-screen bg-midnight font-sans text-gray-100">
          <Header />
          <Routes>
            <Route path="/" element={<NumerologyFlow />} />
          </Routes>
          <footer className="bg-black py-8 text-center text-gray-600 text-sm border-t border-gray-900 no-print">
            <p className="mb-2">&copy; 2025 महाज्योतिष. सर्व हक्क राखीव.</p>
          </footer>
        </div>
      </HashRouter>
    </LangProvider>
  );
};

export default App;
