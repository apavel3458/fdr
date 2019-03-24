var timeout = null;


var app = new Vue({
  el: '#app',
  data: {
    patientName: '',
    targetweight: 80,
    unit: 'kg',
    startingdoseAm: 40,
    startingdosePm: '',
    level1bid: false,
    //level2bid: false,  computed
    level3bid: false,
    level4bid: false,
    level4metolazone: false,
    dangerInstruction: 'call the heart failure clinic at 519-663-3428',
    display: 'fdr',
    firstDisplayChange: true,
    wRows: 30,
    wCurrentRowHighlighted: false
  },
  created: function() {
    this.translate();
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
    },
    level4metolazone: function(newVal, oldVal) {
      if (newVal == true && oldVal == false)
        alert("Recommend prescribing 2.5mg of metolazone.");
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
    startingdoseAmI:  {
      // getter
      get: function () {
        return this.startingdoseAm;
      },
      // setter
      set: function (newValue) {
        clearTimeout(timeout);
        var self = this;
        timeout = setTimeout(function () {
          self.startingdoseAm=newValue}, 300);
        //this.setWeight(newValue);
      }
    },
    startingdosePmI:  {
      // getter
      get: function () {
        return this.startingdosePm;
      },
      // setter
      set: function (newValue) {
        clearTimeout(timeout);
        var self = this;
        timeout = setTimeout(function () {
          self.startingdosePm = newValue}, 300);
        //this.setWeight(newValue);
      }
    },
    level2bid: function() {
      if (this.startingdoseAm != '' && this.startingdosePm != '')
        return true;
      return false;
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
      total = parseInt(total);
      if (total < 160) {
          this.level1bid = false;
          return this.roundTo40(total/2);
      } else if (total >= 160 && total < 240) {
            this.level1bid = false;
            return this.roundTo40(total/2);
      } else if (total >= 240) {
            this.level1bid = true;
            return this.roundTo40(total/3); //bc bid
      }
    },
    level2dose: function() {
      return this.startingdoseAm + this.startingdosePm;
    },
    level3dose: function() {
      var total = this.startingdoseAm + this.startingdosePm;
      total = parseInt(total);

      this.level3bid = this.level2bid;
      if (total == 0) {
        this.level3bid = false;
        return 20;
      } else if (total <= 40) {
        if (this.level3bid)
          return this.roundTo40(total);
        else
          return this.roundTo40(total*2);
      } else if (total <= 80) {
          this.level3bid = true;
          return 80;
      } else if (total <= 160) {
          this.level3bid = true;
          return 120;
      } else if (total <= 240) {
          this.level3bid = true;
          return 160; //max
      } else if (total > 240) {
          alert("Lasix dose is too high, recommend making a custom regimen");
          this.startingdoseAm = '';
          this.startingdosePm = '';
      } else {

      }
    },
    level4dose: function() {
      total = this.startingdoseAm + this.startingdosePm;
      this.level4bid = true;
      this.level4metolazone = false;
      if (total == 0) {
          this.level4bid = false;
          return 40;
      } else if (total <= 20) {
          this.level4bid = false;
          return 80;
      } else if (total <= 40) {
          return this.roundTo40((total*4)/2);
      } else if (total <= 80) {
          return this.roundTo40((total*1.5));
      } else if (total < 100) {
          return 120;
      } else if (total <= 160) {
          return 160;
      } else if (total > 160) {
          //alert("Recommend prescribing 2.5mg of metolazone.");
          this.level4metolazone = true;
          return 160;
      }
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
      var dose = Math.floor(v / 40) * 40;
      return dose;
    },
    numberOfTablets: function(dose) {
      var tablets = dose/40;
      if (tablets.toFixed(0) == '0') {
        return null;
      } else if (tablets <= 1) {
        return tablets + ' tablet';
      } else {
        return tablets + ' tablets';
      }
    },
    changeInstruction: function(event) {
      $('#instructionModal').modal('hide');
      if (event == '') return null;
      this.dangerInstruction = $(event.target).text();
    },
    translate: function() {
      //new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
    },
    toggleWeightTable: function() {
      if (this.display == 'weightTable') {
        this.display = 'fdr';
      } else if (this.display == 'fdr') {
        this.display = 'weightTable';
      }
    },
    wDate: function(n) {
      return moment().add(n, 'days').format('MMMM DD, YYYY');
    },
    wDateDay: function(n) {
      return moment().add(n, 'days').format('dddd');
    },
    highlight: function(n) {
        var nn = parseInt(n) - parseInt(moment().day());
        nn = nn-1; //shifts week to start Monday
        if ((Math.floor((nn)/7))%2==1) return true;
        return false;
    }
  }
})

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {pageLanguage: 'en'},
    'google_translate_element'
  );
}


//   -----------SOME METHODS TO MAKE FIELDS DYNAMICALLY CHANGE WIDTH
$.fn.textWidth = function(text, font) {
    if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
    $.fn.textWidth.fakeEl.text(text || this.val() || this.text() || this.attr('placeholder')).css('font', font || this.css('font'));
    var fudgeFactor = 20;
    return $.fn.textWidth.fakeEl.width()+fudgeFactor;
};

$('.width-dynamic').on('input', function() {
    var inputWidth = $(this).textWidth();
    $(this).css({
        width: inputWidth
    })
}).trigger('input');

function inputWidth(elem, minW, maxW) {
    elem = $(this);
}

var targetElem = $('.width-dynamic');

inputWidth(targetElem);
