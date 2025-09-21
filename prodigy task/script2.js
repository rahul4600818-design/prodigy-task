const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const lastEl = document.getElementById('last');
const modeBtn = document.getElementById('modeBtn');
const resetBtn = document.getElementById('resetBtn');
const undoBtn = document.getElementById('undoBtn');
const clearScoresBtn = document.getElementById('clearScores');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreDEl = document.getElementById('scoreD');

let cells = Array(9).fill(null);
let current = 'X';
let isGameOver = false;
let vsComputer = false;
let history = [];
const scores = {X:0, O:0, D:0};

const WIN = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Create board
function makeBoard(){
  boardEl.innerHTML = '';
  for(let i=0;i<9;i++){
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.dataset.i = i;
    cell.addEventListener('click', onCellClick);
    boardEl.appendChild(cell);
  }
}

function render(){
  const nodes = boardEl.querySelectorAll('.cell');
  nodes.forEach(n=>{
    const i = +n.dataset.i;
    n.className = 'cell';
    n.textContent = '';
    if(cells[i]){
      n.textContent = cells[i];
      n.classList.add(cells[i].toLowerCase(),'taken');
    }
  });
}

function onCellClick(e){
  if(isGameOver) return;
  const i = +e.currentTarget.dataset.i;
  if(cells[i]) return;
  makeMove(i, current);
  if(vsComputer && !isGameOver){
    current = current==='X'?'O':'X';
    setTimeout(()=>{
      const move = findBestMove();
      if(move!=null) makeMove(move, current);
    }, 300);
    return;
  }
  current = current==='X'?'O':'X';
  if(!isGameOver) statusEl.textContent = `Player ${current} turn`;
}

function makeMove(i, player){
  cells[i] = player;
  history.push({i,player});
  render();
  const result = checkWin();
  if(result.win){ endGame(result); return; }
  if(cells.every(Boolean)){
    isGameOver = true; scores.D++;
    scoreDEl.textContent = scores.D;
    statusEl.textContent = 'Draw'; lastEl.textContent = 'Match ended in a draw';
  }
}

function checkWin(){
  for(const c of WIN){
    const [a,b,d] = c;
    if(cells[a] && cells[a]===cells[b] && cells[a]===cells[d]){
      return {win:true, combo:c, winner:cells[a]};
    }
  }
  return {win:false};
}

function endGame({combo,winner}){
  isGameOver = true;
  combo.forEach(idx=> boardEl.querySelector(`.cell[data-i='${idx}']`).classList.add('win'));
  scores[winner]++; 
  if(winner==='X') scoreXEl.textContent = scores.X;
  else scoreOEl.textContent = scores.O;
  statusEl.textContent = `Player ${winner} wins!`;
  lastEl.textContent = `Winning line: ${combo.join('-')}`;
}

// Simple AI
function findBestMove(){
  const me=current, them=me==='X'?'O':'X';
  function canWinFor(p){
    for(let i=0;i<9;i++){
      if(!cells[i]){
        cells[i]=p;
        const ok=checkWin().win && checkWin().winner===p;
        cells[i]=null; if(ok) return i;
      }
    } return null;
  }
  let win=canWinFor(me); if(win!=null) return win;
  let block=canWinFor(them); if(block!=null) return block;
  if(!cells[4]) return 4;
  const corners=[0,2,6,8].filter(i=>!cells[i]);
  if(corners.length) return corners[Math.random()*corners.length|0];
  return cells.findIndex(c=>!c);
}

// Controls
modeBtn.addEventListener('click',()=>{
  vsComputer=!vsComputer;
  modeBtn.textContent = vsComputer?'Mode: vs Computer':'Mode: 2-Player';
  resetGame();
});
resetBtn.addEventListener('click',()=>resetGame());
undoBtn.addEventListener('click',undoMove);
clearScoresBtn.addEventListener('click',()=>{
  scores.X=scores.O=scores.D=0;
  scoreXEl.textContent=0; scoreOEl.textContent=0; scoreDEl.textContent=0;
});

function undoMove(){
  if(!history.length||isGameOver) return;
  const last=history.pop();
  cells[last.i]=null; current=last.player;
  isGameOver=false; render();
  statusEl.textContent=`Player ${current} turn (after undo)`;
}

function resetGame(){
  cells=Array(9).fill(null); history=[]; isGameOver=false; current='X';
  makeBoard(); render();
  statusEl.textContent=`Player ${current} turn`; lastEl.textContent='New game';
}

// keyboard shortcuts
window.addEventListener('keydown',(e)=>{
  if(e.key>='1'&&e.key<='9'){const idx=+e.key-1; const target=boardEl.querySelector(`[data-i='${idx}']`); if(target) target.click();}
  if(e.key==='r'||e.key==='R') resetGame();
  if(e.key==='u'||e.key==='U') undoMove();
});

// init
makeBoard(); resetGame();
