class ErrorCollector{
    constructor(){
        this.error = [];
    }

    append(message){
        this.error.push(message)
    }
    
    getAllErrors(){
        return this.error.join(" | ");
    }

    clear(){
        this.error = [];
    }
}

export default ErrorCollector;