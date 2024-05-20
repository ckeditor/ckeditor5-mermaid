/**
 * @module mermaid/mermaid
 */

import { Plugin } from 'ckeditor5/src/core.js';

import MermaidEditing from './mermaidediting.js';
import MermaidToolbar from './mermaidtoolbar.js';
import MermaidUI from './mermaidui.js';

import '../theme/mermaid.css';

export default class Mermaid extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ MermaidEditing, MermaidToolbar, MermaidUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Mermaid';
	}
}
