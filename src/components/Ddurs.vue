<template>
	<div>
    <b-container>
      <b-row>
        <b-col cols="11">
          <h1>Disques durs:</h1>
        </b-col>
        <b-col cols="1">
          <button type="button" class="btn btn-success addButtonMiddle" @click="ddurModal({})">+</button>
        </b-col>
      </b-row>
    </b-container>

    <b-container>
      <b-row class="justify-content-md-center">
        <b-col col lg="10">
      		<table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>N°</th>
                <th>Disque dur</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
      			  <tr v-for="ddur, index in ddurs">
                <td>{{ index + 1 }}</td>
                <td>{{ ddur.ddur }}</td>
                <td>
                  <button class="btn btn-primary" @click="ddurModal(ddur)">Up</button>
                </td>
              </tr>
            </tbody>
      		</table>
        </b-col>
      </b-row>
    </b-container>

    <!-- Modal Component -->
    <b-modal id="modalGenre" title="Modifier un ddur:" v-model="showModal" @ok="handleForm">
      <div>
          <label for="ddur">Disque dur :</label>
          <b-form-input type="text" id="ddur" placeholder="disque dur..." v-model="selectedDdur.ddur"></b-form-input>
      </div>
    </b-modal>
	</div>
</template>

<script>
import DdursService from '../services/DdursService'

export default {
  name: 'ddurs',
  data () {
    return {
      ddurs: [],
      showModal: false,
      selectedDdur: {},
    }
  },
  mounted: function () {
    this.getAllDdurs();
  },
  methods: {
    getAllDdurs: function () {
      DdursService.getAllDdurs()
      	.then(response => this.ddurs = response.data)
      	.catch(error => console.log(error))
    },
    ddurModal: function(ddur) {
      this.selectedDdur = {id_ddur: ddur.id_ddur, ddur: ddur.ddur};
      this.openModal();
    },
    openModal: function () {
      this.showModal = true;
    },
    hideModal: function () {
      this.showModal = false;
    },
    handleForm: function() {
      if (typeof this.selectedDdur.id_ddur !== 'undefined') {
        this.updateDdur();
      } else {
        this.insertDdur();
      }
    },
    updateDdur: function() {
      DdursService.updateDdur(this.selectedDdur)
        .then(result => {
          var newDdurs = [];
          this.ddurs.forEach(ddur => {
            if (ddur.id_ddur == this.selectedDdur.id_ddur) {
              newDdurs.push(this.selectedDdur);
            } else {
              newDdurs.push(ddur);
            }
          });
          this.ddurs = newDdurs;
          this.resetSelectedDdur();
        })
        .catch(error => console.log(error))
    },
    insertDdur: function() {
      DdursService.insertDdur(this.selectedDdur)
        .then(result => {
          this.ddurs.push(result.data);
          this.resetSelectedDdur();
        })
        .catch(error => console.log(error))
    },
    resetSelectedDdur: function() {
      this.selectedDdur = {};
    },
  }
}
</script>

<style>

</style>