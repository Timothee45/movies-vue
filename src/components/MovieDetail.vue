<template>
	<div>
		<h1>Détail du film {{ movie.titre }}</h1>
		<img v-if="showPicture" :src="movie.jaquette" class="profile-picture">
		<p>Date de sortie {{ convertDate(movie.annee_sortie) }}</p>
		<p>Disque dur: {{ movie.ddur }}</p>

		<h2>Les genres:</h2>
	    <b-container>
	      <b-row class="justify-content-md-center">
	        <b-col col lg="6">
	          <b-list-group>
	            <b-list-group-item href="#" v-for="genre in genres" :key="genre.id_genre" :active="genre.isChecked" @click="toggleGenre(genre.id_genre)">
	            	{{ genre.genre }}
	            </b-list-group-item>
	          </b-list-group>
	        </b-col>
	      </b-row>
	    </b-container>
	    <button class="btn btn-success" @click="addGenres" style="margin-top: 10px;">Ajouter</button>
	</div>
</template>

<script>
import MoviesService from '../services/MoviesService';
import DatesService from '../services/DatesService';
import GenresService from '../services/GenresService';

export default {
	name: "moviedetail",
	data() {
		return {
			idMovie: 0,
			movie: {},
			showPicture: true,
			genres: [],
			movieGenres: [],
		}
	},
	mounted() {
		this.getId();

		this.getAllGenres();

		this.getMovieById();

		this.getAllMovieGenres();
	},
	methods: {
	  	getId: function() {
	  		var pathArray = (this.$route.path).split("/");
		  	this.idMovie = pathArray[2];
	  	},
	  	getMovieById: function() {
	  		MoviesService.getMovieById(this.idMovie)
	  			.then(result => {
	  				console.log(result.data);

	  				this.movie = result.data[0];
	  			})
	  			.catch(error => console.log(error))
	  	},
	    getAllGenres: function () {
	      GenresService.getAllGenres()
	      	.then(response => {
	      		var myGenres = [];

	      		response.data.forEach(genre => {
	      			genre.isChecked = false;

	      			myGenres.push(genre);
	      		});

	      		this.genres = myGenres;
	      	})
	      	.catch(error => {console.log(error)})
	    },
	    getAllMovieGenres: function () {
	      MoviesService.getAllMovieGenres(this.idMovie)
	      	.then(response => {
	      		this.movieGenres = response.data;

	      		this.movieGenres.forEach(genre => {
	      			this.toggleGenre(genre.id_genre);
	      		});
	      	})
	      	.catch(error => {console.log(error)})
	    },
	    toggleGenre: function(id) {
	    	this.genres.forEach(genre => {
	    		if (genre.id_genre == id) {
	    			genre.isChecked = !genre.isChecked;
	    		}
	    	})
	    },
	    addGenres: function() {
	    	MoviesService.postMovieGenres(this.idMovie, this.genres)
	    		.then(result => console.log(result.data))
	    		.catch(error => console.log(error))
	    },
	    convertDate: function(dateString) {
	        return DatesService.convertSqlDateToBasicOne(dateString);
	    },
	}
}
</script>

<style>
.profile-picture {
	height: 300px;
}
</style>