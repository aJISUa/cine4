import { getMovieInfo } from './api/movieApi.js';

//DOM 요소 선택
const title = document.querySelector('.movie-title');
const titleEng = document.querySelector('.sub-movie-title');
const poster = document.querySelector('.poster-card');
const release = document.querySelector('.release');
const director = document.querySelector('.director');
const actor = document.querySelector('.actor');
const genre = document.querySelector('.genre');
const runtime = document.querySelector('.runtime');
const rating = document.querySelector('.rating');
const summary = document.querySelector('.movie-summary>dd');
const postReview = document.querySelector('.container-review-btn>button');

/*현재 페이지의 URL에서 movieId와 movieSeq 파라미터 값 가져오기
여러 페이지 간 정보 전달하거나 특정 영화에 대한 추가 데이터 요청*/
//현재 페이지의 URL에서 쿼리 문자열 가져오기
//URL의 물음표(?) 이후의 부분이 쿼리 문자열, 페이지에 전달된 매개변수 포함
const queryString = window.location.search;
//URLSearchParams 객체 생성 <- 쿼리 문자열을 다루기 쉽게
const params = new URLSearchParams(queryString);
//파라미터 값 가져오기
const movieId = params.get('movieId');
const movieSeq = params.get('movieSeq');
const loading = document.querySelector('.wrapper-etc');

//리뷰 작성 버튼 이벤트 리스너
//클릭 시 해당 영화의 평점 작성 페이지로 이동
postReview.addEventListener('click', () => {
    window.location.href = `../pages/writePost.html?movieId=${movieId}&movieSeq=${movieSeq}`;
});

//페이지 로드 -> 이벤트 리스너 추가
window.addEventListener('load', async () => {
    //두 객체 모두 null이 아닌 경우에만 실행
    //URL에서 객체 추출해 해당 값 유효한지 확인하는 조건문
    if (movieId !== null && movieSeq !== null) {
        //영화 정보 얻어오는 함수(개별 영화 정보)
        //사용해 서버로부터 해당하는 데이터 가져오기
        const movieInfo = await getMovieInfo({
            movieId: movieId,
            movieSeq: movieSeq,
        });

        //가져온 영화 정보 객체의 TotalCount가 0인 경우
        //해당하는 영화 없다는 것 의미
        if (movieInfo.TotalCount === 0) {
            location.href = '/pages/notFound.html';
        }

        //가져온 영화 정보 화면에 표시 위해 함수 호출
        showValue(movieInfo);
    }

    //로딩 나타내는 요소에 클래스 추가해 로딩 숨기기
    loading.classList.add('disabled');
});

//함수 영화 정보 받아와 해당 정보를 화면에 표시
//특정 클래스 요소에 텍스트 콘텐츠 삽입 방식으로 표시
const showValue = (movie) => {
    //영화 제목
    title.textContent = movie.title;
    //영화 영어 제목 설정
    if (movie.titleEng === '') {
        titleEng.textContent = movie.titleOrg;
    } else {
        titleEng.textContent = movie.titleEng;
    }

    //포스터 이미지 설정
    if (movie.posters !== '') {
        poster.src = movie.posters.substring(0, 60);
    } else {
        poster.src = '../assets/images/post_default.jpg';
    }

    //개봉일
    if (movie.repRlsDate === '') {
        release.textContent = movie.prodYear;
    } else {//YYYY.MM.DD 형식으로 설정
        release.textContent =
            movie.repRlsDate.slice(0, 4) +
            '.' +
            movie.repRlsDate.slice(4, 6) +
            '.' +
            movie.repRlsDate.slice(6);
    }

    //감독
    if (movie.directors.director[0].directorNm === '') {
        director.textContent = '정보 없음';
    } else {//비어 있지 않다면 첫 번째 감독의 이름 사용
        director.textContent = movie.directors.director[0].directorNm;
    }

    //배우
    let actorBox = '';
    if (!movie.actors.actor[0].actorNm) {
        actor.textContent = '정보 없음';
    } else {//비어 있지 않다면 모든 배우 이름 |로 구분하여 표시
        for (let i = 0; i < movie.actors.actor.length; i++) {
            actorBox += movie.actors.actor[i].actorNm;
            actorBox += ' | ';
        }
        actor.textContent = actorBox.slice(0, -2);
    }

    //장르
    if (movie.genre === '') {
        genre.textContent = '정보 없음';
    } else {//비어 있지 않다면 ,를 |로 대체해서 표시
        genre.textContent = movie.genre.replace(/,/g, ' | ');
    }

    //런타임
    if (movie.runtime === '') {
        runtime.textContent = '정보 없음';
    } else {
        runtime.textContent = movie.runtime + '분';
    }

    //평점
    if (movie.rating === '') {
        rating.textContent = '정보 없음';
    } else {
        rating.textContent = movie.rating;
    }

    //줄거리
    if (movie.plots.plot[0].plotText === '') {
        summary.textContent = '줄거리가 제공되지 않습니다 :)';
    } else {
        summary.textContent = movie.plots.plot[0].plotText;
    }
};
