import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormBuilderComponent } from './form-builder/form-builder.component';
import { FormsRoutingModule } from './forms-routing.module';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  declarations: [FormBuilderComponent],
  imports: [
    CommonModule,
    FormsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class FormsModule {}
