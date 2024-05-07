import React, { useEffect, useState } from 'react';
import { Button, Rating, Spinner } from 'flowbite-react';

const App = props => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState('');
  const [yearFilter, setYearFilter] = useState(true);

  const fetchMovies = () => {
    setLoading(true);

    return fetch('http://localhost:8000/movies')
      .then(response => response.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleRatingChange = (event) => {
    setSelectedRating(event.target.value);
  };

  const handleYearChange = () => {
    setYearFilter(!yearFilter);
  };

  const filteredMovies = movies.filter((movie) =>
    movie.rating >= (selectedRating || 0)
  );

  filteredMovies.sort((movie1, movie2) => {
    if (yearFilter) {
      return movie1.year - movie2.year;
    } else {
      return movie2.year - movie1.year;
    }
  });


  return (
    <Layout>
      <Heading />
      <div className='flex mb-8 lg:mb-16'>
        <Select func={handleYearChange} options={['old', 'recent']} />
        <RatingSelect func={handleRatingChange} />
      </div>
      <MovieList loading={loading}>
        {filteredMovies.map((item, key) => (
          <MovieItem key={key} {...item} />
        ))}
      </MovieList>
    </Layout>
  );
};

const Layout = props => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        {props.children}
      </div>
    </section>
  );
};

const Heading = props => {
  return (
    <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
      <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Movie Collection
      </h1>

      <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
        Explore the whole collection of movies
      </p>
    </div>
  );
};

const Select = props => {
  return (
    <div className="max-w-screen-sm text-center">
      <label htmlFor="filterSel" className='me-3'>Sort by year:</label>
      <select id="filterSel" onChange={props.func}>
        {props.options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

const RatingSelect = props => {
  return (
    <div className="ms-3 max-w-screen-sm text-center">
      <label htmlFor="ratingSel" className='me-3'>Sort by rating:</label>
      <select id="ratingSel" onChange={props.func}>
        <option value="0">All</option>
        <option value="5">5 and up</option>
        <option value="8">8 and up</option>
      </select>
    </div>
  )
}


const MovieList = props => {
  if (props.loading) {
    return (
      <div className="text-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-y-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3">
      {props.children}
    </div>
  );
};

const MovieItem = props => {
  return (
    <div className="flex flex-col w-full h-full rounded-lg shadow-md lg:max-w-sm">
      <div className="grow">
        <img
          className="object-cover w-full h-60 md:h-80"
          src={props.imageUrl}
          alt={props.title}
          loading="lazy"
        />
      </div>

      <div className="grow flex flex-col h-full p-3">
        <div className="grow mb-3 last:mb-0">
          {props.year || props.rating
            ? <div className="flex justify-between align-middle text-gray-900 text-xs font-medium mb-2">
              <span>{props.year}</span>

              {props.rating
                ? <Rating>
                  <Rating.Star />

                  <span className="ml-0.5">
                    {props.rating}
                  </span>
                </Rating>
                : null
              }
            </div>
            : null
          }

          <h3 className="text-gray-900 text-lg leading-tight font-semibold mb-1">
            {props.title}
          </h3>

          <p className="text-gray-600 text-sm leading-normal mb-4 last:mb-0">
            {props.plot.substr(0, 80)}...
          </p>
        </div>

        {props.wikipediaUrl
          ? <Button
            color="light"
            size="xs"
            className="w-full"
            onClick={() => window.open(props.wikipediaUrl, '_blank')}
          >
            More
          </Button>
          : null
        }
      </div>
    </div>
  );
};

export default App;
