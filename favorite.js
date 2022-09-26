const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const movies = JSON.parse(localStorage.getItem('favoriteMovie'))
const favorite = document.querySelector('#favorite')

// //API拿電影清單資料進函式
// axios
//   .get(INDEX_URL)
//   .then(response => {
//     //console.log(response.data.results)
//     movies.push(...response.data.results)
//     console.log(movies)
//     showDataPanel(movies)
//   })

//Navbar-favorite的連結
// favorite.addEventListener('click', function (event) {

// })

//將電影清單一一顯示出來
function showDataPanel(data) {
  let showDataPanelHTML = ''
  for (let i = 0; i < data.length; i++) {
    showDataPanelHTML += `
      <div class="col-sm-3 mt-3">
        <div class="card">
          <img src=" ${POSTER_URL + data[i].image} " class="card-img-top"
            alt="...">
          <div class="card-body">
            <h5 class="card-title">${data[i].title}</h5>
            <a href="#" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
              data-bs-target="#movie-modal" data-id="${data[i].id}">More</a>
            <a class="btn btn-danger btn-remove-favorite" data-id="${data[i].id}">X</a>
          </div>
        </div>
      </div>
    `
  }
  dataPanel.innerHTML = showDataPanelHTML
}

//在父層新增監聽事件，判斷是否案到此按鈕，將按鈕裡的dataset放進函式
dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    //console.log(Number(event.target.dataset.id))
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFavorite(Number(event.target.dataset.id))
  }
})

function removeFavorite(id) {
  function clickMovie(movie) {
    if (movie.id === id) {
      return true
    }
  }
  const removeFavoriteMovie = movies.findIndex(clickMovie)
  //console.log(removeFavoriteMovie)
  movies.splice(removeFavoriteMovie, 1)
  localStorage.setItem('favoriteMovie', JSON.stringify(movies))
  showDataPanel(movies)
}

//將dataset資料帶入，API拿電影詳細資料後顯示在modal上
function showMovieModal(id) {
  const movieTitle = document.querySelector('#movieTitle')
  const movieImage = document.querySelector('#movieImage')
  const movieDate = document.querySelector('#movieDate')
  const movieDescript = document.querySelector('#movieDescript')

  axios
    .get(INDEX_URL + id)
    .then(response => {
      //console.log(response.data.results)
      const data = response.data.results
      movieTitle.innerText = data.title
      movieDate.innerText = data.release_date
      movieDescript.innerText = data.description
      //movieImage.innerHTML = `<img src="${POSTER_URL + data.image}">`
      movieImage.src = POSTER_URL + data.image
    })
    .catch(error => console.log(error))
}

showDataPanel(movies)