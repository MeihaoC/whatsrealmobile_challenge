import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { User } from '../models/user';

interface UserResponse {
  users: User[];
}

@Service()
export class UserService {
  private http = inject(HttpClient);

  private users$ = this.http.get<UserResponse>('db.json').pipe(
    map((response) => this.cleanUsers(response.users)),
    shareReplay(1),
  );

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getUserById(id: string): Observable<User | undefined> {
    return this.users$.pipe(map((users) => users.find((user) => user.id === id)));
  }

  cleanUsers(users: User[]): User[] {
    // Count each id
    const idCounts = new Map<string, number>();
    for (const user of users) {
      idCounts.set(user.id, (idCounts.get(user.id) ?? 0) + 1);
    }

    // build the clean list
    const timesSeen = new Map<string, number>();

    return users.map((user) => {
      const warnings: string[] = [];
      let id = user.id;

      if ((idCounts.get(user.id) ?? 0) > 1) {
        const seen = (timesSeen.get(user.id) ?? 0) + 1;
        timesSeen.set(user.id, seen);
        warnings.push('This ID is shared with another user in the source data');
        if (seen > 1) {
          id = `${user.id}-${seen}`;
        }
      }

      const type = user.plan.type.toLowerCase();
      const description = user.plan.description.toLowerCase();
      if (!description.includes(type)) {
        warnings.push(
          `Plan type "${user.plan.type}" doesn't match description "${user.plan.description}"`,
        );
      }

      return { ...user, id, dataWarnings: warnings };
    });
  }
}
