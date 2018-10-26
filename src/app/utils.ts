import { Filter } from "app/models/filter.model";

export function jsonFilter(data: any[], filters: Filter[]) {
    filters.forEach((f) => {      
        data = data.filter((item) => {
            return new Function(`return ${item[f.name]} ${f.filterType} ${f.value}`)()
        })
    })

    return data;
}
