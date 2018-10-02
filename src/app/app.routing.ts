import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { PesquisaComponent } from './pesquisa/pesquisa.component';
import { SignupComponent } from './signup/signup.component';


const routes: Routes =[
    { path: 'home',             component: HomeComponent },
    { path: 'dashboard',        component: DashboardComponent},
    { path: 'cadastro',         component: CadastroComponent},
    { path: 'pesquisa',         component: PesquisaComponent},
    { path: 'signup',           component: SignupComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
