/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import globals from 'globals';
import { defineConfig } from 'eslint/config';
import ckeditor5Rules from 'eslint-plugin-ckeditor5-rules';
import ckeditor5Config from 'eslint-config-ckeditor5';

export default defineConfig( [
	{
		ignores: [
			// Ignore the entire `build/` (the DLL build).
			'build/**',
			// Ignore the entire `dist/`.
			'dist/**'
		]
	},

	{
		extends: ckeditor5Config,

		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser
			}
		},

		linterOptions: {
			reportUnusedDisableDirectives: 'warn',
			reportUnusedInlineConfigs: 'warn'
		},

		plugins: {
			'ckeditor5-rules': ckeditor5Rules
		},

		rules: {
			// This rule disallows importing core DLL packages directly. Imports should be done using the `ckeditor5` package.
			// Also, importing non-DLL packages is not allowed. If the package requires other features to work, they should be
			// specified as soft-requirements.
			// Read more: https://ckeditor.com/docs/ckeditor5/latest/builds/guides/migration/migration-to-26.html#soft-requirements.
			'ckeditor5-rules/ckeditor-imports': 'error',
			//  This rule disallows importing from any path other than the package main entrypoint.
			'ckeditor5-rules/allow-imports-only-from-main-package-entry-point': 'error',
			// As required by the ECMAScript (ESM) standard, all imports must include a file extension.
			// If the import does not include it, this rule will try to automatically detect the correct file extension.
			'ckeditor5-rules/require-file-extensions-in-imports': [
				'error',
				{
					extensions: [ '.ts', '.js', '.json' ]
				}
			]
		}
	},

	{
		files: [ 'scripts/**/*' ],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node
			}
		}
	},

	{
		files: [ 'tests/**/*.js', 'sample/**/*.js' ],
		rules: {
			// To write complex tests, you may need to import files that are not exported in DLL files by default.
			// Hence, imports CKEditor 5 packages in test files are not checked.
			'ckeditor5-rules/ckeditor-imports': 'off'
		}
	}
] );
