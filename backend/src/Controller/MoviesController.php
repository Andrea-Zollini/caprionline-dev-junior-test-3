<?php

namespace App\Controller;

use App\Repository\MovieRepository;
use App\Repository\GenreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class MoviesController extends AbstractController
{
    public function __construct(
        private MovieRepository $movieRepository,
        private GenreRepository $genreRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/movies', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $movies = $this->movieRepository->findAll();
        $genres = $this->genreRepository->findAll();

        
        $genreNames = [];
        foreach ($genres as $genre) {
            $genreNames[] = $genre->getName();
        }

        $data = $this->serializer->serialize([
            'movies' => $movies,
            'genres' => $genreNames,
        ], "json", ["groups" => "default"]);

        return new JsonResponse($data, json: true);
    }
}
