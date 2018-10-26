import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import '../app.component.scss';
import { Options } from 'ng5-slider';
import { FipeRealService } from 'app/services/FIpeReal.service';
import { AnuncioAbertoService } from 'app/services/AnuncioAberto.service';
import { Anuncio } from 'app/models/anuncio.model';
import { Filter } from 'app/models/filter.model';

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

  minValue: number = 0;
  maxValue: number = 1000000;
  options: Options = {
    floor: 0,
    ceil: 1000000,
    step: 5
  };

  constructor(
    private fipeRealService: FipeRealService,
    private anuncioAbertoService: AnuncioAbertoService
  ) { }

  ngOnInit() {
    this.getFipeData()
    this.getAnuncios()

    this.filters = []
  }

  private getFipeData(): void {
    this.getMarcas()
    this.getModelos()
    this.getAnos()
  }

  private getMarcas(): void {
    this.marcas = []

    this.fipeRealService.getMarcas(this.selectedMarca, this.selectedModelo, this.selectedAno)
      .then((snapshot: any) => {
        snapshot.forEach(childsnapshot => {
          this.marcas.push(childsnapshot)
        })
      })
  }

  private getModelos(): void {
    this.modelos = []

    this.fipeRealService.getModelos(this.selectedMarca, this.selectedModelo, this.selectedAno)
      .then((snapshot: any) => {
        snapshot.forEach(childsnapshot => {
          this.modelos.push(childsnapshot)
        })
      })
  }
  private getAnos(): void {
    this.anos = []

    this.fipeRealService.getAnos(this.selectedMarca, this.selectedModelo, this.selectedAno)
      .then((snapshot: any) => {
        snapshot.forEach(childsnapshot => {
          this.anos.push(childsnapshot)
        })
      })
  }

  private getAnuncios(): void {
    
    this.anuncios = []
    this.filters = []

    if (this.selectedMarca != 0){
      this.filters.push(new Filter('idMarca', '==', this.selectedMarca))
    }
    
    if (this.selectedModelo != 0){
      this.filters.push(new Filter('idModelo', '==', this.selectedModelo))
    }

    if (this.selectedAno != 0){
      this.filters.push(new Filter('ano', '==', this.selectedAno))
    }

    //aqui entra o filtro de preços
    this.filters.push(new Filter('preco', '>=', 30000))
    this.filters.push(new Filter('preco', '<=', 50000))
        

    this.anuncioAbertoService.getAnunciosAbertos(this.filters)
      .then((snapshot) => {
        snapshot.forEach(childsnapshot => {
          this.anuncios.push(childsnapshot as Anuncio)
        })
      }).then((result) => {
        console.log(this.anuncios)
      });
  }
}
