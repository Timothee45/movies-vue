<template>
	<div>
	    <b-container>
	      <b-row>
	        <b-col cols="11">
	          <h1>Les nationalités :</h1>
	        </b-col>
	        <b-col cols="1">
	          <button class="btn btn-success addButtonMiddle" @click="nationaliteModal({})">+</button>
	        </b-col>
	      </b-row>
	    </b-container>

		<div class="mt-4">
		    <b-container>
		      <b-row class="justify-content-md-center">
		        <b-col col lg="8">
		      		<table class="table table-bordered table-striped">
						<thead>
							<tr>
								<th>N°</th>
								<th>Nationalité</th>
								<th>Code</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="nationalite, index in nationalites">
								<td>{{ index + 1 }}</td>
								<td>{{ nationalite.nationalite }}</td>
								<td>{{ nationalite.code }}</td>
								<th></th>
							</tr>
						</tbody>
					</table>
		        </b-col>
		      </b-row>
		    </b-container>
	    </div>

	    <!-- Modal Component -->
	    <b-modal id="modalNationalite" title="Ajouter une nationalité:" v-model="showModal" @ok="handleForm">
	      <div>
	          <label for="nationalite">Nationalite:</label>
	          <b-form-input type="text" id="nationalite" placeholder="nationalité..." v-model="selectedNationalite.nationalite"></b-form-input>
	          <label for="code">Code:</label>
	          <b-form-input type="text" id="code" placeholder="code..." v-model="selectedNationalite.code"></b-form-input>
	      </div>
	    </b-modal>
	</div>
</template>

<script>
import NationalitesService from '../services/NationalitesService';

export default {
	name: 'nationalites',
	data() {
		return {
			nationalites: [],
			showModal: false,
			selectedNationalite: {},
		}
	},
	mounted: function() {
		this.getAllNationalites();
	},
	methods: {
		getAllNationalites: function() {
			NationalitesService.getAllNationalites()
				.then(result => {
					console.log(result.data);
					this.nationalites = result.data;
				})
				.catch(error => console.log(error))
		},
		nationaliteModal: function(nationalite) {
			this.selectedNationalite = nationalite;
			this.openModal();
		},
	    openModal: function() {
	      this.showModal = true;
	    },
	    hideModal: function() {
	      this.showModal = false;
	    },
	    handleForm: function() {
	    	NationalitesService.postNationalite(this.selectedNationalite)
	    		.then(result => {
	    			console.log(result.data);
	    			this.nationalites.push(result.data);
	    		})
	    		.catch(error => console.log(error))
	    },
	},
}
</script>

<style>

</style>