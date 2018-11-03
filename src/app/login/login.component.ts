import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth } from '../services/Auth.service';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import { ConfigService } from "../services/Config.service";
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('mySwal') private mySwal: SwalComponent;
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
          //aqui tem que mostrar avisando que o email n�o est� cadastrado no sistema ou a senha est� errada
        } else {
          this.router.navigateByUrl('/dashboard')
        }
      })
  }

  public goToCadastro(): void {
    this.router.navigateByUrl('/cadastro')
  }

  public redefinirSenha(value): void {
    if(value){
      this.authService.redefinirSenha(this.usuario)
      .then((result) => {
        if(result){
          this.mySwal.title = 'Email enviado com Sucesso!'
          this.mySwal.type = "success"
          this.mySwal.show()
        } else {
          this.mySwal.title = 'Ocorreu um erro ao enviar o Email!'
          this.mySwal.type = "error"
          this.mySwal.show()
        }
      })
    } else {
      this.mySwal.title = 'Envio Cancelado!'
      this.mySwal.type = "warning"
      this.mySwal.show()
    }

  }
}
