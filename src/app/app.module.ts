import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { NouisliderModule } from 'ng2-nouislider';
import localePt from '@angular/common/locales/pt';
//registerLocaleData(localePt);

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { HomeModule } from './home/home.module';
import { PesquisaComponent } from './pesquisa/pesquisa.component';
import { LoginComponent } from './login/login.component';
import { SuporteComponent } from './suporte/suporte.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { Auth } from './services/Auth.service';
import { ClienteService } from './services/Cliente.service';
import { AnuncioService } from './services/Anuncio.service';
import { firestoreSerice } from './services/Firestore.service';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    NavbarComponent,
    FooterComponent,
    PesquisaComponent,
    LoginComponent,
    SuporteComponent,
    DashboardComponent,
    CadastroComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    RouterModule,
    AppRoutingModule,
    HomeModule,
    NouisliderModule,
    ReactiveFormsModule
  ],
  providers: [Auth, ClienteService, AnuncioService, firestoreSerice],
  bootstrap: [AppComponent]
})
export class AppModule { }
