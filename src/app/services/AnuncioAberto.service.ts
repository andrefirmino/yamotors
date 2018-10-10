import * as firebase from 'firebase';
import { Injectable } from "@Angular/core";
import { Anuncio } from "../models/anuncio.model";
import { FirestoreService } from "./Firestore.service";

@Injectable()
export class AnuncioAbertoService {

    private collection: firebase.firestore.CollectionReference

    constructor(
        private firestoreService: FirestoreService
    ) {
        this.collection = firebase.firestore().collection('anuncioAberto')
    }

    public getAnunciosAbertos(): any {
        return new Promise((resolve, reject) => {
            this.collection.get()
                .then((snapshot: any) => {
                    let anuncios: Array<any> = []

                    snapshot.forEach((childSnapshot: any) => {
                        anuncios.push(childSnapshot.data())
                    })

                    return anuncios.reverse()
                })
                .then((anuncios: any) => {

                    anuncios.forEach((anuncio) => {
                        anuncio.veiculo.fotos.forEach((foto, idx) => {
                            this.firestoreService.getAnuncioFoto(foto)
                                .then((url) => {
                                    anuncio.veiculo.fotos[idx] = url
                                })
                        })
                    })
                    resolve(anuncios)
                })
        })
    }

    public persistAnuncio(anuncio: Anuncio): void {

        if (anuncio.aberto) {
            this.collection.doc(anuncio.id).set(JSON.parse(JSON.stringify(anuncio)))
        } else {
            this.collection.doc(anuncio.id).delete()
        }
    }

    public deleteAnuncio(id: string) {

        // FALTA TESTAR

        this.collection.doc(id).delete()
    }
}