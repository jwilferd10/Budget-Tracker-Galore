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

// Upon a successful
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above), save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run checkDatabase() function to send all local db data to api
    if (navigator.onLine) {
        checkDatabase();
    }
};

// Log the error here
request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// Explicitly open a transaction, or a temporary connection to the database. 
// This will help the IndexedDB database maintain an accurate reading of the data it stores so that data isn't in flux all the time.
// This function will be executed if we attempt to save a transaction 
function saveRecord(record) {
    // Open a new transaction with the database with pending and write permissions
    const transaction = db.transaction(['pending'], 'readwrite');

    // Access the object store for 'pending'
    const store = transaction.objectStore('pending');

    // Add record to your store with add method
    store.add(record);
}

// Create a function that will handle collecting all of the data from the pending object store in IndexedDB and POST it to the server
function checkDatabase() {
    // Open a new transaction to the database to read the data.
    const transaction = db.transaction(['pending'], 'readwrite');

    // access object store
    const store = transaction.objectStore('pending');

    // Get all records from store and set to variable
    const getAll = store.getAll();

    // Upon a successful .getAll() execution, run this function
    getAll.onsuccess = function() {
        // If there was data in indexedDb's store, send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
              method: 'POST',
              body: JSON.stringify(getAll.result),
              headers: {
                  Accept: 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                  throw new Error(serverResponse);
                }
                // Open one more transaction
                const transaction = db.transaction(['pending'], 'readwrite');
                // Access the store object
                const store = transaction.objectStore('pending');
                // Clear all items in store
                store.clear();
            })
            // Show error if any
            .catch(err => {
                console.log(err);
            });
        }
    };
}

// Listen for if the app comes back online
window.addEventListener('online', checkDatabase);