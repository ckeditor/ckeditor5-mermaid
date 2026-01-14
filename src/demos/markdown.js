/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import {
	ClassicEditor,
	Typing,
	Paragraph,
	Undo,
	Enter,
	Clipboard,
	Link,
	Bold,
	Italic,
	Markdown,
	CodeBlock
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

import { Mermaid } from '../index.js';

ClassicEditor
	.create( document.querySelector( '#editor' ), {
		plugins: [
			Markdown,
			Typing,
			Paragraph,
			Undo,
			Enter,
			Clipboard,
			Link,
			Bold,
			Italic,
			CodeBlock,
			Mermaid
		],
		licenseKey: 'GPL',
		toolbar: [ 'bold', 'italic', 'link', 'undo', 'redo', 'codeBlock', 'mermaid' ],
		codeBlock: {
			languages: [
				{ language: 'plaintext', label: 'Plain text', class: '' },
				{ language: 'javascript', label: 'JavaScript' },
				{ language: 'python', label: 'Python' },
				{ language: 'mermaid', label: 'Mermaid' }
			]
		}

	} )
	.then( editor => {
		window.editor = editor;

		setupMarkdownOutputPreview( editor );
	} )
	.catch( err => {
		console.error( err.stack );
	} );

function setupMarkdownOutputPreview( editor ) {
	const outputElement = document.querySelector( '#markdown-output' );

	editor.model.document.on( 'change', () => {
		outputElement.innerText = editor.getData();
	} );

	// Set the initial data with delay so hightlight.js doesn't catch them.
	window.setTimeout( () => {
		outputElement.innerText = editor.getData();
	}, 500 );
}
