import { FormEvent, useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "./assets/enovative-logo.svg";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════
   DATA — EDIT YOUR CONTENT HERE
   ═══════════════════════════════════════════════════════ */

type View = "home" | "work" | "services" | "method" | "insights" | "room" | "network" | "about" | "contact" | "resources" | "strategy" | "article" | "case-study" | "privacy" | "terms" | "cookies";
type Navigate = (view: View, key?: string) => void;

const contentImages = {
  hero: "/images/hero.jpg",
  opportunity: "/images/opportunity.jpg",
  whoWeAre: "/images/who-we-are.jpg",
  process: "/images/our-process.jpg",
  room: "/images/enovative-room.jpg",
  network: "/images/enovative-network.jpg",
};

// ── Ambient video for the vision / belief section ──
const VISION_VIDEO = "https://videos.pexels.com/video-files/7148578/7148578-uhd_3840_2160_25fps.mp4";
const VISION_POSTER = "https://images.pexels.com/videos/7148578/busy-colleagues-conference-room-corporate-7148578.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400";

// ── Navigation ──
const navItems: { label: string; view: View }[] = [
  { label: "Work", view: "work" },
  { label: "Services", view: "services" },
  { label: "About", view: "about" },
  { label: "Insights", view: "insights" },
  { label: "Enovative Network", view: "network" },
  { label: "Contact", view: "contact" },
];

// ── Projects / Case Studies ──
// mediaType: "video" or "image"
// media: URL to video file or image file
// poster: a still image fallback for video
// color: the accent colour for the project title
type ProjectType = {
  number: string; name: string; category: string; color: string;
  mediaType: "video" | "image"; media: string; poster: string;
  challenge: string; insight: string; strategy: string; solution: string;
  results: string[];
};

const projects: ProjectType[] = [
  {
    number: "01",
    name: "University of Investors",
    category: "Education / Investment",
    color: "#0ab5b2",
    mediaType: "video",
    media: "https://videos.pexels.com/video-files/7505029/7505029-uhd_3840_2160_25fps.mp4",
    poster: "https://images.pexels.com/videos/7505029/coworking-desk-diversity-men-7505029.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1800",
    challenge: "A growing education venture needed to feel credible to students, parents and first-time investors.",
    insight: "People trust financial education faster when the brand feels structured, generous and future-facing.",
    strategy: "We clarified the promise, built an investor-learning language and designed a system that makes ambition feel practical.",
    solution: "Positioning, messaging, identity direction and a scalable digital experience.",
    results: ["Improved trust", "Better engagement", "Stronger positioning"],
  },
  {
    number: "02",
    name: "Redeemed Apparel",
    category: "Fashion / Retail",
    color: "#0ab5b2",
    mediaType: "video",
    media: "https://videos.pexels.com/video-files/5896104/5896104-uhd_3840_2160_30fps.mp4",
    poster: "https://images.pexels.com/videos/5896104/pexels-photo-5896104.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1800",
    challenge: "A promising fashion business had product quality, but the brand did not carry the same confidence.",
    insight: "The audience needed to see care, craft and conviction before they saw the catalogue.",
    strategy: "We turned the brand into a belief system that could work across product drops, social content and retail moments.",
    solution: "Brand story, identity system, art direction and digital commerce guidance.",
    results: ["Increased inquiries", "Improved trust", "Higher perceived value"],
  },
  {
    number: "03",
    name: "Enov8 Music Academy",
    category: "Education / Culture",
    color: "#0ab5b2",
    mediaType: "video",
    media: "https://videos.pexels.com/video-files/8134419/8134419-uhd_4096_2160_25fps.mp4",
    poster: "https://images.pexels.com/videos/8134419/adult-aid-business-child-8134419.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1800",
    challenge: "A creative academy needed to show discipline, possibility and cultural relevance at once.",
    insight: "Music education wins when the brand feels both aspirational and accessible.",
    strategy: "We built a clear pathway from curiosity to commitment through language, visuals and web structure.",
    solution: "Messaging, enrolment journey, identity refresh and digital launch system.",
    results: ["Better engagement", "Clearer enrolment path", "Stronger credibility"],
  },
  {
    number: "04",
    name: "SB Apparel",
    category: "Fashion / Export",
    color: "#ffffff",
    mediaType: "video",
    media: "https://videos.pexels.com/video-files/5896100/5896100-uhd_3840_2160_30fps.mp4",
    poster: "https://images.pexels.com/videos/5896100/pexels-photo-5896100.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1800",
    challenge: "A fashion label with export ambition needed a brand that could travel beyond its immediate market.",
    insight: "Export-ready brands need cultural confidence and commercial clarity in equal measure.",
    strategy: "We shaped a more ownable market position, then built a system for consistent storytelling.",
    solution: "Positioning, visual system, campaign direction and conversion-focused web guidance.",
    results: ["Increased conversions", "Stronger positioning", "Improved trust"],
  },
];

// ── Services ──
const services = [
  { title: "Brand", image: "/images/brand.jpg", text: "Build a brand with a clear position and a reason to be remembered.", items: ["Brand strategy", "Positioning", "Brand architecture", "Naming", "Messaging", "Visual identity", "Brand guidelines", "Rebranding", "Brand transformation"] },
  { title: "Design", image: "/images/design.jpg", text: "Turn strategy into visual communication that works across real business situations.", items: ["Graphic design", "Campaign design", "Social media design", "Marketing collateral", "Presentation design", "Event design", "Packaging", "Print", "Art direction"] },
  { title: "Digital", image: "/images/digital.jpg", text: "Create digital experiences that help businesses communicate, convert and grow.", items: ["Website design", "Website development", "Landing pages", "UI/UX", "Digital experiences", "Conversion-focused websites", "Digital strategy", "Interactive experiences"] },
  { title: "Creative", image: "/images/creative.jpg", text: "Develop ideas that make brands visible, memorable and commercially relevant.", items: ["Creative strategy", "Campaign concepts", "Creative direction", "Content concepts", "Art direction", "Brand campaigns", "Creative production", "Social campaigns", "Marketing concepts"] },
];

// ── Industries ──
const industries = ["Startups", "SMEs", "Professional Services", "Churches & Ministries", "Education", "Manufacturing", "Technology", "Fashion", "Tourism", "Agribusiness", "Export Businesses"];

// ── Articles ──
const articles = [
  { title: "Why So Many Botswana Businesses Look The Same — And Why It Matters", category: "Brand Strategy", slug: "botswana-businesses-look-the-same", intro: "When businesses communicate in the same broad language, customers have little reason to remember one over another. Clarity starts with understanding what makes a business relevant to the people it serves.", paragraphs: ["Across a category, businesses often describe themselves with the same words: quality, trust, service and experience. Those qualities matter, but when every competitor claims them in the same way, they stop helping people choose.", "The answer is not difference for its own sake. A useful brand begins with the business: who it serves, what it does particularly well, and what the market needs to understand. Positioning gives those decisions a clear direction; design and communication make that direction visible.", "A distinctive, relevant brand helps a business explain its value consistently across conversations, proposals, digital channels and customer experiences. The work starts with clarity, not decoration."] },
  { title: "African Brands Don't Need To Look More Western. They Need To Look More Relevant.", category: "African Markets", slug: "african-brands-and-relevance", intro: "Competing globally does not require abandoning local context. Strong brands understand the people and markets they serve, then express that understanding with confidence and craft.", paragraphs: ["A brand can meet global standards without borrowing another market's identity. Relevance comes from understanding the people a business serves and making its value clear in their context.", "That understanding should shape more than visual choices. It affects language, customer experience, the way an offer is structured and the proof a business uses to earn confidence. When those choices are grounded in the market, the brand feels considered rather than copied.", "African businesses can be globally ambitious and locally specific at the same time. The goal is not to look like somewhere else; it is to build a clear, credible brand that travels because its foundations are strong."] },
  { title: "A Great Business Can Still Fail To Communicate Why It Matters.", category: "Marketing", slug: "communicating-why-a-business-matters", intro: "Good products and expertise do not automatically explain their value. A business needs a clear story that helps people understand what it offers and why it matters.", paragraphs: ["A business owner knows the detail behind the work. A new customer does not. If the offer, audience or outcome is difficult to understand, people may move on before they discover the quality of the service.", "Clear communication connects what a business does to what its audience needs. It makes the offer easier to explain, gives teams a consistent story and helps customers see what to do next. This requires understanding the business and audience before writing headlines or designing a campaign.", "Marketing is not simply more activity. It is a way to make a business understandable, credible and relevant to the people it wants to reach."] },
  { title: "Building Export-Ready African Brands", category: "Growth & Export", slug: "building-export-ready-african-brands", intro: "Entering a new market asks more of a brand than a new logo. Businesses need a clear position, consistent communication and an understanding of the expectations they will meet.", paragraphs: ["Moving into a new market asks a business to explain itself to people who may not know its history, reputation or offer. A brand needs to make those foundations understandable without losing the qualities that make the business distinctive.", "Preparation starts with the commercial reality: which customers the business wants to reach, what they need, how the offer compares and what trust requires in that market. Positioning, messaging and a consistent identity help the business show up coherently across channels.", "Export readiness is not only a visual exercise. It is the alignment of a credible offer, clear communication and the practical ability to serve a new audience."] },
  { title: "The Cost Of Poor Branding", category: "Brand Strategy", slug: "the-cost-of-poor-branding", intro: "When a brand is unclear, inconsistent or difficult to trust, the business has to work harder to explain itself. Better communication is a commercial tool, not decoration.", paragraphs: ["An unclear brand can make a strong business harder to understand. Customers may struggle to see the difference between providers, teams may describe the offer in different ways, and marketing activity can lose focus.", "The cost is not always a single measurable event. It can show up as repeated explanations, inconsistent customer experiences or missed opportunities to build confidence. A thoughtful brand system gives people a clearer way to understand the business and gives the business a more consistent way to communicate.", "Improving a brand starts by finding the source of the confusion. Strategy sets priorities; identity, digital and creative work then help express them consistently."] },
  { title: "How African Businesses Can Compete Globally", category: "African Markets", slug: "how-african-businesses-can-compete-globally", intro: "Global ambition begins with a strong understanding of the business, its audience and its market. Distinctive relevance and high standards can work together.", paragraphs: ["Competing beyond a home market requires more than ambition. Businesses need a clear offer, reliable delivery and a brand that helps unfamiliar audiences understand why they should pay attention.", "A useful starting point is to build from what is real: customer needs, the business's capabilities and the value it can consistently deliver. Clear positioning and a coherent identity help carry that story into new conversations without making the business feel generic.", "Global standards and local understanding are not opposites. Businesses can communicate with confidence, meet high expectations and remain recognisable in the markets that shaped them."] },
  { title: "Branding In The Age Of AfCFTA", category: "Trade & Markets", slug: "branding-in-the-age-of-afcfta", intro: "As African markets become more connected, businesses need to communicate clearly across audiences while keeping the qualities that make them distinctive.", paragraphs: ["More connected markets create new possibilities, but opportunity alone does not make a business easy to choose. As companies speak to customers and partners across borders, clarity and consistency become even more important.", "A brand helps translate a business's value across different touchpoints. It does not replace market knowledge, compliance or operational readiness; it gives the business a coherent way to introduce itself, explain its offer and build confidence.", "For African businesses thinking regionally, the work is both strategic and practical: understand the audience, define a relevant position and make sure the experience supports the promise."] },
];
const brandTransformationPhases = [
  ["Discover", "Understand the business, market, audience and opportunity."],
  ["Decode", "Identify the insights, patterns and problems influencing the brand."],
  ["Define", "Establish the strategic direction, positioning, message and identity foundation."],
  ["Design", "Translate strategy into a distinctive visual and verbal brand system."],
  ["Deploy", "Put the brand into the real world across digital, marketing and customer touchpoints."],
  ["Drive", "Continue improving, activating and growing the brand."],
];


/* ═══════════════════════════════════════════════════════
   SHARED UI COMPONENTS
   ═══════════════════════════════════════════════════════ */

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7">{diagonal ? <><path d="M3 13 13 3" /><path d="M5 3h8v8" /></> : <><path d="M2 8h11" /><path d="m9 4 4 4-4 4" /></>}</svg>;
}

function Mark() {
  return <img src={logo} alt="Enovative Inc" className="brand-mark h-11 w-auto md:h-[3.4rem]" />;
}

function RoomMark() {
  return <img src="/images/enovative-room-logo.svg" alt="Enovative Room" className="room-mark" />;
}

function WhatsAppButton() {
  return <a href="https://wa.me/26778037530?text=Hello%20Enovative%20Inc%2C%20I%27d%20like%20to%20talk%20about%20a%20project." target="_blank" rel="noopener noreferrer" aria-label="Chat with Enovative Inc on WhatsApp" title="Chat with us on WhatsApp" className="fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-[#176B63] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#176B63] md:bottom-7 md:right-7">
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.1 11.5a8.1 8.1 0 0 1-11.9 7.1L4 20l1.4-4.1a8.1 8.1 0 1 1 14.7-4.4Z" />
      <path d="M9 8.5c.2-.4.4-.4.7-.4h.5c.2 0 .3.1.4.4l.7 1.7c.1.2 0 .4-.1.6l-.5.6c-.2.2-.2.4-.1.6.5.9 1.2 1.6 2.1 2 .2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.2.3.4 0 .3-.2 1-.6 1.4-.4.4-1 .6-1.6.6-.5 0-1.2-.2-2.1-.6a8 8 0 0 1-3.3-2.8c-.7-1-1.1-2-1.1-2.8 0-.7.4-1.3.7-1.5Z" />
    </svg>
  </a>;
}

function Eyebrow({ number, label, dark = false }: { number: string; label: string; dark?: boolean }) {
  return <div className={`mb-10 flex items-center gap-3 eyebrow-copy ${dark ? "text-white" : "text-[#101010]"}`}><span className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.58rem] ${dark ? "bg-[#0ab5b2] text-[#101010]" : "bg-[#101010] text-white"}`}>{number}</span><span>{label}</span></div>;
}

function TextButton({ children, onClick, dark = false }: { children: React.ReactNode; onClick?: () => void; dark?: boolean }) {
  return <button onClick={onClick} className={`btn-outline group inline-flex items-center gap-3 px-4 py-3 text-sm transition-colors ${dark ? "border-white text-white hover:text-[#0ab5b2] hover:border-[#0ab5b2]" : "border-[#101010] text-[#101010] hover:text-[#176B63] hover:border-[#176B63]"}`}>{children}<span className="transition-transform duration-300 group-hover:translate-x-1"><Arrow /></span></button>;
}

function MediaElement({ project, className = "" }: { project: ProjectType; className?: string }) {
  if (project.mediaType === "video") return <video className={className} src={project.media} poster={project.poster} autoPlay muted loop playsInline />;
  return <img className={className} src={project.media} alt="" />;
}


/* ═══════════════════════════════════════════════════════
   HEADER + MOBILE NAV
   ═══════════════════════════════════════════════════════ */

function Header({ onNavigate }: { onNavigate: Navigate }) {
  const [open, setOpen] = useState(false);
  const navigate = (view: View) => { setOpen(false); onNavigate(view); };
  return <>
    <header className="fixed inset-x-4 top-4 z-40 mx-auto flex max-w-[1600px] items-center justify-between rounded-2xl border border-white/20 bg-[#101010]/55 px-4 py-3 text-white shadow-lg backdrop-blur-xl md:inset-x-8 md:px-6 lg:inset-x-12">
      <button onClick={() => navigate("home")} aria-label="Home" className="transition-opacity hover:opacity-70"><Mark /></button>
      <nav className="hidden items-center gap-6 text-[0.72rem] font-extrabold tracking-[0.04em] xl:flex">
        {navItems.map((item) => <button key={item.view} className="nav-link" onClick={() => navigate(item.view)}>{item.label}</button>)}
        <button onClick={() => navigate("room")} aria-label="Enovative Room" title="Enovative Room" className="room-nav-link"><RoomMark /></button>
        <button onClick={() => navigate("strategy")} className="btn-outline ml-1 border-current px-4 py-2.5 text-[0.68rem]">Start a Project <Arrow diagonal /></button>
      </nav>
      <button onClick={() => setOpen(true)} className="flex flex-col gap-[7px] xl:hidden" aria-label="Open menu"><span className="block h-[1.5px] w-7 bg-current" /><span className="block h-[1.5px] w-7 bg-current" /></button>
    </header>
    <div className={`fixed inset-0 z-50 overflow-y-auto bg-[#0ab5b2] px-5 py-5 text-[#101010] transition-transform duration-500 ease-[cubic-bezier(.77,0,.18,1)] md:px-8 ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex items-center justify-between"><button onClick={() => navigate("home")}><Mark /></button><button onClick={() => setOpen(false)} aria-label="Close menu" className="flex h-9 w-9 items-center justify-center text-3xl leading-none">&times;</button></div>
      <nav className="mt-12 grid gap-2 pb-[max(6rem,env(safe-area-inset-bottom))]">{navItems.map((item, index) => <button key={item.view} onClick={() => navigate(item.view)} className="flex w-full items-center justify-between rounded-xl border border-[#101010]/35 px-4 py-3.5 text-left text-[clamp(1.7rem,8vw,3.5rem)] font-black leading-none tracking-[-0.03em]"><span>{item.label}</span><span className="font-mono text-xs tracking-normal">0{index + 1}</span></button>)}</nav>
      <button onClick={() => navigate("room")} className="room-mobile-link"><RoomMark /><span>Explore Enovative Room</span><Arrow diagonal /></button>
      <button onClick={() => navigate("strategy")} className="btn-solid mt-8 bg-[#101010] px-5 py-3 text-sm text-white">Book a Discovery Call <Arrow diagonal /></button>
    </div>
  </>;
}


/* ═══════════════════════════════════════════════════════
   CUSTOM CURSOR — improved with dot + circle + label
   ═══════════════════════════════════════════════════════ */

function CustomCursor({ label }: { label: string }) {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const move = (event: MouseEvent) => {
      gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: 0.35, ease: "power3.out" });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    if (label) {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.4)" });
    } else {
      gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
    }
  }, [label]);
  return <div ref={cursorRef} className={`custom-cursor ${label ? "is-active" : ""}`}><span className="cursor-dot" /><span className="relative z-10">{label}</span></div>;
}


/* ═══════════════════════════════════════════════════════
   PROJECT MODAL (slides up over current page)
   ═══════════════════════════════════════════════════════ */

function ProjectModal({ project, onClose }: { project: ProjectType; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
    tl.fromTo(modalRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: "power4.out" }, 0.1);
    tl.from(modalRef.current!.querySelectorAll(".modal-stagger"), { y: 40, stagger: 0.06, duration: 0.6, ease: "power3.out" }, 0.45);
  }, []);
  const close = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(modalRef.current, { yPercent: 100, duration: 0.5, ease: "power4.in" });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.25 }, 0.2);
  };
  return <div ref={overlayRef} className="fixed inset-0 z-[70] bg-black/50 text-[#101010]" onClick={close}><div ref={modalRef} onClick={(e) => e.stopPropagation()} className="absolute inset-x-0 bottom-0 max-h-[94vh] overflow-auto bg-[#f5f3ed]">
    <div className="sticky top-0 z-10 border-b border-[#101010]/20 bg-[#f5f3ed]/95 backdrop-blur-sm"><div className="shell flex items-center justify-between py-4"><p className="modal-stagger eyebrow-copy">Case Study / {project.number}</p><button onClick={close} className="modal-stagger flex items-center gap-2 text-sm font-extrabold tracking-[0.04em] transition-colors hover:text-[#176B63]"><span>Close</span><span className="text-lg leading-none">&times;</span></button></div></div>
    <div className="shell"><div className="grid-layout py-10 lg:py-16"><div className="col-span-12 lg:col-span-5"><p className="modal-stagger eyebrow-copy">{project.category}</p><h2 className="modal-stagger mt-4 text-[clamp(2.4rem,8vw,8rem)] font-black leading-[.92] tracking-[-.035em]">{project.name}</h2></div><div className="col-span-12 mt-10 overflow-hidden lg:col-span-6 lg:col-start-7 lg:mt-0"><MediaElement project={project} className="modal-stagger aspect-video w-full object-cover" /></div></div></div>
    <div className="shell"><div className="grid-layout border-t border-[#101010]/20 py-8">{[["The Challenge", project.challenge], ["The Insight", project.insight], ["The Strategy", project.strategy], ["The Solution", project.solution]].map(([title, text]) => <div key={title} className="modal-stagger col-span-12 border-b border-[#101010]/15 py-5 md:col-span-6 lg:col-span-3"><p className="eyebrow-copy">{title}</p><p className="mt-6 text-lg leading-[1.35]">{text}</p></div>)}<div className="modal-stagger col-span-12 py-8"><p className="eyebrow-copy">Results</p><div className="mt-5 flex flex-wrap gap-3">{project.results.map((result) => <span key={result} className="border border-[#101010] px-4 py-2 text-sm font-bold">{result}</span>)}</div></div></div></div>
  </div></div>;
}


/* ═══════════════════════════════════════════════════════
   HOME PAGE — all 10 sections from Option A
   ═══════════════════════════════════════════════════════ */

function Home({ onNavigate }: { onNavigate: Navigate }) {
  const rootRef = useRef<HTMLElement>(null);
  const [cursorLabel, setCursorLabel] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  // ── GSAP Animations ──
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from(".hero-copy > *", { yPercent: 120, opacity: 0, stagger: 0.1, duration: 1.2, ease: "power4.out", delay: 0.15 });
      // Hero parallax
      if (window.matchMedia("(pointer: fine)").matches) {
        gsap.to(".hero-media", { scale: 1.15, yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: true } });
      }

      // Story lines — words split-reveal style
      gsap.utils.toArray<HTMLElement>(".story-line").forEach((line) => {
        gsap.from(line, { y: 90, opacity: 0, duration: 1, ease: "power4.out", scrollTrigger: { trigger: line, start: "top 85%" } });
      });

      // Ambient video parallax
      if (window.matchMedia("(pointer: fine)").matches) {
        gsap.utils.toArray<HTMLElement>(".parallax-video video, .parallax-video img").forEach((el) => {
          gsap.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: el.parentElement!, start: "top bottom", end: "bottom top", scrub: true } });
        });
      }

      // Services marquee
      gsap.to(".services-marquee", { xPercent: -20, ease: "none", scrollTrigger: { trigger: ".services-section", start: "top bottom", end: "bottom top", scrub: true } });

      // Generic reveal-on-scroll
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((item) => {
        gsap.from(item, { y: 60, opacity: 0, duration: 0.9, ease: "power4.out", scrollTrigger: { trigger: item, start: "top 88%" } });
      });

      // Statistics counter feel
      gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
        gsap.from(el, { scale: 0.6, opacity: 0, duration: 0.7, ease: "back.out(1.6)", scrollTrigger: { trigger: el, start: "top 85%" } });
      });

      // Problem rows stagger
      gsap.utils.toArray<HTMLElement>(".problem-row").forEach((row) => {
        gsap.from(row, { x: -60, opacity: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 86%" } });
      });

      // Method cards stagger
      gsap.utils.toArray<HTMLElement>(".method-card").forEach((card, index) => {
        gsap.from(card, { y: 50, opacity: 0, duration: 0.6, delay: index * 0.08, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 88%" } });
      });

    }, rootRef);
    return () => ctx.revert();
  }, []);

  const enterProject = useCallback(() => setCursorLabel("View case"), []);
  const leaveProject = useCallback(() => setCursorLabel(""), []);

  return <main ref={rootRef} className="bg-[#101010] text-[#101010]">
    <CustomCursor label={cursorLabel} />
    <Header onNavigate={onNavigate} />

    {/* ── S1: HERO ── */}
    <section className="hero-section relative flex min-h-[100svh] overflow-hidden bg-[#101010] text-white">
      <img className="hero-media absolute inset-0 h-full w-full object-cover opacity-65" src={contentImages.hero} alt="" fetchPriority="high" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,.45)_0%,rgba(10,10,10,.2)_40%,rgba(10,10,10,.82)_100%)]" />
      <div className="hero-copy relative z-10 flex w-full flex-col justify-end pb-8 pt-24 lg:pb-12">
        <div className="shell">
        <p className="overflow-hidden text-[0.72rem] font-extrabold tracking-[0.06em] text-[#0ab5b2]">Enovative Inc</p>
        <h1 className="mt-5 max-w-6xl overflow-hidden pb-[0.12em] text-[clamp(2.5rem,7.5vw,8.5rem)] font-black leading-[.98] tracking-[-0.04em]"><span className="inline-block text-[#0ab5b2]">A Marketing Partner for Ambitious African Brands</span></h1>
        <div className="mt-8 flex max-w-3xl flex-col gap-6 border-t border-white/30 pt-5 md:flex-row md:items-end md:justify-between">
          <p className="max-w-lg text-lg leading-[1.25] text-white/80 md:text-xl">We help ambitious businesses turn ideas into brands people understand, trust and remember — from strategy and identity to digital experiences and creative execution.</p>
          <div className="flex shrink-0 flex-wrap gap-3">
            <button onClick={() => onNavigate("strategy")} className="btn-solid bg-[#0ab5b2] px-5 py-3 text-[#101010]">Start a Project <Arrow diagonal /></button>
            <button onClick={() => onNavigate("work")} className="btn-outline border-white px-5 py-3 text-white">Explore Our Work <Arrow diagonal /></button>
          </div>
        </div>
        <div className="mt-12 flex items-center gap-3 text-[0.72rem] font-extrabold tracking-[0.05em] text-white/70"><span className="h-2 w-2 rounded-full bg-[#0ab5b2]" /> Botswana Based <span className="hidden h-px w-6 bg-[#f5f3ed]/40 sm:block" /> Serving Southern Africa</div>
        </div>
      </div>
    </section>

    {/* ── S2: THE OPPORTUNITY ── */}
    <section className="relative isolate overflow-hidden bg-[#101010] py-24 text-white lg:py-36">
      <img aria-hidden="true" className="opportunity-background absolute inset-0 h-full w-full object-cover" src={contentImages.opportunity} alt="" loading="lazy" />
      <div aria-hidden="true" className="absolute inset-0 bg-[#101010]/70" />
      <div className="shell relative z-10"><div className="grid-layout">
        <div className="col-span-12 lg:col-span-3"><Eyebrow number="01" label="The Opportunity" dark /></div>
        <div className="col-span-12 lg:col-span-8 lg:col-start-5">
          <p className="story-line display-heading max-w-4xl">Good Businesses Need More Than Good Ideas.</p>
          <p className="mt-8 max-w-3xl text-2xl font-bold leading-[1.2] tracking-[-.035em]">They need a way into the market.</p>
          <div className="mt-12 grid max-w-3xl gap-8 md:grid-cols-2">
            <p className="story-line text-xl leading-[1.3] tracking-[-0.035em] md:text-2xl">Expertise. Capital. Strong services. Good products. Ambition.</p>
            <p data-reveal className="text-base leading-[1.45] text-white/80">Businesses can have all of these and still struggle to communicate why the market should care. Others know what they want to say but lack the strategic or creative capacity to express it. Enovative bridges that gap.</p>
          </div>
          <p className="mt-12 max-w-3xl text-xl font-bold leading-[1.3]">Marketing is not decoration. It is how a business becomes understandable, credible and relevant to the market.</p>
        </div>
      </div></div>
    </section>

    {/* ── S3: WHO WE ARE ── */}
    <section className="bg-[#f5f3ed] py-24 text-[#101010] lg:py-36">
      <div className="shell"><div className="grid-layout items-start">
        <div className="col-span-12 lg:col-span-5"><Eyebrow number="02" label="Who We Are" /><img className="mt-8 aspect-square w-full object-cover" src={contentImages.whoWeAre} alt="The Enovative team and the people behind the work" loading="lazy" /></div>
        <div className="col-span-12 lg:col-span-7">
          <h2 className="story-line display-heading max-w-5xl">Built For Businesses That Take Their Market Presence Seriously.</h2>
          <div className="mt-12 grid gap-8 border-t border-[#101010] pt-8 md:grid-cols-2">
            <p className="text-xl leading-[1.35]">Enovative is a Botswana-based marketing company helping ambitious African businesses build brands that are clear, credible and commercially relevant.</p>
            <p className="text-xl leading-[1.35]">We bring strategy, branding, design, digital and creative execution together under one marketing partner. We start by understanding the business behind the brand — not simply producing attractive visuals.</p>
          </div>
          <p className="mt-12 max-w-4xl text-[clamp(1.8rem,3.4vw,3.5rem)] font-black leading-[1] tracking-[-.035em]">African businesses do not need to imitate global brands to compete globally. They need to be distinctly relevant to their markets while meeting global standards.</p>
        </div>
      </div></div>
    </section>

    {/* ── S4: SERVICES AND BRAND TRANSFORMATION ENGINE ── */}
    <section className="services-section overflow-hidden bg-[#101010] py-24 text-white lg:py-36">
      <div className="shell">
        <Eyebrow number="03" label="Services" dark />
        <h2 data-reveal className="mt-4 max-w-5xl text-[clamp(2.7rem,6.5vw,7.5rem)] font-black leading-[.92] tracking-[-.035em]">Four Disciplines.<br /><span className="text-[#0ab5b2]">One Marketing Partner.</span></h2>
        <p className="mt-8 max-w-2xl text-lg leading-[1.35] text-white/70">Strategy, brand, design, digital and creative execution brought together to help ambitious businesses move from idea to market presence.</p>
      </div>
      <div className="services-marquee mt-16 whitespace-nowrap text-[clamp(2.8rem,13vw,17rem)] font-black leading-none tracking-[-.03em] text-white/[0.06]">Brand / Design / Digital / Creative / Brand / Design / Digital /</div>
      <div className="shell"><div className="mt-12 grid border-t border-white/20 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => (
          <div key={service.title} className="method-card group min-h-56 border-b border-white/20 py-6 md:border-r md:px-6 md:first:pl-0 lg:min-h-80 lg:last:border-r-0"><span className="font-mono text-xs text-[#0ab5b2]">0{index + 1}</span><img className="mt-5 aspect-square w-full object-cover" src={service.image} alt={`${service.title} services`} loading="lazy" /><h3 className="mt-6 text-3xl font-black tracking-[-0.03em] transition-colors duration-300 group-hover:text-[#0ab5b2]">{service.title}</h3><p className="mt-5 text-base leading-[1.35] text-white/65">{service.text}</p><p className="mt-5 text-xs leading-[1.6] text-white/45">{service.items.join(" · ")}</p></div>
        ))}
      </div></div>
      <div className="shell mt-16"><div className="grid-layout border-t border-white/20 pt-8"><div className="col-span-12 lg:col-span-4"><p className="eyebrow-copy text-[#0ab5b2]">How We Work</p><h3 className="mt-4 text-3xl font-black">Brand Transformation Engine™</h3><div className="mt-8 overflow-hidden rounded-2xl"><img className="process-graphic max-h-[620px] w-full object-contain object-top" src={contentImages.process} alt="The Brand Transformation Engine process" loading="lazy" /></div></div><div className="col-span-12 mt-8 lg:col-span-8 lg:mt-0"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{brandTransformationPhases.map(([phase, description], index) => <div data-reveal key={phase} className="border-t border-white/20 pt-4"><span className="font-mono text-xs text-[#0ab5b2]">0{index + 1}</span><h4 className="mt-4 text-xl font-bold">{phase}</h4><p className="mt-2 text-sm leading-[1.4] text-white/55">{description}</p></div>)}</div></div></div></div>
      <div className="shell mt-9 flex flex-wrap gap-8"><TextButton dark onClick={() => onNavigate("services")}>Explore Our Services</TextButton><TextButton dark onClick={() => onNavigate("method")}>See How We Work</TextButton></div>
    </section>

    {/* ── S5: FEATURED WORK (fullscreen pinned panels with video) ── */}
    <section className="bg-[#101010] text-white">
      <div className="shell py-20 md:py-24">
        <Eyebrow number="04" label="Selected Work" dark />
        <h2 data-reveal className="mt-4 max-w-5xl text-[clamp(3rem,8vw,9rem)] font-black leading-[.92] tracking-[-.035em]">Work Built To Move Businesses Forward.</h2>
        <p className="mt-8 max-w-2xl text-xl font-bold">Strategy is only valuable when it changes something.</p>
        <p className="mt-4 max-w-2xl text-base leading-[1.4] text-white/60">We combine strategic thinking with creative execution to help businesses become clearer, more credible and more commercially relevant.</p>
      </div>
      {projects.map((project) => (
        <button key={project.name} onMouseEnter={enterProject} onMouseLeave={leaveProject} onClick={() => setSelectedProject(project)} className="project-panel group relative flex min-h-[78vh] w-full cursor-none items-end overflow-hidden bg-[#101010] p-5 text-left text-white sm:min-h-screen md:p-8 lg:p-12">
          <MediaElement project={project} className="project-media absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.05)_0%,rgba(0,0,0,.78)_100%)]" />
          <div className="project-meta absolute left-5 top-20 z-10 flex gap-4 eyebrow-copy md:left-8 md:top-24 lg:left-12"><span>{project.number}</span><span className="text-[#0ab5b2]">{project.category}</span></div>
          <div className="relative z-10 overflow-hidden">
            <h3 className="project-title text-[clamp(2.5rem,10.5vw,12rem)] font-black leading-[.92] tracking-[-.035em]" style={{ color: project.color }}>{project.name}</h3>
            <p className="project-desc mt-6 max-w-xl text-lg leading-[1.25] text-white/70 md:text-xl">{project.strategy}</p>
          </div>
        </button>
      ))}
      <div className="shell py-10"><TextButton dark onClick={() => onNavigate("work")}>Explore All Work</TextButton></div>
    </section>

    {/* ── S6: INDUSTRIES ── */}
    <section className="bg-[#0ab5b2] py-24 text-[#101010] lg:py-36">
      <div className="shell"><div className="grid-layout"><div className="col-span-12 lg:col-span-3"><Eyebrow number="05" label="Industries" /></div><div className="col-span-12 lg:col-span-8"><h2 data-reveal className="max-w-5xl display-heading">Built For Different Businesses. Grounded In The Realities Of African Markets.</h2><p className="mt-8 max-w-2xl text-lg leading-[1.4]">We understand that different industries face different barriers to belief. Our work starts with the commercial reality behind the brand.</p></div></div></div>
      <div className="shell"><div className="mt-16 grid grid-cols-2 border-t border-[#101010] md:grid-cols-3 lg:grid-cols-4">
        {industries.map((industry, index) => (
          <div key={industry} className="group min-h-32 border-b border-r border-[#101010] p-4 text-left last:border-r-0 md:min-h-40 md:p-5"><span className="font-mono text-[0.65rem]">{String(index + 1).padStart(2, "0")}</span><span className="mt-8 block text-xl font-black leading-[.95] tracking-[-0.025em]">{industry}</span></div>
        ))}
      </div></div>
    </section>

    {/* ── S7: INSIGHTS ── */}
    <section className="bg-[#f5f3ed] py-24 lg:py-36">
      <div className="shell"><div className="grid-layout"><div className="col-span-12 lg:col-span-3"><Eyebrow number="06" label="Insights" /></div><div className="col-span-12 lg:col-span-8"><h2 data-reveal className="max-w-5xl display-heading">Thinking About Brands, Markets And What Comes Next.</h2><p className="mt-8 max-w-2xl text-lg leading-[1.4]">Practical thinking for ambitious businesses navigating changing African markets.</p></div></div></div>
      <div className="shell"><div className="mt-16 border-t border-[#101010]">
        {articles.map((article, index) => (
          <button key={article.slug} onClick={() => onNavigate("article", article.slug)} className="group flex w-full items-center gap-5 border-b border-[#101010] py-4 text-left md:gap-10 md:py-5"><span className="w-7 shrink-0 font-mono text-xs">{String(index + 1).padStart(2, "0")}</span><span className="text-[clamp(1.3rem,2.6vw,2.7rem)] font-bold leading-[1.05] tracking-[-0.025em] transition-transform duration-300 group-hover:translate-x-3">{article.title}</span><span className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"><Arrow diagonal /></span></button>
        ))}
      </div></div>
    </section>

    {/* ── S8: ENOVATIVE ROOM ── */}
    <section className="bg-[#0ab5b2] py-24 text-[#101010] lg:py-36">
      <div className="shell"><div className="grid-layout"><div className="col-span-12 lg:col-span-3"><Eyebrow number="07" label="Enovative Room" /></div><div className="col-span-12 lg:col-span-8"><h2 data-reveal className="max-w-4xl display-heading">Africa Is Changing. Pay Attention.</h2><p className="mt-8 max-w-2xl text-xl leading-[1.35]">Enovative Room is our knowledge and opportunity ecosystem exploring the developments, industries, ideas and opportunities shaping Africa.</p></div></div><img className="mt-12 aspect-[16/9] w-full object-cover" src={contentImages.room} alt="A glimpse into the Enovative Room" loading="lazy" /></div>
      <div className="shell"><div className="mt-14 grid gap-8 border-t border-[#101010]/30 pt-8 md:grid-cols-2"><p className="max-w-xl text-lg leading-[1.4]">We explore what is changing, why it matters and what ambitious people and businesses should be paying attention to.</p><div><p className="eyebrow-copy">Business · AI · Technology · Trade · Agriculture · Investment · Entrepreneurship · Economic Developments · Emerging Industries</p><p className="mt-6 font-bold">Join the Enovative Room community.</p></div></div><div className="mt-8 flex flex-wrap gap-8"><TextButton onClick={() => onNavigate("room")}>Explore Enovative Room</TextButton><TextButton onClick={() => onNavigate("resources")}>Explore Resources</TextButton></div></div>
    </section>

    {/* ── S9: SOCIAL PROOF ── */}
    <section className="bg-[#101010] py-24 text-white lg:py-36">
      <div className="shell"><div className="grid-layout"><div className="col-span-12 lg:col-span-3"><Eyebrow number="08" label="Enovative Network" dark /></div><div className="col-span-12 lg:col-span-8"><h2 data-reveal className="max-w-4xl display-heading">Build With Enovative.</h2><p className="mt-8 max-w-2xl text-xl leading-[1.35] text-white/75">Great work needs great people. Enovative Network connects us with vetted independent specialists across creative, digital, design and strategy.</p><p className="mt-5 text-lg font-bold text-[#0ab5b2]">Talent gets you noticed. Reliability gets you trusted.</p></div></div><img className="mt-12 aspect-[16/9] w-full object-cover" src={contentImages.network} alt="Independent creative specialists working together" loading="lazy" /></div>
      <div className="shell mt-10"><div className="flex flex-wrap gap-8 border-t border-white/25 pt-8"><TextButton dark onClick={() => onNavigate("network")}>Join The Network</TextButton><p className="max-w-xl text-white/60">We are looking for people who are genuinely good at what they do.</p></div></div>
    </section>

    {/* ── S10: WHY US ── */}
    <section className="bg-[#0ab5b2] py-24 text-[#101010] lg:py-36">
      <div className="shell"><div className="grid-layout"><div className="col-span-12 lg:col-span-3"><Eyebrow number="09" label="Why Us" /></div><div className="col-span-12 lg:col-span-8"><h2 data-reveal className="max-w-5xl display-heading">A Strategic Marketing Partner With Serious Creative Capability.</h2><div className="mt-14 grid gap-x-10 border-t border-[#101010]/30 md:grid-cols-2">{["Strategy", "Brand", "Creative", "Digital"].map((pillar, index) => <div key={pillar} data-reveal className="flex items-baseline gap-4 border-b border-[#101010]/30 py-5"><span className="font-mono text-xs text-[#176B63]">0{index + 1}</span><p className="text-[clamp(2rem,4.7vw,5rem)] font-black leading-[.92] tracking-[-.035em]">{pillar}</p></div>)}</div><p className="mt-10 max-w-2xl text-xl leading-[1.32] text-[#353a38]">We understand Botswana. We understand Southern Africa. And we believe African businesses deserve brands that can compete anywhere in the world. We bring the thinking and the execution together.</p></div></div></div>
    </section>

    {/* ── S11: PROOF ── */}
    <section className="bg-[#101010] py-24 text-white lg:py-36">
      <div className="shell"><div className="grid-layout"><div className="col-span-12 lg:col-span-3"><Eyebrow number="10" label="Proof" dark /></div><h2 data-reveal className="col-span-12 mt-4 max-w-4xl display-heading lg:col-span-8 lg:mt-0">Work That Has Helped Businesses Move Forward.</h2></div></div>
      <div className="shell"><div className="mt-16 grid border-y border-white/25 sm:grid-cols-2 lg:grid-cols-4">
        {[["5+", "Years Experience"], ["50+", "Projects"], ["BW", "Botswana Based"], ["SADC", "Serving Southern Africa"]].map(([metric, label], index) => (
          <div key={label} className={`min-h-32 py-5 sm:min-h-40 ${index ? "sm:border-l sm:border-white/25 sm:pl-5" : ""}`}><p className="stat-number text-4xl font-black tracking-[-0.09em] text-[#0ab5b2] sm:text-5xl">{metric}</p><p className="mt-3 eyebrow-copy text-white/55">{label}</p></div>
        ))}
      </div></div>
      <div className="shell"><blockquote data-reveal className="mt-16 max-w-4xl"><p className="text-[clamp(2rem,4.6vw,5rem)] font-black leading-[.94] tracking-[-0.035em]">&ldquo;Enovative helped us see our own value more clearly. The new brand gave us the confidence to enter rooms we had been preparing for.&rdquo;</p><footer className="mt-7 eyebrow-copy text-[#0ab5b2]">Founder, University of Investors</footer></blockquote></div>
    </section>

    {/* ── S12: VISION ── */}
    <section className="relative isolate overflow-hidden bg-[#181818] py-24 text-white lg:py-36">
      <div className="parallax-video absolute inset-0 z-0 opacity-30"><video className="hidden h-full w-full object-cover sm:block" src={VISION_VIDEO} poster={VISION_POSTER} autoPlay muted loop playsInline /><img className="h-full w-full object-cover sm:hidden" src={VISION_POSTER} alt="" loading="lazy" /></div>
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(24,24,24,.75),rgba(24,24,24,.95))]" />
      <div className="relative z-10">
        <div className="shell">
        <Eyebrow number="11" label="Our Vision" dark />
        <h2 data-reveal className="max-w-6xl text-[clamp(3rem,7.3vw,9rem)] font-black leading-[.94] tracking-[-.035em]">We Believe Africa&apos;s Greatest Brands Are Still Being Built.</h2>
        <p data-reveal className="mt-10 max-w-2xl text-xl leading-[1.35] text-white/65">We believe Botswana&apos;s businesses can compete with the best in the world. We believe branding is economic infrastructure. And we are committed to building the brands that will define Africa&apos;s next chapter.</p>
        <p data-reveal className="mt-20 max-w-4xl text-[clamp(2.4rem,5.2vw,5.6rem)] font-black leading-[.94] tracking-[-.035em] text-[#0ab5b2]">Built In Africa.<br />Ready For The World.</p>
        </div>
      </div>
    </section>

    {/* ── FINAL CTA ── */}
    <section className="bg-[#f5f3ed] py-24 text-[#101010] lg:py-36">
      <div className="shell"><div data-reveal className="grid-layout items-end">
        <div className="col-span-12 lg:col-span-8"><p className="eyebrow-copy mb-6">Your next chapter starts here</p><h2 className="display-heading max-w-5xl">Have Something Worth Building?</h2><p className="mt-8 max-w-lg text-xl leading-[1.3] text-[#55544e]">Tell us what you&apos;re working on, where you&apos;re trying to go and what you need help with.</p></div>
        <div className="col-span-12 mt-10 flex flex-wrap gap-3 lg:col-span-4 lg:justify-end lg:pb-1">
          <button onClick={() => onNavigate("strategy")} className="btn-solid bg-[#101010] px-5 py-3 text-white">Start A Project <Arrow diagonal /></button>
          <a href="https://wa.me/26778037530" target="_blank" rel="noopener noreferrer" className="btn-outline border-[#101010] px-5 py-3">Chat On WhatsApp <Arrow diagonal /></a>
        </div>
      </div></div>
    </section>
    <Footer onNavigate={onNavigate} />
    {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
  </main>;
}


/* ═══════════════════════════════════════════════════════
   SUB-PAGES (Option A structure — full content pages)
   ═══════════════════════════════════════════════════════ */

const pageInfo: Partial<Record<View, { number: string; label: string; title: string; intro: string }>> = {
  work: { number: "01", label: "Selected Work", title: "Work Built To Move Businesses Forward.", intro: "Every engagement begins with the same question: what needs to change for people to see your business differently?" },
  services: { number: "02", label: "Services", title: "Four Disciplines. One Marketing Partner.", intro: "Enovative brings strategy, brand, design, digital and creative execution together to help ambitious businesses build stronger market presence." },
  method: { number: "03", label: "Brand Transformation Engine™", title: "A Process Built To Reduce Guesswork.", intro: "Understand first. Build second. Execute with purpose." },
  insights: { number: "05", label: "Insights", title: "Thinking About Brands, Markets And What Comes Next.", intro: "Perspective, practical thinking and useful ideas for ambitious businesses navigating changing African markets." },
  room: { number: "06", label: "Enovative Room", title: "Africa Is Changing. Pay Attention.", intro: "Enovative Room is a knowledge and opportunity ecosystem exploring the developments, ideas, industries and opportunities shaping Africa." },
  network: { number: "07", label: "Enovative Network", title: "Build With Enovative.", intro: "Great work needs great people. We are building a network of talented independent creatives, designers, developers and strategists we can call on when the right project needs the right people." },
  about: { number: "08", label: "About Enovative", title: "Built For Ambitious African Brands.", intro: "Enovative is a Botswana-based marketing company helping ambitious African businesses build brands that are clear, credible and commercially relevant." },
  resources: { number: "09", label: "Resources", title: "Useful Tools For Ambitious African Businesses.", intro: "Practical frameworks, research, guides and diagnostic tools to help you make more confident business and brand decisions." },
};

function InnerHero({ number, label, title, intro, onNavigate }: { number: string; label: string; title: string; intro: string; onNavigate: Navigate }) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".inner-hero-title", { yPercent: 100, opacity: 0, duration: 1, ease: "power4.out", delay: 0.1 });
      gsap.from(".inner-hero-intro", { y: 30, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.35 });
    }, ref);
    return () => ctx.revert();
  }, []);
  return <section ref={ref} className="relative min-h-[560px] overflow-hidden bg-[#0ab5b2] pb-12 pt-28 text-[#101010] md:pb-16 lg:min-h-[680px]"><Header onNavigate={onNavigate} /><div className="absolute bottom-[-19vw] right-[-4vw] select-none text-[26vw] font-black leading-none tracking-[-0.14em] text-[#101010]/[.06] lg:text-[33vw]">E</div><div className="relative flex min-h-[430px] flex-col justify-end lg:min-h-[470px]"><div className="shell"><Eyebrow number={number} label={label} /><h1 className="inner-hero-title max-w-5xl text-[clamp(2.4rem,7vw,7.5rem)] font-black leading-[.94] tracking-[-.035em]">{title}</h1><p className="inner-hero-intro mt-9 max-w-xl text-lg leading-[1.35] md:text-xl">{intro}</p></div></div></section>;
}

function StandardPage({ view, onNavigate }: { view: "work" | "services" | "method" | "insights" | "room" | "network" | "about" | "resources"; onNavigate: Navigate }) {
  const info = pageInfo[view];
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((item) => gsap.from(item, { y: 60, opacity: 0, duration: 0.9, ease: "power4.out", scrollTrigger: { trigger: item, start: "top 88%" } }));
    }, ref);
    return () => ctx.revert();
  }, [view]);
  const body: Record<string, React.ReactNode> = {
    work: <WorkPageBody onNavigate={onNavigate} />,
    services: <ServicesPageBody onNavigate={onNavigate} />,
    method: <MethodPageBody onNavigate={onNavigate} />,
    insights: <InsightsPageBody onNavigate={onNavigate} />,
    room: <RoomPageBody onNavigate={onNavigate} />,
    network: <NetworkPageBody />,
    about: <AboutPageBody onNavigate={onNavigate} />,
    resources: <ResourcesPageBody onNavigate={onNavigate} />,
  };
  return <main ref={ref}><InnerHero {...pageInfo[view]!} onNavigate={onNavigate} />{body[view]}<Footer onNavigate={onNavigate} /></main>;
}

function PageCta({ title, onNavigate, dark = false }: { title: string; onNavigate: Navigate; dark?: boolean }) {
  return <div data-reveal className={`mt-28 border-t pt-8 ${dark ? "border-white/30" : "border-[#101010]"}`}><h2 className={`max-w-3xl text-[clamp(2.2rem,5.4vw,5.5rem)] font-black leading-[.92] tracking-[-.035em] ${dark ? "text-white" : "text-[#101010]"}`}>{title}</h2><button onClick={() => onNavigate("strategy")} className={`btn-solid mt-8 px-5 py-3 ${dark ? "bg-[#0ab5b2] text-[#101010]" : "bg-[#101010] text-white"}`}>Start a Project <Arrow diagonal /></button></div>;
}

function WorkPageBody({ onNavigate }: { onNavigate: Navigate }) {
  return <section className="bg-[#f5f3ed] py-24 lg:py-36"><div className="shell"><div data-reveal className="grid-layout"><p className="col-span-12 lg:col-span-3 eyebrow-copy">Featured case studies</p><p className="col-span-12 max-w-3xl text-2xl leading-[1.25] tracking-[-0.045em] lg:col-span-7">We pair strategic thinking with identities, digital experiences and creative execution that earn attention, build trust and make growth easier.</p></div><div className="mt-20 grid gap-x-6 gap-y-12 md:grid-cols-2">{projects.map((study) => <button data-reveal key={study.name} onClick={() => onNavigate("case-study", study.number)} className="group overflow-hidden text-left"><MediaElement project={study} className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]" /><p className="mt-5 eyebrow-copy text-[#56544e]">{study.category}</p><h2 className="mt-2 text-4xl font-black tracking-[-0.03em]">{study.name}</h2><p className="mt-3 max-w-md text-[#56544e]">{study.strategy}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">Read case study <Arrow diagonal /></span></button>)}</div><PageCta onNavigate={onNavigate} title="Have something worth building?" /></div></section>;
}

function ServicesPageBody({ onNavigate }: { onNavigate: Navigate }) {
  return <section className="bg-[#f5f3ed] py-24 lg:py-36"><div className="shell"><div className="grid gap-16">{services.map((service, index) => <article data-reveal key={service.title} className="grid-layout border-t border-[#101010] pt-7"><p className="col-span-2 font-mono text-sm text-[#176B63]">0{index + 1}</p><div className="col-span-10 lg:col-span-9"><h2 className="max-w-4xl text-[clamp(2.4rem,6vw,6rem)] font-black leading-[.92] tracking-[-.035em]">{["Build A Brand With A Clear Position.", "Make The Strategy Visible.", "Build Digital Experiences That Work.", "Turn Strategy Into Ideas People Remember."][index]}</h2><p className="mt-6 max-w-2xl text-xl leading-[1.4]">{["We help businesses clarify what they stand for, why they matter and how they should be remembered.", "Design systems and marketing communication built for the situations businesses actually operate in.", "Websites and digital experiences designed to communicate clearly, build confidence and move people toward action.", "Creative strategy and execution that helps businesses become visible, distinctive and commercially relevant."][index]}</p><img className="mt-8 aspect-[16/9] w-full object-cover" src={service.image} alt={`${service.title} service work`} loading="lazy" /><ul className="mt-8 grid gap-x-6 gap-y-3 border-t border-[#101010]/20 pt-6 sm:grid-cols-2 lg:grid-cols-3">{service.items.map((item) => <li key={item} className="border-b border-[#101010]/15 pb-3 text-sm font-semibold">{item}</li>)}</ul></div></article>)}</div><PageCta onNavigate={onNavigate} title="Ready to build your market presence?" /></div></section>;
}

function MethodPageBody({ onNavigate }: { onNavigate: Navigate }) {
  return <section className="bg-[#101010] py-24 text-white lg:py-36"><div className="shell"><div className="grid-layout"><div data-reveal className="col-span-12 lg:col-span-3"><p className="eyebrow-copy text-[#0ab5b2]">Brand Transformation Engine™</p></div><div data-reveal className="col-span-12 lg:col-span-9"><p className="max-w-3xl text-2xl leading-[1.25] tracking-[-0.045em] text-white/70">We start with the business behind the brand, then move from insight to strategy, expression, execution and continued growth.</p></div></div><img className="mt-16 max-h-[780px] w-full object-contain object-top" src={contentImages.process} alt="The six phases of the Brand Transformation Engine" loading="lazy" /><div className="mt-20 border-t border-white/25">{brandTransformationPhases.map(([title, copy], index) => <div data-reveal key={title} className="grid-layout border-b border-white/25 py-6"><span className="col-span-2 font-mono text-xs text-[#0ab5b2]">0{index + 1}</span><h2 className="col-span-10 text-[clamp(2.5rem,6vw,6rem)] font-black leading-[.92] tracking-[-.035em] md:col-span-4">{title}</h2><p className="col-span-10 col-start-3 mt-4 max-w-sm text-white/55 md:col-span-4 md:col-start-8 md:mt-0">{copy}</p></div>)}</div><PageCta onNavigate={onNavigate} title="Ready To See What Clarity Can Do?" dark /></div></section>;
}

function InsightsPageBody({ onNavigate }: { onNavigate: Navigate }) {
  return <section className="bg-[#f5f3ed] py-24 lg:py-36"><div className="shell"><div data-reveal className="grid-layout"><p className="col-span-12 lg:col-span-3 eyebrow-copy">Latest thinking</p><p className="col-span-12 max-w-3xl text-2xl leading-[1.25] tracking-[-0.045em] lg:col-span-7">Fresh perspective for leaders who know their business has more to say.</p></div><div className="mt-20 border-t border-[#101010]">{articles.map((article, index) => <button data-reveal key={article.slug} onClick={() => onNavigate("article", article.slug)} className="group grid w-full grid-layout items-center border-b border-[#101010] py-6 text-left"><span className="col-span-2 font-mono text-xs">{String(index + 1).padStart(2, "0")}</span><span className="col-span-8 text-[clamp(1.7rem,4vw,4.2rem)] font-black leading-[.9] tracking-[-0.03em] transition-transform group-hover:translate-x-2">{article.title}</span><span className="col-span-2 justify-self-end"><Arrow diagonal /></span></button>)}</div><PageCta onNavigate={onNavigate} title="Need A More Useful Brand Conversation?" /></div></section>;
}

function AboutPageBody({ onNavigate }: { onNavigate: Navigate }) {
  return <section className="bg-[#0ab5b2] py-24 text-[#101010] lg:py-36"><div className="shell"><div data-reveal className="grid-layout"><p className="col-span-12 lg:col-span-3 eyebrow-copy">Why we exist</p><div className="col-span-12 lg:col-span-8"><p className="text-[clamp(2.2rem,5vw,5.5rem)] font-black leading-[.92] tracking-[-.035em]">African businesses deserve brands that can compete anywhere in the world.</p><p className="mt-12 max-w-2xl text-xl leading-[1.35] text-[#353a38]">We believe African businesses should not have to imitate global brands to be taken seriously. They need to be distinctly relevant to their markets while meeting global standards. Enovative exists to help ambitious businesses build the clarity, credibility and creative systems needed to move forward.</p><p className="mt-8 font-bold">We bring strategy, brand, design, digital and creative together under one marketing partner.</p></div></div><img className="mt-16 aspect-[16/9] w-full object-cover" src={contentImages.whoWeAre} alt="The Enovative team and the people behind the work" loading="lazy" /><div data-reveal className="mt-24 grid border-t border-[#101010]/35 md:grid-cols-3">{[["Purpose", "Help ambitious African businesses build trusted, globally competitive brands."], ["Vision", "Help shape the brands that define Africa's next chapter."], ["Values", "Strategic thinking, boldness, craft, relevance, integrity and useful progress."]].map(([title, text]) => <div key={title} className="min-h-56 border-b border-[#101010]/35 py-5 md:border-r md:px-5 md:first:pl-0"><h2 className="text-3xl font-black tracking-[-0.03em] text-[#176B63]">{title}</h2><p className="mt-7 max-w-xs leading-[1.4] text-[#353a38]">{text}</p></div>)}</div><PageCta onNavigate={onNavigate} title="Meet A Partner For What Comes Next." /></div></section>;
}

function ResourcesPageBody({ onNavigate }: { onNavigate: Navigate }) {
  const resources = ["Brand Audit", "Brand Assessment Tool", "Guides", "Templates", "Reports", "Whitepapers"];
  return <section className="bg-[#f5f3ed] py-24 lg:py-36"><div className="shell"><div className="grid-layout"><p data-reveal className="col-span-12 lg:col-span-3 eyebrow-copy">Start here</p><p data-reveal className="col-span-12 max-w-3xl text-2xl leading-[1.25] tracking-[-0.045em] lg:col-span-7">Practical frameworks, research, guides and diagnostic tools to help you make more confident business and brand decisions.</p></div><div className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{resources.map((resource, index) => <button data-reveal onClick={() => onNavigate("strategy")} key={resource} className="group min-h-56 bg-[#0ab5b2] p-5 text-left transition-transform hover:-translate-y-1"><span className="font-mono text-xs">0{index + 1}</span><h2 className="mt-24 text-3xl font-black leading-[.9] tracking-[-0.03em]">{resource}</h2><span className="mt-4 flex justify-end"><Arrow diagonal /></span></button>)}</div><PageCta onNavigate={onNavigate} title="Want A Clearer View Of Your Brand's Next Move?" /></div></section>;
}

function RoomPageBody({ onNavigate }: { onNavigate: Navigate }) {
  const topics = ["Business", "AI", "Technology", "Trade", "Agriculture", "Investment", "Entrepreneurship", "Economic developments", "Emerging industries"];
  return <section className="bg-[#f5f3ed] py-24 lg:py-36"><div className="shell"><div className="grid-layout"><p className="col-span-12 lg:col-span-3 eyebrow-copy">Knowledge & opportunity</p><p className="col-span-12 max-w-4xl text-2xl leading-[1.3] lg:col-span-8">We look beyond branding to understand the markets our businesses operate in — from AI and technology to trade, agriculture, investment, entrepreneurship and emerging industries.</p></div><img className="mt-12 aspect-[16/9] w-full object-cover" src={contentImages.room} alt="A glimpse into the Enovative Room" loading="lazy" /><div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{topics.map((topic, index) => <div key={topic} className="border-t border-[#101010] py-5"><span className="font-mono text-xs text-[#176B63]">0{index + 1}</span><h2 className="mt-5 text-2xl font-bold">{topic}</h2></div>)}</div><div className="mt-16 border-t border-[#101010] pt-8"><p className="max-w-3xl text-xl leading-[1.4]">The Room is where we share useful research, reports, conversations and opportunities with people paying attention to what is changing across Africa.</p><div className="mt-8 flex flex-wrap gap-8"><a href="https://wa.me/26778037530?text=Hello%20Enovative%20Inc%2C%20I%27d%20like%20to%20join%20the%20Enovative%20Room%20community." target="_blank" rel="noopener noreferrer" className="btn-solid bg-[#101010] px-5 py-3 text-white">Join The Enovative Room <Arrow diagonal /></a><button onClick={() => onNavigate("resources")} className="btn-outline border-[#101010] px-5 py-3">Explore Resources <Arrow diagonal /></button></div></div><div className="mt-20 grid gap-4 md:grid-cols-3">{["Research", "Reports", "Opportunity guides", "Industry explainers", "Africa-focused business analysis", "AI and technology resources", "Community sessions", "Relevant videos and resources"].map((item) => <div key={item} className="border-t border-[#101010]/25 py-4 font-semibold">{item}</div>)}</div><PageCta onNavigate={onNavigate} title="Pay attention to what is changing across Africa." /></div></section>;
}

function NetworkPageBody() {
  const [submitted, setSubmitted] = useState(false);
  const roles = ["Graphic designers", "Brand designers", "UI/UX designers", "Web developers", "Social media strategists", "Copywriters", "Photographers", "Videographers", "Motion designers", "Creative strategists", "Digital specialists", "Other specialist creative professionals"];
  const values = ["Quality", "Communication", "Reliability", "Professionalism", "Teamwork", "Understanding a brief", "Creative thinking", "Respect for deadlines", "Project fit"];
  const steps = [["Show Us Your Work", "Submit your portfolio and tell us what you do."], ["We Review It", "We assess quality, capabilities, communication and fit."], ["Join The Network", "If there is a fit, you become part of Enovative's vetted independent network."], ["Get Called When The Right Project Comes Up", "When a suitable project matches your expertise, availability, scope and rates, Enovative can contact you."]];
  return <section className="bg-[#f5f3ed] py-24 lg:py-36"><div className="shell"><div className="grid-layout"><p className="col-span-12 lg:col-span-3 eyebrow-copy">Independent specialists</p><p className="col-span-12 max-w-3xl text-2xl leading-[1.3] lg:col-span-8">Your work could become part of something bigger. We are looking for people who are genuinely good at what they do.</p></div><img className="mt-12 aspect-[16/9] w-full object-cover" src={contentImages.network} alt="Independent creative specialists working together" loading="lazy" /><div className="mt-16 grid gap-12 lg:grid-cols-2"><div><h2 className="text-3xl font-black">Who We Are Looking For</h2><div className="mt-6 flex flex-wrap gap-2">{roles.map((role) => <span key={role} className="border border-[#101010]/25 px-3 py-2 text-sm">{role}</span>)}</div></div><div><h2 className="text-3xl font-black">What We Value</h2><p className="mt-4 text-xl font-bold">Talent gets you noticed. Reliability gets you trusted.</p><ul className="mt-6 grid grid-cols-2 gap-3">{values.map((value) => <li key={value} className="border-b border-[#101010]/20 py-2">{value}</li>)}</ul></div></div><div className="mt-20 border-t border-[#101010] pt-8"><h2 className="text-4xl font-black">How It Works</h2><div className="mt-8 grid gap-6 md:grid-cols-2">{steps.map(([title, copy], index) => <div key={title} className="border-t border-[#101010]/25 pt-4"><span className="font-mono text-xs text-[#176B63]">0{index + 1}</span><h3 className="mt-4 text-2xl font-bold">{title}</h3><p className="mt-2 max-w-lg leading-[1.4] text-[#4e4d48]">{copy}</p></div>)}</div></div><div className="mt-14 border-l-4 border-[#176B63] bg-[#0ab5b2]/40 p-6"><h2 className="font-bold">Important</h2><p className="mt-2 max-w-3xl">Joining the Network does not guarantee work. It means you become part of a trusted pool of specialists Enovative can work with when suitable opportunities arise.</p></div><div id="network-application" className="mt-20 border-t border-[#101010] pt-8"><p className="eyebrow-copy">Application form</p>{submitted ? <div className="mt-8"><h2 className="text-4xl font-black">Thanks. We have received your portfolio and will review it.</h2><button onClick={() => setSubmitted(false)} className="btn-outline mt-8 border-[#101010] px-4 py-3">Submit another portfolio</button></div> : <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="mt-8 grid gap-x-8 md:grid-cols-2">{[["Name", "Your name"], ["Profession / specialty", "What do you do?"], ["Email", "you@company.com"], ["WhatsApp", "Your WhatsApp number"], ["Portfolio", "Portfolio URL"], ["LinkedIn / professional profile", "Professional profile URL"], ["Location", "Where are you based?"], ["Areas of expertise", "What are you strongest at?"], ["Availability", "Current availability"], ["Preferred project type", "What kind of projects do you want to work on?"]].map(([label, placeholder]) => <label key={label} className="form-label">{label}<input required={label === "Name" || label === "Email" || label === "Portfolio"} type={label === "Email" ? "email" : "text"} placeholder={placeholder} className="form-input" /></label>)}{[["Short introduction", "Tell us a little about yourself."], ["Relevant experience", "Anything we should know?"]].map(([label, placeholder]) => <label key={label} className="form-label md:col-span-2">{label}<textarea rows={3} placeholder={placeholder} className="form-input resize-y" /></label>)}<button className="btn-solid mt-7 bg-[#101010] px-5 py-3 text-white md:col-span-2">Submit Your Portfolio <Arrow diagonal /></button></form>}</div><PageCta title="Think Your Work Belongs Here?" onNavigate={(view) => { if (view === "strategy") document.getElementById("network-application")?.scrollIntoView({ behavior: "smooth" }); }} /></div></section>;
}

function ArticlePage({ slug, onNavigate }: { slug: string; onNavigate: Navigate }) {
  const article = articles.find((item) => item.slug === slug);
  if (!article) return <NotFoundPage onNavigate={onNavigate} />;
  return <main><InnerHero number="01" label={article.category} title={article.title} intro={article.intro} onNavigate={onNavigate} /><article className="bg-[#f5f3ed] py-20 lg:py-28"><div className="shell"><div className="mx-auto max-w-3xl space-y-7 text-lg leading-[1.65]">{article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="mx-auto mt-16 max-w-3xl border-t border-[#101010] pt-6"><button onClick={() => onNavigate("insights")} className="btn-outline border-[#101010] px-4 py-3">Back to Insights</button></div><div className="mt-24 border-t border-[#101010] pt-8"><p className="eyebrow-copy">Related articles</p><div className="mt-8 grid gap-4 md:grid-cols-2">{articles.filter((item) => item.slug !== article.slug).slice(0, 2).map((item) => <button key={item.slug} onClick={() => onNavigate("article", item.slug)} className="border-t border-[#101010]/30 py-5 text-left text-2xl font-bold">{item.title}<span className="mt-4 flex justify-end"><Arrow diagonal /></span></button>)}</div></div><PageCta onNavigate={onNavigate} title="Need a more useful brand conversation?" /></div></article><Footer onNavigate={onNavigate} /></main>;
}

function CaseStudyPage({ number, onNavigate }: { number: string; onNavigate: Navigate }) {
  const project = projects.find((item) => item.number === number);
  if (!project) return <NotFoundPage onNavigate={onNavigate} />;
  return <main><InnerHero number={project.number} label={project.category} title={project.name} intro={project.strategy} onNavigate={onNavigate} /><section className="bg-[#f5f3ed] py-16 lg:py-24"><div className="shell"><MediaElement project={project} className="aspect-video w-full object-cover" /><div className="mt-14 grid gap-8 border-t border-[#101010]/20 pt-8 md:grid-cols-2 lg:grid-cols-4">{[["The Challenge", project.challenge], ["The Insight", project.insight], ["The Strategy", project.strategy], ["The Solution", project.solution]].map(([title, text]) => <div key={title} className="border-b border-[#101010]/15 py-5"><p className="eyebrow-copy">{title}</p><p className="mt-5 text-lg leading-[1.4]">{text}</p></div>)}</div><div className="mt-8"><p className="eyebrow-copy">Outcome / Results</p><div className="mt-4 flex flex-wrap gap-3">{project.results.map((result) => <span key={result} className="border border-[#101010] px-4 py-2 text-sm font-bold">{result}</span>)}</div></div><div className="mt-16 flex flex-wrap gap-8 border-t border-[#101010] pt-8"><button onClick={() => onNavigate("services")} className="btn-outline border-[#101010] px-4 py-3">Explore Our Services</button><button onClick={() => onNavigate("work")} className="btn-outline border-[#101010] px-4 py-3">Back to Work</button><button onClick={() => onNavigate("strategy")} className="btn-solid bg-[#101010] px-5 py-3 text-white">Start A Project <Arrow diagonal /></button></div></div></section><Footer onNavigate={onNavigate} /></main>;
}

function NotFoundPage({ onNavigate }: { onNavigate: Navigate }) {
  return <main><InnerHero number="404" label="Page not found" title="This page isn't here." intro="Use the links below to find your way back to Enovative." onNavigate={onNavigate} /><section className="bg-[#f5f3ed] py-20"><div className="shell flex flex-wrap gap-4"><button onClick={() => onNavigate("home")} className="btn-solid bg-[#101010] px-5 py-3 text-white">Go Home</button><button onClick={() => onNavigate("work")} className="btn-outline border-[#101010] px-5 py-3">Explore Our Work</button></div></section><Footer onNavigate={onNavigate} /></main>;
}

function LegalPage({ view, onNavigate }: { view: "privacy" | "terms" | "cookies"; onNavigate: Navigate }) {
  const content = {
    privacy: { title: "Privacy Policy", intro: "How Enovative Inc handles information shared through this website.", sections: [["Information you provide", "When you contact Enovative or submit a form, you may provide details such as your name, email address, telephone or WhatsApp number, company, website, industry, project needs, budget, timeline, portfolio and professional experience."], ["How information may be used", "Information submitted through this website may be used to respond to inquiries, understand a project or application, communicate with you and consider whether our services or network are relevant to your needs."], ["WhatsApp and external services", "If you choose to contact Enovative through WhatsApp or another third-party service, that interaction is also subject to that provider's own privacy practices."], ["Analytics, cookies and retention", "The website's use of analytics, cookies, third-party tools, data retention periods and security processes must be confirmed by Enovative before this draft is published as a final policy."], ["Your questions", "For questions about information you have shared with Enovative, contact info@enovativeinc.com."]] },
    terms: { title: "Terms of Service", intro: "These draft terms describe general conditions for using the Enovative Inc website.", sections: [["Website use", "You may use this website to learn about Enovative, its services and its work, and to contact the company. You agree not to misuse the site, interfere with its operation or submit unlawful or misleading material."], ["Intellectual property", "Website copy, branding, visual materials and other content are owned by Enovative Inc or used with permission, unless otherwise stated. You may not reproduce or commercially use them without the relevant rights holder's permission."], ["Services and engagements", "Website descriptions are general information and are not a contract or guarantee of a particular result. Project scope, fees, deliverables, timelines, ownership and other engagement terms should be set out in a separate written agreement."], ["Third-party links and accuracy", "This website may link to third-party platforms. Enovative does not control those services. Content is provided for general information and may be updated; confirm important details directly with Enovative."], ["Submissions and disclaimers", "Do not submit confidential or third-party material unless you are authorised to do so. Network submissions do not guarantee selection or paid work. Applicable liability terms and governing law require confirmation before publication."]] },
    cookies: { title: "Cookie Policy", intro: "This draft explains the types of cookies and similar technologies that may be used on the Enovative Inc website.", sections: [["Necessary technologies", "Technologies required for the website to load, navigate and provide features requested by a visitor may be used where necessary."], ["Analytics and functionality", "Whether analytics or functionality cookies are active, which providers set them, and how long they remain must be confirmed against the production website configuration before publication."], ["Third-party services", "Embedded media, external fonts, links and other integrations may be provided by third parties with their own technologies and privacy practices."], ["Your choices", "You can manage cookies through your browser settings. Any consent banner, opt-out mechanism or additional controls should be described here once the site's production configuration and consent requirements are confirmed."]] },
  }[view];
  return <main><InnerHero number="Legal" label="Website information" title={content.title} intro={content.intro} onNavigate={onNavigate} /><section className="bg-[#f5f3ed] py-16 lg:py-24"><div className="shell"><div className="border-l-4 border-[#176B63] bg-[#0ab5b2]/35 p-5"><p className="font-bold">Draft for review before publication</p><p className="mt-2 text-sm leading-[1.5]">Confirm Enovative's actual data practices, service terms and applicable legal requirements with the appropriate professional before using this page as a final policy.</p></div><div className="mt-12 max-w-4xl space-y-10">{content.sections.map(([heading, body]) => <section key={heading}><h2 className="text-2xl font-black">{heading}</h2><p className="mt-3 leading-[1.6] text-[#353a38]">{body}</p></section>)}</div><p className="mt-12 text-sm text-[#56544e]">Questions: <a className="underline underline-offset-4" href="mailto:info@enovativeinc.com">info@enovativeinc.com</a></p></div></section><Footer onNavigate={onNavigate} /></main>;
}

function RoutePage({ view, keyValue, onNavigate }: { view: View; keyValue: string; onNavigate: Navigate }) {
  if (view === "article") return <ArticlePage slug={keyValue} onNavigate={onNavigate} />;
  if (view === "case-study") return <CaseStudyPage number={keyValue} onNavigate={onNavigate} />;
  if (view === "privacy" || view === "terms" || view === "cookies") return <LegalPage view={view} onNavigate={onNavigate} />;
  if (isStandardView(view)) return <StandardPage view={view} onNavigate={onNavigate} />;
  return <NotFoundPage onNavigate={onNavigate} />;
}

type StandardView = "work" | "services" | "method" | "insights" | "room" | "network" | "about" | "resources";
function isStandardView(view: View): view is StandardView {
  return ["work", "services", "method", "insights", "room", "network", "about", "resources"].includes(view);
}


/* ═══════════════════════════════════════════════════════
   CONTACT + STRATEGY
   ═══════════════════════════════════════════════════════ */

function ContactPage({ onNavigate }: { onNavigate: Navigate }) {
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };
  const fields = [["Name", "Your name"], ["Email", "you@company.com"], ["Company", "Your company"], ["WhatsApp", "Your WhatsApp number"], ["Website", "Your website, if you have one"], ["Industry", "Your industry"], ["Business stage", "Where is the business right now?"], ["Service required", "What do you need help with?"], ["Problem to solve", "What are you trying to solve?"], ["Desired outcome", "What would success look like?"], ["Budget", "Approximate project budget"], ["Timeline", "When are you looking to start?"]];
  return <main><InnerHero number="10" label="Contact" title="Have Something Worth Building?" intro="Tell us what you're working on, where you're trying to go and what you need help with." onNavigate={onNavigate} /><section className="bg-[#f5f3ed] py-24 lg:py-36"><div className="shell"><div className="grid-layout"><div className="col-span-12 lg:col-span-4"><p className="eyebrow-copy">Start a conversation</p><div className="mt-12 text-lg leading-[1.5]"><a className="block underline underline-offset-4" href="mailto:info@enovativeinc.com">info@enovativeinc.com</a><a className="mt-2 block underline underline-offset-4" href="tel:+26778037530">+267 78 037 530</a><p className="mt-8">Gaborone, Botswana</p><a href="https://wa.me/26778037530" target="_blank" rel="noopener noreferrer" className="btn-outline mt-8 border-[#101010] px-4 py-3">Chat On WhatsApp <Arrow diagonal /></a></div></div><div className="col-span-12 mt-14 lg:col-span-7 lg:col-start-6 lg:mt-0">{submitted ? <div className="border-t border-[#101010] pt-8"><h2 className="text-5xl font-black leading-[.88] tracking-[-.035em]">Thank you.<br />We&apos;ll be in touch.</h2><button onClick={() => setSubmitted(false)} className="btn-outline mt-10 border-[#101010] px-4 py-3 text-sm">Send another note</button></div> : <form onSubmit={submit} className="border-t border-[#101010] md:grid md:grid-cols-2 md:gap-x-8">{fields.map(([label, placeholder]) => <label key={label} className={`form-label ${label === "Problem to solve" || label === "Desired outcome" ? "md:col-span-2" : ""}`}>{label}<input required={label === "Name" || label === "Email"} type={label === "Email" ? "email" : "text"} placeholder={placeholder} className="form-input" /></label>)}<button className="btn-solid mt-7 bg-[#101010] px-5 py-3 text-white md:col-span-2">Start The Conversation <Arrow diagonal /></button></form>}</div></div></div></section><Footer onNavigate={onNavigate} /></main>;
}

function StrategyPage({ onNavigate }: { onNavigate: Navigate }) {
  const [booked, setBooked] = useState(false);
  const fields = [["Name", "Your name"], ["Email", "you@company.com"], ["Your business", "Company name"], ["What are you building?", "A little context goes a long way."], ["What are you trying to solve?", "Tell us what is getting in the way."], ["Desired outcome", "What would you like to leave the session clearer about?"]];
  return <main><InnerHero number="11" label="Strategy Session" title="A Strategic Conversation About Your Brand." intro="One focused conversation to understand the opportunity in front of you, what is getting in the way, and what needs to happen next." onNavigate={onNavigate} /><section className="bg-[#101010] py-24 text-white lg:py-36"><div className="shell"><div className="grid-layout"><div className="col-span-12 lg:col-span-4"><p className="eyebrow-copy text-[#0ab5b2]">Who it&apos;s for</p><p className="mt-8 max-w-sm text-xl leading-[1.35] text-white/70">Founders and leaders who know their current brand no longer reflects the business they are becoming.</p><p className="eyebrow-copy mt-14 text-[#0ab5b2]">What you&apos;ll receive</p><ul className="mt-6 space-y-2 text-white/70"><li>A focused brand perspective</li><li>Clear priorities for the next 90 days</li><li>A recommended strategic path</li></ul></div><div className="col-span-12 mt-14 lg:col-span-7 lg:col-start-6 lg:mt-0">{booked ? <div className="border-t border-white/25 pt-8"><h2 className="text-5xl font-black leading-[.88] tracking-[-.035em] text-[#0ab5b2]">Your request is in.<br />We will follow up shortly.</h2></div> : <form onSubmit={(event) => { event.preventDefault(); setBooked(true); }} className="border-t border-white/25 md:grid md:grid-cols-2 md:gap-x-8">{fields.map(([label, placeholder]) => <label key={label} className={`form-label text-white/65 ${label === "What are you trying to solve?" || label === "Desired outcome" ? "md:col-span-2" : ""}`}>{label}{label.includes("?") || label === "Desired outcome" ? <textarea required={label === "Name" || label === "Email"} rows={3} placeholder={placeholder} className="form-input resize-y border-white/25 text-white placeholder:text-white/30" /> : <input required={label === "Name" || label === "Email"} type={label === "Email" ? "email" : "text"} placeholder={placeholder} className="form-input border-white/25 text-white placeholder:text-white/30" />}</label>)}<button className="btn-solid mt-7 bg-[#0ab5b2] px-5 py-3 text-[#101010] md:col-span-2">Request A Session <Arrow diagonal /></button></form>}</div></div></div></section><Footer onNavigate={onNavigate} /></main>;
}


/* ═══════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════ */

function Footer({ onNavigate }: { onNavigate: Navigate }) {
  const ecosystemLinks: { label: string; view: View }[] = [{ label: "Enovative Room", view: "room" }, { label: "Enovative Network", view: "network" }, { label: "Resources", view: "resources" }];
  const legalLinks: { label: string; view: View }[] = [{ label: "Privacy Policy", view: "privacy" }, { label: "Terms of Service", view: "terms" }, { label: "Cookie Policy", view: "cookies" }];
  return <footer className="bg-[#101010] pb-7 pt-20 text-white lg:pt-28"><div className="shell"><div className="grid-layout border-b border-white/20 pb-16"><div className="col-span-12 lg:col-span-6"><p className="text-[clamp(2.2rem,5.8vw,5.8rem)] font-black leading-[.92] tracking-[-.035em]">Built In Africa.<br /><span className="text-[#0ab5b2]">Ready For The World.</span></p><p className="mt-6 eyebrow-copy text-[#0ab5b2]">Marketing partner for ambitious African brands.</p><p className="mt-4 max-w-lg text-base leading-[1.5] text-white/60">We help ambitious businesses turn ideas into brands people understand, trust and remember — from strategy and identity to digital experiences and creative execution.</p></div><div className="col-span-12 mt-14 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5 lg:col-start-8 lg:mt-0"><div><p className="footer-label">Explore</p>{navItems.slice(0, 4).map((item) => <button onClick={() => onNavigate(item.view)} className="footer-link" key={item.view}>{item.label}</button>)}</div><div><p className="footer-label">Ecosystem</p>{ecosystemLinks.map((item) => <button onClick={() => onNavigate(item.view)} className="footer-link" key={item.view}>{item.label}</button>)}</div><div><p className="footer-label">Company</p><button onClick={() => onNavigate("contact")} className="footer-link">Contact</button><a className="footer-link" href="mailto:info@enovativeinc.com">info@enovativeinc.com</a><a className="footer-link" href="tel:+26778037530">+267 78 037 530</a><span className="footer-link">Gaborone, Botswana</span></div><div className="col-span-2 sm:col-span-3"><p className="footer-label">Legal</p><div className="flex flex-wrap gap-x-6">{legalLinks.map((item) => <button onClick={() => onNavigate(item.view)} className="footer-link" key={item.view}>{item.label}</button>)}</div></div></div></div><div className="flex flex-col gap-4 py-6 text-[0.62rem] font-bold tracking-[0.05em] text-white/40 sm:flex-row sm:justify-between"><span>Building brands for Africa&apos;s next chapter.</span><span>© {new Date().getFullYear()} Enovative Inc</span></div></div></footer>;
}


/* ═══════════════════════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════════════════════ */

function readRoute() {
  const routeText = window.location.hash.replace(/^#\/?/, "") || window.location.pathname.replace(/^\/+|\/+$/g, "");
  const [candidate, ...keyParts] = routeText.split("/");
  const routes: View[] = ["home", "work", "services", "method", "insights", "room", "network", "about", "contact", "resources", "strategy", "article", "case-study", "privacy", "terms", "cookies"];
  const view = routes.includes(candidate as View) ? candidate as View : "home";
  return { view, key: keyParts.join("/") };
}

export default function App() {
  const [route, setRoute] = useState(readRoute);
  const navigate = useCallback((nextView: View, key = "") => {
    setRoute({ view: nextView, key });
    window.history.pushState({}, "", nextView === "home" ? window.location.pathname : `#${nextView}${key ? `/${encodeURIComponent(key)}` : ""}`);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }), 0);
  }, []);
  useEffect(() => {
    const onPop = () => { setRoute(readRoute()); window.scrollTo({ top: 0 }); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return <>
    {route.view === "home" ? <Home onNavigate={navigate} /> : route.view === "contact" ? <ContactPage onNavigate={navigate} /> : route.view === "strategy" ? <StrategyPage onNavigate={navigate} /> : <RoutePage view={route.view} keyValue={route.key} onNavigate={navigate} />}
    <WhatsAppButton />
  </>;
}
