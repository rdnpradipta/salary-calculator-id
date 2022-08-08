<template>
  <div class="card generated-table">
    <div class="card-body">
      <h5 class="card-title">Generated Table</h5>
      <table class="table">
        <thead class="table-project">
        <tr>
          <th scope="col">{{ $t("label.description") }}</th>
          <th scope="col">{{ $t("label.value") }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in colData" :key="item.desc">
          <td>
            {{ $t(item.desc) }}
          </td>
          <td>
            {{ item.value }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {PTKP_MAP, COMMON_CONSTANT} from "../constant";

export default {
  name: "GeneratedTable",
  methods: {
    check() {
      const calcType = this.selectCalcType
      const taxType = parseInt(this.taxPayerDropdownSelected)
      const ptkp = PTKP_MAP.get(taxType)
      let monthlySalary = parseInt(this.salary);
      let annualSalary = monthlySalary*12;
      let taxableIncome;
      let totalTax = 0 
      let bpjs
      let netMonthlySalary = 0
      let titleAllowanceDisplay = 0
    
      if((annualSalary-ptkp) <= 0){
        taxableIncome = 0
      } else {
        taxableIncome = annualSalary - ptkp
      }

      if(new String(calcType).valueOf() == new String("NETT").valueOf()){
        let titleAllowance = monthlySalary * COMMON_CONSTANT.TITLE_ALLOWANCE_PERCENTAGE
        titleAllowanceDisplay = titleAllowance
        if(titleAllowance > COMMON_CONSTANT.TITLE_ALLOWANCE_THRESHOLD) {
          titleAllowance = COMMON_CONSTANT.TITLE_ALLOWANCE_THRESHOLD
        }
        
        if(taxableIncome > 0){
          taxableIncome -= (titleAllowance * 12)
        }

        this.calculateNett(taxableIncome, totalTax)

        if(this.selectBpjsCalcType == 0) {
          bpjs = 0
        } else {
          bpjs = monthlySalary*COMMON_CONSTANT.BPJS_MULTIPLIER
        }

        netMonthlySalary = monthlySalary - this.monthlyTax - bpjs
      }

      if(new String(calcType).valueOf() == new String("GROSS").valueOf()){
        if(this.selectBpjsCalcType == 0) {
          bpjs = 0
        } else {
          bpjs = monthlySalary*COMMON_CONSTANT.BPJS_GROSS_UP_MULTIPLIER
        }
        
        
        
        let monthlySalaryIncBpjs = monthlySalary + bpjs
        let titleAllowanceGrossUp = monthlySalaryIncBpjs*COMMON_CONSTANT.TITLE_ALLOWANCE_GROSS_UP_PERCENTAGE

        titleAllowanceDisplay = titleAllowanceGrossUp
        if(titleAllowanceGrossUp > COMMON_CONSTANT.TITLE_ALLOWANCE_THRESHOLD) {
          titleAllowanceGrossUp = COMMON_CONSTANT.TITLE_ALLOWANCE_THRESHOLD
          titleAllowanceDisplay = titleAllowanceGrossUp
        }

        taxableIncome += ((bpjs)*12)
        if(taxableIncome > 0){
          taxableIncome -= (titleAllowanceGrossUp * 12)
        }
          
        this.calculateGross(taxableIncome)
        netMonthlySalary = monthlySalary + this.monthlyTax + bpjs
      }

      let monthlyTax = this.totalTax / 12

      if(titleAllowanceDisplay > COMMON_CONSTANT.TITLE_ALLOWANCE_THRESHOLD) {
        titleAllowanceDisplay = COMMON_CONSTANT.TITLE_ALLOWANCE_THRESHOLD
      }

      this.colData.push({desc: "label.monthlySalary", value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR' }).format(monthlySalary)})
      this.colData.push({desc: "label.titleAllowance", value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR' }).format(titleAllowanceDisplay)})
      this.colData.push({desc: "label.bpjs", value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR' }).format(bpjs)})
      this.colData.push({desc: "label.PPh21", value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR' }).format(monthlyTax)})
      this.colData.push({desc: "label.netMonthlySalary", value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR' }).format(netMonthlySalary)})
    },

    calculateNett(taxableIncome, totalTax){
      let salaryDiff;
      if(taxableIncome <= COMMON_CONSTANT.TAX_LAYER_1_THRESHOLD){
        totalTax = (taxableIncome*COMMON_CONSTANT.TAX_LAYER_1_PERCENTAGE)
      }

      if(taxableIncome > COMMON_CONSTANT.TAX_LAYER_1_THRESHOLD && taxableIncome <= COMMON_CONSTANT.TAX_LAYER_2_THRESHOLD){
        salaryDiff = taxableIncome-COMMON_CONSTANT.TAX_LAYER_1_THRESHOLD
        totalTax = (salaryDiff*COMMON_CONSTANT.TAX_LAYER_2_PERCENTAGE) + COMMON_CONSTANT.TAX_LAYER_1_TAX_VALUE
      }

      if(taxableIncome > COMMON_CONSTANT.TAX_LAYER_2_THRESHOLD && taxableIncome <= COMMON_CONSTANT.TAX_LAYER_3_THRESHOLD){
        salaryDiff = taxableIncome - COMMON_CONSTANT.TAX_LAYER_2_THRESHOLD
        totalTax = (salaryDiff*COMMON_CONSTANT.TAX_LAYER_3_PERCENTAGE) + COMMON_CONSTANT.TAX_LAYER_2_TAX_VALUE
      }

      if(taxableIncome > COMMON_CONSTANT.TAX_LAYER_3_THRESHOLD && taxableIncome <= COMMON_CONSTANT.TAX_LAYER_4_THRESHOLD){
        salaryDiff = taxableIncome - COMMON_CONSTANT.TAX_LAYER_3_THRESHOLD
        totalTax = (salaryDiff*COMMON_CONSTANT.TAX_LAYER_4_PERCENTAGE) + COMMON_CONSTANT.TAX_LAYER_3_TAX_VALUE
      }

      if(taxableIncome > COMMON_CONSTANT.TAX_LAYER_4_THRESHOLD){
        salaryDiff = taxableIncome - COMMON_CONSTANT.TAX_LAYER_4_THRESHOLD
        totalTax = (salaryDiff*COMMON_CONSTANT.TAX_LAYER_5_PERCENTAGE) + COMMON_CONSTANT.TAX_LAYER_4_TAX_VALUE
      }

      this.totalTax = totalTax
      this.monthlyTax = this.totalTax/12
    },

    calculateGross(taxableIncome){
      if(taxableIncome <= COMMON_CONSTANT.TAX_GROSS_UP_LAYER_1_THRESHOLD){
        this.totalTax =+ taxableIncome*(5/95)
      }
      if(taxableIncome > COMMON_CONSTANT.TAX_GROSS_UP_LAYER_1_THRESHOLD && taxableIncome <= COMMON_CONSTANT.TAX_GROSS_UP_LAYER_2_THRESHOLD){
        this.totalTax =+ (taxableIncome-COMMON_CONSTANT.TAX_GROSS_UP_LAYER_1_THRESHOLD)*(15/85)+(3*1000000)
      }
      if(taxableIncome > COMMON_CONSTANT.TAX_GROSS_UP_LAYER_2_THRESHOLD && taxableIncome <= COMMON_CONSTANT.TAX_GROSS_UP_LAYER_3_THRESHOLD){
        this.totalTax =+ (taxableIncome-COMMON_CONSTANT.TAX_GROSS_UP_LAYER_2_THRESHOLD)*(25/75)+(31.5*1000000)
      }
      if(taxableIncome > COMMON_CONSTANT.TAX_GROSS_UP_LAYER_3_THRESHOLD && taxableIncome <= COMMON_CONSTANT.TAX_GROSS_UP_LAYER_4_THRESHOLD){
        this.totalTax =+ (taxableIncome-COMMON_CONSTANT.TAX_GROSS_UP_LAYER_3_THRESHOLD)*(30/70)+94*1000000
      }
      if(taxableIncome > COMMON_CONSTANT.TAX_GROSS_UP_LAYER_4_THRESHOLD){
        this.totalTax =+ (taxableIncome-COMMON_CONSTANT.TAX_GROSS_UP_LAYER_4_THRESHOLD)*(35/65)+1444*1000000
      }
      this.monthlyTax = this.totalTax/12
    },

  },
  props: ['salaryProp', 'taxPayerDropdownSelectedProp', 'selectCalcTypeProp', 'selectBpjsCalcTypeProp'],
  data() {
    return {
      salary: this.salaryProp,
      taxPayerDropdownSelected: this.taxPayerDropdownSelectedProp,
      selectCalcType: this.selectCalcTypeProp,
      selectBpjsCalcType: this.selectBpjsCalcTypeProp,
      colData: [],
      taxableIncome: 0,
      totalTax: 0,
      salaryDiff: 0,
      netMonthlySalary: 0,
      monthlyTax: 0,
    }
  },
  mounted() {
    this.check()
  },
}
</script>
