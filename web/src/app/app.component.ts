import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  template: `
    <div class="app-shell" id="top">
      <header class="topbar">
        <div class="container topbar-inner">
          <a class="brand" routerLink="/" (click)="closeMenu()">
            <span class="dot"></span>
            <span class="brand-text">Huella Digital GreenIT</span>
          </a>

          <nav class="nav desktop">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Inicio</a>
            <a routerLink="/calculadora" routerLinkActive="active">Calculadora</a>
            <a routerLink="/historial" routerLinkActive="active">Historial</a>
          </nav>

          <button
            class="burger"
            type="button"
            (click)="toggleMenu()"
            [attr.aria-expanded]="menuOpen()"
            aria-label="Abrir menú"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div class="mobile-overlay" *ngIf="menuOpen()" (click)="closeMenu()">
        <div class="drawer" (click)="$event.stopPropagation()">
          <div class="drawer-head">
            <div class="drawer-brand">
              <span class="dot"></span>
              <span>Huella Digital GreenIT</span>
            </div>
            <button class="drawer-close" type="button" (click)="closeMenu()" aria-label="Cerrar menú">✕</button>
          </div>

          <div class="drawer-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMenu()">Inicio</a>
            <a routerLink="/calculadora" routerLinkActive="active" (click)="closeMenu()">Calculadora</a>
            <a routerLink="/historial" routerLinkActive="active" (click)="closeMenu()">Historial</a>
          </div>

          <div class="drawer-foot">
            <div class="tiny">Green Computing • Huella digital mensual</div>
          </div>
        </div>
      </div>

      <main class="main">
        <router-outlet></router-outlet>
      </main>

      <button class="fab" *ngIf="showFab()" (click)="scrollTop()" aria-label="Volver arriba">
        <svg class="fab-ic" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5l-7 7m7-7l7 7M12 5v14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <footer class="footer">
        <div class="container footer-inner">
          <div class="left">
            <div class="muted">© 2026 Gabriel Israel Mejía Ortiz</div>
            <div class="tiny">Tip: reduce streaming en HD y videollamadas largas cuando no sean necesarias.</div>
          </div>
          <a class="backtop" href="#top" (click)="$event.preventDefault(); scrollTop()">
            Volver arriba
            <svg class="backtop-ic" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5l-7 7m7-7l7 7M12 5v14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
    :host{display:block}
    .app-shell{min-height:100vh;display:flex;flex-direction:column}

    .topbar{
      position:sticky; top:0; z-index:50;
      background: rgba(6, 10, 8, 0.72);
      border-bottom: 1px solid rgba(20, 245, 160, 0.14);
      backdrop-filter: blur(14px);
    }
    .topbar-inner{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 0}

    .brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text)}
    .brand-text{font-weight:800;letter-spacing:.2px}
    .dot{width:10px;height:10px;border-radius:999px;background:var(--accent);box-shadow:0 0 0 6px rgba(20,245,160,.08)}

    .nav{display:flex;align-items:center;gap:10px}
    .nav a{
      text-decoration:none;color:var(--muted);
      padding:10px 14px;border-radius:12px;
      border:1px solid transparent;
      transition:background .15s ease, border-color .15s ease, color .15s ease;
      font-weight:700;
    }
    .nav a:hover{color:var(--text);background:rgba(20,245,160,.06);border-color:rgba(20,245,160,.18)}
    .nav a.active{color:var(--text);background:rgba(20,245,160,.12);border-color:rgba(20,245,160,.24)}

    .burger{
      display:none;align-items:center;justify-content:center;
      width:44px;height:44px;
      border-radius:14px;
      background:rgba(255,255,255,.04);
      border:1px solid rgba(20,245,160,.18);
      color:var(--text);
      cursor:pointer;
    }
    .burger span{display:block;width:18px;height:2px;background:rgba(231,250,242,.9);margin:3px 0;border-radius:2px}

    .main{flex:1}

    .footer{border-top:1px solid rgba(20,245,160,.14);background:rgba(6, 10, 8, 0.55)}
    .footer-inner{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 0}
    .muted{color:var(--muted)}
    .tiny{font-size:12px;color:rgba(231,250,242,.72)}
    .backtop{color:rgba(231,250,242,.85);text-decoration:none;font-weight:700}
    .backtop:hover{color:var(--text)}

    /* Mobile drawer */
    .mobile-overlay{
      position:fixed; inset:0; z-index:60;
      background:rgba(0,0,0,.55);
      backdrop-filter: blur(6px);
      display:flex; justify-content:flex-end;
    }
    .drawer{
      width:min(360px, 92vw);
      height:100%;
      background: rgba(6, 10, 8, 0.92);
      border-left: 1px solid rgba(20,245,160,.18);
      padding:16px;
      display:flex; flex-direction:column;
      box-shadow: -20px 0 60px rgba(0,0,0,.55);
    }
    .drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-bottom:12px;border-bottom:1px solid rgba(20,245,160,.14)}
    .drawer-brand{display:flex;align-items:center;gap:10px;font-weight:900}
    .drawer-close{
      width:40px;height:40px;border-radius:12px;
      background:rgba(255,255,255,.04);
      border:1px solid rgba(20,245,160,.18);
      color:var(--text);cursor:pointer;
    }
    .drawer-links{display:flex;flex-direction:column;gap:10px;padding:14px 0}
    .drawer-links a{
      text-decoration:none;color:var(--muted);
      padding:12px 14px;border-radius:14px;
      border:1px solid rgba(20,245,160,.14);
      background:rgba(255,255,255,.03);
      font-weight:800;
    }
    .drawer-links a.active{color:var(--text);background:rgba(20,245,160,.12);border-color:rgba(20,245,160,.24)}
    .drawer-links a:hover{color:var(--text);border-color:rgba(20,245,160,.22)}
    .drawer-foot{margin-top:auto;padding-top:12px;border-top:1px solid rgba(20,245,160,.14)}

    /* Floating back-to-top button (like Auto-Tyre) */
    .fab{
      position: fixed;
      right: 22px;
      bottom: 22px;
      width: 52px;
      height: 52px;
      border-radius: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(20,245,160,.18);
      border: 1px solid rgba(20,245,160,.26);
      box-shadow: 0 16px 50px rgba(0,0,0,.55);
      color: var(--text);
      cursor: pointer;
      z-index: 70;
      backdrop-filter: blur(14px);
    }
    .fab:hover{background: rgba(20,245,160,.24);border-color: rgba(20,245,160,.34)}
    .fab-ic{width:22px;height:22px}


    @media (max-width: 820px){
      /* Show real navbar links on mobile (no hamburger only) */
      .topbar-inner{padding:12px 0;flex-wrap:wrap;gap:10px}
      .brand{flex:1 1 100%;justify-content:flex-start}
      .nav.desktop{
        display:flex;
        flex:1 1 100%;
        justify-content:flex-start;
        flex-wrap:wrap;
        gap:10px;
      }
      .burger{display:none}
      .footer-inner{flex-direction:column;align-items:flex-start}
    }
    `
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  menuOpen = signal(false);
  showFab = signal(false);

  private readonly onScroll = () => {
    this.showFab.set(window.scrollY > 320);
  };

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
