import * as firebase from 'firebase/app';
import { Injectable } from '@Angular/core';

@Injectable()
export class ConfigService {
    private collection: firebase.firestore.CollectionReference
    private document: firebase.firestore.DocumentReference

    constructor() {
        this.collection = firebase.firestore().collection('config')
        this.document = this.collection.doc('home')
    }

    public getConfig(config: string): any {
        return new Promise((resolve, reject) => {
            this.document.get()
                .then((doc: any) => {
                    resolve(doc.data()[config])
                })
        })
    }

    public getAllConfig(): any {
        return new Promise((resolve, reject) => {
            this.document.get()
                .then((doc: any) => {
                    resolve(doc)
                })
        })
    }
}