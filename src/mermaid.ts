/**
 * @module mermaid/mermaid
 */

import { Plugin } from 'ckeditor5';
import MermaidEditing from './mermaidediting.js';
import MermaidToolbar from './mermaidtoolbar.js';
import MermaidUI from './mermaidui.js';

export class Mermaid extends Plugin {
	/**
	 * @inheritDoc
	 */
	public static get requires() {
		return [ MermaidEditing, MermaidToolbar, MermaidUI ] as const;
	}

	/**
	 * @inheritDoc
	 */
	public static get pluginName() {
		return 'Mermaid' as const;
	}
}
