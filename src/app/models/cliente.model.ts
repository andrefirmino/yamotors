
export class Endereco {
    public uf: string;
    public cidade: string;
    public bairro: string;
    public rua: string;
    public numero: number;
    public cep: string;
    public complemento: string;

    constructor() {
        this.uf = null;
        this.cidade = null;
        this.bairro = null;
        this.rua = null;
        this.numero = NaN;
        this.cep = null;
        this.complemento = null;
    }
}

export class Contato {
    public tipo: string;
    public info: string;

    constructor(){
        this.tipo = null;
        this.info = null;
    }
}

export class Cliente {
    public cpf_cnpj: string;
    public nome: string;
    public endereco: Endereco;
    public contatos: Contato[];
    public email: string;
    public foto: string;
    public descricao: string;
    public timestamp: number;
    public cadastroCompleto: boolean
    public urlFoto: string

    constructor(){
        this.email = null;
        this.nome = null;
        this.endereco = new Endereco();
        this.contatos = []
        this.email = null;
        this.foto = null;
        this.descricao = null;
        this.timestamp = new Date().getTime();
        this.cadastroCompleto = false
        this.urlFoto = null
    }
}

