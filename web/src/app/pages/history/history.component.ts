import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarbonApiService, CalcRecord } from '../../shared/carbon-api.service';
import { ToastService } from '../../shared/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-history',
  template: `
    <div class="container">
      <div class="head">
        <div>
          <h2>Historial</h2>
          <div class="small">Tus últimos cálculos guardados en Postgres.</div>
        </div>
        <button class="btn" (click)="load()">Actualizar</button>
      </div>

      <section class="glass card" style="margin-top:14px">
        <div class="row">
          <div class="tag">🗂️ Hasta 200 registros</div>
          <div class="small">Click en un registro para ver detalle.</div>
        </div>

        <div class="empty" *ngIf="!loading && items.length===0">
          <div class="small">Aún no hay cálculos guardados. Ve a <b>Calculadora</b> y guarda el primero.</div>
        </div>

        <div class="loading" *ngIf="loading">Cargando...</div>

        <div class="list" *ngIf="items.length>0">
          <div class="item" *ngFor="let it of items" (click)="toggle(it.id)">
            <div class="left">
              <div class="ttl">{{ it.results.kgCo2PerMonth | number:'1.0-2' }} kg CO₂</div>
              <div class="small">{{ it.results.kwhPerMonth | number:'1.0-2' }} kWh • {{ it.results.topCategory }}</div>
              <div class="small">{{ it.created_at | date:'medium' }}</div>
            </div>

            <div class="right">
              <button class="btn danger" (click)="$event.stopPropagation(); remove(it.id)">Eliminar</button>
            </div>

            <div class="detail" *ngIf="openId===it.id">
              <hr class="hr" />
              <div class="grid cols-2">
                <div class="glass sub">
                  <div class="label">Inputs</div>
                  <pre>{{ it.inputs | json }}</pre>
                </div>
                <div class="glass sub">
                  <div class="label">Resultados</div>
                  <pre>{{ it.results | json }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .head{display:flex; justify-content:space-between; gap:12px; align-items:center}
    .head h2{margin:0}
    .card{padding:18px}

    .row{display:flex; justify-content:space-between; gap:12px; align-items:center}

    .list{display:grid; gap:12px; margin-top: 12px}
    .item{padding: 14px; border-radius: 18px; border:1px solid rgba(255,255,255,.10); background: rgba(0,0,0,.14);
      cursor:pointer; transition: transform .12s ease, border-color .12s ease;}
    .item:hover{transform: translateY(-1px); border-color: rgba(53,255,154,.22)}

    .ttl{font-weight: 950; font-size: 18px}

    .left{display:grid; gap:2px}
    .right{margin-top: 10px}

    .detail{margin-top: 12px}
    .sub{padding: 12px 12px; border-radius: 18px}
    pre{margin: 8px 0 0; white-space: pre-wrap; word-break: break-word; font-size: 12px; color: var(--muted)}

    .empty{padding: 16px; border-radius: 18px; border:1px dashed rgba(255,255,255,.18); background: rgba(0,0,0,.10); margin-top: 14px}
    .loading{margin-top: 12px; color: var(--muted)}
  `]
})
export class HistoryComponent {
  items: CalcRecord[] = [];
  loading = false;
  openId: string | null = null;

  constructor(private api: CarbonApiService, private toast: ToastService) {
    this.load();
  }

  toggle(id: string){ this.openId = (this.openId === id) ? null : id; }

  async load(){
    this.loading = true;
    try{
      this.items = await this.api.list();
    }catch{
      this.toast.show('err', 'No se pudo cargar', 'Revisa que la DB esté conectada.');
    }finally{
      this.loading = false;
    }
  }

  async remove(id: string){
    if (!confirm('¿Eliminar este cálculo del historial?')) return;
    try{
      await this.api.remove(id);
      this.items = this.items.filter(x => x.id !== id);
      this.toast.show('ok', 'Eliminado', 'Registro removido de Postgres.');
    }catch{
      this.toast.show('err', 'No se pudo eliminar', 'Intenta de nuevo.');
    }
  }
}
