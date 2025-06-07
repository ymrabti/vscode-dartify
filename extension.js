require('module-alias/register');
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const generateClass = require("@src/json_to_dart")
const JsonToDartClassInfo = require("@src/get_class_info_from_json");
const { yesPlease, nooThanks } = require('@src/index');
const { JsonToTranslations } = require('./src/generate_translations');
const { generateClasses, generateEnums, generateExtensions, generateViews, generateStates } = require('./src/dartiding');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable1 = vscode.commands.registerCommand('dartify.parseJson', async function disposable01() {
        const editor = vscode.window.activeTextEditor

        if (!editor) {
            vscode.window.showErrorMessage("No active editor found.");
            return;
        }

        const text = editor.document.getText();
        const selection = editor.selection;
        const textSelected = editor.document.getText(selection);
        const textt = !textSelected ? text : textSelected
        try {
            const json = JSON.parse(textt.trim());
            const className = await vscode.window.showInputBox({
                placeHolder: "Entry class name",
                prompt: "Enter class name",
                value: "DartifyGeneratedCode"
            });
            if (!!className) {
                const useForms = await vscode.window.showQuickPick([yesPlease, nooThanks], { title: 'Generate Flutter Forms', });
                const useSeparate = await vscode.window.showQuickPick([yesPlease, nooThanks], { title: 'Generate Separate Files', });
                const dartData = new JsonToDartClassInfo(json, className).result;
                ///
                if (useSeparate == nooThanks) {
                    const dart = generateClass(dartData, useForms, json);
                    const allDocument = new vscode.Range(
                        editor.document.lineAt(0).range.start,
                        editor.document.lineAt(editor.document.lineCount - 1).range.end
                    );
                    editor.edit(builder => {
                        builder.replace(!textSelected ? allDocument : selection, dart);
                    });
                } else {
                    const currentFilePath = editor.document.uri.fsPath;
                    const currentDir = path.dirname(currentFilePath);
                    const baseName = path.basename(currentFilePath, path.extname(currentFilePath)); // removes .dart or .txt etc.

                    const filesToGenerate = [
                        { suffix: 'classes.dart', content: generateClasses(dartData, useForms, json), generate: true },
                        { suffix: 'enums.dart', content: generateEnums(dartData, useForms, json), generate: true },
                        { suffix: 'extensions.dart', content: generateExtensions(dartData, useForms, json), generate: true },
                        { suffix: 'states.dart', content: generateStates(dartData, useForms, json), generate: useForms == yesPlease },
                        { suffix: 'views.dart', content: generateViews(dartData, useForms, json), generate: useForms == yesPlease },
                    ];

                    for (const file of filesToGenerate) {
                        if (file.generate) {
                            const filePath = path.join(currentDir, `${baseName}.${file.suffix}`);

                            try {
                                fs.writeFileSync(filePath, file.content, 'utf8');
                            } catch (err) {
                                vscode.window.showErrorMessage(`Error writing file ${filePath}: ${err}`);
                            }
                        }
                    }
                }
                vscode.window.showInformationMessage(`Classes Generated Successfully 🙈✔️`);

            } else {
                vscode.window.showErrorMessage(`Interrompted 💢❌`);
            }
        } catch (error) {
            console.log(error);
            vscode.window.showErrorMessage("Invalid Json Formatter")
        }
    });
    let disposable2 = vscode.commands.registerCommand('dartify.toTranslations', async function disposable02() {
        // await selectFile();
        const editor = vscode.window.activeTextEditor
        if (!editor) {
            return;
        }
        const text = editor.document.getText();
        const selection = editor.selection;
        const textSelected = editor.document.getText(selection);
        const textt = !textSelected ? text : textSelected
        try {
            const json = JSON.parse(textt.trim());
            if (Array.isArray(json)) {
                const transss = new JsonToTranslations(json);
                const dartData = transss.DartifyTranslations;
                const allDocument = new vscode.Range(
                    editor.document.lineAt(0).range.start,
                    editor.document.lineAt(editor.document.lineCount - 1).range.end
                );
                editor.edit(builder => {
                    builder.replace(!textSelected ? allDocument : selection, dartData);
                });
                vscode.window.showInformationMessage(`Translations Generated Successfully 🌐✔️`);
            }
        } catch (error) {
            console.log(error);
            vscode.window.showErrorMessage("Invalid Json Formatter")
        }
    });
    let disposable3 = vscode.commands.registerCommand('dartify.toAppEnums', async function disposable03() {
        // await selectFile();
        const editor = vscode.window.activeTextEditor
        if (!editor) {
            return;
        }
        const text = editor.document.getText();
        const selection = editor.selection;
        const textSelected = editor.document.getText(selection);
        const textt = !textSelected ? text : textSelected
        try {
            const json = JSON.parse(textt.trim());
            if (Array.isArray(json)) {
                const textEnums = `
enum AppLocales { ${Object.keys(json[0]).filter(e => e != 'key').join(', ')} }

enum AppTranslation {
  ${json.map(e => `
    ${Object.keys(e).filter(e => e != 'key').map(j => `/// ${j}: ${`${e[j]}`.replace("'", "\\'")}`).join('\n ')}
  ${e.key},`).join('\n')}
}

${Object.keys(json[0]).filter(e => e != 'key').map(f => `
Map<String, String> ${f} = {
    ${json.map(e => `AppTranslation.${e.key}.name: '${`${e[f]}`.replace("'", "\\'")}',`).join('\n')}
};
`).join('\n')}

                `
                const allDocument = new vscode.Range(
                    editor.document.lineAt(0).range.start,
                    editor.document.lineAt(editor.document.lineCount - 1).range.end
                );
                editor.edit(builder => {
                    builder.replace(!textSelected ? allDocument : selection, textEnums);
                });
                vscode.window.showInformationMessage(`Enums Generated Successfully 🌐✔️`);
            }
        } catch (error) {
            console.log(error);
            vscode.window.showErrorMessage("Invalid Json Formatter")
        }
    });

    context.subscriptions.push(disposable1);
    context.subscriptions.push(disposable2);
    context.subscriptions.push(disposable3);
}
async function selectFile() {
    const currentFolder = vscode.workspace.rootPath; // Get the current workspace folder
    if (!currentFolder) {
        vscode.window.showErrorMessage('No workspace folder found.');
        return;
    }

    const fileUri = await vscode.window.showOpenDialog({
        defaultUri: vscode.Uri.file(currentFolder), // Set the default directory
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        filters: {
            'JSON': ['json']
        },
        openLabel: 'Select File'
    });

    if (fileUri && fileUri.length > 0) {
        const selectedFilePath = fileUri[0].fsPath; // Get the selected file path
        vscode.window.showInformationMessage(`Selected file: ${selectedFilePath}`);
        // You can use the selected file path for further processing here
    }
}
function deactivate() { }

module.exports = {
    activate,
    deactivate,
    selectFile,
}

