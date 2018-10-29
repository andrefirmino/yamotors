import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'app/services/Cliente.service';
import { Cliente } from 'app/models/cliente.model';
import { AnuncioAbertoService } from 'app/services/AnuncioAberto.service';
import { Anuncio } from 'app/models/anuncio.model';
import { Filter, FilterType } from 'app/models/filter.model';
import { ConfigService } from 'app/services/Config.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  private cliente: Cliente = new Cliente();
  private url_imagem: string;
  private anuncios: Anuncio[] = []
  private garageImage: string

  private id: string

  constructor(
    private clienteService: ClienteService,
    private anuncioAbertoService: AnuncioAbertoService,
    private route: ActivatedRoute,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.id = params['id']

        if (this.id.length == 23) {
          this.id += '='
        }

        this.getclienteData()
        this.getImage()
      }
    })
  }

  private getclienteData(): void {
    let aux = []

    this.clienteService.getClienteById(this.id)
      .then((snapshot: any) => {
        this.cliente = snapshot as Cliente
      })

    let filters: Filter[] = [];
    filters.push(new Filter('anuncianteId', FilterType.IGUAL, this.id))

    this.anuncioAbertoService.getAnunciosAbertos(filters)
      .then((snapshot: any) => {
        snapshot.forEach(childsnapshot => {
          aux.push(childsnapshot as Anuncio)
        })
      }).then(() => {
        this.anuncios = aux
      })
  }

  private getImage(): void {
    this.configService.getConfig('garagem')
      .then((url) => {
        this.garageImage = url
      })
  }

}
