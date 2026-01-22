import { afterEach, beforeEach, describe, it } from 'vitest';
import { ClassicEditor, Paragraph, _getModelData as getModelData, _setModelData as setModelData } from 'ckeditor5';

import MermaidSplitViewCommand from '../../src/commands/mermaidSplitViewCommand.js';
import MermaidEditing from '../../src/mermaidediting.js';

describe( 'MermaidSplitViewCommand', () => {
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

		command = new MermaidSplitViewCommand( editor );
	} );

	afterEach( () => {
		domElement.remove();
		return editor.destroy();
	} );

	describe( '#value', () => {
		it( 'should be true when mermaid element has displayMode attribute equal to "preview"', () => {
			setModelData( model, '<mermaid displayMode="preview" source="foo"></mermaid>' );

			expect( command.value ).to.equal( false );
		} );

		it( 'should be false when mermaid element has displayMode attribute equal to "split"', () => {
			setModelData( model, '<mermaid displayMode="split" source="foo"></mermaid>' );

			expect( command.value ).to.equal( true );
		} );

		it( 'should be false when mermaid element has source attribute equal to "source"', () => {
			setModelData( model, '<mermaid displayMode="source" source="foo"></mermaid>' );

			expect( command.value ).to.equal( false );
		} );
	} );

	describe( '#isEnabled', () => {
		describe( 'should be false', () => {
			it( 'when text is selected', () => {
				setModelData( model,
					'<paragraph>[foo]</paragraph>' +
					'<mermaid source="flowchart TB\nA --> B\nB --> C"></mermaid>'
				);

				expect( command.isEnabled ).to.be.false;
			} );

			it( 'when mermaid is part of the selection', () => {
				setModelData( model,
					'<paragraph>[foo</paragraph>' +
					'<mermaid source="flowchart TB\nA --> B\nB --> C"></mermaid>' +
					'<paragraph>b]az</paragraph>'
				);

				expect( command.isEnabled ).to.be.false;
			} );
		} );

		describe( 'should be true', () => {
			it( 'when selection is inside mermaid', () => {
				setModelData( model,
					'<paragraph>foo</paragraph>' +
					'<mermaid source="flowchart TB\nA --> B\nB --> C">[]</mermaid>'
				);

				expect( command.isEnabled ).to.be.true;
			} );

			it( 'when mermaid is selected', () => {
				setModelData( model,
					'<paragraph>foo</paragraph>' +
					'[<mermaid source="flowchart TB\nA --> B\nB --> C"></mermaid>]'
				);

				expect( command.isEnabled ).to.be.true;
			} );
		} );
	} );

	describe( 'execute()', () => {
		it( 'should change displayMode to "source" for mermaid', () => {
			setModelData( model,
				'[<mermaid displayMode="source" source="foo"></mermaid>]'
			);

			command.execute();

			expect( getModelData( model ) ).to.equal(
				'[<mermaid displayMode="split" source="foo"></mermaid>]'
			);
		} );
	} );
} );
