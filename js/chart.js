import { getBoxOfficeList } from './api/boxOfficeApi.js';
import { getMovieInfo } from './api/movieApi.js';


const loadingItem = document.querySelectorAll('.loading');

// 일별 박스 오피스 값을 넣어 영화 상세 결과값을 얻어내기
//배열을 받아 영화에 대한 상세 정보 얻기
const movieDetail = async (boxOfficeResult) => {
    //배열 순회하며 영화에 대한 상세 정보 얻어오기
    boxOfficeResult.forEach(async (movie) => {
        let detailResult;
        const title = movie.movieNm.replace(/ /g, '');//영화명에서 공백 제거
        const releaseDts = movie.openDt.replace(/-/gi, '');//개봉일에서 - 제거
        
        detailResult = await getMovieInfo({
            title: title,
            releaseDts: releaseDts,
        });

        // 만약 검색한 결과 값이 없을 경우 검색 조건을 바꿔서 한 번 더 시도
        if (detailResult.TotalCount === 0) {
            detailResult = await getMovieInfo({
                title: title,
                releaseDte: releaseDts,
            });
        }

        setMovieDetail(movie, detailResult);
    });
};


// 영화상세정보를 받아와 화면에 표시하는 함수
const setMovieDetail = async (movie, detailResult) => {
    //해당 영화의 순위에 해당하는 li 엘리먼트 찾기
    const li = document.getElementById(`rank${movie.rank}`);
    //영화 포스터를 li 엘리먼트의 배경 이미지로 설정
    if (li instanceof HTMLLIElement) {
        const poster = detailResult.posters.split('|')[0] === ''
            ? '../assets/images/post_default.jpg'
            : detailResult.posters.split('|')[0];
        li.style.backgroundImage = `url(${poster})`;
        //클릭 이벤트 -> 영화 상세 페이지로 이동
        li.addEventListener('click', () => {
            location.href = `searchResult.html?movieId=${detailResult.movieId}&movieSeq=${detailResult.movieSeq}`;
        });

        //상세 정보 표시
        //각 엘리먼트를 찾아 각각에 대한 텍스트 설정
        const movieTitle = li.querySelector('#movie-title');
        const movieEngTitle = li.querySelector('#movie-title-eng');
        const textRelease = li.querySelector('#text-release');
        const textDirector = li.querySelector('#text-director');
        const textActor = li.querySelector('#text-actor');
        const textGenre = li.querySelector('#text-genre');

        //각 정보를 표시하고, 정보가 없는 경우 처리
        if (movieTitle instanceof HTMLElement) {
            movieTitle.textContent = `${movie.movieNm}`;
        }
        if (movieEngTitle instanceof HTMLSpanElement) {
            movieEngTitle.textContent = `${detailResult.titleEng}`;
        }
        if (textRelease instanceof HTMLElement) {
            if (movie.openDt !== '') {
                const dates = movie.openDt;
                let dateText = '';
                for (let date of dates) {
                    dateText += date.split('-').join('.');
                }
                textRelease.textContent = `${dateText}`;
            }
            else {
                textRelease.textContent = '정보 없음';
            }
        }
        if (textDirector instanceof HTMLElement) {
            if (detailResult.directors.director[0].directorNm !== '') {
                textDirector.textContent = `${detailResult.directors.director[0].directorNm}`;
            }
            else {
                textDirector.textContent = '정보 없음';
            }
        }
        if (textActor instanceof HTMLElement) {
            const actors = detailResult.actors.actor;
            if (actors[0].actorNm !== '') {
                let actorText = '';
                for (let actor of actors) {
                    actorText += actor.actorNm + ' | ';
                }
                textActor.textContent = `${actorText}`;
            }
            else {
                textActor.textContent = '정보 없음';
            }
        }
        if (textGenre instanceof HTMLElement) {
            const genres = detailResult.genre;
            if (genres !== '') {
                let genreText = '';
                for (let genre of genres) {
                    genreText += genre.split(',').join(' | ');
                }
                textGenre.textContent = `${genreText}`;
            }
            else {
                textGenre.textContent = '정보 없음';
            }
        }
    }
};

//로딩 중인 요소들: loding 클래스 제거해 로딩 상태 숨기기
const hideLoading = () => {
    loadingItem.forEach((element) => {
        element.classList.remove('loading');
    });
};

//페이지가 로드되면 실행되는 이벤트 핸들러
window.addEventListener('load', async () => {
    //함수 호출해 일별 박스 오피스 결과 얻어오기
    const results = await getBoxOfficeList();
    //각 영화에 대한 상세 정보 얻어와 표시
    movieDetail(results);
    //함수 호출해 로딩 중인 상태 숨기기
    hideLoading();
});
