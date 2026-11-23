import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { UserService } from '../../services/user-service';

@Component({
  imports: [RouterLink, TitleCasePipe],
  selector: 'app-user-detail',
  styleUrl: './user-detail.css',
  templateUrl: './user-detail.html',
})
export class UserDetail {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  private id = this.route.snapshot.paramMap.get('id') ?? '';

  // null = still loading, undefined = no user with this id
  user = toSignal(this.userService.getUserById(this.id), { initialValue: null });
}
