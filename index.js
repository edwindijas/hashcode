const fs = require("fs");

const calculateDuration = function ({numberOfBooks, processDays, booksShipped}) {
    return processDays + (numberOfBooks / booksShipped);
};

const processFile = function (text) {
    const lines = text.split("\n");
    const [books, libraries, days] = lines[0].trim().split(" ");
    const libraryList = [];
    const booksList = lines[1].trim().split(" ");
    lines.splice(0,2);
    const readLibraryInfo = function () {
        if (lines.length === 0) {
            return;
        }
        const [numberOfBooks ,processDays ,booksShipped] = lines[1].trim().split(" ").map( u => Number(u));
        const duration = processDays + (numberOfBooks / booksShipped);
        libraryList.push({
            books : lines[0].trim().split(" "),
            booksList,
            numberOfBooks,
            processDays,
            booksShipped,
            duration
        });

        lines.splice(0, 2);
        readLibraryInfo();
    };

    readLibraryInfo();

    return {
        books,
        libraries,
        days,
        libraryList
    };
};

const readFile = function (filename, next) {
    let toDo = null;

    const text = fs.readFileSync(filename, null);
    next(processFile(text.toString().trim()));

};




const processDataset = function (dataset) {
    dataset.libraryList.sort( function (a, b) {
        return calculateDuration(b) - calculateDuration(a);
    });

    console.log(dataset.libraryList);

};


readFile("a_example.txt",  processDataset);