import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Form,
  HttpResponse,
  SourceData,
  SourceRecord,
} from '../../../shared/api/api';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { ApiService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-form-viewer',
  templateUrl: './form-viewer.component.html',
  styleUrl: './form-viewer.component.scss',
})
export class FormViewerComponent implements OnInit {
  form!: FormGroup;
  formDefinition!: Form;
  formId!: string;
  isLoading = true;
  isSaving: boolean = false;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formId = this.route.snapshot.paramMap.get('id') ?? '';

    if (this.formId) {
      this.apiService.forms
        .formsDetail(this.formId)
        .then((response: HttpResponse<Form, any>) => {
          const apiResponse = response as unknown as HttpResponse<
            ApiResponse<Form>,
            any
          >;
          this.formDefinition = apiResponse.data.data;
          this.form = this.buildForm(this.formDefinition.fields);
          this.isLoading = false;
        });
    }
  }

  buildForm(fields: any): FormGroup {
    const group: any = {};
    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      const validators = field.required ? [Validators.required] : [];
      group[key] = this.formBuilder.control('', validators);
    });

    return this.formBuilder.group(group);
  }

  resetForm() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    this.isSaving = true;
    const sourceRecord = this.createSourceRecord(
      this.formId,
      this.form.value,
      this.formDefinition
    );

    this.apiService.sourceRecords
      .sourceRecordsCreate(sourceRecord)
      .then(() => {
        this.snackBar.open('Data saved successfully!', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-success'],
        });
        this.resetForm();
      })
      .catch(() => {
        this.snackBar.open('Failed to save data.', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-error'],
        });
      })
      .finally(() => {
        this.isSaving = false;
      });
  }

  private createSourceRecord(
    formId: string,
    formData: { [key: string]: any },
    formDefinition: Form
  ): SourceRecord {
    const sourceData: SourceData[] = Object.entries(formData).map(
      ([fieldKey, answer]) => {
        const fieldDefinition = formDefinition.fields[fieldKey];

        let answerToSave = answer;
        if (fieldDefinition.type === 'datetime' && answer instanceof Date) {
          answerToSave = answer.toISOString();
        }

        return {
          question: fieldDefinition?.question ?? '',
          answer: String(answerToSave),
        } as SourceData;
      }
    );

    return {
      formId: formId,
      sourceData: sourceData,
    } as SourceRecord;
  }
}
