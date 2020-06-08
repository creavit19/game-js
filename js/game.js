game();

function game(){
  let codeToDoc = `
  <div id="game">
    <div id="head-move">Ball Shooter<span id="close-game">X</span></div>
    <div id="game-main">
      <div id="scale-l"><div id="index-l"></div></div>
      <div id="game-content">
        <button id="start">Start</button>
        <div id="game-area"></div>
      </div>
      <div id="scale-r"><div id="index-r"></div></div>
    </div>
  </div>
  <div id="game-inv">BS</div>
<style>
#game {
  position: fixed;
  font-family: GothamPro, sans-serif;
  font-size: 20px;
  background: #E4E4E4;
  width: 500px;
  margin: 0 auto;
  box-shadow: 0 1px 30px 0 rgba(0,0,0,0.14), 0 0px 0px 0 rgba(0,0,0,.12), 0 0px 0px 0px rgba(0,0,0,.3);
  border: 3px outset #A0A0A0;
  border-radius:5px;
  z-index: 9999;
}
#game *{
  margin: 0;
  padding: 0;
}
#head-move{
  position: relative;
  text-align: center;
  background-color: #58718B;
  color:#fff;
  user-select: none;
  cursor: move;
}
#head-move span{
  display: block;
  position: absolute;
  top:-2px;
  right:2px;
  padding: 3px;
  cursor: pointer;
}
#game-main{
  padding:20px;
  display: flex;
  justify-content: space-around;
}
#scale-l, #scale-r{
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 300px;
  width: 5px;
  border: 3px inset #A0A0A0;
  border-radius:5px;
  background-color: #fff;
}
#index-l, #index-r{
  height:0px;
  background-color: green;
}
#game-content {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
}
#game-area {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ccc;
  min-height: 300px;
  min-width: 300px;
  max-width: 300px;
  max-height: 300px;
  overflow: hidden;
  border: 3px inset #A0A0A0;
  border-radius:5px;
}
#start {
  position: absolute;
  z-index: 1;
  display: inline-block;
  padding: 1em 2.3em;
  margin-bottom: 0;
  font-weight: normal;
  font-size: 1em;
  line-height: 1.3em;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  background: #fad64e;
  color: #3f3f3f;
  border: none;
  border-radius: 2.8em;
  transition: transform .2s ease-in-out,box-shadow .2s ease-in-out,-webkit-transform .2s ease-in-out,-webkit-box-shadow .2s ease-in-out;
  will-change: transform;
}
#start:disabled {
  background: #ccc!important;
  border: 1px solid #ccc;
  color: #000;
  cursor: not-allowed;
}
#start:active {
  transition: transform .1s ease-in-out,box-shadow .1s ease-in-out!important;
  transform: none!important;
  box-shadow: none!important;
}
#start:hover {
  box-shadow: 0 6px 16px 0 rgba(0,0,0,.2);
  transform: translateY(-1px);
}
#mess-end{
  font-size: 50px;
  font-weight: bold;
  color:#CB356B;
}
#game-inv{
  display:flex;
  justify-content: center;
  align-items: center;
  font-family: GothamPro, sans-serif;
  font-size: 20px;
  position:fixed;
  top:10%;
  right:5%;
  width:50px;
  height:50px;
  color:#fff;
  font-weight: bold;
  background-color: #0A84FF;
  border-radius:50%;
  cursor: pointer;
  animation: move  5s infinite linear;
  z-index:9999;
  user-select: none;
}
@keyframes move{
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
}
</style>`;

  document.body.insertAdjacentHTML("beforeEnd", codeToDoc);

  let posWx = Math.round(document.body.clientWidth/2 - 253);
  let posWy = Math.round(document.body.clientHeight/6);
  let procGame;
  let $gameWindow = document.getElementById('game');
  let $gameHeader = document.getElementById('head-move');
  let $game = document.getElementById('game-area');
  let gameSize = $game.getBoundingClientRect().width;
  let $start = document.getElementById('start');
  let $close = document.getElementById('close-game');
  let $gameInv = document.getElementById('game-inv');
  $start.onclick = startGame;
  $gameWindow.style.top = posWy + 'px';
  $gameWindow.style.left = posWx + 'px';
  let colors = ['#CB356B', '#BD3F32', '#3A1C71', '#D76D77', '#283c86', '#45a247', '#8e44ad', '#155799', '#159957', '#000046', '#1CB5E0', '#2F80ED'];
  let arrTY = [];
  let V=0;
  for(let i = 0; i < gameSize; i++){
    let t = (-V + Math.sqrt(V**2 + 0.00588))/9.8;
    arrTY[i] = Math.round(10000*t);
    V = V + 9.8*t;
  }
  arrTY[0] *= 2;
  closeGame();
  $close.onclick = closeGame;
  function closeGame(){
    $gameWindow.style.display = 'none';
    $gameInv.style.display = 'flex';
  }
  $gameInv.onclick = function(){
    $gameWindow.style.display = 'block';
    $gameInv.style.display = 'none';
  }
  $gameHeader.onmousedown = function(e) {
    let coords = getCoords($gameWindow);
    let shiftX = e.clientX - coords.left;
    let shiftY = e.clientY - coords.top;
    moveAt(e);
    function moveAt(e) {
      $gameWindow.style.left = e.clientX - shiftX + 'px';
      $gameWindow.style.top = e.clientY - shiftY + 'px';
    }
    document.addEventListener('mousemove', moveAt);
    document.addEventListener('mouseup', function del() {
      document.removeEventListener('mousemove', moveAt);
      document.removeEventListener('mouseup', del);
    });
  }
  function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
      top: box.top,
      left: box.left
    };
  }

  function endGame(win){
    procGame.stop();
    let mess;
    if(win){
      mess =  `<p id="mess-end">YOU WIN!</p>`;
    }else{
      mess = `<p id="mess-end">YOU LOSE!</p>`;
    }
    $game.insertAdjacentHTML("beforeEnd", mess);
    setTimeout(invitationToGame, 10000);
  }

  function invitationToGame(){
    $game.innerHTML = '';
    $game.style.backgroundColor = '#ccc';
    show($start);
  }

  function startGame(){
    $game.style.backgroundColor = '#fff';
    hide($start);
    procGame = new CycleGame();
  }

  function CycleGame(){
    $game.style.cursor = 'crosshair';
    this.gameIsRun = true;
    let instancesScale = new Set();
    let maxTop;
    let countPos;
    let countPosBegin;
    let upPos;
    this.moveStop = false;
    thisCycleGame = this;
    let timerXId;
    $game.innerHTML = '';
    let $ball = document.createElement('div');
    $ball.style.position = 'absolute';
    $ball.style.borderRadius = '50%';
    $ball.style.top = gameSize + 'px';
    $game.prepend($ball);
    let scaleL = new Scale('index-l', false, 25);
    let scaleR = new Scale('index-r', true, 500);
    moveBall();
    $ball.onclick = ()=>{
      this.moveStop = true;
      scaleL.incr(70);
      scaleR.incr(10);
    };
    this.stop = function(){
      thisCycleGame.gameIsRun = false;
      thisCycleGame.moveStop = true;
      $game.style.cursor = 'default';
    }
    function Scale(id, hiEnd, tide){
      instancesScale.add(this);
      let $index = document.getElementById(id);
      let level = hiEnd ? 0 : 300;
      let endG = false;
      this.timerId = setInterval(()=>{this.incr(-1)}, tide);
      this.incr = (incr)=>{
        level += incr;
        if(level >= 300) {if(hiEnd) endG = true;level = 300}
        if(level <= 0) {if(!hiEnd) endG = true;level = 0}
        $index.style.height = level + 'px';
        if(endG){
          instancesScale.forEach(function(item){clearInterval(item.timerId)})
          endGame(hiEnd);
        }
      }
    }

    function moveBall(){
      let ballSize = getRandom(0.1*gameSize, 0.16*gameSize);
      maxTop = getRandom(5, 0.5*gameSize);
      let maxX = getRandom(0.15*gameSize, 0.7*gameSize);
      let xRevers = (Math.random() >= 0.5);
      countPos = gameSize - maxTop;
      countPosBegin = countPos;
      let speedX = getRandom(5, 30);
      let posX = maxX + (xRevers ? -1 : 1)*Math.round(countPos*5/speedX);
      moveUp = true;
      thisCycleGame.moveStop = false;
      $ball.style.height = $ball.style.width = ballSize + 'px';
      $ball.style.backgroundColor = colors[getRandom(0, colors.length - 1)];
      $ball.style.top = (countPos + maxTop) + 'px';
      $ball.style.left = posX + 'px';
      let moveXFunc = xRevers ? function(){
        posX++;
        $ball.style.left = posX + 'px';
      } : function(){
        posX--;
        $ball.style.left = posX + 'px';
      };
      timerXId = setInterval(moveXFunc, speedX);
      setTimeout(moveY, 0);
    }

    function moveY(){
      if(thisCycleGame.moveStop) {
        setTimeout(newBall, 0);
        return
      };
      if(moveUp){
        countPos--;
      }else{
        countPos++;
      }
      if(countPos > countPosBegin) {
        scaleR.incr(-60);
        scaleL.incr(30);
        setTimeout(newBall, 0);
        return
      };
      if(countPos == 0){moveUp = false};
      $ball.style.top = (countPos + maxTop) + 'px';
      setTimeout(moveY, arrTY[countPos]);
    }

    function newBall(){
      $ball.style.top = gameSize + 'px';
      clearInterval(timerXId);
      if(!thisCycleGame.gameIsRun) return;
      setTimeout(moveBall, 100);
    }
  }

  function show($item){
    $item.style.display = 'block';
  }

  function hide($item){
    $item.style.display = 'none';
  }

  function getRandom(min, max) {
    return Math.round(Math.random() * (max-min) + min);
  }
}
