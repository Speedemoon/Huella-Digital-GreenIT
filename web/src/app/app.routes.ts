import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CalculatorComponent } from './pages/calculator/calculator.component';
import { HistoryComponent } from './pages/history/history.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'calculadora', component: CalculatorComponent },
  { path: 'historial', component: HistoryComponent },
  { path: '**', redirectTo: '' }
];
