const vscode = require('vscode');
const generateClass = require("./Converter/json_to_dart")
const JsonToDartClassInfo = require("./getClasInfo/get_class_info_from_json")

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('dartify.parseJson', async function () {
		const editor = vscode.window.activeTextEditor
		const text = editor.document.getText();
		try {
			const json = JSON.parse(text.trim());
			const className = await vscode.window.showInputBox({
				placeHolder: "Enter class name",
				prompt: "Enter class name",
				value: "DartifyGeneratedCode"
			})
			const dartData = new JsonToDartClassInfo(json, className).result
			const dart = generateClass(dartData)
			editor.edit(builder => {
				builder.replace(
					new vscode.Range(editor.document.lineAt(0).range.start, editor.document.lineAt(editor.document.lineCount - 1).range.end),
					dart,

				);
			});
		} catch (error) {
			console.log(error);
			vscode.window.showErrorMessage("Invalid Json Formate")
		}
	});

	context.subscriptions.push(disposable);
}
function deactivate() { }

module.exports = {
	activate,
	deactivate
}

