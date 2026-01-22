import { describe, it } from 'vitest';
import { Mermaid as MermaidExport } from '../src/index.js';
import Mermaid from '../src/mermaid.js';

describe( 'CKEditor5 Mermaid DLL', () => {
	it( 'exports MermaidWidget', () => {
		expect( MermaidExport ).to.equal( Mermaid );
	} );
} );
