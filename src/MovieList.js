import InfiniteScroll from "react-infinite-scroll-component";
import MovieCard from "./MovieCard";
import { useMovie } from "./MovieContext";
import Spinner from "./Spinner";
import ScrollToTop from "./ScrollToTop";

function MovieList() {
  const { movies, isLoading, loadMoreMovies, totalResults } = useMovie();
  return (
    <>
      <InfiniteScroll
        className="container"
        dataLength={movies.length}
        next={loadMoreMovies}
        hasMore={movies.length === 0 || movies.length < totalResults}
        endMessage={<h2>All results loaded</h2>}
      >
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie.imdbID} />
        ))}
        {movies.length > 0 ? <ScrollToTop /> : ""}
      </InfiniteScroll>

      {isLoading && <Spinner />}
    </>
  );
}

export default MovieList;
