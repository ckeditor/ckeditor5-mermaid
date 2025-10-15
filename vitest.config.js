/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { defineConfig } from 'vitest/config';
import svg from 'vite-plugin-svgo';

export default defineConfig( {
	plugins: [ svg() ],
	test: {
		browser: {
			enabled: true,
			provider: 'webdriverio',
			ui: false,
			screenshotFailures: false,
			instances: [
				{
					browser: 'chrome',
					headless: true,
					capabilities: {
						'goog:chromeOptions': {
							args: [ '--headless=new', '--no-sandbox', '--disable-gpu' ]
						}
					}
				}
			]
		},
		include: [ 'tests/**/*.js' ],
		exclude: [ 'tests/manual/**/*.js' ],
		globals: true,
		watch: false,
		coverage: {
			provider: 'istanbul',
			include: [ 'src' ],
			reporter: [ 'text', 'json', 'html', 'lcov' ]
		}
	}
} );
