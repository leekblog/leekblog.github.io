const script = document.createElement('script');
document.head.appendChild(script);
script.onload = function() {
    if(document.querySelector("code.sourceCode") != null){
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
        Prism.highlightAll();
    }
};