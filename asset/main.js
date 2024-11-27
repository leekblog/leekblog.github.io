const script = document.createElement('script');
document.head.appendChild(script);
script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js";
hljs.highlightAll();
script.onload = function() {
    if(document.querySelector("code.sourceCode") != null){
    }
};