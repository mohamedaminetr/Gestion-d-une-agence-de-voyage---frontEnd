import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DestinationListComponent } from './destinations/destination-list/destination-list.component';
import { DestinationFormComponent } from './destinations/destination-form/destination-form.component';
import { VoyageListComponent } from './voyages/voyage-list/voyage-list.component';
import { VoyageFormComponent } from './voyages/voyage-form/voyage-form.component';
import { VoyageDetailComponent } from './voyages/voyage-detail/voyage-detail.component';
import { CoreComponent } from './core/core.component';

const routes: Routes = [
  { path: 'homepage', component: CoreComponent },

  {
    path: '',
    component: CoreComponent,
    children: [
      { path: '', redirectTo: 'destinations', pathMatch: 'full' },
      { path: 'destinations', component: DestinationListComponent },
      { path: 'destinations/new', component: DestinationFormComponent },
      { path: 'destinations/:id', component: DestinationFormComponent },
      { path: 'voyages', component: VoyageListComponent },
      { path: 'voyages/new', component: VoyageFormComponent },
      { path: 'voyages/detail/:id', component: VoyageDetailComponent },
      { path: 'voyages/:id', component: VoyageFormComponent },
    ],
  },

  { path: '**', redirectTo: 'destinations' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
