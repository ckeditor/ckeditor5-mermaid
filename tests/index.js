import { Mermaid as MermaidDll, icons } from '../src';
import Mermaid from '../src/mermaid';

import infoIcon from './../theme/icons/info.svg';
import insertMermaidIcon from './../theme/icons/insert.svg';
import previewModeIcon from './../theme/icons/previewMode.svg';
import splitModeIcon from './../theme/icons/splitMode.svg';
import sourceModeIcon from './../theme/icons/sourceMode.svg';

describe( 'CKEditor5 Mermaid DLL', () => {
	it( 'exports MermaidWidget', () => {
		expect( MermaidDll ).to.equal( Mermaid );
	} );

	describe( 'icons', () => {
		it( 'exports the "insertMermaidIcon" icon', () => {
			expect( icons.insertMermaidIcon ).to.equal( insertMermaidIcon );
		} );
		it( 'exports the "infoIcon" icon', () => {
			expect( icons.infoIcon ).to.equal( infoIcon );
		} );
		it( 'exports the "previewModeIcon" icon', () => {
			expect( icons.previewModeIcon ).to.equal( previewModeIcon );
		} );
		it( 'exports the "splitModeIcon" icon', () => {
			expect( icons.splitModeIcon ).to.equal( splitModeIcon );
		} );
		it( 'exports the "sourceModeIcon" icon', () => {
			expect( icons.sourceModeIcon ).to.equal( sourceModeIcon );
		} );
	} );
} );
