<template>
	<div>
	    <b-alert :show="alert.dismissCountDown"
	             dismissible
	             :variant="alert.status"
	             @dismissed="alert.dismissCountDown=0"
	             @dismiss-count-down="countDownChanged">
	             {{ alert.message }}
	    </b-alert>
		<h1>Les films:</h1>

		<div class="form-row mt-2">
			<div class="col">
				<label for="titre">Titre:</label>
				<input type="text" class="form-control" id="titre" v-model="selectedTitle">
			</div>

			<div class="col">
				<label for="seen">Deja vu:</label>
				<select class="form-control" id="seen" v-model="selectedSeen">
					<option value="2">Tout</option>
					<option value="1">Vu</option>
					<option value="0">Pas vu</option>
				</select>
			</div>

			<div class="col">
				<label for="ddur">Disques durs:</label>
				<select class="form-control" id="ddur" v-model="selectedDdur">
					<option value="0">Tout</option>
					<option v-for="ddur in ddurs" :value="ddur.id_ddur">{{ ddur.ddur }}</option>
				</select>
			</div>

			<div class="col">
				<label for="typeMovie">Type:</label>
				<select class="form-control" id="typeMovie" v-model="selectedType">
					<option value="0">Tout</option>
					<option v-for="type in types" :value="type.id_type">{{ type.type }}</option>
				</select>
			</div>

			<div class="col">
				<label for="genre">Genre:</label>
				<select class="form-control" id="genre" v-model="selectedGenre">
					<option value="0">Tout</option>
					<option v-for="genre in genres" :value="genre.id_genre">{{ genre.genre }}</option>
				</select>
			</div>

			<div class="col">
				<button type="button" class="btn btn-warning addButtonMiddle" @click="resetFilters">Reset</button>
			</div>
		</div>

		<div class="mt-4">
			<table class="table table-bordered table-striped">
				<thead>
					<tr>
						<th>N°</th>
						<th>Jaquette</th>
						<th>Titre</th>
						<th>Disque dur</th>
						<th>Type</th>
						<th>Genre</th>
						<th>Date sortie</th>
						<th>Acteurs</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="movie, index in filterMovies()" :class="{ watched: movie.est_vu }">
						<td>
							{{ index + 1 }}
							<button type="button" class="btn btn-sm" :class="{ btnWatched: movie.est_vu }" @click="changeMovieStatus(movie.id_film)">Vu</button>
						</td>
						<td>
							<img :src="movie.jaquette" class="film-vignette">
						</td>
						<td>
							<a :href="'/movies/' + movie.id_film">{{ movie.titre }}</a>
						</td>
						<td>{{ movie.ddur }}</td>
						<td>{{ movie.type }}</td>
						<td>{{ movie.genre }}</td>
						<td>{{ convertDate(movie.annee_sortie) }}</td>
						<td>
							<div v-for="personne in personnesByMovies[movie.id_film]">
								<img class="personne-profile" :src="personne.photo_profil">
								{{ personne.prenom + " " + personne.nom }}
							</div>
						</td>
						<td>
							<button type="button" class="btn btn-primary" @click="updateMovieModal(movie)">Up</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

	    <!-- Modal Component -->
	    <b-modal id="modalMovie" title="Modifier un film:" v-model="showModal" @ok="handleForm">
	      <div>
	        <label for="titre">Titre:</label>
	        <b-form-input type="text" id="titre" placeholder="titre..." v-model="selectedMovie.titre"></b-form-input>
	        <label for="extension">Extension:</label>
	        <b-form-input type="text" id="extension" placeholder="extension..." v-model="selectedMovie.extension"></b-form-input>
		    <label for="annee_sortie">Date sortie:</label>
	        <b-form-input type="date" id="annee_sortie" placeholder="date sortie..." v-model="selectedMovie.annee_sortie"></b-form-input>
	      	<label for="typeMovie">Type:</label>
	      	<b-form-select id="typeMovie" v-model="selectedMovie.id_type">
	      		<option v-for="type in types" :value="type.id_type">{{ type.type }}</option>
	      	</b-form-select>
	      	<label for="ddur">Disque dur:</label>
	      	<b-form-select id="ddur" v-model="selectedMovie.id_ddur">
	      		<option v-for="ddur in ddurs" :value="ddur.id_ddur">{{ ddur.ddur }}</option>
	      	</b-form-select>
	 		<label for="jaquette">Jaquette:</label>
	        <b-form-input type="text" id="jaquette" placeholder="jaquette..." v-model="selectedMovie.jaquette"></b-form-input>
	      </div>
	    </b-modal>
	</div>
</template>

<script>
import MoviesService from '../services/MoviesService';
import GenresService from '../services/GenresService';
import DdursService from '../services/DdursService';
import DatesService from '../services/DatesService';
import TypesService from '../services/TypesService';

export default {
  name: 'movies',
  data () {
    return {
      selectedGenre: 0,
      selectedTitle: "",
      selectedDdur: 0,
      selectedSeen: 2,
      selectedType: 0,
      movies: [],
	  genres: [],
	  ddurs: [],
	  types: [],
	  selectedMovie: {},
	  personnesByMovies: {},
      alert: {
        message: "",
        status: "",
        dismissSecs: 3,
        dismissCountDown: 0,
        showDismissibleAlert: false,
      },
      showModal: false,
    }
  },
  mounted: function () {
  	this.getAllMovies();

  	this.getAllGenres();

  	this.getAllDdurs();

  	this.getAllTypes();

  	this.getAllPersonnesByMovies();
  },
  methods: {
    getAllMovies: function () {
      MoviesService.getAllMovies()
      	.then(response => this.movies = response.data)
      	.catch(error => console.log(error))
    },
    getAllPersonnesByMovies: function () {
      MoviesService.getAllPersonnesInMovies()
      	.then(response => this.personnesByMovies = response.data)
      	.catch(error => console.log(error))
    },
  	getAllGenres: function () {
		GenresService.getAllGenres()
			.then(response => this.genres = response.data)
			.catch(error => console.log(error))
  	},
  	getAllDdurs: function () {
		DdursService.getAllDdurs()
			.then(response => this.ddurs = response.data)
			.catch(error => console.log(error))
  	},
    getAllTypes: function() {
      TypesService.getAllTypes()
        .then(response => this.types = response.data)
        .catch(error => console.log(error))
    },
  	filterMovies: function () {
  		return this.movies.filter(movie => 
  		(this.selectedGenre == 0 || movie.id_genre == this.selectedGenre) && 
  		(this.selectedType == 0 || movie.id_type == this.selectedType) && 
  		(this.selectedDdur == 0 || movie.id_ddur == this.selectedDdur) && 
  		(this.selectedSeen == 2 || movie.est_vu == this.selectedSeen ) &&
  		(this.selectedTitle.length <= 2 || movie.titre.toLowerCase().indexOf(this.selectedTitle) != -1));
  	},
  	resetFilters: function() {
  		this.selectedGenre = 0;
  		this.selectedDdur = 0;
  		this.selectedSeen = 2;
  		this.selectedTitle = "";
  		this.selectedType = 0;
  	},
  	updateMovieModal: function(movie) {
  		console.log(movie);
  		this.selectedMovie = movie;
  		this.openModal();
  	},
  	changeMovieStatus: function (id) {
  		this.selectedMovie = {};

  		this.movies.forEach(movie => {
  			if (movie.id_film == id) {
  				this.selectedMovie.id_film = movie.id_film;
  				this.selectedMovie.est_vu = movie.est_vu == 1 ? 0 : 1;
  			}
  		});
   		MoviesService.updateMovie(this.selectedMovie)
   			.then(result => {
   				this.movies.forEach(movie => {
   					if (movie.id_film == id) {
   						movie.est_vu = this.selectedMovie.est_vu;
   					}
   				});
				this.showAlert(result.data.data, "success");
				this.resetSelectedMovie();
   			})
   			.catch(error => {
   				this.showAlert(error, "danger");
   				this.resetSelectedMovie();
   			})
  	},
  	handleForm: function() {
		MoviesService.updateMovie(this.selectedMovie)
   			.then(result => {
   				var newMovies = [];

   				this.movies.forEach(movie => {
   					if (movie.id_film == this.selectedMovie.id_film) {
   						newMovies.push(this.selectedMovie);
   					} else {
   						newMovies.push(movie);
   					}
   				});

   				this.movies = newMovies;

				this.showAlert(result.data.data, "success");
				this.resetSelectedMovie();
   			})
   			.catch(error => {
   				this.showAlert(error, "danger");
   				this.resetSelectedMovie();
   			})
  	},
  	resetSelectedMovie: function () {
  		this.selectedMovie = {};
  	},
    countDownChanged (dismissCountDown) {
      this.alert.dismissCountDown = dismissCountDown
    },
    showAlert (message, status) {
      this.alert.message = message;
      this.alert.status = status;
      this.alert.dismissCountDown = this.alert.dismissSecs
    },
    openModal: function () {
      this.showModal = true;
    },
    hideModal: function () {
      this.showModal = false;
    },
    convertDate: function(dateString) {
        return DatesService.convertSqlDateToBasicOne(dateString);
    },
  }
}
</script>

<style>
.film-vignette {
	height: 60px;
}
.personne-profile {
	height: 30px;
}
.watched {
	color: red;
}
.btnWatched {
	background-color: red;
}
</style>