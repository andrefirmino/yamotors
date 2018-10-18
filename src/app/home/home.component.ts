import { Component, OnInit } from '@angular/core';
import { AnuncioAbertoService } from '../services/AnuncioAberto.service';
import { Anuncio } from '../models/anuncio.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    //constante de limite para busca de anuncios
    LIMIT: number = 3;
    private recentes: Anuncio[]
    private baratos: Anuncio[]
    

    model = {
        left: true,
        middle: false,
        right: false
    };
    constructor(
        private anuncioAbertoService: AnuncioAbertoService
    ) { }

    ngOnInit() {
        this.getMostRecently()
        this.getCheaper()
    }

    private getMostRecently(): void {
        this.recentes = []
        //carrega os anuncios do cliente especifico
        this.anuncioAbertoService.getMostRecently(this.LIMIT).then((result) => {
            result.forEach((an) => {
                this.recentes.push(an as Anuncio)
            })

        }).catch((err) => {
            console.log(err)
        }).then(() => {
            console.log(this.recentes)
        })

    }

    private getCheaper(): void {
        this.baratos = []
        //carrega os anuncios do cliente especifico
        this.anuncioAbertoService.getCheaper(this.LIMIT).then((result) => {
            result.forEach((an) => {
                this.baratos.push(an as Anuncio)
            })

        }).catch((err) => {
            console.log(err)
        }).then(() => {
            console.log(this.baratos)
        })

    }


}
