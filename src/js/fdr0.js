var timeout = null;


var app = new Vue({
  el: '#app',
  data: {
    targetweight: 80,
    unit: 'kg',
    startingdoseAm: 40,
    startingdosePm: '',
    level2aFactor: 0.012,
    level3aFactor: 0.012,
    level4aFactor: 0.024
  },
  watch: {
    unit: function(newUnit, oldUnit) {
      if (newUnit == 'kg' && oldUnit == 'lb') {
        this.targetweight = this.targetweight*0.454;
        this.targetweight = Math.round(this.targetweight*10)/10;
      } else if (newUnit == 'lb' && oldUnit == 'kg') {
        this.targetweight = this.targetweight*2.205;
        this.targetweight = Math.round(this.targetweight);
      }
    }/*,
    targetweight: function(newWeight, oldWeight){
      clearTimeout(timeout);
      // Make a new timeout set to go off in 800ms
      var self = this;
      timeout = setTimeout(function () {
        self.setWeight(this.targetweight)
      }, 500);

    }*/
  },
  computed: {
    targetweightI:  {
      // getter
      get: function () {
        return this.targetweight;
      },
      // setter
      set: function (newValue) {
        clearTimeout(timeout);
        var self = this;
        timeout = setTimeout(function () {
          self.setWeight(newValue)}, 500);
        //this.setWeight(newValue);
      }
    },
    ready: function() {
      if (this.targetweight != '' && this.startingdose != '')
        return true;
      else
        return false;
    },
    level1b: function() {
      return this.formatNumber(this.level2a - 0.1);
    },
    level2a: function() {
      if (this.unit == 'kg') {
        return this.formatNumber(this.targetweight-1.0);
      } else { //lbs
        return this.formatNumber(this.targetweight-2.0);
      }
    },
    level2b: function() {
      return this.formatNumber(this.level3a-0.1);
    },
    level3a: function() {
      if (this.unit == 'kg') {
        return this.formatNumber(this.targetweight+1.5);
      } else { //lbs
        return this.formatNumber(this.targetweight+2);
      }
    },
    level3b: function() {
      return this.formatNumber(this.level4a-0.1);
    },
    level4a: function() {
      if (this.unit == 'kg') {
        return this.formatNumber(this.targetweight+2.1);
      } else { //lbs
        return this.formatNumber(this.targetweight+4);
      }
    },
    level1dose: function() {
      var total = this.startingdoseAm+this.startingdosePm;
      total = parseFloat(total);
      return this.roundTo40(total/2);
    },
    level1bid: function() {
      var total = this.startingdoseAm+this.startingdosePm;
      if (total/2 >= 120) return true;
      else return false;
    }
  },
  methods: {
    setWeight: function(newWeight) {
      if (this.unit == 'kg')
        this.targetweight = this.formatNumber(Math.round(newWeight*10)/10);
      else if (this.unit == 'lb')
        this.targetweight = this.formatNumber(Math.round(newWeight*10)/10);
    },
    formatNumber: function(number) {
      if (this.unit == "kg")
        return parseFloat(number.toFixed(1));
      else if (this.unit == 'lb')
        return parseFloat(number.toFixed(1));
    },
    nowDate: function() {
      return moment().format('MMMM Do YYYY');
    },
    roundTo40: function(v) {
      var dose = v/2;
      dose = Math.round(dose / 40) * 40;
      return dose;
    }
  }
})
