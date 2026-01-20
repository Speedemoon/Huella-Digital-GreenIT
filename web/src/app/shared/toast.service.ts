import { Injectable } from '@angular/core';

export type ToastKind = 'ok' | 'err';
export type ToastItem = { id: string; title: string; message?: string; kind: ToastKind };

@Injectable({ providedIn: 'root' })
export class ToastService {
  items: ToastItem[] = [];

  show(kind: ToastKind, title: string, message?: string) {
    const id = crypto.randomUUID();
    const item: ToastItem = { id, kind, title, message };
    this.items = [item, ...this.items].slice(0, 3);
    setTimeout(() => this.dismiss(id), 3500);
  }

  dismiss(id: string) {
    this.items = this.items.filter(x => x.id !== id);
  }
}
