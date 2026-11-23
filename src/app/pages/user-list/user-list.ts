import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { catchError, of, tap } from 'rxjs';
import { UserService } from '../../services/user-service';

@Component({
  imports: [RouterLink, TitleCasePipe],
  selector: 'app-user-list',
  styleUrl: './user-list.css',
  templateUrl: './user-list.html',
})
export class UserList {
  private userService = inject(UserService);
  
  status = signal<'loading' | 'loaded' | 'error'>('loading');

  users = toSignal(
    this.userService.getUsers().pipe(
      tap(() => this.status.set('loaded')),
      catchError(() => {
        this.status.set('error');
        return of([]);
      })
    ), 
    { initialValue: [] }
  );
  
  searchTerm = signal('');
  planFilter = signal('');
  statusFilter = signal(''); 
  onlyIssues = signal(false);

  planTypes = computed(() => {
    const types = this.users().map(user => user.plan.type);
    return [...new Set(types)].sort();
  });

  filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const plan = this.planFilter();
    const status = this.statusFilter();
    const onlyIssues = this.onlyIssues();

    return this.users().filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term);
      const matchesPlan = plan === '' || user.plan.type === plan;
      const matchesStatus = status === '' || user.plan.status === status;
      const matchesIssues = !onlyIssues || (user.dataWarnings?.length ?? 0) > 0;

      return matchesSearch && matchesPlan && matchesStatus && matchesIssues;
    });
  });

  hasActiveFilters = computed(() =>
    this.searchTerm() !== '' ||
    this.planFilter() !== '' ||
    this.statusFilter() !== '' ||
    this.onlyIssues()
  );

  clearFilters() {
    this.searchTerm.set('');
    this.planFilter.set('');
    this.statusFilter.set('');
    this.onlyIssues.set(false);
  }
}
