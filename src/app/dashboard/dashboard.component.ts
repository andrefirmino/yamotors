import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/Cliente.service';
import { Cliente } from '../models/cliente.model';
import { Anuncio } from '../models/anuncio.model';
import { AnuncioService } from '../services/Anuncio.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private cliente: Cliente;
  private url_imagem: string;
  private anuncios: Anuncio[]

  constructor(
    private clienteService: ClienteService,
    private anuncioService: AnuncioService
  ) { }

  ngOnInit() {
    this.anuncios = new Array()
    this.getUserData()
  }

  private getUserData(): void {
    //carrega os dados do cliente especifico
    this.clienteService.getCurrentClient()
      .then((result) => {
        this.cliente = result as Cliente
      })

    //carrega os anuncios do cliente especifico
    this.anuncioService.getAnuncios().then((result) => {
      result.forEach((an) => {
        this.anuncios.push(an as Anuncio)
      })
      
    }).catch((err) => {
      console.log(err)
    }).then(() => {
      console.log(this.anuncios)
    })
  }
}
