<template>
  <div id="app">

    <b-navbar toggleable="md" type="dark" variant="info">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="/movies">My films</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item href="/">Home</b-nav-item>
          <b-nav-item href="/import">Import</b-nav-item>

          <b-nav-item-dropdown text="Actions" left>
            <b-dropdown-item href="/movies">Films</b-dropdown-item>
            <b-dropdown-item href="/personnes">Personnes</b-dropdown-item>
            <b-dropdown-item href="/nationalites">Nationalités</b-dropdown-item>
            <b-dropdown-item href="/ddurs">Disques durs</b-dropdown-item>
            <b-dropdown-item href="/genres">Genres</b-dropdown-item>
            <b-dropdown-item href="/roles">Roles</b-dropdown-item>
            <b-dropdown-item href="/types">Types</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
              <div>
                <div>
                  <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="recherche..." v-model="searchedWords" @input="checkEmpty"/>
                  <b-button size="sm" class="my-2 my-sm-0" type="button" @click="submitNavForm">Rechercher</b-button>
                </div>
                <div v-if="researchedItems.length != 0" style="position: absolute; width: 300px; border: 1px solid #DDD; border-radius: 4px; background-color: #fff;">
                  <a v-for="item in researchedItems" :href="item.basePath" class="dropdown-item">
                    <div>
                      {{ item.label }}
                    </div>
                  </a>
              </div>
            </div>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view/>
  </div>
</template>

<script>
import StatsService from './services/StatsService';

export default {
  name: 'app',
  data () {
    return {
      researchedItems: [],
      searchedWords: "",
    }
  },
  methods: {
    submitNavForm: function() {
      if (this.searchedWords.length == 0) {
        alert("veuillez remplir le champ de saisie!!!");
      } else {
        this.researchedItems = [];

        this.searchMovies();
        this.searchPersonnes();
      }
    },
    searchMovies: function() {
      StatsService.searchByMovies(this.searchedWords)
        .then(result => {
          console.log(result.data);

          result.data.forEach(item => {
            item.label = item.titre;
            item.basePath = "/" + item.itemType + "/" + item.id_film;
            this.researchedItems.push(item);
          });
        })
        .catch(error => console.log(error))
    },
    searchPersonnes: function() {
      StatsService.searchByPersonnes(this.searchedWords)
        .then(result => {
          console.log(result.data);

          result.data.forEach(item => {
            item.label = item.prenom + " " + item.nom;
            item.basePath = "/" + item.itemType + "/" + item.id_personne;
            this.researchedItems.push(item);
          });
        })
        .catch(error => console.log(error))
    },
    checkEmpty: function() {
      if (this.searchedWords.length == 0) {
        this.researchedItems = [];
      }
    },
  }
}
</script>

<style>
body {
  width: 100%;
  heigth: 100%;
  background-color: #F5F5F5;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1, h2 {
  font-weight: normal;
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #03224C;
}

.addButtonMiddle {
  transform: translate(0, 50%);
}
</style>
