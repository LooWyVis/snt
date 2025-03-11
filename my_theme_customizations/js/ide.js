document.addEventListener("DOMContentLoaded", function() {
    console.log("ready");

    function initACEEditor(id_editor) {
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
            editor.getSession().setValue('\n\n\n\n\n');
        }
    }

    function initAllEditors() {
        document.querySelectorAll('[id^=editor_]').forEach(editor => {
            if (!editor.classList.contains("ace_editor")) { // Vérifie si ACE est déjà activé
                initACEEditor(editor.id);
            }
        });
    }

    // Initialisation au chargement de la page
    initAllEditors();

    // Écoute les ajouts dynamiques d'éditeurs
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches('[id^=editor_]')) {
                    console.log("Nouveau éditeur détecté :", node.id);
                    initACEEditor(node.id);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Si les éditeurs sont chargés après un délai (ex: via AJAX)
    setTimeout(initAllEditors, 1000);

    // Appliquer le thème à tous les éditeurs
    function paintACE(theme) {
        document.querySelectorAll('div[id^="editor_"]').forEach(editeur => {
            let editor = ace.edit(editeur.id);
            editor.setTheme(theme);
            editor.getSession().setMode("ace/mode/python");
        });
    }

    paintACE('ace/theme/tomorrow_night_bright');
});
