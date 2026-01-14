/**
 * @module mermaid/mermaidui
 */
import { Plugin } from 'ckeditor5';
export default class MermaidUI extends Plugin {
    /**
     * @inheritDoc
     */
    static get pluginName(): "MermaidUI";
    /**
     * @inheritDoc
     */
    init(): void;
    /**
     * Adds all mermaid-related buttons.
     *
     * @private
     */
    private _addButtons;
    /**
     * Adds the button for inserting mermaid.
     *
     * @private
     */
    private _addInsertMermaidButton;
    /**
     * Adds the button linking to the mermaid guide.
     */
    private _addMermaidInfoButton;
    /**
     * Adds the mermaid balloon toolbar button.
     */
    private _createToolbarButton;
}
