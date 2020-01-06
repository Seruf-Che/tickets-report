"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DomElemetnt =
/*#__PURE__*/
function () {
  function DomElemetnt() {
    var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';
    var classList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var textContent = arguments.length > 2 ? arguments[2] : undefined;

    _classCallCheck(this, DomElemetnt);

    var element = document.createElement(tag);
    if (textContent) element.innerHTML = textContent;
    if (classList) classList.forEach(function (elem) {
      return element.classList.add(elem);
    });
    this._element = element;
  }

  _createClass(DomElemetnt, [{
    key: "element",
    get: function get() {
      return this._element;
    },
    set: function set(value) {
      this._element = value;
    }
  }]);

  return DomElemetnt;
}();

var Spiner =
/*#__PURE__*/
function () {
  function Spiner() {
    var spinerLocationSelector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'main';
    var spinerBlockClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'spinner';
    var spinerElementClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'spinner__loader';

    _classCallCheck(this, Spiner);

    this.spinerLocation = document.querySelector(spinerLocationSelector);
    this.spinnerElement = new DomElemetnt('div', [spinerBlockClass]);
    var spinnerLoader = new DomElemetnt('div', [spinerElementClass]);
    this.spinnerElement.element.appendChild(spinnerLoader.element);
  }

  _createClass(Spiner, [{
    key: "show",
    value: function show() {
      this.spinerLocation.appendChild(this.spinnerElement.element);
    }
  }, {
    key: "hide",
    value: function hide() {
      this.spinerLocation.removeChild(this.spinnerElement.element);
    }
  }]);

  return Spiner;
}();

var Alert =
/*#__PURE__*/
function () {
  function Alert() {
    var _this = this;

    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Alert Window Text';
    var okButtonText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Ok';
    var reload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var alertLocationSelector = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'main';
    var alertBlockClass = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'alert';
    var alertBlockWrapperClass = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'alert__window';
    var alertTextClass = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'alert__text';
    var alertButtonClass = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 'alert__button';

    _classCallCheck(this, Alert);

    this.alertLocation = document.querySelector(alertLocationSelector);
    this.reload = reload;
    var alertBlock = new DomElemetnt('div', [alertBlockClass], '');
    var alertBlockWrapper = new DomElemetnt('div', [alertBlockWrapperClass], '');
    var alertText = new DomElemetnt('div', [alertTextClass], text);
    var alertButton = new DomElemetnt('button', [alertButtonClass, 'button'], okButtonText);
    alertButton.element.addEventListener('click', function () {
      return _this.hide();
    });
    alertBlockWrapper.element.appendChild(alertText.element);
    alertBlockWrapper.element.appendChild(alertButton.element);
    alertBlock.element.appendChild(alertBlockWrapper.element);
    this.alertBlock = alertBlock;
  }

  _createClass(Alert, [{
    key: "show",
    value: function show() {
      this.alertLocation.appendChild(this.alertBlock.element);
    }
  }, {
    key: "hide",
    value: function hide() {
      this.alertLocation.removeChild(this.alertBlock.element);
      if (this.reload) window.location.reload();
    }
  }]);

  return Alert;
}();

var Report =
/*#__PURE__*/
function () {
  function Report() {
    _classCallCheck(this, Report);

    this.themesListAddress = "https://docs.google.com/spreadsheets/d/1z7zJumlt7AZXF1GC6lU2ObMorZUxJZGSOIoiYPeQwbM/edit#gid=0";
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

  _createClass(Report, [{
    key: "calc",
    value: function calc() {
      for (var i = 0; i < window.zendeskReport.length; i++) {
        var elem = window.zendeskReport[i].split(';');

        if (elem) {
          if (elem[1]) {
            var number = elem[0];
            var year = elem[1].slice(7, 11);
            var month = elem[1].slice(4, 6);
            var name = elem[2].slice(1, elem[2].length - 1);

            if (elem.length === 3 && year === this.year && month === this.month) {
              if (!this.lastTicket) {
                this.lastTicket = number;
              }

              if (name.length === 0) {
                this.themesList['merged-tickets'].tickets++;
              } else {
                if (this.themesList[name]) {
                  this.themesList[name].tickets++;
                } else {
                  var alert = new Alert("The ".concat(name, " theme was not found in the themes list. Please proceed <a href=\"").concat(this.themesListAddress, "\" target=\"_blank\" style=\"font-weight: 700; color: #ffffff\">here</a> to add it."), "Reload", true);
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
        var _alert = new Alert('There is not any ticket, or Zendesk report has been generated wrong');

        return _alert.show();
      }

      this.totalRemovedTickets = this.lastTicket - this.firstTicket - this.totalTickets;
    }
  }, {
    key: "sort",
    value: function sort() {
      var _this2 = this;

      for (var key in this.themesList) {
        if (this.themesList[key].tickets > 0) this.themesListArray.push(this.themesList[key]);
      }

      this.themesListArray.sort(function (a, b) {
        if (_this2.sortBy === 'amount') return b.tickets - a.tickets;else {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        }
      });
    }
  }, {
    key: "show",
    value: function show() {
      var table = document.querySelector('.table');
      table.innerHTML = "";
      var totalRow = new DomElemetnt('tr').element;
      var totalTitle = new DomElemetnt('td', false, "Total tickets:").element;
      var totalNumber = new DomElemetnt('td', false, this.totalTickets).element;
      totalRow.appendChild(totalTitle);
      totalRow.appendChild(totalNumber);
      table.appendChild(totalRow);
      var lastRow = new DomElemetnt('tr').element;
      var lastTitle = new DomElemetnt('td', false, "Last ticket number:").element;
      var lastNumber = new DomElemetnt('td', false, this.lastTicket).element;
      lastRow.appendChild(lastTitle);
      lastRow.appendChild(lastNumber);
      table.appendChild(lastRow);
      var firstRow = new DomElemetnt('tr').element;
      var firstTitle = new DomElemetnt('td', false, "First ticket number:").element;
      var firstNumber = new DomElemetnt('td', false, this.firstTicket).element;
      firstRow.appendChild(firstTitle);
      firstRow.appendChild(firstNumber);
      table.appendChild(firstRow);
      var removedRow = new DomElemetnt('tr').element;
      var removedTitle = new DomElemetnt('td', false, "Total tickets removed:").element;
      var removedNumber = new DomElemetnt('td', false, this.totalRemovedTickets).element;
      removedRow.appendChild(removedTitle);
      removedRow.appendChild(removedNumber);
      table.appendChild(removedRow);
      var dividerRow = new DomElemetnt('tr').element;
      var dividerData1 = new DomElemetnt('td', ['table__divider']).element;
      var dividerData2 = new DomElemetnt('td', ['table__divider']).element;
      dividerRow.appendChild(dividerData1);
      dividerRow.appendChild(dividerData2);
      table.appendChild(dividerRow);

      for (var i = 0; i < this.themesListArray.length; i++) {
        var name = this.themesListArray[i].name;
        var tickets = this.themesListArray[i].tickets;
        var tableRow = new DomElemetnt('tr').element;
        var tableDataName = new DomElemetnt('td', false, name).element;
        var tableDataNumber = new DomElemetnt('td', false, tickets).element;
        tableRow.appendChild(tableDataName);
        tableRow.appendChild(tableDataNumber);
        table.appendChild(tableRow);
      }
    }
  }, {
    key: "totalTickets",
    get: function get() {
      return this._totalTickets;
    },
    set: function set(value) {
      this._totalTickets = value;
    }
  }]);

  return Report;
}();

var setDate = function setDate() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() - 1;

  if (month < 0) {
    month = 11;
    year--;
  }

  document.getElementById('year').value = year;
  document.getElementById('month').selectedIndex = month;
};

var reportFileHandler = function reportFileHandler(evt) {
  var file = evt.target.files[0];
  var getReportButton = document.querySelector('.calcReport');

  if (file) {
    if (file.name.slice(-4) !== '.csv') {
      evt.target.value = "";
      var alert = new Alert("Sorry, ".concat(file.name, " is invalid, allowed extension is .csv only"));
      getReportButton.disabled = true;
      alert.show();
    }

    var reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function () {
      window.zendeskReport = reader.result.split("\n");
    };

    reader.onabort = function () {
      evt.target.value = "";
    };

    getReportButton.disabled = false;
    getReportButton.addEventListener('click', getReportButtonHandler);
  }
};

var getReportButtonHandler = function getReportButtonHandler() {
  var report = new Report();
  report.calc();

  if (report.totalTickets) {
    report.sort();
    report.show();
  }
};
/*INIT*/


setDate();
var spiner = new Spiner();
spiner.show();
var URL = 'https://script.google.com/macros/s/AKfycbzohhPcfAhaS1CjMOJwIVV67PN1Ke3Z23QAnEO9WnhfrdbwJYA/exec';
var request = new XMLHttpRequest();
request.addEventListener('load', function () {
  window.themesList = JSON.parse(request.responseText);
  spiner.hide();
  document.getElementById('zendesk-report').addEventListener('change', reportFileHandler, false);
});
request.open('GET', URL, true);
request.send();