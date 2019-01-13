import * as vscode from 'vscode';

const transformTimeForHumans = () => {
	vscode.window.showInformationMessage('Time For Humans');
	const editor = vscode.window.activeTextEditor;
	const text = editor ? editor.document.getText(editor.selection) : undefined;
	

	if (editor && text) {

		console.log(editor);
		console.log('lines => ', editor.selection.start.line - editor.selection.end.line + 1);

		const lines = editor.selection.start.line - editor.selection.end.line + 1;
		
		//TODO Add loop in lines for adding dates in necessary ones
		const timestamp : number = parseInt(text);
		var myDate : Date = new Date( timestamp * 1000);
		const lang = editor.document.languageId;
		let commentStart : string = '';
		let commentEnd: string = '';
		switch(lang) {			
			case 'csharp':			
			case 'go':
			case 'java':
			case 'javascript':			
			case 'php':
			case 'plaintext':
			case 'typescript':
				commentStart = ' // ';
				break;
			case 'python':
			case 'ruby':
				commentStart = ' # ';
				break;
			default:
				commentStart = '';
				break;
		}
		const newText = text + commentStart + myDate.toUTCString() + "  => Locale Time " + myDate.toLocaleString() + commentEnd;

		editor.edit(builder => builder.replace(editor.selection, newText));	
	}
};

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "time-for-humans" is now active!');

	let disposable = vscode.commands.registerCommand('extension.humanTime', () => {
		transformTimeForHumans();
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
