import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { _setModelData as setModelData } from '@ckeditor/ckeditor5-engine';

import Mermaid from '../src/mermaid.js';

describe( 'Mermaid', () => {
	it( 'should be named', () => {
		expect( Mermaid.pluginName ).to.equal( 'Mermaid' );
	} );

	describe( 'init()', () => {
		let domElement, editor;

		beforeEach( async () => {
			domElement = document.createElement( 'div' );
			document.body.appendChild( domElement );

			editor = await ClassicEditor.create( domElement, {
				plugins: [
					Paragraph,
					Heading,
					Essentials,
					Mermaid
				],
				toolbar: [
					'mermaid'
				],
				licenseKey: 'GPL'
			} );

			setModelData( editor.model, '<paragraph>[]</paragraph>' );
		} );

		afterEach( () => {
			domElement.remove();
			return editor.destroy();
		} );

		it( 'should add an icon to the toolbar', () => {
			expect( editor.ui.componentFactory.has( 'Mermaid' ) ).to.equal( true );
		} );
	} );
} );
