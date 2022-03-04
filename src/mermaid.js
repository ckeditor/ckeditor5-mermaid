/**
 * @module mermaid/mermaid
 */

import { Plugin } from 'ckeditor5/src/core';

import MermaidEditing from './mermaidediting';
import MermaidToolbar from './mermaidtoolbar';
import MermaidUI from './mermaidui';

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
