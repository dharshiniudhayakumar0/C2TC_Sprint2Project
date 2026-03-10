import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css']
})
export class AdminListComponent implements OnInit {
  admins: any[] = [];
  filteredAdmins: any[] = [];
  stats: any = { totalAdmins: 0, activeAdmins: 0 };

  searchTerm = '';
  filterStatus = 'all';
  filterDepartment = '';

  showModal = false;
  showDeleteModal = false;
  showPasswordModal = false;
  isEditMode = false;

  selectedAdmin: any = null;
  adminToDelete: any = null;

  toast: any = { show: false, message: '', type: 'success' };
  isLoading = false;

  formData: any = {
    username: '', fullName: '', email: '',
    phoneNumber: '', department: '', permissions: '', password: ''
  };

  passwordData: any = { oldPassword: '', newPassword: '', confirmPassword: '' };

  departments = [
    'Computer Science', 'Information Technology', 'Electronics',
    'Mechanical', 'Civil', 'Management', 'Placement Cell'
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadAdmins();
    this.loadStats();
  }

  loadAdmins() {
    this.isLoading = true;
    this.adminService.getAllAdmins().subscribe({
      next: (data: any) => {
        this.admins = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.showToast('Failed to load admins: ' + (err.error?.error || err.message), 'error');
        this.isLoading = false;
      }
    });
  }

  loadStats() {
    this.adminService.getStats().subscribe({
      next: (data: any) => { this.stats = data; },
      error: () => {}
    });
  }

  applyFilters() {
    let result = [...this.admins];
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter((a: any) =>
        a.fullName?.toLowerCase().includes(term) ||
        a.username?.toLowerCase().includes(term) ||
        a.email?.toLowerCase().includes(term)
      );
    }
    if (this.filterStatus === 'active') result = result.filter((a: any) => a.isActive);
    if (this.filterStatus === 'inactive') result = result.filter((a: any) => !a.isActive);
    if (this.filterDepartment) result = result.filter((a: any) => a.department === this.filterDepartment);
    this.filteredAdmins = result;
  }

  openAddModal() {
    this.isEditMode = false;
    this.formData = { username: '', fullName: '', email: '', phoneNumber: '', department: '', permissions: '', password: '' };
    this.showModal = true;
  }

  openEditModal(admin: any) {
    this.isEditMode = true;
    this.selectedAdmin = admin;
    this.formData = { ...admin, password: '' };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedAdmin = null;
  }

  saveAdmin() {
    if (this.isEditMode && this.selectedAdmin?.adminId) {
      this.adminService.updateAdmin(this.selectedAdmin.adminId, this.formData).subscribe({
        next: () => {
          this.showToast('Admin updated successfully!', 'success');
          this.closeModal();
          this.loadAdmins();
          this.loadStats();
        },
        error: (err: any) => this.showToast('Update failed: ' + (err.error?.error || err.message), 'error')
      });
    } else {
      this.adminService.register(this.formData).subscribe({
        next: () => {
          this.showToast('Admin registered successfully!', 'success');
          this.closeModal();
          this.loadAdmins();
          this.loadStats();
        },
        error: (err: any) => this.showToast('Registration failed: ' + (err.error?.error || err.message), 'error')
      });
    }
  }

  confirmDelete(admin: any) {
    this.adminToDelete = admin;
    this.showDeleteModal = true;
  }

  deleteAdmin() {
    if (!this.adminToDelete?.adminId) return;
    this.adminService.deleteAdmin(this.adminToDelete.adminId).subscribe({
      next: () => {
        this.showToast('Admin deleted successfully!', 'success');
        this.showDeleteModal = false;
        this.adminToDelete = null;
        this.loadAdmins();
        this.loadStats();
      },
      error: (err: any) => this.showToast('Delete failed: ' + (err.error?.error || err.message), 'error')
    });
  }

  toggleStatus(admin: any) {
    if (!admin.adminId) return;
    const action = admin.isActive
      ? this.adminService.deactivateAdmin(admin.adminId)
      : this.adminService.activateAdmin(admin.adminId);
    action.subscribe({
      next: () => {
        this.showToast('Admin ' + (admin.isActive ? 'deactivated' : 'activated') + '!', 'success');
        this.loadAdmins();
        this.loadStats();
      },
      error: (err: any) => this.showToast('Action failed: ' + (err.error?.error || err.message), 'error')
    });
  }

  openPasswordModal(admin: any) {
    this.selectedAdmin = admin;
    this.passwordData = { oldPassword: '', newPassword: '', confirmPassword: '' };
    this.showPasswordModal = true;
  }

  changePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.showToast('New passwords do not match!', 'error');
      return;
    }
    if (!this.selectedAdmin?.adminId) return;
    this.adminService.changePassword(
      this.selectedAdmin.adminId,
      this.passwordData.oldPassword,
      this.passwordData.newPassword
    ).subscribe({
      next: () => {
        this.showToast('Password changed successfully!', 'success');
        this.showPasswordModal = false;
      },
      error: (err: any) => this.showToast('Failed: ' + (err.error?.error || err.message), 'error')
    });
  }

  showToast(message: string, type: string) {
    this.toast = { show: true, message, type };
    setTimeout(() => this.toast.show = false, 3500);
  }

  getInitials(name: string) {
    if (!name) return '?';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }
}