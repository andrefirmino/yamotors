import * as firebase from 'firebase';
import { Injectable } from '@angular/core';

@Injectable()
export class firestoreSerice {

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
}