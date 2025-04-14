import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { FormViewerComponent } from './form-viewer/form-viewer.component';

const routes: Routes = [
  { path: 'build', component: FormBuilderComponent },
  { path: 'view/:id', component: FormViewerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsRoutingModule {}
