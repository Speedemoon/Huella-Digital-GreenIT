import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type CalcInputs = {
  streamingHrsPerDay: number;
  socialHrsPerDay: number;
  videoCallsHrsPerDay: number;
  gamingHrsPerDay: number;
  cloudHrsPerDay: number;
  daysPerMonth: number;
  kgCo2PerKwh: number;
};

export type CalcResults = {
  kwhPerMonth: number;
  kgCo2PerMonth: number;
  topCategory: string;
  breakdown: Record<string, { kwh: number; kgCo2: number }>;
};

export type CalcRecord = {
  id: string;
  created_at: string;
  inputs: CalcInputs;
  results: CalcResults;
};

@Injectable({ providedIn: 'root' })
export class CarbonApiService {
  constructor(private http: HttpClient) {}

  async health(): Promise<{ ok: boolean; db: string }> {
    return await firstValueFrom(this.http.get<{ ok: boolean; db: string }>('/api/health'));
  }

  async list(): Promise<CalcRecord[]> {
    const res = await firstValueFrom(this.http.get<{ items: CalcRecord[] }>('/api/calculations'));
    return res.items;
  }

  async save(inputs: CalcInputs, results: CalcResults): Promise<{ ok: boolean; id: string }> {
    return await firstValueFrom(this.http.post<{ ok: boolean; id: string }>('/api/calculations', { inputs, results }));
  }

  async remove(id: string): Promise<{ ok: boolean }> {
    return await firstValueFrom(this.http.delete<{ ok: boolean }>(`/api/calculations/${id}`));
  }
}
