/**
 * @module mermaid/mermaidui
 */

import { Plugin, ButtonView, type Editor } from 'ckeditor5';
import insertMermaidIcon from '../theme/icons/insert.svg';
import previewModeIcon from '../theme/icons/preview-mode.svg';
import splitModeIcon from '../theme/icons/split-mode.svg';
import sourceModeIcon from '../theme/icons/source-mode.svg';
import infoIcon from '../theme/icons/info.svg';

export default class MermaidUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	public static get pluginName() {
		return 'MermaidUI' as const;
	}

	/**
	 * @inheritDoc
	 */
	public init(): void {
		this._addButtons();
	}

	/**
	 * Adds all mermaid-related buttons.
	 *
	 * @private
	 */
	private _addButtons(): void {
		const editor = this.editor;

		this._addInsertMermaidButton();
		this._addMermaidInfoButton();
		this._createToolbarButton( editor, 'mermaidPreview', 'Preview', previewModeIcon );
		this._createToolbarButton( editor, 'mermaidSourceView', 'Source view', sourceModeIcon );
		this._createToolbarButton( editor, 'mermaidSplitView', 'Split view', splitModeIcon );
	}

	/**
	 * Adds the button for inserting mermaid.
	 *
	 * @private
	 */
	private _addInsertMermaidButton(): void {
		const editor = this.editor;
		const t = editor.t;
		const view = editor.editing.view;

		editor.ui.componentFactory.add( 'mermaid', locale => {
			const buttonView = new ButtonView( locale );
			const command = editor.commands.get( 'insertMermaidCommand' ) as any;

			buttonView.set( {
				label: t( 'Insert Mermaid diagram' ),
				icon: insertMermaidIcon,
				tooltip: true
			} );

			buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute the command when the button is clicked.
			command.listenTo( buttonView, 'execute', () => {
				const mermaidItem = editor.execute( 'insertMermaidCommand' ) as any;
				const mermaidItemViewElement = editor.editing.mapper.toViewElement( mermaidItem ) as any;

				view.scrollToTheSelection();
				view.focus();

				if ( mermaidItemViewElement ) {
					const mermaidItemDomElement = view.domConverter.viewToDom( mermaidItemViewElement, document as any ) as any;

					if ( mermaidItemDomElement ) {
						mermaidItemDomElement.querySelector( '.ck-mermaid__editing-view' )!.focus();
					}
				}
			} );

			return buttonView;
		} );
	}

	/**
	 * Adds the button linking to the mermaid guide.
	 */
	private _addMermaidInfoButton(): void {
		const editor = this.editor;
		const t = editor.t;

		editor.ui.componentFactory.add( 'mermaidInfo', locale => {
			const buttonView = new ButtonView( locale );
			const link = 'https://ckeditor.com/blog/basic-overview-of-creating-flowcharts-using-mermaid/';

			buttonView.set( {
				label: t( 'Read more about Mermaid diagram syntax' ),
				icon: infoIcon,
				tooltip: true
			} );

			buttonView.on( 'execute', () => {
				window.open( link, '_blank', 'noopener' );
			} );

			return buttonView;
		} );
	}

	/**
	 * Adds the mermaid balloon toolbar button.
	 */
	private _createToolbarButton( editor: Editor, name: string, label: string, icon: string ): void {
		const t = editor.t;

		editor.ui.componentFactory.add( name, locale => {
			const buttonView = new ButtonView( locale );
			const command = editor.commands.get( `${ name }Command` ) as any;

			buttonView.set( {
				label: t( label ),
				icon,
				tooltip: true
			} );

			buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute the command when the button is clicked.
			command.listenTo( buttonView, 'execute', () => {
				editor.execute( `${ name }Command` );
				editor.editing.view.scrollToTheSelection();
				editor.editing.view.focus();
			} );

			return buttonView;
		} );
	}
}
