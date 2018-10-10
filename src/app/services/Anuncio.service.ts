import * as firebase from "firebase";
import { Injectable } from "@Angular/core";
import { Anuncio } from "../models/anuncio.model";
import { Auth } from "./Auth.service";
import { FirestoreService } from "./Firestore.service";

@Injectable()
export class AnuncioService {

    private collection: firebase.firestore.CollectionReference

    constructor(
        private firestoreService: FirestoreService
    ) {
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


    public mockAnuncio(): void {
        let anuncio = new Anuncio()
        anuncio.anuncianteId = 'eXVyaW9kcEBnbWFpbC5jb20='
        anuncio.anuncianteNome = 'Yuri Oliveira de Paula'
        anuncio.titulo = 'Kawasaki Ninja 250R Preta'
        anuncio.descricao = 'Vendo moto bem conservada, revisada, e blablabla'
        anuncio.aberto = true
        anuncio.veiculo.fotos[0] = '1.jpg'
        anuncio.veiculo.preco = 12000


        this.persistAnuncio(anuncio);
    }
}