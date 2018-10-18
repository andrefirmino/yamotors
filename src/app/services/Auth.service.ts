import * as firebase from "firebase";
import { Injectable } from "@Angular/core";
import { Usuario } from "../models/usuario.model";
import { Router } from "@angular/router";
import { Cliente } from "../models/cliente.model";
import { ClienteService } from "./Cliente.service";

@Injectable()

 export class Auth {
    public token_id: string

    private cliente: Cliente
    constructor() { }

    public cadastrarUsuario(usuario: Usuario): Promise<any> {

        return firebase.auth().createUserWithEmailAndPassword(usuario.email, usuario.senha)
            .then((resposta: any) => {
                //envia o email de confirma��o

                firebase.auth().currentUser
                    .sendEmailVerification().then(function () {
                        console.log("email enviado!")
                    }).catch(function (error) {
                        console.log("email nao enviado!" + error)
                    });

                this.cliente = new Cliente()
                this.cliente.email = usuario.email
                this.cliente.foto = 'padrao.jpg'
                this.cliente.nome = 'Aqui ficara o seu nome'
                this.cliente.descricao = 'Assim que possivel entre na area do perfil e edite seu perfil'

                new ClienteService().persistCliente(this.cliente)

            })
            .catch((error: Error) => {
                return error
            })
    }

    public autenticar(usuario: Usuario): Promise<any> {
        return firebase.auth().signInWithEmailAndPassword(usuario.email, usuario.senha)
            .then((resposta: any) => {
                firebase.auth().currentUser.getIdToken()
                    .then((idToken: string) => {
                        this.token_id = idToken
                        localStorage.setItem('idToken', idToken)
                        console.log('autenticado')
                        //this.router.navigate(['/teste'])
                    })
            })
            .catch((error: Error) => {
                console.log(error)
                return error
            })
    }

    public autenticado(): boolean {
        if (this.token_id === undefined && localStorage.getItem('idToken') != null) {
            this.token_id = localStorage.getItem('idToken')
        }

        if (this.token_id === undefined) {
            //this.router.navigate(['/'])
        }
        return this.token_id !== undefined
    }

    public sair(): void {
        firebase.auth().signOut()
            .then(() => {
                localStorage.removeItem('idToken')
                this.token_id = undefined
                //this.router.navigate(['/'])
            })
    }

    public static getCurrentUserHash(): string {
        return btoa(firebase.auth().currentUser.email);
    }

}