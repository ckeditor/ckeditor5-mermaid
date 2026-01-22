/**
 * @module mermaid/mermaidtoolbar
 */
import { Plugin, WidgetToolbarRepository } from 'ckeditor5';
export default class MermaidToolbar extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires(): readonly [typeof WidgetToolbarRepository];
    /**
     * @inheritDoc
     */
    static get pluginName(): "MermaidToolbar";
    /**
     * @inheritDoc
     */
    afterInit(): void;
}
