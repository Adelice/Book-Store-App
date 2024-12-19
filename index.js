// Initially, we'll point to localhost, but we'll update this URL after deployment
const API_URL = 'http://localhost:3000';

const bookList = document.getElementById('book-list');
const searchInput = document.getElementById('search-input');
const bookDetail = document.getElementById('book-detail');
const closeDetail = document.getElementById('close-detail');
const detailTitle = document.getElementById('detail-title');
const detailAuthor = document.getElementById('detail-author');
const detailDescription = document.getElementById('detail-description');
const detailLikes = document.getElementById('detail-likes');
const likeButton = document.getElementById('like-button');
const addBookForm = document.getElementById('add-book-form');

let allBooks = [];
let currentBook = null;

// Fetch books from local JSON server (will change after deployment)
fetch(`${API_URL}/books`)
  .then(res => res.json())
  .then(data => {
    allBooks = data;
    displayBooks(allBooks);
  })
  .catch(err => console.error("Error fetching books:", err));

// Display books
function displayBooks(books) {
  bookList.innerHTML = '';
  books.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <h3>${book.title}</h3>
      <p>${book.author}</p>
    `;
    card.addEventListener('click', () => showBookDetail(book));
    bookList.appendChild(card);
  });
}

// Show detail
function showBookDetail(book) {
  currentBook = book;
  detailTitle.textContent = book.title;
  detailAuthor.textContent = book.author;
  detailDescription.textContent = book.description;
  detailLikes.textContent = book.likes;
  bookDetail.style.display = 'block';
}

// Close detail
closeDetail.addEventListener('click', () => {
  bookDetail.style.display = 'none';
  currentBook = null;
});

// Like button
likeButton.addEventListener('click', () => {
  if (!currentBook) return;
  const newLikes = currentBook.likes + 1;
  fetch(`${API_URL}/books/${currentBook.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: newLikes })
  })
    .then(res => res.json())
    .then(updatedBook => {
      currentBook = updatedBook;
      detailLikes.textContent = updatedBook.likes;
      // Update allBooks array
      allBooks = allBooks.map(b => b.id === updatedBook.id ? updatedBook : b);
    });
});

// Filter by author
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allBooks.filter(book => book.author.toLowerCase().includes(query));
  displayBooks(filtered);
});

// Add new book
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(addBookForm);
  const newBook = {
    title: formData.get('title'),
    author: formData.get('author'),
    description: formData.get('description'),
    likes: 0
  };

  fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBook)
  })
    .then(res => res.json())
    .then(createdBook => {
      allBooks.push(createdBook);
      displayBooks(allBooks);
      addBookForm.reset();
    });
});
