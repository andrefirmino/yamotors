import { Component, OnInit } from '@angular/core';
import { AnuncioAbertoService } from 'app/services/AnuncioAberto.service';
import { ActivatedRoute } from '@angular/router';
import { AnuncioService } from 'app/services/Anuncio.service';
import { Anuncio } from 'app/models/anuncio.model';
import { Filter, FilterType } from 'app/models/filter.model';
import { Cliente } from 'app/models/cliente.model';
import { ClienteService } from 'app/services/Cliente.service';
import { UtilsService } from 'app/services/utils.service';

@Component({
  selector: 'app-anuncio',
  templateUrl: './anuncio.component.html',
  styleUrls: ['./anuncio.component.scss']
})
export class AnuncioComponent implements OnInit {

  constructor(
    private anuncioAbertoService: AnuncioAbertoService,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.id = params['id']
        this.getAnuncio()
      }
    })
  }

  /************************************ CONTROLE DOS DADOS ************************************/
  private id
  private anuncio: Anuncio = new Anuncio()
  private cliente: Cliente = new Cliente()
  private dadpsFipe

  private getAnuncio(): void {

    let filters: Filter[] = []

    filters.push(new Filter('id', FilterType.IGUAL, this.id))

    this.anuncioAbertoService.getAnunciosAbertos(filters)
      .then((snapshot: any) => {
        snapshot.forEach(snapshotchild => {
          this.anuncio = snapshotchild as Anuncio
          this.clienteService.getClienteById(this.anuncio.anuncianteId)
            .then((snapshot) => {
              this.cliente = snapshot

              let params = {
                tipo: this.anuncio.tipo,
                marca: this.anuncio.idMarca,
                modelo: this.anuncio.idModelo,
                ano: this.anuncio.anoComposto
              }
          
              this.utilsService.getFipeData(params)
                .then((data) => {
                  this.dadosFipe = data
                  console.log(this.dadosFipe)
                })
            }
            })
        })
      })
  }

  /************************************ CONTROLE DOS DADOS ************************************/
}
