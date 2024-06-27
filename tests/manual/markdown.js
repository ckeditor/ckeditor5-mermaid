/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals console, window, document */

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Typing } from '@ckeditor/ckeditor5-typing';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Undo } from '@ckeditor/ckeditor5-undo';
import { Enter } from '@ckeditor/ckeditor5-enter';
import { Clipboard } from '@ckeditor/ckeditor5-clipboard';
import { Link } from '@ckeditor/ckeditor5-link';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { Markdown } from '@ckeditor/ckeditor5-markdown-gfm';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';

import Mermaid from '../../src/mermaid.js';

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
