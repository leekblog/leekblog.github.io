var dom =document.getElementsByTagName("footer")[0].querySelectorAll("a");

for(let i=0;i<dom.length;i++){
    dom[i].onclick = ()=>{
        alert("开发中...");
    }
}