import React, { useState, useEffect } from 'react';
import { Check, Star, Download, Shield, Lock, Award, ChevronDown } from 'lucide-react';
import { PlanType } from '../types';

interface LandingPageProps {
  onStartReport: (plan: PlanType) => void;
  lang: any;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartReport }) => {
  const [timeLeft, setTimeLeft] = useState({ m: 12, s: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s === 0) return { m: prev.m - 1, s: 59 };
        return { ...prev, s: prev.s - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuresList = [
    { id: "01", title: "जन्म तक्ता (Birth Chart)", desc: "तुमच्या जन्मतारखेचा सविस्तर अंकशास्त्र आराखडा." },
    { id: "02", title: "मूलांक-भाग्यांक युती", desc: "तुमचे व्यक्तिमत्त्व आणि नशिबाचा संयोग." },
    { id: "03", title: "अंकांचा प्रभाव", desc: "तुमच्या जन्मतारखेतील प्रत्येक अंकाची शक्ती." },
    { id: "04", title: "मिसिंग नंबर उपाय", desc: "जन्मकुंडलीत नसलेल्या अंकांचे साधे उपाय." },
    { id: "05", title: "ब्रेसलेट आणि यंत्र", desc: "ऊर्जा संतुलित करण्यासाठी खास रत्न व यंत्र." },
    { id: "06", title: "मोबाईल नंबर", desc: "तुमचा फोन नंबर तुमच्या प्रगतीत अडथळा आहे का?" },
    { id: "07", title: "शुभ-अशुभ अंक", desc: "कोणते दिवस आणि तारखा तुम्हाला यश देतील?" },
    { id: "08", title: "सही विश्लेषण", desc: "यशासाठी सहीमध्ये कोणते बदल करावेत?" },
    { id: "09", title: "आरोग्य मार्गदर्शन", desc: "संभाव्य आजार आणि त्यावरील खबरदारी." },
    { id: "10", title: "स्वभाव आणि राजयोग", desc: "तुमच्या कुंडलीतील छुपे गुण आणि योग." },
    { id: "11", title: "मिसिंग नंबर (सविस्तर)", desc: "गहाळ अंकांचा तुमच्या आयुष्यावर होणारा खोल परिणाम." },
    { id: "12", title: "नाव अंकशास्त्र", desc: "नावाची स्पेलिंग तुमच्या नशिबाशी जुळते का?" },
    { id: "13", title: "५ वर्षांचे भविष्य", desc: "२०२५ ते २०२९ पर्यंतचे वर्षवार सविस्तर भाकीत." },
    { id: "14", title: "करिअर आणि व्यवसाय", desc: "नोकरी करावी की व्यवसाय? योग्य क्षेत्र कोणते?" },
    { id: "15", title: "पर्सनल ब्रँडिंग", desc: "लकी रंग, कपडे आणि व्हिजिटिंग कार्ड टिप्स." },
    { id: "16", title: "नातेसंबंध आणि विवाह", desc: "वैवाहिक सुख आणि जोडीदाराशी पटणारे सूर." },
  ];

  const ComparisonRow = ({ label, free, premium }: { label: string, free: string | boolean, premium: string | boolean }) => (
    <div className="grid grid-cols-3 gap-2 py-4 border-b border-gray-800 text-sm">
      <div className="text-gray-300 font-medium">{label}</div>
      <div className="text-center text-gray-400">
        {typeof free === 'boolean' ? (free ? <Check className="inline w-4 h-4 text-emerald-500" /> : <span className="text-gray-600">-</span>) : free}
      </div>
      <div className="text-center text-gold-400 font-semibold bg-gold-500/10 rounded">
        {typeof premium === 'boolean' ? (premium ? <Check className="inline w-4 h-4 text-gold-500" /> : '-') : premium}
      </div>
    </div>
  );

  return (
    <div className="bg-midnight text-gray-100 font-marathi pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-16 px-4 text-center bg-mystic-gradient">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold tracking-widest mb-4 border border-gold-500/30">
             प्रीमियम अंकशास्त्र
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            तुमचा <span className="text-transparent bg-clip-text bg-gold-gradient">जीवन मार्ग</span> शोधा
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            तुमच्या जन्म तारखेनुसार ५०+ पानांचा सविस्तर अहवाल मिळवा: करिअर, आरोग्य, नातेसंबंध आणि पुढील ५ वर्षांचे भविष्य.
          </p>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-12">
            
            {/* Free Card */}
            <div className="bg-deep-800 border border-gray-700 rounded-2xl p-6 relative hover:border-emerald-500 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Download className="w-6 h-6 text-emerald-500" />
                </div>
                <span className="bg-gray-700 text-xs font-bold px-2 py-1 rounded text-white">मोफत</span>
              </div>
              <h3 className="text-xl font-bold mb-1">मोफत अहवाल</h3>
              <p className="text-gray-400 text-sm mb-4">१० पानांचे मूलभूत विश्लेषण</p>
              <div className="text-3xl font-bold text-white mb-6">₹०</div>
              <ul className="text-left space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500" /> मूलभूत जन्म पत्रिका</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500" /> मूलांक आणि भाग्यांक</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500" /> चालू वर्षाचे भविष्य</li>
              </ul>
              <button 
                onClick={() => onStartReport('free')}
                className="w-full py-3 rounded-xl bg-gray-700 hover:bg-emerald-600 text-white font-semibold transition-all"
              >
                मोफत अहवाल मिळवा
              </button>
            </div>

            {/* Premium Card */}
            <div className="bg-deep-900 border-2 border-gold-500 rounded-2xl p-6 relative shadow-[0_0_30px_rgba(255,214,67,0.15)] scale-105 z-10">
              <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                शिफारस
              </div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gold-500/20 rounded-lg">
                  <Star className="w-6 h-6 text-gold-400" />
                </div>
                <div className="text-right">
                  <div className="text-red-400 line-through text-xs font-bold">₹९९९</div>
                  <div className="text-gold-400 text-xs font-bold animate-pulse">
                    ऑफर संपेल {timeLeft.m}:{timeLeft.s < 10 ? `०${timeLeft.s}` : timeLeft.s}
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1 text-white">प्रीमियम अहवाल</h3>
              <p className="text-gold-200 text-sm mb-4">५०+ पानांचे संपूर्ण विश्लेषण</p>
              <div className="text-4xl font-bold text-gold-500 mb-6">₹१११ <span className="text-sm font-normal text-gray-400">फक्त</span></div>
              <ul className="text-left space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex gap-2"><Check className="w-4 h-4 text-gold-500" /> <b className="text-white">५ वर्षांचे</b> सविस्तर भविष्य</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-gold-500" /> नाव आणि मोबाईल नंबर दुरुस्ती</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-gold-500" /> लाल किताब उपाय</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-gold-500" /> सर्व १६ प्रीमियम फीचर्स (खाली पहा)</li>
              </ul>
              <button 
                onClick={() => onStartReport('premium')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-bold shadow-lg transition-all"
              >
                प्रीमियम मिळवा - ₹१११
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 16 Point Premium Features Grid */}
      <div className="bg-deep-800 py-16 px-4 border-t border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="text-gold-500">प्रीमियम अहवालात</span> तुम्हाला काय मिळेल?
            </h2>
            <p className="text-gray-400">खालील १६ गोष्टींचे सविस्तर विश्लेषण</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuresList.map((feature) => (
               <div key={feature.id} className="bg-deep-900 border border-gray-700 p-6 rounded-xl hover:border-gold-500/50 transition-all hover:transform hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 font-bold text-6xl text-gold-500 group-hover:opacity-10 transition-opacity select-none font-serif">
                    {feature.id}
                  </div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center text-black font-bold mb-4 shadow-lg">
                      {feature.id}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
               </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
             <button 
                onClick={() => onStartReport('premium')}
                className="bg-gold-500 hover:bg-gold-400 text-black font-bold py-4 px-12 rounded-full shadow-[0_0_20px_rgba(255,214,67,0.3)] transition-all hover:scale-105 flex items-center gap-2 mx-auto"
              >
                आत्ताच अपग्रेड करा <ChevronDown className="rotate-[-90deg]" />
             </button>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-gold-400">तुलना करा</h2>
        <div className="bg-deep-800 rounded-xl p-6 border border-gray-700">
          <div className="grid grid-cols-3 gap-2 pb-4 border-b border-gray-700 font-bold text-sm">
            <div className="text-gray-400">वैशिष्ट्ये</div>
            <div className="text-center text-emerald-400">मोफत</div>
            <div className="text-center text-gold-400">प्रीमियम</div>
          </div>
          <ComparisonRow label="अहवाल पाने" free="१० पाने" premium="५०+ पाने" />
          <ComparisonRow label="जन्म पत्रिका" free={true} premium={true} />
          <ComparisonRow label="भविष्य" free="१ वर्ष" premium="५ वर्षे" />
          <ComparisonRow label="मोबाईल विश्लेषण" free={false} premium={true} />
          <ComparisonRow label="नाव दुरुस्ती" free={false} premium={true} />
          <ComparisonRow label="लाल किताब उपाय" free={false} premium={true} />
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-deep-900 py-12 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
             <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
               <Shield className="text-gold-400" />
             </div>
             <h4 className="font-bold text-sm">१००% गोपनीयता</h4>
          </div>
          <div>
             <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
               <Award className="text-gold-400" />
             </div>
             <h4 className="font-bold text-sm">अचूक</h4>
          </div>
          <div>
             <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
               <Download className="text-gold-400" />
             </div>
             <h4 className="font-bold text-sm">झटपट PDF</h4>
          </div>
          <div>
             <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
               <Lock className="text-gold-400" />
             </div>
             <h4 className="font-bold text-sm">सुरक्षित पेमेंट</h4>
          </div>
        </div>
      </div>

    </div>
  );
};