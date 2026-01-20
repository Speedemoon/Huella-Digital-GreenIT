import { Component, signal, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgIf],
  template: `
    <div class="container">

      <section class="hero glass">
        <div class="badge">🌱 Green Computing • Huella digital mensual</div>

        <div class="hero-grid">
          <div>
            <h1>
              Calcula tu <span class="accent">Huella de Carbono</span><br />
              Digital sin perder el enfoque de app.
            </h1>
            <p class="lead">
              Estima consumo energético por streaming, redes, videollamadas, gaming y nube.
              Guarda historial (cuando conectemos Postgres en Railway) y compara tu progreso.
            </p>

            <div class="actions">
              <a class="btn primary" routerLink="/calculadora">Empezar cálculo</a>
              <a class="btn" routerLink="/historial">Ver historial</a>
              <button class="btn ghost" type="button" (click)="scrollToVideo()">Ver video</button>
            </div>

            <div class="status" [class.warn]="dbWarn()">
              <div class="dot" aria-hidden="true"></div>
              <div>
                <div class="title">Estado de la base de datos</div>
                <div class="desc">{{ dbText() }}</div>
              </div>
            </div>
          </div>

          <div class="tips">
            <div class="tip-card">
              <div class="kpi">MENOS KWH</div>
              <div class="big">= menos CO₂</div>
              <div class="small">Prioriza hábitos y eficiencia.</div>
            </div>

            <div class="tip-grid">
              <div class="mini">
                <div class="mini-title">Streaming</div>
                <div class="mini-desc">Baja resolución cuando puedas.</div>
              </div>
              <div class="mini">
                <div class="mini-title">Videollamadas</div>
                <div class="mini-desc">Apaga cámara si no es necesaria.</div>
              </div>
              <div class="mini">
                <div class="mini-title">Gaming</div>
                <div class="mini-desc">Limita FPS / apaga HDR.</div>
              </div>
              <div class="mini">
                <div class="mini-title">Nube</div>
                <div class="mini-desc">Limpia backups duplicados.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="video" class="glass video">
        <div class="video-head">
          <div>
            <h2>Video de presentación</h2>
          </div>
          <a class="btn" routerLink="/calculadora">Probar calculadora</a>
        </div>

        <div class="player">
          <video
            class="video-el"
            controls
            playsinline
            preload="metadata"
            [attr.src]="videoSrc"
            (error)="videoError.set(true)"
          ></video>
          <div class="video-fallback" *ngIf="videoError()">
            <strong>No se encontró el video todavía.</strong>
            <div class="tiny">Cuando lo tengas, reemplaza/pega el mp4 en la ruta indicada.</div>
          </div>
        </div>
      </section>

      <section class="grid">
        <div class="card glass">
          <h3>Objetivo</h3>
          <p>Promover hábitos digitales más eficientes y conscientes, alineados con Green IT.</p>
        </div>
        <div class="card glass">
          <h3>Qué calcula</h3>
          <p>kWh/mes y kg CO₂/mes con un desglose por categoría y factor configurable.</p>
        </div>
        <div class="card glass">
          <h3>Recomendaciones</h3>
          <p>Te dice qué actividad te pesa más y cómo reducirla sin “matar” tu experiencia.</p>
        </div>
      </section>

      <section class="how glass">
        <h2>Cómo funciona</h2>
        <div class="steps">
          <div class="step">
            <div class="num">1</div>
            <div>
              <div class="step-title">Capturas tu uso</div>
              <div class="step-desc">Horas por día y días del mes.</div>
            </div>
          </div>
          <div class="step">
            <div class="num">2</div>
            <div>
              <div class="step-title">Calcula y compara</div>
              <div class="step-desc">kWh y CO₂, con desglose.</div>
            </div>
          </div>
          <div class="step">
            <div class="num">3</div>
            <div>
              <div class="step-title">Guardas historial</div>
              <div class="step-desc">Listo para Postgres en Railway.</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [
    `
    .hero{padding:26px}
    .badge{display:inline-flex;gap:8px;align-items:center;color:rgba(231,250,242,.75);background:rgba(20,245,160,.06);border:1px solid rgba(20,245,160,.14);padding:8px 12px;border-radius:999px;font-weight:800;font-size:12px}
    h1{margin:14px 0 10px;font-size:48px;line-height:1.05}
    .accent{color:var(--accent)}
    .lead{color:rgba(231,250,242,.76);max-width:60ch}

    .hero-grid{display:grid;grid-template-columns:1.25fr .85fr;gap:18px;align-items:start}

    .actions{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0 14px}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 14px;border-radius:14px;border:1px solid rgba(20,245,160,.16);background:rgba(255,255,255,.03);color:var(--text);text-decoration:none;font-weight:900;cursor:pointer}
    .btn:hover{background:rgba(20,245,160,.08);border-color:rgba(20,245,160,.24)}
    .btn.primary{background:linear-gradient(180deg, rgba(20,245,160,.34), rgba(20,245,160,.16));border-color:rgba(20,245,160,.34)}
    .btn.ghost{background:transparent}

    .status{display:flex;align-items:center;gap:10px;margin-top:8px;padding:12px 14px;border-radius:16px;border:1px solid rgba(20,245,160,.14);background:rgba(0,0,0,.18)}
    .status.warn{border-color:rgba(255,120,120,.28)}
    .status .dot{width:10px;height:10px;border-radius:999px;background:var(--accent);box-shadow:0 0 0 6px rgba(20,245,160,.08)}
    .status.warn .dot{background:rgba(255,120,120,.9);box-shadow:0 0 0 6px rgba(255,120,120,.10)}
    .title{font-weight:900}
    .desc{color:rgba(231,250,242,.72);font-size:12px}

    .tips{padding:18px;border-radius:18px;border:1px solid rgba(20,245,160,.14);background:rgba(0,0,0,.18)}
    .tip-card{padding:14px;border-radius:16px;border:1px solid rgba(20,245,160,.14);background:rgba(255,255,255,.03)}
    .kpi{letter-spacing:.12em;color:rgba(231,250,242,.60);font-size:11px;font-weight:900}
    .big{font-size:22px;font-weight:1000;margin-top:6px}
    .small{color:rgba(231,250,242,.70);font-size:12px;margin-top:6px}

    .tip-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
    .mini{padding:12px;border-radius:14px;border:1px solid rgba(20,245,160,.12);background:rgba(255,255,255,.03)}
    .mini-title{font-weight:900}
    .mini-desc{color:rgba(231,250,242,.72);font-size:12px;margin-top:4px}

    .grid{display:grid;grid-template-columns:repeat(3, 1fr);gap:14px;margin-top:16px}
    .card{padding:16px}
    .card h3{margin:0 0 8px}
    .card p{margin:0;color:rgba(231,250,242,.72)}

    .how{margin-top:16px;padding:18px}
    .how h2{margin:0 0 10px}
    .steps{display:grid;grid-template-columns:repeat(3, 1fr);gap:12px}
    .step{display:flex;gap:12px;align-items:flex-start;padding:12px;border-radius:16px;border:1px solid rgba(20,245,160,.12);background:rgba(255,255,255,.03)}
    .num{width:34px;height:34px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:rgba(20,245,160,.16);border:1px solid rgba(20,245,160,.24);font-weight:1000}
    .step-title{font-weight:900}
    .step-desc{color:rgba(231,250,242,.70);font-size:12px;margin-top:2px}

    /* Video */
    .video{margin-top:16px;padding:18px}
    .video-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:12px}
    .muted{color:rgba(231,250,242,.72);margin:6px 0 0;max-width:78ch}
    code{background:rgba(0,0,0,.25);border:1px solid rgba(20,245,160,.14);padding:2px 6px;border-radius:8px}
    .player{position:relative;border-radius:18px;overflow:hidden;border:1px solid rgba(20,245,160,.14);background:rgba(0,0,0,.22)}
    .video-el{width:100%;display:block;aspect-ratio:16/9;background:#000}
    .video-fallback{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center;padding:18px;color:rgba(231,250,242,.88)}
    .tiny{font-size:12px;color:rgba(231,250,242,.70)}

    @media (max-width: 980px){
      h1{font-size:40px}
      .hero-grid{grid-template-columns:1fr}
      .grid{grid-template-columns:1fr}
      .steps{grid-template-columns:1fr}
      .video-head{flex-direction:column;align-items:flex-start}
    }
    `
  ]
})
export class HomeComponent implements OnInit {
  // Video placeholder (you'll drop the mp4 here later)
  videoSrc = 'assets/video/huella-sora.mp4';
  videoError = signal(false);

  // DB banner: we keep it "pending" until Railway is connected
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkDb();
  }

  private checkDb() {
    this.http.get<any>('/api/health').subscribe({
      next: (res) => {
        const ok = !!res?.ok && res?.db === 'up';
        this.dbWarn.set(!ok);
        this.dbText.set(ok ? 'Conectado ✅ (Postgres en Railway)' : 'Fallo conexión (revisa DATABASE_URL)');
      },
      error: () => {
        this.dbWarn.set(true);
        this.dbText.set('Pendiente (se conectará en Railway)');
      }
    });
  }

  dbWarn = signal(true);
  dbText = signal('Pendiente (se conectará en Railway)');

  scrollToVideo() {
    const el = document.getElementById('video');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
