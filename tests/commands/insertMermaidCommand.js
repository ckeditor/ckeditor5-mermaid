import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import {
	_setModelData as setModelData,
	_getModelData as getModelData
} from '@ckeditor/ckeditor5-engine';

import InsertMermaidCommand from '../../src/commands/insertMermaidCommand.js';
import MermaidEditing from '../../src/mermaidediting.js';

describe( 'InsertMermaidCommand', () => {
	let domElement, editor, model, command;

	beforeEach( async () => {
		domElement = document.createElement( 'div' );
		document.body.appendChild( domElement );

		editor = await ClassicEditor.create( domElement, {
			plugins: [
				MermaidEditing,
				Paragraph
			],
			licenseKey: 'GPL'
		} );

		model = editor.model;

		command = new InsertMermaidCommand( editor );
	} );

	afterEach( () => {
		domElement.remove();
		return editor.destroy();
	} );

	describe( '#isEnabled', () => {
		describe( 'should be false', () => {
			it( 'when selection is inside mermaid', () => {
				setModelData( model,
					'<paragraph>foo</paragraph>' +
					'<mermaid source="flowchart TB\nA --> B\nB --> C">[]</mermaid>'
				);

				expect( command.isEnabled ).to.be.false;
			} );

			it( 'when mermaid is selected', () => {
				setModelData( model,
					'<paragraph>foo</paragraph>' +
					'[<mermaid source="flowchart TB\nA --> B\nB --> C"></mermaid>]'
				);

				expect( command.isEnabled ).to.be.false;
			} );
		} );

		describe( 'should be true', () => {
			it( 'when text is selected', () => {
				setModelData( model,
					'<paragraph>[foo]</paragraph>' +
					'<mermaid source="flowchart TB\nA --> B\nB --> C"></mermaid>'
				);

				expect( command.isEnabled ).to.be.true;
			} );

			it( 'when mermaid is part of the selection', () => {
				setModelData( model,
					'<paragraph>[foo</paragraph>' +
					'<mermaid source="flowchart TB\nA --> B\nB --> C"></mermaid>' +
					'<paragraph>b]az</paragraph>'
				);

				expect( command.isEnabled ).to.be.true;
			} );
		} );
	} );

	describe( 'execute()', () => {
		it( 'should add sample mermaid', () => {
			setModelData( model,
				'<paragraph>[foo]</paragraph>'
			);

			command.execute();

			expect( getModelData( model, { withoutSelection: true } ) ).to.equal(
				'<mermaid displayMode="split" source="flowchart TB\nA --> B\nB --> C"></mermaid>'
			);
		} );
	} );
} );
