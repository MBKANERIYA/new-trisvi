import { useEffect, useRef, useState, useCallback } from 'react';
import { NavLink, Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, ChevronRight, Menu, Send, X } from 'lucide-react';
import axios from 'axios';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { categories, contact, services } from './data';

gsap.registerPlugin(ScrollTrigger);

/* ── Constants ── */
const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Products', to: '/products' },
  { label: 'How We Work', to: '/how-we-work' },
  { label: 'Partners', to: '/partners' },
  { label: 'Contact', to: '/contact' },
];

const processSteps = [
  ['01', 'Discover', 'Understand buyer requirements and market opportunities.'],
  ['02', 'Source', 'Identify suitable manufacturers and suppliers.'],
  ['03', 'Sample', 'Evaluate samples, specifications and product quality.'],
  ['04', 'Assess', 'Review documentation, testing and applicable UK requirements.'],
  ['05', 'Develop', 'Finalise formulation, packaging, branding and commercial specifications.'],
  ['06', 'Supply', 'Coordinate production, logistics and international delivery.'],
];

const pageHeroImages = {
  'About Us': '/assets/img-s/hero-about.png',
  'What We Do': '/assets/img-s/hero-services.png',
  Products: '/assets/img-s/hero-products.png',
  'How We Work': '/assets/img-s/hero-how-we-work.png',
  'For Suppliers / Manufacturers': '/assets/img-s/hero-partners.png',
  'Product Development': '/assets/img-s/hero-product-development.png',
  'For Buyers': '/assets/img-s/hero-buyer-enquiry.png',
  'Contact Us': '/assets/img-s/hero-contact.png',
  404: '/assets/img-s/hero-products.png',
};

const faqs = [
  { question: 'What products does TRISHVI GLOBAL LTD supply?', answer: 'We supply product opportunities across whole spices, spice powders, spice blends, pulses and lentils, pickles, snacks, packaged foods, tea and beverage products.' },
  { question: 'Do you support international sourcing and shipping?', answer: 'Yes. We support international sourcing, import and export opportunities, working with suppliers and buyers across the UK, India and global markets.' },
  { question: 'Do you offer private-label product development?', answer: 'Yes. We can support private-label opportunities from product identification and supplier discussions through to packaging and documentation review.' },
  { question: 'How do you approach product quality and compliance?', answer: 'We work with suppliers to obtain relevant product specifications, technical documents and quality information for appropriate market and compliance assessment.' },
];

/* ── Hooks ── */

// Check reduced motion preference
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

// IntersectionObserver-based visibility
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Lenis Smooth Scroll Manager ── */
let lenisInstance = null;
let lenisTicker = null;

function initLenis() {
  if (lenisInstance) return lenisInstance;

  // Don't init on reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  // Don't init on touch devices for native scrolling feel
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return null;

  lenisInstance = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);
  lenisTicker = (time) => {
    lenisInstance?.raf(time * 1000);
  };
  gsap.ticker.add(lenisTicker);
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

function destroyLenis() {
  if (lenisInstance) {
    if (lenisTicker) gsap.ticker.remove(lenisTicker);
    lenisTicker = null;
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

/* ── GSAP Animation Helpers ── */
function createScrollReveal(element, options = {}) {
  const {
    y = 40,
    x = 0,
    opacity = 0,
    duration = 0.8,
    delay = 0,
    ease = 'power3.out',
    start = 'top 88%',
  } = options;

  return gsap.fromTo(
    element,
    { y, x, opacity },
    {
      y: 0,
      x: 0,
      opacity: 1,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: element,
        start,
        toggleActions: 'play none none none',
      },
    }
  );
}

function createStaggerReveal(parent, childSelector, options = {}) {
  const {
    y = 40,
    opacity = 0,
    duration = 0.7,
    stagger = 0.1,
    ease = 'power3.out',
    start = 'top 85%',
  } = options;

  const children = parent.querySelectorAll(childSelector);
  if (!children.length) return null;

  return gsap.fromTo(
    children,
    { y, opacity },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: parent,
        start,
        toggleActions: 'play none none none',
      },
    }
  );
}

/* ── Components ── */

function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={`reveal ${direction} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Preloader() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 800);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <div className={loading ? 'preloader' : 'preloader done'} aria-hidden={!loading}>
      <div className="loader-ring">
        <span>TG</span>
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let frame;
    const update = () => {
      setScrolled((v) => (v === (window.scrollY > 20) ? v : !v));
      frame = undefined;
    };
    const onScroll = () => {
      if (frame === undefined) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, []);

  // Close mobile nav on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="header-wrap">
        <Link className="brand" to="/" onClick={close}>
          <img className="brand-logo" src="/lo.png" alt="TRISHVI GLOBAL LTD" />
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-controls="primary-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        <nav id="primary-navigation" className={open ? 'main-nav is-open' : 'main-nav'}>
          {nav.map((link) => link.label === 'Products' ? (
            <div className="nav-dropdown" key={link.to}>
              <NavLink className="nav-dropdown-trigger" to={link.to} onClick={close}>
                <span>{link.label}</span>
                <ChevronDown size={15} strokeWidth={2.5} aria-hidden="true" />
              </NavLink>
              <div className="product-dropdown" aria-label="Product categories">
                {categories.map((category) => (
                  <NavLink
                    key={category.slug}
                    to={`/products/${category.slug}`}
                    end
                    onClick={close}
                  >
                    {category.name}
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={close}>
              {link.label}
            </NavLink>
          ))}
          <Link className="header-cta" to="/contact" onClick={close}>
            Get in touch
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const footerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !footerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current.querySelectorAll('.footer-grid > div'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="footer-grid">
        <div>
          <Link to="/">
            <img className="footer-logo" src="/lo.png" alt="TRISHVI GLOBAL LTD" />
          </Link>
          <p>
            Connecting Markets.
            <br />
            Creating Opportunities.
          </p>
        </div>
        <div>
          <h3>Company</h3>
          {nav.slice(1).map((link) => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
        </div>
        <div>
          <h3>Business</h3>
          <Link to="/partners">Become a Supplier</Link>
          <Link to="/buyer-enquiry">Buyer Enquiry</Link>
          <Link to="/product-development">Product Development</Link>
          <Link to="/how-we-work">International Trade</Link>
        </div>
        <div>
          <h3>Legal</h3>
          <a href="#privacy">Privacy Policy</a>
          <a href="#cookies">Cookie Policy</a>
          <a href="#terms">Terms &amp; Conditions</a>
        </div>
        <div>
          <h3>Contact</h3>
          <p>{contact.location}</p>
          {contact.emails.map((email) => (
            <a key={email} href={`mailto:${email}`}>{email}</a>
          ))}
        </div>
      </div>
      <div className="copyright">
        © {new Date().getFullYear()} TRISHVI GLOBAL LTD. All Rights Reserved.
      </div>
    </footer>
  );
}

function SectionHeading({ eyebrow, title, light = false }) {
  return (
    <Reveal direction="right" className={`section-heading${light ? ' light' : ''}`}>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
    </Reveal>
  );
}

function PageTitle({ eyebrow, title, children, image }) {
  const heroImage = image || pageHeroImages[eyebrow] || pageHeroImages.Products;
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !ref.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(ref.current.querySelector('span'), { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
        .fromTo(ref.current.querySelector('h1'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3');
      const btn = ref.current.querySelector('.button');
      if (btn) {
        tl.fromTo(btn, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.3');
      }
    }, ref);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      className="page-title"
      style={{
        '--page-title-image': `url('${heroImage}')`,
      }}
    >
      <div ref={ref}>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}

function CategoryCard({ category, delay = 0 }) {
  return (
    <Reveal className="card-reveal" delay={delay}>
      <Link className="product-card" to={`/products/${category.slug}`}>
        <span className="image-wipe">
          <img src={category.image} alt={category.name} loading="lazy" />
        </span>
        <div>
          <h3>{category.name}</h3>
          <span>
            Explore <ChevronRight size={15} />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

function ServiceCard({ service, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <Link to={`/services/${service.slug}`} className="service-card-link">
        <article className="service-card">
          <span className="service-index">0{services.indexOf(service) + 1}</span>
          <h3>{service.title}</h3>
          <p>{service.text}</p>
          <ArrowRight size={20} />
        </article>
      </Link>
    </Reveal>
  );
}

function HomeFaq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section home-faq">
      <div className="home-faq-copy">
        <SectionHeading eyebrow="Frequently Asked Questions" title="Learn more about how TRISHVI Global delivers quality products worldwide." />
        <Reveal delay={100}>
          <Link className="button solid" to="/contact">
            More Details <ArrowRight size={17} />
          </Link>
        </Reveal>
        <Reveal className="home-faq-image" delay={150}>
          <img src="/assets/img-s/Snacks.jpg" alt="Indian snacks and packaged foods" loading="lazy" />
        </Reveal>
      </div>
      <Reveal className="home-faq-list" direction="right">
        {faqs.map((faq, index) => (
          <article className={`home-faq-item${open === index ? ' active' : ''}`} key={faq.question}>
            <button type="button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>
              <span>
                <b>{String(index + 1).padStart(2, '0')}.</b> {faq.question}
              </span>
              <ChevronDown size={20} />
            </button>
            {open === index && <p>{faq.answer}</p>}
          </article>
        ))}
      </Reveal>
    </section>
  );
}

/* ── Page Components ── */

function Home() {
  const heroRef = useRef(null);
  const sectionsRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      // Show everything immediately for reduced motion
      const heroContent = heroRef.current?.querySelector('.hero-content');
      if (heroContent) heroContent.classList.add('animated');
      const tradeRoute = heroRef.current?.querySelector('.trade-route');
      if (tradeRoute) tradeRoute.style.opacity = '1';
      return;
    }

    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Hero entrance timeline
      const heroTl = gsap.timeline({ delay: 0.9 });

      heroTl
        .to(heroRef.current.querySelector('.hero-content > span'), {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        })
        .fromTo(
          heroRef.current.querySelector('.hero h1'),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.35'
        )
        .fromTo(
          heroRef.current.querySelector('.hero p'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.35'
        )
        .fromTo(
          heroRef.current.querySelector('.hero-actions'),
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          heroRef.current.querySelector('.trade-route'),
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        );

      // Subtle hero background parallax
      gsap.to(heroRef.current, {
        backgroundPosition: '50% 30%',
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, heroRef);

    // Section scroll animations
    let sectionCtx;
    if (sectionsRef.current) {
      sectionCtx = gsap.context(() => {
        // Stagger service cards
        const serviceCards = sectionsRef.current.querySelectorAll('.service-card');
        if (serviceCards.length) {
          gsap.fromTo(
            serviceCards,
            { y: 50, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out',
              scrollTrigger: { trigger: serviceCards[0]?.parentElement?.parentElement, start: 'top 80%', toggleActions: 'play none none none' },
            }
          );
        }

        // Stagger product cards
        const productCards = sectionsRef.current.querySelectorAll('.product-card');
        if (productCards.length) {
          gsap.fromTo(
            productCards,
            { y: 40, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
              scrollTrigger: { trigger: productCards[0]?.closest('.cards-grid'), start: 'top 85%', toggleActions: 'play none none none' },
            }
          );
        }

        // Process steps stagger
        const processArticles = sectionsRef.current.querySelectorAll('.process-grid article');
        if (processArticles.length) {
          gsap.fromTo(
            processArticles,
            { y: 30, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out',
              scrollTrigger: { trigger: processArticles[0]?.closest('.process-grid'), start: 'top 85%', toggleActions: 'play none none none' },
            }
          );
        }

        // Trade diagram
        const tradeDiagram = sectionsRef.current.querySelector('.trade-diagram');
        if (tradeDiagram) {
          gsap.fromTo(
            tradeDiagram.children,
            { scale: 0.8, opacity: 0 },
            {
              scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.3)',
              scrollTrigger: { trigger: tradeDiagram, start: 'top 85%', toggleActions: 'play none none none' },
            }
          );
        }

        // Compliance list items
        const complianceItems = sectionsRef.current.querySelectorAll('.compliance-list span');
        if (complianceItems.length) {
          gsap.fromTo(
            complianceItems,
            { x: -20, opacity: 0 },
            {
              x: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out',
              scrollTrigger: { trigger: complianceItems[0]?.parentElement, start: 'top 85%', toggleActions: 'play none none none' },
            }
          );
        }
      }, sectionsRef);
    }

    return () => {
      ctx.revert();
      sectionCtx?.revert();
    };
  }, [reducedMotion]);

  return (
    <>
      <section className="hero trishvi-hero" ref={heroRef}>
        <div className="hero-overlay" />
        <div className="hero-bg-gradient" />
        <svg className="hero-route-lines" viewBox="0 0 1440 720" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d="M760 150C930 80 1080 130 1230 270S1370 470 1500 420" />
          <path d="M700 520C850 430 1015 465 1125 585S1310 700 1465 625" />
          <circle cx="760" cy="150" r="4" />
          <circle cx="1230" cy="270" r="4" />
          <circle cx="700" cy="520" r="4" />
          <circle cx="1125" cy="585" r="4" />
        </svg>
        <div className="hero-content hero-entrance">
          <span>TRISHVI GLOBAL LTD</span>
          <h1>
            Connecting Markets.
            <br />
            Creating Opportunities.
          </h1>
          <p>UK-Based International Import &amp; Export. Connecting businesses across the UK, India and global markets.</p>
          <div className="hero-actions">
            <Link className="button solid" to="/services">Explore Our Services</Link>
            <Link className="button outline-white" to="/contact">Work With Us</Link>
          </div>
        </div>
        <div className="trade-route">
          <span className="uk">UK</span>
          <i />
          <span className="india">INDIA</span>
        </div>
        <div className="hero-deco-line" />
      </section>

      <div ref={sectionsRef}>
        <section className="section about-intro">
          <Reveal className="photo-stack" direction="right">
            <img src="/assets/img-s/g-01 (4).png" alt="International trade" />
            <img src="/assets/img-s/aala.jpg" alt="Global product sourcing" />
          </Reveal>
          <div>
            <SectionHeading eyebrow="Who We Are" title="A UK-based partner for international trade." />
            <Reveal delay={100}>
              <p>TRISHVI GLOBAL LTD is a UK-based international trading company focused on connecting businesses, products and opportunities across global markets.</p>
              <p>We work across sourcing, import, export and product development, supporting businesses from initial product identification through to supply and international delivery.</p>
              <div className="market-line">
                <b>UK</b><span>↔</span><b>India</b><span>↔</span><b>Global Markets</b>
              </div>
              <Link className="button solid" to="/about">About TRISHVI</Link>
            </Reveal>
          </div>
        </section>

        <section className="section products-band">
          <div className="products-top">
            <SectionHeading light eyebrow="Our Services" title="International trading, developed around your requirements." />
            <Reveal delay={150}>
              <Link className="button outline-white" to="/services">View All Services</Link>
            </Reveal>
          </div>
          <div className="services-grid">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} delay={index * 80} />
            ))}
          </div>
        </section>

        <section className="section texture">
          <div className="products-top">
            <SectionHeading eyebrow="Our Product Categories" title="Product opportunities with a responsible, commercial focus." />
            <Reveal>
              <Link className="button solid" to="/products">Explore Categories</Link>
            </Reveal>
          </div>
          <div className="cards-grid">
            {categories.slice(0, 4).map((category, index) => (
              <CategoryCard key={category.slug} category={category} delay={index * 90} />
            ))}
          </div>
        </section>

        <section className="facts trade-facts">
          <div>
            <SectionHeading light eyebrow="UK ↔ India Trade" title="Connecting the UK, India and international markets." />
            <Reveal delay={100}>
              <p>Our UK-based operations provide a platform for developing trade relationships between businesses and suppliers across the UK, India and international markets.</p>
              <Link className="button outline-white" to="/partners">Partner With Us</Link>
            </Reveal>
          </div>
          <Reveal className="trade-diagram" direction="right">
            <div>United Kingdom</div>
            <i />
            <strong>TRISHVI<br />GLOBAL</strong>
            <i />
            <div>India</div>
          </Reveal>
        </section>

        <section className="section process-preview">
          <SectionHeading eyebrow="Our Process" title="A clear route from opportunity to supply." />
          <div className="process-grid">
            {processSteps.map(([number, title, copy], index) => (
              <Reveal key={number} delay={index * 80}>
                <article>
                  <b>{number}</b>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section faq-section">
          <div>
            <SectionHeading eyebrow="Quality & Compliance" title="Quality comes first." />
            <Reveal delay={100}>
              <p>We work with suppliers to obtain the technical and product documentation required for appropriate market and compliance assessment.</p>
              <Link className="button solid" to="/about#compliance">Our Approach</Link>
            </Reveal>
          </div>
          <Reveal direction="right" className="compliance-list">
            <span>Supplier evaluation</span>
            <span>Product specifications</span>
            <span>Certificate of Analysis</span>
            <span>Laboratory testing</span>
            <span>Packaging &amp; labelling review</span>
            <span>Traceability &amp; quality control</span>
          </Reveal>
        </section>
      </div>
    </>
  );
}

function About() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      const img = sectionRef.current.querySelector('img');
      if (img) {
        gsap.fromTo(img, { scale: 1.05, opacity: 0 }, {
          scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: img, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <>
      <PageTitle eyebrow="About Us" title="Building global connections with purpose." />
      <section className="section about-page" ref={sectionRef}>
        <img src="/assets/img-s/g-01 (4).png" alt="TRISHVI Global" loading="lazy" />
        <div>
          <SectionHeading eyebrow="Who We Are" title="TRISHVI GLOBAL LTD" />
          <p>TRISHVI GLOBAL LTD is a UK-based international trading company focused on connecting businesses, products and opportunities across global markets.</p>
          <p>We support sourcing, import, export and product development from initial product identification to supply and international delivery.</p>
          <ul className="tick-list">
            <li>UK-based international focus</li>
            <li>Product and documentation-led approach</li>
            <li>Supplier and buyer relationship building</li>
            <li>Long-term B2B partnerships</li>
          </ul>
        </div>
      </section>
      <section id="compliance" className="facts inset">
        <div>
          <SectionHeading light eyebrow="Quality & Compliance" title="A responsible approach to assessment." />
          <p>We seek appropriate supplier, technical and product information to support market and compliance assessment. We do not make unsupported approval or certification claims.</p>
        </div>
        <div className="facts-badges">
          <span>Supplier evaluation</span>
          <span>Ingredient documentation</span>
          <span>Allergen information</span>
          <span>Packaging review</span>
          <span>Labelling review</span>
          <span>Quality control</span>
        </div>
      </section>
    </>
  );
}

function Services() {
  return (
    <>
      <PageTitle eyebrow="What We Do" title="Our Services" />
      <section className="section">
        <div className="services-grid large">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} delay={(index % 3) * 95} />
          ))}
        </div>
      </section>
    </>
  );
}

function ServiceDetail() {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);
  if (!service) return <NotFound />;

  const serviceIndex = services.indexOf(service);
  const prevService = serviceIndex > 0 ? services[serviceIndex - 1] : null;
  const nextService = serviceIndex < services.length - 1 ? services[serviceIndex + 1] : null;

  return (
    <>
      <PageTitle eyebrow="What We Do" title={service.title} image={service.heroImage} />
      <section className="section service-detail">
        <div className="service-detail-content">
          <SectionHeading eyebrow={`Service 0${serviceIndex + 1}`} title={service.title} />
          <p className="service-detail-text">{service.detail}</p>
          {service.points && (
            <ul className="tick-list service-points">
              {service.points.map((point) => (
                <Reveal key={point} delay={50}>
                  <li>{point}</li>
                </Reveal>
              ))}
            </ul>
          )}
          <div className="service-detail-actions">
            <Link className="button solid" to="/contact">
              Discuss This Service <ArrowRight size={17} />
            </Link>
            <Link className="button outline-deep" to="/services">
              All Services
            </Link>
          </div>
        </div>
      </section>

      {(prevService || nextService) && (
        <section className="section service-nav-section">
          <h3 className="service-nav-title">Explore More Services</h3>
          <div className="service-nav-cards">
            {prevService && (
              <Link to={`/services/${prevService.slug}`} className="service-nav-card">
                <span className="service-nav-dir">← Previous</span>
                <strong>{prevService.title}</strong>
                <p>{prevService.text}</p>
              </Link>
            )}
            {nextService && (
              <Link to={`/services/${nextService.slug}`} className="service-nav-card">
                <span className="service-nav-dir">Next →</span>
                <strong>{nextService.title}</strong>
                <p>{nextService.text}</p>
              </Link>
            )}
          </div>
        </section>
      )}
    </>
  );
}

function Products() {
  return (
    <>
      <PageTitle eyebrow="Products" title="Our Product Categories" />
      <section className="section">
        <p className="page-intro">We focus on categories that genuinely represent the product opportunities we intend to explore and develop.</p>
        <div className="all-products-grid">
          {categories.map((category, index) => (
            <CategoryCard key={category.slug} category={category} delay={(index % 3) * 95} />
          ))}
        </div>
      </section>
    </>
  );
}

function CategoryDetail() {
  const { slug } = useParams();
  const category = categories.find((item) => item.slug === slug);
  if (!category) return <NotFound />;
  return (
    <>
      <PageTitle eyebrow="Product Category" title={category.name} image={category.image} />
      <section className="section product-detail">
        <img src={category.image} alt={category.name} loading="lazy" />
        <div>
          <SectionHeading eyebrow="Our Products" title={`Premium Quality ${category.name}`} />
          <p>{category.text}</p>
          <ul className="tick-list product-items">
            {category.products.map((product) => (
              <li key={product}>{product}</li>
            ))}
          </ul>
          <p>Tell us about your product requirements and we can explore suitable sourcing, development and trading opportunities.</p>
          <Link className="button solid" to="/buyer-enquiry">Send a Buyer Enquiry</Link>
        </div>
      </section>
    </>
  );
}

function Process() {
  return (
    <>
      <PageTitle eyebrow="How We Work" title="From opportunity to international supply." />
      <section className="section">
        <div className="process-grid detailed">
          {processSteps.map(([number, title, copy], index) => (
            <Reveal key={number} delay={index * 75}>
              <article>
                <b>{number}</b>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

function Partners() {
  return (
    <>
      <PageTitle eyebrow="For Suppliers / Manufacturers" title="Become a TRISHVI Supplier" />
      <section className="section contact">
        <div>
          <SectionHeading eyebrow="International opportunities" title="Looking to expand into new markets?" />
          <p>We are building relationships with manufacturers and suppliers with the capability to support international trade, product development and private-label opportunities.</p>
          <PartnerForm />
        </div>
        <aside>
          <img src="/assets/img-s/pl.jpg" alt="Supplier partnership" loading="lazy" />
          <h3>What to include</h3>
          <p>Company details, product categories, manufacturing capability, certifications, MOQ, export markets, private-label capability and contact information.</p>
        </aside>
      </section>
    </>
  );
}

function ProductDevelopment() {
  return (
    <>
      <PageTitle eyebrow="Product Development" title="Concept to production, responsibly evaluated." />
      <section className="section">
        <div className="development-flow">
          {['Concept', 'Sample', 'Evaluation', 'Compliance', 'Packaging', 'Production'].map((step, index) => (
            <Reveal key={step} delay={index * 90}>
              <span>{step}</span>
            </Reveal>
          ))}
        </div>
        <div className="project-note">
          <b>Project 01 — Gummy Product Development</b>
          <span>Under Development</span>
          <p>TRISHVI is currently evaluating product concepts, samples, technical documentation and manufacturing partners for potential UK-market opportunities.</p>
        </div>
      </section>
    </>
  );
}

function EnquiryForm({ supplier = false }) {
  const [form, setForm] = useState({
    company: '', contact: '', email: '', country: '', product: '', quantity: '', message: '',
  });
  const [state, setState] = useState({ loading: false, message: '', error: false });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setState({ loading: true, message: '', error: false });
    try {
      const { data } = await axios.post('/api/enquiries', {
        name: form.contact,
        email: form.email,
        phone: '',
        message: `${supplier ? 'Supplier application' : 'Buyer enquiry'} | ${JSON.stringify(form)}`,
      });
      setState({ loading: false, message: data.message, error: false });
    } catch (error) {
      setState({
        loading: false,
        message: error.response?.data?.message || 'Unable to send your enquiry. Please try again.',
        error: true,
      });
    }
  };

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>Company name<input name="company" required onChange={onChange} /></label>
      <label>Contact person<input name="contact" required onChange={onChange} /></label>
      <label>Email<input type="email" name="email" required onChange={onChange} /></label>
      <label>Country<input name="country" required onChange={onChange} /></label>
      <label>{supplier ? 'Product categories' : 'Product required'}<input name="product" required onChange={onChange} /></label>
      <label>{supplier ? 'MOQ / capabilities' : 'Quantity / target price'}<input name="quantity" onChange={onChange} /></label>
      <label>Requirements / message<textarea name="message" required minLength="10" rows="5" onChange={onChange} /></label>
      <button className="button solid" disabled={state.loading}>
        {state.loading ? 'Sending…' : supplier ? 'Become a Supplier' : 'Submit Enquiry'} <Send size={16} />
      </button>
      {state.message && (
        <p className={state.error ? 'form-message error' : 'form-message'}>{state.message}</p>
      )}
    </form>
  );
}

function PartnerForm() {
  return <EnquiryForm supplier />;
}

function BuyerEnquiry() {
  return (
    <>
      <PageTitle eyebrow="For Buyers" title="Looking for a Product?" />
      <section className="section contact">
        <div>
          <SectionHeading eyebrow="Buyer Enquiry" title="Tell us what you are looking for." />
          <p>Our team can explore suitable sourcing opportunities based on your commercial and product requirements.</p>
          <EnquiryForm />
        </div>
        <aside>
          <img src="/assets/img-s/k-04.jpg" alt="Buyer enquiry" loading="lazy" />
          <h3>TRISHVI GLOBAL LTD</h3>
          <p>Connecting markets, products and opportunities across international supply chains.</p>
        </aside>
      </section>
    </>
  );
}

function Contact() {
  return (
    <>
      <PageTitle eyebrow="Contact Us" title="Let's build global connections." />
      <section className="section contact">
        <div>
          <SectionHeading eyebrow="TRISHVI GLOBAL LTD" title="Get in touch with our team." />
          <EnquiryForm />
        </div>
        <aside>
          <img src="/assets/contact-us-image.jpg" alt="Contact TRISHVI Global" loading="lazy" />
          <h3>United Kingdom</h3>
          {contact.emails.map((email) => (
            <a key={email} href={`mailto:${email}`}>{email}</a>
          ))}
        </aside>
      </section>
    </>
  );
}

function NotFound() {
  return (
    <PageTitle eyebrow="404" title="Page not found">
      <Link className="button solid" to="/" style={{ marginTop: '20px' }}>Back home</Link>
    </PageTitle>
  );
}

/* ── Layout ── */
function Layout() {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    if (reducedMotion) return;
    const lenis = initLenis();
    return () => {
      // Don't destroy on route change, only on unmount
    };
  }, [reducedMotion]);

  // Cleanup Lenis on full unmount
  useEffect(() => {
    return () => destroyLenis();
  }, []);

  // Scroll to the top or an in-page target after React has rendered the route.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const targetId = location.hash ? decodeURIComponent(location.hash.slice(1)) : '';
      const target = targetId ? document.getElementById(targetId) : null;
      const headerHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height')
      ) || 0;

      if (target) {
        if (lenisInstance) {
          lenisInstance.scrollTo(target, { offset: -headerHeight });
        } else {
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - headerHeight,
            behavior: reducedMotion ? 'auto' : 'smooth',
          });
        }
      } else if (lenisInstance) {
        lenisInstance.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, location.hash, reducedMotion]);

  // Clean up ScrollTriggers on route change
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [location.pathname]);

  return (
    <>
      <Preloader />
      <Header />
      <main key={location.pathname}>
        <Routes>
          <Route path="/" element={<><Home /><HomeFaq /></>} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<CategoryDetail />} />
          <Route path="/how-we-work" element={<Process />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/buyer-enquiry" element={<BuyerEnquiry />} />
          <Route path="/product-development" element={<ProductDevelopment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return <Layout />;
}
