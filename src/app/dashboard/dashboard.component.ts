import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ClienteService } from '../services/Cliente.service';
import { Cliente, Contato } from '../models/cliente.model';
import { Anuncio, Opcional } from '../models/anuncio.model';
import { AnuncioService } from '../services/Anuncio.service';
import { ConfigService } from "../services/Config.service";
import { FipeService } from '../services/fipe.service';
import { Filter, FilterType } from '../models/filter.model';
import { jsonFilter } from '../utils';
import { UtilsService } from "../services/utils.service";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';
import { Progresso } from 'app/services/Progresso.service';
import { FirestoreService } from 'app/services/Firestore.service';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private clienteService: ClienteService,
    private anuncioService: AnuncioService,
    private configService: ConfigService,
    private fipeService: FipeService,
    private utilsService: UtilsService,
    private firestoreService: FirestoreService,
    private progresso: Progresso,
    private anuncService: AnuncioService
  ) { }

  ngOnInit() {
    this.anuncios = new Array()
    this.getUserData()
    this.getAnuncios()
    this.getImage()
    this.getMarcas()

    this.getTiposContato()
    this.getOpcionais()
  }

  /**************************** CONTROLE APRESENTAÇÃO PRINCIPAL ****************************/
  @ViewChild('mySwal') private mySwal: SwalComponent
  @ViewChild('swDeleteAnuncio') private swDeleteAnuncio: SwalComponent


  private cliente: Cliente
  private anuncios: Anuncio[]
  private garageImage: string
  private files: any
  private auxFoto = []
  private emailValidado: boolean = false;

  //conferido
  private getUserData(): void {
    this.clienteService.getCurrentClient()
      .then((result) => {
        this.cliente = result as Cliente
        this.emailValidado = this.clienteService.getEmailValidado()
      })
  }

  //conferido
  private getAnuncios(): void {
    let aux = []
    this.anuncioService.getAnuncios().then((result) => {
      result.forEach((an) => {
        aux.push(an as Anuncio)
      })
    }).then(() => {
      this.anuncios = aux
    })
  }

  //conferido
  private getImage(): void {
    this.configService.getConfig('garagem')
      .then((url) => {
        this.garageImage = url
      })
  }

  //conferido
  private deleteAnuncio(id: string) {
    this.swDeleteAnuncio.show()
      .then((data) => {
        if (data.value === true) {
          this.anuncioService.deleteAnuncio(id)
            .then(() => {
              this.getAnuncios()
            })
        }
      })
  }

  //conferido
  private editarAnuncio(anuncio): void {
    console.log(anuncio)
    this.progressoPublicacao = 'pendente'

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

  //conferido
  private novoAnuncio(): void {
    this.anuncio = new Anuncio()
    this.anuncio.anuncianteId = btoa(this.cliente.email)
    this.anuncio.anuncianteNome = this.cliente.nome
    this.anuncio.aberto = true
    this.anuncio.tipo = 'carros'
    this.selectedTipo = 'carros'
    this.selectedMarca = null
    this.selectedModelo = null
    this.selectedAno = null

    this.getMarcas()
    this.modelos = []
    this.anos = []

    this.progressoPublicacao = 'pendente'
  }

  public changeStatus(anuncio): void {
    this.anuncio = anuncio
    this.anuncio.aberto = !this.anuncio.aberto

    this.anuncService.persistAnuncio(this.anuncio)
      .then(() => {
        this.getAnuncios()
      })
  }

  /**************************** FIM CONTROLE APRESENTAÇÃO PRINCIPAL ****************************/


  /**************************** CONTROLE CADASTRO ANUNCIANTE ****************************/
  // dados do cliente pegam no onInit, na variavel cliente

  //referencia ao input do tipo file
  @ViewChild('logoInput')
  private logoInput: ElementRef

  private tiposContato: Array<any> = []
  private contato = new Contato()

  //conferido
  private postCliente(): void {
    if (this.files) {
      this.cliente.foto = btoa(this.cliente.email)
    }

    this.cliente.cadastroCompleto = ((this.cliente.cpf_cnpj !== null && this.cliente.cpf_cnpj !== undefined && this.cliente.cpf_cnpj !== '') &&
      this.cliente.contatos.length > 0 &&
      (this.cliente.nome !== null && this.cliente.nome !== undefined && this.cliente.nome !== '') &&
      (this.cliente.endereco.cep !== null && this.cliente.endereco.cep !== undefined && this.cliente.endereco.cep !== ''))

    this.clienteService.persistCliente(this.cliente)
      .then(() => {
        this.firestoreService.postClienteFoto(this.files, this.cliente.foto)
          .then(() => {
            this.getUserData()
            this.files = null
            this.logoInput.nativeElement.value = ""
          })
      })
  }

  //conferido
  private prepareUploadLogo(event): void {
    this.files = (<HTMLInputElement>event.target).files;

  }

  //conferido
  private getCEPData(): void {
    this.cliente.endereco.bairro = null
    this.cliente.endereco.cidade = null
    this.cliente.endereco.rua = null
    this.cliente.endereco.uf = null

    this.utilsService.getCEPData(this.cliente.endereco.cep)
      .then((snapshot: any) => {
        this.cliente.endereco.bairro = snapshot.bairro
        this.cliente.endereco.cidade = snapshot.cidade
        this.cliente.endereco.rua = snapshot.logradouro
        this.cliente.endereco.uf = snapshot.estado_info.nome
      })
  }

  //conferido
  private getTiposContato(): void {
    this.configService.getConfig('contatos')
      .then((snapshot) => {
        this.tiposContato = snapshot
      })
  }

  //conferido
  private addContato(): void {
    this.cliente.contatos.push(this.contato)

    this.contato = new Contato()
  }

  //conferido
  private deleteContato(contato): void {
    this.cliente.contatos = this.cliente.contatos.filter(f => f !== contato)
  }

  /**************************** FIM CONTROLE CADASTRO ANUNCIANTE ****************************/

  /**************************** CONTROLE CADASTRO ANUNCIO ****************************/
  private marcas: Array<any> = []
  private modelos: Array<any> = []
  private anos: Array<any> = []
  private selectedTipo = 'carros'
  private selectedMarca
  private selectedModelo
  private selectedAno
  private anuncio: Anuncio = new Anuncio()
  private dadosFipe
  private opcionais: Array<any> = []
  private opcional = new Opcional()
  private progressoPublicacao: string = 'pendente'
  private porcentagemUpload: number

  //referencia ao input do tipo file
  @ViewChild('anuncioFiles')
  private anuncioFiles: ElementRef;

  //conferido
  private getMarcas(): any {
    return new Promise((resolve) => {
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

  //conferido
  private getModelos(): any {
    return new Promise((resolve) => {
      if (this.anuncio.id == undefined) {
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

  //conferido
  private getAnos(): any {
    return new Promise((resolve) => {
      if (this.anuncio.id == undefined) {
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

  //conferido
  private prepareUpload(event): void {
    this.files = (<HTMLInputElement>event.target).files;
    let render = new FileReader();
    let aux = [];
    Array.prototype.forEach.call(this.files, file => {
      aux.push(file);
    });
    aux.forEach(element => {
      render.readAsDataURL(element);
      this.auxFoto.push(render.result);
    });
    console.log(this.auxFoto);
  }

  // ja sei o que vou fazer rsrs olha a gambi rsrs

  //Verificar
  excluiImg(ex) {
    this.files.splice(ex, 1);
    console.log(this.files);
  }

  //conferido
  private getFipe(): void {
    if (this.anuncio.id == undefined) {
      this.anuncio.ano = this.selectedAno.nome
      this.anuncio.anoComposto = this.selectedAno.codigo
    }
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

  //conferido
  private getOpcionais(): void {
    this.configService.getConfig('opcionais')
      .then((snapshot) => {
        this.opcionais = snapshot
      })
  }

  //conferido
  private adicionarOpcional(): void {
    this.anuncio.opcionais.push(this.opcional)
    this.opcional = new Opcional()
  }

  //conferido
  private deleteOpcional(opcional): any {
    this.anuncio.opcionais = this.anuncio.opcionais.filter(f => f !== opcional)
  }

  //conferido
  private postAnuncio(): void {
    this.firestoreService.postAnuncioFotos(this.files)
      .then((snapshot: any) => {
        snapshot.forEach(childsnapshot => {
          this.anuncio.fotos.push(childsnapshot)
        })

      })
      .then(() => {
        this.anuncService.persistAnuncio(this.anuncio)
          .then(() => {
            this.progresso.status = 'concluido'
            this.files = null
          })

      })

    let acompanhamentoUpload = Observable.interval(100);

    let continua = new Subject();

    continua.next(true)

    acompanhamentoUpload
      .takeUntil(continua)
      .subscribe(() => {
        this.progressoPublicacao = 'andamento'

        if (this.progresso.estado) {
          this.porcentagemUpload = Math.round((this.progresso.estado.bytesTransferred / this.progresso.estado.totalBytes) * 100)
        }
        if (this.progresso.status === 'concluido') {
          this.progressoPublicacao = 'concluido'
          continua.next(false)
        }
      })
  }

  private removeFoto(imagem): void {
    this.anuncio.fotos = this.anuncio.fotos.filter((f) => { return f !== imagem })
    console.log(this.anuncio.fotos)
  }

  /**************************** CONTROLE CADASTRO ANUNCIO ****************************/

}
