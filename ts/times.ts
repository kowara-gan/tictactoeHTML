//遅延用関数群
//import * as Times from './times';で使用可能
//関数の引数に　async をつける　例const kannsuu = async () => {};
//Time.wait(100);で一秒停止　Times.deleteWait();で遅延コルーチンがすべて消える
const times:NodeJS.Timeout[]=[];
export const wait = async (ms:number)=>new Promise(resolve=>times.push(setTimeout(resolve,ms)));
export const deleteWait = () => {
    times.forEach((time: NodeJS.Timeout)=>{
        clearTimeout(time);
    });
}