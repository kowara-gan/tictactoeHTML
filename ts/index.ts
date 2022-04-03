import * as State from './state';
import * as Times from './times';

window.addEventListener('DOMContentLoaded', () => {
    let  state: State.State = new State.State();

    const result ={
        PLAYERX_WON: 'PLAYERX_WON',
        PLAYERO_WON:'PLAYERO_WON',
        TIE: 'TIE',
    }as const;
    type Result=typeof result[keyof typeof result];
    const player ={
        HUM_X: 'HUM_X',
        HUM_O: 'HUM_O',
        RDM_X: 'RDM_X',
        RDM_O: 'RDM_O',
        CPU_X: 'CPU_X',
        CPU_O:'CPU_O',
    }as const;
    let firstPlayer: typeof player.HUM_X |typeof player.CPU_X|typeof player.RDM_X = player.CPU_X;
    let secondPlayer: typeof player.HUM_O |typeof player.CPU_O|typeof player.RDM_O = player.CPU_O;
    
    let isGameActive = true;
    let isWhileMoving = false;

    const update = (index: number) => {
        tiles[index].innerHTML = state.isFirstPlayerTurn ? svgX : svgO;
        state.move(index);
        playerDisplay.innerHTML = '<p class="announce">Turn of&nbsp;&nbsp;</p>'+(state.isFirstPlayerTurn ? svgX : svgO);
        //state.show();
        let roundWon =false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = State.winningConditions()[i];
            const a = state.board[winCondition[0]];
            const b = state.board[winCondition[1]];
            const c = state.board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                tiles[winCondition[0]].classList.add('three');
                tiles[winCondition[1]].classList.add('three');
                tiles[winCondition[2]].classList.add('three');
                roundWon = true;
            }
        }

        if (roundWon) {
            announce(state.isFirstPlayerTurn ? result.PLAYERX_WON : result.PLAYERO_WON);
            isGameActive = false;
            return;
        }

        if (state.isTie()){
            announce(result.TIE);
            isGameActive = false;
            return;
        }
    }

    const announce = (type: Result) => {
        switch(type){
            case result.PLAYERO_WON:
                playerDisplay.innerHTML = svgO +'<p class="announce"> Won</p>';
                break;
            case result.PLAYERX_WON:
                playerDisplay.innerHTML = svgX +'<p class="announce"> Won</p>';
                break;
            case result.TIE:
                playerDisplay.innerHTML = '<p class="announce">Tie</p>';
        }
    };

    const userAction = async (index?: number) => {
        if(isWhileMoving ||!isGameActive)return;
        if(state.isFirstPlayerTurn&&firstPlayer!=player.HUM_X||!state.isFirstPlayerTurn&&secondPlayer!=player.HUM_O){
            await cpuAction();
        }else if(index!=undefined&&state.isValidMove(index)) {
            update(index);
        }

        if(state.isFirstPlayerTurn&&firstPlayer!=player.HUM_X||!state.isFirstPlayerTurn&&secondPlayer!=player.HUM_O){
            await cpuAction();
        }
    }

    const cpuAction = async () => {
        if(!isGameActive)return;
        isWhileMoving=true;
        await Times.wait(500);
        let index: number;
        if(state.isFirstPlayerTurn&&firstPlayer==player.RDM_X||!state.isFirstPlayerTurn&&secondPlayer==player.RDM_O){
            while(true){
                index = Math.floor(Math.random()*9);
                if(state.isValidMove(index))break;
            }
        }else{index=state.alphaBetaIndex();}
        if(index!=undefined)update(index);
        isWhileMoving=false;
        if(state.isFirstPlayerTurn&&firstPlayer!=player.HUM_X||!state.isFirstPlayerTurn&&secondPlayer!=player.HUM_O){
            await cpuAction();
        }
    }
    //リセットボタンを押した場合
    const onReset = () => {
        state.board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
 
        if (!state.isFirstPlayerTurn) {
            state.isFirstPlayerTurn = !state.isFirstPlayerTurn;
            playerDisplay.innerHTML = '<p class="announce">Turn of&nbsp;&nbsp;</p>'+(state.isFirstPlayerTurn ? svgX : svgO);
        }

        tiles.forEach((tile: Element)=> {
            tile.innerHTML = '';
            tile.classList.remove('three');
        });
        //AUTO中の遅延を止める
        Times.deleteWait();
        isWhileMoving = false;
        if(state.isFirstPlayerTurn&&firstPlayer!=player.HUM_X){
            userAction();
        }
    }
    //１Ｐボタンを押した場合
    const onChangeFirstPlayer = () =>{
        switch(firstPlayer){
            case 'CPU_X': {firstPlayer = player.HUM_X; break;}
            case 'HUM_X': {firstPlayer = player.RDM_X; break;}
            case 'RDM_X': {firstPlayer = player.CPU_X; break;}
            default : firstPlayer = player.HUM_X;
        }
        //AUTO中の遅延を止める
        Times.deleteWait();
        isWhileMoving = false;
        firstPlayerButton.innerHTML = firstPlayer;
    }
    //２Ｐボタンを押した場合
    const onChangeSecondPlayer = () =>{
        switch(secondPlayer){
            case 'CPU_O': {secondPlayer = player.HUM_O; break;}
            case 'HUM_O': {secondPlayer = player.RDM_O; break;}
            case 'RDM_O': {secondPlayer = player.CPU_O; break;}
            default : firstPlayer = player.HUM_X;
        }
        //AUTO中の遅延を止める
        Times.deleteWait();
        isWhileMoving = false;
        secondPlayerButton.innerHTML = secondPlayer;
    }

    //htmlの要素を入手、クリック関数を登録
    //9マスグリッド
    const tiles:Element[] = Array.from(document.querySelectorAll('.tile'))!;
    tiles.forEach( (tile: Element, index: number) => {
        tile.addEventListener('click', () => userAction(index));
    });
    //アナウンス文
    const playerDisplay = document.querySelector('.display-player')!;
    //各種ボタン
    const resetButton = document.querySelector('#reset')!;
    resetButton.addEventListener('click', onReset);
    const firstPlayerButton = document.querySelector('#firstPlayer')!;
    firstPlayerButton.addEventListener('click', onChangeFirstPlayer);
    firstPlayerButton.innerHTML = firstPlayer;
    const secondPlayerButton = document.querySelector('#secondPlayer')!;
    secondPlayerButton.addEventListener('click', onChangeSecondPlayer);
    secondPlayerButton.innerHTML = secondPlayer;
    //svgデータ
    const svgO:string = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 40 40"fill="#d82a47"><path d="M20,10A10,10,0,1,1,10,20,10,10,0,0,1,20,10M20,0A20,20,0,1,0,40,20,20,20,0,0,0,20,0Z"/></svg>'
    const svgX:string = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 40 40"fill="#00aaf8"><path d="M32 40 L20 28 L8 40 L0 32 L12 20 L0 8 L8 0 L20 12 L32 0 L40 8 L28 20 L40 32" /></svg>'

});