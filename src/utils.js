/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module mermaid/utils
 */

/**
 * Helper function for setting the `isOn` state of buttons.
 *
 * @private
 * @param {module:core/editor/editor~Editor} editor
 * @param {String} commandName Short name of the command.
 * @returns {Boolean}
 */
export function checkIsOn( editor, commandName ) {
	const selection = editor.model.document.selection;
	const mermaidItem = selection.getSelectedElement() || selection.getLastPosition().parent;

	if ( mermaidItem && mermaidItem.is( 'element', 'mermaid' ) && mermaidItem.getAttribute( 'displayMode' ) === commandName ) {
		return true;
	}

	return false;
}
