import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth } from '../services/Auth.service';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import { ConfigService } from "../services/Config.service";
import { FipeService } from 'app/services/fipe.service';
import { Filter, FilterType } from 'app/models/filter.model';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  @ViewChild('mySwal') private mySwal: SwalComponent;
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
          if (erro.code === "auth/email-already-in-use") {
            this.mySwal.title = 'Email ja cadastrado!'
          } else if (erro.code === "auth/weak-password") {
            this.mySwal.title = 'Senha deve possiur ao menos 6 caractsres!'
          } else {
            this.mySwal.title = 'Deu erro!!!'
          }
          this.mySwal.type = "error"
          this.mySwal.show()
        } else {
          this.mySwal.title = 'Cadastro realizado com Sucesso!'
          this.mySwal.text = "Um email de verificação foi enviado para " + this.usuario.email
          this.mySwal.type = "success"
          this.mySwal.show()

          this.router.navigateByUrl('/login')
        }
      })

  }


}
