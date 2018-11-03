import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/Auth.service';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import { ConfigService } from "../services/Config.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  test: Date = new Date();
  backGroundImage: string

  private usuario: Usuario = new Usuario('', '')

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
    this.authService.autenticar(this.usuario)
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
