function loadDataFull(urlBase) {

    const url = urlBase + 'data/parsed/all.json';
    let data = {};
    $.getJSON(url, (obj) => {
        data = obj;
    });
    console.log(data);
    return data;
}

function volumeIndex(url) {
    return fetch(url + 'index.txt')
        .then((response) => {
            return response.text();
        })
        .then((text) => {
            return text.split('\n');
        });
}

function volumeNames(url) {
    return volumeIndex(url).then((Index) => {
        return Index.map((str) => /([^\/\n]+)\.json/g.exec(str)[1])
    });
}

function loadData(urlData) {

    // const urlData = urlBase + 'data/parsed/';
    const urlIndex = urlData + 'index.txt';

    return volumeIndex(urlIndex).then((volIndex) => {
        let urlIndex = volIndex.map((relUrl) => { return urlData + relUrl; });
        for (i in volIndex)
            $.getJSON(urlData + volIndex[i], (obj) => {
                data.push(obj);
            });

        // var data = [];
        // for (url of Object.values(Index))
        //     $.getJSON(url, (obj) => {
        //         data.push(obj);
        //     });
        return data;
    });
}
