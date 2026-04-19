import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-core',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss',
})
export class CoreComponent {
  menuOpen = false;
  activeRoute = 'voyages';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      if (url.includes('destinations')) this.activeRoute = 'destinations';
      else if (url.includes('voyages')) this.activeRoute = 'voyages';
    });
  }

  navigateTo(route: string) {
    this.activeRoute = route;
    this.router.navigate([route]);
  }
}
