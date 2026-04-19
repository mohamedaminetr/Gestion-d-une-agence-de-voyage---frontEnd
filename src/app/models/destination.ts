export class Destination {
  _id: string = '';
  nom: string = ''; //required , unique
  pays: string = ''; //required
  description: string = '';
  image: string = '';
  climate: string = ''; //expl:tropical,habib
  createdAt: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  constructor(init?: Partial<Destination>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
