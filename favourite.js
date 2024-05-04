let favMovies = JSON.parse(localStorage.getItem('favourites'));
const url = 'http://www.omdbapi.com/?apikey=169eb3c5 ';

function fetchMovies(){
    let body = document.querySelector('body');
    let elem = document.createElement('div');
    elem.id = 'loading';
    let p = document.createElement('p');
    p.innerHTML = 'Loading...';
    elem.appendChild(p);
    body.append(elem);
    favMovies = JSON.parse(localStorage.getItem('favourites'));
    if(favMovies.length == 0){
        let elem = document.querySelector('#loading p');
        elem.innerHTML = 'No movies are added to favourites yet, click here to go back.';
        elem.addEventListener('click', () => {
            window.close();
        })
    }else{
        if(document.getElementById('loading')){
            setTimeout(() => {
                document.getElementById('loading').remove();
            }, 1000)
        }
    
        document.querySelector('#container').addEventListener('click', () => {
            window.close();
        })

        let movieContainer = document.getElementById('movies-container');
        movieContainer.innerHTML = '';
    
        favMovies.forEach(movieID => {
            getDetails(movieID);
        })
    }
}

async function getDetails(movieID){
    let res = await fetch(url+`&i=${movieID}`, {method: 'GET'});

    let data = await res.json();
    
    if(!data.Error){

        console.log(data);

        let movieContainer = document.getElementById('movies-container');

        let card = document.createElement("div");
        card.classList.add('card', movieID);
        movieContainer.appendChild(card);

        let poster = document.createElement('div');
        poster.classList.add('poster');
        card.appendChild(poster);
        
        let favouriteIcon = document.createElement('i');
        
        favouriteIcon.classList.add('fav', 'fa-solid', 'fa-heart');
        
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
            const win = window.open('movieDetails.html', '_blank');
            win.focus();
        })

        favouriteIcon.addEventListener('click', () => {
            removeFav(movieID);
            fetchMovies();
        });
    }
}

function removeFav(movieID){
    const index = favMovies.indexOf(movieID);
    favMovies.splice(index, 1);
    localStorage.setItem('favourites', JSON.stringify(favMovies));
}

fetchMovies();