import * as firebase from "firebase";
import { Injectable } from "@Angular/core";
import { Anuncio } from "../models/anuncio.model";
import { Auth } from "./Auth.service";
import { FirestoreService } from "./Firestore.service";
import { AnuncioAbertoService } from "./AnuncioAberto.service";

@Injectable()
export class AnuncioService {

    private collection: firebase.firestore.CollectionReference

    constructor(
        private firestoreService: FirestoreService,
        private anuncioAbertoService: AnuncioAbertoService
    ) {
        this.collection = firebase.firestore().collection('cliente').doc(Auth.getCurrentUserHash())
            .collection('anuncios')
    }

    public getAnuncioById(id: string): any {
        return new Promise((resolve, reject) => {

            //FALTA TESTAR

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

    public persistAnuncio(anuncio: Anuncio): void {

        //se não tive id, pega um novo, e persiste
        if (anuncio.id == null || anuncio.id == undefined) {
            anuncio.id = this.collection.doc().id
        }

        this.collection.doc(anuncio.id).set(JSON.parse(JSON.stringify(anuncio)))

        this.anuncioAbertoService.persistAnuncio(anuncio)

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
                    this.anuncioAbertoService.deleteAnuncio(anuncio)

                    resolve(true)
                })
        })

    }

    public mockAnuncio(): void {
        let anuncio = new Anuncio()
        anuncio.anuncianteId = 'eXVyaW9kcEBnbWFpbC5jb20='
        anuncio.anuncianteNome = 'Yuri Oliveira de Paula'
        anuncio.titulo = 'Kawasaki Ninja 250R Preta'
        anuncio.descricao = 'Vendo moto bem conservada, revisada, e blablabla'
        anuncio.fotos = []

        anuncio.fotos.push('1.jpg')
        anuncio.preco = Math.ceil(Math.random() * 100000)

        anuncio.aberto = true

        anuncio.idMarca = 85
        anuncio.idModelo = 4880
        anuncio.nomeMarca = 'KAWASAKI'
        anuncio.nomeModelo = 'NINJA 250R'
        anuncio.ano = 2012
        anuncio.anoComposto = '2012-1'
        anuncio.combustivel = 'gasolina'
        anuncio.tipo = 'motos'

        this.persistAnuncio(anuncio);

    }
}