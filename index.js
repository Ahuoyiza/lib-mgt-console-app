// A library management system
/**
 * run on the console
 * lib sys functionality: 
 * -- books (add, remove,search(find)view, update books etc)
 * borrowing mgt
 * -- know the borrowers(add, find , remove a borrower)
 * -- see available books to borrow
 * -- borrow book if available; this removes borrowed books from availability and record should show that x user borroweed it
 * app interface -- console
 * -- lib name and welcome msg 
 * -- 2 states: while app is running => show menu  and exit message when app stops running
 * -- dynamically initialise the lib app with existing data (books, borrowers etc)
 * -- menu display
 * 
 */

// console app:
/**
 * which consoles it is to run on: integrated node js terminal and browser console [thinking both]
 * how to handle input and output 
 */

//library class

class Library {
    constructor(name){
        this.name = name;
        this.books = [];
        this.borrowers = [];
        this.nextBorrowerId = 1;
        this.nextBookId = 1;
    }
// methods
    addBook(title, author, genre){
        const book = {
            id: this.nextBookId++,
            title,
            author,
            genre,
            available: true,
            borrowedBy: null,
            addedDate: new Date()
        };
       this.books.push(book);
       console.log(`Book added successfully: "${title}" by ${author} (ID: ${book.id})`);
    //    console.log(book)
       return book;
    }
    findBook(id){
        return this.books.find(book => book.id === id)
    }

    removeBook(id){
        const initialLength = this.books.length;
        this.books = this.books.filter(book => book.id === id);

        if (this.books.length < initialLength) {
            console.log(`The book with ID: ${id} has been removed successfully`);
            return true;
        }else{
            console.log(`The book with ID ${id} does not exist`);
            return false;
        }

    }
    // handle book details update

    //borrowing logic
    // borrower == reg/add
    addBorrower(name, email){
        const borrower = {
            id: this.nextBorrowerId++,
            name,
            email,
            booksCurrentlyBorrowed: [],
            borrowingHistory: [],
        }
        this.borrowers.push(borrower);
        console.log(`This Borrower registered successfully: name: "${name}" (ID: ${borrower.id})`);
        return borrower;
    }
    // find borrower
    findBorrower(id){
        return this.borrowers.find(borrower => borrower.id === id);
        //display borrower info in an interface way
    }

    // borrow
    borrowBook(bookId, borrowerId){
        const book = this.findBook(bookId);
        const borrower = this.findBorrower(borrowerId);

        if (!book){
            console.log(`Error: book with bookId: ${bookId} not found`)
            return false;
        }
        if (!borrower){
            console.log(`Error: borrower with ID: ${borrowerId} not found`)
            return false;
        }
        if (!book.available){
            console.log(`Error: book with Id: ${bookId} and title: ${book.title} is already borrowed`)
            return false;
        }
        // if book && borrower == true, update book
        book.available = false;
        book.borrowedBy = borrowerId;
        book.borrowDate = new Date();


        // update borrower history
        borrower.booksCurrentlyBorrowed.push(bookId);
        borrower.borrowingHistory.push({
            bookId,
            title: book.title,
            borrowDate: new Date(),
            returnDate: null,
        })

        console.log(`The book "${book.title}" has been borrowed by ${borrower.name} successfully!`);
        return true;
    }

    // return a borrowed book
    returnBook(bookId){
        const book = this.findBook(bookId);
        if(!book){
            console.log(`Error!: The book with id: ${bookId} not found`);
            return false;
        }
        if(book.available){
            console.log(`Error!: The book titled: ${book.title} is not currently borrowed`);
            return false;
        }

        const borrower = this.findBorrower(book.borrowedBy);
        if(!borrower){
            console.log(`Error! the associated borrower not found`);
            // reset
            book.available = true;
            book.borrowedBy = null;
            return true;
        }

        // update:  book status 
        book.available = true;
        book.borrowedBy = null;

        // update borrower record
        borrower.booksCurrentlyBorrowed = borrower.booksCurrentlyBorrowed.filter(id => id !== bookId) 

        // update borrowing history
        const historyEntry = borrower.borrowingHistory.find(entry => entry.bookId === bookId && entry.returnDate === null);
        if(historyEntry){
            historyEntry.returnDate = new Date();
        }
        console.log(`The book "${book.title}" has been returned successfully`)
        // console.log(borrower.borrowingHistory);
        return true;
    }
    
    // search for books title, author, genre
    searchBooks(query){
        if(!query || query.trim() === '' ){
            return [];
        }
        query = query.toLowerCase();

       return this.books.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.genre.toLowerCase().includes(query)
        );
// display in the user app view
    }
// list available books
listAvailableBooks(){
    const availableBooks = this.books.filter(book => book.available);

    if (availableBooks.length === 0){
        console.log(`No books available at the moment. Check again later`);
        return [];
    }

    console.log(`
        Available books: (${availableBooks.length}):`)
    availableBooks.forEach(book => {
        console.log(`ID: ${book.id}|
            title: ${book.title}|
        author: ${book.author}
        genre: ${book.genre}`)
    });

    return availableBooks;

    // list all borrowed books
}

}
let lib = new Library('rise academy library');
lib.addBook("dream count", "CNA", "romance");
lib.addBook("Onyx storm", "Rebecaa Yaros", "fantasy");
lib.addBook("Things fall apart", "Chinua Achebe", "historical fiction");
lib.addBook("The thing around your neck", "Chinua Achebe", "something");
// lib.addBorrower("Sophia", "soph@wise.com");
// lib.borrowBook(1,1)
// console.log(lib.books)
// console.log(lib.borrowers)
// lib.returnBook(1)
lib.searchBooks("thing");




// 
// handle exports



