$.connection.hub.qs = 'Id=' + Id;
var hub = $.connection.DocumentHub;
hub.state.GroupId = Id;
//hub.logging = true;
SetupConnection();
hub.connection.start()
    .done(function (state) {
        console.log(state);
    })
    .fail(function () { console.log('Could not Connect!'); });
function ChangeDocument(event) {
    var id = event.target.id;
    var x;
    var elements = document.getElementsByClassName("CodeMirror");
    if (elements !== null) {
        var help = document.getElementsByClassName('Document')[0];
        if (help.className.indexOf(" Hidden") === -1)
            help.className += " Hidden";
    }
    for (x = 0; x < elements.length; x++) {
        console.log(id);
        console.log(elements[x].id);
        if (elements[x].id === id + "-doc") {
            elements[x].className = elements[x].className.replace(" Hidden", "");
        } else {
            if (elements[x].className.indexOf(" Hidden") === -1)
                elements[x].className += " Hidden";
        }
    }
    var tabs = document.getElementsByClassName("Tab");
    for (x = 0; x < tabs.length; x++) {
        tabs[x].className = tabs[x].className.replace(" ActiveTab", "");
    }
    event.currentTarget.className += " ActiveTab";
}

function AddDocument(event) {
    var menuContainer = event.currentTarget.parentElement.parentElement;
    for (var x = 0; x < menuContainer.children.length; x++) {
        if (menuContainer.children[x].className === "MenuFoot") {
            var textbox = menuContainer.children[x].children[0];
            textbox.className = textbox.className.replace(" Hidden", "");
            textbox.focus();
            menuContainer.className += " Hover";
        }
    }
}


function RemoveDocument(event) {
    event.stopPropagation();
    var container = event.target.parentElement.parentElement;
    var id = event.target.parentElement.id;
    hub.server.signalDeleteDocument(id);
    container.removeChild(event.target.parentElement);
    var documents = document.getElementsByClassName("CodeMirror");
    for (var x = 0; x < documents.length; x++) {
        console.log(documents[x].id);
        if (documents[x].id === id + "-doc") {
            documents[x].parentElement.removeChild(documents[x]);
        }
    }
    documents = document.getElementsByClassName("CodeMirror");
    if (documents === null) {
        var help = document.getElementsByClassName('Document')[0];
        help.className = help.className.replace(" Hidden", "");
    }
}

function LoseFocus(event) {
    if (event.which === 13) {
        event.currentTarget.blur();
    }
}

function CreateDocument(event) {
    var value = event.target.value;
    value = replaceAll(value, " ", "_");
    hub.server.signalCreateDocument(value);
    _CreateDocumentFromName(value);
    event.target.parentElement.parentElement.className =
        event.target.parentElement.parentElement.className.replace(" Hover", "");
    event.target.value = "";
    event.target.className += " Hidden";
}

//Signalr Calls

function SetupConnection() {
    hub.client.recieveCreateDocument = (e) => _CreateDocumentFromName(e);
    hub.client.recieveChangeDocument = (e, v) => RecievedChangeDocument(e,v);
    hub.client.recieveDeleteDocument = (e) => RecievedDeleteDocument(e);
}
function SignalDocumentAdded(documentName) {
    
}
function SignalAddedDocument(documentName) {
    hub.server.signalCreateDocument(documentName);
}
function RecievedChangeDocument(documentName, value) {
    console.log(documentName.replace("-doc", ""));
    var button = document.getElementById(documentName.replace("-doc", ""));
    if (button.className.indexOf("Active") === -1 && button.className.indexOf("PendingChange") === -1) {
        button.className += "PendingChange";
    }
    var cm = document.getElementById(documentName).CodeMirror;
    var pos = cm.getCursor();
    cm.getDoc().setValue(value);
    cm.setCursor(pos);
}
function SignalDocumentUpdate(documentName, value) {
    document.getElementById(documentName + "-doc").setValue(value);
}

function RecievedDeleteDocument(documentName) {
    console.log("delete " + documentName);
    var doc = document.getElementById(documentName + "-doc");
    var button = document.getElementById(documentName);
    doc.parentElement.removeChild(doc);
    button.parentElement.removeChild(button);
}

function _CreateDocumentFromName(name) {
    if (name !== "") {
        if (document.getElementById(name) !== null) {
            return;
        }
        var newDiv = _CreateMenuItem(name);
        document.getElementsByClassName("MenuBody")[0].appendChild(newDiv);
        var cm = _initCodeMirror(document.getElementsByClassName("DocumentContainer")[0]);
        var docContainter = document.getElementsByClassName("DocumentContainer")[0];
        docContainter.lastChild.id = name + "-doc";
        cm.on('change',
            function (e, o) {
                if (o["origin"] !== "setValue") {
                    hub.server.signalChangeDocument(e.getWrapperElement().id, e.getValue());
                }
            });
        newDiv.click();
    }
}

//privates
function _CreateMenuItem(value) {
    var newDiv = document.createElement("div");
    var text = document.createTextNode(value);
    var del = document.createElement("div");
    newDiv.className = "Tab";
    newDiv.appendChild(text);
    newDiv.appendChild(del);
    newDiv.id = value;
    newDiv.addEventListener('click', (e) => ChangeDocument(e));
    del.className = "TabRemove";
    del.addEventListener('click', (e) => RemoveDocument(e));
    return newDiv;
}

function _CreateDocument(value) {
    var newDiv = document.createElement("div");
    newDiv.className = "Document Hidden";
    newDiv.id = value + "-doc";
    return newDiv;
}

function _initCodeMirror(value) {
    var editor = CodeMirror(value,
        {
            theme: "lesser-dark",
            smartIndent: true,
            lineNumbers: true,
            lineWrapping: true,
            autofocus: true,
            matchBrackets: true,
            autoRefresh: true,
            mode: "text/x-csharp",
            foldGutter: {
                rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.brace, CodeMirror.fold.comment)
            },
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });
    return editor;
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}