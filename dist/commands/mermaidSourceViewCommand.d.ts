/**
 * @module mermaid/mermaidsourceviewcommand
 */
import { Command } from 'ckeditor5';
/**
 * The mermaid source view command.
 *
 * Allows to switch to a source view mode.
 *
 * @extends module:core/command~Command
 */
export default class MermaidSourceViewCommand extends Command {
    /**
     * @inheritDoc
     */
    refresh(): void;
    /**
     * @inheritDoc
     */
    execute(): void;
}
