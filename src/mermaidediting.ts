/**
 * @module mermaid/mermaidediting
 */

import { Plugin, toWidget, global, uid, type EventInfo } from 'ckeditor5';
import mermaid from 'mermaid';
import { debounce } from 'es-toolkit/compat';
import MermaidPreviewCommand from './commands/mermaidPreviewCommand.js';
import MermaidSourceViewCommand from './commands/mermaidSourceViewCommand.js';
import MermaidSplitViewCommand from './commands/mermaidSplitViewCommand.js';
import InsertMermaidCommand from './commands/insertMermaidCommand.js';

// Time in milliseconds.
const DEBOUNCE_TIME = 300;

export default class MermaidEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	public static get pluginName() {
		return 'MermaidEditing' as const;
	}

	/**
	 * @inheritDoc
	 */
	public init(): void {
		this._registerCommands();
		this._defineConverters();
	}

	/**
	 * @inheritDoc
	 */
	public afterInit(): void {
		mermaid.initialize( {
			startOnLoad: false
		} );

		this.editor.model.schema.register( 'mermaid', {
			allowAttributes: [ 'displayMode', 'source' ],
			allowWhere: '$block',
			isObject: true
		} );
	}

	/**
	 * @inheritDoc
	*/
	private _registerCommands(): void {
		const editor = this.editor;

		editor.commands.add( 'mermaidPreviewCommand', new MermaidPreviewCommand( editor ) );
		editor.commands.add( 'mermaidSplitViewCommand', new MermaidSplitViewCommand( editor ) );
		editor.commands.add( 'mermaidSourceViewCommand', new MermaidSourceViewCommand( editor ) );
		editor.commands.add( 'insertMermaidCommand', new InsertMermaidCommand( editor ) );
	}

	/**
	 * Adds converters.
	 */
	private _defineConverters(): void {
		const editor = this.editor;

		editor.data.downcastDispatcher.on( 'insert:mermaid', this._mermaidDataDowncast.bind( this ) );
		editor.editing.downcastDispatcher.on( 'insert:mermaid', this._mermaidDowncast.bind( this ) );
		editor.editing.downcastDispatcher.on( 'attribute:source:mermaid', this._sourceAttributeDowncast.bind( this ) );

		editor.data.upcastDispatcher.on( 'element:code', this._mermaidUpcast.bind( this ), { priority: 'high' } );

		editor.conversion.for( 'editingDowncast' ).attributeToAttribute( {
			model: {
				name: 'mermaid',
				key: 'displayMode'
			},
			view: modelAttributeValue => ( {
				key: 'class',
				value: 'ck-mermaid__' + modelAttributeValue + '-mode'
			} )
		} );
	}

	private _mermaidDataDowncast( evt: EventInfo, data: any, conversionApi: any ): any {
		const model = this.editor.model;
		const { writer, mapper } = conversionApi;

		if ( !conversionApi.consumable.consume( data.item, 'insert' ) ) {
			return;
		}

		const targetViewPosition = mapper.toViewPosition( model.createPositionBefore( data.item ) );
		// For downcast we're using only language-mermaid class. We don't set class to `mermaid language-mermaid` as
		// multiple markdown converters that we have seen are using only `language-mermaid` class and not `mermaid` alone.
		const code = writer.createContainerElement( 'code', {
			class: 'language-mermaid'
		} );
		const pre = writer.createContainerElement( 'pre', {
			spellcheck: 'false'
		} );
		const sourceTextNode = writer.createText( data.item.getAttribute( 'source' ) );

		writer.insert( model.createPositionAt( code, 'end' ), sourceTextNode );
		writer.insert( model.createPositionAt( pre, 'end' ), code );
		writer.insert( targetViewPosition, pre );
		mapper.bindElements( data.item, code );
	}

	private _mermaidDowncast( evt: EventInfo, data: any, conversionApi: any ): any {
		const { writer, mapper, consumable } = conversionApi;
		const { editor } = this;
		const { model, t } = editor;
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this;

		if ( !consumable.consume( data.item, 'insert' ) ) {
			return;
		}

		const targetViewPosition = mapper.toViewPosition( model.createPositionBefore( data.item ) );

		const wrapperAttributes = {
			class: [ 'ck-mermaid__wrapper' ]
		};
		const textareaAttributes = {
			class: [ 'ck-mermaid__editing-view' ],
			placeholder: t( 'Insert mermaid source code' ),
			'data-cke-ignore-events': true
		};

		const wrapper = writer.createContainerElement( 'div', wrapperAttributes );
		const editingContainer = writer.createUIElement( 'textarea', textareaAttributes, createEditingTextarea );
		const previewContainer = writer.createUIElement( 'div', { class: [ 'ck-mermaid__preview' ] }, createMermaidPreview );

		writer.insert( writer.createPositionAt( wrapper, 'start' as any ), previewContainer );
		writer.insert( writer.createPositionAt( wrapper, 'start' as any ), editingContainer );

		writer.insert( targetViewPosition, wrapper );

		mapper.bindElements( data.item, wrapper );

		return toWidget( wrapper, writer, {
			label: t( 'Mermaid widget' ),
			hasSelectionHandle: true
		} );

		function createEditingTextarea( this: any, domDocument: Document ) {
			const domElement = this.toDomElement( domDocument );

			domElement.value = data.item.getAttribute( 'source' );

			const debouncedListener = debounce( event => {
				editor.model.change( writer => {
					writer.setAttribute( 'source', event.target.value, data.item );
				} );
			}, DEBOUNCE_TIME );

			domElement.addEventListener( 'input', debouncedListener );

			/* Workaround for internal #1544 */
			domElement.addEventListener( 'focus', () => {
				const model = editor.model;
				const selectedElement = model.document.selection.getSelectedElement();

				// Move the selection onto the mermaid widget if it's currently not selected.
				if ( selectedElement !== data.item ) {
					model.change( writer => writer.setSelection( data.item, 'on' ) );
				}
			}, true );

			return domElement;
		}

		function createMermaidPreview( this: any, domDocument: Document ) {
			const mermaidSource = data.item.getAttribute( 'source' );
			const domElement = this.toDomElement( domDocument );

			that._renderMermaid( domElement, mermaidSource );

			return domElement;
		}
	}

	private _sourceAttributeDowncast( evt: EventInfo, data: any, conversionApi: any ): any {
		// @todo: test whether the attribute was consumed.
		const newSource = data.attributeNewValue;
		const domConverter = this.editor.editing.view.domConverter;

		if ( newSource ) {
			const mermaidView = conversionApi.mapper.toViewElement( data.item )!;

			for ( const child of mermaidView.getChildren() ) {
				if ( child.name === 'textarea' && child.hasClass( 'ck-mermaid__editing-view' ) ) {
					const domEditingTextarea = domConverter.viewToDom( child, window.document as any ) as any;

					if ( domEditingTextarea.value != newSource ) {
						domEditingTextarea.value = newSource;
					}
				} else if ( child.name === 'div' && child.hasClass( 'ck-mermaid__preview' ) ) {
					// @todo: we could optimize this and not refresh mermaid if widget is in source mode.
					const domPreviewWrapper = domConverter.viewToDom( child, window.document as any ) as any;

					if ( domPreviewWrapper ) {
						this._renderMermaid( domPreviewWrapper, newSource );
					}
				}
			}
		}
	}

	private _mermaidUpcast( evt: EventInfo, data: any, conversionApi: any ): void {
		const viewCodeElement = data.viewItem;
		const hasPreElementParent = !viewCodeElement.parent || !viewCodeElement.parent.is( 'element', 'pre' );
		const hasCodeAncestors = data.modelCursor.findAncestor( 'code' );
		const { consumable, writer } = conversionApi;

		if ( !viewCodeElement.hasClass( 'language-mermaid' ) || hasPreElementParent || hasCodeAncestors ) {
			return;
		}

		if ( !consumable.test( viewCodeElement, { name: true } ) ) {
			return;
		}
		const mermaidSource = Array.from<any>( viewCodeElement.getChildren() )
			.filter( item => item.is( '$text' ) )
			.map( item => item.data )
			.join( '' );

		const mermaidElement = writer.createElement( 'mermaid', {
			source: mermaidSource,
			displayMode: 'split'
		} );

		// Let's try to insert mermaid element.
		if ( !conversionApi.safeInsert( mermaidElement, data.modelCursor ) ) {
			return;
		}

		consumable.consume( viewCodeElement, { name: true } );

		conversionApi.updateConversionResult( mermaidElement, data );
	}

	/**
	 * Renders Mermaid (a parsed `source`) in a given `domElement`.
	 */
	private _renderMermaid( domElement: HTMLElement, source: string ): Promise<void> {
		const id = `ck-mermaid-${ uid() }`;

		return mermaid.render( id, source )
			.then( ( { svg } ) => {
				domElement.innerHTML = svg;
			} )
			// An empty `catch()` to prevent from crashing the entire page.
			.catch( err => {
				domElement.innerText = err.message;
				( global.document.getElementById( id )!.parentNode as any ).remove();
			} );
	}
}
