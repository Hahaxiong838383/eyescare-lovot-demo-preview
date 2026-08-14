const drawer = document.querySelector('[data-drawer]');
const toast = document.querySelector('[data-toast]');
const form = document.querySelector('[data-trial-form]');
const openButtons = document.querySelectorAll('[data-open-trial]');
const closeButton = document.querySelector('[data-close-trial]');
const firstDrawerInput = drawer?.querySelector('input, select, button');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menuPanel = document.querySelector('[data-menu-panel]');
const menuButtons = document.querySelectorAll('[data-menu-toggle]');
const siteHeader = document.querySelector('[data-nav]');

function syncHeader() {
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 24);
}
window.addEventListener('scroll', syncHeader, { passive: true });
syncHeader();

function openDrawer() {
  drawer?.classList.add('open');
  drawer?.setAttribute('aria-hidden', 'false');
  window.setTimeout(() => firstDrawerInput?.focus(), 120);
}
function closeDrawer() {
  drawer?.classList.remove('open');
  drawer?.setAttribute('aria-hidden', 'true');
}
function toggleMenu(force) {
  const open = typeof force === 'boolean' ? force : !menuPanel?.classList.contains('open');
  menuPanel?.classList.toggle('open', open);
  menuPanel?.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);
}
openButtons.forEach((button) => button.addEventListener('click', () => { toggleMenu(false); openDrawer(); }));
closeButton?.addEventListener('click', closeDrawer);
menuButtons.forEach((button) => button.addEventListener('click', () => toggleMenu()));
menuPanel?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => toggleMenu(false)));
drawer?.addEventListener('click', (event) => { if (event.target === drawer) closeDrawer(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeDrawer(); toggleMenu(false); } });
form?.addEventListener('submit', (event) => {
  event.preventDefault(); closeDrawer(); toast?.classList.add('show'); form.reset();
  window.setTimeout(() => toast?.classList.remove('show'), 2800);
});

const countTargets = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.getAttribute('data-count')) || 0;
    if (reducedMotion) { element.textContent = String(target); observer.unobserve(element); return; }
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 1100, 1);
      element.textContent = String(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick); observer.unobserve(element);
  });
}, { threshold: .4 });
countTargets.forEach((target) => countObserver.observe(target));

const temperatureStage = document.querySelector('[data-temperature-stage]');
const tempButtons = document.querySelectorAll('[data-temp]');
function setTemp(temp) {
  temperatureStage?.classList.remove('temp-3500','temp-4000','temp-5000');
  temperatureStage?.classList.add(`temp-${temp}`);
  tempButtons.forEach((button) => {
    const active = button.dataset.temp === temp;
    button.classList.toggle('active', active); button.setAttribute('aria-selected', String(active));
  });
}
tempButtons.forEach((button) => button.addEventListener('click', () => setTemp(button.dataset.temp)));
setTemp('3500');

const distanceRange = document.querySelector('[data-distance-range]');
const distanceOutput = document.querySelector('[data-distance-output]');
const virtualBook = document.querySelector('[data-virtual-book]');
function setDistance(value) {
  const distance = Number(value); const ratio = (distance - 2) / 8;
  if (distanceOutput) distanceOutput.textContent = distance % 1 === 0 ? String(distance) : distance.toFixed(1);
  virtualBook?.style.setProperty('--virtual-top', `${54 - ratio * 36}%`);
  virtualBook?.style.setProperty('--virtual-scale', String(1 - ratio * .42));
}
distanceRange?.addEventListener('input', (event) => setDistance(event.target.value));
if (distanceRange) setDistance(distanceRange.value);

const foldDemo = document.querySelector('[data-fold-demo]');
const foldButton = document.querySelector('[data-toggle-fold]');
foldButton?.addEventListener('click', () => {
  const closed = foldDemo?.classList.toggle('closed');
  foldButton.textContent = closed ? '打开前盖' : '收起前盖';
});

const reviewMessages = [
  '“孩子开始愿意把作业留在书桌上完成。”',
  '“纸笔没有变，只是眼睛不再一直盯着近处。”',
  '“第一次体验远像，30 秒就明白它是什么。”'
];
const ticker = document.querySelector('[data-review-ticker]');
const pauseButton = document.querySelector('[data-pause-voices]');
let reviewIndex = 0; let paused = false;
const tickerTimer = window.setInterval(() => {
  if (paused || !ticker) return;
  ticker.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-100%)'}],{duration:260,fill:'forwards'}).onfinish=()=>{
    reviewIndex=(reviewIndex+1)%reviewMessages.length; ticker.textContent=reviewMessages[reviewIndex];
    ticker.animate([{opacity:0,transform:'translateY(100%)'},{opacity:1,transform:'translateY(0)'}],{duration:380,fill:'forwards'});
  };
}, 4200);
pauseButton?.addEventListener('click', () => {
  paused=!paused; pauseButton.setAttribute('aria-pressed',String(paused)); pauseButton.textContent=paused?'继续口碑':'演示口碑';
});

const forbiddenEncoded=["TE9WT1Q=","44KJ44G844Gj44Go","R3Jvb3ZlIFg=","UDAwMw==","Qk9N","VMOcVg==","5rK75oSI546H","5Li05bqK5pyJ5pWI546H","6YCG6L2s6L+R6KeG"];
const leaked=forbiddenEncoded.map((value)=>atob(value)).filter((word)=>document.body.innerText.includes(word));
if(leaked.length) console.warn('禁用词检查命中：',leaked);

if (!reducedMotion && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.utils.toArray('.reveal-section:not(.hero-caption)').forEach((element) => {
    gsap.from(element,{autoAlpha:0,y:48,duration:1.05,ease:'power3.out',scrollTrigger:{trigger:element,start:'top 88%',toggleActions:'play none none none'}});
  });
  const heroTimeline = gsap.timeline({defaults:{ease:'power3.out'}});
  heroTimeline.from('.hero-caption>p',{autoAlpha:0,y:18,duration:.7})
    .from('.hero-caption h1 span',{autoAlpha:0,y:30,duration:.85,stagger:.12},'-=.42')
    .from('.hero-caption>small',{autoAlpha:0,y:16,duration:.65},'-=.5')
    .from('.hero-actions>*',{autoAlpha:0,y:14,duration:.55,stagger:.08},'-=.4')
    .from('.hero-play',{autoAlpha:0,scale:.8,duration:.7},'-=.7');

  const parallax = (target, trigger, fromVars, toVars, scrub = 1.2) => {
    gsap.fromTo(target, fromVars, {
      ...toVars,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub,
        invalidateOnRefresh: true
      }
    });
  };

  const motionMedia = gsap.matchMedia();
  motionMedia.add('(min-width: 1024px)', () => {
    parallax('.hero-frame img','.hero',{scale:1.045,yPercent:-3},{scale:1.09,yPercent:12},1);
    parallax('.hero-caption','.hero',{yPercent:7},{yPercent:-24},.9);
    parallax('.product-intro__copy','.product-intro',{yPercent:12},{yPercent:-13},1.25);
    parallax('.product-stage img','.product-intro',{scale:1.08,yPercent:-7},{scale:1.08,yPercent:8},1.35);
    parallax('.proof-numbers','.proof-wrap',{yPercent:10},{yPercent:-12},1.35);
    parallax('.owner-voices','.proof-wrap',{yPercent:-7},{yPercent:10},1.5);
    parallax('.philosophy-bg','.philosophy',{scale:1.14,yPercent:-7},{scale:1.14,yPercent:8},1.45);
    parallax('.philosophy-copy','.philosophy',{yPercent:11},{yPercent:-13},1.1);
    parallax('.evidence-copy','.evidence',{yPercent:10},{yPercent:-12},1.25);
    parallax('.evidence-image img','.evidence',{scale:1.1,yPercent:-7},{scale:1.1,yPercent:8},1.4);
    parallax('.distance-feature__visual','.distance-feature',{yPercent:-5},{yPercent:8},1.35);
    parallax('.distance-feature__copy','.distance-feature',{yPercent:11},{yPercent:-12},1.1);
    parallax('.fold-copy','.fold-feature',{yPercent:12},{yPercent:-13},1.1);
    parallax('.fold-demo','.fold-feature',{yPercent:-6},{yPercent:8},1.4);
    gsap.utils.toArray('.compare-model').forEach((model,index) => {
      const offsets = [[11,-12],[-7,9],[14,-15]][index] || [8,-8];
      parallax(model,'.compare',{yPercent:offsets[0]},{yPercent:offsets[1]},1.25 + index * .12);
    });
    parallax('.technology-bg','.technology',{scale:1.16,yPercent:-8},{scale:1.16,yPercent:10},1.55);
    parallax('.technology-copy','.technology',{yPercent:18},{yPercent:-25},1.2);
    parallax('.accessory-copy','.accessory',{yPercent:12},{yPercent:-14},1.15);
    parallax('.accessory-screen','.accessory',{yPercent:-8},{yPercent:9},1.45);
    gsap.fromTo('.message-card',{backgroundPosition:'50% 35%'},{backgroundPosition:'50% 68%',ease:'none',scrollTrigger:{trigger:'.message-card',start:'top bottom',end:'bottom top',scrub:1.4}});
    gsap.utils.toArray('.entry-grid article').forEach((card,index) => {
      parallax(card,'.entry-grid',{yPercent:index % 2 ? 7 : 13},{yPercent:index % 2 ? -9 : -14},1.25 + index * .08);
    });
  });

  motionMedia.add('(max-width: 1023px)', () => {
    parallax('.hero-frame img','.hero',{scale:1.03,yPercent:-2},{scale:1.06,yPercent:7},1.15);
    parallax('.hero-caption','.hero',{yPercent:4},{yPercent:-10},1);
    parallax('.product-stage img','.product-intro',{scale:1.04,yPercent:-3},{scale:1.04,yPercent:5},1.3);
    parallax('.philosophy-bg','.philosophy',{scale:1.1,yPercent:-4},{scale:1.1,yPercent:5},1.4);
    parallax('.evidence-image img','.evidence',{scale:1.06,yPercent:-3},{scale:1.06,yPercent:5},1.35);
    parallax('.technology-bg','.technology',{scale:1.1,yPercent:-4},{scale:1.1,yPercent:6},1.45);
  });

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
