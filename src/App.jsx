import React, { useState, useEffect, useRef, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'; 
import { 
  Menu, X, Phone, Mail, ChevronRight, Star, 
  ShieldCheck, Thermometer, Ruler, PenTool, 
  MapPin, Clock, CheckCircle, ArrowRight,
  Maximize, Lock, Sun, Wind, Umbrella, FileText, Layout,
  Facebook, Instagram, Linkedin
} from 'lucide-react';

// --- Composants UI ---

const Button = ({ children, variant = 'primary', className = '', onClick, type = 'button', disabled = false }) => {
  const baseStyle = "px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-amber-500 hover:bg-amber-600 text-white border border-amber-500",
    secondary: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",
    outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900",
    ghost: "bg-transparent text-slate-700 hover:text-blue-700 shadow-none hover:translate-y-0"
  };

  return (
    <button type={type} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

const SectionTitle = ({ title, subtitle, centered = true, theme = 'light', className = '', titleSize = 'text-3xl md:text-4xl' }) => (
  <div className={`mb-8 md:mb-12 ${centered ? 'text-center' : 'text-left'} ${className}`}>
    <h2 className={`${titleSize} font-serif font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
      {title}
    </h2>
    <div className={`h-1 w-24 bg-amber-500 rounded mb-6 ${centered ? 'mx-auto' : ''}`}></div>
    {subtitle && <p className={`text-lg max-w-2xl ${centered ? 'mx-auto' : ''} ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{subtitle}</p>}
  </div>
);

const Card = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-slate-100 ${className}`}>
    {children}
  </div>
);

// --- Formulaire de Conversion (INTEGRATION EMAILJS) ---

const LeadForm = ({ compact = false, subject = '' }) => {
  const form = useRef();
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const sendEmail = useCallback(async (e) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      console.log('reCAPTCHA non chargé');
      return;
    }

    setIsSending(true);

    try {
      // Obtenir le token reCAPTCHA v3
      const recaptchaToken = await executeRecaptcha('contact_form');

      // Ajouter le token au formulaire (champ caché)
      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = 'g-recaptcha-response';
      hiddenInput.value = recaptchaToken;
      form.current.appendChild(hiddenInput);

      const SERVICE_ID = 'service_os7pi6x';
      const TEMPLATE_ID = 'template_knr9ro7';
      const PUBLIC_KEY = 'Od5g3ybRVdYBOBT53';

      const result = await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY);
      console.log('Email envoyé avec succès !', result.text);
      setSubmitted(true);
      setIsSending(false);
      e.target.reset();
      setTimeout(() => setSubmitted(false), 8000);
    } catch (error) {
      console.log('Erreur envoi:', error);
      setIsSending(false);
      alert("Une erreur est survenue lors de l'envoi. Contactez-nous au 01 42 52 10 00.");
    }
  }, [executeRecaptcha]);

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center animate-fade-in">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">Demande reçue !</h3>
        <p className="text-green-700">Merci de votre confiance. Un expert InterPlus vous rappellera sous 24h.</p>
      </div>
    );
  }

  return (
    <form ref={form} onSubmit={sendEmail} className={`bg-white p-6 md:p-8 rounded-xl shadow-2xl border-t-4 border-amber-500 ${compact ? '' : 'max-w-xl mx-auto'}`}>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Devis gratuit & rapide</h3>
      <p className="text-slate-500 mb-6 text-sm">
        {subject ? `Pour votre projet : ${subject}` : "Recevez votre estimation sous 24h. Sans engagement."}
      </p>
      
      {/* Champ caché pour le sujet/contexte si présent */}
      <input type="hidden" name="context_subject" value={subject || "Demande générale"} />

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ajout des attributs name="..." pour EmailJS */}
          <input required type="text" name="user_name" placeholder="Votre Nom" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition" />
          <input required type="tel" name="user_phone" placeholder="Téléphone" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition" />
        </div>
        <input required type="email" name="user_email" placeholder="Email" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition" />
        
        <select name="project_type" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition text-slate-700">
          <option value="Non spécifié">Type de projet...</option>
          <option value="Rénovation complète">Rénovation complète</option>
          <option value="Construction neuve">Construction neuve</option>
          <option value="Remplacement unitaire">Remplacement unitaire</option>
          <option value="Réparation">Réparation / SAV</option>
        </select>
        
        <textarea name="message" placeholder="Décrivez votre projet (dimensions, matériaux souhaités...)" rows="3" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"></textarea>
        
        <Button type="submit" variant="primary" className="w-full text-lg" disabled={isSending}>
          {isSending ? 'Envoi en cours...' : 'Recevoir mon devis'}
          {!isSending && <ArrowRight className="w-5 h-5" />}
        </Button>
        <p className="text-xs text-slate-400 text-center mt-2">Vos données restent confidentielles.</p>
      </div>
    </form>
  );
};

// --- Données Produits ---

const productsData = {
  alu: {
    id: 'alu',
    title: "Fenêtres Aluminium Schüco",
    subtitle: "L'alliance parfaite du design minimaliste et de la performance thermique.",
    heroImg: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
    desc: "Nos fenêtres en aluminium Schüco AWS (Aluminium Window System) offrent une finesse de profilés inégalée pour un clair de jour maximal. Idéales pour les architectures contemporaines, elles intègrent une rupture de pont thermique avancée pour répondre aux normes environnementales les plus strictes (RT2020).",
    features: [
      { icon: Sun, title: "Luminosité Maximale", text: "Ouvrants cachés disponibles pour 15% de lumière en plus." },
      { icon: ShieldCheck, title: "Sécurité Certifiée", text: "Résistance à l'effraction jusqu'à RC3." },
      { icon: Thermometer, title: "Isolation Thermique", text: "Coefficient Uw jusqu'à 0.9 W/m²K." },
      { icon: PenTool, title: "Design Sur-Mesure", text: "Large choix de poignées design et plus de 200 coloris RAL." }
    ],
    details: [
      "Profilés Schüco AWS 75.SI+ haute isolation",
      "Vitrage : Double ou Triple vitrage isolant (jusqu'à 61mm)",
      "Ferrure : Schüco AvanTec SimplySmart (invisible)",
      "Étanchéité : Triple barrière de joints EPDM"
    ]
  },
  pvc: {
    id: 'pvc',
    title: "Fenêtres PVC Premium",
    subtitle: "La performance thermique absolue sans compromis sur l'esthétique.",
    heroImg: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    desc: "Le système Schüco LivIng fixe de nouveaux standards en matière de confort et de sécurité. Avec ses 7 chambres d'isolation, c'est la solution idéale pour réduire drastiquement vos factures d'énergie tout en bénéficiant d'une isolation phonique exceptionnelle.",
    features: [
      { icon: Thermometer, title: "Isolation Passive", text: "Compatible maison passive avec un Uw jusqu'à 0.75 W/m²K." },
      { icon: Wind, title: "Silence Absolu", text: "Affaiblissement acoustique jusqu'à 48 dB." },
      { icon: CheckCircle, title: "Durabilité", text: "PVC sans plomb, stable aux UV et 100% recyclable." },
      { icon: PenTool, title: "Finitions Uniques", text: "Disponible en imitation bois ultra-réaliste ou laquage couleur." }
    ],
    details: [
      "Profilés Schüco LivIng 82 AS (7 chambres)",
      "Joints : Technologie EPDM soudable (premier mondial)",
      "Sécurité : Renforts en acier systématiques",
      "Garantie : 10 ans sur le profilé et la colorimétrie"
    ]
  },
  baie: {
    id: 'baie',
    title: "Baies Vitrées Coulissantes",
    subtitle: "Effacez les frontières entre votre intérieur et l'extérieur.",
    heroImg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    desc: "Les systèmes coulissants et levants-coulissants Schüco permettent de réaliser de très grandes ouvertures vitrées faciles à manœuvrer. Profitez d'une vue panoramique et d'un apport solaire gratuit en hiver grâce à nos solutions haute performance.",
    features: [
      { icon: Maximize, title: "Grandes Dimensions", text: "Jusqu'à 3m de hauteur et 300kg par vantail." },
      { icon: Ruler, title: "Seuil Plat PMR", text: "Encastrement possible pour un passage sans obstacle." },
      { icon: Lock, title: "Sécurité Renforcée", text: "Verrouillage multipoints et vitrage feuilleté de série." },
      { icon: Sun, title: "Confort d'usage", text: "Système de levage assisté 'SmartStop' pour une manipulation sans effort." }
    ],
    details: [
      "Système Schüco ASS 70.HI (Aluminium Sliding System)",
      "Type d'ouverture : Coulissant 2, 3, 4 rails ou Galandage",
      "Motorisation : Compatible Schüco TipTronic",
      "Isolation : Rupture de pont thermique par barrettes polyamide"
    ]
  },
  porte: {
    id: 'porte',
    title: "Portes d'Entrée Blindées",
    subtitle: "La première impression est la bonne. Sécurité et design d'exception.",
    heroImg: "https://images.unsplash.com/photo-1628744876497-eb30460be9f6?auto=format&fit=crop&w=1200&q=80",
    desc: "Votre porte d'entrée doit être impénétrable tout en reflétant votre style. Nos portes aluminium monobloc allient une épaisseur de 90mm pour l'isolation à des serrures automatiques 5 points pour votre tranquillité.",
    features: [
      { icon: ShieldCheck, title: "Haute Sécurité", text: "Serrure automatique 5 points crochets + pênes." },
      { icon: Thermometer, title: "Isolation Renforcée", text: "Panneau isolant de 70 à 90mm (Ud < 0.8)." },
      { icon: PenTool, title: "Personnalisation", text: "Inserts inox, vitrages sablés, barres de tirage LED." },
      { icon: Lock, title: "Domotique", text: "Lecteur d'empreinte digitale ou ouverture smartphone intégrable." }
    ],
    details: [
      "Système Schüco AD UP 90 (Aluminium Door Universal Platform)",
      "Charnières : Paumelles cachées ou rouleaux design",
      "Seuil : Aluminium à rupture de pont thermique (20mm)",
      "Vitrage : Triple vitrage feuilleté P4A sablé"
    ]
  },
  volet: {
    id: 'volet',
    title: "Volets Roulants & BSO",
    subtitle: "Sécurité, confort thermique et gestion intelligente de la lumière.",
    heroImg: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    desc: "Nos solutions de fermetures (Volets roulants et Brise-Soleil Orientables) renforcent l'isolation de vos fenêtres, sécurisent votre habitat et s'intègrent à votre système domotique pour une gestion autonome et confortable.",
    features: [
      { icon: Sun, title: "Gestion Solaire", text: "Maîtrisez la chaleur avec les lames orientables (BSO)." },
      { icon: ShieldCheck, title: "Sécurité", text: "Verrous automatiques anti-relevage et simulation de présence." },
      { icon: Thermometer, title: "Isolation", text: "Tablier aluminium isolé pour une barrière thermique additionnelle." },
      { icon: Lock, title: "Domotique", text: "Pilotage smartphone (Compatible Somfy/Schüco)." }
    ],
    details: [
      "Lames aluminium double paroi avec mousse isolante",
      "Motorisation silencieuse avec détection d'obstacles",
      "Coffres : Intérieurs, Extérieurs ou Tunnels",
      "Garantie : 7 ans sur la motorisation"
    ]
  },
  pergola: {
    id: 'pergola',
    title: "Pergolas Bioclimatiques",
    subtitle: "Profitez de votre terrasse en toutes saisons.",
    heroImg: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    desc: "Transformez votre terrasse en une véritable extension de votre maison. Nos pergolas bioclimatiques à lames orientables vous protègent du soleil et de la pluie tout en assurant une ventilation naturelle. Design épuré et structure aluminium robuste.",
    features: [
      { icon: Sun, title: "Bioclimatique", text: "Régulation naturelle de la température par lames orientables." },
      { icon: Wind, title: "Résistance Vent", text: "Structure testée pour résister aux vents violents." },
      { icon: Umbrella, title: "100% Étanche", text: "Évacuation des eaux de pluie intégrée aux poteaux." },
      { icon: PenTool, title: "Options Confort", text: "Éclairage LED, chauffage infrarouge et stores latéraux." }
    ],
    details: [
      "Structure 100% Aluminium extrudé thermolaqué",
      "Lames orientables motorisées jusqu'à 135°",
      "Capteurs pluie/vent pour fermeture automatique",
      "Dimensions sur-mesure (jusqu'à 7m sans poteau)"
    ]
  }
};

// --- Pages Légales ---

const LegalPage = () => (
  <div className="pt-24 pb-20 bg-white min-h-screen">
    <div className="container mx-auto px-4 max-w-4xl">
      <SectionTitle title="Mentions Légales" subtitle="Informations juridiques sur la société InterPlus Fenêtre." centered={false} />
      
      <div className="space-y-8 text-slate-700">
        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-2">1. Éditeur du Site</h3>
          <p>
            Le présent site est édité par la société <strong>InterPlus Fenêtre</strong>.<br/>
            <strong>Forme juridique :</strong> SAS au capital de 10 000 €<br/>
            <strong>Siège social :</strong> 17 Rue Gilberte Desnoyers, 93600, Aulnay-sous-Bois<br/>
            <strong>RCS :</strong> Bobigny B 123 456 789<br/>
            <strong>Numéro de TVA Intracommunautaire :</strong> FR 12 123456789<br/>
            <strong>Directeur de la publication :</strong> La Direction
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-2">2. Hébergement</h3>
          <p>
            Ce site est hébergé sur des serveurs sécurisés en Europe.<br/>
            Responsable technique : Service Informatique InterPlus.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-2">3. Propriété Intellectuelle</h3>
          <p>
            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-2">4. Contact</h3>
          <p>
            Pour toute question concernant ces mentions légales, vous pouvez nous contacter à :<br/>
            <strong>Email :</strong> <a href="mailto:contact@interplus-fenetre.fr" className="text-blue-600 hover:underline">contact@interplus-fenetre.fr</a><br/>
            <strong>Téléphone :</strong> 01 42 52 10 00
          </p>
        </section>
      </div>
    </div>
  </div>
);

const PrivacyPage = () => (
  <div className="pt-24 pb-20 bg-white min-h-screen">
    <div className="container mx-auto px-4 max-w-4xl">
      <SectionTitle title="Politique de Confidentialité" subtitle="Engagement sur la protection de vos données personnelles." centered={false} />
      
      <div className="space-y-8 text-slate-700">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <p className="text-sm">
            InterPlus Fenêtre s'engage à ce que la collecte et le traitement de vos données, effectués à partir du site interplus-fenetre.fr, soient conformes au règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.
          </p>
        </div>

        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-2">1. Données collectées</h3>
          <p>
            Nous limitons la collecte des données personnelles au strict nécessaire (minimisation des données). Les données collectées via notre formulaire de contact/devis (Nom, Email, Téléphone, Adresse, Projet) sont indispensables pour :
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Traiter votre demande de devis.</li>
            <li>Vous contacter pour un rendez-vous technique.</li>
            <li>Assurer le suivi commercial de votre projet.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-2">2. Destinataires des données</h3>
          <p>
            Les données personnelles recueillies sont traitées uniquement par les services internes d'InterPlus Fenêtre (commercial et technique). Aucune donnée n'est vendue ou transmise à des tiers à des fins publicitaires.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-2">3. Durée de conservation</h3>
          <p>
            Les données sont conservées pendant toute la durée de la relation commerciale et peuvent être archivées conformément aux durées légales de prescription (ex: 10 ans pour les factures et garanties décennales). Pour les prospects sans suite, les données sont conservées maximum 3 ans.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-2">4. Vos droits</h3>
          <p>
            Vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Vous pouvez exercer ces droits en nous contactant :
          </p>
          <div className="mt-2 pl-4 border-l-4 border-amber-500">
            <strong>Par courrier :</strong> DPO - InterPlus Fenêtre, 17 Rue Gilberte Desnoyers, 93600, Aulnay-sous-Bois<br/>
            <strong>Par email :</strong> contact@interplus-fenetre.fr
          </div>
        </section>
      </div>
    </div>
  </div>
);

const SitemapPage = ({ navigateTo }) => (
  <div className="pt-24 pb-20 bg-white min-h-screen">
    <div className="container mx-auto px-4 max-w-4xl">
      <SectionTitle title="Plan du site" subtitle="Vue d'ensemble de la navigation." centered={false} />
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Layout className="text-amber-500" /> Pages Principales
          </h3>
          <ul className="space-y-4">
            <li>
              <button onClick={() => navigateTo('home')} className="text-lg text-slate-700 hover:text-amber-500 flex items-center gap-2 transition-colors">
                <ChevronRight size={16} /> Accueil
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('products')} className="text-lg text-slate-700 hover:text-amber-500 flex items-center gap-2 transition-colors">
                <ChevronRight size={16} /> Nos Gammes de Fenêtres
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('gallery')} className="text-lg text-slate-700 hover:text-amber-500 flex items-center gap-2 transition-colors">
                <ChevronRight size={16} /> Réalisations
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('about')} className="text-lg text-slate-700 hover:text-amber-500 flex items-center gap-2 transition-colors">
                <ChevronRight size={16} /> L'Entreprise
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('contact')} className="text-lg text-slate-700 hover:text-amber-500 flex items-center gap-2 transition-colors">
                <ChevronRight size={16} /> Contact & Devis
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Star className="text-amber-500" /> Nos Produits
          </h3>
          <ul className="space-y-4">
            <li>
              <button onClick={() => navigateTo('product-alu')} className="text-lg text-slate-700 hover:text-amber-500 flex items-center gap-2 transition-colors">
                <ChevronRight size={16} /> Fenêtres Aluminium Schüco
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('product-pvc')} className="text-lg text-slate-700 hover:text-amber-500 flex items-center gap-2 transition-colors">
                <ChevronRight size={16} /> Fenêtres PVC Premium
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('product-baie')} className="text-lg text-slate-700 hover:text-amber-500 flex items-center gap-2 transition-colors">
                <ChevronRight size={16} /> Baies Vitrées Coulissantes
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('product-porte')} className="text-lg text-slate-700 hover:text-amber-500 flex items-center gap-2 transition-colors">
                <ChevronRight size={16} /> Portes d'Entrée Blindées
              </button>
            </li>
             <li>
              <button onClick={() => navigateTo('product-volet')} className="text-lg text-slate-700 hover:text-amber-500 flex items-center gap-2 transition-colors">
                <ChevronRight size={16} /> Volets Roulants & BSO
              </button>
            </li>
             <li>
              <button onClick={() => navigateTo('product-pergola')} className="text-lg text-slate-700 hover:text-amber-500 flex items-center gap-2 transition-colors">
                <ChevronRight size={16} /> Pergolas Bioclimatiques
              </button>
            </li>
          </ul>

          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 mt-10 flex items-center gap-2">
            <FileText className="text-amber-500" /> Informations
          </h3>
          <ul className="space-y-4">
            <li>
              <button onClick={() => navigateTo('legal')} className="text-lg text-slate-700 hover:text-amber-500 flex items-center gap-2 transition-colors">
                <ChevronRight size={16} /> Mentions Légales
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('privacy')} className="text-lg text-slate-700 hover:text-amber-500 flex items-center gap-2 transition-colors">
                <ChevronRight size={16} /> Politique de Confidentialité
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// --- Composant Page Produit ---

const ProductDetailPage = ({ product, navigateTo }) => (
  <div className="pt-24 pb-20 bg-white min-h-screen">
    {/* Hero Produit */}
    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
      <img src={product.heroImg} alt={product.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-center px-4">
        <div className="max-w-4xl animate-fade-in-up">
          <span className="inline-block bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Gamme Premium</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">{product.title}</h1>
          <p className="text-xl text-slate-200">{product.subtitle}</p>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-4 py-16">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Contenu Principal */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <SectionTitle title="Description & Bénéfices" subtitle="Pourquoi choisir cette solution pour votre habitat ?" centered={false} />
            <p className="text-lg text-slate-700 leading-relaxed mb-8">
              {product.desc}
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {product.features.map((feature, idx) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex gap-4">
                  <div className="bg-white p-3 rounded-full h-fit shadow-sm text-amber-500">
                    <feature.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-slate-600">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-2xl">
            <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
              <Ruler className="text-amber-500"/> Caractéristiques Techniques
            </h3>
            <ul className="space-y-4">
              {product.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle className="text-green-500 min-w-[20px] mt-1" size={20} />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar / Formulaire */}
        <div className="lg:col-span-1">
          <div className="sticky top-32">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 text-center">
              <h4 className="font-bold text-amber-900 text-lg mb-2">Partenaire Officiel Schüco</h4>
              <p className="text-sm text-amber-800 mb-4">L'assurance d'une fabrication et d'une pose conformes aux standards allemands.</p>
              <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto opacity-80" />
            </div>
            <LeadForm compact subject={product.title} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Pages ---

const HomePage = ({ navigateTo }) => (
  <>
    {/* Styles personnalisés pour l'animation douce */}
    <style>{`
      @keyframes subtle-pulse {
        0%, 100% { transform: scale(1); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        50% { transform: scale(1.02); box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      }
      .animate-subtle-pulse {
        animation: subtle-pulse 2s infinite ease-in-out;
      }
    `}</style>

    {/* Hero Section */}
    <section className="relative min-h-[90vh] flex items-center bg-slate-900 overflow-hidden">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 opacity-40">
        <img 
          src="https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
          alt="Fenêtres modernes Schüco" 
          className="w-full h-full object-cover"
        />
      </div>
      {/* Gradient réduit pour plus de transparence */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center pt-20">
        <div className="space-y-6 animate-fade-in-up">
          <div className="inline-block bg-slate-800/80 backdrop-blur border border-slate-600 rounded-full px-4 py-1 text-amber-400 text-sm font-semibold mb-2">
            ★ Partenaire Officiel Schüco
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
            L'excellence de la <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">fenêtre sur mesure</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-lg">
            Alliez design, sécurité et isolation thermique. InterPlus Fenêtre installe vos menuiseries Schüco avec une précision artisanale en Île-de-France.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button variant="primary" onClick={() => navigateTo('contact')}>Demander un devis gratuit</Button>
            <Button variant="outline" onClick={() => navigateTo('products')}>Découvrir nos gammes</Button>
          </div>
          <div className="flex items-center gap-6 pt-8 pb-8 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" /> +10 ans d'expérience
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" /> Garantie décennale
            </div>
          </div>
        </div>
        
        {/* Desktop Only Lead Form Preview */}
        <div className="hidden md:block animate-fade-in-right delay-200">
          <LeadForm compact />
        </div>
      </div>
    </section>

    {/* Réassurance / Logos */}
    <section className="bg-slate-100 py-10 border-b border-slate-200">
      <div className="container mx-auto px-4">
        <p className="text-center text-slate-500 uppercase tracking-widest text-sm font-bold mb-6">Ils nous font confiance & Certifications</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ShieldCheck className="w-8 h-8"/> SCHÜCO</div>
          <div className="text-xl font-bold text-slate-800">RGE QUALIBAT</div>
          <div className="text-xl font-bold text-slate-800">CSTB Certifié</div>
          <div className="text-xl font-bold text-slate-800">CEKAL</div>
        </div>
      </div>
    </section>

    {/* Section Produits */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Nos Solutions Premium" 
          subtitle="Des matériaux nobles et une technologie de pointe pour votre confort." 
        />
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { id: 'alu', title: 'Fenêtres Aluminium', desc: 'Finesse, robustesse et luminosité maximale. La signature Schüco.', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', badge: 'Best-Seller' },
            { id: 'pvc', title: 'Fenêtres PVC', desc: 'Le meilleur rapport qualité/prix avec une isolation thermique exceptionnelle.', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
            { id: 'baie', title: 'Baies Vitrées', desc: 'Ouvrez votre intérieur sur l\'extérieur. Coulissants haute performance.', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' }
          ].map((item, idx) => (
            <Card key={idx} className="group cursor-pointer" onClick={() => navigateTo(`product-${item.id}`)}>
              <div className="relative h-64 overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                {item.badge && <span className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">{item.badge}</span>}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 mb-4">{item.desc}</p>
                <span className="text-blue-700 font-semibold flex items-center gap-1 group-hover:gap-3 transition-all">
                  Découvrir <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
           <Button variant="outline" className="!text-slate-900 !border-slate-300 hover:!bg-slate-100 mx-auto" onClick={() => navigateTo('product-porte')}>
              Découvrir aussi nos Portes Blindées
           </Button>
        </div>
      </div>
    </section>

    {/* Pourquoi InterPlus */}
    <section className="py-12 md:py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionTitle 
              title="Pourquoi choisir InterPlus Fenêtre ?" 
              subtitle="Plus qu'un installateur, un partenaire de confiance."
              centered={false}
              theme="dark"
              className="mb-8"
            />
            <div className="space-y-6 mt-4">
              {[
                { icon: Thermometer, title: "Isolation Maximale", text: "Réduisez votre facture énergétique jusqu'à 30% grâce à nos profilés haute performance." },
                { icon: ShieldCheck, title: "Sécurité Renforcée", text: "Vitrages anti-effraction et quincaillerie de sécurité Schüco intégrée." },
                { icon: PenTool, title: "Pose Certifiée", text: "Nos propres équipes de poseurs, formés aux dernières normes DTU." },
                { icon: Ruler, title: "100% Sur Mesure", text: "Chaque fenêtre est fabriquée au millimètre près pour s'adapter parfaitement à votre habitat." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-blue-600/20 p-3 rounded-lg h-fit">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{feature.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500 rounded-2xl transform translate-x-4 translate-y-4"></div>
            <img 
              src="https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=800&q=80" 
              alt="Poseur InterPlus" 
              className="relative rounded-2xl shadow-2xl w-full object-cover h-[500px]"
            />
            <div className="absolute bottom-10 left-[-20px] bg-white text-slate-900 p-6 rounded-lg shadow-xl max-w-xs hidden md:block">
              <div className="flex text-amber-500 mb-2">
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
              </div>
              <p className="font-serif italic text-sm">"Une équipe ponctuelle et un chantier laissé impeccable. La qualité des fenêtres change vraiment la vie !"</p>
              <p className="text-xs font-bold mt-2 text-slate-500">- Marc D., Versailles</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Section Témoignages */}
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <SectionTitle title="La satisfaction de nos clients" subtitle="La meilleure preuve de notre expertise." />
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Sophie L.", loc: "Paris 16ème", text: "Nous cherchions des menuiseries haut de gamme pour notre appartement haussmannien. Le rendu Aluminium Schüco est magnifique." },
            { name: "Thomas B.", loc: "Boulogne", text: "Service commercial à l'écoute et installation rapide. L'isolation phonique est impressionnante, je n'entends plus la rue." },
            { name: "Valérie M.", loc: "Saint-Germain", text: "Je recommande InterPlus pour leur sérieux. Devis respecté et finitions parfaites." }
          ].map((avis, i) => (
            <Card key={i} className="p-8">
              <div className="flex items-center gap-1 mb-4 text-amber-500">
                {[1,2,3,4,5].map(s => <Star key={s} size={18} fill="currentColor" />)}
              </div>
              <p className="text-slate-700 italic mb-6">"{avis.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                  {avis.name[0]}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">{avis.name}</h5>
                  <span className="text-xs text-slate-500">{avis.loc}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button variant="outline" className="!text-slate-600 !border-slate-300 hover:!bg-slate-100 mx-auto">
            Voir plus d'avis sur Google
          </Button>
        </div>
      </div>
    </section>

    {/* Mobile CTA Sticky */}
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
       <Button variant="primary" className="w-full shadow-2xl animate-subtle-pulse" onClick={() => navigateTo('contact')}>
         Demander un devis gratuit
       </Button>
    </div>
  </>
);

const ProductsPage = ({ navigateTo }) => (
  <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
    <div className="container mx-auto px-4">
      <SectionTitle title="Nos Gammes de Fenêtres" subtitle="Partenaire Schüco, nous vous offrons l'excellence technique et esthétique." />
      
      {/* Aluminium */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12 grid md:grid-cols-2 cursor-pointer group" onClick={() => navigateTo('product-alu')}>
        <div className="h-64 md:h-auto relative overflow-hidden">
           <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" alt="Alu" className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
           <div className="absolute top-4 left-4 bg-slate-900 text-white px-3 py-1 rounded text-sm font-bold">Premium</div>
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h3 className="text-3xl font-serif font-bold text-slate-900 mb-2 group-hover:text-amber-500 transition">Gamme Aluminium Schüco</h3>
          <p className="text-blue-600 font-semibold mb-4">Design épuré & Lumière maximale</p>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Idéales pour les grandes ouvertures, nos fenêtres aluminium allient finesse des profilés et robustesse incomparable.
          </p>
          <ul className="space-y-2 mb-8 text-slate-700">
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-amber-500"/> Profilés ultra-fins pour +15% de lumière</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-amber-500"/> Sécurité niveau RC2/RC3</li>
          </ul>
          <Button onClick={(e) => { e.stopPropagation(); navigateTo('product-alu'); }}>En savoir plus</Button>
        </div>
      </div>

      {/* PVC */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12 grid md:grid-cols-2 cursor-pointer group" onClick={() => navigateTo('product-pvc')}>
         <div className="order-2 md:order-1 p-8 md:p-12 flex flex-col justify-center">
          <h3 className="text-3xl font-serif font-bold text-slate-900 mb-2 group-hover:text-amber-500 transition">Gamme PVC Haute Performance</h3>
          <p className="text-blue-600 font-semibold mb-4">Isolation thermique & Silence</p>
          <p className="text-slate-600 mb-6 leading-relaxed">
            La solution idéale pour la rénovation. Nos fenêtres PVC offrent le meilleur coefficient d'isolation du marché.
          </p>
          <ul className="space-y-2 mb-8 text-slate-700">
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-amber-500"/> Coefficient Uw jusqu'à 0.8 W/m²K</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-amber-500"/> Design contemporain ou mouluré style ancien</li>
          </ul>
          <Button variant="secondary" onClick={(e) => { e.stopPropagation(); navigateTo('product-pvc'); }}>En savoir plus</Button>
        </div>
        <div className="order-1 md:order-2 h-64 md:h-auto overflow-hidden">
           <img src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80" alt="PVC" className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
        </div>
      </div>

       {/* Other services */}
       <div className="text-center py-10">
         <h3 className="text-2xl font-bold text-slate-800 mb-4">Nous réalisons aussi</h3>
         <div className="flex flex-wrap justify-center gap-4">
            <span onClick={() => navigateTo('product-porte')} className="px-6 py-2 bg-white border border-slate-200 rounded-full text-slate-700 font-semibold shadow-sm hover:bg-slate-100 cursor-pointer transition">
               Portes d'Entrée Blindées
            </span>
            <span onClick={() => navigateTo('product-baie')} className="px-6 py-2 bg-white border border-slate-200 rounded-full text-slate-700 font-semibold shadow-sm hover:bg-slate-100 cursor-pointer transition">
               Baies Coulissantes
            </span>
            <span onClick={() => navigateTo('product-volet')} className="px-6 py-2 bg-white border border-slate-200 rounded-full text-slate-700 font-semibold shadow-sm hover:bg-slate-100 cursor-pointer transition">
               Volets Roulants
            </span>
            <span onClick={() => navigateTo('product-pergola')} className="px-6 py-2 bg-white border border-slate-200 rounded-full text-slate-700 font-semibold shadow-sm hover:bg-slate-100 cursor-pointer transition">
               Pergolas
            </span>
         </div>
       </div>
    </div>
  </div>
);

const AboutPage = ({ navigateTo }) => (
  <div className="pt-24 pb-20 bg-white min-h-screen">
    <div className="container mx-auto px-4">
      <SectionTitle title="Notre Maison" subtitle="L'artisanat au service de la performance depuis plus de 10 ans." />
      
      <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
        <div className="space-y-6">
          <p className="text-lg text-slate-700 leading-relaxed">
            Fondée avec la conviction que la fenêtre est un élément central du bien-être chez soi, <span className="font-bold text-slate-900">InterPlus Fenêtre</span> s'est imposée comme la référence de la menuiserie premium en Île-de-France.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed">
            Notre partenariat officiel avec <span className="font-bold text-slate-900">Schüco</span>, leader mondial des systèmes de fenêtres, nous permet de vous proposer des produits à la pointe de l'innovation technologique, tout en garantissant une installation locale, soignée et réactive.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
               <h4 className="font-bold text-slate-900 text-xl mb-1">100%</h4>
               <p className="text-sm text-slate-500">Poseurs salariés (pas de sous-traitance)</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
               <h4 className="font-bold text-slate-900 text-xl mb-1">98%</h4>
               <p className="text-sm text-slate-500">Clients satisfaits sur 500+ projets</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80" alt="Equipe" className="rounded-xl shadow-2xl" />
        </div>
      </div>
      
      {/* Values */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { title: "Transparence", text: "Des devis clairs, détaillés, sans coûts cachés." },
          { title: "Excellence", text: "Nous visons la perfection, de la prise de mesure à la dernière vis." },
          { title: "Accompagnement", text: "Un interlocuteur unique suit votre projet du début à la fin." }
        ].map((val, i) => (
          <div key={i} className="text-center p-8 rounded-xl bg-slate-50 border border-slate-100 shadow-md hover:shadow-xl hover:bg-white hover:-translate-y-2 hover:border-amber-500 transition-all duration-300 group">
            <div className="w-12 h-1 bg-amber-500 rounded mx-auto mb-6 group-hover:w-20 transition-all duration-300 opacity-50 group-hover:opacity-100"></div>
            <h4 className="font-serif font-bold text-xl mb-3 text-slate-800">{val.title}</h4>
            <p className="text-slate-600 leading-relaxed">{val.text}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-20 text-center bg-slate-900 rounded-2xl p-10 md:p-16 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-serif font-bold mb-4">Prêt à discuter de votre projet ?</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">Rencontrez nos experts techniques pour une étude personnalisée et gratuite de vos besoins.</p>
          <Button onClick={() => navigateTo('contact')}>Prendre Rendez-vous</Button>
        </div>
      </div>
    </div>
  </div>
);

const GalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState('Tous');

  const projects = [
    { 
      img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c", 
      type: "Rénovation Maison", 
      categories: ["Rénovation", "Maison"],
      loc: "Versailles", 
      desc: "Remplacement complet bois par Aluminium Schüco Noir." 
    },
    { 
      img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3", 
      type: "Appartement", 
      categories: ["Appartement", "Rénovation"],
      loc: "Paris 7", 
      desc: "Fenêtres PVC acoustiques sur rue passante." 
    },
    { 
      img: "https://images.unsplash.com/photo-1600210492493-0946911123ea", 
      type: "Extension", 
      categories: ["Maison", "Rénovation"],
      loc: "Boulogne", 
      desc: "Grande baie vitrée coulissante 4 vantaux." 
    },
    { 
      img: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6", 
      type: "Neuf", 
      categories: ["Neuf", "Maison"],
      loc: "Saint-Cloud", 
      desc: "Ensemble des menuiseries villa moderne." 
    },
    { 
      img: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1", 
      type: "Rénovation", 
      categories: ["Rénovation", "Appartement"],
      loc: "Neuilly", 
      desc: "Conservation des vitraux existants avec survitrage." 
    },
    { 
      img: "https://images.unsplash.com/photo-1628744876497-eb30460be9f6", 
      type: "Maison", 
      categories: ["Maison", "Rénovation"],
      loc: "Rueil-Malmaison", 
      desc: "Porte d'entrée aluminium blindée et fenêtres assorties." 
    }
  ];

  const filteredProjects = activeFilter === 'Tous' 
    ? projects 
    : projects.filter(project => project.categories.includes(activeFilter));

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <SectionTitle title="Nos Réalisations" subtitle="Découvrez la transformation de ces habitats en Île-de-France." />
        
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          {['Tous', 'Rénovation', 'Neuf', 'Appartement', 'Maison'].map((filter) => (
             <button 
               key={filter} 
               onClick={() => setActiveFilter(filter)}
               className={`px-4 py-2 rounded-full text-sm font-semibold transition duration-300 ${
                 activeFilter === filter 
                   ? 'bg-slate-900 text-white shadow-lg transform scale-105' 
                   : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
               }`}
             >
               {filter}
             </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredProjects.map((item, i) => (
            <div key={i} className="group relative overflow-hidden rounded-xl bg-slate-900 cursor-pointer h-72">
               <img src={`${item.img}?auto=format&fit=crop&w=600&q=80`} alt={item.type} className="w-full h-full object-cover transition duration-500 group-hover:scale-110 group-hover:opacity-40" />
               <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition duration-300">
                 <span className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">{item.type}</span>
                 <h3 className="text-white font-bold text-xl">{item.loc}</h3>
                 <p className="text-slate-200 text-sm mt-2">{item.desc}</p>
               </div>
            </div>
          ))}
          
          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-500">
              Aucun projet trouvé pour cette catégorie pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ContactPage = () => (
  <div className="pt-24 pb-20 bg-white min-h-screen">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-6">Contactez-nous</h1>
          <p className="text-lg text-slate-600 mb-8">
            Vous avez un projet ? Une question technique ? Nos experts sont à votre écoute pour vous conseiller la meilleure solution.
          </p>
          
          <div className="space-y-6 mb-10">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-700">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Téléphone</h4>
                <p className="text-slate-600 mb-1">Du Lundi au Vendredi, 9h - 19h</p>
                <a href="tel:0142521000" className="text-xl font-bold text-blue-700 hover:text-blue-800">01 42 52 10 00</a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Email</h4>
                <p className="text-slate-600 mb-1">Réponse sous 24h ouvrées</p>
                <a href="mailto:contact@interplus-fenetre.fr" className="font-bold text-slate-900 underline">contact@interplus-fenetre.fr</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-slate-100 p-3 rounded-full text-slate-700">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Showroom (Sur RDV)</h4>
                <p className="text-slate-600">17 Rue Gilberte Desnoyers, 93600, Aulnay-sous-Bois</p>
              </div>
            </div>
          </div>

          {/* Fake Map */}
          <div className="w-full h-64 bg-slate-200 rounded-xl overflow-hidden relative">
             <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold bg-slate-300">
                Carte Interactive Google Maps
             </div>
          </div>
        </div>

        <div>
          <LeadForm />
        </div>
      </div>
    </div>
  </div>
);

const Footer = ({ navigateTo }) => (
  <footer className="bg-slate-900 text-white pt-16 pb-8">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="text-2xl font-serif font-bold mb-4 tracking-tighter flex items-center gap-2">
            InterPlus <span className="text-amber-500 text-4xl">.</span> Fenêtre
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Spécialiste de la fenêtre premium et partenaire officiel Schüco. Nous transformons votre habitat avec exigence et passion.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors duration-300">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-300">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-6">Navigation</h4>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li className="hover:text-amber-500 cursor-pointer transition" onClick={() => navigateTo('home')}>Accueil</li>
            <li className="hover:text-amber-500 cursor-pointer transition" onClick={() => navigateTo('products')}>Nos Fenêtres</li>
            <li className="hover:text-amber-500 cursor-pointer transition" onClick={() => navigateTo('gallery')}>Réalisations</li>
            <li className="hover:text-amber-500 cursor-pointer transition" onClick={() => navigateTo('about')}>L'Entreprise</li>
             <li className="hover:text-amber-500 cursor-pointer transition" onClick={() => navigateTo('sitemap')}>Plan du site</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Produits</h4>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li className="hover:text-white cursor-pointer transition" onClick={() => navigateTo('product-alu')}>Fenêtres Aluminium Schüco</li>
            <li className="hover:text-white cursor-pointer transition" onClick={() => navigateTo('product-pvc')}>Fenêtres PVC Premium</li>
            <li className="hover:text-white cursor-pointer transition" onClick={() => navigateTo('product-baie')}>Baies Vitrées Coulissantes</li>
            <li className="hover:text-white cursor-pointer transition" onClick={() => navigateTo('product-porte')}>Portes d'Entrée Blindées</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Contact</h4>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li className="flex items-center gap-2"><Phone size={14}/> 01 42 52 10 00</li>
            <li className="flex items-center gap-2"><Mail size={14}/> contact@interplus-fenetre.fr</li>
            <li className="flex items-center gap-2"><MapPin size={14}/> Paris & Île-de-France</li>
            <li className="flex items-center gap-2"><Clock size={14}/> Lun-Ven: 9h-19h</li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
        <p>&copy; 2024 InterPlus Fenêtre. Tous droits réservés.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <span className="cursor-pointer hover:text-white" onClick={() => navigateTo('legal')}>Mentions Légales</span>
          <span className="cursor-pointer hover:text-white" onClick={() => navigateTo('privacy')}>Politique de Confidentialité</span>
          <span className="cursor-pointer hover:text-white" onClick={() => navigateTo('sitemap')}>Plan du site</span>
        </div>
      </div>
    </div>
  </footer>
);

// --- Main App Component ---

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle Scroll Effect for Header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [currentPage]);

  const navigateTo = (page) => setCurrentPage(page);

  const navLinks = [
    { id: 'home', label: 'Accueil' },
    { id: 'products', label: 'Nos Fenêtres' },
    { id: 'gallery', label: 'Réalisations' },
    { id: 'about', label: 'Entreprise' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="font-sans text-slate-800 antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${(scrolled && !isMenuOpen) ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <div 
            className={`text-2xl font-serif font-bold tracking-tighter cursor-pointer flex flex-col leading-none ${isMenuOpen || (!scrolled && currentPage === 'home') ? 'text-white' : 'text-slate-900'}`}
            onClick={() => navigateTo('home')}
          >
            <span className="flex items-center gap-1">InterPlus <span className="text-amber-500 text-3xl leading-none">.</span> Fenêtre</span>
            <span className={`text-[10px] uppercase tracking-widest font-sans font-normal opacity-80 mt-1 ${isMenuOpen ? 'text-slate-400' : ((scrolled || currentPage !== 'home') ? 'text-slate-500' : 'text-slate-300')}`}>Partenaire Schüco</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <button 
                key={link.id} 
                onClick={() => navigateTo(link.id)}
                className={`text-sm font-semibold uppercase tracking-wide hover:text-amber-500 transition ${
                  (scrolled || currentPage !== 'home') ? 'text-slate-700' : 'text-white/90'
                } ${currentPage === link.id ? 'text-amber-500' : ''}`}
              >
                {link.label}
              </button>
            ))}
            <Button variant="primary" className="text-sm px-5 py-2" onClick={() => navigateTo('contact')}>
              Devis Gratuit
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`lg:hidden ${isMenuOpen || (!scrolled && currentPage === 'home') ? 'text-white' : 'text-slate-900'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-slate-900 z-40 flex flex-col items-center justify-center space-y-8 animate-fade-in lg:hidden">
           {navLinks.map(link => (
              <button 
                key={link.id} 
                onClick={() => navigateTo(link.id)}
                className="text-2xl font-serif font-bold text-white hover:text-amber-500 transition"
              >
                {link.label}
              </button>
            ))}
            <Button variant="primary" className="mt-8" onClick={() => navigateTo('contact')}>
              Demander un devis
            </Button>
        </div>
      )}

      {/* Main Content Area */}
      <main>
        {currentPage === 'home' && <HomePage navigateTo={navigateTo} />}
        {currentPage === 'products' && <ProductsPage navigateTo={navigateTo} />}
        {currentPage === 'about' && <AboutPage navigateTo={navigateTo} />}
        {currentPage === 'gallery' && <GalleryPage navigateTo={navigateTo} />}
        {currentPage === 'contact' && <ContactPage />}
        
        {/* Pages Produits Détaillées */}
        {currentPage === 'product-alu' && <ProductDetailPage product={productsData.alu} navigateTo={navigateTo} />}
        {currentPage === 'product-pvc' && <ProductDetailPage product={productsData.pvc} navigateTo={navigateTo} />}
        {currentPage === 'product-baie' && <ProductDetailPage product={productsData.baie} navigateTo={navigateTo} />}
        {currentPage === 'product-porte' && <ProductDetailPage product={productsData.porte} navigateTo={navigateTo} />}
        {currentPage === 'product-volet' && <ProductDetailPage product={productsData.volet} navigateTo={navigateTo} />}
        {currentPage === 'product-pergola' && <ProductDetailPage product={productsData.pergola} navigateTo={navigateTo} />}
        
        {/* Pages Légales */}
        {currentPage === 'legal' && <LegalPage />}
        {currentPage === 'privacy' && <PrivacyPage />}
        {currentPage === 'sitemap' && <SitemapPage navigateTo={navigateTo} />}
      </main>

      <Footer navigateTo={navigateTo} />
    </div>
  );
};

export default App;