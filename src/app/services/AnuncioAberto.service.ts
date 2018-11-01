import * as firebase from 'firebase/app';
import { Injectable } from "@Angular/core";
import { Anuncio } from "../models/anuncio.model";
import { FirestoreService } from "./Firestore.service";
import { FipeRealService } from './FIpeReal.service';
import { Filter } from 'app/models/filter.model';
import { jsonFilter } from 'app/utils';
import { ConfigService } from './Config.service';

@Injectable()
export class AnuncioAbertoService {

    private collection: firebase.firestore.CollectionReference

    constructor(
        private firestoreService: FirestoreService,
        private fipeRealService: FipeRealService,
        private configService: ConfigService
    ) {
        this.collection = firebase.firestore().collection('anuncioAberto')
    }

    //conferido
    public getAnunciosAbertos(filter: Filter[]): any {
        return new Promise((resolve, reject) => {

            this.getData('timestamp', 'desc')
                .then((anuncios) => {
                    resolve(jsonFilter(anuncios, filter))
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

    //conferido
    public deleteAnuncio(anuncio: Anuncio): any {
        this.collection.doc(anuncio.id).delete()
        this.fipeRealService.decrement(anuncio)
    }

    //conferido
    public getMostRecently(): any {
        return this.getData('timestamp', 'desc')
    }

    //conferido
    public getCheaper(): any {
        return this.getData('preco', 'asc')
    }

    // conferido
    public minValue(): any {
        return this.getValue('preco', 'asc')
    }

    //conferido
    public maxValue(): any {
        return this.getValue('preco', 'desc')
    }

    //conferido
    private getData(fieldOrder: string, typeOrer: firebase.firestore.OrderByDirection): any {
        return new Promise((resolve) => {
            this.configService.getConfig('limiteFotos')
                .then((limit: number) => {
                    this.collection.orderBy(fieldOrder, typeOrer)
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
                                this.firestoreService.getClienteFoto(anuncio.anuncianteId)
                                    .then((url) => {
                                        anuncio.anuncianteFoto = url
                                    })
                            })
                            resolve(anuncios)
                        })
                })
        })
    }

    //conferido
    private getValue(field: string, typeOrer: firebase.firestore.OrderByDirection): any {
        return new Promise((resolve) => {
            this.collection.orderBy(field, typeOrer)
                .limit(1)
                .get()
                .then((snapshot: any) => {
                    snapshot.forEach(childSnapshot => {
                        resolve(childSnapshot.data().preco)
                    })
                })
        })
    }

}