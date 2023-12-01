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
            ? '../image/redfullogo.png'
            : detailResult.posters.split('|')[0];
        li.style.backgroundImage = `url(${poster})`;
        //클릭 이벤트 -> 영화 상세 페이지로 이동
        li.addEventListener('click', () => {
            location.href = `searchResult.html?movieId=${detailResult.movieId}&movieSeq=${detailResult.movieSeq}`;
        });

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
