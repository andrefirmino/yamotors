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
  private marcas: any[];
  private modelos: any[];
  private anos: any[];
  private anuncios: Anuncio[]
  private filters: Filter[]

  private selectedMarca = 0;
  private selectedModelo = 0;
  private selectedAno = 0;

  private minValue: number = 0;
  private maxValue: number = 0;
  private options: Options

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

            this.getAnuncios()

          })
      })
    
    this.filters = []

  }

  private getFipeData(): void {
    this.getMarcas()
    this.getModelos()
    this.getAnos()
  }

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

    //aqui entra os demais filtros antes de buscar
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

  private getMin(): any {
    return new Promise((resolve, reject) => {
      this.anuncioAbertoService.minValue()
      .then((snapshot: any) => {
        this.minValue = (snapshot as Anuncio).preco

        resolve(true)
      })
    })
    
  }

  private getMax(): any {
    return new Promise((resolve, reject) => {
      this.anuncioAbertoService.maxValue()
        .then((snapshot: any) => {
          this.maxValue = (snapshot as Anuncio).preco

          resolve(true)
        })
      })
  }

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
}
