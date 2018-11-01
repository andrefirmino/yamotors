import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import '../app.component.scss';
import { Options } from 'ng5-slider';
import { FipeRealService } from 'app/services/FIpeReal.service';
import { AnuncioAbertoService } from 'app/services/AnuncioAberto.service';
import { Anuncio } from 'app/models/anuncio.model';
import { Filter, FilterType } from 'app/models/filter.model';
import { log } from 'util';

@Component({
  selector: 'app-pesquisa',
  templateUrl: './pesquisa.component.html',
  styleUrls: ['./pesquisa.component.scss']
})
export class PesquisaComponent implements OnInit {
  
  constructor(
    private fipeRealService: FipeRealService,
    private anuncioAbertoService: AnuncioAbertoService
  ) { }


  ngOnInit() {
    this.getFipeData()
    this.getMin()
      .then(() => {
        this.getMax()
          .then(() => {
            this.options = {
              step: 5,
              ceil: this.maxValue,
              floor: this.minValue
            }
            console.log(this.options)

            this.getAll()

          })
      })
    
    this.filters = []

  }

  /******************************* CONTROLE DOS FILTROS DE PESQUISA *******************************/
  private minValue: number = 0
  private maxValue: number = 0
  private selectedMarca = 0
  private selectedModelo = 0
  private selectedAno = 0
  private marcas: any[]
  private modelos: any[]
  private anos: any[]
  private filters: Filter[]
  private options: Options
  
  //conferido
  private getFipeData(): void {
    this.getMarcas()
    this.getModelos()
    this.getAnos()
  }

  //conferido
  private getMarcas(): void {
    let aux = []

    this.fipeRealService.getMarcas(this.selectedMarca, this.selectedModelo, this.selectedAno)
      .then((snapshot: any) => {
        snapshot.forEach(childsnapshot => {
          aux.push(childsnapshot)
        })
      }).then(() => {
        this.marcas = aux
      })
  }

  //conferido
  private getModelos(): void {
    let aux = []

    this.fipeRealService.getModelos(this.selectedMarca, this.selectedModelo, this.selectedAno)
      .then((snapshot: any) => {
        snapshot.forEach(childsnapshot => {
          aux.push(childsnapshot)
        })
      }).then(() => {
        this.modelos = aux
      })
  }

  //conferido
  private getAnos(): void {
    let aux = []

    this.fipeRealService.getAnos(this.selectedMarca, this.selectedModelo, this.selectedAno)
      .then((snapshot: any) => {
        snapshot.forEach(childsnapshot => {
          aux.push(childsnapshot)
        })
      }).then(() => {
        this.anos = aux
      })
  }

  //conferido
  private getMin(): any {
    return new Promise((resolve, reject) => {
      this.anuncioAbertoService.minValue()
      .then((snapshot: any) => {
        this.minValue = snapshot

        resolve(true)
      })
    })
    
  }

  //conferido
  private getMax(): any {
    return new Promise((resolve, reject) => {
      this.anuncioAbertoService.maxValue()
        .then((snapshot: any) => {
          this.maxValue = snapshot

          resolve(true)
        })
      })
  }

  //conferido
  private limparFiltros(): void {
    this.selectedAno = 0
    this.selectedMarca = 0
    this.selectedModelo = 0

    this.minValue = this.options.floor
    this.maxValue = this.options.ceil
    
    this.getFipeData()
  }

  /******************************* FIM CONTROLE DOS FILTROS DE PESQUISA *******************************/
  
  /******************************* CONTROLE DOS ANUNCIOS *******************************/
  private anuncios: Anuncio[]

  // conferido
  private getAnuncios(): void {
    let aux = []
    this.filters = []

    if (this.selectedMarca != 0){
      this.filters.push(new Filter('idMarca', FilterType.IGUAL, this.selectedMarca))
    }
    
    if (this.selectedModelo != 0){
      this.filters.push(new Filter('idModelo', FilterType.IGUAL, this.selectedModelo))
    }

    if (this.selectedAno != 0){
      this.filters.push(new Filter('ano', FilterType.IGUAL, this.selectedAno))
    }

    this.filters.push(new Filter('preco', FilterType.MAIORIGUAL, this.minValue))
    this.filters.push(new Filter('preco', FilterType.MENORIGUAL, this.maxValue))
        

    this.anuncioAbertoService.getAnunciosAbertos(this.filters)
      .then((snapshot) => {
        snapshot.forEach(childsnapshot => {
          aux.push(childsnapshot as Anuncio)
        })
      })
      .then(() => {
        this.anuncios = aux
      })
  }

  //conferido
  private getAll(): void {
    let aux = []
    this.filters = []
    
    this.anuncioAbertoService.getAnunciosAbertos(this.filters)
      .then((snapshot) => {
        snapshot.forEach(childsnapshot => {
          aux.push(childsnapshot as Anuncio)
        })
      })
      .then(() => {
        this.anuncios = aux
      })
  }

  /******************************* CONTROLE DOS ANUNCIOS *******************************/
}
