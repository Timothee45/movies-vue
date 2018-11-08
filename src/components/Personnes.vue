<template>
	<div>
    <b-container>
      <b-row>
        <b-col cols="11">
          <h1>Les personnes:</h1>
        </b-col>
        <b-col cols="1">
          <button class="btn btn-success addButtonMiddle" @click="personneModal({})">+</button>
        </b-col>
      </b-row>
    </b-container>

    <div class="form-row mt-2">
      <div class="col">
        <label for="nomRecherche">Nom:</label>
        <input type="text" class="form-control" id="nomRecherche" v-model="selectedName">
      </div>

      <div class="col">
        <label for="nationality">Nationalité:</label>
        <select class="form-control" id="nationality" v-model="selectedNationalite">
          <option value="0">Tout</option>
          <option v-for="nationalite in nationalites" :value="nationalite.id_nationalite">{{ nationalite.nationalite }}</option>
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
            <th>Photo</th>
            <th>Nom</th>
            <th>Nationalité</th>
            <th>Date naissance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  			  <tr v-for="personne, index in filterPersonnes()">
            <td>{{ index + 1 }}</td>
            <th><img :src="personne.photo_profil" class="personne-vignette"></th>
            <td>
              <a :href="'/personnes/' + personne.id_personne">{{ personne.prenom + " " + personne.nom }}</a>
            </td>
            <td>{{ personne.nationalite }}</td>
            <td>{{ convertDate(personne.date_naissance) }}</td>
            <td>
              <button class="btn btn-primary" @click="personneModal(personne)">Up</button>
            </td>
          </tr>
        </tbody>
  		</table>
    </div>

    <!-- Modal Component -->
    <b-modal id="modalPersonne" title="Modifier une personne:" v-model="showModal" @ok="handleForm">
      <div>
          <label for="prenom">Prénom:</label>
          <b-form-input type="text" id="prenom" placeholder="prénom..." v-model="selectedPersonne.prenom"></b-form-input>
          <label for="nom">Prénom:</label>
          <b-form-input type="text" id="nom" placeholder="nom..." v-model="selectedPersonne.nom"></b-form-input>
          <label for="date_naissance">Date de naissance:</label>
          <b-form-input type="date" id="date_naissance" placeholder="date de naissance..." v-model="selectedPersonne.date_naissance"></b-form-input>
          <label for="nationalite">Nationalité:</label>
          <b-form-select id="nationalite" v-model="selectedPersonne.id_nationalite">
            <option v-for="nationalite in nationalites" :value="nationalite.id_nationalite">{{ nationalite.nationalite }}</option>
          </b-form-select>
          <label for="photo_profil">Photo profil:</label>
          <b-form-input type="text" id="photo_profil" placeholder="photo de profil..." v-model="selectedPersonne.photo_profil"></b-form-input>
      </div>
    </b-modal>
	</div>
</template>

<script>
import PersonnesService from '../services/PersonnesService';
import NationalitesService from '../services/NationalitesService';
import DatesService from '../services/DatesService';

export default {
  name: 'personnes',
  data () {
    return {
      personnes: [],
      nationalites: [],
      selectedPersonne: {},
      showModal: false,
      selectedName: "",
      selectedNationalite: 0,
    }
  },
  mounted: function () {
  	this.getAllPersonnes();
    this.getAllNationalites();
  },
  methods: {
    getAllPersonnes: function () {
      PersonnesService.getAllPersonnes()
      	.then(response => this.personnes = response.data)
      	.catch(error => console.log(error))
    },
    getAllNationalites: function() {
      NationalitesService.getAllNationalites()
        .then(response => this.nationalites = response.data)
        .catch(error => console.log(error))
    },
    personneModal: function(personne) {
      this.selectedPersonne = {
        id_personne: personne.id_personne,
        prenom: personne.prenom,
        nom: personne.nom,
        date_naissance: personne.date_naissance,
        id_nationalite: personne.id_nationalite,
        photo_profil: personne.photo_profil,
        nationalite: personne.nationalite,
      };

      this.openModal();
    },
    openModal: function () {
      this.showModal = true;
    },
    hideModal: function () {
      this.showModal = false;
    },
    resetSelectedPersonne: function() {
      this.selectedPersonne = {};
    },
    handleForm: function() {
      console.log(this.selectedPersonne);
      if (typeof this.selectedPersonne.id_personne !== 'undefined') {
        this.updatePersonne();
      } else {
        this.createPersonne();
      }
    },
    updatePersonne: function() {
      PersonnesService.updatePersonne(this.selectedPersonne)
        .then(response => {
          var newPersonnes = [];
          console.log(response.data);

          this.selectedPersonne.nomFinal = this.selectedPersonne.prenom + " " + this.selectedPersonne.nom;
          
          this.personnes.forEach(personne => {
            if (personne.id_personne == this.selectedPersonne.id_personne) {
              newPersonnes.push(this.selectedPersonne);
            } else {
              newPersonnes.push(personne);
            }
          });

          this.personnes = newPersonnes;

          this.resetSelectedPersonne();
        })
        .catch(error => {
          console.log(error);
          this.resetSelectedPersonne();
        })
    },
    convertDate: function(dateString) {
        return DatesService.convertSqlDateToBasicOne(dateString);
    },
    createPersonne: function() {
      PersonnesService.createPersonne(this.selectedPersonne)
        .then(response => {
          var createdPerson = response.data
          console.log(createdPerson);

          createdPerson.nomFinal = createdPerson.prenom + " " + createdPerson.nom;

          this.personnes.push(createdPerson);

          this.resetSelectedPersonne();
        })
        .catch(error => {
          console.log(error);
          this.resetSelectedPersonne();
        })
    },
    filterPersonnes: function() {
      return this.personnes.filter(personne => 
        (this.selectedName.length <= 2 || personne.nomFinal.toLowerCase().indexOf(this.selectedName) != -1) &&
        (this.selectedNationalite == 0 || personne.id_nationalite == this.selectedNationalite));
    },
    resetFilters: function() {
      this.selectedNationalite = 0;
      this.selectedName = "";
    },
  }
}
</script>

<style>
.personne-vignette {
  height: 60px;
}
</style>