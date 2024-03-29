import { useEffect, useState } from "react";
import { useMovie } from "./MovieContext";
import BookmarkEmpty from "./assets/bookmark-empty.svg";
import BookmarkFull from "./assets/bookmark-full.svg";

function Bookmark({ imdbid, title, poster, year }) {
  const { favorites, dispatch } = useMovie();
  const [isFavorite, setIsFavorite] = useState(false);

  function handleBookmark() {
    if (isFavorite) {
      if (window.confirm("Are you sure you want to remove?")) {
        dispatch({ type: "delFavorite", payload: imdbid });
      }
    } else {
      dispatch({
        type: "addFavorite",
        payload: { imdbid, note: "", title, poster, year },
      });
    }
  }

  function handleChange(note) {
    if (!isFavorite) {
      dispatch({
        type: "addFavorite",
        payload: { imdbid, note, title, poster, year },
      });
    } else {
      dispatch({
        type: "updateNote",
        payload: { imdbid, note },
      });
    }
  }

  // check if movie is already in favorites list
  useEffect(() => {
    setIsFavorite(favorites.some((el) => el.imdbid === imdbid));
  }, [favorites, imdbid]);

  return (
    <div className="bookmark">
      <p onClick={handleBookmark}>
        {isFavorite ? (
          <span>
            <img src={BookmarkFull} alt="full bookmark icon" /> Remove movie
          </span>
        ) : (
          <span>
            <img src={BookmarkEmpty} alt="empty bookmark icon" /> Save movie
          </span>
        )}
      </p>
      <textarea
        placeholder="optional note"
        value={favorites.filter((el) => el.imdbid === imdbid)[0]?.note || ""}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}

export default Bookmark;
