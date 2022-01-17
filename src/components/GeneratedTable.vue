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
      const monthlySalary = parseInt(this.salary);
      const annualSalary = parseInt(this.salary)*12;
      const taxType = parseInt(this.taxPayerDropdownSelected)
      const ptkp = PTKP_MAP.get(taxType)
      let taxableIncome;

      if((annualSalary-ptkp) < 0){
        taxableIncome = 0
      } else {
        taxableIncome = annualSalary - ptkp
      }

      let totalTax = 0
      let salaryDiff = 0
      let bpjsJHT
      let bpjsJP
      let bpjsKes
      let netMonthlySalary = 0

      if(new String(calcType).valueOf() == new String("NETT").valueOf()){
        this.calculateNett(taxableIncome, totalTax, salaryDiff)
        bpjsJHT = monthlySalary*COMMON_CONSTANT.BPJS_JHT_MULTIPLIER
        bpjsJP = monthlySalary*COMMON_CONSTANT.BPJS_JP_MULTIPLIER
        bpjsKes = monthlySalary*COMMON_CONSTANT.BPJS_KES_MULTIPLIER
        netMonthlySalary = monthlySalary - this.monthlyTax - bpjsJHT - bpjsJP - bpjsKes
      }
      if(new String(calcType).valueOf() == new String("GROSS").valueOf()){
        this.calculateGross(taxableIncome, totalTax)
        bpjsJHT = monthlySalary*COMMON_CONSTANT.BPJS_JHT_GROSS_UP_MULTIPLIER
        bpjsJP = monthlySalary*COMMON_CONSTANT.BPJS_JP_GROSS_UP_MULTIPLIER
        bpjsKes = monthlySalary*COMMON_CONSTANT.BPJS_KES_GROSS_UP_MULTIPLIER
        console.log("bpjs MULT CHECK : "+COMMON_CONSTANT.BPJS_JHT_GROSS_UP_MULTIPLIER)
        console.log("bpjs value: "+new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(bpjsJHT))
        netMonthlySalary = monthlySalary + this.monthlyTax + bpjsJHT + bpjsJP + bpjsKes
      }

      let monthlyTax = this.totalTax / 12

      this.colData.push({desc: "label.monthlySalary", value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(monthlySalary)})
      this.colData.push({desc: "label.bpjsJHT", value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(bpjsJHT)})
      this.colData.push({desc: "label.bpjsJP", value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(bpjsJP)})
      this.colData.push({desc: "label.bpjsKes", value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(bpjsKes)})
      this.colData.push({desc: "label.PPh21", value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(monthlyTax)})
      this.colData.push({desc: "label.netMonthlySalary", value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(netMonthlySalary)})
    },
    calculateNett(taxableIncome, totalTax, salaryDiff){
      console.log("MASUK NETT")
      if(taxableIncome <= COMMON_CONSTANT.TAX_LAYER_1_THRESHOLD){
        totalTax = totalTax + (taxableIncome*COMMON_CONSTANT.TAX_LAYER_1_PERCENTAGE)
      }
      if(taxableIncome > COMMON_CONSTANT.TAX_LAYER_1_THRESHOLD && taxableIncome <= COMMON_CONSTANT.TAX_LAYER_2_THRESHOLD){
        salaryDiff = taxableIncome-COMMON_CONSTANT.TAX_LAYER_1_THRESHOLD
        totalTax = totalTax + (salaryDiff*COMMON_CONSTANT.TAX_LAYER_2_PERCENTAGE) + COMMON_CONSTANT.TAX_LAYER_1_TAX_VALUE
      }
      if(taxableIncome > COMMON_CONSTANT.TAX_LAYER_2_THRESHOLD && taxableIncome <= COMMON_CONSTANT.TAX_LAYER_3_THRESHOLD){
        salaryDiff = taxableIncome-COMMON_CONSTANT.TAX_LAYER_1_THRESHOLD-COMMON_CONSTANT.TAX_LAYER_2_THRESHOLD
        totalTax = totalTax + (salaryDiff*COMMON_CONSTANT.TAX_LAYER_3_PERCENTAGE) + COMMON_CONSTANT.TAX_LAYER_1_TAX_VALUE
            + COMMON_CONSTANT.TAX_LAYER_2_TAX_VALUE
      }
      if(taxableIncome > COMMON_CONSTANT.TAX_LAYER_3_THRESHOLD){
        salaryDiff = taxableIncome-COMMON_CONSTANT.TAX_LAYER_1_THRESHOLD-COMMON_CONSTANT.TAX_LAYER_2_THRESHOLD-COMMON_CONSTANT.TAX_LAYER_3_THRESHOLD
        totalTax = totalTax + (salaryDiff*COMMON_CONSTANT.TAX_LAYER_3_PERCENTAGE) + COMMON_CONSTANT.TAX_LAYER_1_TAX_VALUE
            + COMMON_CONSTANT.TAX_LAYER_2_TAX_VALUE + COMMON_CONSTANT.TAX_LAYER_3_TAX_VALUE
      }

      this.totalTax = totalTax
      this.monthlyTax = this.totalTax/12
      console.log(new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(taxableIncome))
      console.log(new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(salaryDiff))
      console.log(new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalTax))
    },
    calculateGross(taxableIncome, totalTax){
      if(taxableIncome > 0 && taxableIncome <= COMMON_CONSTANT.TAX_GROSS_UP_LAYER_1_THRESHOLD){
        this.totalTax =+ taxableIncome*(5/95)
      }
      if(taxableIncome > COMMON_CONSTANT.TAX_GROSS_UP_LAYER_1_THRESHOLD && taxableIncome <= COMMON_CONSTANT.TAX_GROSS_UP_LAYER_2_THRESHOLD){
        this.totalTax =+ (taxableIncome-COMMON_CONSTANT.TAX_GROSS_UP_LAYER_1_THRESHOLD)*(15/85)+2500000
      }
      if(taxableIncome > COMMON_CONSTANT.TAX_LAYER_2_THRESHOLD && taxableIncome <= COMMON_CONSTANT.TAX_LAYER_3_THRESHOLD){
        this.totalTax =+ (taxableIncome-COMMON_CONSTANT.TAX_GROSS_UP_LAYER_2_THRESHOLD)*(25/75)+32500000
      }
      if(taxableIncome > COMMON_CONSTANT.TAX_LAYER_3_THRESHOLD){
        this.totalTax =+ (taxableIncome-COMMON_CONSTANT.TAX_GROSS_UP_LAYER_3_THRESHOLD)*(30/70)+95000000
      }
      this.monthlyTax = this.totalTax/12
    },
  },
  props: ['salaryProp', 'taxPayerDropdownSelectedProp', 'selectCalcTypeProp'],
  data() {
    return {
      salary: this.salaryProp,
      taxPayerDropdownSelected: this.taxPayerDropdownSelectedProp,
      selectCalcType: this.selectCalcTypeProp,
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
