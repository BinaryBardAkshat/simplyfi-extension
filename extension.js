const vscode = require('vscode');

function activate(context) {
    // Register the view provider for the Simplyfi view
    const simplyfiViewProvider = new SimplyfiViewProvider(context);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('simplyfiView', simplyfiViewProvider)
    );

    // Register a single command to launch Simplyfi
    context.subscriptions.push(
        vscode.commands.registerCommand('simplyfi.launch', openInSeparateColumn)
    );
}

class SimplyfiViewProvider {
    constructor(context) {
        this.context = context;
    }

    // eslint-disable-next-line no-unused-vars
    resolveWebviewView(webviewView, context, token) {
        webviewView.webview.options = {
            enableScripts: true,
            retainContextWhenHidden: true,
        };

        // Set the HTML content for the webview
        webviewView.webview.html = this.getWebviewContent();
    }

    getWebviewContent() {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Simplyfi</title>
                <style>
                    html, body { height: 100%; width: 100%; margin: 0; padding: 0; }
                    button { width: 100%; height: 100%; font-size: 24px; }
                </style>
            </head>
            <body>
                <button onclick="vscode.postMessage({command: 'launch'})">Launch Simplyfi</button>
            </body>
            </html>
        `;
    }
}

// Function to open the Simplyfi web view in a new editor column
function openInSeparateColumn() {
    const panel = vscode.window.createWebviewPanel(
        'simplyfiWebview',
        'Simplyfi',
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );
    panel.webview.html = getSimplyfiWebviewContent();
}

// HTML content for the Simplyfi web view
function getSimplyfiWebviewContent() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Simplyfi</title>
            <style>
                html, body, iframe { height: 100%; width: 100%; margin: 0; padding: 0; border: none; overflow: hidden; }
            </style>
        </head>
        <body>
            <iframe src="https://simplyfi.streamlit.app?embed=true"></iframe>
        </body>
        </html>
    `;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
