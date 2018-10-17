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
                    anuncio.veiculo.fotos.forEach((foto, idx) => {
                        this.firestoreService.getAnuncioFoto(foto)
                            .then((url) => {
                                anuncio.veiculo.fotos[idx] = url
                            })
                    })
                    
                    resolve(anuncio)
                })
        }) 
    }

    public persistAnuncio(anuncio: Anuncio): void {

        //se não tive id, pega um novo, e persiste
        if(anuncio.id == null || anuncio.id == undefined) {
            anuncio.id = this.collection.doc().id
        }   

        this.collection.doc(anuncio.id).set(JSON.parse(JSON.stringify(anuncio)))

        this.anuncioAbertoService.persistAnuncio(anuncio)
    
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

    public deleteAnuncio(id: string): void {

        //FALTA TESTAR

        this.collection.doc(id).delete()

        this.anuncioAbertoService.deleteAnuncio(id)
    }

    public mockAnuncio(): void {
        let anuncio = new Anuncio()
        anuncio.anuncianteId = 'eXVyaW9kcEBnbWFpbC5jb20='
        anuncio.anuncianteNome = 'Yuri Oliveira de Paula'
        anuncio.titulo = 'Kawasaki Ninja 250R Preta'
        anuncio.descricao = 'Vendo moto bem conservada, revisada, e blablabla'
        anuncio.veiculo.fotos = []

        anuncio.veiculo.fotos.push('1.jpg')
        anuncio.veiculo.preco = Math.ceil(Math.random() * 10000)

        anuncio.aberto = anuncio.veiculo.preco > 5000;
        
        this.persistAnuncio(anuncio);

        this.deleteAnuncio('KEP0x1KkL3QHoms6PTVA')
    }
}