'use strict'

const EdjCalendarMonths = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
]

var EdjCalendarBankHolidays = {};


class EdjCalendar {

	constructor(elem, calendarId) {
		let todayDate = new Date();
		this.elem = elem;
		this.selected = {
			"month": todayDate.getMonth(),
			"year": todayDate.getFullYear()
		}

		this.calendarId = calendarId;
	}

	getNumberOfDays(year, month) {
    	var isLeap = ((year % 4) == 0 && ((year % 100) != 0 || (year % 400) == 0));
    	return [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	}

	render() {

		// read current date
		let todayDate = new Date();
		let currentYear = todayDate.getFullYear();
		let currentMonth = todayDate.getMonth();
		this.selected.today = todayDate.getDate();

		// calculate number of days in selected month		
		const numberOfDays = this.getNumberOfDays(this.selected.year, this.selected.month);

		let selectedDate = new Date(this.selected.year, this.selected.month, 1);
		const firstDayOfMonthOffset = selectedDate.getDay();

		// insert variables into HTML template
		const headerText = EdjCalendarMonths[this.selected.month] + " " + this.selected.year;
		const calendarId = "edjet-calendar-" + this.calendarId;

		// Fill HTML template with real data
		let output = `
		<div class="edj-calendar">
  			<div class="edj-calendar-header">
	    		<div class="edj-calendar-header-cell left" onClick="document.getElementById('`+ calendarId + `').calendarInstance.setPreviousMonth();"></div>
    			<div class="edj-calendar-header-month"><p>` + headerText + `</p></div>
    			<div class="edj-calendar-header-cell right" onClick="document.getElementById('`+ calendarId + `').calendarInstance.setNextMonth();"></div>
  			</div>
  			<div class="edj-calendar-days-header">
			    <div class="edj-calendar-days-header-cell"><p>Sa</p></div>
		    	<div class="edj-calendar-days-header-cell"><p>Mo</p></div>
		    	<div class="edj-calendar-days-header-cell"><p>Tu</p></div>
		    	<div class="edj-calendar-days-header-cell"><p>We</p></div>
		    	<div class="edj-calendar-days-header-cell"><p>Th</p></div>
		    	<div class="edj-calendar-days-header-cell"><p>Fr</p></div>
		    	<div class="edj-calendar-days-header-cell"><p>Sa</p></div>
			</div>`;

		let renderedDay = 0;
		let bankHolidays = EdjCalendarBankHolidays[this.selected.year];

		while (renderedDay <= numberOfDays) {
			output += `<div class="edj-calendar-days">`;
			for (let i = 0; i < 7; i++) {

				// wait for first day
				if (renderedDay === 0 && i === firstDayOfMonthOffset) {
					renderedDay++;
				}

				// empty box?
				if (renderedDay === 0 || renderedDay > numberOfDays) {
					output += `<div class="edj-calendar-days-cell"><p></p></div>`;
				}
				else {
					let className = "edj-calendar-days-cell";

					// today?
					if (this.selected.year === currentYear &&
						this.selected.month === currentMonth &&
						renderedDay === this.selected.today) {
						className += " " + "edj-calendar-days-cell-today";						
					}
					else {
						className += " " + "edj-calendar-days-cell-grey";
					}

					// bank holiday

					if (bankHolidays) {
						let dayMonth = renderedDay + "." + (this.selected.month + 1);
						if (bankHolidays.find((e) => { return e === dayMonth;})) {
							className += " " + "edj-calendar-days-cell-bank_holiday";	
						}
					}


					output += `<div class="` + className + `"><p>` + renderedDay +`</p></div>`;
				}

				if (renderedDay > 0) {
					renderedDay++;
				}
			}
			output += `</div>`;
		}

		output += '</div>';

		this.elem.innerHTML = output;
	}

	setPreviousMonth() {
		if (this.selected.month === 0) {
			this.selected.month = 11;
			this.selected.year--;

		}
		else {
			this.selected.month--;
		}

		this.render();
	}

	setNextMonth() {
		if (this.selected.month === 11) {
			this.selected.month = 0;
			this.selected.year++;

		}
		else {
			this.selected.month++;
		}

		this.render();
	}

}

function httpGet(url) {
	return new Promise((resolve, reject) => {
		let httpReq = new XMLHttpRequest();
		httpReq.onreadystatechange = () => {
			if (httpReq.readyState === 4) {
				if (httpReq.status == 200) {
					let data = JSON.parse(httpReq.responseText);
					resolve(data);
				}
				else {
					reject(new Error(httpReq.statusText));
				}
			}
		};

		httpReq.open('GET', url, true);
		httpReq.send();
	});
}

document.addEventListener("DOMContentLoaded", function() {


	httpGet('bank_holidays_cz.json')
		.then((e) => {
			EdjCalendarBankHolidays = e;
		}, (e) => {
			console.log(e);
		}).then((e) => {
			var calendarElemList = document.querySelectorAll("[edjCalendar]");
			var calendarId = 0;

			for (var el of calendarElemList) {
				if  (el.innerHTML === "") {
					el.calendarInstance = new EdjCalendar(el, calendarId);
					el.id = "edjet-calendar-" + calendarId;
					el.calendarInstance.render();
					calendarId++;
				}
			}
		});
});
