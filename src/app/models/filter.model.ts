export class Filter {
    name: string
    filterType: FilterType
    value: string|number|boolean
    constructor(name: string, type: FilterType, value: string|number|boolean) {
        this.name = name
        this.filterType = type
        this.value = value
    }
}

export enum FilterType {
    IGUAL = '==',
    MAIOR = '>',
    MENOR = '<',
    DIFERENTE = '!=',
    MAIORIGUAL = '>=',
    MENORIGUAL = '<='
}