import * as State from './state';
import * as Times from './times';

//リザルトを表すtype
type Result='X_WON'|'O_WON'|'TIE';
//プレイヤーを表すtype
type PlayerType={
    mode: 'HUM' | 'RDM' | 'CPU';
}
//進行方法を表すtype
type ProcedureType={
    mode: 'AUTO' | 'CLICK' ;
}

window.addEventListener('DOMContentLoaded', () => {
    //初期化
    const state :State.State = {board:['', '', '', '', '', '', '', '', ''],isFirst:true};
    let movesList:number[]=[];

    let firstProcedure: ProcedureType = {mode:'AUTO'};
    let secondProcedure: ProcedureType = {mode:'AUTO'};
    let firstPlayer: PlayerType = {mode:'CPU'};
    let secondPlayer: PlayerType = {mode:'CPU'};
    let isGameActive = true;
    let isWhileMoving = false;
    //moveのマスにOXマークを書く
    const update = (move: number) => {
        tiles[move].innerHTML = state.isFirst ? svgX : svgO;
        movesList.push(move);
        State.updateMove(state,move);
        //ターン情報を更新
        playerDisplay.innerHTML = '<p class="announce">Turn of&nbsp;&nbsp;</p>'+(state.isFirst ? svgX : svgO);
        //勝敗判定
        if (State.isLose(state)){
            let tileNums=State.getLine(state);//揃ったラインを入手してマスの色を変更
            tiles[tileNums[0]].classList.add('three');
            tiles[tileNums[1]].classList.add('three');
            tiles[tileNums[2]].classList.add('three');
            announce(state.isFirst ? 'X_WON' : 'O_WON');
            isGameActive = false;
            return;
        }
        //引き分け判定
        if (State.isTie(state)){
            announce('TIE');
            isGameActive = false;
            return;
        }
    }
    //勝敗が決まるか、引き分けの時に文字情報を更新
    const announce = (result: Result) => {
        switch(result){
            case 'O_WON':
                playerDisplay.innerHTML = svgO +'<p class="announce"> Won</p>';
                break;
            case 'X_WON':
                playerDisplay.innerHTML = svgX +'<p class="announce"> Won</p>';
                break;
            case 'TIE':
                playerDisplay.innerHTML = '<p class="announce">Tie</p>';
        }
    };
    //現在のプレイヤータイプを確認 'HUM' | 'RDM' | 'CPU'
    const isPlayerType = (mode: string):boolean => {
        return state.isFirst&&firstPlayer.mode==mode||!state.isFirst&&secondPlayer.mode==mode;
    };
    //現在の進行タイプが'AUTO'か確認 'AUTO' | 'CLICK' 
    const isAUTO = ():boolean => {
        return state.isFirst&&firstProcedure.mode=='AUTO'||!state.isFirst&&secondProcedure.mode=='AUTO';
    };
    //プレイヤーの入力があった場合
    const userAction = async (move?: number) => {
        if(isWhileMoving ||!isGameActive)return;
        if(!isPlayerType('HUM')){//コンピュータタイプ
            await cpuAction();
        }else if(move!=undefined&&State.isValidMove(state,move)) {//プレイヤータイプかつマスの情報が正しい
            update(move);
        }
        if(!isAUTO())return;
        if(!isPlayerType('HUM')){//コンピュータタイプ
            await cpuAction();
        }
    }
    //コンピュータの入力
    const cpuAction = async () => {
        if(!isGameActive)return;
        //遅延の開始
        isWhileMoving=true;
        await Times.wait(500);
        //moveに正しいマスを格納
        let move: number;
        if(isPlayerType('RDM')){//ランダムタイプ
            while(true){//正しいマスの情報がでるまでランダムで繰り返し
                move = Math.floor(Math.random()*9);
                if(State.isValidMove(state,move))break;
            }
        }else{move=State.startAlphaBeta(state);}//αβCPUタイプ
        //moveのマスにOXマークを書く
        if(move!=undefined)update(move);
        isWhileMoving=false;
        if(!isAUTO())return;
        if(!isPlayerType('HUM')){//コンピュータタイプ
            await cpuAction();
        }
    }
    //戻るボタンを押した場合
    const onBack = () => {
        let remove = movesList.pop();
        if(remove==undefined)return;
        tiles[remove].innerHTML = '';
        State.updateRemove(state,remove);
        isGameActive = true;
        playerDisplay.innerHTML = '<p class="announce">Turn of&nbsp;&nbsp;</p>'+(state.isFirst ? svgX : svgO);
        tiles.forEach((tile: Element)=> {
            tile.classList.remove('three');
        });
        //AUTO中の遅延を止める
        Times.deleteWait();
        isWhileMoving = false;
    }
    //リセットボタンを押した場合
    const onReset = () => {
        State.resetState(state);
        isGameActive = true;
        playerDisplay.innerHTML = '<p class="announce">Turn of&nbsp;&nbsp;</p>'+(state.isFirst ? svgX : svgO);
        movesList=[];
        //三目並べの画面初期化
        tiles.forEach((tile: Element)=> {
            tile.innerHTML = '';
            tile.classList.remove('three');
        });
        //AUTO中の遅延を止める
        Times.deleteWait();
        isWhileMoving = false;
        //再起動
        if(!isPlayerType('HUM')){
            userAction();
        }
    }
    //１ＰProcedureボタンを押した場合
    const onChangeFirstProcedure = () =>{
        switch(firstProcedure.mode){
            case 'AUTO': {firstProcedure.mode = 'CLICK'; break;}
            case 'CLICK': {firstProcedure.mode = 'AUTO'; break;}
            default : firstProcedure.mode = 'AUTO';
        }
        //AUTO中の遅延を止める
        Times.deleteWait();
        isWhileMoving = false;
        firstProcedureButton.innerHTML = firstProcedure.mode;
    }
    //２ＰProcedureボタンを押した場合
    const onChangeSecondProcedure = () =>{
        switch(secondProcedure.mode){
            case 'AUTO': {secondProcedure.mode = 'CLICK'; break;}
            case 'CLICK': {secondProcedure.mode = 'AUTO'; break;}
            default : secondProcedure.mode = 'AUTO';
        }
        //AUTO中の遅延を止める
        Times.deleteWait();
        isWhileMoving = false;
        secondProcedureButton.innerHTML = secondProcedure.mode;
    }
    //１Ｐボタンを押した場合
    const onChangeFirstPlayer = () =>{
        switch(firstPlayer.mode){
            case 'CPU': {firstPlayer.mode = 'HUM'; break;}
            case 'HUM': {firstPlayer.mode = 'RDM'; break;}
            case 'RDM': {firstPlayer.mode = 'CPU'; break;}
            default : firstPlayer.mode = 'HUM';
        }
        //AUTO中の遅延を止める
        Times.deleteWait();
        isWhileMoving = false;
        firstPlayerButton.innerHTML = firstPlayer.mode+"_X";
    }
    //２Ｐボタンを押した場合
    const onChangeSecondPlayer = () =>{
        switch(secondPlayer.mode){
            case 'CPU': {secondPlayer.mode = 'HUM'; break;}
            case 'HUM': {secondPlayer.mode = 'RDM'; break;}
            case 'RDM': {secondPlayer.mode = 'CPU'; break;}
            default : secondPlayer.mode = 'HUM';
        }
        //AUTO中の遅延を止める
        Times.deleteWait();
        isWhileMoving = false;
        secondPlayerButton.innerHTML = secondPlayer.mode+"_O";
    }
    //htmlの要素を入手、イベント関数を登録
    //9マスグリッド
    const tiles:Element[] = Array.from(document.querySelectorAll('.tile'))!;
    tiles.forEach( (tile: Element, move: number) => {
        tile.addEventListener('click', () => userAction(move));
    });
    //アナウンス文
    const playerDisplay = document.querySelector('.display-player')!;
    //各種ボタン
    const backButton = document.querySelector('#back')!;
    backButton.addEventListener('click', onBack);
    const firstProcedureButton = document.querySelector('#firstProcedure')!;
    firstProcedureButton.addEventListener('click', onChangeFirstProcedure);
    firstProcedureButton.innerHTML = firstProcedure.mode;
    const secondProcedureButton = document.querySelector('#secondProcedure')!;
    secondProcedureButton.addEventListener('click', onChangeSecondProcedure);

    const resetButton = document.querySelector('#reset')!;
    resetButton.addEventListener('click', onReset);
    secondProcedureButton.innerHTML = secondProcedure.mode;
    const firstPlayerButton = document.querySelector('#firstPlayer')!;
    firstPlayerButton.addEventListener('click', onChangeFirstPlayer);
    firstPlayerButton.innerHTML = firstPlayer.mode+"_X";
    const secondPlayerButton = document.querySelector('#secondPlayer')!;
    secondPlayerButton.addEventListener('click', onChangeSecondPlayer);
    secondPlayerButton.innerHTML = secondPlayer.mode+"_O";
    //svgデータ
    const svgO:string = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 40 40"fill="#d82a47"><path d="M20,10A10,10,0,1,1,10,20,10,10,0,0,1,20,10M20,0A20,20,0,1,0,40,20,20,20,0,0,0,20,0Z"/></svg>'
    const svgX:string = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 40 40"fill="#00aaf8"><path d="M32 40 L20 28 L8 40 L0 32 L12 20 L0 8 L8 0 L20 12 L32 0 L40 8 L28 20 L40 32" /></svg>'

});