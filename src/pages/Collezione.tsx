import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactComponent as AdeleSVG } from '../assets/images/adele.svg';
import { getSections, getArtworks, subscribeToNewsletter, type Section, type Artwork } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { useTranslation } from '../i18n/useTranslation';

// Componente Modale per Mostra
interface MostraModalProps {
  isOpen: boolean;
  onClose: () => void;
  mostra: {
    titolo: string;
    sottotitolo: string;
    luogo: string;
    data: string;
    descrizione: string;
    info?: string;
  };
}

const MostraModal: React.FC<MostraModalProps> = ({ isOpen, onClose, mostra }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)'
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[90vh] md:h-[80vh] bg-background rounded-3xl flex flex-col"
        style={{
          fontFamily: 'Montserrat, sans-serif'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white hover:text-accent transition-colors z-10"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-8 md:p-12">
          {/* Content - Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Info */}
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <h2 className="text-5xl font-bold text-white uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {mostra.titolo}
                </h2>
                <p className="text-[16px] text-white/80 uppercase">
                  {mostra.sottotitolo}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-accent to-transparent opacity-50"></div>

              {/* Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm uppercase text-accent tracking-wider">Luogo</p>
                  <p className="text-[16px] text-white uppercase">{mostra.luogo}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm uppercase text-accent tracking-wider">Periodo</p>
                  <p className="text-[16px] text-white uppercase">{mostra.data}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Description */}
            <div className="space-y-6">
              <p className="text-[16px] leading-relaxed text-white/90 uppercase">
                {mostra.descrizione}
              </p>
              {mostra.info && (
                <p className="text-[16px] leading-relaxed text-white/70 italic uppercase">
                  {mostra.info}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Language Switcher fluttuante
const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'it' ? 'en' : 'it');
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 hidden md:block"
      style={{
        backdropFilter: 'blur(5px)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '7px',
        padding: '8px'
      }}
    >
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 px-4 py-2 bg-black rounded hover:opacity-90 transition-opacity"
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.15) 0px 4px 8px 0px'
        }}
      >
        <span className="font-body text-[14px] font-medium text-white tracking-tight">
          {language === 'it' ? '🇮🇹 Italiano' : '🇬🇧 English'}
        </span>
      </button>
    </div>
  );
};

// Componente Modale per Testo Critico
interface TestoCriticoModalProps {
  isOpen: boolean;
  onClose: () => void;
  critico: {
    nome: string;
    ruolo: string;
    testo: string;
  };
}

const TestoCriticoModal: React.FC<TestoCriticoModalProps> = ({ isOpen, onClose, critico }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)'
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[90vh] md:h-[80vh] bg-background rounded-3xl flex flex-col"
        style={{
          fontFamily: 'Montserrat, sans-serif'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white hover:text-accent transition-colors z-10"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-8 md:p-12">
          {/* Content - Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Info */}
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <h2 className="text-5xl font-bold text-white uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {critico.nome}
                </h2>
                <p className="text-[16px] text-white/80 uppercase">
                  {critico.ruolo}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-accent to-transparent opacity-50"></div>
            </div>

            {/* Right Column - Text */}
            <div className="space-y-6">
              <p className="text-[16px] leading-relaxed text-white/90 italic uppercase">
                "{critico.testo}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente item per Testi Critici
interface TestoCriticoItemProps {
  nome: string;
  ruolo: string;
  testo: string;
  onClick: () => void;
}

const TestoCriticoItem: React.FC<TestoCriticoItemProps> = ({ nome, ruolo, testo, onClick }) => {
  // Estrae le prime 120 caratteri del testo come anteprima
  const anteprima = testo.length > 120 ? testo.substring(0, 120) + '...' : testo;

  return (
    <button
      onClick={onClick}
      className="w-full p-8 border border-white/20 text-left hover:border-white/40 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <h6 className="m-0 text-white font-body text-[18px] font-bold uppercase">{nome}</h6>
        <svg className="flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" fill="rgb(153, 153, 153)"/>
        </svg>
      </div>
      <p className="m-0 text-white/60 font-body text-[16px] font-normal mb-3">{ruolo}</p>
      <p className="m-0 text-white/40 font-body text-[14px] font-normal italic leading-relaxed">{anteprima}</p>
    </button>
  );
};

const Collezione: React.FC = () => {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedMostra, setSelectedMostra] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mostreVisibili, setMostreVisibili] = useState(4);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCritico, setSelectedCritico] = useState<any>(null);
  const [isCriticoModalOpen, setIsCriticoModalOpen] = useState(false);

  const openMostraModal = (mostra: any) => {
    setSelectedMostra(mostra);
    setIsModalOpen(true);
  };

  const closeMostraModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMostra(null), 300);
  };

  const openCriticoModal = (critico: any) => {
    setSelectedCritico(critico);
    setIsCriticoModalOpen(true);
  };

  const closeCriticoModal = () => {
    setIsCriticoModalOpen(false);
    setTimeout(() => setSelectedCritico(null), 300);
  };

  const mostraAltre = () => {
    const previousCount = mostreVisibili;
    const newCount = Math.min(mostreVisibili + 4, mostreOrdinate.length);
    setMostreVisibili(newCount);

    // Anima le nuove mostre dopo che sono state renderizzate
    setTimeout(() => {
      const newItems = document.querySelectorAll('.mostra-item');
      for (let i = previousCount; i < newCount; i++) {
        if (newItems[i]) {
          gsap.fromTo(newItems[i],
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: (i - previousCount) * 0.1 }
          );
        }
      }
    }, 10);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    try {
      const result = await subscribeToNewsletter(newsletterEmail);
      setIsSignedUp(true);
      console.log(result.message);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      alert('Errore durante l\'iscrizione. Riprova più tardi.');
    }
  };

  // Dati mostre
  const mostre = [
    {
      id: 'unisono',
      titolo: 'UNISONO',
      sottotitolo: 'Personale di Adele Lo Feudo',
      luogo: 'Loggia dei Lanari, Piazza Matteotti 18, Perugia',
      data: '14/03/2024 - 30/03/2024',
      descrizione: 'Una mostra che esplora l\'unità tra l\'artista e la sua opera, dove ogni pezzo racconta una storia di armonia e connessione profonda con la materia.',
      info: 'Inaugurazione della mostra Giovedì 14 Marzo 2024, ore 18:00. Sarà presente l\'Assessore alla Cultura del Comune di Perugia, Leonardo Varasano. Orari di apertura 15:30 - 19:30. Sabato e Domenica 10:30 - 13:30 / 16:00 - 19:30'
    },
    {
      id: 'ritorno',
      titolo: 'RITORNO',
      sottotitolo: 'Personale di Adele Lo Feudo',
      luogo: 'Museo a Cielo Aperto di Camo (CN)',
      data: '3-24 Agosto 2025',
      descrizione: 'R I T O R N O dopo nove anni, con grande gioia, a Camo, presso il Museo a Cielo Aperto, che già mi accolse nel 2016 con la personale di pittura Presenze/Assenze:Io sono! Il merito era ed è ancora di Claudio Lorenzoni, Direttore artistico, di rara umanità e sensibilità, mosso da un vero e disinteressato amore per l\'Arte che parla ai cuori. La mia ultima fatica artistica, "R I T O R N O", è composta da 49 foglie realizzate in sedici mesi su tela e dipinte in tecnica acrilica. Le foglie nascondono un messaggio in cui chiunque potrebbe rivedersi. Un messaggio di memoria, amore per la vita, l\'altro e l\'arte. Spero che il visitatore possa far rivivere nella sua memoria un pezzetto di quel suo passato che magari ha dimenticato e che gli sta particolarmente a cuore.',
      info: 'Vernissage 3 agosto, ore 10:30. In esposizione fino al 24 agosto 2025'
    },
    {
      id: 'fornace',
      titolo: 'Fornace Pasquinucci',
      sottotitolo: 'Mostra Personale',
      luogo: 'Fornace Pasquinucci, Capraia e Limite',
      data: 'Dicembre 2024',
      descrizione: 'Una mostra che celebra la tradizione ceramica toscana attraverso opere che dialogano con lo spazio industriale della storica fornace.'
    },
    {
      id: 'amaci',
      titolo: 'AMACI Giornata del Contemporaneo',
      sottotitolo: 'Ventesima Edizione',
      luogo: 'Italia',
      data: '12 Ottobre 2024',
      descrizione: 'Partecipazione alla ventesima edizione della Giornata del Contemporaneo, evento nazionale dedicato all\'arte contemporanea italiana.'
    },
    {
      id: 'amor',
      titolo: 'Amor',
      sottotitolo: 'Basilica di San Domenico',
      luogo: 'Basilica di San Domenico, Perugia',
      data: 'Maggio 2024',
      descrizione: 'Una riflessione sull\'amore nelle sue molteplici forme, presentata nello spazio sacro della Basilica di San Domenico.'
    },
    {
      id: 'negli-occhi',
      titolo: 'Negli occhi delle donne',
      sottotitolo: 'Casa Museo Antonio Ligabue',
      luogo: 'Casa Museo Antonio Ligabue, Gualtieri',
      data: '5-27 Agosto 2023',
      descrizione: 'Un omaggio alla figura femminile, esposto nella casa dove il grande maestro Ligabue trovava rifugio. Uno sguardo intimo sull\'universo femminile attraverso ritratti intensi e materici.'
    },
    {
      id: 'fragileforte',
      titolo: 'FragileForte',
      sottotitolo: 'Ex Chiesa della Misericordia',
      luogo: 'Ex Chiesa della Misericordia, Perugia',
      data: '4-15 Marzo 2023',
      descrizione: 'Un\'esplorazione della dualità umana tra fragilità e forza, dove ogni opera rappresenta la tensione tra vulnerabilità e resilienza.'
    },
    {
      id: 'personale-bergamo',
      titolo: 'Mostra Personale',
      sottotitolo: 'Ex Ateneo',
      luogo: 'Ex Ateneo, Bergamo',
      data: '25 Nov - 11 Dic 2022',
      descrizione: 'Una retrospettiva delle opere più significative dell\'artista, presentata nello storico spazio dell\'Ex Ateneo di Bergamo.'
    },
    {
      id: 'amore-vita',
      titolo: 'Amore e Vita',
      sottotitolo: 'Casa Museo Antonio Ligabue',
      luogo: 'Casa Museo Antonio Ligabue, Gualtieri',
      data: '6 Ago - 4 Set 2022',
      descrizione: 'Una celebrazione della vita e dell\'amore attraverso opere che esplorano i temi universali dell\'esistenza umana.'
    },
    {
      id: 'un-cuore-solo',
      titolo: 'Un cuore solo',
      sottotitolo: 'Sala Cannoniera - Rocca Paolina',
      luogo: 'Sala Cannoniera - Rocca Paolina, Perugia',
      data: '31 Ott - 14 Nov 2020',
      descrizione: 'Una mostra che parla di unità e connessione, presentata durante il periodo pandemico come messaggio di speranza e solidarietà.'
    },
    {
      id: 'varese-1902',
      titolo: 'Varese 1902 - Storie di donne',
      sottotitolo: 'Battistero di Velate',
      luogo: 'Battistero di Velate, Varese',
      data: '23 Nov - 8 Dic 2019',
      descrizione: 'Storie di donne del passato rivivono attraverso l\'arte, in un dialogo tra memoria storica e contemporaneità.'
    },
    {
      id: 'al-di-sopra',
      titolo: 'Al di sopra degli stagni',
      sottotitolo: 'Archivio di Stato',
      luogo: 'Archivio di Stato, Pesaro',
      data: '14 Ott - 3 Nov 2018',
      descrizione: 'Un\'esplorazione poetica della natura e della sua relazione con l\'anima umana.'
    },
    {
      id: 'columbus',
      titolo: 'Columbus Day Gala',
      sottotitolo: 'Manhattan Midtown Hilton',
      luogo: 'Manhattan Midtown Hilton, New York',
      data: '7 Ottobre 2017',
      descrizione: 'Partecipazione al prestigioso Columbus Day Gala a New York, portando l\'arte italiana nel cuore di Manhattan.'
    },
    {
      id: 'per-giungere',
      titolo: 'Per giungere fino a te',
      sottotitolo: 'Ex Chiesa della Misericordia',
      luogo: 'Ex Chiesa della Misericordia, Perugia',
      data: '23 Set - 4 Ott 2017',
      descrizione: 'Un viaggio artistico verso l\'altro, un percorso di ricerca e incontro attraverso la materia pittorica.'
    },
    {
      id: 'i-maccaturi',
      titolo: 'I Maccaturi',
      sottotitolo: 'Museo Civico',
      luogo: 'Museo Civico, Altomonte',
      data: '15 Ott - 30 Nov 2016',
      descrizione: 'Una mostra dedicata alle tradizioni e alla cultura calabrese, riscoperte attraverso uno sguardo contemporaneo.'
    },
    {
      id: 'presenze-assenze',
      titolo: 'Presenze / Assenze Io Sono!',
      sottotitolo: 'Museo a Cielo Aperto',
      luogo: 'Museo a Cielo Aperto, Camo',
      data: '26 Giu - 26 Lug 2016',
      descrizione: 'Un\'indagine sulla presenza e l\'assenza, sull\'essere e il non essere, attraverso installazioni e opere pittoriche.'
    },
    {
      id: 'human-rights',
      titolo: 'Human Rights?',
      sottotitolo: 'Fondazione Opera Campana dei Caduti',
      luogo: 'Fondazione Opera Campana dei Caduti, Rovereto',
      data: 'Mag - Set 2016',
      descrizione: 'Una riflessione sui diritti umani attraverso l\'arte, in uno dei luoghi simbolo della memoria italiana.'
    },
    {
      id: 'arte-laguna',
      titolo: 'Arte a confronto in laguna',
      sottotitolo: 'JW Marriott Venice Resort',
      luogo: 'JW Marriott Venice Resort, Venezia',
      data: '2 Apr - 2 Mag 2016',
      descrizione: 'Un dialogo artistico nella suggestiva cornice veneziana, dove l\'arte contemporanea incontra la tradizione.'
    },
    {
      id: 'messi-nudo',
      titolo: 'Messi a Nudo',
      sottotitolo: 'Galleria Spazio Monticini',
      luogo: 'Galleria Spazio Monticini, Montevarchi',
      data: 'Dicembre 2015',
      descrizione: 'Un\'esposizione che svela l\'essenza umana, togliendo i veli e le maschere sociali.'
    },
    {
      id: 'forma-imago',
      titolo: 'Forma et Imago',
      sottotitolo: 'Palazzo Ducale',
      luogo: 'Palazzo Ducale, Revere',
      data: 'Giugno 2015',
      descrizione: 'Un\'esplorazione del rapporto tra forma e immagine, tra materia e rappresentazione.'
    },
    {
      id: 'motus-terrae',
      titolo: 'Motus Terrae',
      sottotitolo: 'Museo Parco Archeologico Compsa',
      luogo: 'Museo Parco Archeologico Compsa, Conza della Campania',
      data: 'Dicembre 2014',
      descrizione: 'Un omaggio alla terra e alle sue forze primordiali, in dialogo con il patrimonio archeologico.'
    },
    {
      id: 'qui-non-si-muore',
      titolo: 'Qui non si muore!',
      sottotitolo: 'Galleria Via Cavour 85',
      luogo: 'Galleria Via Cavour 85, Arezzo',
      data: 'Novembre 2014',
      descrizione: 'Un messaggio di vita e speranza attraverso l\'arte, un inno alla resilienza dell\'anima umana.'
    },
    {
      id: 'petalo-rosa',
      titolo: 'Un petalo rosa',
      sottotitolo: 'La Casa di Roberta',
      luogo: 'Perugia e Cosenza',
      data: 'Ott 2013 Perugia / Nov-Dic 2013 Cosenza',
      descrizione: 'Una mostra itinerante dedicata alla sensibilizzazione contro la violenza sulle donne.'
    },
    {
      id: 'riflessioni',
      titolo: 'Riflessioni',
      sottotitolo: 'Archidoro Luoghi d\'Arte',
      luogo: 'Archidoro Luoghi d\'Arte, Cetona',
      data: 'Settembre 2013',
      descrizione: 'Un momento di riflessione attraverso l\'arte, dove ogni opera diventa specchio dell\'anima.'
    }
  ];

  // Ordina le mostre per anno (dalla più recente alla più vecchia)
  const mostreOrdinate = [...mostre].sort((a, b) => {
    // Estrae l'anno dalla stringa data
    const getYear = (dataStr: string) => {
      const match = dataStr.match(/\d{4}/);
      return match ? parseInt(match[0]) : 0;
    };
    return getYear(b.data) - getYear(a.data);
  });

  // Carica dati dalle API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [sectionsData, artworksData] = await Promise.all([
          getSections(),
          getArtworks()
        ]);
        setSections(sectionsData);
        setArtworks(artworksData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Nascondi loading screen dopo il caricamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 secondi

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Avvia le animazioni solo dopo il loading screen
    if (isLoading) return;

    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(titleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 3, delay: 0.5, ease: "power2.out" }
      );

      gsap.fromTo(subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 2.8, delay: 0.8, ease: "power2.out" }
      );

      // Hero image animation
      gsap.fromTo('.hero-image',
        { y: 30, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 3.2, delay: 1.1, ease: "power2.out" }
      );

      // Hero fade out on scroll
      gsap.to(heroRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // Description fade out on scroll
      gsap.to('.description-section', {
        opacity: 0,
        scrollTrigger: {
          trigger: '.description-section',
          start: "center top",
          end: "bottom top",
          scrub: true
        }
      });

      // Collection items animation
      gsap.fromTo('.collection-item',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 2,
          stagger: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: '.collection-grid',
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Mostre section animation
      gsap.fromTo('#mostre',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: '#mostre',
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Testi Critici animation
      gsap.fromTo('.testo-critico',
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: '#testi-critici',
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => ctx.revert();
  }, [artworks, isLoading]);

  // Usa i dati dalla sezione se disponibili, altrimenti fallback
  const currentSection = sections.length > 0 ? sections[0] : null;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Adele Lo Feudo - L'Artista Italiana</title>
        <meta name="description" content="Adele Lo Feudo - L'artista italiana che esplora l'anima attraverso la materia. Scopri le opere d'arte contemporanea." />
      </Helmet>

      {/* Loading Screen */}
      {isLoading && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-background"
          style={{
            animation: 'fadeOut 0.5s ease-out 2.5s forwards'
          }}
        >
          <style>{`
            @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; pointer-events: none; }
            }
            @keyframes loadBar {
              from { width: 0; }
              to { width: 100%; }
            }
          `}</style>
          <div className="text-center">
            <h1
              className="text-[32px] font-bold text-white uppercase tracking-wide"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              ALF
            </h1>
            <div className="w-24 h-[2px] mx-auto bg-white/20">
              <div className="h-full bg-accent" style={{ animation: 'loadBar 2.5s ease-out forwards' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex flex-col justify-center p-0 w-screen -ml-[calc(50vw-50%)] mb-0" style={{ scrollSnapAlign: 'start' }}>
        <div className="w-full pt-24 px-6 mobile:pt-24 mobile:px-6" style={{ textAlign: 'left' }}>
          <div ref={titleRef} className="w-full mb-0 flex mobile:justify-center opacity-0" style={{ justifyContent: 'flex-start' }}>
            <AdeleSVG className="w-full h-auto fill-white [&_*]:fill-white" style={{ maxWidth: '100%' }} />
          </div>
          <h2 ref={subtitleRef} className="text-body font-bold uppercase leading-[1.4] tracking-[0px] text-left mt-6 mb-6 opacity-0">
            {t('subtitlePart1')}<span className="italic text-accent underline">{t('anima')}</span><br/>
            {t('subtitlePart2')}<span className="italic text-accent underline">{t('materia')}</span>
          </h2>
        </div>
        <div className="relative w-full flex items-center justify-center mt-4 mb-16 px-6 mobile:px-6">
          <img
            className="hero-image w-[700px] max-w-[90%] h-auto object-contain object-center rounded-[10px] opacity-0"
            src="https://framerusercontent.com/images/8TonweCu2FGoT0Vejhe7bUZe5ys.png"
            alt="Adele Lo Feudo - Artista"
            loading="lazy"
          />
        </div>
      </section>

      {/* Description Section */}
      <section className="description-section min-h-screen flex items-center px-6" style={{ scrollSnapAlign: 'start' }}>
        <div className="w-full">
          <p className="heading-primary text-left">
            {t('descriptionPart1')}<span className="text-accent">{t('accentDescription1')}</span>{t('descriptionPart2')}<span className="text-accent">{t('accentDescription2')}</span>{t('descriptionPart3')}<span className="text-accent">{t('accentDescription3')}</span>{t('descriptionPart4')}
          </p>
        </div>
      </section>

      {/* Sculture */}
      <section id="sculture" className="collection-grid py-20" style={{ scrollSnapAlign: 'start' }}>
        <div className="px-6">
          <h2 className="heading-section text-left">
            {currentSection?.name || 'Name series'}
          </h2>

          <div className="text-body text-left">
            {currentSection?.description || 'Le sculture di Adele Lo Feudo nascono dall\'incontro tra materia e spirito, dove ogni forma racconta una storia di trasformazione. Attraverso l\'argilla e il bronzo, l\'artista esplora i confini dell\'espressione umana, creando opere che dialogano con l\'anima. Ogni scultura è un viaggio nell\'inconscio collettivo, un ponte tra il tangibile e l\'invisibile.'}
          </div>
        </div>

        <div className="flex gap-8 mt-8 overflow-x-auto pb-4 px-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {artworks.map((artwork) => (
            <div key={artwork.id} className="collection-item relative overflow-hidden flex-shrink-0" style={{ width: '500px' }}>
              <div className="w-full h-[500px] relative">
                <img
                  src={artwork.image_url || '/opera.png'}
                  alt={artwork.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mostre Section */}
      <section id="mostre" className="min-h-screen flex items-center py-20 px-6" style={{ scrollSnapAlign: 'start' }}>
        <div className="w-full">
          <h2 className="heading-section text-left mb-12">
            {t('exhibitions')}
          </h2>

          <div className="space-y-0">
            {mostreOrdinate.slice(0, mostreVisibili).map((mostra, index) => {
              return (
                <div key={mostra.id} className="mostra-item border-t border-white/20 pt-8 pb-8 flex items-center justify-between gap-8">
                  <div className="flex-1 m-0 flex flex-col justify-center">
                    <p className="m-0 text-white font-body text-[18px] font-bold uppercase mb-2">{mostra.titolo}</p>
                    <p className="m-0 text-white/60 font-body text-[14px] font-normal">{mostra.data}</p>
                  </div>
                  <div className="flex-1 m-0 flex items-center">
                    <p className="m-0 text-white font-body text-[16px] font-normal uppercase">{mostra.sottotitolo}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => openMostraModal(mostra)}
                      className="text-white hover:text-accent transition-colors"
                    >
                      <svg width="24" height="24" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="border-t border-white/20 pt-0"></div>
          </div>

          {/* Pulsante Mostra Altre */}
          {mostreVisibili < mostreOrdinate.length && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={mostraAltre}
                className="px-8 py-4 border border-white/40 text-white hover:border-accent hover:text-accent transition-colors font-body text-[16px] uppercase tracking-wide"
              >
                {t('showMore')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bio & Testi Critici Section */}
      <section id="bio" className="min-h-screen flex items-center py-20 px-6" style={{ scrollSnapAlign: 'start' }}>
        <div className="w-full">
          <h2 className="heading-section text-left mb-12">
            {t('critique')}
          </h2>

          <div className="w-full">
            {/* Testi Critici */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Testo Critico 1 - Angelo Leidi */}
            <TestoCriticoItem
              nome="Angelo Leidi"
              ruolo={t('critics').angeloLeidi.role}
              testo={t('critics').angeloLeidi.text}
              onClick={() => openCriticoModal({
                nome: 'Angelo Leidi',
                ruolo: t('critics').angeloLeidi.role,
                testo: t('critics').angeloLeidi.text
              })}
            />

            {/* Testo Critico 2 - Leonardo Varasano */}
            <TestoCriticoItem
              nome="Leonardo Varasano"
              ruolo={t('critics').leonardoVarasano.role}
              testo={t('critics').leonardoVarasano.text}
              onClick={() => openCriticoModal({
                nome: 'Leonardo Varasano',
                ruolo: t('critics').leonardoVarasano.role,
                testo: t('critics').leonardoVarasano.text
              })}
            />

            {/* Testo Critico 3 - Celeste Morè */}
            <TestoCriticoItem
              nome="Celeste Morè"
              ruolo={t('critics').celesteMore.role}
              testo={t('critics').celesteMore.text}
              onClick={() => openCriticoModal({
                nome: 'Celeste Morè',
                ruolo: t('critics').celesteMore.role,
                testo: t('critics').celesteMore.text
              })}
            />

            {/* Testo Critico 4 - Marco Botti */}
            <TestoCriticoItem
              nome="Marco Botti"
              ruolo={t('critics').marcoBotti.role}
              testo={t('critics').marcoBotti.text}
              onClick={() => openCriticoModal({
                nome: 'Marco Botti',
                ruolo: t('critics').marcoBotti.role,
                testo: t('critics').marcoBotti.text
              })}
            />
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="min-h-screen flex items-center py-20 px-6" style={{ scrollSnapAlign: 'start' }}>
        <div className="w-full">
          {/* Titolo */}
          <div className="mb-12 md:mb-16">
            <h2 className="heading-section text-left">ABOUT ALF</h2>
          </div>

          {/* Layout 2 colonne */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Colonna Immagine */}
            <div className="w-full flex justify-center md:justify-start">
              <div className="aspect-[3/4] overflow-hidden max-w-[300px] md:max-w-[400px] w-full">
                <img
                  src="/adele.jpg"
                  alt="Adele Lo Feudo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Colonna Testo */}
            <div className="space-y-6 md:space-y-8">
              <p className="font-body text-[16px] md:text-[18px] text-white/80 leading-relaxed">
                {t('bioText1')}
              </p>

              {/* Decorative Stroke */}
              <div className="w-16 h-[2px] bg-white/20"></div>

              <p className="font-body text-[16px] md:text-[18px] text-white/80 leading-relaxed">
                {t('bioText2')}
              </p>

              {/* Read More Link */}
              <div className="pt-2 md:pt-4">
                <a
                  href="#bio"
                  className="font-body text-[14px] md:text-[16px] text-white/60 hover:text-white underline transition-colors"
                >
                  {t('readMore')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="min-h-screen flex items-center py-20 px-6" style={{ scrollSnapAlign: 'start' }}>
        <div className="w-full">
          <h2 className="heading-section text-left mb-12">
            {t('work')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {artworks.slice(0, 4).map((artwork) => (
              <div key={artwork.id} className="group cursor-pointer">
                <div className="aspect-square overflow-hidden mb-4 border border-white/20 hover:border-white/40 transition-all">
                  <img
                    src={artwork.image_url || '/opera.png'}
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-body text-[16px] font-bold text-white uppercase">{artwork.title}</h4>
                <p className="font-body text-[14px] text-white/60 mt-1">{artwork.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-[50vh] md:min-h-[60vh] flex items-center justify-center py-16 md:py-20 px-6 border-t border-white/20" style={{ scrollSnapAlign: 'start' }}>
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Decorative Text */}
          <div className="mb-6 md:mb-8 flex items-center justify-center gap-2">
            <span className="text-white/40 font-body text-[12px] md:text-[14px] uppercase tracking-widest">
              (Inizia Ora)
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-[32px] md:text-[72px] font-bold text-white uppercase leading-[1.1] mb-8 md:mb-12 px-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Trasforma la Tua<br/>Visione in Realtà
          </h2>

          {/* CTA Button */}
          <a
            href="mailto:adelelofeudo@gmail.com"
            className="inline-block px-8 md:px-12 py-3 md:py-4 bg-accent text-background font-body text-[16px] md:text-[18px] font-bold uppercase tracking-wide hover:bg-white transition-colors"
          >
            Contattami
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background mt-5 flex flex-col justify-between gap-[3.75rem] border-t border-white/20 pt-[3.75rem] md:mt-10 relative bottom-0">
        {/* Newsletter Form */}
        <form onSubmit={handleNewsletterSubmit} className="flex items-center justify-center">
          <div className="grid grid-cols-12 gap-5 w-full gap-y-20 px-5 relative">
            {/* Artist Logo */}
            <div className="hidden w-fit md:block col-start-1 md:col-start-1 col-end-[span_5] md:col-end-[span_2] md:min-h-[120px] flex items-center">
              <AdeleSVG className="w-full h-auto fill-white [&_*]:fill-white" style={{ maxWidth: '200px' }} />
            </div>

            {/* Newsletter */}
            <div className="col-start-1 md:col-start-7 col-end-[span_12] md:col-end-[span_6]">
              <div className="group flex w-full flex-col gap-10 md:gap-8">
                <div className="flex flex-col gap-[0.313rem]">
                  <p className="text-white text-lg md:text-xl">{t('stayUpdated')}</p>
                  <p className="text-white md:text-sm mb-0 text-sm md:mb-2.5">
                    {t('newsletterDesc')}
                  </p>
                </div>

                <div className="grid grid-cols-12 gap-5 gap-y-1.5 relative">
                  {/* Email Input */}
                  <div className="h-fit col-start-[span_12] md:col-start-[span_8]">
                    <div className="relative h-[3.125rem] border-b p-2.5 align-middle focus-within:border-white hover:border-white border-white/40 bg-background text-white w-full min-w-0 flex-1">
                      <input
                        className="peer w-full appearance-none text-ellipsis pr-5 outline-none placeholder:capitalize placeholder:text-white/60 bg-background text-white"
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        disabled={isSignedUp}
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-white/60 peer-hover:text-white peer-focus-visible:text-white">*</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-3.5 md:mt-0 col-start-[span_12] md:col-start-[span_4]">
                    <button
                      type="submit"
                      disabled={isSignedUp}
                      className="select-none outline-transparent disabled:pointer-events-none transition-all duration-300 px-[1.5625rem] py-[0.8125rem] text-md h-[3.125rem] w-full"
                      style={{
                        maxWidth: '100%',
                        minWidth: 'fit-content',
                        border: isSignedUp ? '1px solid #F02D6E' : '1px solid rgba(255, 255, 255, 0.4)',
                        backgroundColor: isSignedUp ? '#F02D6E' : 'transparent',
                        color: isSignedUp ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <div className="contents">{isSignedUp ? t('signedUp') : t('signUp')}</div>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Bottom Section */}
        <div className="grid grid-cols-12 gap-5 w-full gap-y-10 p-5 pb-10 md:gap-y-5 md:pb-5 relative">
          {/* Copyright and Links */}
          <div className="col-start-1 md:col-start-1 col-end-[span_12] md:col-end-[span_6]">
            <div className="flex flex-col gap-2.5">
              <div>
                <p className="text-white text-xs md:text-xs">{t('allRights')}</p>
              </div>
              <div className="flex flex-wrap gap-5 md:justify-start">
                <Link
                  to="/terms"
                  className="transition-text-decoration duration-300 ease-in decoration-1 cursor-pointer decoration-transparent hover:underline hover:decoration-current focus:underline focus:decoration-current decoration-white/60 text-xs underline-offset-[0.375rem] text-xs md:text-xs"
                >
                  {t('terms')}
                </Link>
                <Link
                  to="/privacy"
                  className="transition-text-decoration duration-300 ease-in decoration-1 cursor-pointer decoration-transparent hover:underline hover:decoration-current focus:underline focus:decoration-current decoration-white/60 text-xs underline-offset-[0.375rem] text-xs md:text-xs"
                >
                  {t('privacy')}
                </Link>
              </div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="content-end col-start-1 md:col-start-7 col-end-[span_12] md:col-end-[span_6]">
            <div className="flex gap-5">
              <a href="https://www.facebook.com/wood.baconsoup?locale=fo_FO" target="_blank" rel="noopener noreferrer" className="transition-text-decoration duration-300 ease-in decoration-1 cursor-pointer decoration-transparent hover:underline hover:decoration-current focus:underline focus:decoration-current decoration-white/60 text-sm underline-offset-[0.375rem]">
                <svg className="text-white hover:text-white/60" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/adelelofeudo/" target="_blank" rel="noopener noreferrer" className="transition-text-decoration duration-300 ease-in decoration-1 cursor-pointer decoration-transparent hover:underline hover:decoration-current focus:underline focus:decoration-current decoration-white/60 text-sm underline-offset-[0.375rem]">
                <svg className="text-white hover:text-white/60" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Language Switcher */}
      <LanguageSwitcher />

      {/* Modal Mostre */}
      {selectedMostra && (
        <MostraModal
          isOpen={isModalOpen}
          onClose={closeMostraModal}
          mostra={selectedMostra}
        />
      )}

      {/* Modal Testi Critici */}
      {selectedCritico && (
        <TestoCriticoModal
          isOpen={isCriticoModalOpen}
          onClose={closeCriticoModal}
          critico={selectedCritico}
        />
      )}
    </div>
  );
};

export default Collezione;
