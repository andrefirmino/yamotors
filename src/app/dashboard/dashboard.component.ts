import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/Cliente.service';
import { Cliente } from '../models/cliente.model';
import { Anuncio } from '../models/anuncio.model';
import { AnuncioService } from '../services/Anuncio.service';
import { ConfigService } from "../services/Config.service";
import { FipeService } from 'app/services/fipe.service';
import { Filter, FilterType } from 'app/models/filter.model';
import { jsonFilter } from 'app/utils';

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

  private marcas: Array<any> = []
  private modelos: Array<any> = []
  private anos: Array<any> = []

  private selectedTipo
  private selectedMarca
  private selectedModelo
  private selectedAno
  private anuncio: Anuncio = new Anuncio()

  private arquivos: Array<any> = []
  private files: any

  constructor(
    private clienteService: ClienteService,
    private anuncioService: AnuncioService,
    private configService: ConfigService,
    private fipeService: FipeService
  ) { }

  ngOnInit() {
    this.anuncios = new Array()
    this.getUserData()
    this.getAnuncios()
    this.getImage()
    this.getMarcas()

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
      .then(() => {
        this.getAnuncios()
      })


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

  private getMarcas(): any {
    return new Promise((resolve, reject) => {
      this.anuncio.tipo = this.selectedTipo

      this.fipeService.getMarcas(this.selectedTipo)
        .then((snapshot: any) => {
          this.marcas = []
          snapshot.forEach(childsnapshot => {
            this.marcas.push(childsnapshot)
          })

          resolve(true)
        })

    })

  }

  private getModelos(): any {
    return new Promise((resolve, reject) => {
      if (this.anuncio.id == '') {
        this.anuncio.idMarca = this.selectedMarca.codigo
        this.anuncio.nomeMarca = this.selectedMarca.nome
      }

      this.fipeService.getModelos(this.selectedMarca.codigo.toString())
        .then((snapshot: any) => {
          this.modelos = []
          snapshot.forEach(childsnapshot => {
            this.modelos.push(childsnapshot)
          })

          resolve(true)

        })
    })

  }

  private getAnos(): any {
    return new Promise((resolve, reject) => {
      if (this.anuncio.id == '') {
        this.anuncio.idModelo = this.selectedModelo.codigo
        this.anuncio.nomeModelo = this.selectedModelo.nome
      }

      this.fipeService.getAnos(this.selectedMarca.codigo.toString(), this.selectedModelo.codigo.toString())
        .then((snapshot: any) => {
          this.anos = []
          snapshot.forEach(childsnapshot => {
            this.anos.push(childsnapshot)
          })

          resolve(true)

        })
    })

  }

  private getFipe(): void {
    this.anuncio.ano = this.selectedAno.nome
    this.anuncio.anoComposto = this.selectedAno.codigo

    //aqui vai buscar os dados da fipe
  }

  private novoAnuncio(): void {
    this.anuncio = new Anuncio()
    this.anuncio.anuncianteId = btoa(this.cliente.email)
    this.anuncio.anuncianteNome = this.cliente.nome
    this.anuncio.aberto = true
  }

  private postAnuncio(): void {
    console.log(this.anuncio)
    console.log(this.arquivos)
  }

  private editarAnuncio(anuncio): void {
    this.anuncio = anuncio

    this.selectedTipo = this.anuncio.tipo

    this.getMarcas()
      .then(() => {
        let filters: Filter[] = []
        filters.push(new Filter('codigo', FilterType.IGUAL, this.anuncio.idMarca))
        this.selectedMarca = jsonFilter(this.marcas, filters)[0]
      })
      .then(() => {
        this.getModelos()
          .then(() => {
            let filters: Filter[] = []
            filters.push(new Filter('codigo', FilterType.IGUAL, this.anuncio.idModelo))
            this.selectedModelo = jsonFilter(this.modelos, filters)[0]
          })
          .then(() => {
            this.getAnos()
              .then(() => {
                let filters: Filter[] = []
                filters.push(new Filter('codigo', FilterType.IGUAL, this.anuncio.anoComposto))
                this.selectedAno = jsonFilter(this.anos, filters)[0]
              })
          })

      })
  }


  private prepareUpload(event): void {
    this.files = (<HTMLInputElement>event.target).files;

    console.log(this.files)
  }

}
