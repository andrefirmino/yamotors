import * as firebase from 'firebase';
import { Injectable } from "@Angular/core";
import { Anuncio } from "../models/anuncio.model";
import { FirestoreService } from "./Firestore.service";
import { FipeRealService } from './FIpeReal.service';
import { AnuncioService } from './Anuncio.service';
import { Filter } from 'app/models/filter.model';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Injectable()
export class AnuncioAbertoService {

    private collection: firebase.firestore.CollectionReference

    constructor(
        private firestoreService: FirestoreService,
        private fipeRealService: FipeRealService
    ) {
        this.collection = firebase.firestore().collection('anuncioAberto')
    }

    public getAnunciosAbertos(filter: Filter[]): any {
        return new Promise((resolve, reject) => {
            
            this.collection.orderBy('timestamp', "desc").get()
                .then((snapshot: any) => {
                    let anuncios: Array<any> = []

                    snapshot.forEach((childSnapshot: any) => {
                        anuncios.push(childSnapshot.data())
                    })

                    filter.forEach((f) => {
                        anuncios = anuncios.filter(new Function("item", `return item.${f.name} ${f.type} ${f.value};`))        
                    })

                    return anuncios.reverse()
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

    public persistAnuncio(anuncio: Anuncio): void {

        if (anuncio.aberto) {
            this.collection.doc(anuncio.id).set(JSON.parse(JSON.stringify(anuncio)))
            this.fipeRealService.increment(anuncio)
        } else {
            this.collection.doc(anuncio.id).delete()
            this.fipeRealService.decrement(anuncio)
        }
    }

    public deleteAnuncio(anuncio: Anuncio): any {
        
        this.collection.doc(anuncio.id).delete()


        this.fipeRealService.decrement(anuncio)
    }

    public getMostRecently(limit: number): any {
        return new Promise((resolve, reject) => {
            this.collection.orderBy('timestamp', 'asc')
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
}