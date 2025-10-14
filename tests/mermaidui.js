import { afterEach, beforeEach, describe, it } from 'vitest';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { _setModelData as setModelData } from '@ckeditor/ckeditor5-engine';

import Mermaid from '../src/mermaid.js';
import MermaidUI from '../src/mermaidui.js';

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
				],
				licenseKey: 'GPL'
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

		it( 'should set focus inside textarea of a newly created mermaid', () => {
			const button = editor.ui.componentFactory.create( 'mermaid' );

			button.fire( 'execute' );

			expect( document.activeElement.tagName ).to.equal( 'TEXTAREA' );
		} );

		it( 'should not crash if the button is fired inside model.change()', () => {
			const button = editor.ui.componentFactory.create( 'mermaid' );

			setModelData( editor.model, '[]' );

			editor.model.change( () => {
				button.fire( 'execute' );
			} );
			// As the conversion is to be executed after the model.change(), we don't have access to the fully prepared view and
			// despite that, we should still successfully add mermaid widget to the editor, not requiring the selection change
			// to the inside of the nonexisting textarea element.
		} );
	} );
} );

