import AxiosDataService from "../services/AxiosDataService";
import  Book from "../types/Book";

//class  requests api books

class ApiBooks {

    // request api  get data books  
    async getBooks(): Promise<Book[]>{
      const req =  await AxiosDataService.getAll("books")
      const books = await req.data
      return books
    }

    // request add new book

    async createBook(data:any): Promise<Book>{
      const req = await AxiosDataService.create(data,"books")
      const book = await req.data
      return book
    }


    // request get book by id
    async getBooksById(id: any):Promise<Book>{
      const req = await AxiosDataService.get(id,"books")
      const book = await req.data
      return book
    }

    // request update book
    async updateBookById(id:any,data:any):Promise<Book>{
      const req = await AxiosDataService.update(id,data,"books")
      const book = await req.data
      return book
    }

    // request delete book
    async deleteBookById(id:any):Promise<Book>{
      const req = await AxiosDataService.delete(id,"books")
      const book = await req.data
      return book
    }
    
}

export default new ApiBooks();