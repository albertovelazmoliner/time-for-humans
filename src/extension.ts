import * as vscode from 'vscode';
const moment = require('moment');

const transformTimeForHumans = () => {
	// vscode.window.showInformationMessage('Time For Humans');
	const editor = vscode.window.activeTextEditor;
	const text = editor ? editor.document.getText(editor.selection) : undefined;
	
	if (editor && text) {
		const lines = editor.document.getText().split('\n');
		let selectedLines = lines.slice(editor.selection.start.line, editor.selection.end.line + 1);
		
		const settingsFormat = vscode.workspace.getConfiguration('timeForHumans').format;
		let newText = '';
		selectedLines.forEach((line, index) => {
			const timestamp : number = parseInt(line);
			var length : number = Math.log(timestamp) * Math.LOG10E + 1 | 0;
			var difference : number = ((13 - length) < 0) ?  0 : 13 - length; 
			var factor : number = factor = 10 ** difference;
			var myDate : string = moment(timestamp * factor).format(settingsFormat);
			const lang = editor.document.languageId;
			let commentStart : string = '';
			let commentEnd: string = '';
			switch(lang) {			
				case 'csharp':			
				case 'go':
				case 'java':			
				case 'php':
				case 'plaintext':
				case 'typescript':
					commentStart = ' /* ';
					commentEnd = ' */';
					break;
				case 'javascript':
					commentStart = ' // ';
				case 'python':
				case 'ruby':
					commentStart = ' # ';
					break;
				default:
					commentStart = '';
					break;
			}
			newText += line + commentStart + ' ' + myDate + ' ' + commentEnd;
			newText += (selectedLines.length - 1 > index) ? '\n' : '';
		});
		
		editor.edit(builder => builder.replace(editor.selection, newText));	
	}
};

export function activate(context: vscode.ExtensionContext) {

	// console.log('Congratulations, your extension "time-for-humans" is now active!');
	let disposable = vscode.commands.registerCommand('extension.humanTime', () => {
		transformTimeForHumans();
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
