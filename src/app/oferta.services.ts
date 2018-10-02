import { Http, Response } from '@angular/http'
import { Injectable } from '@angular/core'
import { Anuncio } from './models/anuncio.model'
import { URL_API, URL_API2, URL_API3 } from './app.api'
import { Observable } from 'rxjs'

import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/retry'

@Injectable()

export class OfertasServices {

    constructor(private http: Http){
        
    }

    public getOfertas(): Promise<Anuncio[]> {
       return this.http.get(`${URL_API}?destaque=true`)
                .toPromise()
                .then((resposta: Response) => resposta.json()) 
    }

    public getOfertasPorCategoria(categoria: string): Promise<Anuncio[]>{
        return this.http.get(`${URL_API}?categoria=${categoria}`)
                .toPromise()
                .then((resposta: Response) => resposta.json())
    }

    public getOfertaPorId(id: number): Promise<Anuncio> {
        return this.http.get(`${URL_API}?id=${id}`)
                .toPromise()
                .then((resposta: Response) => {
                    return resposta.json()[0]
                })               
    }

    public getComoUsarOfertaPorId(id: number): Promise<string> {
        return this.http.get(`${URL_API2}?id=${id}`)
                .toPromise()
                .then((resposta: Response) => resposta.json()[0].descricao)
    }

    public getOndeFicaOfertaPorId(id: number): Promise<string> {
        return this.http.get(`${URL_API3}?id=${id}`)
                .toPromise()
                .then((resposta: Response) => resposta.json()[0].descricao)
    }

    public pesquisaOfertas(termo: string): Observable<Anuncio[]>{
        return this.http.get(`${URL_API}?descricao_oferta_like=${termo}`)
                .retry(10)
                .map((resposta: Response) => resposta.json())
                
    }
}