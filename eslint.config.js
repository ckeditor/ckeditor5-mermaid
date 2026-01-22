/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintConfigCKEditor5 from 'eslint-config-ckeditor5';
import eslintPluginCKEditor5Rules from 'eslint-plugin-ckeditor5-rules';

export default defineConfig( [
	eslintConfigCKEditor5,
	{
		name: 'Ignored files config',
		ignores: [
			// Ignore the entire `dist/`.
			'dist/**'
		]
	},
	{
		name: 'Base config',
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser
			}
		},
		linterOptions: {
			reportUnusedInlineConfigs: 'error',
			reportUnusedDisableDirectives: 'error'
		},
		plugins: {
			'ckeditor5-rules': eslintPluginCKEditor5Rules
		},
		rules: {
			// As required by the ECMAScript (ESM) standard, all imports must include a file extension.
			// If the import does not include it, this rule will try to automatically detect the correct file extension.
			'ckeditor5-rules/require-file-extensions-in-imports': [ 'error', {
				extensions: [ '.ts', '.js', '.json' ]
			} ]
		}
	}
] );
