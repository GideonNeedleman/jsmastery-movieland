import { createContext, useContext, useEffect, useReducer } from "react";

const MovieContext = createContext();
const API_URL = "https://www.omdbapi.com/?apikey=";
const API_KEY = "68ecbe5d";

const initialState = {
  movies: [], //array of movie results
  favorites: [], //array of favorited movies, also in localstorage
  searchTerm: "", //the search term
  isLoading: false, //true during async fetch
  error: "", //error message
  maxPages: null, //track total pages from fetch results
  currentPage: null, //track current page
};
// const storedFavorites = JSON.parse(localStorage.getItem("favorites"));

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "loaded":
      return {
        ...state,
        isLoading: false,
      };
    case "setSearchTerm":
      return {
        ...state,
        searchTerm: action.payload,
      };
    case "loadMovies":
      return {
        ...state,
        movies: action.payload.Search,
        error: "",
        maxPages: Math.trunc(action.payload.totalResults / 10),
        currentPage: 1,
      };
    case "error":
      return {
        ...state,
        error: action.payload,
      };
    case "clearMovies":
      return {
        ...state,
        movies: [],
        error: "",
        maxPages: 0,
        currentPage: 0,
      };
    case "addFavorite":
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    default:
      throw new Error("Unknown action type");
  }
}

function MovieProvider({ children }) {
  const [
    { movies, favorites, searchTerm, isLoading, error, maxPages, currentPage },
    dispatch,
  ] = useReducer(reducer, initialState, () => {
    const storedValue = localStorage.getItem("favorites");
    return storedValue
      ? { ...initialState, favorites: JSON.parse(storedValue) }
      : initialState;
  });

  // useEffect to save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  async function searchMovies(title) {
    if (title.length === 0) return;

    // possible try catch block to catch errors
    dispatch({ type: "loading" });
    const res = await fetch(`${API_URL}${API_KEY}&s=${title}`);
    const data = await res.json();
    dispatch({ type: "loaded" });

    if (data.Response === "True")
      dispatch({ type: "loadMovies", payload: data });
    else dispatch({ type: "error", payload: data.Error });
  }

  return (
    <MovieContext.Provider
      value={{
        movies,
        favorites,
        searchTerm,
        isLoading,
        error,
        maxPages,
        currentPage,
        searchMovies,

        dispatch,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

function useMovie() {
  const context = useContext(MovieContext);
  if (context === undefined)
    throw new Error("useMovie was used outside of MovieProvider");
  return context;
}

export { MovieProvider, useMovie };
