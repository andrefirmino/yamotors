import * as firebase from "firebase/app";
import { Injectable } from "@Angular/core";
import { Anuncio } from "../models/anuncio.model";
import { Auth } from "./Auth.service";
import { FirestoreService } from "./Firestore.service";
import { AnuncioAbertoService } from "./AnuncioAberto.service";
import { ClienteService } from "./Cliente.service";

@Injectable()
export class AnuncioService {

    constructor(
        private firestoreService: FirestoreService,
        private anuncioAbertoService: AnuncioAbertoService,
        private clienteService: ClienteService
    ) {
        let collection = firebase.firestore().collection('cliente').doc(this.clienteService.getCurrentUserHash())
            .collection('anuncios')
    }

    public getAnuncioById(id: string): any {
        return new Promise((resolve, reject) => {
            firebase.firestore().collection('cliente').doc(this.clienteService.getCurrentUserHash())
            .collection('anuncios').doc(id).get()
                .then((result) => {
                    let anuncio = result.data()
                    resolve(anuncio)
                })
        })
    }

    public persistAnuncio(anuncio: Anuncio): any {
        return new Promise((resolve, reject) => {
            //se não tive id, pega um novo, e persiste
            if (anuncio.id == null || anuncio.id == undefined) {
                anuncio.id = firebase.firestore().collection('cliente').doc(this.clienteService.getCurrentUserHash())
                .collection('anuncios').doc().id
            }

            firebase.firestore().collection('cliente').doc(this.clienteService.getCurrentUserHash())
            .collection('anuncios').doc(anuncio.id).set(JSON.parse(JSON.stringify(anuncio)))
                .then(() => {
                    this.anuncioAbertoService.persistAnuncio(anuncio)
                        .then(() => resolve(true))                    
                })  
        })
    }

    public getAnuncios(): any {
        return new Promise((resolve, reject) => {
            firebase.firestore().collection('cliente').doc(this.clienteService.getCurrentUserHash())
            .collection('anuncios').orderBy('timestamp', 'desc').get()
                .then((snapshot: any) => {
                    let anuncios: Array<any> = []
                    snapshot.forEach((childSnapshot: any) => {
                        anuncios.push(childSnapshot.data())
                    })
                    resolve(anuncios)
                })
        })

    }

    //conferido
    public deleteAnuncio(id: string): any {
        return new Promise((resolve) => {
            this.getAnuncioById(id)
                .then((anuncio) => {
                    firebase.firestore().collection('cliente').doc(this.clienteService.getCurrentUserHash())
                    .collection('anuncios').doc(id).delete()
                        .then(() => {
                            this.anuncioAbertoService.deleteAnuncio(anuncio)
                            this.firestoreService.deleteFotos(anuncio.fotos)
                            resolve(true)
                        })
                })
        })

    }

    //conferido
    public getAnuncioByClienteAndId(cliente: string, id: string): any {
        let anuncios = []
        return new Promise((resolve, reject) => {
            firebase.firestore().collection('cliente').doc(cliente)
            .collection('anuncios').doc(id).get()
                .then((result) => {
                    anuncios.push(result.data())
                    resolve(anuncios)
                })
        })
    }
}