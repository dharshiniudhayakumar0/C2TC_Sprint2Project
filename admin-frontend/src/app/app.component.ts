import { Component } from '@angular/core';
import { AdminListComponent } from './admins/admin-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AdminListComponent],
  template: '<app-admin-list></app-admin-list>'
})
export class AppComponent {
  title = 'admin-frontend';
}