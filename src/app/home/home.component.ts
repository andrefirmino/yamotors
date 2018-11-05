import { Component, OnInit } from '@angular/core';
import { AnuncioAbertoService } from '../services/AnuncioAberto.service';
import { Anuncio } from '../models/anuncio.model';
import { ConfigService } from "../services/Config.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    constructor(
        private anuncioAbertoService: AnuncioAbertoService,
        private configService: ConfigService
    ) { }

    ngOnInit() {
        this.getImages()
        this.getMostRecently()
        this.getCheaper()
    }
    
    /*********************************** CONTROLE ANUNCIOS ***********************************/    
    private recentes: Anuncio[]
    private baratos: Anuncio[]
    
    //conferido
    private getMostRecently(): void {
        this.recentes = []
        //carrega os anuncios do cliente especifico
        this.anuncioAbertoService.getMostRecently()
            .then((result) => {
                result.forEach((an) => {
                    this.recentes.push(an as Anuncio)
                    console.log(this.recentes);
                })
            })
    }

    //conferido
    private getCheaper(): void {
        this.baratos = []
        //carrega os anuncios do cliente especifico
        this.anuncioAbertoService.getCheaper()
            .then((result) => {
                result.forEach((an) => {
                    this.baratos.push(an as Anuncio)
                })
            })
    }

    /*********************************** FIM CONTROLE ANUNCIOS ***********************************/   

    /*********************************** CONTROLE IMAGENS FIXAS ***********************************/   
    private images: {}

    //conferido
    private getImages(): void {
        this.configService.getAllConfig()
            .then((config) => {
                this.images = config.data()
            })
    }
    /*********************************** FIM CONTROLE IMAGENS FIXAS ***********************************/   

}
