const script = document.createElement('script');
script.onload = function() {
    if(document.querySelector("code.sourceCode") != null){
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js";
        document.head.appendChild(script);
        hljs.highlightAll();
    }
};