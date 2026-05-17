import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VoyageService } from '../../services/voyage.service';
import { Voyage } from '../../models/voyage';
import { Destination } from '../../models/destination';
import { NotificationService } from '../../services/notification.service';
import { DestinationService } from '../../services/destination.service';

@Component({
  selector: 'app-voyage-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './voyage-detail.component.html',
  styleUrls: ['./voyage-detail.component.scss'],
})
export class VoyageDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private voyageService = inject(VoyageService);
  private notification = inject(NotificationService);
  private destinationService = inject(DestinationService);

  public voyage = signal<Voyage | null>(null);
  public isLoading = signal<boolean>(true);

  // Computed signal for destination logic
  public destinationObj = computed(() => {
    const v = this.voyage();
    if (!v || !v.destination) return null;
    if (typeof v.destination === 'object') return v.destination as unknown as Destination;

    // Fallback: Find it from the destination store
    return this.destinationService.destinations().find((d) => d._id === v.destination) || null;
  });

  async ngOnInit() {
    this.destinationService.loadDestinations();
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      try {
        const data = await this.voyageService.getVoyage(id);
        this.voyage.set(data);
      } catch (err) {
        console.error('Error loading voyage details:', err);
        this.notification.error('Impossible de charger les détails du voyage.');
        this.router.navigate(['/voyages']);
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.router.navigate(['/voyages']);
    }
  }

  goBack() {
    this.router.navigate(['/voyages']);
  }
}
