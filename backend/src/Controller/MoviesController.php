<?php

namespace App\Controller;

use App\Repository\MovieRepository;
use App\Repository\GenreRepository;
use App\Repository\MovieGenreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class MoviesController extends AbstractController
{
    public function __construct(
        private MovieRepository $movieRepository,
        private GenreRepository $genreRepository,
        private SerializerInterface $serializer,
    ) {}

    #[Route('/movies', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $movies = $this->movieRepository->findAll();
        $genres = $this->genreRepository->findAll();

        $genreObjects = [];
        foreach ($genres as $genre) {
            $genreObjects[] = [
                'id' => $genre->getId(),
                'name' => $genre->getName(),
            ];
        }

        $movies_genres = [];
        foreach($movies as $movie) {
            $genresData = [];

            $genres = $movie->getMovieGenres();
            foreach($genres as $movieGenre) {
                $genre = $movieGenre->getGenre();
                $genreName = $genre->getName();
                $genresData[] = $genreName;
            }

            $movies_genres[$movie->getId()] = $genresData;
        }

        $data = $this->serializer->serialize([
            'movies' => $movies,
            'genres' => $genreObjects,
            'movies_genres' => $movies_genres,
        ], "json", ["groups" => "default"]);

        return new JsonResponse($data, json: true);
    }
}
