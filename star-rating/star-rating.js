//css 클래스가 star-rating인 모든 요소 선택해 NodeList에 저장
const containers = document.querySelectorAll(".starrating");

const teststar = document.getElementById("textstar");

result = 0;

function score(num) {
  if (num == 9) {
    return 1;
  } else if (num == 7) {
    return 2;
  } else if (num == 5) {
    return 3;
  } else if (num == 3) {
    return 4;
  } else if (num == 1) {
    return 5;
  }
}

//forEach 메서드 사용 -> NodeList의 각 요소에 대해 함수 실행
//각 반복에서 container 현재 처리 중인 요소
containers.forEach((container) => {
  //현재 마우스가 올려진 요소의 인덱스 저장 변수
  let indexState = -1;
  //클릭된 요소의 인덱스 저장 변수
  let clickState = -1;

  //마우스가 요소 위로 이동할 때
  container.addEventListener("mouseover", (e) => {
    //container의 자식 요소들을 배열로 변환
    const nodes = [...container.children];
    //현재 마우스 이벤트가 발생한 요소의 인덱스 찾기
    const index = nodes.indexOf(e.target);

    //현재 이벤트가 I 태그(별점 아이콘)인지 확인
    if (e.target.nodeName === "I") {
      //현재 마우스 위치의 인덱스가 이전에 저장된 인덱스와 다를 경우
      if (indexState !== index) {
        //현재 마우스 위치가 이전 위치보다 오른쪽
        if (indexState < index) {
          //해당 인덱스까지 별 아이콘에 클래스 추가
          for (let i = 0; i <= index; i++) {
            nodes[i].classList.add("hovered");
          }
        } else {
          //왼쪽
          //클래스 제거
          for (let i = indexState; index <= i; i--) {
            nodes[i].classList.remove("hovered");
          }
        }
        //마지막으로 현재 인덱스 저장해 다음 이벤트 비교에 사용
        indexState = index;
      }
    }
  });

  //마우스가 요소에서 벗어날 때
  container.addEventListener("mouseout", (e) => {
    //마우스가 요소를 벗어났으므로 재설정
    indexState = -1;

    //이벤트 발생 시점에서 요소 자식들 배열로 저장
    const nodes = [...container.children];

    //마우스가 벗어난 지점의 인덱스 찾기
    const index = nodes.indexOf(e.target);

    //마우스가 위치한 지점까지 별 아이콘에서 클래스 제거
    for (let i = 0; i <= index; i++) {
      nodes[i].classList.remove("hovered");
    }
  });

  //클릭 이벤트에 대한 이벤트 리스너
  container.addEventListener("click", (e) => {
    console.log("C!!");
    //클릭 이벤트가 발생한 시점에서 요소의 자식들 배열로 저장
    const nodes = [...container.children];
    //클릭된 지점의 인덱스 찾기
    const index = nodes.indexOf(e.target);
    console.log("in");
    console.log(index);
    result = score(index);
    console.log("re");
    console.log(result);
    teststar.innerText = result+"⭐";

    //클릭된 요소가 별 아이콘인지 확인
    if (e.target.nodeName === "I") {
      //현재 클릭된 별과 이전 클릭된 별의 인덱스 다를 경우
      if (clickState !== index) {
        //현재 클릭된 별이 이전에 클릭된 별보다 오른쪽
        if (clickState < index) {
          //해당 인덱스까지 클래스 추가
          for (let i = 0; i <= index; i++) {
            nodes[i].classList.add("selected");
          }
        } else {
          //왼쪽
          //클래스 제거
          for (let i = clickState; index < i; i--) {
            nodes[i].classList.remove("selected");
          }
        }
        //현재 클릭된 별의 인덱스 저장해 다음 클릭과 비교
      }
    }
  });
});
