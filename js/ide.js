document.addEventListener("DOMContentLoaded", function () {
    console.log("ACE Editor Initialization Started");

    function initACEEditor(id_editor) {
        console.log("Initializing ACE Editor:", id_editor);

        // Vérifier si l'éditeur est déjà initialisé
        if (document.getElementById(id_editor).classList.contains("ace_editor")) {
            console.log("Editor already initialized:", id_editor);
            return;
        }

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

        let contentElement = document.getElementById("content_" + id_editor);
        let url_pyfile = contentElement ? contentElement.textContent : '';

        editor.getSession().setValue(url_pyfile.replace(/backslash_newline/g, "\n"));

        if (url_pyfile === '') { 
            editor.getSession().setValue('\n\n\n\n\n');  // 6 lignes vides
        }

        return editor;
    }

    function initAllEditors() {
        console.log("Checking for editors...");
        document.querySelectorAll('[id^=editor_]').forEach(editor => {
            initACEEditor(editor.id);
        });
    }

    // Initialiser tous les éditeurs après un délai (attente du chargement dynamique)
    setTimeout(() => {
        console.log("Executing initAllEditors after 1 second...");
        initAllEditors();
    }, 1000);

    // Deuxième vérification après 3 secondes pour s'assurer que tout est bien chargé
    setTimeout(() => {
        console.log("Final check after 3 seconds...");
        initAllEditors();
    }, 3000);

    // Observer les ajouts dynamiques d'éditeurs
    const observer = new MutationObserver(() => {
        console.log("New elements detected in the DOM...");
        initAllEditors();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Appliquer le thème ACE Editor après le délai
    function paintACE(theme) {
        document.querySelectorAll('div[id^="editor_"]').forEach(editeur => {
            let editor = ace.edit(editeur.id);
            editor.setTheme(theme);
            editor.getSession().setMode("ace/mode/python");
        });
    }

    // Appliquer le thème immédiatement puis après un délai
    paintACE('ace/theme/tomorrow_night_bright');
    setTimeout(() => {
        console.log("Applying theme again...");
        paintACE('ace/theme/tomorrow_night_bright');
    }, 2000);
});
