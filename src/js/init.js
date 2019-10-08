class Spiner {
  constructor(
    spinerLocationSelector = 'main',
    spinerBlockClass = 'spinner',
    spinerElementClass = 'spinner__loader'
  ) {
    this.spinerLocation = document.querySelector(spinerLocationSelector);

    this.spinnerElement = document.createElement('div');
    this.spinnerElement.classList.add(spinerBlockClass);

    this.spinnerLoader = document.createElement('div');
    this.spinnerLoader.classList.add(spinerElementClass);

    this.spinnerElement.appendChild(this.spinnerLoader);
  }

  show() {
    this.spinerLocation.appendChild(this.spinnerElement);
  }

  hide() {
    this.spinerLocation.removeChild(this.spinnerElement);
  }
}

class Alert {
  constructor(
    text = 'Alert Window Text',
    okButtonText = 'Ok',
    alertLocationSelector = 'main',
    alertBlockClass = 'alert',
    alertBlockWrapperClass = 'alert__window',
    alertTextClass = 'alert__text',
    alertButtonClass = 'alert__button'
  ){
    this.alertLocation = document.querySelector(alertLocationSelector);

    this.alertBlock = document.createElement('div');
    this.alertBlock.classList.add(alertBlockClass);

    this.alertBlockWrapper = document.createElement('div');
    this.alertBlockWrapper.classList.add(alertBlockWrapperClass);

    this.alertText = document.createElement('div');
    this.alertText.classList.add(alertTextClass);
    this.alertText.textContent = text

    this.alertButton = document.createElement('button');
    this.alertButton.classList.add(alertButtonClass,'button');
    this.alertButton.textContent = okButtonText;

    this.alertBlockWrapper.appendChild(this.alertText);
    this.alertBlockWrapper.appendChild(this.alertButton);
    this.alertBlock.appendChild(this.alertBlockWrapper);
    this.alertButton.addEventListener('click', () => this.hide());
  }

  show() {
    this.alertLocation.appendChild(this.alertBlock);
  }

  hide() {
    this.alertLocation.removeChild(this.alertBlock);
  }
}

class Report {
  constructor() {
    this.year = document.getElementById('year').value;
    this.month = document.getElementById('month').value; 
    this.sortBy = document.getElementById('sort-by').value;
    this.themesList = JSON.parse(JSON.stringify(window.themesList));
    this.firstTicket = 0;
    this.lastTicket = 0;
    this._totalTickets = 0;
    this.totalRemovedTickets = 0;
    this.themesListArray = [];
  }
  
  calc() {  
    for (let i = 0; i < window.zendeskReport.length; i++) {
      let elem = window.zendeskReport[i];
      
      if (elem && elem.split(';').length ===3 && elem.split(';')[1].slice(0,8) === `"${this.year}-${this.month}`) {
        if (!this.lastTicket) {
          this.lastTicket = elem.split(';')[0];
        }
        let name = elem.split(';')[2];
        name = name.slice(1, name.length - 1);
        if (name.length === 0) {
          this.themesList['merged-tickets'].tickets++;
        }
        else {
          this.themesList[name].tickets++;
        }
        this.firstTicket = elem.split(';')[0];
        this.totalTickets++;
      } 
    }
    if (this.totalTickets === 0) {
      let alert = new Alert('There is not any ticket, or Zendesk report has been generated wrong');
      return alert.show();
    }
    this.totalRemovedTickets = this.lastTicket - this.firstTicket - this.totalTickets;
  }
  
  get totalTickets() {
    return this._totalTickets;
  }
  
  set totalTickets(value) {
    this._totalTickets = value;
  }
  
  sort() {
    for (let key in this.themesList) {
      if (this.themesList[key].tickets > 0) {
        this.themesListArray.push(this.themesList[key]);
      }
    }

    this.themesListArray.sort( (a,b) => {
      if (this.sortBy === 'amount') {
        return b.tickets - a.tickets;
      } 
      else {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      }
    });
  }
  
  show() {
    let table = document.querySelector('.table');
    table.innerHTML = "";
    
    let totalRow = document.createElement('tr');
    let totalTitle = document.createElement('td');
    totalTitle.textContent = "Total tickets:";
    let totalNumber = document.createElement('td');
    totalNumber.textContent = this.totalTickets;
    
    totalRow.appendChild(totalTitle);
    totalRow.appendChild(totalNumber);
    
    let lastRow = document.createElement('tr');
    let lastTitle = document.createElement('td');
    lastTitle.textContent = "Last ticket number:";
    let lastNumber = document.createElement('td');
    lastNumber.textContent = this.lastTicket;
    
    lastRow.appendChild(lastTitle);
    lastRow.appendChild(lastNumber);
    
    let firstRow = document.createElement('tr');
    let firstTitle = document.createElement('td');
    firstTitle.textContent = "First ticket number:";
    let firstNumber = document.createElement('td');
    firstNumber.textContent = this.firstTicket;
    
    firstRow.appendChild(firstTitle);
    firstRow.appendChild(firstNumber);
    
    let removedRow = document.createElement('tr');
    let removedTitle = document.createElement('td');
    removedTitle.textContent = "First ticket number:";
    let removedNumber = document.createElement('td');
    removedNumber.textContent = this.totalRemovedTickets;
    
    removedRow.appendChild(removedTitle);
    removedRow.appendChild(removedNumber);
    
    let dividerRow = document.createElement('tr');
    let dividerData1 = document.createElement('td');
    dividerData1.classList.add('table__divider');
    let dividerData2 = document.createElement('td');
    dividerData2.classList.add('table__divider');
    
    dividerRow.appendChild(dividerData1);
    dividerRow.appendChild(dividerData2);
       
    table.appendChild(totalRow);
    table.appendChild(lastRow);
    table.appendChild(firstRow);
    table.appendChild(removedRow);
    table.appendChild(dividerRow);
    
    for (let i = 0; i < this.themesListArray.length; i++) {
      let name = this.themesListArray[i].name;
      let tickets = this.themesListArray[i].tickets;
      
      let tableRow = document.createElement('tr');
      let tableDataName = document.createElement('td');
      tableDataName.textContent = name;
      let tableDataNumber = document.createElement('td');
      tableDataNumber.textContent = tickets;
      
      tableRow.appendChild(tableDataName);
      tableRow.appendChild(tableDataNumber);
      table.appendChild(tableRow);
    }
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

const reportFileHandler = evt => {
  let file = evt.target.files[0];
  let getReportButton = document.querySelector('.calcReport');
  if (file) {
    if (file.name.slice(-4) !== '.csv' ) {
      evt.target.value = "";
      let alert = new Alert(`Sorry, ${file.name} is invalid, allowed extension is .csv only`);
      getReportButton.disabled = true;
      alert.show();
    }

    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
      window.zendeskReport = reader.result.split("\n");
    };

    reader.onabort = function() {
      evt.target.value = ""
    };

    getReportButton.disabled = false;
    getReportButton.addEventListener('click', getReportButtonHandler);
  }
};

const getReportButtonHandler = () => {
  let report = new Report();
  report.calc();
  if (report.totalTickets) {
    report.sort();
    report.show();
  }
}

/*INIT*/
  
setDate();
let spiner = new Spiner();
spiner.show();

let URL = 'https://script.google.com/macros/s/AKfycbzohhPcfAhaS1CjMOJwIVV67PN1Ke3Z23QAnEO9WnhfrdbwJYA/exec';
let request = new XMLHttpRequest();

request.addEventListener('load', function() {
  window.themesList = JSON.parse(request.responseText);
  spiner.hide();
  document.getElementById('zendesk-report').addEventListener('change', reportFileHandler, false);
});

request.open('GET', URL, true);
request.send();