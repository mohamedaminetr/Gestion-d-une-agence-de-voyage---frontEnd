import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Destination } from '../models/destination';
import { map, tap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DestinationService {
  private http = inject(HttpClient);
  // Default Node.js backend port is usually 5000 based on standard setup
  private apiUrl = 'http://localhost:3000/api/destinations';

  // Signals for state management
  public destinations = signal<Destination[]>([]);
  public isLoading = signal<boolean>(false);

  constructor() {}

  async loadDestinations() {
    this.isLoading.set(true);
    try {
      const data = await firstValueFrom(
        this.http.get<{ success: boolean; data: Destination[] }>(this.apiUrl),
      );
      if (data && data.data) {
        this.destinations.set(data.data);
      } else {
        // sometimes apis return array directly
        this.destinations.set(data as any);
      }
    } catch (e) {
      console.error('Error loading destinations', e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async getDestination(id: string): Promise<Destination> {
    return firstValueFrom(
      this.http
        .get<Destination>(`${this.apiUrl}/${id}`)
        .pipe(map((res: any) => (res.data ? res.data : res))),
    );
  }

  async createDestination(dest: Destination): Promise<Destination> {
    const saved = await firstValueFrom(
      this.http.post<any>(this.apiUrl, dest).pipe(map((res) => (res.data ? res.data : res))),
    );
    this.destinations.update((curr) => [...curr, saved]);
    return saved;
  }

  async updateDestination(id: string, dest: Destination): Promise<Destination> {
    const updated = await firstValueFrom(
      this.http
        .put<any>(`${this.apiUrl}/${id}`, dest)
        .pipe(map((res) => (res.data ? res.data : res))),
    );
    this.destinations.update((curr) => curr.map((d) => (d._id === id ? updated : d)));
    return updated;
  }

  async deleteDestination(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    this.destinations.update((curr) => curr.filter((d) => d._id !== id));
  }
}
