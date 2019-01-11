let moviesList = [];
let favouriteMovies = [];
function getMovies() {
	return fetch('http://localhost:3000/movies').then(
		response =>{
		  if(response.ok){         
				  return response.json();          
		  }
		  else if(response.status == 404){
			  return Promise.reject(new Error('Invalid URL'))
		  }
		  else if(response.status == 401){
			  return Promise.reject(new Error('UnAuthorized User...'));
		  }
		  else{
			  return Promise.reject(new Error('Internal Server Error'));
		  } }).then(moviesListResponse =>{
			moviesList = moviesListResponse;  
			  displaymoviesList(moviesList);
			  return moviesListResponse;
	  	}).catch(error =>{const errorEle = document.getElementById('errormovieName');
			errorEle.innerHTML = `<h2 style='color:red'>${error.message}</h2>`
			return error;
	  	})
}

function getFavourites() {
	return fetch('http://localhost:3000/favourites').then(response =>{
		  if(response.ok){         
				  return response.json();          
		  }
		  else if(response.status == 404){
			  return Promise.reject(new Error('Invalid URL'))
		  }
		  else if(response.status == 401){
			  return Promise.reject(new Error('UnAuthorized User...'));
		  }
		  else{
			  return Promise.reject(new Error('Internal Server Error'));
		  }}).then(favouriteMoviesResponse =>{
			favouriteMovies = favouriteMoviesResponse;  
			displayFavouriteMovies(favouriteMovies);
			return favouriteMoviesResponse;
		}).catch(error =>{
			const errorEle = document.getElementById('errorFavouriteMovie');
			errorEle.innerHTML = `<h2 style='color:red'>${error.message}</h2>`
			return error;
	  	}
	  )
}

function addFavourite(id) {
    let movieName = moviesList.find(movie =>{
        if(movie.id == id){
            return movie;
        }
    });
    let favExists = favouriteMovies.find(favMovie => {
        if( favMovie.id == movieName.id ){
            return favMovie;
        }
    });
    if(favExists) {
        return Promise.reject(new Error('Movie is already added to favourites'));
    }else{
		return fetch(`http://localhost:3000/favourites`,{
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(movieName)
		}
		).then(response => {
				if(response.ok){
					return response.json();
				}
			}
		).then(addedMovie => {
				favouriteMovies.push(addedMovie);
				displayFavouriteMovies(favouriteMovies);
				return favouriteMovies;
			}
		)
	}
}

function displaymoviesList(moviesList){
	const ele =   document.getElementById('moviesList');
	let htmlString = '';
	
	moviesList.forEach(movie => {
		htmlString += `
        SerialNumber<li>${movie.id}</li>
			  Title<li>${movie.title}</li>
        <img src='${movie.posterPath}' />
        <li><button class='btn btn-primary' onclick='addFavourite(${movie.id})'>AddToFavourites</button><li>
		`
	});
  
	ele.innerHTML = htmlString;
}

function displayFavouriteMovies(favouriteMovies){
	//DOM manipulation
	const ele =   document.getElementById('favouritesList');
	let htmlString = '';
	
	favouriteMovies.forEach(movie => {
		htmlString += `
        SerialNumber<li>${movie.id}</li>
			  <li>${movie.title}</li>
			  <img src='${movie.posterPath}' />
		`
	});
  
	ele.innerHTML = htmlString;
}


module.exports = {
	getMovies,
	getFavourites,
	addFavourite
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution


