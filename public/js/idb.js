// Create a variable to hold db connection
// Will store the connected database object when the connection is complete.
let db;
// Establish a connection to INdexedDB database called 'budget_tracker' and set it to version 1
// This act as an event listener for the database. That event listener is created when we open the connection to the database using the indexedDB.open() method.
const request = indexedDB.open('budget_tracker', 1);

// This event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
// This will also handle the event of a change that needs to be made to the database's structure
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('pending', { autoIncrement: true });
};

request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above), save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run checkDatabase() function to send all local db data to api
    // if (navigator.onLine) {

    // }
}