require('module-alias/register');
const vscode = require('vscode');
const generateClass = require("@src/json_to_dart")
const JsonToDartClassInfo = require("@src/get_class_info_from_json");
const { yesPlease, nooThanks } = require('@src/index');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('dartify.parseJson', async function () {
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
			const className = await vscode.window.showInputBox({
				placeHolder: "Entry class name",
				prompt: "Enter class name",
				value: "DartifyGeneratedCode"
			});
			if (!!className) {
				const useForms = await vscode.window.showQuickPick([yesPlease, nooThanks], { title: 'Generate Flutter Forms', },)
				const dartData = new JsonToDartClassInfo(json, className).result
				const dart = generateClass(dartData, useForms)
				const allDocument = new vscode.Range(
					editor.document.lineAt(0).range.start,
					editor.document.lineAt(editor.document.lineCount - 1).range.end
				);
				editor.edit(builder => {
					builder.replace(!textSelected ? allDocument : selection, dart,);
				});
				vscode.window.showInformationMessage(`Classes Generated Successfully 🙈✔️`)
			} else {
				vscode.window.showErrorMessage(`Interrompted 💢❌`)
			}
		} catch (error) {
			console.log(error);
			vscode.window.showErrorMessage("Invalid Json Formatter")
		}
	});

	context.subscriptions.push(disposable);
}
function deactivate() { }

module.exports = {
	activate,
	deactivate,
}

