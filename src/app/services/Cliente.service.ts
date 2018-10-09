import * as firebase from "firebase";
import { Injectable } from "@Angular/core";
import { Cliente } from "../models/cliente.model";
import { Auth } from "./Auth.service";


@Injectable()
export class ClienteService {

    private collection: firebase.firestore.CollectionReference

    constructor(){
        this.collection = firebase.firestore().collection('cliente')
    }

    public getCurrentClient(): any {
        return this.collection.doc(Auth.getCurrentUserHash())
                .get()
    }

    public persistCliente(cli: Cliente): void {
        this.collection.doc(Auth.getCurrentUserHash())
            .set(JSON.parse(JSON.stringify(cli)))
    }
}
