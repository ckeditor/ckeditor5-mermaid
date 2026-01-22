import type { Mermaid } from './index.js';
declare module '@ckeditor/ckeditor5-core' {
    interface PluginsMap {
        [Mermaid.pluginName]: Mermaid;
    }
}
