/**
 * @module mermaid/mermaidpreviewcommand
 */
import { Command } from 'ckeditor5';
/**
 * The mermaid preview command.
 *
 * Allows to switch to a preview mode.
 *
 * @extends module:core/command~Command
 */
export default class MermaidPreviewCommand extends Command {
    /**
     * @inheritDoc
     */
    refresh(): void;
    /**
     * @inheritDoc
     */
    execute(): void;
}
