import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { Ng5SliderModule } from 'ng5-slider';
//registerLocaleData(localePt);

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
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
import { FirestoreService } from './services/Firestore.service';
import { AnuncioAbertoService } from './services/AnuncioAberto.service';
import { ConfigService } from "./services/Config.service";
import { FipeRealService } from './services/FIpeReal.service';
import { PerfilComponent } from './perfil/perfil.component';
import { AnuncioComponent } from './anuncio/anuncio.component';
import { FipeService } from './services/fipe.service';
import { UtilsService } from './services/utils.service';
import { HttpClientModule } from '@angular/common/http'; 
import { Progresso } from './services/Progresso.service';

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
    CadastroComponent,
    PerfilComponent,
    AnuncioComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    RouterModule,
    HomeModule,
    ReactiveFormsModule,
    Ng5SliderModule,
    HttpClientModule
  ],
  providers: [
    Auth,
    ClienteService, 
    AnuncioService,
    FirestoreService, 
    AnuncioAbertoService, 
    ConfigService, 
    FipeRealService, 
    FipeService, 
    UtilsService,
    Progresso],
  bootstrap: [AppComponent]
})
export class AppModule { }
