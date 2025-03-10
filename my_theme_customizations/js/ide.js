document.addEventListener("DOMContentLoaded", function() {
    console.log("ready");
    $('[id^=editor_]').each(function() {
        let number = this.id.split('_').pop();
        let contentElement = $('#content_' + this.id);
        let url_pyfile = contentElement.length ? contentElement.text() : '';

        let id_editor = "editor_" + number;

        function createACE(id_editor) {
            ace.require("ace/ext/language_tools");
            let editor = ace.edit(id_editor, {
                theme: "ace/theme/tomorrow_night_bright",
                mode: "ace/mode/python",
                autoScrollEditorIntoView: true,
                maxLines: 30,
                minLines: 6,
                tabSize: 4,
                printMargin: false
            });

            editor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: false
            });

            // Remplacement sécurisé des backslashes
            editor.getSession().setValue(url_pyfile.replace(/backslash_newline/g, "\n"));

            return editor;
        }

        createACE(id_editor);

        if (url_pyfile === '') { 
            let editor = ace.edit(id_editor);
            editor.getSession().setValue('\n\n\n\n\n');  // Crée 6 lignes vides
        }
    });

    // Gestion de l'upload de fichiers
    $('[id^=input_editor_]').each(function() {
        let number = this.id.split('_').pop();
        let id_editor = "editor_" + number;
        let inputElement = document.getElementById('input_' + id_editor);

        if (inputElement) {
            inputElement.addEventListener('change', function(e) { readFile(e, id_editor); }, false);
        }
    });

    function readFile(evt, id_editor) {
        let files = evt.target.files;
        if (!files.length) return;
        
        let reader = new FileReader();
        let editor = ace.edit(id_editor);

        reader.onload = function(event) {
            editor.getSession().setValue(event.target.result);
        };

        reader.readAsText(files[0]);
    }

    // Appliquer le thème ACE en fonction du mode dark/light de mkdocs
    function paintACE(theme) {
        document.querySelectorAll('div[id^="editor_"]').forEach(editeur => {
            let editor = ace.edit(editeur.id);
            editor.setTheme(theme);
            editor.getSession().setMode("ace/mode/python");
        });
    }

    paintACE('ace/theme/tomorrow_night_bright');
});
