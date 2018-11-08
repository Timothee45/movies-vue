<template>
	<div>
		<h1>Les types:</h1>

		<b-container>
			<b-row class="justify-content-md-center">
			  <b-col col lg="8">
			    <table class="table table-striped table-bordered md-5 md-auto">
			      <thead>
			        <tr>
			          <th>N°</th>
			          <th>Type</th>
			        </tr>
			      </thead>
			  		<tbody>
				  		<tr v-for="type, index in types">
				          <td>{{ index + 1 }}</td>
				          <td>{{ type.type }}</td>
				        </tr>
			  		</tbody>
			    </table>
			  </b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
import TypesService from '../services/TypesService';

export default {
	name: "types",
	data() {
		return {
			types: [],
		}
	},
	mounted() {
		this.getAllTypes();
	},
	methods: {
		getAllTypes: function() {
			TypesService.getAllTypes()
				.then(result => {
					console.log(result.data);
					this.types = result.data;
				})
				.catch(error => console.log(error))
		},
	}
}
</script>

<style>

</style>