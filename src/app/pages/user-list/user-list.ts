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

  filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    return this.users().filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });
}
