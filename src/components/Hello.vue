<template>
	<div>
		<h1>Bienvenue sur le site de gestion de films:</h1>
    <h2>Stats sur les films:</h2>
    <b-container class="mt-10">
      <b-row class="justify-content-md-center">
        <b-col col lg="8">
          <b-list-group>
            <b-list-group-item>
              <span class="title-row">Nombres Films vus:</span>
              {{ watchedMovies }} - {{ this.getPercentageSeen() }}%
            </b-list-group-item>
            <b-list-group-item>
              <span class="title-row">Nombres films non vus:</span>
              {{ notWatchedMovies }}
            </b-list-group-item>
            <b-list-group-item active>
              <span class="title-row">Total films:</span>
              {{ totalMoviesNumber }}
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </b-container>

    <b-container style="margin-top: 20px;">
      <b-row class="justify-content-md-center">
        <b-col col lg="8">
          <div role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-btn block href="#" v-b-toggle.accordion1 variant="info">
                  <h2>Les 15 derniers films ajoutés:</h2>
                </b-btn>
              </b-card-header>
              <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-list-group>
                    <b-list-group-item v-for="movie in lastMoviesAdded" :key="movie.id_film">
                      <img :src="movie.jaquette" class="movie-vignette">
                      <a :href="'/movies/' + movie.id_film">
                        <span class="title-row">
                          {{ movie.titre }}
                        </span> 
                      </a>
                      - {{ movie.ddur }}
                    </b-list-group-item>
                  </b-list-group>
                </b-card-body>
              </b-collapse>
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-btn block href="#" v-b-toggle.accordion2 variant="info">
                  <h2>Les 15 acteurs les plus présents:</h2>
                </b-btn>
              </b-card-header>
              <b-collapse id="accordion2" visible accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-list-group>
                    <b-list-group-item v-for="acteur in mostUsedActors" :key="acteur.id_personne">
                      <img :src="acteur.photo_profil" class="movie-vignette">
                      <a :href="'/personnes/' + acteur.id_personne">
                        <span class="title-row">
                          {{ acteur.prenom + " " + acteur.nom }}
                        </span>
                      </a>
                      - {{ acteur.count }}
                    </b-list-group-item>
                  </b-list-group>
                </b-card-body>
              </b-collapse>
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-btn block href="#" v-b-toggle.accordion3 variant="info">
                  <h2>Les genres les plus présents:</h2>
                </b-btn>
              </b-card-header>
              <b-collapse id="accordion3" visible accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-list-group>
                    <b-list-group-item v-for="genre in mostUsedGenres" :key="genre.id_genre">
                      <span class="title-row">{{ genre.genre }}</span> - {{ genre.count + " - " + (genre.count / maximumGenre * 100).toFixed(1) }}%
                    </b-list-group-item>
                    <b-list-group-item active>
                      <span class="title-row">Total: {{ maximumGenre }}</span>
                    </b-list-group-item>
                  </b-list-group>
                </b-card-body>
              </b-collapse>
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-btn block href="#" v-b-toggle.accordion4 variant="info">
                  <h2>Les types les plus présents:</h2>
                </b-btn>
              </b-card-header>
              <b-collapse id="accordion4" visible accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-list-group>
                    <b-list-group-item v-for="type in mostUsedTypes" :key="type.id_type">
                      <span class="title-row">{{ type.type }}</span> - {{ type.count + " - " + (type.count / totalMoviesNumber * 100).toFixed(1) }}%
                    </b-list-group-item>
                  </b-list-group>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </b-col>
      </b-row>
    </b-container>
	</div>
</template>

<script>
import StatsService from '../services/StatsService';
import MoviesService from '../services/MoviesService';

export default {
  name: 'hello',
  data () {
    return {
    	statsMovieWatched: [],
    	watchedMovies: 0,
    	notWatchedMovies: 0,
      totalMoviesNumber: 1,
      lastMoviesAdded: [],
      nbrMoviesDisplayed: 15,
      mostUsedActors: [],
      mostUsedGenres: [],
      mostUsedTypes: [],
      maximumGenre: 0,
    }
  },
  mounted: function() {
  	this.getMoviesSeenStats();

    this.getLastAddedMovies();

    this.getMostUsedActors();

    this.getMostUsedGenres();

    this.getMostUsedTypes();
  },
  methods: {
  	getMoviesSeenStats: function() {
  		StatsService.getStatsMoviesSeen()
  			.then(result => {
  				console.log(result);
  				this.statsMovieWatched = result.data;
  				this.notWatchedMovies = this.statsMovieWatched[0].count;
  				this.watchedMovies = this.statsMovieWatched[1].count;
          this.totalMoviesNumber = this.watchedMovies + this.notWatchedMovies;
  			})
  			.catch(error => console.log(error))
  	},
    getMostUsedActors: function() {
      StatsService.getMostUsedActors()
        .then(result => {
          console.log(result);
          this.mostUsedActors = result.data;
        })
        .catch(error => console.log(error))
    },
    getMostUsedTypes: function() {
      StatsService.getMostUsedTypes()
        .then(result => {
          console.log(result);
          this.mostUsedTypes = result.data;
        })
        .catch(error => console.log(error))
    },
    getMostUsedGenres: function() {
      StatsService.getMostUsedGenres()
        .then(result => {
          console.log(result);
          this.mostUsedGenres = result.data;

          this.mostUsedGenres.forEach(genre => 
            this.maximumGenre += genre.count
          );
        })
        .catch(error => console.log(error))
    },
    getLastAddedMovies: function() {
      MoviesService.getLastCreatedMovies(this.nbrMoviesDisplayed)
        .then(result => {
          this.lastMoviesAdded = result.data;
        })
        .catch(error => console.log(error))
    },
  	getPercentageSeen: function() {
  		return (( this.watchedMovies ) * 100 / ( this.watchedMovies + this.notWatchedMovies )).toFixed(1);
  	},
  },
}
</script>

<style>
  .title-row {
    font-weight: bold;
  }
  .movie-vignette {
    height: 60px;
  }
</style>