import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { NouiFormatter } from "ng2-nouislider/src/nouislider";
import '../app.component.scss';

@Component({
  selector: 'app-pesquisa',
  templateUrl: './pesquisa.component.html',
  styleUrls: ['./pesquisa.component.scss']
})
export class PesquisaComponent implements OnInit {

  public disabled: boolean = false;          
  public someValue: number = 5;
  public someMin: number = -10;
  public someMax: number = 10;

  constructor() { }

  ngOnInit() {
  }

}
