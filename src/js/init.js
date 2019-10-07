class Spiner {
  constructor(spinerLocationSelector = 'main', spinerBlockClass = 'spinner', spinerElementClass = 'loader') {
    this.spinerLocation = document.querySelector(spinerLocationSelector);
    
    this.spinnerElement = document.createElement('div');
    this.spinnerElement.classList.add(spinerBlockClass);
    
    this.spinnerLoader = document.createElement('div');
    this.spinnerLoader.classList.add(`${spinerBlockClass}__${spinerElementClass}`);
    
    this.spinnerElement.appendChild(this.spinnerLoader);
  }
  
  show() {
    this.spinerLocation.appendChild(this.spinnerElement);
  }
  
  hide() {
    this.spinerLocation.removeChild(this.spinnerElement);
  }
}

class Report {
  constructor(report, year, month, sortBy) {
    this.report = report;
    this.year = year;
    this.month = month;
    this.sortBy = sortBy;
  }  
}

class Alert {
  constructor(
    text = 'Alert Window Text', 
    okButtonText = 'Ok', 
    alertBlockSelector = '.alert', 
    alertTextSelector = '.alert__text', 
    alertButtonSelector = '.alert__button',
    alertLocationSelector = 'main'
  ){
    this.alertLocation = document.querySelector(alertLocationSelector);
    
    this.alertBlock = document.createElement('div');
    this.alertBlock.classList.add(alertBlockSelector);
    
    this.alertText = document.createElement('div');
    this.alertText.classList.add(alertTextSelector);
    this.alertText.textContent = text
    
    this.alertButton = document.createElement('div');
    this.alertButton.classList.add(alertButtonSelector);
    this.alertButton.textContent = okButtonText;
      
    this.alertBlock.appendChild(this.alertText);
    this.alertBlock.appendChild(this.alertButton);
  }
  
  show() {
    this.alertLocation.appendChild(this.alertBlock);
  }
  
  hide() {
    this.alertLocation.removeChild(this.alertBlock);
  }
}

const setDate = () => {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() - 1;
  
  if (month < 0) {
    month = 11;
    year--;
  }
  
  document.getElementById('year').value = year;
  document.getElementById('month').selectedIndex = month;
}

const handleReportFile = evt => {
  var file = evt.target.files[0];

  if ( file.name.slice(-4) !== '.csv' ) {
    evt.target.value = "";
//    return modal.showAlert("Sorry, " + file.name + " is invalid, allowed extension is .csv only");
  }
/*
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function() {
     options.zendeskReport = reader.result.split("\n");
   };

  window.getReport.reportFileLoaded = true;

  if (window.getReport.themesFileLoaded && window.getReport.reportFileLoaded) {
    window.getReport.buttonGetReport.disabled = false;
  }*/
 }


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*INIT*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

setDate();
let spiner = new Spiner();
spiner.show();

var URL = 'https://script.google.com/macros/s/AKfycbzohhPcfAhaS1CjMOJwIVV67PN1Ke3Z23QAnEO9WnhfrdbwJYA/exec';
var request = new XMLHttpRequest();

request.addEventListener('load', function() {
  var response = JSON.parse(request.responseText);
  console.log(response);
  spiner.hide();
  document.getElementById('zendesk-report').addEventListener('change', handleReportFile, false);
});

request.open('GET', URL, true);
request.send();