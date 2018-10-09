import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/Cliente.service';
import { Cliente } from '../models/cliente.model';
import { firestoreSerice } from '../services/Firestore.service';
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
    private firestoreService: firestoreSerice,
    private anuncioService: AnuncioService
  ) { }

  ngOnInit() {
    this.getUserData()
  }

  private getUserData(): void {
    //carrega os dados do cliente especifico
    this.clienteService.getCurrentClient()
      .then((result) => {
        this.cliente = result.data() as Cliente

        this.firestoreService.getClienteFoto(this.cliente.foto)
          .then((f) => {
            this.url_imagem = f
          })
      });

      //carrega os anuncios do cliente especifico
      this.anuncioService.getAnuncios()
        .then((data) => {
          console.log(data)
        })
  }

}
