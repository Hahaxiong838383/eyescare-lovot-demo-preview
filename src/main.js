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
  gsap.utils.toArray('.reveal-section:not(.hero-caption)').forEach((element) => {
    gsap.from(element,{autoAlpha:0,y:48,duration:1.05,ease:'power3.out',scrollTrigger:{trigger:element,start:'top 88%',toggleActions:'play none none none'}});
  });
  const heroTimeline = gsap.timeline({defaults:{ease:'power3.out'}});
  heroTimeline.from('.hero-caption>p',{autoAlpha:0,y:18,duration:.7})
    .from('.hero-caption h1 span',{autoAlpha:0,y:30,duration:.85,stagger:.12},'-=.42')
    .from('.hero-caption>small',{autoAlpha:0,y:16,duration:.65},'-=.5')
    .from('.hero-actions>*',{autoAlpha:0,y:14,duration:.55,stagger:.08},'-=.4')
    .from('.hero-device',{autoAlpha:0,x:70,duration:1.15},'-=.95');
  gsap.fromTo('.hero-frame img',{scale:1.045},{scale:1,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.fromTo('.technology-bg',{scale:1.08},{scale:1,ease:'none',scrollTrigger:{trigger:'.technology',start:'top bottom',end:'bottom top',scrub:1.2}});
}
