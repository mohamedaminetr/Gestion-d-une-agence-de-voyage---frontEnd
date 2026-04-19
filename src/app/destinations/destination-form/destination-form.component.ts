import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
// @ts-ignore
import { form, required, FormField } from '@angular/forms/signals';
import { DestinationService } from '../../services/destination.service';
import { NotificationService } from '../../services/notification.service';
import { Destination } from '../../models/destination';

@Component({
  selector: 'app-destination-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormField,
  ],
  templateUrl: './destination-form.component.html',
  styleUrls: ['./destination-form.component.scss'],
})
export class DestinationFormComponent implements OnInit {
  public isEditMode = false;
  private currentId: string | null = null;
  public isSubmitting = signal(false);
  public imagePreview = signal<string | null>(null);
  private imageBase64: string = '';

  public climates = [
    'tropical',
    'aride',
    'mediterraneen',
    'continental',
    'polaire',
    'tempere',
    'autre',
  ];

  private destinationService = inject(DestinationService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public destinationModel = signal<Destination>({
    _id: '',
    nom: '',
    pays: '',
    description: '',
    image: '',
    climate: 'autre',
    createdAt: new Date(),
  });

  public destinationForm = form(this.destinationModel, (fieldPath: any) => {
    required(fieldPath.nom, { message: 'Le nom est requis' });
    required(fieldPath.pays, { message: 'Le pays est requis' });
  });

  public async ngOnInit(): Promise<void> {
    this.currentId = this.route.snapshot.paramMap.get('id');
    if (this.currentId && this.currentId !== 'new') {
      this.isEditMode = true;
      try {
        const dest = await this.destinationService.getDestination(this.currentId);
        this.destinationModel.set(dest);
        if (dest.image) {
          this.imagePreview.set(dest.image);
          this.imageBase64 = dest.image;
        }
      } catch (err) {
        this.notification.error('Impossible de charger la destination');
        this.router.navigate(['/destinations']);
      }
    }
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Convert to Base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.imageBase64 = base64;
        this.imagePreview.set(base64);
      };
      reader.readAsDataURL(file);
    }
  }

  public removeImage(): void {
    this.imageBase64 = '';
    this.imagePreview.set(null);
  }

  public async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.destinationForm().invalid()) {
      return;
    }

    this.isSubmitting.set(true);
    try {
      const payload = {
        nom: this.destinationForm.nom?.()?.value() || '',
        pays: this.destinationForm.pays?.()?.value() || '',
        description: this.destinationForm.description?.()?.value() || '',
        image: this.imageBase64,
        climate: this.destinationForm.climate?.()?.value() || '',
      } as Destination;

      if (this.isEditMode && this.currentId) {
        await this.destinationService.updateDestination(this.currentId, payload);
        this.notification.success('Destination modifiée avec succès');
      } else {
        await this.destinationService.createDestination(payload);
        this.notification.success('Destination créée avec succès');
      }
      this.router.navigate(['/destinations']);
    } catch (err) {
      this.notification.error("Erreur lors de l'enregistrement");
    } finally {
      this.isSubmitting.set(false);
    }
  }

  public cancel(): void {
    this.router.navigate(['/destinations']);
  }
}
