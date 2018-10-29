import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/Auth.service';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import { ConfigService } from "../services/Config.service";
import { FipeService } from 'app/services/fipe.service';
import { Filter, FilterType } from 'app/models/filter.model';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  backGroundImage: string

  private usuario: Usuario = new Usuario('', '')

  constructor(
    private authService: Auth,
    private router: Router,
    private configService: ConfigService,
    private fipeService: FipeService
  ) { }

  ngOnInit() {
    this.configService.getConfig('login')
      .then((url) => {
        this.backGroundImage = url
      })

  }

  public cadastrarUsuario(): void {

    this.authService.cadastrarUsuario(this.usuario)
      .then((erro) => {
        if (erro) {
          //aqui tem que mostrar avisando que o email já está cadastrado no sistema
        } else {
          this.router.navigateByUrl('/signup')
        }
      })

  }


}
