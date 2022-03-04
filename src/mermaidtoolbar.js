/**
 * @module mermaid/mermaidtoolbar
 */

import { Plugin } from 'ckeditor5/src/core';
import { WidgetToolbarRepository } from 'ckeditor5/src/widget';

export default class MermaidToolbar extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ WidgetToolbarRepository ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'MermaidToolbar';
	}

	/**
	 * @inheritDoc
	 */
	afterInit() {
		const editor = this.editor;
		const t = editor.t;

		const widgetToolbarRepository = editor.plugins.get( WidgetToolbarRepository );
		const mermaidToolbarItems = [ 'mermaidSourceView', 'mermaidSplitView', 'mermaidPreview', '|', 'mermaidInfo' ];

		if ( mermaidToolbarItems ) {
			widgetToolbarRepository.register( 'mermaidToolbar', {
				ariaLabel: t( 'Mermaid toolbar' ),
				items: mermaidToolbarItems,
				getRelatedElement: selection => getSelectedElement( selection )
			} );
		}
	}
}

function getSelectedElement( selection ) {
	const viewElement = selection.getSelectedElement();

	if ( viewElement && viewElement.hasClass( 'ck-mermaid__wrapper' ) ) {
		return viewElement;
	}

	return null;
}
