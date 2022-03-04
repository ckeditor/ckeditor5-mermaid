import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Mermaid from '../src/mermaid';

import { setData as setModelData } from '@ckeditor/ckeditor5-engine/src/dev-utils/model';

/* global document */

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
				]
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
