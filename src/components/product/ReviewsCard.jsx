import { useMemo, useState } from "react";
import styles from "./ReviewsCard.module.css";

import Icon from "@mui/material/Icon";
import { makeRequest } from "../../makeRequest";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useAuth } from "../../context/AuthContext";

export const ReviewsCard = ({
  reviews,
  renderStars,
  product,
  refetchReviews,
}) => {
  const { user } = useAuth();

  const [author, setAuthor] = useState(user ? user?.firstName : "");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const averageRating = useMemo(() => {
    if (!reviews?.length) return 0;

    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    ).toFixed(1);
  }, [reviews]);

  const handleStarClick = (e, value) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;

    if (x < width / 2) {
      setRating(value - 0.5);
    } else {
      setRating(value);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      await makeRequest.post("/reviews", {
        data: {
          authorName: author,
          comment,
          rating,
          approved: true,
          product: product.id,
        },
      });

      setAuthor("");
      setComment("");
      setRating(5);

      await refetchReviews();

      alert("Review submitted.");
    } catch (err) {
      console.error(err);
      console.log(err.response?.data);
    }
  };

  return (
    <section className={styles.reviews}>
      <div className={styles.list}>
        <h2>Reviews</h2>

        {reviews?.length === 0 && <p>No reviews yet.</p>}

        {reviews?.map((review) => (
          <article key={review.id} className={styles.review}>
            <strong>{review.authorName}</strong>

            <div className={styles.stars}>{renderStars(review.rating)}</div>

            <p>{review.comment}</p>
          </article>
        ))}
      </div>

      <aside className={styles.sidebar}>
        <div className={styles.average}>
          <h3>Average rating</h3>

          <div className={styles.stars}>
            {renderStars(Number(averageRating))}
          </div>

          <span>
            {averageRating} / 5 ({reviews?.length || 0} reviews)
          </span>
        </div>

        <form className={styles.form} onSubmit={handleSubmitReview}>
          <h3>Add review</h3>

          {user ? (
            <input value={author} readOnly />
          ) : (
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              required
            />
          )}

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            required
          />

          <div className={styles.starSelect}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={styles.starButton}
                onClick={(e) => handleStarClick(e, value)}
              >
                {rating >= value ? (
                  <StarIcon />
                ) : rating === value - 0.5 ? (
                  <StarHalfIcon />
                ) : (
                  <StarBorderIcon />
                )}
              </button>
            ))}
          </div>

          <button type="submit" className="button buttonLight">
            Add review
          </button>
        </form>
      </aside>
    </section>
  );
};
