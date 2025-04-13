import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'forms/build', pathMatch: 'full' },
  {
    path: 'forms',
    loadChildren: () =>
      import('./modules/forms/forms.module').then((m) => m.FormsModule),
  },
];
