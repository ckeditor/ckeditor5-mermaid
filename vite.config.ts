import { resolve, isAbsolute, extname } from 'node:path';
import { defineConfig, mergeConfig, type ViteUserConfig } from 'vitest/config';
import svg from 'vite-plugin-svgo';
import { webdriverio } from '@vitest/browser-webdriverio';
import pkgJson from './package.json' with { type: 'json' };

/**
 * This configuration file uses Vite's "mode" to differentiate between different builds. By default,
 * only the shared configuration is used. It configures common plugins and Vitest.
 *
 * However, when "--mode npm" is passed to Vite, the configuration for building the package
 * for npm is merged in. Similarly, when "--mode browser" is used, the configuration for
 * building the browser bundles is merged in.
 */
export default defineConfig( ( { mode } ) => {
	const entry = resolve( import.meta.dirname, 'src/index.ts' );

	function externals( externalPackages: Record<string, string> ): ( id: string ) => boolean {
		const externals = Object.keys( externalPackages );
		const extensions = [ '.ts', '.mts', '.mjs', '.js', '.json', '.node' ];

		return ( id: string ) => {
			// Bundle relative and absolute imports.
			if ( id.startsWith( '.' ) || isAbsolute( id ) ) {
				return false;
			}

			// Don't bundle imports that exactly match the `external` list.
			if ( externals.includes( id ) ) {
				return true;
			}

			const packageName = id
				.split( '/' )
				.slice( 0, id.startsWith( '@' ) ? 2 : 1 )
				.join( '/' );

			const extension = extname( id );

			// Don't bundle, unless the import has non-JS or non-TS file extension (for example `.css`).
			return externals.includes( packageName ) && ( !extension || extensions.includes( extension ) );
		};
	}

	/**
	 * Configuration shared between all builds.
	 */
	const sharedConfig: ViteUserConfig = {
		plugins: [
			svg()
		],

		build: {
			emptyOutDir: false,
			target: 'es2022'
		},

		/**
		 * Vitest configuration.
		 */
		test: {
			browser: {
				enabled: true,
				instances: [
					{ browser: 'chrome' }
				],
				provider: webdriverio(),
				headless: true,
				ui: false
			},
			include: [
				'tests/**/*.[jt]s'
			],
			globals: true,
			watch: false,
			coverage: {
				thresholds: {
					lines: 100,
					functions: 100,
					branches: 100,
					statements: 100
				},
				provider: 'istanbul',
				include: [
					'src'
				]
			}
		}
	};

	/**
	 * Settings specific to the npm build (ESM).
	 */
	const npmConfig: ViteUserConfig = {
		build: {
			minify: false,
			outDir: 'dist',
			lib: {
				entry,
				formats: [ 'es' ],
				cssFileName: 'index',
				fileName: ( format: string, name: string ) => name + '.js'
			},
			rollupOptions: {
				external: externals( {
					...pkgJson.dependencies,
					...pkgJson.peerDependencies
				} )
			}
		}
	};

	/**
	 * Settings specific to the browser builds (ESM and UMD).
	 */
	const browserConfig: ViteUserConfig = {
		build: {
			minify: 'terser',
			outDir: 'dist/browser',
			lib: {
				entry,
				name: '@ckeditor/ckeditor5-mermaid',
				formats: [ 'es', 'umd' ],
				cssFileName: 'index',
				fileName: ( format: string, name: string ) => name + '.' + format + '.js'
			},
			rollupOptions: {
				external: externals( pkgJson.peerDependencies ),
				output: {
					inlineDynamicImports: true,
					globals: {
						'ckeditor5': 'CKEDITOR'
					}
				}
			}
		}
	};

	// Map of available build settings.
	const BUILD_SETTINGS: Record<string, ViteUserConfig> = {
		npm: npmConfig,
		browser: browserConfig
	};

	return mergeConfig(
		sharedConfig,
		BUILD_SETTINGS[ mode ] || {}
	);
} );
