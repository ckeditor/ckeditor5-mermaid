/**
 * @module mermaid/mermaidsplitviewcommand
 */

import { Command } from 'ckeditor5/src/core.js';

import { checkIsOn } from '../utils.js';

/**
 * The mermaid split view command.
 *
 * Allows to switch to a split view mode.
 *
 * @extends module:core/command~Command
 */
export default class MermaidSplitViewCommand extends Command {
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

		this.value = checkIsOn( editor, 'split' );
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
			if ( mermaidItem.getAttribute( 'displayMode' ) !== 'split' ) {
				writer.setAttribute( 'displayMode', 'split', mermaidItem );
			}
		} );
	}
}
