import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactComponent as AdeleSVG } from '../assets/images/adele.svg';
import { getSections, getArtworks, type Section, type Artwork } from '../services/api';

const Collezione: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

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

  useEffect(() => {
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
    });

    return () => ctx.revert();
  }, [artworks]);

  // Usa i dati dalla sezione se disponibili, altrimenti fallback
  const currentSection = sections.length > 0 ? sections[0] : null;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Adele Lo Feudo - L'Artista Italiana</title>
        <meta name="description" content="Adele Lo Feudo - L'artista italiana che esplora l'anima attraverso la materia. Scopri le opere d'arte contemporanea." />
      </Helmet>

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex flex-col justify-center p-0 w-screen -ml-[calc(50vw-50%)]">
        <div className="w-full pt-24 px-6 mobile:pt-24 mobile:px-6" style={{ textAlign: 'left' }}>
          <div ref={titleRef} className="w-full mb-0 flex mobile:justify-center" style={{ justifyContent: 'flex-start' }}>
            <AdeleSVG className="w-full h-auto fill-white [&_*]:fill-white" style={{ maxWidth: '100%' }} />
          </div>
          <h2 ref={subtitleRef} className="text-body font-bold uppercase leading-[1.4] tracking-[0px] text-left mt-6 mb-6">
            L'Artista Italiana che Esplora l'<span className="font-medium italic text-accent underline">Anima</span><br/>
            Attraverso la <span className="font-medium italic text-accent underline">MATERIA</span>
          </h2>
        </div>
        <div className="relative w-full flex items-center justify-center mt-4 mb-16 px-6 mobile:px-6">
          <img
            className="hero-image w-[700px] max-w-[90%] h-auto object-contain object-center rounded-[10px]"
            src="https://framerusercontent.com/images/8TonweCu2FGoT0Vejhe7bUZe5ys.png"
            alt="Adele Lo Feudo - Artista"
            loading="lazy"
          />
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20 px-6 mobile:py-12 mobile:px-6">
        <div className="flex flex-col justify-start flex-shrink-0">
          <div className="heading-primary text-left whitespace-normal">
            Adele Lo Feudo, in arte <span className="text-accent">ALF</span>, è una pittrice contemporanea nota per le sue opere materiche e ritratti espressivi. Esplora temi sociali e l'<span className="text-accent">universo femminile</span> con sguardo penetrante, trasformando la tela in territorio di esplorazione dell'<span className="text-accent">anima</span> umana.
          </div>
        </div>
      </section>

      {/* Sculture */}
      <section id="sculture" className="collection-grid py-20">
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
            <div key={artwork.id} className="collection-item relative overflow-hidden flex-shrink-0 flex flex-col gap-4" style={{ width: '400px' }}>
              <div className="w-full h-[400px] relative">
                <img
                  src={artwork.image_url || '/opera.png'}
                  alt={artwork.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="bg-transparent">
                <p className="text-description text-left">
                  {artwork.description || 'Opere scultoree che esplorano la materia e la forma attraverso l\'arte contemporanea'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Collezione;
