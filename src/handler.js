const {nanoid} = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload

    const id = nanoid(16)
    const creatAt = new Date().toISOString()
    const updateAt = creatAt
    const finished = pageCount === readPage;
    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        creatAt,
        updateAt
    }

    //name undifine
    if(name === undefined) {
        const response = h.response({
            status: 'failed',
            message: 'Gagal menambahkan buku, Mohon isi nama buku'
        })
        response.code(400)

        return response
    }

    //counting page
  if (readPage > pageCount) {
    const response = h.response({
      status: "failed",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);

    return response;
  }

    //add books to object
    books.push(newBook)

    const isSuccess = books.filter((book) => book.id === id).length > 0

    //add book success
    if(isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        })
        response.code(201)

        return response
    }

    //book failed added
    const response = h.response({
        status: 'failed',
        message: 'Buku gagal ditambahkan',
    })
    response.code(500)

    return response
}

//get all books
const getAllBookHandler = (request, h) => {
    const { name, reading, finished } = request.query

    let filteredBooks = books

    if(name !== undefined) {
        filteredBooks = filteredBooks.filter(
            (books) => books.name.toLowerCase().includes(name.toLowerCase())
        )
    }

    if(reading !== undefined) {
        filteredBooks = filteredBooks.filter(
            (books) => books.reading === !!Number(reading)
        )
    }

    if(finished !== undefined) {
        filteredBooks = filteredBooks.filter(
            (books) => books.finished === !!Number(finished)
        )
    }

    const response = h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book)=> ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }))
        }
    })
    response.code(200)

    return response
}

//get one book with id
const getBookByIdHandler = (request, h) => {
    const {id} = request.params
    const book = books.filter((b)=>b.id===id)[0]

    if(book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        }
    }

    const response = h.response({
        status: 'failed',
        message: 'Buku tidak ditemukan'
    })
    response.code(404)

    return response
}

//Update book data
const updateBookHandler = ( request,h ) => {
    const {id} = request.params

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload

    const updateAt = new Date().toISOString
    const index = books.findIndex((book) => book.id === id)

    if(index !== -1) {
        if(name === undefined) {
            const response  = h.response({
                status: 'failed',
                message: 'Edit buku gagal, mohon isi nama buku '
            })
            response.code(400)

            return response
        }

        if(readPage > pageCount) {
            const response = h.response({
                status: 'failed',
                message: 'Edit buku gagal, readPage tidak boleh lebih besar dari pageCount'
            })
            response.code(400)

            return response
        }

        const finished = readPage === pageCount

        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updateAt,
        }

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil di edit'
        })
        response.code(200)

        return response
    }

    const response = h.response({
        status: 'failed',
        message: 'Buku gagal diedit, id tidak ditemukan'
    })
    response.code(404)

    return response
}

//delete book
const deleteBookHandler = (request, h) => {
    const {id} = request.params

    const index = books.findIndex((book) => book.id === id)

    if(index !== -1) {
        books.splice(index, 1)
        const response = h.response({
            status: 'success',
            message: 'Buku berhasi dihapus'
        })
        response.code(200)

        return response
    }


    const response = h.response({
        status: 'failed',
        message: 'Buku gagal dihapus, id tidak ditemukan'
    })
    response.code(400)

    return response
}
module.exports = {
    addBookHandler, 
    getAllBookHandler, 
    getBookByIdHandler, 
    updateBookHandler, 
    deleteBookHandler
}