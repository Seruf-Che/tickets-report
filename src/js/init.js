class DomElemetnt {
  constructor(tag = 'div', classList = [], textContent){    
    let element = document.createElement(tag);
    if (textContent) element.textContent = textContent;
    if (classList) classList.forEach(elem => element.classList.add(elem));
    this._element = element;
  }
  
  get element() {
    return this._element;
  }
  
  set element(value) {
    this._element = value;
  }
}

class Spiner {
  constructor(
    spinerLocationSelector = 'main',
    spinerBlockClass = 'spinner',
    spinerElementClass = 'spinner__loader'
  ) {
    this.spinerLocation = document.querySelector(spinerLocationSelector);

    this.spinnerElement = new DomElemetnt('div',[spinerBlockClass]);
    let spinnerLoader = new DomElemetnt('div',[spinerElementClass]);
    this.spinnerElement.element.appendChild(spinnerLoader.element);
  }

  show() {
    this.spinerLocation.appendChild(this.spinnerElement.element);
  }

  hide() {
    this.spinerLocation.removeChild(this.spinnerElement.element);
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
      
    let alertBlock = new DomElemetnt('div',[alertBlockClass],'');
    let alertBlockWrapper = new DomElemetnt('div',[alertBlockWrapperClass],'');
    let alertText = new DomElemetnt('div',[alertTextClass],text);
    let alertButton = new DomElemetnt('button',[alertButtonClass,'button'],okButtonText);
    alertButton.element.addEventListener('click', () => this.hide());
    alertBlockWrapper.element.appendChild(alertText.element);
    alertBlockWrapper.element.appendChild(alertButton.element);
    alertBlock.element.appendChild(alertBlockWrapper.element);
    
    this.alertBlock = alertBlock;
  }

  show() {
    this.alertLocation.appendChild(this.alertBlock.element);
  }

  hide() {
    this.alertLocation.removeChild(this.alertBlock.element);
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
      if (this.themesList[key].tickets > 0) this.themesListArray.push(this.themesList[key]);
    }

    this.themesListArray.sort( (a,b) => {
      if (this.sortBy === 'amount') return b.tickets - a.tickets;
      else {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      }
    });
  }
  
  show() {
    let table = document.querySelector('.table');
    table.innerHTML = "";
    
    let totalRow = new DomElemetnt('tr');
    let totalTitle = new DomElemetnt('td', false, "Total tickets:");
    let totalNumber = new DomElemetnt('td', false, this.totalTickets);
    totalRow.element.appendChild(totalTitle.element);
    totalRow.element.appendChild(totalNumber.element);
    table.appendChild(totalRow.element);
    
    let lastRow = new DomElemetnt('tr');
    let lastTitle = new DomElemetnt('td', false, "Last ticket number:");
    let lastNumber = new DomElemetnt('td', false, this.lastTicket);
    lastRow.element.appendChild(lastTitle.element);
    lastRow.element.appendChild(lastNumber.element);
    table.appendChild(lastRow.element);
    
    let firstRow = new DomElemetnt('tr');
    let firstTitle = new DomElemetnt('td', false, "First ticket number:");
    let firstNumber = new DomElemetnt('td', false, this.firstTicket);
    firstRow.element.appendChild(firstTitle.element);
    firstRow.element.appendChild(firstNumber.element);
    table.appendChild(firstRow.element);
    
    let removedRow = new DomElemetnt('tr');
    let removedTitle = new DomElemetnt('td', false, "Total tickets removed:");
    let removedNumber = new DomElemetnt('td', false, this.totalRemovedTickets);
    removedRow.element.appendChild(removedTitle.element);
    removedRow.element.appendChild(removedNumber.element);
    table.appendChild(removedRow.element);
    
    let dividerRow = new DomElemetnt('tr');
    let dividerData1 = new DomElemetnt('td',['table__divider']);
    let dividerData2 = new DomElemetnt('td',['table__divider']);
    dividerRow.element.appendChild(dividerData1.element);
    dividerRow.element.appendChild(dividerData2.element);
    table.appendChild(dividerRow.element);
    
    for (let i = 0; i < this.themesListArray.length; i++) {
      let name = this.themesListArray[i].name;
      let tickets = this.themesListArray[i].tickets;

      let tableRow = new DomElemetnt('tr');
      let tableDataName = new DomElemetnt('td', false, name);
      let tableDataNumber = new DomElemetnt('td', false, tickets);
      tableRow.element.appendChild(tableDataName.element);
      tableRow.element.appendChild(tableDataNumber.element);
      table.appendChild(tableRow.element);
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