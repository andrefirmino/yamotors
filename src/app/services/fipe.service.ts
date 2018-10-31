import { Injectable } from "@angular/core";
import * as firebase from 'firebase/app'
import { Filter } from "app/models/filter.model";
import { jsonFilter } from "app/utils";

@Injectable()
export class FipeService {
    constructor() {

    }

    public getMarcas(tipo: string): any {
        return new Promise((resolve, reject) => {
            
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

    //19

    public getModelos(idMarca: string): any {
        return new Promise((resolve, reject) => {
            
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

    public getAnos(idMarca: string, idModelo: string): any {
        return new Promise((resolve, reject) => {
            
            firebase.firestore().collection('marca')
                .doc(idMarca).collection('modelo')
                .doc(idModelo).collection('ano')
                .orderBy('nome')
                .get()
                .then((snapshot: any) => {
                    let anos: Array<any> = []
                    
                    if(typeof snapshot.ano === 'string'){
                        snapshot.ano = snapshot.ano.substring(0, 4)
                    } 
                    
                    snapshot.forEach(childsnapshot => {
                        anos.push(childsnapshot.data())
                    })

                    resolve(anos)
                })
        })
    }
}