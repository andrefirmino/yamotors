
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase/app';

@Injectable()
export class UtilsService {

  constructor(private http: HttpClient) { }

  //conferido
  public getCEPData(cep: string){
    return new Promise((resolve, reject) => {
        this.http.get('http://api.postmon.com.br/v1/cep/' + cep)
        .subscribe((data) => {
          resolve(data)
        })       
    })    
  }

  public getCNPJData(cnpj: string) {
    return this.http.get('http://www.receitaws.com.br/v1/cnpj/' + cnpj)
  }

  public getNewIdFoto(): any {
    return firebase.firestore().collection('foto').doc().id
  }

  //conferido
  public getFipeData(params): any {
    return new Promise((resolve) => {
      this.http.get(`http://fipeapi.appspot.com/api/1/${params.tipo}/veiculo/${params.marca}/${params.modelo}/${params.ano}.json`)
        .subscribe((data) => {
          resolve(data)
        })
    }) 
  }
}