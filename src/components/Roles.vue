<template>
	<div>
		<h1>Les roles:</h1>

	    <b-container>
	      <b-row class="justify-content-md-center">
	        <b-col col lg="8">
	      		<table class="table table-bordered table-striped">
					<thead>
						<tr>
							<th>N°</th>
							<th>Role</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="role, index in roles">
							<td>{{ index + 1 }}</td>
							<td>{{ role.role }}</td>
						</tr>
					</tbody>
				</table>
	        </b-col>
	      </b-row>
	    </b-container>
	</div>
</template>

<script>
import RolesService from '../services/RolesService';

export default {
	name: 'roles',
	data() {
		return {
			roles: [],
		}
	},
	mounted: function() {
		this.getAllRoles();
	},
	methods: {
		getAllRoles: function() {
			RolesService.getAllRoles()
				.then(result => {
					console.log(result.data);
					this.roles = result.data;
				})
				.catch(error => console.log(error))
		},
	},
}
</script>

<style>

</style>