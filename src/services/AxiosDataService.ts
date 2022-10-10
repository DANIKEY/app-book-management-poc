import { api } from "../boot/axios";

// class AxiosDataService requests axios

class AxiosDataService{
   
    // return all data  
    getAll(url: string): Promise<any>{
        return api.get(url);
    }
    
    // return data by id 
    get(id: any, url: string): Promise<any>{
       return api.get(url+"/"+id);
    }

    // add new data 
    create(data: any,url: string): Promise<any>{
        return api.post(url, data);
    }
    
    // update data 
    update(id: any, data: any, url: string): Promise<any>{
        return api.put(url+"/"+id,data);
    }

    // delete data

    delete(id: any , url: string): Promise<any>{
      return api.delete(url+"/"+id)
    }

}

export default new AxiosDataService();