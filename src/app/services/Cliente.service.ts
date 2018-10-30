import * as firebase from "firebase";
import { Injectable } from "@Angular/core";
import { Cliente } from "../models/cliente.model";
import { FirestoreService } from "./Firestore.service";


@Injectable()
export class ClienteService {

    private collection: firebase.firestore.CollectionReference
    
    constructor(
        private firestoreService: FirestoreService
    ) {
        this.collection = firebase.firestore().collection('cliente')
    }

    public getCurrentClient(): any {

        return new Promise((resolve, reject) => {

            this.collection.doc(this.getCurrentUserHash())
                .get()
                .then((snapshot: any) => {
                    let cli = snapshot.data()
                    this.firestoreService.getClienteFoto(cli.foto)
                        .then((url) => {
                            cli.foto = url
                            resolve(cli)
                        })
                })
        })
    }

    public persistCliente(cli: Cliente): void {
        this.collection.doc(this.getCurrentUserHash())
            .set(JSON.parse(JSON.stringify(cli)))
    }

    public getClienteById(id: string): any {
        return new Promise((resolve, reject) => {
            
              this.collection.doc(id)
                .get()
                .then((snapshot: any) => {
                    let cli = snapshot.data()
                    this.firestoreService.getClienteFoto(cli.foto)
                        .then((url) => {
                            cli.foto = url
                            resolve(cli)
                        })

                })
        })
    }

    public getCurrentUserHash(): string {
        return btoa(firebase.auth().currentUser.email);
    }
}
