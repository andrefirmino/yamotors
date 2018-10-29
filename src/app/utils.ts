import { Filter } from "app/models/filter.model";

export function jsonFilter(data: any[], filters: Filter[]) {
    filters.forEach((f) => {      
        data = data.filter((item) => {
            return new Function(`return ${getValue(item[f.name])} ${f.filterType} ${getValue(f.value)}`)()
        })
    })

    return data;
}

function getValue(value: any) {
    if(typeof value === 'string') {
        return `'${value}'`
    } else {
        return value
    }
}
