export class SearchParam {
    key: any;
    value: any;
    required: boolean;

    constructor( key: any) {
        this.key = key;
        this.required = false;
    }
}
