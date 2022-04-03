const times:NodeJS.Timeout[]=[];
export const wait = async (ms:number)=>new Promise(resolve=>times.push(setTimeout(resolve,ms)));
export const deleteWait = () => {
    times.forEach((time: NodeJS.Timeout)=>{
        clearTimeout(time);
    });
}