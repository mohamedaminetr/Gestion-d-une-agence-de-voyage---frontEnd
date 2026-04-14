export class Destination {
  _id: string = '';
  nom: String = ''; //required , unique
  pays: String = ''; //required
  description: String = '';
  image?: String = '';
  climate: string = ''; //expl:tropical,habib
  createdAt: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  constructor(init?: Partial<Destination>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
