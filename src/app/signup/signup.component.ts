import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Auth } from '../services/Auth.service';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import { ConfigService } from "../services/Config.service";
import { FipeRealService } from '../services/FIpeReal.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  test: Date = new Date();
  backGroundImage: string

  public formulario: FormGroup = new FormGroup({
    'email': new FormControl(null),
    'senha': new FormControl(null)
  })

  constructor(
    private authService: Auth,
    private router: Router,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.configService.getConfig('login')
      .then((url) => {
        this.backGroundImage = url
      })
   }

  public autenticar(): void {
    let usuario = new Usuario(
      this.formulario.value.email,
      this.formulario.value.senha
    )

    this.authService.autenticar(usuario)
      .then((erro) => {
        if (erro) {
          //aqui tem que mostrar avisando que o email não está cadastrado no sistema ou a senha está errada
        } else {
          this.router.navigateByUrl('/dashboard')
        }
      })
  }

  public goToCadastro(): void {
    this.router.navigateByUrl('/cadastro')
  }
}
