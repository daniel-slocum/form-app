import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { MaterialModule } from '../../../shared/material.module';
import { FormBuilderComponent } from './form-builder.component';

describe('FormBuilderComponent', () => {
  let component: FormBuilderComponent;
  let fixture: ComponentFixture<FormBuilderComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const apiServiceMock = jasmine.createSpyObj('ApiService', ['forms']);

    await TestBed.configureTestingModule({
      declarations: [FormBuilderComponent],
      imports: [BrowserAnimationsModule, MaterialModule, ReactiveFormsModule],
      providers: [{ provide: ApiService, useValue: apiServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(FormBuilderComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with one field', () => {
    expect(component.form).toBeDefined();
    expect(component.fields.length).toBe(1);
  });

  it('should add a new field to the form', () => {
    component.onAddField();
    expect(component.fields.length).toBe(2);
  });

  it('should remove a field from the form', () => {
    component.onAddField(); // Add a second field
    component.onRemoveField(0); // Remove the first field
    expect(component.fields.length).toBe(1);
  });

  it('should reset the form and reinitialize with one field', () => {
    component.onAddField(); // Add a second field
    component.resetForm();
    expect(component.form.value.name).toBeNull();
    expect(component.fields.length).toBe(1);
    expect(component.form.pristine).toBeTrue();
    expect(component.form.untouched).toBeTrue();
  });

  it('should call the API service on form submission and reset the form on success', async () => {
    const mockResponse = of(null); // Simulate a successful API response
    apiServiceSpy.forms = {
      formsCreate: jasmine
        .createSpy()
        .and.returnValue(mockResponse.toPromise()),
      formsDetail: jasmine.createSpy().and.returnValue(Promise.resolve(null)),
    };

    component.form.patchValue({
      name: 'Test Form',
      fields: [{ type: 'text', question: 'Test Question', required: true }],
    });

    await component.onSubmit();

    expect(apiServiceSpy.forms.formsCreate).toHaveBeenCalledWith({
      name: 'Test Form',
      fields: {
        'field-1': { type: 'text', question: 'Test Question', required: true },
      },
    });
    expect(component.form.value.name).toBeNull();
    expect(component.fields.length).toBe(1);
  });
});
