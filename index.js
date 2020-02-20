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
    let libraryNum = 0;
    const readLibraryInfo = function () {
        if (lines.length === 0) {
            return;
        }
        const [numberOfBooks ,processDays ,booksShipped] = lines[0].trim().split(" ").map( u => Number(u));
        const duration = processDays + (numberOfBooks / booksShipped);
        libraryList.push({
            books : lines[1].trim().split(" "),
            numberOfBooks,
            processDays,
            booksShipped,
            duration,
            libraryNum
        });

        libraryNum += 1;

        lines.splice(0, 2);
        readLibraryInfo();
    };

    readLibraryInfo();

    return {
        books,
        booksList,
        libraries,
        days,
        libraryList
    };
};

const readFile = function (filename, next) {
    let toDo = null;

    const text = fs.readFileSync(filename, null);
    next(processFile(text.toString().trim()), filename);

};


const findBestPos = function (value, dataset, index = 0) {
    if (dataset[index].duration > value.duration || index === dataset.length - 1){
        return index;
    }
    return findBestPos(value, dataset, index += 1);
};


//Load Balance tries to minimise duration by Balancing shifting removing duplicates amongst two elements and minimising
//duration of one element
//It stops when no optimisation can be done anymore...

const loadBalance = function (dataset) {
    dataset[0].books.forEach(function (value, index) {
        dataset.forEach(function (value1, innerIndex) {
            //Avoid replacing against same index
            if (innerIndex === 0) {
                return;
            }

            if (value1.books.indexOf(value) > -1 && dataset[0].duration > value1.duration) {
                dataset[0].books[index].slice(index, 1);
                dataset[0].numberOfBooks = dataset[0].books.length;
                dataset[0].duration = calculateDuration(dataset[0]);
            }
        })
    });

    const tmp = dataset[0];

    dataset.splice(0, 1);

    const index = findBestPos(dataset[0], dataset);
    dataset.splice(index, 0, tmp);

    if (index !== 0) {
        return loadBalance(dataset);
    }

    return dataset;

};

const processDataset = function (dataset, filename) {
    dataset.libraryList.sort( function (a, b) {
        return calculateDuration(b) - calculateDuration(a);
    });


    dataset.libraryList = loadBalance(dataset.libraryList);

    let txt = "";

    txt += dataset.libraryList.length + "\n";
    dataset.libraryList.forEach(function (value) {
        txt += value.libraryNum + " " + value.numberOfBooks + "\n";
        txt += value.books.join(" ") + "\n";
    });


    fs.writeFile(filename + ".out.txt", txt, () => {});

};


readFile("a_example.txt",  processDataset);
readFile("b_read_on.txt",  processDataset);
readFile("c_incunabula.txt",  processDataset);
readFile("d_tough_choices.txt",  processDataset);
readFile("e_so_many_books.txt",  processDataset);
readFile("f_libraries_of_the_world.txt",  processDataset);

