
export interface ViewModelResponseInterface<T> {
    status: StatusCodeEnum | number,
    message: string,
    data: Array<T> | T | any,
    skip?: number,
    limit?: number,
    total?: number
}

export enum StatusCodeEnum {
    OK = 200 , 
    CREATED = 201 , 
    ACCEPTED = 202 , 
    NO_CONTENT= 204 , 
    MOVED_PERMANENTLY = 301 , 
    FOUND = 302 , 
    SEE_OTHER = 303 , 
    NOT_MODIFIED = 304 , 
    TEMPORATY_REDIRECT = 307 , 
    BAD_REQUEST = 400 , 
    UNAUTHORIZED = 401 , 
    FORBIDDEN = 403 , 
    NOT_FOUND = 404 , 
    METHOD_NOT_ALLOWED = 405 , 
    NOT_ACCEPTABLE = 406 , 
    PRECONDITION_FAILED = 412 , 
    UNSUPPORTED = 415 , 
    INTERNAL_SERVER_ERROR =500 , 
    NOT_IMPLEMENTED = 501
}

export class ResponseViewModel<T> {
    

    public responseView:ViewModelResponseInterface<T>; 

    constructor(view?: ViewModelResponseInterface<T>){
        this.responseView = view;
        return this;
    }

    static createError(data: any): ViewModelResponseInterface<any> {
        return {
            status: 500,
            limit: 0,
            skip: 0,
            total: 0,
            data,
            message: "Ops! Ocorreu um error com a API, tente novamente mais tarde..."
        }
    }

    static createResponse(view: ViewModelResponseInterface<any>): ViewModelResponseInterface<any> {
        return view;
    }

}


