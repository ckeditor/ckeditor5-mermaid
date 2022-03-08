import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Mermaid from '../src/mermaid';
import MermaidUI from '../src/mermaidui';

/* global document */

describe( 'MermaidUI', () => {
	it( 'should be named', () => {
		expect( MermaidUI.pluginName ).to.equal( 'MermaidUI' );
	} );

	describe( 'init()', () => {
		let domElement, editor;

		beforeEach( async () => {
			domElement = document.createElement( 'div' );
			document.body.appendChild( domElement );

			editor = await ClassicEditor.create( domElement, {
				plugins: [
					Mermaid
				]
			} );
		} );

		afterEach( () => {
			domElement.remove();
			return editor.destroy();
		} );

		it( 'should register the UI item', () => {
			expect( editor.ui.componentFactory.has( 'mermaid' ) ).to.equal( true );
		} );

		it( 'has the base properties', () => {
			const button = editor.ui.componentFactory.create( 'mermaid' );

			expect( button ).to.have.property( 'label', 'Insert Mermaid diagram' );
			expect( button ).to.have.property( 'icon' );
			expect( button ).to.have.property( 'tooltip', true );
		} );

		describe( 'UI components', () => {
			for ( const buttonName of [
				'mermaidPreview',
				'mermaidSourceView',
				'mermaidSplitView',
				'mermaidInfo'
			] ) {
				it( `should register the ${ buttonName } button`, () => {
					expect( editor.ui.componentFactory.has( buttonName ) ).to.equal( true );
				} );

				it( `should add the base properties for ${ buttonName } button`, () => {
					const button = editor.ui.componentFactory.create( buttonName );

					expect( button ).to.have.property( 'label' );
					expect( button ).to.have.property( 'icon' );
					expect( button ).to.have.property( 'tooltip', true );
				} );
			}
		} );
	} );
} );

