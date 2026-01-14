/**
 * @module mermaid/mermaidsplitviewcommand
 */
import { Command } from 'ckeditor5';
/**
 * The mermaid split view command.
 *
 * Allows to switch to a split view mode.
 *
 * @extends module:core/command~Command
 */
export default class MermaidSplitViewCommand extends Command {
    /**
     * @inheritDoc
     */
    refresh(): void;
    /**
     * @inheritDoc
     */
    execute(): void;
}
