import * as firebase from "firebase";
import { Injectable } from "@Angular/core";
import { Anuncio } from "../models/anuncio.model";
import { Auth } from "./Auth.service";
import { FirestoreService } from "./Firestore.service";
import { AnuncioAbertoService } from "./AnuncioAberto.service";
import { ClienteService } from "./Cliente.service";

@Injectable()
export class AnuncioService {

    private collection: firebase.firestore.CollectionReference

    constructor(
        private firestoreService: FirestoreService,
        private anuncioAbertoService: AnuncioAbertoService,
        private clienteService: ClienteService
    ) {
        this.collection = firebase.firestore().collection('cliente').doc(this.clienteService.getCurrentUserHash())
            .collection('anuncios')
    }

    public getAnuncioById(id: string): any {
        return new Promise((resolve, reject) => {
            this.collection.doc(id).get()
                .then((result) => {
                    let anuncio = result.data()
                    anuncio.fotos.forEach((foto, idx) => {
                        this.firestoreService.getAnuncioFoto(foto)
                            .then((url) => {
                                anuncio.fotos[idx] = url
                            })
                    })

                    resolve(anuncio)
                })
        })
    }

    public persistAnuncio(anuncio: Anuncio): any {
        return new Promise((resolve, reject) => {
            //se não tive id, pega um novo, e persiste
            if (anuncio.id == null || anuncio.id == undefined) {
                anuncio.id = this.collection.doc().id
            }

            this.collection.doc(anuncio.id).set(JSON.parse(JSON.stringify(anuncio)))
                .then(() => {
                    this.anuncioAbertoService.persistAnuncio(anuncio)
                        .then(() => resolve(true))                    
                })  
        })
    }

    public getAnuncios(): any {
        return new Promise((resolve, reject) => {
            this.collection.orderBy('timestamp', 'desc').get()
                .then((snapshot: any) => {
                    let anuncios: Array<any> = []

                    snapshot.forEach((childSnapshot: any) => {
                        anuncios.push(childSnapshot.data())
                    })

                    return anuncios
                })
                .then((anuncios: any) => {

                    anuncios.forEach((anuncio) => {
                        anuncio.fotos.forEach((foto, idx) => {
                            if(!foto) {
                                foto = 'padrao.jpg'
                            }
                            this.firestoreService.getAnuncioFoto(foto)
                                .then((url) => {
                                    anuncio.fotos[idx] = url
                                })
                            
                        })
                    })
                    resolve(anuncios)
                })
        })

    }

    public deleteAnuncio(id: string): any {
        return new Promise((resolve, reject) => {
            this.getAnuncioById(id)
                .then((anuncio) => {
                    this.collection.doc(id).delete()
                        .then(() => {
                            this.anuncioAbertoService.deleteAnuncio(anuncio)
                            this.firestoreService.deleteFotos(anuncio.fotos)
                            resolve(true)
                        })

                })
        })

    }
}