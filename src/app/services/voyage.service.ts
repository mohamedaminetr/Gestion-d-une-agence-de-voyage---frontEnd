import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Voyage } from '../models/voyage';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VoyageService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/voyages';

  public voyages = signal<Voyage[]>([]);
  public isLoading = signal<boolean>(false);

  // Search and filter signals
  public searchQuery = signal<string>('');
  public filterDestination = signal<string>('');
  public filterDate = signal<string>('');

  // Computed signal for filtered voyages
  public filteredVoyages = computed(() => {
    let result = this.voyages();

    const search = this.searchQuery().toLowerCase();
    if (search) {
      result = result.filter(
        (v) =>
          v.titre.toLowerCase().includes(search) || v.description.toLowerCase().includes(search),
      );
    }

    const dest = this.filterDestination();
    if (dest) {
      // The backend populates destination, so it's an object, or we use its ID.
      result = result.filter((v) => {
        if (typeof v.destination === 'object' && v.destination !== null) {
          const destObj = v.destination as any;
          return (
            destObj._id === dest ||
            (destObj.nom &&
              typeof destObj.nom === 'string' &&
              destObj.nom.toLowerCase().includes(dest.toLowerCase()))
          );
        }
        return v.destination === dest;
      });
    }

    const date = this.filterDate();
    if (date) {
      const filterDateObj = new Date(date).setHours(0, 0, 0, 0);
      result = result.filter((v) => {
        const vDateObj = new Date(v.dateDepart).setHours(0, 0, 0, 0);
        return vDateObj === filterDateObj;
      });
    }

    return result;
  });

  constructor() {}

  async loadVoyages() {
    this.isLoading.set(true);
    try {
      const data = await firstValueFrom(this.http.get<any>(this.apiUrl));
      const items = data.data ? data.data : data;
      this.voyages.set(items);
    } catch (e) {
      console.error('Error loading voyages', e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async getVoyage(id: string): Promise<Voyage> {
    return firstValueFrom(
      this.http.get<any>(`${this.apiUrl}/${id}`).pipe(map((res) => (res.data ? res.data : res))),
    );
  }

  async createVoyage(voyage: Voyage): Promise<Voyage> {
    const saved = await firstValueFrom(
      this.http.post<any>(this.apiUrl, voyage).pipe(map((res) => (res.data ? res.data : res))),
    );
    await this.loadVoyages(); // Reload to get populated destination info
    return saved;
  }

  async updateVoyage(id: string, voyage: Voyage): Promise<Voyage> {
    const updated = await firstValueFrom(
      this.http
        .put<any>(`${this.apiUrl}/${id}`, voyage)
        .pipe(map((res) => (res.data ? res.data : res))),
    );
    await this.loadVoyages(); // Reload to get populated destination info
    return updated;
  }

  async deleteVoyage(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    this.voyages.update((curr) => curr.filter((v) => v._id !== id));
  }
}
