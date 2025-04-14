import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { SourceRecord } from '../../../shared/api/api';
import { MaterialModule } from '../../../shared/material.module';
import { ApiService } from '../../../shared/services/api.service';
import { FormViewerComponent } from './form-viewer.component';

describe('FormViewerComponent', () => {
  let component: FormViewerComponent;
  let fixture: ComponentFixture<FormViewerComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const apiServiceMock = jasmine.createSpyObj('ApiService', [], {
      forms: {
        formsDetail: jasmine.createSpy('formsDetail').and.returnValue(
          Promise.resolve({
            data: {
              data: {
                id: '00000000-0000-0000-0000-000000000000',
                name: 'Test Form',
                fields: {
                  'field-1': {
                    type: 'text',
                    question: 'Test question one',
                    required: true,
                  },
                  'field-2': {
                    type: 'text',
                    question: 'Test question two',
                    required: false,
                  },
                },
              },
            },
          })
        ),
      },
      sourceRecords: {
        sourceRecordsCreate: jasmine
          .createSpy('sourceRecordsCreate')
          .and.returnValue(Promise.resolve()),
        sourceRecordsDetail: jasmine
          .createSpy('sourceRecordsDetail')
          .and.returnValue(
            Promise.resolve({
              data: { formId: 'test-form-id', sourceData: [] },
            })
          ),
      },
    });
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    const routeMock = {
      snapshot: {
        paramMap: {
          get: jasmine
            .createSpy('get')
            .and.returnValue('00000000-0000-0000-0000-000000000000'),
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [FormViewerComponent],
      imports: [BrowserAnimationsModule, MaterialModule, ReactiveFormsModule],
      providers: [
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: ApiService, useValue: apiServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormViewerComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', async () => {
    const mockFormDefinition = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Test Form',
      fields: {
        'field-1': {
          type: 'text',
          question: 'Test question one',
          required: true,
        },
        'field-2': {
          type: 'text',
          question: 'Test question two',
          required: false,
        },
      },
    };

    await component.ngOnInit();

    expect(apiServiceSpy.forms.formsDetail).toHaveBeenCalledWith(
      '00000000-0000-0000-0000-000000000000'
    );
    expect(component.formDefinition).toEqual(mockFormDefinition);
    expect(component.form.get('field-1')).toBeTruthy();
    expect(component.form.get('field-2')).toBeTruthy();
  });

  it('should build the form with the correct validators', () => {
    const fields = {
      'field-1': {
        type: 'text',
        question: 'Test question one',
        required: true,
      },
      'field-2': {
        type: 'text',
        question: 'Test question two',
        required: false,
      },
    };

    const form = component.buildForm(fields);

    expect(form.get('field-1')?.validator).toBeTruthy();
    expect(form.get('field-2')?.validator).toBeFalsy();
  });

  it('should reset the form', () => {
    component.form.patchValue({
      'field-1': 'Answer one',
      'field-2': 'Answer two',
    });
    component.resetForm();

    expect(component.form.pristine).toBeTrue();
    expect(component.form.untouched).toBeTrue();
    expect(component.form.value).toEqual({ 'field-1': null, 'field-2': null });
  });

  it('should submit the form and call the API', async () => {
    const mockSourceRecord: SourceRecord = {
      formId: '00000000-0000-0000-0000-000000000000',
      sourceData: [
        { question: 'Test question one', answer: 'Answer one' },
        { question: 'Test question two', answer: 'Answer two' },
      ],
    } as SourceRecord;

    apiServiceSpy.sourceRecords = {
      sourceRecordsCreate: jasmine
        .createSpy()
        .and.returnValue(Promise.resolve()),
      sourceRecordsDetail: jasmine
        .createSpy('sourceRecordsDetail')
        .and.returnValue(
          Promise.resolve({
            data: {
              formId: '00000000-0000-0000-0000-000000000000',
              sourceData: [],
            },
          })
        ),
    };

    component.form.patchValue({
      'field-1': 'Answer one',
      'field-2': 'Answer two',
    });

    await component.onSubmit();

    expect(
      apiServiceSpy.sourceRecords.sourceRecordsCreate
    ).toHaveBeenCalledWith(mockSourceRecord);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Data saved successfully!',
      'Close',
      { duration: 5000, panelClass: ['snackbar-success'] }
    );
  });
});
