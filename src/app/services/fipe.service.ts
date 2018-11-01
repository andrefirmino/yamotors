import { Injectable } from "@angular/core";
import * as firebase from 'firebase/app';

@Injectable()
export class FipeService {
    constructor() { }

    //conferido
    public getMarcas(tipo: string): any {
        return new Promise((resolve) => {

            firebase.firestore().collection('marca')
                .where('tipo', '==', tipo)
                .orderBy('nome')
                .get()
                .then((snapshot: any) => {
                    let marcas: Array<any> = []
                    snapshot.forEach(childsnapshot => {
                        marcas.push(childsnapshot.data())
                    })
                    resolve(marcas)
                })
        })
    }

    //conferido
    public getModelos(idMarca: string): any {
        return new Promise((resolve) => {

            firebase.firestore().collection('marca')
                .doc(idMarca).collection('modelo')
                .orderBy('nome')
                .get()
                .then((snapshot: any) => {
                    let modelos: Array<any> = []
                    snapshot.forEach(childsnapshot => {
                        modelos.push(childsnapshot.data())
                    })
                    resolve(modelos)
                })
        })
    }

    //conferido
    public getAnos(idMarca: string, idModelo: string): any {
        return new Promise((resolve) => {

            firebase.firestore().collection('marca')
                .doc(idMarca).collection('modelo')
                .doc(idModelo).collection('ano')
                .orderBy('nome')
                .get()
                .then((snapshot: any) => {
                    let anos: Array<any> = []

                    snapshot.forEach(childsnapshot => {
                        let data = childsnapshot.data()
                        if (typeof data.nome === 'string') {
                            data.nome = data.nome.substring(0, 4)
                        }
                        if (data.nome !== 32000 && data.nome !== 3200) {
                            anos.push(data)
                        }
                    })
                    resolve(anos)
                })
        })
    }
}