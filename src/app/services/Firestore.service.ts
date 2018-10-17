import * as firebase from 'firebase';
import { Injectable } from '@angular/core';

@Injectable()
export class FirestoreService {

    public getClienteFoto(foto: string): Promise<string> {
        
        if(foto == null){
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
        
        if(foto == null){
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
        if(foto == null){
            return null
        }

        return firebase.storage().ref()
          .child(`anuncios//${foto}`)
          .getDownloadURL()
          .then((url: string) => {
              return url
          })
    }
}