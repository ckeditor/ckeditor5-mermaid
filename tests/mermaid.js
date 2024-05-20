import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import Mermaid from '../src/mermaid.js';

import { setData as setModelData } from '@ckeditor/ckeditor5-engine/src/dev-utils/model.js';

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
