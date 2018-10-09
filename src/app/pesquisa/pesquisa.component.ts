import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import '../app.component.scss';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-pesquisa',
  templateUrl: './pesquisa.component.html',
  styleUrls: ['./pesquisa.component.scss']
})
export class PesquisaComponent implements OnInit {

  minValue: number = 0;
  maxValue: number = 180000;
  options: Options = {
    floor: 0,
    ceil: 180000,
    step: 5
  };

  constructor() { }

  ngOnInit() {
  }

}
