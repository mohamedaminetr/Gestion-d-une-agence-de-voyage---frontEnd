import { Component, OnInit, inject } from '@angular/core';
import { VoyageService } from '../../services/voyage.service';
import { DestinationService } from '../../services/destination.service';
import { NotificationService } from '../../services/notification.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-voyage-list',
  templateUrl: './voyage-list.component.html',
  styleUrls: ['./voyage-list.component.scss'],
  imports: [
    CommonModule,
    DatePipe,
    CurrencyPipe,
    RouterLink,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
})
export class VoyageListComponent implements OnInit {
  public viewMode: 'table' | 'grid' = 'grid';
  public voyageService = inject(VoyageService);
  public destinationService = inject(DestinationService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  ngOnInit(): void {
    this.voyageService.loadVoyages();
    this.destinationService.loadDestinations();
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.voyageService.searchQuery.set(target.value);
  }

  onFilterDestination(destId: string) {
    this.voyageService.filterDestination.set(destId);
  }

  onFilterDate(event: any) {
    this.voyageService.filterDate.set(event.value ? event.value.toISOString() : '');
  }

  viewDetail(id: string) {
    this.router.navigate(['/voyages/detail', id]);
  }

  editVoyage(id: string) {
    this.router.navigate(['/voyages', id]);
  }

  async deleteVoyage(id: string) {
    const confirmed = await this.notification.confirm(
      'Voulez-vous vraiment annuler/supprimer ce voyage ?',
    );
    if (confirmed) {
      try {
        await this.voyageService.deleteVoyage(id);
        this.notification.success('Voyage supprimé avec succès');
      } catch (err) {
        this.notification.error('Erreur lors de la suppression');
      }
    }
  }

  public getDestinationName(dest: any): string {
    if (!dest) return 'N/A';
    return typeof dest === 'object' ? dest.nom : 'Nom indisponible';
  }

  public getDestinationImage(dest: any): string {
    if (!dest) return '';
    if (typeof dest === 'object' && dest.image) {
      return dest.image;
    }
    return '';
  }
}
