import ClassicTestEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import {
	setData
} from '@ckeditor/ckeditor5-engine/src/dev-utils/model';
import WidgetToolbarRepository from '@ckeditor/ckeditor5-widget/src/widgettoolbarrepository';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';

import Mermaid from '../src/mermaid';

/* global document */

describe( 'MermaidToolbar', () => {
	let editor, domElement, widgetToolbarRepository, balloon, toolbar, model;

	beforeEach( () => {
		domElement = document.createElement( 'div' );
		document.body.appendChild( domElement );

		return ClassicTestEditor.create( domElement, {
			plugins: [ Essentials, Paragraph, Mermaid ],
			mermaid: {
				toolbar: [ 'fake_button' ]
			}
		} ).then( newEditor => {
			editor = newEditor;
			model = newEditor.model;
			widgetToolbarRepository = editor.plugins.get( WidgetToolbarRepository );
			toolbar = widgetToolbarRepository._toolbarDefinitions.get( 'mermaidToolbar' ).view;
			balloon = editor.plugins.get( 'ContextualBalloon' );
		} );
	} );

	afterEach( () => {
		domElement.remove();
		return editor.destroy();
	} );

	describe( 'toolbar', () => {
		it( 'should be initialized with expected buttons', () => {
			expect( toolbar.items ).to.have.length( 5 );
			expect( toolbar.items.get( 0 ).label ).to.equal( 'Source view' );
			expect( toolbar.items.get( 1 ).label ).to.equal( 'Split view' );
			expect( toolbar.items.get( 2 ).label ).to.equal( 'Preview' );
			expect( toolbar.items.get( 4 ).label ).to.equal( 'Read more about Mermaid diagram syntax' );
		} );
	} );

	describe( 'integration with the editor focus', () => {
		it( 'should show the toolbar when the editor gains focus and the mermaid widget is selected', () => {
			setData( model,
				'[<mermaid source="flowchart TB\nA --> B\nB --> C"></mermaid>]'
			);

			expect( balloon.visibleView ).to.be.null;
			// @todo: remove me
			// expect( balloon.visibleView === null, 'balloon.visibleView === null' ).to.be.true;

			editor.ui.focusTracker.isFocused = true;
			expect( balloon.visibleView ).to.equal( toolbar );
			// @todo: remove me
			// expect( balloon.visibleView === toolbar, 'balloon.visibleView === toolbar' ).to.be.true;
		} );

		it( 'should hide the toolbar when the editor loses focus and the mermaid widget is selected', () => {
			setData( model,
				'[<mermaid source="flowchart TB\nA --> B\nB --> C"></mermaid>]'
			);

			editor.ui.focusTracker.isFocused = true;
			expect( balloon.visibleView ).to.equal( toolbar );

			editor.ui.focusTracker.isFocused = false;
			expect( balloon.visibleView ).to.be.null;
		} );
	} );

	describe( 'integration with the editor selection', () => {
		beforeEach( () => {
			editor.ui.focusTracker.isFocused = true;
		} );

		it( 'should show the toolbar on ui#update when the mermaid widget is selected', () => {
			setData( model,
				'<paragraph>[foo]</paragraph>' +
				'<mermaid source="flowchart TB\nA --> B\nB --> C"></mermaid>'
			);

			expect( balloon.visibleView ).to.be.null;

			editor.ui.fire( 'update' );

			expect( balloon.visibleView ).to.be.null;

			model.change( writer => {
				// Set selection to the [<mermaid source="flowchart TB\nA --> B\nB --> C"></mermaid>]
				writer.setSelection( model.document.getRoot().getChild( 1 ), 'on' );
			} );

			expect( balloon.visibleView ).to.equal( toolbar );

			// Make sure successive change does not throw, e.g. attempting
			// to insert the toolbar twice.
			editor.ui.fire( 'update' );

			expect( balloon.visibleView ).to.equal( toolbar );
		} );

		it( 'should hide the toolbar on ui#update if the mermaid widget is de–selected', () => {
			setData( model,
				'<paragraph>foo</paragraph>' +
				'[<mermaid source="flowchart TB\nA --> B\nB --> C"></mermaid>]'
			);
			expect( balloon.visibleView ).to.equal( toolbar );

			model.change( writer => {
				// Select the  <paragraph>[foo]</paragraph>
				writer.setSelection( model.document.getRoot().getChild( 0 ), 'in' );
			} );

			expect( balloon.visibleView ).to.be.null;

			// Make sure successive change does not throw, e.g. attempting
			// to remove the toolbar twice.
			editor.ui.fire( 'update' );

			expect( balloon.visibleView ).to.be.null;
		} );

		it( 'should not hide the toolbar on ui#update when the selection is being moved from one mermaid widget to another', () => {
			setData( model,
				'[<mermaid source="flowchart TB\nA --> B\nB --> C"></mermaid>]' +
				'<mermaid source="flowchart TB\nA --> B\nB --> C"></mermaid>'
			);

			expect( balloon.visibleView ).to.equal( toolbar );

			model.change( writer => {
				// Set selection to the second <mermaid></mermaid>
				writer.setSelection( model.document.selection.getSelectedElement().nextSibling, 'on' );
			} );

			expect( balloon.visibleView ).to.equal( toolbar );

			// Make sure successive change does not throw, e.g. attempting
			// to insert the toolbar twice.
			editor.ui.fire( 'update' );

			expect( balloon.visibleView ).to.equal( toolbar );
		} );
	} );
} );
