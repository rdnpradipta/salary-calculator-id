<template>
  <div class="container "   id="main">
    <div class="content-header">
      <h1 class="title">{{ $t("top-title") }}</h1>
      <div class="card parameter">
        <div class="card-body">
          <h5 class="card-title">Parameter</h5>

          <div class="row justify-content-end">
            <div class="col-xs-12 col-sm-4 col-md-3">
              <label>{{ $t("label.language") }}</label>
              <Toggle
                  v-model="langToggle.value"
                  v-bind="langToggle"
                  @change="onChangeLocale"
                  sync="true"></Toggle>
            </div>
          </div>

          <div class="row justify-content-around">
            <div class="col-sm-3 ">
              <p>{{ $t("label.calcType") }}</p>
            </div>
            <div class="col-sm-9 calc-type">
              <div class="form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="NETT" v-model="selectCalcType">
                <label class="form-check-label" for="inlineRadio1">{{ $t("label.calcTypeNett") }}</label>
              </div>
              <div class="form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="GROSS" v-model="selectCalcType">
                <label class="form-check-label" for="inlineRadio2">{{ $t("label.calcTypeGross") }}</label>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-3">
              <p>{{ $t("label.monthlySalary") }}</p>
            </div>
            <div class="col-sm-9">
              <div class="input-group mb-3">
                <span class="input-group-text" id="salary-label">Rp</span>
                <input type="text" v-model="salaryDisplay" class="form-control" id="salary" aria-describedby="salary-label" @focusout="formatSalary(salaryDisplay)" @focusin="unformatSalary(salaryDisplay)">
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-3">
              <p>{{ $t("label.taxPayerType") }}</p>
            </div>
            <div class="col-sm-9">
              <select v-model="taxPayerDropdownSelected" class="form-control form-control-sm form-select"
                      id="taxPayerType">
                <option v-for="object in taxPayerTypeDropdown" :value="object.value" v-bind:key="object.value"
                        :disabled="object.value==0" :selected="object.value==0">
                  {{ $t(object.text) }}
                </option>
              </select>
            </div>
          </div>
          <button @click="check" class="btn btn-primary project-color">
            Calculate
          </button>
        </div>
      </div>
    </div>
    <GeneratedTable
        v-if="generatedOnce === true"
        :key="componentKey"
        :salaryProp="salary"
        :taxPayerDropdownSelectedProp="taxPayerDropdownSelected"
        :selectCalcTypeProp="selectCalcType"
    />
  </div>
  <Notes></Notes>
  <Footer></Footer>
</template>

<script>
import GeneratedTable from "./GeneratedTable"
import Notes from "./Notes"
import Footer from "./Footer"
import Toggle from '@vueform/toggle'
import formatNumber from 'accounting-js/lib/formatNumber'
import unformat from 'accounting-js/lib/unformat.js' 

export default {
  data() {
    return {
      generatedOnce: false,
      componentKey: 0,
      salaryDisplay: 0,
      salary: 0,
      taxPayerDropdownSelected: '',
      selectCalcType: '',
      langToggle: {
        value: true,
        onLabel: '<span class="fi fi-id"></span> ID',
        offLabel: 'EN <span class="fi fi-gb"></span>',
        trueValue: 'id',
        falseValue: 'en',
      },


      taxPayerTypeDropdown: [
        {text: 'label.dropdownDefault', value: ''},
        {text: 'taxPayerTypeDropdown.personalTaxPayerNonMarried', value: '1'},
        {text: 'taxPayerTypeDropdown.personalTaxPayerMarried', value: '2'},
        {text: 'taxPayerTypeDropdown.personalTaxPayerMarried1C', value: '3'},
        {text: 'taxPayerTypeDropdown.personalTaxPayerMarried2C', value: '4'},
        {text: 'taxPayerTypeDropdown.personalTaxPayerMarried3C', value: '5'},
      ]

    }
  },
  name: "CalculatorDashboard",
  components: {
    Notes,
    Footer,
    GeneratedTable,
    Toggle,
  },

  methods: {
    formatSalary(number) {
      this.salaryDisplay = formatNumber(number);
    },
    unformatSalary(number) {
      this.salaryDisplay = unformat(number);
    },
    onChangeLocale() {
      this.$i18n.locale = this.langToggle.value
    },
    validateNull(input) {
      if (
          input == null ||
          input == "undefined" ||
          input == "null" ||
          input == ""
      )
        return false;
      else return true;
    },
    check() {
      let self = this;
      let taxPayerType = document.getElementById("taxPayerType").value;
      self.checkIfGeneratedMoreThanOnce();
      if (!self.validateNull(this.selectCalcType)) {
        alert(this.$t("label.alert.calcTypeEmpty"));
        return;
      }
      if (!self.validateNull(this.salaryDisplay)) {
        alert(this.$t("label.alert.salaryEmpty"));
        return;
      }
      if (!self.validateNull(taxPayerType)) {
        alert(this.$t("label.alert.taxTypeEmpty"));
        return;
      }


      this.salary = unformat(this.salaryDisplay);
      this.taxPayerType = taxPayerType;
      self.generateTable();
    },
    generateTable() {
      let self = this;
      self.checkIfGeneratedMoreThanOnce();
      this.generatedOnce = true;
    },
    checkIfGeneratedMoreThanOnce() {
      if (this.generatedOnce === true) this.componentKey += 1;
    },
  },
};
</script>
