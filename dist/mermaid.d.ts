/**
 * @module mermaid/mermaid
 */
import { Plugin } from 'ckeditor5';
import MermaidEditing from './mermaidediting.js';
import MermaidToolbar from './mermaidtoolbar.js';
import MermaidUI from './mermaidui.js';
export declare class Mermaid extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires(): readonly [typeof MermaidEditing, typeof MermaidToolbar, typeof MermaidUI];
    /**
     * @inheritDoc
     */
    static get pluginName(): "Mermaid";
}
