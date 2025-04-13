import { Injectable } from '@angular/core';
import { Api } from '../api/api';

@Injectable({
  providedIn: 'root',
})
export class ApiService extends Api<void> {
  constructor() {
    super({ baseUrl: 'http://localhost:8080' });
  }
}
