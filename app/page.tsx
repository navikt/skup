import React from 'react';

const movies = [
    { title: 'Fagtorsdag', description: 'A mind-bending thriller by Christopher Nolan.' },
    { title: 'Delingsfredag', description: 'A sci-fi classic that questions reality.' },
    { title: 'Mangfold i mai', description: 'A journey through space and time.' },
    { title: 'Allmøter', description: 'A gritty and realistic take on Batman.' },
    { title: 'NITD', description: 'A Quentin Tarantino masterpiece.' },
];

export default function MainSection() {
    return (
        <div className="container mx-auto pt-6 pb-12">
            <h1 className="text-4xl font-bold mb-8">Opptak</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie, index) => (
                    <a key={index} href="#" className="block w-full">
                        <div className="bg-white shadow-lg rounded-lg p-6 w-full transform transition-transform hover:scale-105 hover:bg-gray-100 h-full flex flex-col">
                            <h2 className="text-2xl font-semibold mb-2">{movie.title}</h2>
                            <p className="text-gray-700 line-clamp-2">{movie.description}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}