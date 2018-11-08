<template>
  <div>
  	<div>
      <b-container>
        <b-row>
          <b-col cols="11">
    		    <h1>Genres:</h1>
          </b-col>
          <b-col cols="1">
            <button type="button" class="btn btn-success addButtonMiddle" @click="updateGenreModal({})">+</button>
          </b-col>
        </b-row>
      </b-container>

      <b-container>
        <b-row class="justify-content-md-center">
          <b-col col lg="10">
            <table class="table table-striped table-bordered md-5 md-auto">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Genre</th>
                  <th>Action</th>
                </tr>
              </thead>
          		<tbody>
          			<tr v-for="genre, index in genres">
                  <td>{{ index + 1 }}</td>
                  <td>{{ genre.genre }}</td>
                  <td>
                    <button class="btn btn-primary" @click="updateGenreModal(genre)">Up</button>
                  </td>
                </tr>
          		</tbody>
            </table>
          </b-col>
        </b-row>
      </b-container>
  	</div>

    <!-- Modal Component -->
    <b-modal id="modalGenre" title="Modifier un genre:" v-model="showModal" @ok="handleForm">
      <div>
          <label for="genre">Genre:</label>
          <b-form-input type="text" id="genre" placeholder="genre..." v-model="selectedGenre.genre"></b-form-input>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
import GenresService from '../services/GenresService'

export default {
  name: 'genres',
  data () {
    return {
      genres: [],
      showModal: false,
      selectedGenre: {},
    }
  },
  mounted: function () {
  	this.getAllGenres();
  },
  methods: {
    getAllGenres: function () {
      GenresService.getAllGenres()
      	.then(response => this.genres = response.data)
      	.catch(error => {
          console.log(error);
        })
    },
    updateGenreModal: function(genre) {
      this.selectedGenre = {id_genre: genre.id_genre, genre: genre.genre};
      this.openModal();
    },
    createGenre: function() {
      GenresService.postGenre(this.selectedGenre)
        .then(response => {
          this.getAllGenres();
          this.resetSelectedGenre();
        })
        .catch(error => {
          console.log(error);
          this.resetSelectedGenre();
        })
    },
    updateGenre: function() {
      GenresService.updateGenre(this.selectedGenre)
        .then(response => {
          console.log(response.data);
          this.getAllGenres();
          this.resetSelectedGenre();
        })
        .catch(error => {
          console.log(error);
          this.resetSelectedGenre();
        })
    },
    openModal: function () {
      this.showModal = true;
    },
    hideModal: function () {
      this.showModal = false;
    },
    resetSelectedGenre() {
      this.selectedGenre = {};
    },
    handleForm: function (evt) {
      console.log(this.selectedGenre);
      if (!this.selectedGenre.genre) {
        evt.preventDefault();
        alert("Veuillez saisir un genre");
      } else {
        if (typeof this.selectedGenre.id_genre !== 'undefined') {
          this.updateGenre();
        } else {
          this.createGenre();
        }
      }
    }
  }
}
</script>

<style>

</style>