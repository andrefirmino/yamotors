import { Component, OnInit } from '@angular/core';
import { AnuncioAbertoService } from 'app/services/AnuncioAberto.service';
import { ActivatedRoute } from '@angular/router';
import { AnuncioService } from 'app/services/Anuncio.service';
import { Anuncio } from 'app/models/anuncio.model';
import { Filter, FilterType } from 'app/models/filter.model';

@Component({
  selector: 'app-anuncio',
  templateUrl: './anuncio.component.html',
  styleUrls: ['./anuncio.component.scss']
})
export class AnuncioComponent implements OnInit {

  private id: string
  private anuncio: Anuncio = new Anuncio()

  constructor(
    private anuncioAbertoService: AnuncioAbertoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.id = params['id']
        this.getAnuncio()
      }
    })
  }

  private getAnuncio(): void {

    let filters: Filter[] = []

    filters.push(new Filter('id', FilterType.IGUAL, this.id))

    this.anuncioAbertoService.getAnunciosAbertos(filters)
      .then((snapshot: any) => {
        snapshot.forEach(snapshotchild => {
          this.anuncio = snapshotchild as Anuncio
        })
      })
  }
}
