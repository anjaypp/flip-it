import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Card.module.css";

const Card = ({ coverImage, categories, title, author, bookId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.cardImage}>
        <img
          src={coverImage}
          alt={title}
          className={styles.cardImage}
        />
      </div>
      <div className={styles.category}>{categories[0]}</div>
      <div className={styles.heading}>
        {title}
        <div className={styles.author}>
          By <span className={styles.name}>{author}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
