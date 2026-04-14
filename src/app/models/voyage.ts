export class Voyage {
  _id: string = '';
  titre: string = ''; //required
  description: string = '';
  prix: number = 0; //required
  duree: number = 0; //days
  dateDepart: Date = new Date(); //required
  dateRetour: Date = new Date();
  placesDisponibles: number = 0;
  destination: string = ''; //FK → destinations
  createdAt: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  constructor(init?: Partial<Voyage>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
