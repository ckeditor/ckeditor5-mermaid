import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import { setData as setModelData, getData as getModelData } from '@ckeditor/ckeditor5-engine/src/dev-utils/model';
import { getData as getViewData } from '@ckeditor/ckeditor5-engine/src/dev-utils/view';
import CodeBlockEditing from '@ckeditor/ckeditor5-code-block/src/codeblockediting';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import MermaidEditing from '../src/mermaidediting';

/* global document */

describe( 'MermaidEditing', () => {
	it( 'should be named', () => {
		expect( MermaidEditing.pluginName ).to.equal( 'MermaidEditing' );
	} );

	describe( 'conversion', () => {
		let domElement, editor, model;

		beforeEach( async () => {
			domElement = document.createElement( 'div' );
			document.body.appendChild( domElement );

			editor = await ClassicEditor.create( domElement, {
				plugins: [
					Paragraph,
					Heading,
					Essentials,
					CodeBlockEditing,
					MermaidEditing
				]
			} );

			model = editor.model;
		} );

		afterEach( () => {
			domElement.remove();
			return editor.destroy();
		} );

		describe( 'conversion', () => {
			describe( 'upcast', () => {
				it( 'works correctly', () => {
					editor.setData(
						'<pre spellcheck="false">' +
							'<code class="language-mermaid">flowchart TB\nA --> B\nB --> C</code>' +
						'</pre>'
					);

					expect( getModelData( model, { withoutSelection: true } ) ).to.equal(
						'<mermaid displayMode="split" source="flowchart TB\nA --> B\nB --> C">' +
						'</mermaid>'
					);
				} );

				it( 'works correctly when empty', () => {
					editor.setData(
						'<pre spellcheck="false">' +
							'<code class="language-mermaid"></code>' +
						'</pre>'
					);

					expect( getModelData( model, { withoutSelection: true } ) ).to.equal(
						'<mermaid displayMode="split" source=""></mermaid>'
					);
				} );
			} );

			describe( 'data downcast', () => {
				it( 'works correctly', () => {
					// Using editor.setData() instead of setModelData helper because of #11365.
					editor.setData(
						'<pre spellcheck="false">' +
							'<code class="language-mermaid">flowchart TB\nA --> B\nB --> C</code>' +
						'</pre>'
					);

					expect( editor.getData() ).to.equal(
						'<pre spellcheck="false">' +
							'<code class="language-mermaid">flowchart TB\nA --&gt; B\nB --&gt; C</code>' +
						'</pre>'
					);
				} );

				it( 'works correctly when empty ', () => {
					// Using editor.setData() instead of setModelData helper because of #11365.
					editor.setData(
						'<pre spellcheck="false">' +
							'<code class="language-mermaid"></code>' +
						'</pre>'
					);

					expect( editor.getData() ).to.equal(
						'<pre spellcheck="false">' +
							'<code class="language-mermaid"></code>' +
						'</pre>'
					);
				} );
			} );

			describe( 'editing downcast', () => {
				it( 'works correctly without displayMode attribute', () => {
					// Using editor.setData() instead of setModelData helper because of #11365.
					editor.setData(
						'<pre spellcheck="false">' +
							'<code class="language-mermaid">flowchart TB\nA --> B\nB --> C</code>' +
						'</pre>'
					);

					expect( getViewData( editor.editing.view, { withoutSelection: true } ) ).to.equal(
						'<div class="ck-mermaid__split-mode ck-mermaid__wrapper ck-widget ck-widget_selected' +
							' ck-widget_with-selection-handle" contenteditable="false">' +
							'<div class="ck ck-widget__selection-handle"></div>' +
							// New lines replaced with space, same issue in getViewData as in #11365.
							'<textarea class="ck-mermaid__editing-view" data-cke-ignore-events="true"' +
								' placeholder="Insert mermaid source code"></textarea>' +
							'<div class="ck-mermaid__preview"></div>' +
							'<div class="ck ck-reset_all ck-widget__type-around"></div>' +
						'</div>'
					);
				} );

				it( 'works correctly with displayMode attribute', () => {
					setModelData( editor.model,
						'<mermaid source="foo" displayMode="preview"></mermaid>'
					);

					expect( getViewData( editor.editing.view, { withoutSelection: true } ) ).to.equal(
						'<div class="ck-mermaid__preview-mode ck-mermaid__wrapper ck-widget ck-widget_selected ' +
							'ck-widget_with-selection-handle" contenteditable="false">' +
							'<div class="ck ck-widget__selection-handle"></div>' +
							'<textarea class="ck-mermaid__editing-view" data-cke-ignore-events="true"' +
								' placeholder="Insert mermaid source code"></textarea>' +
							'<div class="ck-mermaid__preview"></div>' +
							'<div class="ck ck-reset_all ck-widget__type-around"></div>' +
						'</div>'
					);
				} );

				it( 'works correctly with empty source', () => {
					setModelData( editor.model,
						'<mermaid source="" displayMode="preview"></mermaid>'
					);

					expect( getViewData( editor.editing.view, { withoutSelection: true } ) ).to.equal(
						'<div class="ck-mermaid__preview-mode ck-mermaid__wrapper ck-widget ck-widget_selected ' +
							'ck-widget_with-selection-handle" contenteditable="false">' +
							'<div class="ck ck-widget__selection-handle"></div>' +
							'<textarea class="ck-mermaid__editing-view" data-cke-ignore-events="true"' +
								' placeholder="Insert mermaid source code"></textarea>' +
							'<div class="ck-mermaid__preview"></div>' +
							'<div class="ck ck-reset_all ck-widget__type-around"></div>' +
						'</div>'
					);
				} );

				describe( 'textarea value', () => {
					let domTextarea = null;

					beforeEach( () => {
						// Using editor.setData() instead of setModelData helper because of #11365.
						editor.setData(
							'<pre spellcheck="false">' +
							'<code class="language-mermaid">flowchart TB\nA --> B\nB --> C</code>' +
							'</pre>'
						);

						const textareaView = editor.editing.view.document.getRoot().getChild( 0 ).getChild( 1 );
						domTextarea = editor.editing.view.domConverter.viewToDom( textareaView );
					} );

					it( 'is properly set during the initial conversion', () => {
						expect( domTextarea.value ).to.equal( 'flowchart TB\nA --> B\nB --> C' );
					} );

					it( 'is properly updated after model\'s attribute change', () => {
						const { model } = editor;

						const mermaidModel = model.document.getRoot().getChild( 0 );

						model.change( writer => {
							writer.setAttribute( 'source', 'abc', mermaidModel );
						} );

						expect( domTextarea.value ).to.equal( 'abc' );
					} );

					it( 'doesn\'t loop if model attribute changes to the same value', () => {
						const { model } = editor;

						const mermaidModel = model.document.getRoot().getChild( 0 );

						model.change( writer => {
							writer.setAttribute( 'source', 'flowchart TB\nA --> B\nB --> C', mermaidModel );
						} );

						expect( domTextarea.value ).to.equal( 'flowchart TB\nA --> B\nB --> C' );
					} );
				} );

				describe( 'preview div', () => {
					let domPreviewContainer, renderMermaidStub;

					beforeEach( () => {
						// Using editor.setData() instead of setModelData helper because of #11365.
						editor.setData(
							'<pre spellcheck="false">' +
							'<code class="language-mermaid">flowchart TB\nA --> B\nB --> C</code>' +
							'</pre>'
						);

						const previewContainerView = editor.editing.view.document.getRoot().getChild( 0 ).getChild( 2 );
						domPreviewContainer = editor.editing.view.domConverter.viewToDom( previewContainerView );

						renderMermaidStub = sinon.stub( editor.plugins.get( 'MermaidEditing' ), '_renderMermaid' );
					} );

					afterEach( () => {
						renderMermaidStub.restore();
					} );

					it( 'has proper inner text set during the initial conversion', () => {
						expect( domPreviewContainer.textContent ).to.equal( 'flowchart TB\nA --> B\nB --> C' );
					} );

					it( 'has proper inner text set after a model\'s attribute change', () => {
						const { model } = editor;

						const mermaidModel = model.document.getRoot().getChild( 0 );

						model.change( writer => {
							writer.setAttribute( 'source', 'abc', mermaidModel );
						} );

						expect( domPreviewContainer.textContent ).to.equal( 'abc' );
					} );

					it( 'calls mermaid render function after a model\'s attribute change', () => {
						const { model } = editor;

						const mermaidModel = model.document.getRoot().getChild( 0 );

						model.change( writer => {
							writer.setAttribute( 'source', 'abc', mermaidModel );
						} );

						expect( renderMermaidStub.callCount ).to.equal( 1 );
						sinon.assert.calledWithExactly( renderMermaidStub, domPreviewContainer );
					} );
				} );
			} );

			it( 'adds a editing pipeline converter that has a precedence over code block', () => {
				setModelData( editor.model, '<mermaid source="foo"></mermaid>' );

				const firstViewChild = editor.editing.view.document.getRoot().getChild( 0 );

				expect( firstViewChild.name ).to.equal( 'div' );
				expect( firstViewChild.hasClass( 'ck-mermaid__wrapper' ), 'has ck-mermaid__wrapper class' ).to.be.true;
			} );

			it( 'does not convert code blocks other than mermaid language', () => {
				setModelData( editor.model, '<codeBlock language="javascript">foo</codeBlock>' );

				const firstViewChild = editor.editing.view.document.getRoot().getChild( 0 );

				expect( firstViewChild.name ).not.to.equal( 'div' );
				expect( firstViewChild.hasClass( 'ck-mermaid__wrapper' ), 'has ck-mermaid__wrapper class' ).to.be.false;
			} );

			it( 'adds a preview element', () => {
				setModelData( editor.model, '<mermaid source="foo"></mermaid>' );

				const widgetChildren = [ ...editor.editing.view.document.getRoot().getChild( 0 ).getChildren() ];
				const previewView = widgetChildren.filter( item => item.name === 'div' && item.hasClass( 'ck-mermaid__preview' ) );

				expect( previewView.length ).to.equal( 1 );
			} );

			it( 'adds an editing element', () => {
				setModelData( editor.model, '<mermaid source="foo"></mermaid>' );

				const widgetChildren = [ ...editor.editing.view.document.getRoot().getChild( 0 ).getChildren() ];
				const previewView = widgetChildren.filter(
					item => item.name === 'textarea' && item.hasClass( 'ck-mermaid__editing-view' )
				);

				expect( previewView.length ).to.equal( 1 );
			} );
		} );
	} );
} );
