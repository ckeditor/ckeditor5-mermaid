/**
 * @module mermaid/insertmermaidcommand
 */

import { Command } from 'ckeditor5/src/core';

const MOCK_MERMAID_MARKUP = `flowchart TB
A --> B
B --> C`;

/**
 * The insert mermaid command.
 *
 * Allows to insert mermaid.
 *
 * @extends module:core/command~Command
 */
export default class InsertMermaidCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const documentSelection = this.editor.model.document.selection;
		const selectedElement = documentSelection.getSelectedElement();

		if ( selectedElement && selectedElement.name === 'mermaid' ) {
			this.isEnabled = false;
		} else {
			this.isEnabled = true;
		}
	}

	/**
	 * @inheritDoc
	 */
	execute() {
		const editor = this.editor;
		const model = editor.model;
		let mermaidItem;

		model.change( writer => {
			mermaidItem = writer.createElement( 'mermaid', {
				displayMode: 'split',
				source: MOCK_MERMAID_MARKUP
			} );

			model.insertContent( mermaidItem );
		} );

		return mermaidItem;
	}
}
