# jsonBOX.js
A simple jquery plugin created to edit json contents in a select box.

Usage is simple. just create a Div in your page where you want to have your json listbox , you can have as many jsonbox as you want in your page. then call the method like this:

<code>$('#my-json-editor').jsonbox(data,{target:'#mytextarea'});</code>

this code will generate the edited json in an html element (like a <p> or <textarea>) so you can send it back to your server application or do whatever you want with this. This repository is under active development so use the code with your own risk.
