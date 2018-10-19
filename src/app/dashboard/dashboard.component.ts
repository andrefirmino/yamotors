import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/Cliente.service';
import { Cliente } from '../models/cliente.model';
import { Anuncio } from '../models/anuncio.model';
import { AnuncioService } from '../services/Anuncio.service';
import { ConfigService } from "../services/Config.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private cliente: Cliente;
  private url_imagem: string;
  private anuncios: Anuncio[]
  private garageImage: string

  constructor(
    private clienteService: ClienteService,
    private anuncioService: AnuncioService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.anuncios = new Array()
    this.getUserData()
    this.getAnuncios()
    this.getImage()

  }

  private getUserData(): void {
    //carrega os dados do cliente especifico
    this.clienteService.getCurrentClient()
      .then((result) => {
        this.cliente = result as Cliente
      })
  }

  private getAnuncios(): void {

     this.anuncios = []
    //carrega os anuncios do cliente especifico
    this.anuncioService.getAnuncios().then((result) => {
      result.forEach((an) => {
        this.anuncios.push(an as Anuncio)
      })

    }).catch((err) => {
      console.log(err)
    })
  }

  private deleteAnuncio(id: string) {
    this.anuncioService.deleteAnuncio(id)

    this.getAnuncios()
  }

  private mock(): void {
    this.anuncioService.mockAnuncio()
    this.getAnuncios()
  }

  private getImage(): void {
    this.configService.getConfig('garagem')
      .then((url) => {
        this.garageImage = url
      })
  }
}
