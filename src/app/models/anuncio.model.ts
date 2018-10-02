export class Opcional {
    public tipo: string
    public info: string

    constructor(){
        this.tipo = null
        this.info = null
    }
}

export class Fipe {
    public idMarca: number
    public nomeMarca: string
    public tipo: string
    
    public idModelo: number
    public nomeModelo: string
    
    public anoComposto: string
    public ano: number
    public combustivel: string

    constructor(){
        this.tipo = null
        this.nomeMarca = null
        this.tipo = null
        this.idModelo = null
        this.nomeModelo = null
        this.anoComposto = null
        this.ano = NaN
        this.combustivel = null
    }

}

export class Veiculo {
    public fipe = new Fipe()
    public opcionais: Opcional[]
    public preco: number
    public fotos: string[]

    contructor(){
        this.fipe = new Fipe()
        this.opcionais = [new Opcional()]
        this.preco = 0
        this.fotos = [null]
    }
}

export class Anuncio {
    public titulo: string
    public descricao: string
    public veiculo: Veiculo

    public aberto: boolean

    public anuncianteId: string
    public anuncianteNome: string

    constructor() {
        this.titulo = null
        this.descricao = null
        this.veiculo = new Veiculo()
        this.aberto = false
        this.anuncianteId = null
        this.anuncianteNome = null
    }

}