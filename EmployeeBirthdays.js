const fs = require('fs');
const path = require('path');
// const readline = require('readline');

let defaultCsvPath = path.resolve(__dirname, './data.CSV');

let date = [];
let amount = process.argv[2] || 0;
let csvPath = process.argv[3] || defaultCsvPath;

function AgeStr(age) {
    count = age % 100;
    if (count >= 5 && count <= 20) {
        return 'лет';
    } else {
        count = count % 10;
        if (count == 1) {
            return 'год';
        } else if (count >= 2 && count <= 4) {
            return 'года';
        } else {
            return 'лет';
        }
    }
}

function dayToNumber(date) {
    let formatDate = date.split('.').reverse().join('-')
    return new Date(formatDate).getDate();
}

function monthToNumber(date) {
    let formatDate = date.split('.').reverse().join('-')
    return new Date(formatDate).getMonth() + 1;
}

function yearToNumber(date) {
    let formatDate = date.split('.').reverse().join('-')
    return new Date(formatDate).getFullYear();
}

function EmployeeBirthdays(date, amount) {
    const monthNow = new Date(new Date().toDateString()).getMonth() + 1;
    const yearNow = new Date(new Date().toDateString()).getFullYear();
    const monthsStr = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    date.sort(function (a, b) {
        if (monthToNumber(a.date) > monthToNumber(b.date)) {
            return 1;
        }
        if (monthToNumber(a.date) < monthToNumber(b.date)) {
            return -1;
        }
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

    for (let i = 0; i <= amount; i++) {
        let flag = false;
        let month = (monthNow + i - 1) % 12;
        console.log(`${monthsStr[month]} ${yearNow + (Math.floor(i / 12))}:`);
        date.map(el => {
            if (monthToNumber(el.date) === (month % 12) + 1) {
                let age = yearNow - yearToNumber(el.date) + (Math.floor(i / 12));
                console.log(` (${dayToNumber(el.date)}) - ${el.name} (${age} ${AgeStr(age)})`);
                flag = true;
            }
        });
        if (!flag) {
            console.log(' Пусто...')
        }
    }
}

function Main() {
    // console.log('||' + csvPath + '||');
    fs.readFile(csvPath, {encoding: "utf8"}, function (err, fileData) {

        if (err) {
            console.error(err);
            return;
        }
        // results.push(data);
        // console.log(results)

        fileData = fileData.split('\n');
        let nameKey = fileData[0].split(',')[0];
        let dateKey = fileData[0].split(',')[1];
        fileData.map((el, index, arr) => {
            if (index !== 0) {
                let nameAndDate = el.split(',');
                // console.log(nameAndDate[0]);
                // console.log(nameAndDate[1]);
                let dateForPush = {
                    [nameKey]: nameAndDate[0],
                    [dateKey]: nameAndDate[1]
                };
                date.push(dateForPush);
            }
        });
        EmployeeBirthdays(date, amount); // 1 - 12 месяц
    });    
}
Main()
