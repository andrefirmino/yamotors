import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Progresso } from './Progresso.service';

@Injectable()
export class FirestoreService {

    constructor(
        private progresso: Progresso,
        private utilsService: UtilsService
    ) {
    }

    public getClienteFoto(foto: string): Promise<string> {

        if (foto == null) {
            foto = 'padrao.jpg'
        }

        return firebase.storage().ref()
            .child(`cliente/${foto}`)
            .getDownloadURL()
            .then((url: string) => {
                return url
            })
    }

    public getAnuncioFotoByName(foto: string, anuncioId: string): Promise<string> {

        if (foto == null) {
            return null
        }

        return firebase.storage().ref()
            .child(`anuncios/${anuncioId}/${foto}`)
            .getDownloadURL()
            .then((url: string) => {
                return url
            })
    }

    public getAnuncioFoto(foto: string) {
        if (foto == null) {
            return null
        }

        return firebase.storage().ref()
            .child(`anuncios//${foto}`)
            .getDownloadURL()
            .then((url: string) => {
                return url
            })
    }

    public postAnuncioFotos(imagens: any): any {
        let retornos = []

        return new Promise((resolve) => {
            if(!imagens){
                resolve([])
            }
            
            Array.prototype.forEach.call(imagens, file => {
                let nomeImagem = this.utilsService.getNewIdFoto()

                firebase.storage().ref()
                    .child(`anuncios/${nomeImagem}`)
                    .put(file)
                    .on(firebase.storage.TaskEvent.STATE_CHANGED,
                        //acompanhamento do progresso do upload
                        (snapshot: any) => {
                            this.progresso.status = 'andamento'
                            this.progresso.estado = snapshot
                            //console.log('snapshot capturado no on (): ', snapshot)
                        },
                        (error) => {
                            this.progresso.status = 'erro'
                            console.log(error)
                        },
                        () => {
                            //finaliza??o do processo

                            firebase.storage().ref().child(`anuncios/${nomeImagem}`).getDownloadURL()
                                .then((url) => {
                                    retornos.push(url)
                                    if (retornos.length == imagens.length) {
                                        resolve(retornos)
                                    }
                                })
                        }
                    )
            })
        })

    }

    //conferido
    public deleteFotos(fotos: any): any {
        fotos.forEach(snapshot => {
            if (snapshot !== 'padrao.jpg') {
                firebase.storage().ref()
                    .child(`anuncios/${snapshot}`)
                    .delete()
            }
        })
    }

    //conferido
    public postClienteFoto(file: any, path: any): any {
        return new Promise((resolve, reject) => {
            if (file) {
                firebase.storage().ref()
                    .child(`cliente/${path}`)
                    .put(file[0])
                    .then((data) => {
                        resolve(data)
                    })
            } else {
                resolve(false)
            }
        })
    }
}
