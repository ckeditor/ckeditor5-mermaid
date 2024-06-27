/**
 * @module mermaid/mermaidsourceviewcommand
 */

import { Command } from 'ckeditor5/src/core.js';

import { checkIsOn } from '../utils.js';

/**
 * The mermaid source view command.
 *
 * Allows to switch to a source view mode.
 *
 * @extends module:core/command~Command
 */
export default class MermaidSourceViewCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const editor = this.editor;
		const documentSelection = editor.model.document.selection;
		const selectedElement = documentSelection.getSelectedElement();
		const isSelectedElementMermaid = selectedElement && selectedElement.name === 'mermaid';

		if ( isSelectedElementMermaid || documentSelection.getLastPosition().findAncestor( 'mermaid' ) ) {
			this.isEnabled = !!selectedElement;
		} else {
			this.isEnabled = false;
		}

		this.value = checkIsOn( editor, 'source' );
	}

	/**
	 * @inheritDoc
	 */
	execute() {
		const editor = this.editor;
		const model = editor.model;
		const documentSelection = this.editor.model.document.selection;
		const mermaidItem = documentSelection.getSelectedElement() || documentSelection.getLastPosition().parent;

		model.change( writer => {
			if ( mermaidItem.getAttribute( 'displayMode' ) !== 'source' ) {
				writer.setAttribute( 'displayMode', 'source', mermaidItem );
			}
		} );
	}
}
