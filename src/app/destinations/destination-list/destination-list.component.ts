import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DestinationService } from '../../services/destination.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-destination-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './destination-list.component.html',
  styleUrls: ['./destination-list.component.scss'],
})
export class DestinationListComponent implements OnInit {
  public destinationService = inject(DestinationService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  public ngOnInit(): void {
    this.destinationService.loadDestinations();
  }

  public onFilterNom(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.destinationService.filterNom.set(target.value);
  }

  public onFilterPays(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.destinationService.filterPays.set(target.value);
  }

  public onFilterClimat(climat: string): void {
    this.destinationService.filterClimat.set(climat);
  }

  public editDestination(id: string): void {
    this.router.navigate(['/destinations', id]);
  }

  public async deleteDestination(id: string): Promise<void> {
    const confirmed = await this.notification.confirm(
      'Voulez-vous vraiment supprimer cette destination ?',
    );
    if (confirmed) {
      try {
        await this.destinationService.deleteDestination(id);
        this.notification.success('Destination supprimée avec succès');
      } catch (err) {
        this.notification.error('Erreur lors de la suppression');
      }
    }
  }
}
