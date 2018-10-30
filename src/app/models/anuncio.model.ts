
export class Opcional {
    public tipo: string
    public info: string

    constructor(){
        this.tipo = null
        this.info = null
    }
}

export class Anuncio {
    public id: string
    public titulo: string
    public descricao: string
    public preco: number
    
    public aberto: boolean

    public anuncianteId: string
    public anuncianteNome: string

    public timestamp: number 

    public idMarca: number
    public nomeMarca: string
    public tipo: string
    
    public idModelo: number
    public nomeModelo: string
    public anoComposto: string
    public ano: number
    public combustivel: string

    public opcionais: Opcional[]
    public fotos: string[]

    constructor() {
        this.titulo = null
        this.descricao = null
        this.preco = 0
        this.aberto = false
        this.anuncianteId = null
        this.anuncianteNome = null
        this.timestamp = new Date().getTime()
        this.tipo = null
        this.nomeMarca = null
        this.tipo = null
        this.idModelo = null
        this.nomeModelo = null
        this.anoComposto = null
        this.ano = NaN
        this.combustivel = null
        this.opcionais = []
        this.fotos = []
    }

}

