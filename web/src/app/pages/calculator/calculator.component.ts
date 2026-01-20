import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarbonApiService, CalcInputs, CalcResults } from '../../shared/carbon-api.service';
import { ToastService } from '../../shared/toast.service';

type Row = { key: keyof CalcInputs; label: string; hint: string; }; 

@Component({
  standalone: true,
  // CommonModule provides built-in directives/pipes (e.g., @if blocks/number pipe)
  imports: [CommonModule, FormsModule],
  selector: 'app-calculator',
  template: `
    <div class="container">
      <div class="head">
        <h2>Calculadora</h2>
        <div class="small">Llena tu uso aproximado. Guarda el resultado para tu historial.</div>
      </div>

      <section class="grid cols-2" style="margin-top:14px">
        <div class="glass card">
          <h3>Uso digital (horas/día)</h3>
          <div class="small">Valores estimados. Puedes ajustar a tu realidad.</div>

          <div class="form" style="margin-top:12px">
            <div class="field" *ngFor="let r of rows">
              <div>
                <div class="label">{{r.label}}</div>
                <div class="small">{{r.hint}}</div>
              </div>
              <input
                class="input"
                type="number"
                min="0"
                step="0.1"
                [(ngModel)]="inputs[r.key]"
                (focus)="selectAll($event)"
                (click)="selectAll($event)"
              />
            </div>
          </div>

          <hr class="hr" />

          <div class="grid cols-2">
            <div>
              <div class="label">Días por mes</div>
              <input
                class="input"
                type="number"
                min="1"
                max="31"
                [(ngModel)]="inputs.daysPerMonth"
                (focus)="selectAll($event)"
                (click)="selectAll($event)"
              />
            </div>
            <div>
              <div class="label">Factor CO₂ (kg/kWh)</div>
              <input
                class="input"
                type="number"
                min="0"
                step="0.01"
                [(ngModel)]="inputs.kgCo2PerKwh"
                (focus)="selectAll($event)"
                (click)="selectAll($event)"
              />
              <div class="small">Tip: 0.45 es una aproximación útil si no tienes el dato exacto.</div>
            </div>
          </div>

          <div class="actions">
            <button class="btn primary" (click)="calculate()">Calcular</button>
            <button class="btn" [disabled]="!results" (click)="save()">Guardar en historial</button>
            <button class="btn ghost" (click)="reset()">Limpiar</button>
          </div>
        </div>

        <div class="glass card">
          <h3>Resultado mensual</h3>
          <div class="small">kWh/mes y kg CO₂/mes con desglose por categoría.</div>

          <ng-container *ngIf="results; else empty">
            <div class="kpis">
              <div class="kpi">
                <div class="k">Energía</div>
                <div class="v">{{results!.kwhPerMonth | number:'1.0-2'}} kWh</div>
              </div>
              <div class="kpi">
                <div class="k">Emisiones</div>
                <div class="v">{{results!.kgCo2PerMonth | number:'1.0-2'}} kg CO₂</div>
              </div>
            </div>

            <div class="tip">
              <div class="tag">Mayor impacto</div>
              <div class="big">{{results!.topCategory}}</div>
              <div class="small">En recomendaciones, reduce primero esta actividad.</div>
            </div>

            <hr class="hr" />

            <div class="small" style="margin-bottom:10px">Desglose</div>
            <div class="break">
              <div class="b" *ngFor="let k of breakdownKeys">
                <div class="left">
                  <div class="name">{{k}}</div>
                  <div class="small">{{results!.breakdown[k].kwh | number:'1.0-2'}} kWh</div>
                </div>
                <div class="right">
                  <div class="co2">{{results!.breakdown[k].kgCo2 | number:'1.0-2'}} kg CO₂</div>
                </div>
              </div>
            </div>

            <hr class="hr" />

            <div class="rec">
              <div class="tag">Recomendación rápida</div>
              <div class="small">{{recommendation}}</div>
            </div>
          </ng-container>

          <ng-template #empty>
            <div class="empty">
              <div class="small">Aún no hay cálculo. Completa el formulario y presiona <b>Calcular</b>.</div>
            </div>
          </ng-template>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .head h2{margin:0}
    .card{padding:18px}

    .form{display:grid; gap:12px}
    .field{display:grid; grid-template-columns: 1fr 140px; gap:12px; align-items:center;
      padding: 12px; border-radius: 18px; border:1px solid rgba(255,255,255,.10); background: rgba(0,0,0,.16)}
    @media (max-width: 720px){ .field{grid-template-columns: 1fr} }

    .actions{display:flex; gap:10px; flex-wrap:wrap; margin-top: 16px}

    .kpis{display:grid; gap:12px; margin-top: 14px}
    @media (min-width: 900px){ .kpis{grid-template-columns: 1fr 1fr} }

    .kpi{padding: 12px 14px; border-radius: 18px; border:1px solid rgba(53,255,154,.18); background: rgba(53,255,154,.06)}
    .k{font-size: 12px; color: var(--muted2); letter-spacing:.05em; text-transform: uppercase}
    .v{font-size: 22px; font-weight: 900; margin-top:6px}

    .tip{margin-top: 12px; padding: 12px 14px; border-radius: 18px; border:1px solid rgba(255,255,255,.10); background: rgba(0,0,0,.14)}
    .big{font-size: 18px; font-weight: 900; margin-top: 6px}

    .break{display:grid; gap:10px}
    .b{display:flex; justify-content:space-between; gap:10px; align-items:center;
      padding: 12px 14px; border-radius: 18px; border:1px solid rgba(255,255,255,.08); background: rgba(0,0,0,.12)}
    .name{font-weight: 800}
    .co2{font-weight: 900}

    .empty{padding: 16px; border-radius: 18px; border:1px dashed rgba(255,255,255,.18); background: rgba(0,0,0,.10); margin-top: 14px}

    .rec{padding: 12px 14px; border-radius: 18px; border:1px solid rgba(53,255,154,.18); background: rgba(53,255,154,.05)}
  `]
})
export class CalculatorComponent {
  inputs: CalcInputs = {
    streamingHrsPerDay: 1.5,
    socialHrsPerDay: 1.0,
    videoCallsHrsPerDay: 0.5,
    gamingHrsPerDay: 0.7,
    cloudHrsPerDay: 0.3,
    daysPerMonth: 30,
    kgCo2PerKwh: 0.45
  };

  // kWh por hora (estimaciones simples para educación)
  private factors = {
    Streaming: 0.09,
    'Redes sociales': 0.03,
    Videollamadas: 0.07,
    Gaming: 0.12,
    'Nube/descargas': 0.05
  };

  rows: Row[] = [
    { key: 'streamingHrsPerDay', label: 'Streaming', hint: 'Series, videos, música.' },
    { key: 'socialHrsPerDay', label: 'Redes sociales', hint: 'TikTok, IG, FB, X, etc.' },
    { key: 'videoCallsHrsPerDay', label: 'Videollamadas', hint: 'Zoom, Meet, Teams.' },
    { key: 'gamingHrsPerDay', label: 'Gaming', hint: 'Consola o PC.' },
    { key: 'cloudHrsPerDay', label: 'Nube/descargas', hint: 'Subidas, backups, descargas.' }
  ];

  results: CalcResults | null = null;

  constructor(private api: CarbonApiService, private toast: ToastService) {}

  // UX: al enfocar un input, selecciona el valor completo para que al teclear
  // se reemplace (en lugar de ir agregando dígitos al final).
  selectAll(ev: Event) {
    const el = ev.target as HTMLInputElement | null;
    if (!el) return;

    // Espera un tick para no pelearse con el evento de focus/click.
    setTimeout(() => {
      try {
        el.select();
      } catch {
        // noop
      }
    }, 0);
  }

  get breakdownKeys() {
    return this.results ? Object.keys(this.results.breakdown) : [];
  }

  calculate() {
    const d = Math.max(1, Number(this.inputs.daysPerMonth) || 30);
    const kgPerKwh = Math.max(0, Number(this.inputs.kgCo2PerKwh) || 0.45);

    const usage = {
      Streaming: Math.max(0, Number(this.inputs.streamingHrsPerDay) || 0) * d,
      'Redes sociales': Math.max(0, Number(this.inputs.socialHrsPerDay) || 0) * d,
      Videollamadas: Math.max(0, Number(this.inputs.videoCallsHrsPerDay) || 0) * d,
      Gaming: Math.max(0, Number(this.inputs.gamingHrsPerDay) || 0) * d,
      'Nube/descargas': Math.max(0, Number(this.inputs.cloudHrsPerDay) || 0) * d
    } as Record<string, number>;

    const breakdown: CalcResults['breakdown'] = {};
    let totalKwh = 0;

    for (const [k, hours] of Object.entries(usage)) {
      const kwh = hours * (this.factors as any)[k];
      const kg = kwh * kgPerKwh;
      breakdown[k] = { kwh, kgCo2: kg };
      totalKwh += kwh;
    }

    const totalKg = totalKwh * kgPerKwh;

    let top = '—';
    let max = -1;
    for (const [k, v] of Object.entries(breakdown)) {
      if (v.kwh > max) { max = v.kwh; top = k; }
    }

    this.results = {
      kwhPerMonth: totalKwh,
      kgCo2PerMonth: totalKg,
      topCategory: top,
      breakdown
    };

    this.toast.show('ok', 'Cálculo listo', 'Puedes guardarlo en tu historial.');
  }

  get recommendation() {
    if (!this.results) return '';
    const top = this.results.topCategory;
    const map: Record<string, string> = {
      Streaming: 'Baja a 720p cuando sea posible y evita autoplay.',
      'Redes sociales': 'Reduce scroll infinito: 2 bloques al día y listo.',
      Videollamadas: 'Apaga cámara si no es necesaria, o reduce resolución.',
      Gaming: 'Limita FPS (60) y apaga HDR cuando no aporta mucho.',
      'Nube/descargas': 'Elimina duplicados y evita subir videos pesados sin comprimir.'
    };
    return map[top] || 'Haz pequeños cambios y verás mejora real mes con mes.';
  }

  async save() {
    if (!this.results) return;
    try {
      const res = await this.api.save(this.inputs, this.results);
      this.toast.show('ok', 'Guardado en Postgres ✅', `ID: ${res.id.slice(0, 8)}…`);
    } catch {
      this.toast.show('err', 'No se pudo guardar', 'Revisa que la DB esté conectada en Railway.');
    }
  }

  reset() {
    this.results = null;
    this.toast.show('ok', 'Listo', 'Formulario limpio.');
  }
}
