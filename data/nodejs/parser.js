
'use strict';

const excelToJson = require('convert-excel-to-json');
const fs = require('fs-extra');
const path = require('path');
const Promise = require("bluebird");

const rawDir = '../raw/';
const dirOut = '../parsed/';

var fullJson = {};
var Index = parseDirRec(rawDir, fullJson);
fs.writeFile(path.join(dirOut, 'index.txt'), Index.join('\n'));
fs.writeFile(path.join(dirOut, 'all.json'), JSON.stringify(fullJson));

// var filtered = fullJson;
// for (let volume of Object.keys(filtered)) {
//     for (let sheet of Object.keys(filtered[volume])) {
//         let groups = filtered[volume][sheet].groups;
//         groups = groups.slice(1);

//         let inquiry = filtered[volume][sheet].inquiry;
//         console.log(inquiry);
//         for (let inq of inquiry) {
//             if (inq.data[0] == undefined) {
//                 console.log(inq);
//                 continue;
//             }
//             inq.data[0] = inq.data[0].slice(1);
//             inq.data[1] = inq.data[1].slice(1);
//         }
//     }
// }
// fs.writeFile(path.join(dirOut, 'filtered.json'), JSON.stringify(filtered));


function parseDirRec(dir, fullJson) {

    const files = fs.readdirSync(dir);
    let Index = [];

    for (let i = 0; i < files.length; i++) {

        const fileName = path.join(dir, files[i]);
        const stat = fs.lstatSync(fileName);

        if (!stat.isDirectory()) {

            let isXls = (/(.+?)\.xls/g).exec(files[i]);

            if (isXls) {
                let fileNameOut = fileName.replace(/xls/g, 'json').replace(rawDir, dirOut);
                let volume = parseXls(fileName);
                let volumeName = /([^\/\n]+)\.xls/g.exec(files[i])[1];
                fs.writeFile(fileNameOut, JSON.stringify(volume));
                Index.push(fileNameOut.replace(dirOut, ''));
                fullJson[volumeName] = volume;
            }
        }
        else
            Index = Index.concat(parseDirRec(fileName, fullJson));
    }

    return Index;
}

function parseXls(fileName) {

    console.log('parsing ' + fileName);
    const jsonData = excelToJson({ sourceFile: fileName });

    const colStart = 'B';
    const bodyStartKeyword = 'TOTAL';

    var jsonDataParsed = {};

    for (let sheetName in jsonData) {

        if (sheetName == 'Index')
            continue;

        const sheetXls = jsonData[sheetName];
        console.log('parsing sheet ' + sheetName);

        // build sheet structure
        var sheet = {
            meta: {},
            phrase: "",
            phraseFr: "",
            total: 0,
            data: {},
            groups: [],
            category: {},
            categoryFr: {},
            nameFr: {},
            count: {}
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

        // ------------------------------------
        // header

        var header = sheetXls.slice(0, bodyStartIdx);

        // -----------
        // total count row
        var total = Object.values(header.pop()).slice(1);
        var phraseRow = Object.values(header.splice(phraseIdx, 1)[0]); // XXX verify splice
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
            groupMetaFr = header[groupMetaRowIdx];
            groupMeta = groupMetaFr;

            let groupMetaRowEng = header[groupMetaRowIdx + 2];  // XXX always assume eng version is 2 below french ?
            for (let key of Object.keys(groupMetaRowEng))
                groupMeta[key] = groupMetaRowEng[key];

            header.splice(groupMetaRowIdx, 3);  // dangerous, verify
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
        function getEng(keyStr, group, alternative = '') {
            return group.hasOwnProperty(keyStr) ? group[keyStr] : alternative;
        }

        // ------------------
        // add meta
        sheet.total = total.splice(0, 1)[0];
        sheet.meta = header.slice(0, groupMetaRowIdx);

        // ------------------
        // build sheet groups and categories

        Object.entries(groupRow).forEach((entry, idx) => {

            let key = entry[0];
            let val = entry[1];

            let name = getEng(key, groupRowEng, val);
            let category = findGroup(key, groupMeta);
            let nameFr = val;
            let categoryFr = findGroup(key, groupMetaFr);

            sheet.count[name] = total[idx];

            if (category != '') {
                sheet.category[name] = category;
                sheet.categoryFr[name] = categoryFr;
            }

            sheet.nameFr[name] = nameFr;

            sheet.groups.push(name);
        });

        // ------------------
        // data

        for (let idx = 0; idx < dataRows.length; idx += 2) {

            let row2Exists = idx + 1 < dataRows.length;
            let row1 = dataRows[idx];
            let row2 = row2Exists ? dataRows[idx + 1] : [];

            let keyEngExists = (row1.length == row2.length) ? true : false;

            let keyFr = row1.splice(0, 1)[0];
            let keyEng = keyEngExists ? row2.splice(0, 1)[0] : keyFr;

            // let data = [row1];
            // if (row2Exists)
            //     data.push(row2);

            let data = {};
            for (let i in row1)
                data[sheet.groups[i]] = row1[i];

            sheet.data[keyEng] = data;
        }


        jsonDataParsed[sheetName] = sheet;
    }

    return jsonDataParsed;
}
