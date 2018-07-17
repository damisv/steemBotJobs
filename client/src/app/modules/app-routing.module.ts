import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  CronJobComponent, BotAppComponent,
  LoginComponent, JobsComponent, ViewCronJobComponent
} from '../components';
import { LoginGuard } from '../guards/';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'app', component: BotAppComponent, canActivate: [LoginGuard], children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: JobsComponent},
      {path: 'new', component: CronJobComponent},
      {path: 'job/:id', component: ViewCronJobComponent}
  ]},
  { path: '**', redirectTo: 'app', pathMatch: 'full'}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
