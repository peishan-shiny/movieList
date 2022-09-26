const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const movies = []
const MOVIE_PER_PAGE = 12
const pagnator = document.querySelector('#pagnator')
let filteredMovie = []

//API拿電影清單資料進函式
axios
  .get(INDEX_URL)
  .then(response => {
    //console.log(response.data.results)
    movies.push(...response.data.results)
    console.log(movies)
    renderPagnator(movies.length)
    showDataPanel(getMovieByPage(1))
  })

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
            <a class="btn btn-info btn-add-favorite" data-id="${data[i].id}">+</a>
          </div>
        </div>
      </div>
    `
  }
  dataPanel.innerHTML = showDataPanelHTML
}

//將movies電影清單切割
function getMovieByPage(page) {
  const sliceBegin = (page - 1) * MOVIE_PER_PAGE
  const sliceEnd = sliceBegin + MOVIE_PER_PAGE
  const data = filteredMovie.length ? filteredMovie : movies
  return data.slice(sliceBegin, sliceEnd)
}

//顯示pag頁面，共有幾頁
function renderPagnator(amount) {
  const pagCount = Math.ceil(amount / MOVIE_PER_PAGE)
  let renderPagnatorHTML = ''
  for (let i = 1; i < pagCount + 1; i++) {
    renderPagnatorHTML += `
      <li class="page-item"><a class="page-link" data-pag="${i}" href="#">${i}</a></li>
    `
  }
  pagnator.innerHTML = renderPagnatorHTML
}

//點擊pag會有相對應的電影頁面
pagnator.addEventListener('click', function clickPag(event) {
  const pag = Number(event.target.dataset.pag)
  showDataPanel(getMovieByPage(pag))
})

//在父層新增監聽事件，判斷是否案到此按鈕，將按鈕裡的dataset放進函式
dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    //console.log(Number(event.target.dataset.id))
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addFavorite(Number(event.target.dataset.id))
  }
})

//將dataset資料帶入，核對id =>將點到的id與電影清單id核對，選到後拿取此資料
function addFavorite(id) {
  //console.log(id)

  function findSameId(movie) {
    if (movie.id === id) {
      //console.log(movie)
      return true
    }
  }

  const favoriteMovie = movies.find(findSameId)
  //第一次使用收藏功能時，此時 local storage 是空的，會取回 null 值，因此favoriteMovieList會得到一個空陣列
  const favoriteMovieList = JSON.parse(localStorage.getItem('favoriteMovie')) || []

  //重複的電影不可再加入favoriteMovieList
  function repeatId(movie) {
    if (movie.id === id) {
      alert('電影已在清單中')
      return true
    }
  }

  const repeatIdMovie = favoriteMovieList.some(repeatId)
  if (!repeatIdMovie) {
    favoriteMovieList.push(favoriteMovie)
  }


  localStorage.setItem('favoriteMovie', JSON.stringify(favoriteMovieList))
  console.log(favoriteMovieList)
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

//搜尋功能，submit監聽放form層，取出input的value
searchForm.addEventListener('submit', function onSubmitSearch(event) {
  event.preventDefault()
  //console.log(event)
  //console.log(searchInput.value)
  checkSearchContent(searchInput.value.trim().toLowerCase())
})

//比對input裡的內容和電影清單的title，若一樣就放進一個陣列，重新render
function checkSearchContent(value) {

  for (let movie of movies) {
    if (movie.title.toLowerCase().includes(value)) {
      filteredMovie.push(movie)
    }
  }

  if (!value.length > 0) {
    alert('請輸入文字')
  }

  if (filteredMovie.length === 0) {
    alert('No Find!!')
  }
  showDataPanel(getMovieByPage(1))
  renderPagnator(filteredMovie.length)

}
