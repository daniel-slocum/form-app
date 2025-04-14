import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ISelectOption } from '../../../shared/models/select-option.model';
import { ApiService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.scss',
})
export class FormBuilderComponent {
  fieldTypes: ISelectOption[] = [
    { label: 'Checkbox', value: 'boolean' },
    { label: 'Date Picker', value: 'datetime' },
    { label: 'Number', value: 'number' },
    { label: 'Text Area', value: 'textarea' },
    { label: 'Textbox', value: 'text' },
  ];
  form: FormGroup;
  isSaving: boolean = false;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      fields: this.formBuilder.array([]),
    });

    this.addField();
  }

  get fields(): FormArray {
    return this.form.get('fields') as FormArray;
  }

  addField() {
    const fieldGroup = this.formBuilder.group({
      type: ['', Validators.required],
      question: ['', Validators.required],
      required: [false],
    });
    this.fields.push(fieldGroup);
  }

  resetForm() {
    this.form.reset();
    this.fields.clear();
    this.addField();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
  }

  onAddField() {
    this.addField();
  }

  onRemoveField(index: number) {
    this.fields.removeAt(index);
  }

  onSubmit() {
    const formData = {
      ...this.form.value,
      fields: this.form.value.fields.reduce(
        (acc: any, field: any, index: number) => {
          acc[`field-${index + 1}`] = field;
          return acc;
        },
        {}
      ),
    };

    this.apiService.forms
      .formsCreate(formData)
      .then(() => {
        this.snackBar.open('Form saved successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
        this.resetForm();
      })
      .catch(() => {
        this.snackBar.open('Failed to save form.', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-error'],
        });
      })
      .finally(() => {
        this.isSaving = false;
      });
  }
}
