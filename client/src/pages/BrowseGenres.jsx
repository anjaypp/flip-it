import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/common/Card";

const BASE_URL = "http://localhost:3000";

const BrowseGenres = () => {
    const [books, setBooks] = useState([]); // Ensure initial state is an array
    const [loading, setLoading] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState(null);

    useEffect(() => {
        axios
            .get(`${BASE_URL}/api/book/books`)
            .then((response) => {
                console.log("Books data:", response.data); // Debugging log
                // Ensure `response.data` is an array
                setBooks(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching books:", error);
                setBooks([]); // Set as empty array on error
                setLoading(false);
            });
    }, []);

    const handleGenreChange = (genre) => {
        setSelectedGenre(genre);
    };

    // Filter books based on selected genre
    const filteredBooks = selectedGenre
        ? books.filter((book) =>
              book.categories && book.categories.includes(selectedGenre)
          )
        : books;

    if (loading) {
        return <p>Loading books...</p>;
    }

    if (!Array.isArray(filteredBooks) || filteredBooks.length === 0) {
        return <p>No books available for the selected genre.</p>;
    }

    return (
        <div>
            <h2>Browse by Genre</h2>

            <div className="genre-sort">
                <button onClick={() => handleGenreChange(null)}>All Genres</button>
                <button onClick={() => handleGenreChange("Fiction")}>Fiction</button>
                <button onClick={() => handleGenreChange("Non-Fiction")}>Non-Fiction</button>
                <button onClick={() => handleGenreChange("Thrillers")}>Thrillers</button>
                <button onClick={() => handleGenreChange("Children")}>Children</button>
            </div>

            <div className="book-grid">
                {filteredBooks.map((book) => (
                    <Card
                        key={book._id}
                        coverImage={book.coverImage}
                        categories={book.categories}
                        title={book.title}
                        author={book.author}
                        bookId={book._id}
                    />
                ))}
            </div>
        </div>
    );
};

export default BrowseGenres;
