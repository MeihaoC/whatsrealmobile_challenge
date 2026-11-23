import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user-service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('whatsreal-mobile');
  private userSerivce = inject(UserService);

  constructor() {
    this.userSerivce.getUsers().subscribe(users => console.log(users));
  }
}
