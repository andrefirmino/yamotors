import * as firebase from 'firebase/app';
import { Injectable } from "@Angular/core";
import { Anuncio } from "../models/anuncio.model";
import { FirestoreService } from "./Firestore.service";
import { FipeRealService } from './FIpeReal.service';
import { Filter } from 'app/models/filter.model';
import { jsonFilter } from 'app/utils';

@Injectable()
export class AnuncioAbertoService {

    private collection: firebase.firestore.CollectionReference

    constructor(
        private firestoreService: FirestoreService,
        private fipeRealService: FipeRealService
    ) {
        this.collection = firebase.firestore().collection('anuncioAberto')
    }

    //conferido
    public getAnunciosAbertos(filter: Filter[]): any {
        return new Promise((resolve, reject) => {

            this.collection.orderBy('timestamp', "desc").get()
                .then((snapshot: any) => {
                    let anuncios: Array<any> = []

                    snapshot.forEach((childSnapshot: any) => {
                        anuncios.push(childSnapshot.data())
                    })

                    return jsonFilter(anuncios, filter)

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

    public persistAnuncio(anuncio: Anuncio): any {
        return new Promise((resolve) => {
            if (anuncio.aberto) {
                this.fipeRealService.increment(anuncio)
                this.collection.doc(anuncio.id).set(JSON.parse(JSON.stringify(anuncio)))
                    .then(() => resolve(true))
            } else {
                this.fipeRealService.decrement(anuncio)
                this.collection.doc(anuncio.id).delete()
                    .then(() => resolve(true))
            }
        })

    }

    public deleteAnuncio(anuncio: Anuncio): any {

        this.collection.doc(anuncio.id).delete()


        this.fipeRealService.decrement(anuncio)
    }

    //conferido
    public getMostRecently(limit: number): any {
        return new Promise((resolve, reject) => {
            this.collection.orderBy('timestamp', 'desc')
                .limit(limit)
                .get()
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

    //conferido
    public getCheaper(limit: number): any {
        return new Promise((resolve, reject) => {
            this.collection.orderBy('preco', 'asc')
                .limit(limit)
                .get()
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

    // conferido
    public minValue(): any {
        return new Promise((resolve) => {
            this.collection.get()
                .then((snapshot: any) => {
                    let data = []

                    snapshot.forEach(childSnapshot => {
                        data.push(childSnapshot.data())
                    })

                    resolve(Math.min.apply(Math, data.map((o) => {
                        return o.preco
                    })))
                })
        })
    }

    //conferido
    public maxValue(): any {
        return new Promise((resolve) => {
            this.collection.get()
                .then((snapshot: any) => {
                    let data = []

                    snapshot.forEach(childSnapshot => {
                        data.push(childSnapshot.data())
                    })

                    resolve(Math.max.apply(Math, data.map((o) => {
                        return o.preco
                    })))
                })
        })
    }
}