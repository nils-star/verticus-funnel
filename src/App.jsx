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
  Lock,
  Loader2 // Lade-Icon
} from 'lucide-react';

// --- KONFIGURATION ---

// 1. Deine Formspree Form-ID
const FORMSPREE_ID = "mwpygkje"; 

// 2. Ziel-URL nach erfolgreichem Eintrag
const REDIRECT_URL = "https://verticus-gmbh.onepage.me/kontaktdaten";

// ---------------------

const App = () => {
  const [step, setStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Status für den Sende-Vorgang
  
  const [formData, setFormData] = useState({
    insuranceType: '',
    age: '',
    jobStatus: '',
    income: '',
    healthIssues: [],
    familyStatus: '',
    blacklist: '',
    // Kontaktdaten
    fullName: '',
    email: '',
    phone: ''
  });

  const totalSteps = 7;

  // --- Handlers ---
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

  // --- WICHTIG: Die Speicher- & Weiterleitungs-Logik ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Button deaktivieren & Lade-Icon zeigen

    try {
      // 1. Daten an Formspree senden
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json' // Wichtig: Verhindert Formspree-Weiterleitung
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // 2. Wenn erfolgreich gespeichert: Weiterleiten
        try {
          window.top.location.href = REDIRECT_URL;
        } catch (e) {
          window.open(REDIRECT_URL, '_blank');
        }
      } else {
        alert("Hoppla, da ist etwas schiefgelaufen. Bitte versuche es erneut.");
        setIsSubmitting(false);
      }
    } catch (error) {
      alert("Netzwerkfehler. Bitte prüfe deine Verbindung.");
      setIsSubmitting(false);
    }
  };

  // --- Render Logic ---
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
          </QuestionStep>
        );

      case 6: // Familie
        return (
          <QuestionStep 
            title="Wie sieht deine Familiensituation aus?"
            icon={<Users className="w-8 h-8 text-blue-600" />}
          >
            <OptionButton 
              label="Ich versichere mich alleine" 
              selected={formData.familyStatus === 'Single'}
              onClick={() => handleChange('familyStatus', 'Single')} 
            />
            <OptionButton 
              label="Mit Ehepartner / Kindern" 
              subLabel="(Familienversicherung relevant)"
              selected={formData.familyStatus === 'Family'}
              onClick={() => handleChange('familyStatus', 'Family')} 
            />
          </QuestionStep>
        );

      case 7: // Blacklist
        return (
          <QuestionStep 
            title="Gibt es Versicherer, die du ausschließt?"
            subtitle="Oder hast du bereits Ablehnungen erhalten?"
            icon={<Building className="w-8 h-8 text-blue-600" />}
            showNextButton
            onNext={handleNext}
          >
            <textarea
              value={formData.blacklist}
              onChange={(e) => setFormData({...formData, blacklist: e.target.value})}
              placeholder="z.B. 'Schlechte Erfahrung mit XY' oder 'Wurde bei Z abgelehnt' (Optional)"
              className="w-full p-4 border-2 border-slate-200 rounded-xl h-32 focus:border-blue-600 focus:outline-none resize-none mb-2"
            />
            <div className="text-center">
               <button 
                onClick={() => { setFormData({...formData, blacklist: 'Nein'}); handleNext(); }}
                className="text-slate-400 hover:text-slate-600 text-sm font-medium py-2"
              >
                Nein, keine Einschränkungen
              </button>
            </div>
          </QuestionStep>
        );

      case 8: // Result Page (The Pitch)
        return <ResultPage formData={formData} onNextStep={() => setStep(9)} />;
      
      case 9: // Opt-In / Squeeze Page
        return (
          <div className="w-full animate-slide-up">
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Analyse & Experteneinschätzung sichern
              </h2>
              <p className="text-slate-500">
                Der letzte Schritt zu deiner optimierten PKV.
              </p>
            </div>

            {/* Value Proposition Box */}
            <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 mb-8 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                Das erwartet dich im Expertengespräch:
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-1 rounded-full mt-1 shrink-0">
                    <Euro className="w-4 h-4 text-green-700" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Einsparpotenzial realisieren</span>
                    <span className="text-sm text-slate-600">Wir prüfen exakt, wie viel du durch einen Wechsel sparen kannst.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-1 rounded-full mt-1 shrink-0">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Stabile Beiträge im Alter</span>
                    <span className="text-sm text-slate-600">Empfehlung leistungsstarker Tarife, die auch langfristig bezahlbar bleiben.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-1 rounded-full mt-1 shrink-0">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Fehlervermeidung</span>
                    <span className="text-sm text-slate-600">Aufklärung über häufige Fallstricke bei der Tarifauswahl.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Opt-In Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vor- & Nachname</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full pl-10 p-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none"
                    placeholder="Max Mustermann"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-Mail Adresse</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 p-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none"
                    placeholder="max@beispiel.de"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Handynummer (für Rückfragen)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-10 p-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none"
                    placeholder="0171 12345678"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg mt-6 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Wird verarbeitet...
                  </>
                ) : (
                  <>
                    Kostenlos anfordern <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              <p className="text-xs text-slate-400 text-center mt-4 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Deine Daten werden sicher & verschlüsselt übertragen.
              </p>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  // Loading Screen Logic
  if (isCalculating) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Deine Daten werden analysiert...</h2>
        <p className="text-slate-500">Prüfung der Tarife (Stand: 2025/26)</p>
        <div className="mt-8 w-full max-w-xs bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className="bg-blue-600 h-full rounded-full animate-progress"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Progress Bar */}
      {step > 0 && step < 9 && (
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <button onClick={handleBack} className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 mx-6">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${(step / 9) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-sm font-medium text-slate-400 w-6 text-right">
            {step < 8 ? `${step}/7` : ''}
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        {renderStep()}
      </main>

      {step === 0 && (
        <footer className="p-6 text-center text-xs text-slate-400">
          &copy; 2025 Verticus Finanzmanagement
        </footer>
      )}
    </div>
  );
};

// --- COMPONENTS ---

const QuestionStep = ({ title, subtitle, icon, children, showNextButton, onNext, disableNext }) => (
  <div className="w-full animate-slide-up">
    <div className="flex flex-col items-center text-center mb-8">
      <div className="bg-blue-50 p-3 rounded-full mb-4">
        {icon}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-500 text-lg leading-relaxed max-w-lg">
          {subtitle}
        </p>
      )}
    </div>
    <div className="space-y-3 w-full">
      {children}
    </div>
    {showNextButton && (
      <button 
        onClick={onNext}
        disabled={disableNext}
        className={`mt-8 w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
          disableNext 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-200/50'
        }`}
      >
        Weiter <ArrowRight className="w-5 h-5" />
      </button>
    )}
  </div>
);

const OptionButton = ({ label, subLabel, selected, onClick, highlight, compact }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
      selected 
        ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
        : 'border-slate-200 hover:border-blue-400 bg-white hover:shadow-md'
    } ${compact ? 'py-3' : 'py-4'}`}
  >
    <div>
      <div className={`font-bold ${selected ? 'text-blue-900' : 'text-slate-700'} ${highlight ? 'text-blue-600' : ''}`}>
        {label}
      </div>
      {subLabel && (
        <div className={`text-sm mt-1 ${selected ? 'text-blue-600' : 'text-slate-400'}`}>
          {subLabel}
        </div>
      )}
    </div>
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
      selected ? 'border-blue-600 bg-blue-600' : 'border-slate-200 group-hover:border-blue-300'
    }`}>
      {selected && <CheckCircle2 className="w-4 h-4 text-white" />}
    </div>
  </button>
);

const ResultPage = ({ formData, onNextStep }) => {
  const isEligible = (formData.income === '>77400' || formData.jobStatus === 'Selbstständig' || formData.jobStatus === 'GGF' || formData.jobStatus === 'Beamter');
  const hasHealthIssues = formData.healthIssues.length > 0;
  
  // --- ANPASSUNG BEAMTE ---
  // Standardwert: 350-600€
  // Beamte: 50-90€
  let potentialSavings = "350€ - 600€";
  if (formData.jobStatus === 'Beamter') {
    potentialSavings = "50€ - 90€";
  }

  return (
    <div className="w-full animate-fade-in bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-slate-900 text-white p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-400 to-blue-500"></div>
        <div className="relative z-10">
          <h3 className="text-blue-300 font-bold tracking-wider uppercase text-sm mb-2">Analyse Abgeschlossen</h3>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Ergebnis verfügbar
          </h2>
          <p className="text-slate-400">ID: {Math.floor(Math.random() * 100000)} • {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className={`rounded-xl p-6 mb-8 flex items-start gap-4 ${isEligible && !hasHealthIssues ? 'bg-green-50 border border-green-100' : 'bg-amber-50 border border-amber-100'}`}>
          <div className={`p-3 rounded-full shrink-0 ${isEligible && !hasHealthIssues ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {isEligible && !hasHealthIssues ? <ThumbsUp className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>
          <div>
            <h4 className={`font-bold text-xl mb-1 ${isEligible && !hasHealthIssues ? 'text-green-900' : 'text-amber-900'}`}>
              {isEligible && !hasHealthIssues ? "Hohes Potenzial erkannt" : "Individuelle Prüfung notwendig"}
            </h4>
            <p className={`text-sm ${isEligible && !hasHealthIssues ? 'text-green-800' : 'text-amber-800'}`}>
              {isEligible && !hasHealthIssues 
                ? "Basierend auf deinen Angaben erfüllst du die Kriterien für einen Wechsel in leistungsstärkere Tarife."
                : "Aufgrund deiner Angaben (Einkommen oder Gesundheitsstatus) ist eine manuelle Prüfung durch einen Experten zwingend erforderlich."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Mögliche Ersparnis / Monat</div>
            <div className="text-2xl font-bold text-blue-600">{potentialSavings}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Tarifauswahl</div>
            <div className="text-2xl font-bold text-slate-800">&gt; 2.000 Tarife</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Status</div>
            <div className="text-lg font-semibold text-slate-800">{formData.jobStatus}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
             <div className="text-xs text-slate-500 uppercase font-bold mb-1">Vorerkrankungen</div>
             <div className="text-lg font-semibold text-slate-800">{hasHealthIssues ? 'Vorhanden' : 'Keine Angabe'}</div>
          </div>
        </div>

        <div className="text-center border-t border-slate-100 pt-6">
          <p className="text-slate-600 mb-6">
            Um das genaue Einsparpotenzial zu berechnen und dir Leistungsstarke Tarife zu empfehlen, die selbst im Alter preiswert bleiben, benötigen wir ein kurzes Expertengespräch.
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={onNextStep}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-blue-200/50 transition-all flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Ergebnis jetzt per Mail anfordern
            </button>
            
            <button 
              onClick={onNextStep}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-bold py-4 px-8 rounded-xl transition-all"
            >
              Termin vereinbaren
            </button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4 text-slate-400 text-xs grayscale opacity-70">
            <span>Bekannt aus:</span>
            <div className="font-serif font-bold">FOCUS</div>
            <div className="font-serif font-bold">Handelsblatt</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
