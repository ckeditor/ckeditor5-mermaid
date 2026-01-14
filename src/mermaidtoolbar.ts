/**
 * @module mermaid/mermaidtoolbar
 */

import { Plugin, WidgetToolbarRepository, type ViewDocumentSelection } from 'ckeditor5';

export default class MermaidToolbar extends Plugin {
	/**
	 * @inheritDoc
	 */
	public static get requires() {
		return [ WidgetToolbarRepository ] as const;
	}

	/**
	 * @inheritDoc
	 */
	public static get pluginName() {
		return 'MermaidToolbar' as const;
	}

	/**
	 * @inheritDoc
	 */
	public afterInit(): void {
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

function getSelectedElement( selection: ViewDocumentSelection ) {
	const viewElement = selection.getSelectedElement();

	if ( viewElement && viewElement.hasClass( 'ck-mermaid__wrapper' ) ) {
		return viewElement;
	}

	return null;
}
