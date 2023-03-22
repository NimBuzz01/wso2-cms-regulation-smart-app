import { SearchParam } from "./search-param.model";

export class Operation {
    id: any;
    name: any;
    params: SearchParam[];

    constructor( id: any,  name:any, params: SearchParam[]) {
        this.id = id;
        this.name = name;
        this.params = params;
    }

    getParams() {
        return this.params;
    }
}
