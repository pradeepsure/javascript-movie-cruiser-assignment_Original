let moviesList = [];
let favouriteList = [];

function getMovies() {
  fetch('http://localhost:3000/movies').then(response => {
    if (response.ok) {
      return response.json();
    }
    else if (response.status == 404) {
      return Promise.reject(new Error('Invalid URL'))
    }
    else if (response.status == 401) {
      return Promise.reject(new Error('UnAuthorized User...'));
    }
    else {
      return Promise.reject(new Error('Some internal error occured...'));
    }
  }).then(moviesResponse => {
    moviesList = moviesResponse;
    displayMovies(moviesList);
    return moviesResponse;
  }).catch(error => {
    const errorEle = document.getElementById('errorExclusiveMovie');
    errorEle.innerHTML = `<h2 style='color:red'>${error.message}</h2>`
  })
}

function displayMovies(moviesList) {
  //Display the movies in UI
  const tableEle = document.getElementById('moviesList');
  const tableBodyEle = tableEle.getElementsByTagName('tbody')[0];
  let tableBodyHTMLString = '';
  moviesList.forEach(movie => {
    tableBodyHTMLString += `
			<tr>
				<td>${movie.id}</td>
				<td>${movie.title}</td>
        <td><img src="${movie.posterPath}"/></td>
        <td><button class='btn btn-primary' onclick='addFavourite(${movie.id})'>Favourite</button></td>
			</tr>  
		  `
  });

  tableBodyEle.innerHTML = tableBodyHTMLString;
}

function displayFavourites(favouriteList) {
  //Display the movies in UI
  const tableEle = document.getElementById('favouritesList');
  const tableBodyEle = tableEle.getElementsByTagName('tbody')[0];
  let tableBodyHTMLString = '';
  console.log('favouriteList---->', favouriteList);

  favouriteList.forEach(favouriteMovie => {
    tableBodyHTMLString += `
    <tr>
      <td>${favouriteMovie.id}</td>
      <td>${favouriteMovie.title}</td>
      <td><img src="${favouriteMovie.posterPath}"/></td>
    </tr>  
    `
  });
  tableBodyEle.innerHTML = tableBodyHTMLString;
}


function addFavourite(id) {
  let movie = moviesList.find(movie =>{
    if(movie.id == id){
        return movie;
    }
  });
  let favExists = favouriteList.find(favMovie => {
  if( favMovie.id == movie.id ){
      return favMovie;
  }
  });
if(favExists) {
    // let errorEle = document.getElementById('alreadyAdded');
    // errorEle.innerHTML = `<h5 style='color:red'>Movie is already added to favourites</h5>`
    return Promise.reject(new Error('Movie is already added to favourites'));
}
else{
  return fetch(`http://localhost:3000/favourites`,{
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(movie)
    }).then(response => {
        if(response.ok){
            return response.json();
        }
    }).then(addedMovieToFav => {
      favouriteList.push(addedMovieToFav);
        displayFavourites(favouriteList);
        return addedMovieToFav;
    })
} 
}
//getFavourites
function getFavourites() {
  fetch('http://localhost:3000/favourites').then(response => {
    if (response.ok) {
      return response.json();
    }
    else if (response.status == 404) {
      return Promise.reject(new Error('Invalid URL'))
    }
    else if (response.status == 401) {
      return Promise.reject(new Error('UnAuthorized User...'));
    }
    else {
      return Promise.reject(new Error('Some internal error occured...'));
    }
  }).then(favResponse => {
    favouriteList=favResponse;
    displayFavourites(favouriteList);
    return favouriteList;
  }).catch(error => {
    const errorEle = document.getElementById('error');
    errorEle.innerHTML = `<h5 style='color:red'>${error.message}</h5>`
  })
  
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


