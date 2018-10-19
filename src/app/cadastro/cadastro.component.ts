import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/Auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import { ConfigService } from "../services/Config.service";

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

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

  public cadastrarUsuario(): void {

    let usuario: Usuario = new Usuario(
      this.formulario.value.email,
      this.formulario.value.senha
    )

      this.authService.cadastrarUsuario(usuario)
        .then((erro) => {
          if (erro){
            //aqui tem que mostrar avisando que o email já está cadastrado no sistema
          } else {
            this.router.navigateByUrl('/signup')
          }
        })
  }

}
