//勝敗確認に使用する配列
const winningConditions = () => [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
//盤面情報
export type State ={board:string[],isFirst:boolean};
//moveのマスにマークを更新
export const updateMove = (state:State,move:number):void=>{
    state.board[move] = state.isFirst ? 'X' : 'O';
    state.isFirst = !state.isFirst;
}
//勝敗のラインがある場合そのマスを返す
export const getLine = (state:State): number[]=>{
    let ret: number[]=[];
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions()[i];
            const a = state.board[winCondition[0]];
            const b = state.board[winCondition[1]];
            const c = state.board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                ret.push(winCondition[0]);
                ret.push(winCondition[1]);
                ret.push(winCondition[2]);
                return ret;
            }
        }
        return ret;
}
//勝敗判定
export const isLose = (state:State):boolean=>{
    return getLine(state).length==0 ? false:true;
}
//引き分け判定
export const isTie = (state:State):boolean=>{
    if(!state.board.includes(''))return true;
    return false;
}
//移動先のマスが正しいか判定
export const isValidMove = (state:State,move: number):boolean => {
    if(state.board[move]==='X' || state.board[move]==='O'){
        return false;
    }
    return true;
}
//状態を初期化
export const resetState = (state:State):void => {
    state.board=['', '', '', '', '', '', '', '', ''];
    state.isFirst = true;
}
const nextMoves = (state :State) :number[]=> {
    let ret: number[]=[];
    state.board.forEach((cell,move)=>{
        if(cell==='')ret.push(move);
    });
    return ret;
}
//αβ法の中身
const alphaBeta=(state: State,alpha: number,beta: number):number=>{
    if(isLose(state))return -1;
    if(isTie(state))return 0;
    nextMoves(state).forEach( (move: number) => {
        const score = -alphaBeta(nextState(state,move),-beta,-alpha);
        if(score >alpha)alpha=score;
        if(alpha>=beta)return alpha;
    });
    return alpha;
}
//αβ法を使用
export const startAlphaBeta=(state:State):number=>{
    let bestActions: number[]=[];
    let bestScore=Number.MIN_SAFE_INTEGER;
    nextMoves(state).forEach( (move: number) => {
        const score = -alphaBeta(nextState(state,move),Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER);
        if(score >bestScore){
            bestScore=score;
            bestActions.splice(0);
            bestActions.push(move);
        }else if(score == bestScore){
            bestActions.push(move);
        }
    });
    return bestActions[Math.floor(Math.random()*bestActions.length)];
}
//moveのマスにマークを更新した状態を返す
const nextState = (state:State,move: number) :State=>{
    const newState:State = {board:state.board.concat(),isFirst:state.isFirst};
    updateMove(newState,move);
    return newState;
}