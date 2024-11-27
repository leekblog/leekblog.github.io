if (document.querySelector("code.sourceCode") != null) {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js";
    document.head.appendChild(script);
    script.onload = function () {
        hljs.highlightAll();
        console.clear();
        console.info("highlightAll");
    };
}