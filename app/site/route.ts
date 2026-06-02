import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

const IMAGE_FILES = [
  "/media/drink1.jpg",
  "/media/drink2.jpg",
  "/media/drink3.jpg",
  "/media/dish1.jpg",
  "/media/dish2.jpg",
  "/media/unique1.jpg",
  "/media/unique2.jpg",
  "/media/unique3.jpg",
  "/media/unique4.jpg",
  "/media/unique5.jpg",
  "/media/spce1.jpg",
  "/media/spice2.jpg"
];

const VIDEO_FILES = ["/media/video1.mp4", "/media/video2.mp4", "/media/video3.mp4", "/media/video4.mp4"];

export async function GET() {
  const htmlPath = join(process.cwd(), "index.html");
  let html = await readFile(htmlPath, "utf8");

  // Replace data-URI media with stable deploy-safe URLs in /public/media.
  // We do this at response time to avoid editing the huge base64-heavy index.html.
  let imgIdx = 0;
  html = html.replace(/<img\s+src="data:image\/jpeg;base64,[^"]*"/g, (m) => {
    const file = IMAGE_FILES[imgIdx % IMAGE_FILES.length];
    imgIdx += 1;
    return `<img src="${file}"`;
  });

  let vidIdx = 0;
  html = html.replace(/<source\s+src="data:video\/mp4;base64,[^"]*"/g, () => {
    const file = VIDEO_FILES[vidIdx % VIDEO_FILES.length];
    vidIdx += 1;
    return `<source src="${file}"`;
  });

  // Improve navbar visibility + mobile menu + AI support UI + add more cards/photos.
  // Injected at response time to avoid editing the huge base64-heavy index.html.
  const injectedCss = `
<style>
  /* Make navbar readable after scrolling */
  nav.nav--scrolled{
    background: rgba(26,14,8,.38);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,.08);
  }

  /* Mobile menu button (only on small screens) */
  .nav-burger{
    display:none;
    width:42px;height:42px;
    border-radius:999px;
    border:1px solid rgba(255,255,255,.45);
    background: rgba(255,255,255,.08);
    backdrop-filter: blur(10px);
    cursor:none;
    align-items:center;
    justify-content:center;
    gap:4px;
    flex-direction:column;
  }
  .nav-burger i{
    display:block;
    width:18px;height:2px;
    background: rgba(255,255,255,.9);
    border-radius:2px;
  }
  .nav-mobile{
    position:fixed;
    inset:0;
    z-index:9997;
    display:none;
    background: linear-gradient(to bottom, rgba(10,5,2,.88), rgba(10,5,2,.75));
    backdrop-filter: blur(14px);
    padding: 5.5rem 1.5rem 2rem;
  }
  .nav-mobile.on{ display:block; }
  .nav-mobile a{
    display:block;
    padding: 14px 10px;
    border-bottom: 1px solid rgba(255,255,255,.08);
    color: rgba(255,255,255,.88);
    text-decoration:none;
    font-size: 12px;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor:none;
  }
  .nav-mobile a:hover{ color: var(--y); }
  .nav-close{
    position:fixed;
    top: 18px;
    right: 18px;
    z-index:9998;
    width:42px;height:42px;
    border-radius:999px;
    border:1px solid rgba(255,255,255,.45);
    background: rgba(255,255,255,.08);
    backdrop-filter: blur(10px);
    cursor:none;
    color:#fff;
    font-size:18px;
    line-height:42px;
    text-align:center;
  }
  @media(max-width:768px){
    nav{ padding: 1rem 1.2rem !important; }
    .nav-links{ display:none !important; }
    .nav-burger{ display:flex; }
  }

  /* AI Support (UI-only) */
  .ai-fab{
    position:fixed;
    right: 18px;
    bottom: 18px;
    z-index: 9996;
    width: 52px;
    height: 52px;
    border-radius: 999px;
    background: var(--p);
    color: var(--n);
    border: 0;
    cursor:none;
    box-shadow: 0 18px 50px rgba(26,14,8,.22);
    display:flex;
    align-items:center;
    justify-content:center;
    font-weight: 600;
    letter-spacing: .5px;
  }
  .ai-panel{
    position:fixed;
    right: 18px;
    bottom: 82px;
    z-index: 9996;
    width: min(360px, calc(100vw - 36px));
    height: min(520px, calc(100vh - 140px));
    border-radius: 18px;
    overflow:hidden;
    display:none;
    background: rgba(253,246,238,.86);
    border: 1px solid rgba(74,44,26,.12);
    backdrop-filter: blur(14px);
    box-shadow: 0 30px 120px rgba(26,14,8,.25);
  }
  .ai-panel.on{ display:flex; flex-direction:column; }
  .ai-hd{
    padding: 14px 14px 12px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    background: linear-gradient(90deg, rgba(244,160,181,.35), rgba(240,180,41,.22), rgba(138,184,154,.22));
    border-bottom: 1px solid rgba(74,44,26,.08);
  }
  .ai-hd b{
    font-family:'Playfair Display',serif;
    font-style: italic;
    font-weight: 400;
    letter-spacing: .4px;
    color: var(--dk);
  }
  .ai-hd button{
    width: 34px;height:34px;
    border-radius: 999px;
    border: 1px solid rgba(74,44,26,.18);
    background: rgba(255,255,255,.6);
    cursor:none;
  }
  .ai-body{
    padding: 12px 12px 0;
    overflow:auto;
    flex: 1;
  }
  .ai-msg{
    margin: 8px 0;
    padding: 10px 12px;
    border-radius: 14px;
    font-size: 12px;
    line-height: 1.6;
    letter-spacing: .2px;
    max-width: 90%;
    animation: fadeUp .6s both;
  }
  .ai-msg.bot{
    background: rgba(74,44,26,.08);
    color: rgba(45,26,14,.92);
  }
  .ai-msg.me{
    margin-left:auto;
    background: rgba(244,160,181,.28);
    color: rgba(45,26,14,.92);
  }
  .ai-quick{
    display:flex;
    flex-wrap:wrap;
    gap: 8px;
    padding: 10px 12px 12px;
    border-top: 1px solid rgba(74,44,26,.08);
    background: rgba(255,255,255,.35);
  }
  .ai-quick button{
    border: 1px solid rgba(74,44,26,.15);
    background: rgba(255,255,255,.65);
    border-radius: 999px;
    padding: 8px 10px;
    font-size: 11px;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    cursor:none;
  }
  .ai-quick button:hover{
    background: rgba(240,180,41,.25);
    border-color: rgba(240,180,41,.35);
  }
</style>
`;

  const extraScript = `
<script>
(function(){
  try {
    // Navbar: add a readable backdrop when scrolling
    var nav = document.querySelector('nav');
    if (nav) {
      var onScroll = function(){
        if (window.scrollY > 20) nav.classList.add('nav--scrolled');
        else nav.classList.remove('nav--scrolled');
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // Mobile menu (hamburger)
    if (nav && !document.querySelector('.nav-burger')) {
      var burger = document.createElement('button');
      burger.className = 'nav-burger';
      burger.setAttribute('aria-label','Open menu');
      burger.innerHTML = '<i></i><i></i><i></i>';
      nav.appendChild(burger);

      var mob = document.createElement('div');
      mob.className = 'nav-mobile';
      mob.innerHTML =
        '<div class="nav-close" aria-label="Close menu">×</div>'+
        '<a href="#hero">Home</a>'+
        '<a href="#drinks">Drinks</a>'+
        '<a href="#dishes">Dishes</a>'+
        '<a href="#unique">Unique</a>'+
        '<a href="#spice">Story</a>';
      document.body.appendChild(mob);

      var openMenu = function(){ mob.classList.add('on'); };
      var closeMenu = function(){ mob.classList.remove('on'); };
      burger.addEventListener('click', openMenu);
      mob.addEventListener('click', function(e){
        var t = e.target;
        if (!t) return;
        if (t.classList.contains('nav-close') || t.tagName === 'A') closeMenu();
      });
    }

    var dr = document.querySelector('.dr-grid');
    if (dr) {
      var more = [
        {tag:'Special', name:'Honey Rose Latte', q:'“Soft, floral, comforting.”', img:'/media/drink2.jpg'},
        {tag:'New', name:'Vanilla Cloud Brew', q:'“A sweet, silky finish.”', img:'/media/drink3.jpg'},
        {tag:'Seasonal', name:'Golden Spice Mocha', q:'“Warm notes, gentle cocoa.”', img:'/media/drink1.jpg'},
        {tag:'Iced', name:'Caramel Oat Cold Brew', q:'“Smooth + refreshing.”', img:'/media/drink3.jpg'},
        {tag:'Chef', name:'Cinnamon Honey Cappuccino', q:'“Classic with a twist.”', img:'/media/drink2.jpg'}
      ];
      more.forEach(function(x){
        var a = document.createElement('a');
        a.className = 'dcard rv';
        a.href = '#drinks';
        a.innerHTML =
          '<img src="'+x.img+'" alt="'+x.name+'">'+
          '<div class="dcard-ov">'+
            '<div class="dc-tag">'+x.tag+'</div>'+
            '<div class="dc-name">'+x.name+'</div>'+
            '<div class="dc-quote">'+x.q+'</div>'+
          '</div>';
        dr.appendChild(a);
      });
    }

    // Improve dish section ordering by adding more image cards (same format)
    var dishGrid = document.querySelector('.dish-grid');
    if (dishGrid) {
      var addDish = function(img, label){
        var d = document.createElement('div');
        d.className = 'dish-sm rv';
        d.innerHTML =
          '<img src="'+img+'" alt="'+label+'">'+
          '<div class="dish-lbl"><span>'+label+'</span></div>';
        dishGrid.appendChild(d);
      };
      addDish('/media/dish2.jpg','Masala Ramen Bowl');
      addDish('/media/unique4.jpg','Tomato Basil Bruschetta');
      addDish('/media/unique5.jpg','Tex Mex Salad');
    }

    var track = document.querySelector('.utrack');
    if (track) {
      var u = [
        {tag:'House', name:'Berry Tart', q:'Buttery + bright', img:'/media/unique4.jpg'},
        {tag:'Fresh', name:'Garden Salad', q:'Crisp + vibrant', img:'/media/unique5.jpg'},
        {tag:'Chef', name:'Creamy Pasta', q:'Silky comfort', img:'/media/dish1.jpg'},
        {tag:'Baked', name:'Choco Croissant', q:'Flaky + warm', img:'/media/dish2.jpg'},
        {tag:'Sweet', name:'Rose Panna Cotta', q:'Delicate finish', img:'/media/unique3.jpg'}
      ];
      u.forEach(function(x){
        var wrap = document.createElement('div');
        wrap.className = 'ucard rv';
        wrap.innerHTML =
          '<img src="'+x.img+'" alt="'+x.name+'">'+
          '<div class="uov">'+
            '<div class="u-tag">'+x.tag+'</div>'+
            '<div class="u-name">'+x.name+'</div>'+
            '<div class="u-q">'+x.q+'</div>'+
          '</div>';
        track.appendChild(wrap);
      });
    }

    // Ensure reveal animations also apply to injected elements
    try {
      var toObs = document.querySelectorAll('.rv:not(.on),.rl:not(.on),.rr:not(.on)');
      if ('IntersectionObserver' in window) {
        var obs2 = new IntersectionObserver(function(entries){
          entries.forEach(function(e){
            if (e.isIntersecting) { e.target.classList.add('on'); obs2.unobserve(e.target); }
          });
        },{threshold:0.1});
        toObs.forEach(function(el){ obs2.observe(el); });
      } else {
        toObs.forEach(function(el){ el.classList.add('on'); });
      }
    } catch(e) {}

    // AI Support UI (UI-only)
    if (!document.querySelector('.ai-fab')) {
      var fab = document.createElement('button');
      fab.className = 'ai-fab';
      fab.setAttribute('aria-label','AI Support');
      fab.textContent = 'AI';

      var panel = document.createElement('div');
      panel.className = 'ai-panel';
      panel.innerHTML =
        '<div class="ai-hd"><b>Aroha Support</b><button aria-label="Close">×</button></div>'+
        '<div class="ai-body"></div>'+
        '<div class="ai-quick">'+
          '<button data-q="menu">Menu</button>'+
          '<button data-q="hours">Hours</button>'+
          '<button data-q="location">Location</button>'+
          '<button data-q="order">How to order</button>'+
        '</div>';

      document.body.appendChild(panel);
      document.body.appendChild(fab);

      var body = panel.querySelector('.ai-body');
      var addMsg = function(txt, who){
        var d = document.createElement('div');
        d.className = 'ai-msg ' + who;
        d.textContent = txt;
        body.appendChild(d);
        body.scrollTop = body.scrollHeight;
      };
      addMsg('Hi! I can help with the menu, hours, location, and ordering.', 'bot');

      var answer = function(key){
        if (key === 'menu') return 'Scroll to Drinks and Dishes — everything is listed there.';
        if (key === 'hours') return 'We’re open daily. (You can replace this text with your exact hours.)';
        if (key === 'location') return 'Ujjain, Madhya Pradesh. (Add your full address here.)';
        if (key === 'order') return 'Pick your favorites and message on Instagram — we’ll confirm quickly.';
        return 'Tell me what you need help with.';
      };

      fab.addEventListener('click', function(){ panel.classList.toggle('on'); });
      panel.querySelector('.ai-hd button').addEventListener('click', function(){ panel.classList.remove('on'); });
      panel.querySelector('.ai-quick').addEventListener('click', function(e){
        var t = e.target;
        if (!t || !t.getAttribute) return;
        var key = t.getAttribute('data-q');
        if (!key) return;
        addMsg(t.textContent, 'me');
        addMsg(answer(key), 'bot');
      });
    }
  } catch(e) {}
})();
</script>
`;

  html = html.replace("</head>", `${injectedCss}</head>`);
  html = html.replace("</body>", `${extraScript}</body>`);

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Cache in browsers/CDN; change this if you edit index.html frequently
      "cache-control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800"
    }
  });
}

