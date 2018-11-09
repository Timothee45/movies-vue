<template>
  <div>
    <b-alert :show="alert.dismissCountDown"
             dismissible
             :variant="alert.status"
             @dismissed="alert.dismissCountDown=0"
             @dismiss-count-down="countDownChanged">
             {{ alert.message }}
    </b-alert>

		<h1>Importer:</h1>

    <div style="margin-bottom: 20px;"">
      <b-nav pills>
        <b-nav-item v-for="item in menus" :active="item.active" @click="swapMenu(item.id)">{{ item.label }}</b-nav-item>
      </b-nav>
    </div>

    <div v-if="menus[0].active">
      <div class="form-inline">
        <div class="form-group mb-2">
          <label for="addMovies">Importer des films:</label>
        </div>
        <div class="form-group mb-2">
          <input type="file" class="form-control-file" id="addMovies" multiple="multiple"  @change="processFiles($event)">
        </div>
      </div>

  		<table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th>N°</th>
            <th>Titre</th>
            <th>Extension</th>
            <th>Vu</th>
            <th>Type</th>
            <th>Disques durs</th>
            <th>Date creation</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  			  <tr v-for="file, index in files">
            <td>{{ index + 1 }}</td>
            <td><input class="form-control" type="text" v-model="file.name"></td>
            <td>{{ file.extension }}</td>
            <td>
              <input class="form-check-input" type="checkbox" v-model="file.seen">
            </td>
            <td>
              <select class="form-control" v-model="file.type">
                  <option v-for="type in types" :value="type.id_type">{{ type.type }}</option>
              </select>
            </td>
            <td>
              <select class="form-control" v-model="file.ddur">
                  <option v-for="ddur in ddurs" :value="ddur.id_ddur">{{ ddur.ddur }}</option>
              </select>
            </td>
            <td>{{ convertDate((new Date(file.date_c)).toISOString()) }}</td>
            <td>
              <button class="btn btn-danger" @click="removeFile(file.numFile)">X</button>
            </td>
          </tr>
        </tbody>
  		</table>
      <button class="btn btn-success" @click="submitForm" :disabled="importedFiles.length == 0">Importer</button>
    </div>

    <div v-if="menus[1].active">
      <button class="btn btn-success" @click="getEmptyMovies">Refresh</button>
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th>N°</th>
            <th>Titre</th>
            <th>Date Sortie</th>
            <th>Jaquette</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="film, index in emptyFilms">
            <td>{{ index + 1 }}</td>
            <td>
              <img class="film-vignette" :src="film.jaquette">
              {{ film.titre }}
            </td>
            <td><input class="form-control" type="text" v-model="film.annee_sortie" placeholder="yyyy-mm-jj"></td>
            <td><input class="form-control" type="text" v-model="film.jaquette"></td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-success" @click="importEmptyForm" :disabled="emptyFilms.length == 0">Importer</button>
    </div>

    <div v-if="menus[2].active">
      <button class="btn btn-success" @click="getMissingGenresMovies">Refresh</button>
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th>N°</th>
            <th>Titre</th>
            <th>Genre</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="film, index in missingGenresMovies">
            <td>{{ index + 1 }}</td>
            <td>
              <img class="film-vignette" :src="film.jaquette">
              {{ film.titre }}
            </td>
            <td>
              <select class="form-control" v-model="film.id_genre">
                <option v-for="genre in genres" :value="genre.id_genre">{{ genre.genre }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-success" @click="importWithoutGenresForm" :disabled="missingGenresMovies.length == 0">Importer</button>
    </div>
	</div>
</template>

<script>
import DdursService from '../services/DdursService';
import MoviesService from '../services/MoviesService';
import DatesService from '../services/DatesService';
import TypesService from '../services/TypesService';
import GenresService from '../services/GenresService';

export default {
  name: 'addMovies',
  data () {
    return {
      importedFiles: [],
      files: [],
      ddurs: [],
      genres: [],
      missingGenresMovies: [],
      types: [],
      defaultType: 1,
      emptyFilms: [],
      menus: [
        {
          id: "new-films",
          active: true,
          label: "Nouveaux Films",
        },{
          id: "fill-jaquette-date-film",
          active: false,
          label: "Ajout Infos",
        },{
          id: "fill-sans-genre",
          active: false,
          label: "Films sans genres",
        },
      ],
      alert: {
        message: "",
        status: "",
        dismissSecs: 3,
        dismissCountDown: 0,
        showDismissibleAlert: false,
      },
    }
  },
  mounted: function () {
    this.getAllDdurs();

    this.getAllTypes();

    this.getAllGenres();

    this.getEmptyMovies();

    this.getMissingGenresMovies();
  },
  methods: {
    getAllDdurs: function() {
      DdursService.getAllDdurs()
        .then(response => this.ddurs = response.data)
        .catch(error => console.log(error))
    },
    getAllTypes: function() {
      TypesService.getAllTypes()
        .then(response => this.types = response.data)
        .catch(error => console.log(error))
    },
    getAllGenres: function() {
      GenresService.getAllGenres()
        .then(response => this.genres = response.data)
        .catch(error => console.log(error))
    },
    getMissingGenresMovies: function() {
      MoviesService.getMissingGenresMovies(40)
        .then(response => this.missingGenresMovies = response.data)
        .catch(error => console.log(error))
    },
    processFiles: function(event) {
      console.log(event.target.files);
      this.importedFiles = [...event.target.files];
      this.formatFiles();
    },
    formatFiles: function() {
      var myNewData = [];
      var defaultDdurId = this.ddurs[0].id_ddur;
      var lastIndexPoint;
      var fileName;
      var numFile = 0;

      this.importedFiles.forEach(file => {
        fileName = file.name;
        lastIndexPoint = fileName.lastIndexOf('.');

        myNewData.push({
          fullName: fileName,
          numFile: ++numFile,
          name: fileName.substring(0, lastIndexPoint),
          extension: fileName.substring((lastIndexPoint + 1), (fileName.length + 1)),
          ddur: defaultDdurId,
          type: this.defaultType,
          date_c: file.lastModified,
          seen: 0,
        });
      });

      this.files = myNewData;
    },
    getEmptyMovies: function() {
      MoviesService.getEmptyMovies(40)
        .then(response => {
          this.emptyFilms = response.data;
        })
        .catch(error => console.log(error))
    },
    submitForm: function() {
      MoviesService.postMovies(this.files)
        .then(response => {
          console.log(response.data);
          this.showAlert(response.data.data, "success");
          this.resetFiles();
        })
        .catch(error => this.showAlert(error.data, "danger"))
    },
    resetFiles () {
      this.importedFiles = [];
      this.files = [];
    },
    countDownChanged (dismissCountDown) {
      this.alert.dismissCountDown = dismissCountDown
    },
    showAlert (message, status) {
      this.alert.message = message;
      this.alert.status = status;
      this.alert.dismissCountDown = this.alert.dismissSecs
    },
    removeFile: function(num) {
      this.files = this.files.filter(file => file.numFile != num);
    },
    convertDate: function(dateString) {
        return DatesService.convertSqlDateToBasicOne(dateString);
    },
    swapMenu: function(selectedId) {
      this.menus.forEach(item => {
        if (item.id == selectedId) {
          item.active = true;
        } else {
          item.active = false;
        }
      });
    },
    importEmptyForm: function() {
      var sendList = this.emptyFilms.filter(film => (film.jaquette !== null || film.annee_sortie !== null));

      MoviesService.postMovieJaquetteAndDateSortie(sendList)
        .then(response => {
          console.log(response);
          var filledMoviesIdList = [];

          response.data.forEach(film => {
            filledMoviesIdList.push(film.id_film)
          });

          this.emptyFilms = this.emptyFilms.filter(film => !filledMoviesIdList.includes(film.id_film));
        })
        .catch(error => console.log(error))
    },
    importWithoutGenresForm: function() {
      var sendMovies = [];

      this.missingGenresMovies.forEach(film => {
        if (film.id_genre) {
          sendMovies.push({
            "id_film": film.id_film,
            "id_genre": film.id_genre,
          });
        }
      });

      MoviesService.postMovieMissingGenres(sendMovies)
        .then(response => {
          var filledMoviesIdList = [];

          response.data.forEach(film => {
            filledMoviesIdList.push(film.id_film)
          });

          this.missingGenresMovies = this.missingGenresMovies.filter(film => !filledMoviesIdList.includes(film.id_film));
        })
        .catch(error => console.log(error))
    }
  }
}
</script>

<style>
  .film-vignette {
    height: 50px;
  }
</style>