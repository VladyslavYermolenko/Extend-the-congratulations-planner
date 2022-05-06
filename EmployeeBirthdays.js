const fs = require('fs');
const path = require('path');

let defaultCsvPath = path.resolve(__dirname, './data.CSV');

let amount = process.argv[2] || 0;
let csvPath = process.argv[3] || defaultCsvPath;

function AgeStr(count) { // plural
    let form = '';
    const x = count % 10;
    if (x === 0 || (count >= 10 && count <= 20)) {
        form = 'лет';
    } else if (x === 1) {
        form = 'год';
    } else if (x < 5 && count ) {
        form = 'года';
    } else {
        form = 'лет';
    }
    return count + ' ' + form;
}

/** Converting a date string to new Date and returning the day. */
function dayToNumber(date) {
    let formatDate = date.split('.').reverse().join('-')
    return new Date(formatDate).getDate();
}

/** Converting a date string to new Date and returning the month. */
function monthToNumber(date) {
    let formatDate = date.split('.').reverse().join('-')
    return new Date(formatDate).getMonth() + 1;
}

/** Converting a date string to new Date and returning the year. */
function yearToNumber(date) {
    let formatDate = date.split('.').reverse().join('-')
    return new Date(formatDate).getFullYear();
}

/** Output grouped by month of birth sorted by date.
 *  @param {object} data An array of data about birthdays.
 *  @param {number} amount Planning horizon - how many months ahead to show birthdays.
 */
function EmployeeBirthdays(data, amount) {
    const monthNow = new Date(new Date().toDateString()).getMonth() + 1;
    const yearNow = new Date(new Date().toDateString()).getFullYear();
    const monthsStr = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    data.sort(function (a, b) {
        if (dayToNumber(a.date) > dayToNumber(b.date)) {
            return 1;
        }
        if (dayToNumber(a.date) < dayToNumber(b.date)) {
            return -1;
        }
        if (yearToNumber(a.date) > yearToNumber(b.date)) {
            return 1;
        }
        if (yearToNumber(a.date) < yearToNumber(b.date)) {
            return -1;
        }
        return 0;
    });

    const dataMap = new Map();
    for (const obj of data) {
        const month = monthToNumber(obj.date);
        dataMap.get(month)?.push(obj) ?? dataMap.set(month, [obj]);
    }

    for (let i = 0; i <= amount; i++) {
        let month = (monthNow + i - 1) % 12;
        console.log(`${monthsStr[month]} ${yearNow + (Math.floor(i / 12))}:`);
        const arr = dataMap.get(month);
        if (!arr) {
            console.log(' Пусто...');
            continue;
        }
        for (const el of arr) {
            let age = yearNow - yearToNumber(el.date) + (Math.floor(i / 12));
            console.log(` (${dayToNumber(el.date)}) - ${el.name} (${AgeStr(age)})`);
        }
    }
}

function Main() {
    fs.readFile(csvPath, {encoding: "utf8"}, function (err, fileData) {
        if (err) {
            console.error(err);
            return;
        }
        fileData = fileData.split('\r\n');
        fileData.shift();
        const data = fileData.map((el) => {
            let [name, date] = el.split(',');
            return { name, date }
        });
        EmployeeBirthdays(data, amount); // 1 - 12 месяц
    });
}
Main()
