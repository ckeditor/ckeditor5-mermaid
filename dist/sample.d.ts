/**
 * This file is used to test the package during development. When you run the `start` script,
 * a local server is started with the `index.html` as a starting point. The `index.html` file
 * loads this script which creates and configures the editor instance.
 */
import { ClassicEditor } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
declare global {
    interface Window {
        editor: ClassicEditor;
    }
}
