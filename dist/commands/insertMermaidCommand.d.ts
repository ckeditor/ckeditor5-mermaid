/**
 * @module mermaid/insertmermaidcommand
 */
import { Command } from 'ckeditor5';
/**
 * The insert mermaid command.
 *
 * Allows to insert mermaid.
 *
 * @extends module:core/command~Command
 */
export default class InsertMermaidCommand extends Command {
    /**
     * @inheritDoc
     */
    refresh(): void;
    /**
     * @inheritDoc
     */
    execute(): any;
}
