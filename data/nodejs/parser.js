
'use strict';

const excelToJson = require('convert-excel-to-json');
const fs = require('fs-extra');
const path = require('path');
const Promise = require("bluebird");

const rawDir = '../raw/';
const dirOut = '../parsed/';

parseDirRec(rawDir);

function parseDirRec(dir) {

    const files = fs.readdirSync(dir);

    for (let i = 0; i < files.length; i++) {

        const fileName = path.join(dir, files[i]);
        const stat = fs.lstatSync(fileName);

        if (!stat.isDirectory()) {

            let isXls = (/(.+?)\.xls/g).exec(files[i]);

            if (isXls) {
                const fileNameOut = fileName.replace(/xls/g, 'json').replace(rawDir, dirOut);
                const json = parseXls(fileName, fileNameOut);
                fs.writeFile(fileNameOut, JSON.stringify(json), function (err) {
                    if (err) { console.log(err); }
                });

            }
        }
        else
            parseDirRec(fileName);
    }
}

function parseXls(fileName) {

    console.log('parsing ' + fileName);
    const jsonData = excelToJson({ sourceFile: fileName });

    const colStart = 'B';
    const bodyStartKeyword = 'TOTAL';

    var jsonDataParsed = {};

    for (let sheetName in jsonData) {

        if (sheetName == 'Index')
            // if (sheetName != 'D1.1')
            continue;

        const sheetXls = jsonData[sheetName];
        console.log('parsing sheet ' + sheetName);

        // build sheet structure
        var sheet = {
            meta: {},
            phrase: "",
            phraseFr: "",
            total: 0,
            groups: [],
            questions: []
        };

        // search for 'TOTAL' keyword to determine bodyStart; first non-empty entry for phraseFr
        var phraseIdx = -1;
        var bodyStartIdx = -1;
        sheetXls.forEach((row, i) => {
            if (phraseIdx == -1 && row.hasOwnProperty(colStart))
                phraseIdx = i;
            if (row[colStart] == bodyStartKeyword)
                bodyStartIdx = i + 1;
        });
        if (bodyStartIdx == -1)
            throw `Data body not found for sheet ${sheetName} in ${fileName}`;
        if (phraseIdx == -1)
            throw `Could not find phrase for sheet ${sheetName} in ${fileName}`;

        // ------------------------------------
        // body

        const body = sheetXls.slice(bodyStartIdx);
        const dataRows = body.map(row => Object.values(row));
        const dataSize = dataRows[0].length - 1;

        for (let idx = 0; idx < dataRows.length; idx += 2) {

            let row2Exists = idx + 1 < dataRows.length;
            let row1 = dataRows[idx];
            let row2 = row2Exists ? dataRows[idx + 1] : [];

            let keyEngExists = (row1.length == row2.length) ? true : false;

            let keyFr = row1.splice(0, 1)[0];
            let keyEng = keyEngExists ? row2.splice(0, 1)[0] : keyFr;

            sheet.questions.push(
                {
                    key: keyEng,
                    keyFr: keyFr,
                    answerCount: row1,
                    answerPercent: row2
                }
            );
        }


        // ------------------------------------
        // header

        var header = sheetXls.slice(0, bodyStartIdx);

        // -----------
        // total count row
        var total = Object.values(header.pop()).slice(1);
        var phraseRow = Object.values(header[phraseIdx]);
        sheet.phraseFr = phraseRow[0];
        sheet.phrase = phraseRow[(phraseRow.length > 2) ? 2 : 1];

        // -----------
        // groups

        // look for french group row
        var groupRowIdx = -1;
        for (let row in header) {
            if (Object.keys(header[row]).length == dataSize)
                groupRowIdx = parseInt(row);
        }
        if (groupRowIdx == -1)
            throw `Could not find matching group label row for sheet ${sheetName} in ${fileName}`;

        const groupRow = header[groupRowIdx];
        const groupRowEng = header[header.length - 1];

        // -----------
        // group Meta

        // search group Meta begin by counting if row entries exceed 6?
        var groupMetaRowIdx = -1;
        header.some((row, i) => {
            if (Object.keys(row).length > 6)
                return groupMetaRowIdx = i;
        });


        var groupMeta = {}, groupMetaFr = {};
        if (groupMetaRowIdx != groupRowIdx) {
            groupMeta = header[groupMetaRowIdx + 2]; // XXX always assume eng version is 2 below french ?
            groupMetaFr = header[groupMetaRowIdx];
        }

        function xlColNum(colStr) {
            return (colStr == '') ? 0 :
                colStr.slice(-1).charCodeAt(0) - 64 + 26 * xlColNum(colStr.slice(0, -1));
        }
        function inXlColRange(colStr, colStrA, colStrB) {
            return xlColNum(colStrA) <= xlColNum(colStr) &&
                xlColNum(colStr) < xlColNum(colStrB);
        }
        function findGroup(keyStr, group, alternative = '') {
            let keys = Object.keys(group);
            let values = Object.values(group);
            let length = keys.length;

            if (!length || xlColNum(keyStr) < xlColNum(keys[0]))
                return alternative;

            for (let idx = 0; idx + 1 < length; idx++)
                if (inXlColRange(keyStr, keys[idx], keys[idx + 1]))
                    return values[idx];

            return values[length - 1];
        }

        // ------------------
        // add meta
        sheet.total = total.splice(0, 1)[0];
        sheet.meta = header.slice(0, groupMetaRowIdx);

        // ------------------
        // build sheet groups

        Object.entries(groupRow).forEach((entry, idx) => {

            let key = entry[0];
            let val = entry[1];

            sheet.groups.push(
                {
                    category: findGroup(key, groupMeta),
                    categoryFr: findGroup(key, groupMetaFr),
                    nameFr: val,
                    name: findGroup(key, groupRowEng, val),
                    count: total[idx]
                }
            );
        });

        jsonDataParsed[sheetName] = sheet;
    }

    return jsonDataParsed;
}

// const json = parseXls(path.join(rawDir, 'fl_464_Volume_B.xls'));
