import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admins';

  constructor(private http: HttpClient) {}

  register(admin: any): Observable<any> {
    return this.http.post(this.apiUrl + '/register', admin);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl + '/login', credentials);
  }

  getAllAdmins(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getAdminById(id: number): Observable<any> {
    return this.http.get(this.apiUrl + '/' + id);
  }

  getActiveAdmins(): Observable<any> {
    return this.http.get(this.apiUrl + '/active');
  }

  getInactiveAdmins(): Observable<any> {
    return this.http.get(this.apiUrl + '/inactive');
  }

  updateAdmin(id: number, admin: any): Observable<any> {
    return this.http.put(this.apiUrl + '/' + id, admin);
  }

  deleteAdmin(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + id);
  }

  deactivateAdmin(id: number): Observable<any> {
    return this.http.patch(this.apiUrl + '/' + id + '/deactivate', {});
  }

  activateAdmin(id: number): Observable<any> {
    return this.http.patch(this.apiUrl + '/' + id + '/activate', {});
  }

  changePassword(id: number, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(this.apiUrl + '/' + id + '/change-password', { oldPassword, newPassword });
  }

  searchAdmins(name: string): Observable<any> {
    const params = new HttpParams().set('name', name);
    return this.http.get(this.apiUrl + '/search', { params });
  }

  getAdminsByDepartment(department: string): Observable<any> {
    return this.http.get(this.apiUrl + '/department/' + department);
  }

  getStats(): Observable<any> {
    return this.http.get(this.apiUrl + '/stats');
  }
}