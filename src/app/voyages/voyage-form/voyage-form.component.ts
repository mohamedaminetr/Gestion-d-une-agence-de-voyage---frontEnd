import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
// @ts-ignore
import { form, required, min, FormField } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { VoyageService } from '../../services/voyage.service';
import { DestinationService } from '../../services/destination.service';
import { NotificationService } from '../../services/notification.service';
import { Voyage } from '../../models/voyage';

@Component({
  selector: 'app-voyage-form',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatButtonModule, 
    MatInputModule, MatSelectModule, MatDatepickerModule, MatIconModule, FormField
  ],
  templateUrl: './voyage-form.component.html',
  styleUrls: ['./voyage-form.component.scss']
})
export class VoyageFormComponent implements OnInit {
  public isEditMode = false;
  private currentId: string | null = null;
  public isSubmitting = signal(false);

  private voyageService = inject(VoyageService);
  public destinationService = inject(DestinationService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public voyageModel = signal<Voyage>({
    _id: '',
    titre: '',
    description: '',
    prix: 0,
    duree: 0,
    dateDepart: new Date(),
    dateRetour: new Date(),
    placesDisponibles: 0,
    destination: '',
    createdAt: new Date()
  });

  public voyageForm = form(this.voyageModel, (fieldPath) => {
    required(fieldPath.titre, { message: 'Le titre est requis' });
    required(fieldPath.prix, { message: 'Le prix est requis' });
    min(fieldPath.prix, 0, { message: 'Le prix doit être positif' });
    required(fieldPath.dateDepart, { message: 'La date de départ est requise' });
    required(fieldPath.destination, { message: 'La destination est requise' });
    min(fieldPath.duree, 0, { message: 'Ne peut être négatif' });
    min(fieldPath.placesDisponibles, 0, { message: 'Ne peut être négatif' });
  });

  public async ngOnInit(): Promise<void> {
    await this.destinationService.loadDestinations();

    this.currentId = this.route.snapshot.paramMap.get('id');
    if (this.currentId && this.currentId !== 'new') {
      this.isEditMode = true;
      try {
        const voyage = await this.voyageService.getVoyage(this.currentId);
        
        let destinationId = voyage.destination;
        if (typeof voyage.destination === 'object' && voyage.destination !== null) {
          destinationId = (voyage.destination as any)._id;
        }

        this.voyageModel.set({
          ...voyage,
          destination: destinationId
        });
      } catch (err) {
        this.notification.error('Impossible de charger le voyage');
        this.router.navigate(['/voyages']);
      }
    }
  }

  public async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.voyageForm().invalid()) {
      return;
    }

    this.isSubmitting.set(true);
    try {
      const payload = {
        titre: this.voyageForm.titre?.()?.value() || '',
        description: this.voyageForm.description?.()?.value() || '',
        prix: this.voyageForm.prix?.()?.value() || 0,
        duree: this.voyageForm.duree?.()?.value() || 0,
        dateDepart: this.voyageForm.dateDepart?.()?.value() || new Date(),
        dateRetour: this.voyageForm.dateRetour?.()?.value() || new Date(),
        placesDisponibles: this.voyageForm.placesDisponibles?.()?.value() || 0,
        destination: this.voyageForm.destination?.()?.value() || ''
      } as unknown as Voyage;

      if (this.isEditMode && this.currentId) {
        await this.voyageService.updateVoyage(this.currentId, payload);
        this.notification.success('Voyage modifié avec succès');
      } else {
        await this.voyageService.createVoyage(payload);
        this.notification.success('Voyage créé avec succès');
      }
      this.router.navigate(['/voyages']);
    } catch (err) {
      this.notification.error('Erreur lors de l\'enregistrement');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  public cancel(): void {
    this.router.navigate(['/voyages']);
  }
}
