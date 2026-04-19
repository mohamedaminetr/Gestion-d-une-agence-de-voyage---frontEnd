import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  success(message: string, title: string = 'Succès') {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  }

  error(message: string, title: string = 'Erreur') {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonColor: '#d33'
    });
  }

  warning(message: string, title: string = 'Attention') {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      confirmButtonColor: '#f8bb86'
    });
  }

  async confirm(message: string, title: string = 'Êtes-vous sûr ?', confirmText: string = 'Oui'): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmText,
      cancelButtonText: 'Annuler'
    });
    return result.isConfirmed;
  }
}
