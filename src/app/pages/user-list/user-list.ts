import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { UserService } from '../../services/user-service';

@Component({
  imports: [RouterLink, TitleCasePipe],
  selector: 'app-user-list',
  styleUrl: './user-list.css',
  templateUrl: './user-list.html',
})
export class UserList {
  private userService = inject(UserService);

  users = toSignal(this.userService.getUsers(), { initialValue: []});
}
