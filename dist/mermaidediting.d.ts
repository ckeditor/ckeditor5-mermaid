/**
 * @module mermaid/mermaidediting
 */
import { Plugin } from 'ckeditor5';
export default class MermaidEditing extends Plugin {
    /**
     * @inheritDoc
     */
    static get pluginName(): "MermaidEditing";
    /**
     * @inheritDoc
     */
    init(): void;
    /**
     * @inheritDoc
     */
    afterInit(): void;
    /**
     * @inheritDoc
    */
    private _registerCommands;
    /**
     * Adds converters.
     */
    private _defineConverters;
    private _mermaidDataDowncast;
    private _mermaidDowncast;
    private _sourceAttributeDowncast;
    private _mermaidUpcast;
    /**
     * Renders Mermaid (a parsed `source`) in a given `domElement`.
     */
    private _renderMermaid;
}
