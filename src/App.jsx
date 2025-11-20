import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Euro, 
  Activity, 
  Users, 
  Briefcase, 
  AlertTriangle,
  ThumbsUp,
  Building,
  Calculator,
  Phone,
  Mail,
  User,
  Send
} from 'lucide-react';

// WICHTIG: Hier deine Formspree-ID einfügen (die 8 Zeichen am Ende der URL)
const FORMSPREE_ID = "HIER_DEINE_ID_EINTRAGEN"; 

const App = () => {
  const [step, setStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    insuranceType: '',
    age: '',
    jobStatus: '',
    income: '',
    healthIssues: [],
    familyStatus: '',
    blacklist: '',
    // Kontaktfelder
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const totalSteps = 7;

  // Handlers
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      finishFunnel();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(prev => prev - 1);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (['insuranceType', 'jobStatus', 'income', 'familyStatus'].includes(field)) {
      setTimeout(() => handleNext(), 300);
    }
  };

  const handleHealthToggle = (issue) => {
    setFormData(prev => {
      const current = prev.healthIssues;
      if (issue === 'Keine') return { ...prev, healthIssues: [] };
      
      let newIssues;
      if (current.includes(issue)) {
        newIssues = current.filter(i => i !== issue);
      } else {
        newIssues = [...current.filter(i => i !== 'Keine'), issue];
      }
      return { ...prev, healthIssues: newIssues };
    });
  };

  const finishFunnel = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setStep(8); // Result Step
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSuccess(true);
        setStep(10); // Success Page
      } else {
        alert("Es gab einen Fehler beim Senden. Bitte versuche es erneut.");
      }
    } catch (error) {
      alert("Netzwerkfehler. Bitte überprüfe deine Verbindung.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Logic
  const renderStep = () => {
    switch (step) {
      case 0: // Intro
        return (
          <div className="text-center py-8 animate-fade-in">
            <div className="bg-blue-50 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
              <Calculator className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Der 60-Sekunden PKV-Check
            </h1>
            <p className="text-slate-600 mb-8 text-lg max-w-md mx-auto">
              Finde jetzt heraus, wie hoch dein tatsächliches Sparpotenzial ist und ob ein Wechsel für dich sinnvoll ist.
            </p>
            <button 
              onClick={() => setStep(1)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all w-full md:w-auto flex items-center justify-center mx-auto gap-2"
            >
              Jetzt Analyse starten <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-4 text-sm text-slate-400">Dauert weniger als 60 Sekunden. Kostenlos & unverbindlich.</p>
          </div>
        );

      case 1: // Status
        return (
          <QuestionStep 
            title="Wie bist du aktuell versichert?"
            icon={<ShieldCheck className="w-8 h-8 text-blue-600" />}
          >
            <OptionButton 
              label="Gesetzliche Krankenversicherung (GKV)" 
              selected={formData.insuranceType === 'GKV'}
              onClick={() => handleChange('insuranceType', 'GKV')} 
            />
            <OptionButton 
              label="Private Krankenversicherung (PKV)" 
              selected={formData.insuranceType === 'PKV'}
              onClick={() => handleChange('insuranceType', 'PKV')} 
            />
          </QuestionStep>
        );

      case 2: // Alter
        return (
          <QuestionStep 
            title="Wie alt bist du?"
            subtitle="Dein Alter ist ein wichtiger Faktor für die Beitragsberechnung."
            icon={<Users className="w-8 h-8 text-blue-600" />}
            showNextButton
            onNext={handleNext}
            disableNext={!formData.age}
          >
            <div className="max-w-xs mx-auto">
              <input 
                type="number" 
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                placeholder="z.B. 35"
                className="w-full text-center text-3xl p-4 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                autoFocus
              />
            </div>
          </QuestionStep>
        );

      case 3: // Beruf
        return (
          <QuestionStep 
            title="Was ist dein aktueller Berufsstatus?"
            icon={<Briefcase className="w-8 h-8 text-blue-600" />}
          >
            <OptionButton 
              label="Angestellter" 
              selected={formData.jobStatus === 'Angestellter'}
              onClick={() => handleChange('jobStatus', 'Angestellter')} 
            />
            <OptionButton 
              label="Selbstständige / Freiberufler" 
              selected={formData.jobStatus === 'Selbstständig'}
              onClick={() => handleChange('jobStatus', 'Selbstständig')} 
            />
            <OptionButton 
              label="Gesellschafter-Geschäftsführer" 
              subLabel="(Angestellt in eigener GmbH)"
              selected={formData.jobStatus === 'GGF'}
              onClick={() => handleChange('jobStatus', 'GGF')} 
            />
             <OptionButton 
              label="Beamter / Beamtenanwärter" 
              selected={formData.jobStatus === 'Beamter'}
              onClick={() => handleChange('jobStatus', 'Beamter')} 
            />
          </QuestionStep>
        );

      case 4: // Einkommen
        return (
          <QuestionStep 
            title="Wie hoch ist dein Jahresbruttoeinkommen?"
            subtitle="Relevant für die Versicherungspflichtgrenze (JAEG)."
            icon={<Euro className="w-8 h-8 text-blue-600" />}
          >
            <div className="grid grid-cols-1 gap-3">
              {['Bis 30.000 €', '30.000 € - 50.000 €', '50.000 € - 60.000 €', '60.000 € - 70.000 €', '70.000 € - 77.400 €'].map((band) => (
                <OptionButton 
                  key={band}
                  label={band} 
                  compact
                  selected={formData.income === band}
                  onClick={() => handleChange('income', band)} 
                />
              ))}
              <OptionButton 
                label="Über 77.400 €" 
                subLabel="(Über JAEG Grenze 2026)"
                selected={formData.income === '>77400'}
                onClick={() => handleChange('income', '>77400')} 
                highlight
              />
            </div>
          </QuestionStep>
        );

      case 5: // Gesundheit KO
        return (
          <QuestionStep 
            title="Bestehen oder bestanden folgende Diagnosen?"
            subtitle="Bitte wähle ehrlich aus. Dies dient einer realistischen Ersteinschätzung."
            icon={<Activity className="w-8 h-8 text-blue-600" />}
            showNextButton
            onNext={handleNext}
          >
            <div className="space-y-3 mb-6">
              {[
                'Laufende Psychotherapie', 
                'Schlaganfall', 
                'Herzinfarkt / Hinterwandinfarkt', 
                'Diagnostizierter Autismus'
              ].map((issue) => (
                <div 
                  key={issue}
                  onClick={() => handleHealthToggle(issue)}
                  className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                    formData.healthIssues.includes(issue) 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                    formData.healthIssues.includes(issue) ? 'border-red-500 bg-red-500' : 'border-slate-300'
                  }`}>
                    {formData.healthIssues.includes(issue) && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <span className="font-medium">{issue}</span>
                </div>
              ))}

              <div 
                onClick={() => handleHealthToggle('Keine')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all mt-6 ${
                  formData.healthIssues.length === 0 
                    ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' 
                    : 'border-slate-200 hover:border-green-300'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                   formData.healthIssues.length === 0 ? 'border-green-500 bg-green-500' : 'border-slate-300'
                }`}>
                  {formData.healthIssues.length === 0 && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className="font-medium">Keine der genannten Diagnosen</span>
              </div>
            </div>
          </QuestionStep
