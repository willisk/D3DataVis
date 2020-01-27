
'use strict';
const excelToJson = require('convert-excel-to-json');
const fs = require('fs-extra');
const path = require('path');

const rawDir = '../raw/';
const dirOut = '../parsed/';

function parseDirRec(dir) {

    const files = fs.readdirSync(dir);

    for (var i = 0; i < files.length; i++) {

        const fileName = path.join(dir, files[i]);
        const stat = fs.lstatSync(fileName);

        if (!stat.isDirectory()) {
            console.log(fileName);
            continue;

            const match = (/(.+?)\.xls/g).exec(files[i]);

            if (match) {
                const fileNameBase = match[1];
                const fileNameOut = path.join(dirOut, fileNameBase + '.json');
                const jsonData = excelToJson({ sourceFile: fileName });
                fs.writeFile(fileNameOut, JSON.stringify(jsonData), function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
        else {
            console.log(fileName);
            parseDirRec(fileName);
        }
    }


}

parseDirRec(rawDir);


// const result = excelToJson({
//     sourceFile: '../raw/fl_464_Volume_AA.xls'
// });

// console.log(result);
// fs.writeFile("test.txt", jsonData, function (err) {
//     if (err) {
//         console.log(err);
//     }
// });