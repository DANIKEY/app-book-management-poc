<template> 
  <div>
    <div class="q-pa-md row items-start q-gutter-md">
      <div class="col-12">
        <q-btn style="background: #FF0080; color: white" label="Ajouter" @click="addBook"></q-btn>
      </div>
      <div v-for="book in filteredBooks" :key="book.id" class="col-3">
        <q-card class="my-card">
          <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
            <div class="absolute-bottom">
              <div class="text-h6">{{book.title}}</div>
              <div class="text-h6">{{book.kind_of_book}}</div>
              <div class="text-h6">{{book.price}}€</div>
              <div class="text-subtitle2">par {{ book.author}}</div>
            </div>
          </q-img>
          <q-card-actions>
            <q-btn icon="edit" flat @click="editBook(book.id)">Modifier</q-btn>
            <q-btn icon="delete" @click="deleteBook(book.id)" flat>Supprimer</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <div class="q-pa-lg flex flex-center">
        <q-pagination v-model="currentPage" color="red" :max="totalPages" :max-pages="6" boundary-numbers
          @input="affiche()" :direction-links="true">
        </q-pagination>
    </div>
    

    <q-dialog v-model="dialogLaunchRegister" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Ajouter un nouveau livre</div>
        </q-card-section>
      <form  @submit="registerBook">
        <q-card-section class="q-pt-none">
          <q-input dense label="titre" v-model="title" required/>
          <q-input dense label="auteur" v-model="author" required/>
          <q-input dense label="genre" v-model="kind_of_book" required/>
          <q-input type="number" step="0.01" dense label="prix" v-model="price" required/>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Annuler" v-close-popup />
          <q-btn flat label="Valider" type="submit" />
        </q-card-actions>
      </form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogLaunchUpdate" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Modifier le livre</div>
        </q-card-section>
      <form  @submit="updateBook">
        <q-card-section class="q-pt-none">
          <q-input dense label="titre" v-model="title" required/>
          <q-input dense label="auteur" v-model="author" required/>
          <q-input dense label="genre" v-model="kind_of_book" required/>
          <q-input type="number" step="0.01" dense label="prix" v-model="price" required/>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Annuler" v-close-popup />
          <q-btn flat label="Modifier" type="submit" />
        </q-card-actions>
      </form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogDelete" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Supprimer le livre</div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Annuler" v-close-popup />
          <q-btn flat label="Supprimer" type="submit" @click="confirmDeleteBook()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import  ApiBooks from '../services/BookService';

export default defineComponent({

  data(){
    return{
      currentPage: 1,
      postsPerPage: 6,
      books: {},
      currentBookId :'',
      dialogLaunchRegister: false,
      dialogLaunchUpdate: false,
      dialogDelete: false,
      title:'',
      author:'',
      kind_of_book: '',
      price: ''
    }
  },

  computed: {
      
    allBooks () {
    	return Object.keys(this.books).map(pid => this.books[pid])
    },
    filteredBooks () {
      return  this.allBooks.slice((this.currentPage - 1) * this.postsPerPage, this.currentPage * this.postsPerPage )
    },
    totalPages () {
      return Math.ceil(this.allBooks.length / this.postsPerPage)
    }

  },
  mounted(){
    //get data books 
    this.getAllBooks()
  },

  methods: {
    // display delete book dialog
    deleteBook(id)
    {
      this.currentBookId = id
      this.dialogDelete = true
    },

    // delete book
    confirmDeleteBook(){
      ApiBooks.deleteBookById(this.currentBookId)
      .then((response) => {
        this.dialogDelete = false
        this.getAllBooks()
        alert("Livre supprimé")
        //this.showDialog('Suppression livre','Livre supprimé')
      })
      .catch((e) => {
        this.dialogDelete = false
        //this.showDialog('Suppression livre','Erreur lors de suppresson du livre ... ')
        alert("Erreur lors de suppresson du livre ... ")
        alert(e)
      })
    },

    //get all books 
    getAllBooks(){
      ApiBooks.getBooks()
      .then((response)=> {
        //console.log(response)
        this.books = response
      })
      .catch(e => {e})

    },
    //open dialog add  book
    addBook(){
      this.dialogLaunchRegister = true
    },

    //register book
    registerBook(){
     
      let data = {
          'title' : this.title,
          'author': this.author,
          'kind_of_book' : this.kind_of_book,
          'price': this.price
        }

        ApiBooks.createBook(data).then(resp => {
           this.dialogLaunchRegister = false
           this.getAllBooks()
           alert("Livre ajouté")
           //this.showDialog('Ajout livre','Livre ajouté')
           this.title = ''
           this.author  = ''
           this.kind_of_book = ''
           this.price = ''
        }).catch(e => { 
          this.dialogLaunchRegister = false
          alert("Erreur lors de l'ajout du nouveau livre ... ")
          //this.showDialog("Ajout livre','Erreur lors de l'ajout du nouveau livre ... ")
          alert(e)
        })
    },

    // edit book dialog
    editBook(id){
      this.currentBookId = id
      ApiBooks.getBooksById(id)
      .then((response) => {
        this.title = response.title
        this.author = response.author
        this.kind_of_book = response.kind_of_book
        this.price = response.price
        this.dialogLaunchUpdate = true
      })
      .catch(e => {
        alert("Données du livre non accessible")
      })
    },
    updateBook(){
      
      const data = {
        'title' : this.title,
        'author': this.author,
        'kind_of_book' : this.kind_of_book,
        'price': this.price
      }

      ApiBooks.updateBookById(this.currentBookId,data)
      .then((response) => {
        this.dialogLaunchUpdate = false
        this.getAllBooks()
        alert("Livre modifié")
        //this.showDialog('Modification livre','Livre modifié')
        this.title = ''
        this.author  = ''
        this.kind_of_book = ''
        this.price = ''
      })
      .catch(e => {
        this.dialogLaunchUpdate = false
        alert('Erreur lors de la modification du livre ... ')
        //this.showDialog('Modification livre','Erreur lors de la modification du livre ... ')
        alert(e)
      })
    },

    showDialog(title,message) {
   
      this.$q.dialog({
        title: title,
        message: message,
       }).onOk(() => {
          // console.log('OK')
      })
    },

  },

  setup(){},
})

</script>

<style>
.my-card {
  width: 100%,
}
</style>
