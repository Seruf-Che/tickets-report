class DomElemetnt {
  constructor(tag = 'div', classList = [], textContent){    
    let element = document.createElement(tag);
    if (textContent) element.innerHTML = textContent;
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
    reload = false,
    alertLocationSelector = 'main',
    alertBlockClass = 'alert',
    alertBlockWrapperClass = 'alert__window',
    alertTextClass = 'alert__text',
    alertButtonClass = 'alert__button'    
  ){
    this.alertLocation = document.querySelector(alertLocationSelector);
    this.reload = reload;
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
    if (this.reload) window.location.reload(); 
  }
}

class Report {
  constructor() {
    this.themesListAddress = "https://docs.google.com/spreadsheets/d/1z7zJumlt7AZXF1GC6lU2ObMorZUxJZGSOIoiYPeQwbM/edit#gid=0"
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
      let elem = window.zendeskReport[i].split(';');
      if (elem) {
        if (elem[1]) {
          const number = elem[0];
          const year = elem[1].slice(7,11);
          const month = elem[1].slice(4,6);
          const name = elem[2].slice(1, elem[2].length - 1);
          console.log(elem);

          if (elem.length === 3 && year === this.year && month === this.month ) {        
            if (!this.lastTicket) {
              this.lastTicket = number;
            }

            if (name.length === 0) {
              this.themesList['merged-tickets'].tickets++;
            }
            else {
              if (this.themesList[name]) {
                this.themesList[name].tickets++;
              } else {
                const alert = new Alert(`The ${name} theme was not found in the themes list. Please proceed <a href="${this.themesListAddress}" target="_blank" style="font-weight: 700; color: #ffffff">here</a> to add it.`, "Reload", true);
                return alert.show();
              }
            }
            this.firstTicket = number;
            this.totalTickets++;
          }

        }
      }
    }
    if (this.totalTickets === 0) {
      const alert = new Alert('There is not any ticket, or Zendesk report has been generated wrong');
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
    
    let totalRow = new DomElemetnt('tr').element;
    let totalTitle = new DomElemetnt('td', false, "Total tickets:").element;
    let totalNumber = new DomElemetnt('td', false, this.totalTickets).element;
    totalRow.appendChild(totalTitle);
    totalRow.appendChild(totalNumber);
    table.appendChild(totalRow);
    
    let lastRow = new DomElemetnt('tr').element;
    let lastTitle = new DomElemetnt('td', false, "Last ticket number:").element;
    let lastNumber = new DomElemetnt('td', false, this.lastTicket).element;
    lastRow.appendChild(lastTitle);
    lastRow.appendChild(lastNumber);
    table.appendChild(lastRow);
    
    let firstRow = new DomElemetnt('tr').element;
    let firstTitle = new DomElemetnt('td', false, "First ticket number:").element;
    let firstNumber = new DomElemetnt('td', false, this.firstTicket).element;
    firstRow.appendChild(firstTitle);
    firstRow.appendChild(firstNumber);
    table.appendChild(firstRow);
    
    let removedRow = new DomElemetnt('tr').element;
    let removedTitle = new DomElemetnt('td', false, "Total tickets removed:").element;
    let removedNumber = new DomElemetnt('td', false, this.totalRemovedTickets).element;
    removedRow.appendChild(removedTitle);
    removedRow.appendChild(removedNumber);
    table.appendChild(removedRow);
    
    let dividerRow = new DomElemetnt('tr').element;
    let dividerData1 = new DomElemetnt('td',['table__divider']).element;
    let dividerData2 = new DomElemetnt('td',['table__divider']).element;
    dividerRow.appendChild(dividerData1);
    dividerRow.appendChild(dividerData2);
    table.appendChild(dividerRow);
    
    for (let i = 0; i < this.themesListArray.length; i++) {
      let name = this.themesListArray[i].name;
      let tickets = this.themesListArray[i].tickets;

      let tableRow = new DomElemetnt('tr').element;
      let tableDataName = new DomElemetnt('td', false, name).element;
      let tableDataNumber = new DomElemetnt('td', false, tickets).element;
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