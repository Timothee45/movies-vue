<template>
	<div>
		<div>
			<h1>Detail de {{ personne.prenom + " " + personne.nom }}</h1>

			<img v-if="showPicture" :src="personne.photo_profil" class="profile-picture">
			<div>Nationalité: {{ personne.nationalite }}</div>
			<div>Date de naissance: {{ convertDate(personne.date_naissance) }}</div>
		</div>
		<div>
			<h2>Ses films:</h2>

      <b-container class="mt-10">
        <b-row class="justify-content-md-center">
          <b-col col lg="6">
      			<b-list-group>
      				<b-list-group-item v-for="movieOfPerson in onePersonMovies" :key="movieOfPerson.id_film">
                  <img class="film-vignette" :src="movieOfPerson.jaquette">
        					<span class="separate-items">{{ movieOfPerson.titre }}</span>
      				</b-list-group-item>
      			</b-list-group>
          </b-col>
        </b-row>
      </b-container>
		</div>

		<div>
			<h2>Ajouter des films:</h2>

			<b-form inline>
  			<label class="mr-sm-3" for="new-movie">Ajouter un film</label>
        <b-form-select class="mb-4 mr-sm-4 mb-sm-0"
                     :value="null"
                     id="new-movie"
                     v-model="newMovie">
            <option v-for="movie in movies" :value="movie" :key="movie.id_film">
              {{ movie.titre }}
            </option>
        </b-form-select>
        <b-button variant="primary" @click="addMoviesToAPerson">+</b-button>
  		</b-form inline>

      <div class="mt-10">
        <b-container>
          <b-row class="justify-content-md-center">
            <b-col col lg="6">
        			<b-list-group>
        				<b-list-group-item v-for="movieToAdd in moviesToAdd" :key="movieToAdd.id_film">
                  <div class="form-inline">
                    <img class="film-vignette" :src="movieToAdd.jaquette">
                    <div class="separate-items">{{ movieToAdd.titre }}</div>
                    <div class="separate-items">
                      <select class="form-control" v-model="movieToAdd.id_role">
                        <option v-for="role in roles" :value="role.id_role" :key="role.id_role">
                          {{ role.role }}
                        </option>
                      </select>
                    </div>
                    <div class="separate-items">
                      <button class="btn btn-danger" @click="removeMovieToAdd(movieToAdd.numImport)">X</button>
                    </div>
        				  </div>
                </b-list-group-item>
        			</b-list-group>
            </b-col>
          </b-row>
        </b-container>
      </div>

			<button class="btn btn-success mt-5 mb-5" :disabled="moviesToAdd.length == 0" @click="submitAddActors">Valider</button>
		</div>
	</div>
</template>

<script>
import PersonnesService from '../services/PersonnesService';
import MoviesService from '../services/MoviesService';
import RolesService from '../services/RolesService';
import DatesService from '../services/DatesService';

export default {
  name: 'personneDetail',
  data () {
    return {
      idPersonne: 0,
      personne: {},
      onePersonMovies: [],
      movies: [],
      moviesToAdd: [],
      roles: [],
      newMovie: {},
      showPicture: true,
      numImport: 0,
      defaultActorIdRole: 1,
    }
  },
  mounted: function () {
  	this.getId();

  	this.getPersonneById();

  	this.getAllMoviesFromOnePerson();

  	this.getAllMovies();

    this.getAllRoles();
  },
  methods: {
  	getId: function() {
  		var pathArray = (this.$route.path).split("/");
	  	this.idPersonne = pathArray[2];
  	},
    getAllRoles: function() {
      RolesService.getAllRoles()
        .then(result => {
          console.log(result.data);
          this.roles = result.data;
        })
        .catch(error => console.log(error))
    },
  	getPersonneById: function() {
  		PersonnesService.getPersonneById(this.idPersonne)
  			.then(result => {
  				console.log(result);
  				this.personne = result.data[0];
  			})
  			.catch(error => console.log(error))
  	},
  	getAllMoviesFromOnePerson: function() {
  		PersonnesService.getAllMoviesOfOnePerson(this.idPersonne)
  			.then(result => {
  				console.log(result);
  				this.onePersonMovies = result.data;
  			})
  			.catch(error => console.log(error))
  	},
    getAllMovies: function () {
      MoviesService.getAllMovies()
      	.then(response => this.movies = response.data)
      	.catch(error => console.log(error))
    },
    addMoviesToAPerson: function() {
      if (Object.keys(this.newMovie).length == 0) {
        alert("Vous devez sélectionner un film.");
      } else {
        this.newMovie.numImport = ++this.numImport;
        this.newMovie.id_role = this.defaultActorIdRole;

      	this.moviesToAdd.push(this.newMovie);

      	this.newMovie = {};
      }
    },
    submitAddActors: function() {
      var newMoviesToAdd = [];

      this.moviesToAdd.forEach(movie => {
        var newMovie = {
          id_film: movie.id_film,
          id_role: movie.id_role,
        }

        newMoviesToAdd.push(newMovie);
      });

    	PersonnesService.addMoviesToAPersonne(this.idPersonne, newMoviesToAdd)
    		.then(result => {
    			console.log(result.data);
    			this.onePersonMovies = this.onePersonMovies.concat(this.moviesToAdd);
    			this.resetMoviesToAdd();
    		})
    		.catch(error => console.log(error))
    },
    resetMoviesToAdd: function() {
    	this.moviesToAdd = [];
    },
    removeMovieToAdd: function(num) {
      this.moviesToAdd = this.moviesToAdd.filter(movie => movie.numImport != num);
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
.film-vignette {
  height: 50px;
}
.separate-items {
  margin-left: 15px;
}
</style>