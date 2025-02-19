// Initialize Mermaid
mermaid.initialize({startOnLoad:true}); 

// Intialize Markdown-it
const md = window.markdownit();


// Transform Markdown to HTML
function renderMarkdown() {
    const markdownContent = document.querySelectorAll('.markdown-content');
    
    markdownContent.forEach(content => {
        let contentText = content.innerHTML;
//        console.log(contentText);        
        contentText = contentText.split('&gt;').join('>');
        contentText = contentText.split('&lt;').join('<');
        contentText = contentText.split('<<').join('&lt;&lt;');
        contentText = contentText.split('>>').join('&gt;&gt;');
 //       console.log(contentText);
        let htmlContent = md.render(contentText);
 //       console.log(htmlContent);
        htmlContent = htmlContent.split('&gt;&gt;').join('>');
        htmlContent = htmlContent.split('&lt;&lt;').join('<');
        htmlContent = htmlContent.split('&quot;&lt;').join('"');
        htmlContent = htmlContent.split('&gt;&quot;').join('"');
        console.log(htmlContent);


        const div = document.createElement('div');
        div.innerHTML = htmlContent;
        content.parentNode.insertBefore(div, content.nextSibling);

    });
}

// Transform csv data to html table
function renderCSV() {
const csvContent = document.querySelectorAll('.csv-content');
    csvContent.forEach(content => {
        const csv = content.textContent;
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',');
        const rows = lines.slice(1);
        let htmlContent = '<tr>\n<th>' + headers.join('</th>\n<th>') + '</th>\n</tr>\n';
        
        rows.forEach(row => {
            const cells = row.split(',');
            htmlContent += '<tr>\n<td>' + cells.join('</td>\n<td>') + '</td>\n</tr>\n';
        });
        htmlContent = '<table>\n' + htmlContent + '</table>\n';

        const div = document.createElement('div');
        div.className = content.className;
        div.innerHTML = htmlContent;
        content.parentNode.insertBefore(div, content.nextSibling);
    });
}

// Transform Mermaid to HTML
function renderMermaid() {
    const mermaidContent = document.querySelectorAll('.mermaid-content');
    mermaidContent.forEach(content => {
        const div = document.createElement('div');
        div.className = 'mermaid';
        div.innerHTML = content.textContent;
        content.parentNode.insertBefore(div, content.nextSibling);
    });
mermaid.contentLoaded();
}
//Get url of plantnml
function getURL(sauce){
    return "http://www.plantuml.com/plantuml/svg/"+plantumlEncoder.encode(sauce);
};

//Transform plantnml to HTML
function renderPlantuml() {
    const plantumlContent = document.querySelectorAll('.plantuml-content');
    plantumlContent.forEach(content => {
        const img = document.createElement('img');
        img.className = 'view';
        img.src = getURL(content.textContent);
        content.parentNode.insertBefore(img, content.nextSibling);
    });
}

// Make index
function makeindex() {
    const contents = document.querySelectorAll('*');
    let n=0;
    let n1=0;
    let n2 =0;
    let n3 =0;
    let indexText = "----------Title-----------------------------<br>"; 
    contents.forEach(content => {
        if(content.nodeName === "H1"){
            n1 ++;
            n ++;
            n2 = 0;
            const id = 'heading- '+ n;
            content.id = id;
            indexText +='&emsp;&emsp;&emsp;'+content.textContent+'.<br>';
            indexText += "----------index of contents ------------<br>";   
        } 
        if(content.nodeName === "H2"){
            n ++;
            n2 ++;
            n3=0;
            const id = 'heading- '+ n;
            content.id = id;
            indexText +='&emsp;&emsp;<a class="h1" href="#'+id+'">'+n2+'</a>. '+content.textContent+'.<br>';
        } 
        if(content.nodeName === "H3"){
            n ++;
            n3 ++;
            const id = 'heading- '+ n;
            content.id = id;
            indexText +='&emsp;&emsp;&emsp;<a class="h1" href="#'+id+'">'+n2+'. '+n3+'</a>. '+content.textContent+'.<br>';
        }
        
    });
    indexText += "----------end of index--------------------<br>";
    console.log(indexText);
    const index = document.getElementById('index-content');
    if (index) {
        index.innerHTML = indexText;
    }
}


const htmlListener = (event)=>{
    renderCSV();
    renderMermaid();
    renderMarkdown();
    renderPlantuml();
    makeindex();
}

//Transform html to text
const currentText=()=>{
    console.log("text mode");
    const currentURL = window.location.href;
    fetch(currentURL)
    .then(response => response.text())
    .then(text => {
        console.log(text);
    let textData = text;
    textData = textData.replace(/&/g, '&&amp;');
    textData = textData.replace(/</g, '&lt;');
    textData = textData.replace(/>/g, '&gt;');
    textData = textData.replace(/"/g, '&quot;');
    textData = textData.replace(/\n/g, '<br>'); 
    let content = document.getElementById("root");   
    content.innerHTML = textData;
    console.log(textData);
    })
    .catch(error =>{console.error('エラーが発生しました。',error);
    });

}   

let mode="html";
document.addEventListener('DOMContentLoaded',htmlListener);
const toggle = ()=>{
    if(mode==='html'){
        console.log("mode change from html to text");
        mode='text';
        currentText();
    }else{
    location.reload();
    }
}    
