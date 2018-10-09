import * as firebase from "firebase";
import { Injectable } from "@Angular/core";
import { Anuncio } from "../models/anuncio.model";
import { Auth } from "./Auth.service";

@Injectable()
export class AnuncioService {

    private collection: firebase.firestore.CollectionReference

    constructor() {
        this.collection = firebase.firestore().collection('cliente').doc(Auth.getCurrentUserHash())
          .collection('anuncios')
     }

    public getAnuncioById(id: string): any {
        return this.collection.doc(id).get()
    }

    public persistAnuncio(an: Anuncio): void {
        this.collection.doc().set(JSON.parse(JSON.stringify(an)))
    }

    public getAnuncios(): any {
        return this.collection.get()
    }
}