import * as firebase from 'firebase/app';
import { Injectable } from '@Angular/core';
import { Anuncio } from '../models/anuncio.model';
import { promise } from 'selenium-webdriver';

@Injectable()
export class FipeRealService {
    private collection: firebase.firestore.CollectionReference

    constructor() {
        this.collection = firebase.firestore().collection('fipeReal')
    }

    public increment(anuncio: Anuncio): void {
        let id = anuncio.idMarca + '-' + anuncio.idModelo + '-' + anuncio.anoComposto
        this.collection.doc(id).get()
            .then((doc: any) => {
                let data = doc.data()

                if (data) {
                    data.quant += 1;
                } else {
                    data = {
                        idMarca: anuncio.idMarca,
                        idModelo: anuncio.idModelo,
                        tipo: anuncio.tipo,
                        nomeMarca: anuncio.nomeMarca,
                        nomeModelo: anuncio.nomeModelo,
                        ano: anuncio.ano,
                        quant: 1
                    }
                }

                this.collection.doc(id).set(JSON.parse(JSON.stringify(data)))
            })

    }

    //conferido
    public decrement(anuncio: Anuncio): void {
        let id = anuncio.idMarca + '-' + anuncio.idModelo + '-' + anuncio.anoComposto
        this.collection.doc(id).get()
            .then((doc: any) => {
                let data = doc.data()

                data.quant--

                if (data.quant == 0) {
                    this.collection.doc(id).delete()
                } else {
                    this.collection.doc(id).set(JSON.parse(JSON.stringify(data)))
                }

            })
    }

    //conferido
    public getMarcas(idMarca: number, idModelo: number, ano: number): any {
        return new Promise((resolve, reject) => {
            this.collection.get()
                .then((snapshot) => {
                    let marcas = []

                    snapshot.forEach((child) => {
                        let data = child.data()

                        if (typeof data.ano === 'string') {
                            data.ano = data.ano.substring(0, 4)
                        }

                        if (data.idMarca == idMarca || idMarca == 0) {
                            if (data.idModelo == idModelo || idModelo == 0) {
                                if (data.ano == ano || ano == 0) {
                                    marcas[data.idMarca] = { idMarca: data.idMarca, nomeMarca: data.nomeMarca }
                                }

                            }
                        }

                    })
                    resolve(marcas)
                })
        })
    }

    //conferido
    public getModelos(idMarca: number, idModelo: number, ano: number): any {
        return new Promise((resolve, reject) => {
            let modelos = []
            this.collection.get()
                .then((snapshot) => {
                    snapshot.forEach((child) => {
                        let data = child.data()

                        if (typeof data.ano === 'string') {
                            data.ano = data.ano.substring(0, 4)
                        }

                        if (data.idMarca == idMarca || idMarca == 0) {
                            if (data.idModelo == idModelo || idModelo == 0) {
                                if (data.ano == ano || ano == 0) {
                                    modelos[data.idModelo] = { idModelo: data.idModelo, nomeModelo: data.nomeModelo }
                                }
                            }
                        }
                    })
                    resolve(modelos)
                })
        })
    }

    //conferido
    public getAnos(idMarca: number, idModelo: number, ano: number): any {
        return new Promise((resolve, reject) => {
            let anos = []
            this.collection.get()
                .then((snapshot) => {
                    snapshot.forEach((child) => {
                        let data = child.data()
                        if (typeof data.ano === 'string') {
                            data.ano = data.ano.substring(0, 4)
                        }

                        if (data.idMarca == idMarca || idMarca == 0) {
                            if (data.idModelo == idModelo || idModelo == 0) {
                                if (data.ano == ano || ano == 0) {
                                    anos[data.ano] = { ano: data.ano }
                                }
                            }
                        }
                    })
                    resolve(anos)
                })
        })
    }
}