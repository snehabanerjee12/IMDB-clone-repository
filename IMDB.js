const url = ' https://www.omdbapi.com/?apikey=169eb3c5';
let movieName = [];
var favArray = [];
let favmovies = localStorage.getItem('favourites');

document.getElementById('favourites').addEventListener('click', () => {
    const win = window.open('favourite.html', '_blank');
    win.focus();
})

if(!favmovies){
    localStorage.setItem('favourites', JSON.stringify(favArray));
}


const searchMovie = document.querySelector('input[type=text]');
searchMovie.addEventListener('input', (event) => {
    movieName = event.target.value;
    getMovie(movieName);
});

async function getMovie(movieName){
    let res = await fetch(url+`&t=${movieName}`, {method: 'GET'});
    let data = await res.json();
    let movieContainer = document.getElementById('movie-container');
    console.log(data);

    movieContainer.innerHTML = '';

    if(!data.Error){

        let card = document.createElement('div');
        card.classList.add('card');
        movieContainer.appendChild(card);

        let poster = document.createElement('div');
        poster.classList.add('poster');
        card.appendChild(poster);

        let favouriteMovies = JSON.parse(localStorage.getItem('favourites'));
        console.log(favouriteMovies);
        let favouriteIcon = document.createElement('i');
        let bool = false;
        getFavIcon(data.imdbID, favouriteMovies, favouriteIcon);
        
        favouriteIcon.addEventListener('click', () => {
            alterFavIcon(data.imdbID, favouriteMovies, favouriteIcon);
        });
        movieContainer.appendChild(favouriteIcon);

        let posterImage = document.createElement('img');
        posterImage.src = data.Poster;
        posterImage.alt = 'Movie Poster';
        poster.appendChild(posterImage);

        let details = document.createElement('div');
        details.classList.add('details');
        card.appendChild(details);

        let title = document.createElement('h1');
        title.classList.add('title');
        title.innerHTML = data.Title;
        details.appendChild(title);

        let director = document.createElement('h3');
        director.classList.add('director');
        director.innerHTML = data.Director;
        details.appendChild(director);

        let ratingDiv = document.createElement('div');
        ratingDiv.classList.add('rating');
        details.appendChild(ratingDiv);
        const rating = data.imdbRating/2;
        
        let ratingSpan = document.createElement('span');
        ratingSpan.innerHTML = `${rating.toFixed(1)}/5`;
        ratingDiv.appendChild(ratingSpan);

        let tagsDiv = document.createElement('div');
        tagsDiv.classList.add('tags');
        details.appendChild(tagsDiv);
        let genres = data.Genre.split(', ');
        genres.forEach(elem => {
            let genreSpan = document.createElement('span');
            genreSpan.innerHTML = elem;
            tagsDiv.appendChild(genreSpan);
        });

        let reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review');
        reviewDiv.innerHTML = data.Plot.substring(0, 200) + '...';
        details.appendChild(reviewDiv);
        

         card.addEventListener('click', () => {
            localStorage.setItem('movieDetails', data.imdbID);
            const win = window.open('MovieDetails.html', '_blank');
            win.focus();
         });
    }
}

function alterFavIcon(imdbID, favouriteMovies, favouriteIcon){
    favouriteIcon.className = '';
    let bool = true;
    for(let i=0; i<favouriteMovies.length; i++){
        if(favouriteMovies[i] == imdbID){
            favouriteMovies.splice(i, 1);
            bool = false;
            favouriteIcon.classList.add('fav', 'fa-regular', 'fa-heart');
            break;
        }
    }
    if(bool){
        favouriteMovies.push(imdbID);
        favouriteIcon.classList.add('fav', 'fa-solid', 'fa-heart');
    }
    localStorage.setItem('favourites', JSON.stringify(favouriteMovies));
}

function getFavIcon(imdbID, favouriteMovies, favouriteIcon){
    favouriteMovies.forEach(elem => {
        if(imdbID == elem){
            favouriteIcon.classList.add('fav', 'fa-solid', 'fa-heart');
            return;
        }
    })
    favouriteIcon.classList.add('fav', 'fa-regular', 'fa-heart');
}
