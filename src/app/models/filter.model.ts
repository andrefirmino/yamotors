import * as firebase from 'firebase';

export class Filter {
    name: string
    type: string
    value: string|number
    constructor(name: string, type: string, value: string|number) {
        this.name = name
        this.type = type
        this.value = value
    }
}