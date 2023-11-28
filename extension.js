require('module-alias/register');
const vscode = require('vscode');
const generateClass = require("@src/json_to_dart")
const JsonToDartClassInfo = require("@src/get_class_info_from_json")

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
		let textSelected = editor.document.getText(selection);

		if (!textSelected) {
			textSelected = text;
		}
		try {
			const json = JSON.parse(textSelected.trim());
			const className = await vscode.window.showInputBox({
				placeHolder: "Enter class name",
				prompt: "Enter class name",
				value: "DartifyGeneratedCode"
			})
			const useForms = await vscode.window.showQuickPick(['Yes Please!', 'No Thanks'], { title: 'Generate Flutter Forms', })
			const dartData = new JsonToDartClassInfo(json, className).result
			const dart = generateClass(dartData)
			editor.edit(builder => {
				builder.replace(
					/* new vscode.Range(
						editor.document.lineAt(0).range.start,
						editor.document.lineAt(editor.document.lineCount - 1).range.end
					), */
					selection,
					dart,
				);
			});
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
	deactivate
}

