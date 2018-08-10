let size = 3;
let isWinGame = false;
let arrNumber = [];
let $gameArea = $('#gameArea');
let emptySquarePos = -1;
let gameAreaSize = 300;
let moveCount = 0;
let timePassed = 0;

$(() => {
  $('#selectLevelGame').change(changeSize);
  $('#btnNewGame').click(startGame);
  $('#moveCount').text(moveCount);
  $('#timeLeft').text(timePassed);
  setInterval(makeTimer, 1000);
  startGame();
})

function changeFormatTime(seconds){
  if(seconds < 60) return seconds;
  if(seconds < 60 * 60) return `${Math.floor(seconds/60)} : ${seconds%60}`;
  return `${Math.floor(seconds/3600)} : ${Math.floor((seconds%3600)/60)} : ${seconds % 3600 % 60}`
}

function makeTimer(){
  if(isWinGame) return;
  timePassed++;
  $('#timeLeft').text(changeFormatTime(timePassed));
}

function changeSize(e){
  let val = e.target.value;
  size = Number(val);
  gameAreaSize = 100 * size;
}

function resetNewGame(){
  isWinGame = false;
  moveCount = 0;
  timePassed = 0;
  $('#timeLeft').text(0);
  $('#moveCount').text(0);
}

function startGame(){
  resetNewGame();
  arrNumber = createArrNum();
  let gridTemplate = '';
  for(let i = 1; i <= size; i++) gridTemplate += 'auto ';
  $gameArea.html('').css({
    width: gameAreaSize,
    height: gameAreaSize,
    gridTemplateColumns: gridTemplate
  });
  for(let i = 0; i < arrNumber.length; i++){
    let val = arrNumber[i];
    let $square;
    if(val == Math.pow(size, 2)){
      emptySquarePos = i; 
      $square = $(`<div class="square"></div>`);
    }
    else $square = $(`<div class="square">${val}</div>`);
    $gameArea.append($square);
    $square.click(handleClickSquare);
  }
}

function handleClickSquare(e){
  if(isWinGame) return;
  let $clickedEle = $(e.target);
  let val = $clickedEle.text();
  if(val == '') return;
  let clickedPos = arrNumber.findIndex(num => Number(val) == num);
  if(!checkAdjacent(clickedPos)) return;
  moveCount++;
  $('#moveCount').text(moveCount);
  $clickedEle.text('');
  $('#gameArea').find('.square').eq(emptySquarePos).text(val);
  arrNumber[clickedPos] = Math.pow(size, 2);
  arrNumber[emptySquarePos] = Number(val);
  emptySquarePos = clickedPos;
  if(checkWinGame(arrNumber)) {
    isWinGame = true;
    setTimeout(showAlertSuccess, 50);
  }
}

function checkAdjacent(clickedPos){
  if(Math.abs(clickedPos - emptySquarePos) == size) return true;
  if(Math.abs(clickedPos - emptySquarePos) == 1){
    if(clickedPos > emptySquarePos && clickedPos % size != 0) return true; 
    if(clickedPos < emptySquarePos && emptySquarePos % size != 0) return true; 
  }
  return false;
}

function createArrNum(){
  let arr = [];
  do{
    let arrTemp = [];
    for(let i = 0; i < Math.pow(size, 2) - 1; i++) arrTemp.push(i + 1);
    arr = shuffleArray(arrTemp);
  }while(!checkCanBeWon(arr));
  arr.push(Math.pow(size, 2));
  return arr;
}

function shuffleArray(arr){
  let length = arr.length;
  for(let i = 0; i < length; i++){
    let randomNum = Math.floor(Math.random() * length);
    let temp = arr[i];
    arr[i] = arr[randomNum];
    arr[randomNum] = temp;
  }
  return arr;
}

function checkCanBeWon(arr){
  let count = 0;
  for(let i = 0; i < arr.length; i++){
    for(let j = i + 1; j < arr.length; j++){
      if(arr[j] < arr[i]) count++;
    }
  }
  if(count % 2 == 0) return true; return false;
}

function checkWinGame(arr){
  for(let i = 0; i < Math.pow(size, 2); i++){
    if(arr[i] != i + 1) return false;
  }
  return true;
}

function showAlertSuccess(){
  swal({
    title: "Good job!",
    text: "You have won this game!",
    icon: "success",
    timer: 4000
  });
}
