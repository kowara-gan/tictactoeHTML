export const winningConditions = () => [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
export class State{
    public board = ['', '', '', '', '', '', '', '', ''];
    public isFirstPlayerTurn =true;
    constructor(state? :State){
        if(state){
            this.board = state.board.concat();
            this.isFirstPlayerTurn=state.isFirstPlayerTurn;
        }else{
            this.board = ['', '', '', '', '', '', '', '', ''];
            this.isFirstPlayerTurn=true;
        }
    }
    isLose = () =>{
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions()[i];
            const a = this.board[winCondition[0]];
            const b = this.board[winCondition[1]];
            const c = this.board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                //this.show();
                return true;
            }
        }return false;
    }
    isTie = () =>{
        if(!this.board.includes(''))return true;
        return false;
    }
    nextMoves = () => {
        let ret: number[]=[];
        this.board.forEach((cell,index)=>{
            if(cell==='')ret.push(index);
        });
        return ret;
    }
    move = (move: number) => {
        this.board[move] = this.isFirstPlayerTurn ? 'X' : 'O';
        this.isFirstPlayerTurn = !this.isFirstPlayerTurn;
    }
    nextState = (move: number) =>{
        let newState = new State(this);
        newState.move(move);
        return newState;
    }
    isValidMove = (index: number) => {
        if(this.board[index]==='X' || this.board[index]==='O'){
            return false;
        }
        return true;
    }
    alphaBeta=(alpha: number,beta: number)=>{
        if(this.isLose())return -1;
        if(this.isTie())return 0;
        let bestScore:number = -2;
        this.nextMoves().forEach( (move: number) => {
            const score = -this.nextState(move).alphaBeta(-beta,-alpha);
            if(score >alpha)alpha=score;
            if(alpha>=beta)return alpha;
        });
        return alpha;
    }

    alphaBetaIndex=()=>{
        let bestActions: number[]=[];
        let bestScore=Number.MIN_SAFE_INTEGER;
        this.nextMoves().forEach( (move: number) => {
            const score = -this.nextState(move).alphaBeta(Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER);
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
    
    show(){
        let a: String='';
        this.board.forEach((value,index)=>{
            if(value!==''){a = a+value;}
            else{a = a+index.toString();}
        })
        console.log(a);
    }
}