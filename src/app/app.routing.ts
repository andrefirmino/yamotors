import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { PesquisaComponent } from './pesquisa/pesquisa.component';
import { LoginComponent } from './login/login.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AnuncioComponent } from './anuncio/anuncio.component';
import { SuporteComponent } from './suporte/suporte.component';
import { SobreComponent } from './sobre/sobre.component';


const routes: Routes =[
    { path: '',                        component: HomeComponent},
    { path: 'home',                    component: HomeComponent },
    { path: 'dashboard',               component: DashboardComponent},
    { path: 'cadastro',                component: CadastroComponent},
    { path: 'pesquisa',                component: PesquisaComponent},
    { path: 'login',                   component: LoginComponent },
    { path: 'perfil/:id',              component: PerfilComponent },
    { path: 'anuncio/:id',             component: AnuncioComponent },
    { path: 'anuncio/:anunciante/:id', component: AnuncioComponent },
    { path: 'suporte',                 component: SuporteComponent},
    { path: 'sobre',                   component: SobreComponent},
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
