require('module-alias/register');
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const JsonToDartClassInfo = require('@src/get_infos');
const { yesPlease, nooThanks } = require('@src/index');
const {
    generateClasses,
    generateEnums,
    generateExtensions,
    generateViews,
    generateStates,
} = require('./src/dartiding');

function flutterProjectName() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        return null;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const pubspecPath = path.join(rootPath, 'pubspec.yaml');

    if (!fs.existsSync(pubspecPath)) {
        return null;
    }

    const content = fs.readFileSync(pubspecPath, 'utf8');
    const match = content.match(/^name:\s*(\S+)/m);

    return match ? match[1] : null;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable1 = vscode.commands.registerCommand(
        'dartify.parseJson',
        async function disposable01() {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                vscode.window.showErrorMessage('No active editor found.');
                return;
            }
            const text = editor.document.getText();
            const selection = editor.selection;
            const textSelected = editor.document.getText(selection);
            const textt = !textSelected ? text : textSelected;
            try {
                const json = JSON.parse(textt.trim());
                const className = await vscode.window.showInputBox({
                    placeHolder: 'Entry class name',
                    prompt: 'Enter class name',
                    value: 'DartifyGeneratedCode',
                });
                const projectName = flutterProjectName();
                if (className) {
                    const useForms = await vscode.window.showQuickPick([nooThanks, yesPlease], {
                        title: 'Generate Flutter Forms 📃',
                    });
                    const separateChoices = [yesPlease, nooThanks];
                    const currentFilePath = editor.document.uri.fsPath;
                    const useSeparate = await vscode.window.showQuickPick(
                        path.extname(currentFilePath) === '.json'
                            ? separateChoices
                            : separateChoices.reverse(),
                        { title: 'Generate Separate Files 🖇️' },
                    );
                    const dartData = new JsonToDartClassInfo(json, className).result;
                    ///
                    const currentDir = path.dirname(currentFilePath);
                    const baseName = path.basename(currentFilePath, path.extname(currentFilePath));
                    const data = {
                        classInfo: dartData,
                        genForms: useForms,
                        jsonWild: json,
                        useSeparate: useSeparate == yesPlease,
                        basename: baseName,
                        projectName: projectName,
                    };
                    const filesToGenerate = [
                        { suffix: 'classes.dart', content: generateClasses(data), generate: true },
                        { suffix: 'enums.dart', content: generateEnums(data), generate: true },
                        {
                            suffix: 'extensions.dart',
                            content: generateExtensions(data),
                            generate: true,
                        },
                        {
                            suffix: 'states.dart',
                            content: generateStates(data),
                            generate: useForms == yesPlease,
                        },
                        {
                            suffix: 'views.dart',
                            content: generateViews(data),
                            generate: useForms == yesPlease,
                        },
                    ];

                    if (useSeparate == nooThanks) {
                        const dart = filesToGenerate
                            .filter((f) => f.generate)
                            .map((e) => e.content)
                            .join('\n');
                        const allDocument = new vscode.Range(
                            editor.document.lineAt(0).range.start,
                            editor.document.lineAt(editor.document.lineCount - 1).range.end,
                        );
                        editor.edit((builder) => {
                            builder.replace(!textSelected ? allDocument : selection, dart);
                        });
                    } else {
                        if (editor.document.languageId !== 'json') {
                            vscode.window.showErrorMessage('Must a json file.');
                            return;
                        }

                        for (const file of filesToGenerate) {
                            if (file.generate) {
                                const filePath = path.join(
                                    currentDir,
                                    `${baseName}.${file.suffix}`,
                                );

                                try {
                                    fs.writeFileSync(filePath, file.content, 'utf8');
                                } catch (err) {
                                    vscode.window.showErrorMessage(
                                        `Error writing file ${filePath}: ${err}`,
                                    );
                                }
                            }
                        }
                        const filePath = path.join(currentDir, `${baseName}.export.dart`);
                        try {
                            fs.writeFileSync(
                                filePath,
                                filesToGenerate
                                    .filter((f) => f.generate)
                                    .map((f) => `export '${baseName}.${f.suffix}';`)
                                    .join('\n'),
                                'utf8',
                            );
                        } catch (err) {
                            vscode.window.showErrorMessage(
                                `Error writing file ${filePath}: ${err}`,
                            );
                        }
                    }
                    vscode.window.showInformationMessage(`Classes Generated Successfully 🙈✔️`);
                } else {
                    vscode.window.showErrorMessage(`Interrompted 💢❌`);
                }
            } catch (error) {
                console.log(error);
                vscode.window.showErrorMessage('Invalid Json Formatter');
            }
        },
    );

    context.subscriptions.push(disposable1);
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
            JSON: ['json'],
        },
        openLabel: 'Select File',
    });

    if (fileUri && fileUri.length > 0) {
        const selectedFilePath = fileUri[0].fsPath; // Get the selected file path
        vscode.window.showInformationMessage(`Selected file: ${selectedFilePath}`);
        // You can use the selected file path for further processing here
    }
}
function deactivate() {}

module.exports = {
    activate,
    deactivate,
    selectFile,
};
