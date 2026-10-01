import { tester } from '../../../__tests__/utils/_tester';
import rule from '../index';

/** A violation that must be reported unless the file itself is excluded. */
const OFFENDING = `const logo = 'data:image/png;base64,iVBORw0KGgo=';`;

describe('no-inline-images', () => {
	tester.run('no-inline-images', rule, {
		valid: [
			// ----- Non-shipping files: the rule self-skips -----
			...[
				'packages/foo/src/__tests__/thing.tsx',
				'packages/foo/src/__mocks__/thing.ts',
				'packages/foo/src/__fixtures__/thing.ts',
				'packages/foo/src/thing/test.tsx',
				'packages/foo/src/thing/mocks.ts',
				'packages/foo/src/thing.test.ts',
				'packages/foo/src/thing.spec.tsx',
				'packages/foo/src/thing.mocks.tsx',
				'packages/foo/examples/basic.tsx',
				'packages/foo/examples-utils/helper.ts',
				'packages/foo/example-helpers/data.ts',
				'packages/foo/src/stories/thing.tsx',
				'packages/foo/src/test-helpers/data.ts',
				'packages/foo/src/mocks/data.ts',
				'packages/editor-plugin-card-tests/src/thing.ts',
				'packages/media-test-helpers/src/thing.ts',
				'packages/foo/src/examples.vr.ap.tsx',
				'packages/foo/src/thing.vr.tsx',
			].map((filename) => ({
				name: `non-shipping: ${filename}`,
				code: OFFENDING,
				filename,
			})),

			// ----- Non-image data URIs are out of scope: a different problem -----
			{
				name: 'json data URI',
				code: `const payload = 'data:application/json;base64,eyJhIjoxfQ==';`,
			},
			{
				name: 'font data URI',
				code: `const font = 'data:font/woff2;base64,d09GMgABAAAAAA==';`,
			},

			// ----- Prose and selectors that merely mention SVG -----
			{
				name: 'prose naming the format',
				code: `const helpText = 'Upload a PNG, JPG or svg file to continue.';`,
			},
			{
				name: 'prose naming the spec',
				code: `const docsLink = 'See the svg spec for details on viewBox.';`,
			},
			{
				name: 'CSS selector',
				code: `const iconSelector = 'svg > path';`,
			},
			{
				name: 'closing tag only',
				code: `const closingTagOnly = '</svg>';`,
			},

			// ----- Referencing the asset by path or URL is the pattern we steer towards -----
			{
				name: 'remote URL',
				code: `const remoteImage = 'https://example.com/logo.svg';`,
			},
			{
				name: 'local path',
				code: `const localPath = './assets/logo.svg';`,
			},
			{
				name: 'imported asset',
				code: `import logoUrl from './logo.svg'; export const Logo = () => <img alt="" src={logoUrl} />;`,
			},

			// ----- SVG that is not a data URI is out of scope: shipping an icon as a component
			// (JSX element or markup string) is legitimate; only the data-URI encoding is not -----
			{
				name: 'inline SVG markup as a string',
				code: `const svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M0 0h16v16H0z"/></svg>';`,
			},
			{
				name: 'self-closing SVG tag string',
				code: `const emptySvg = '<svg/>';`,
			},
			{
				name: 'SVG markup split across a concatenation',
				code: `const open = '<svg' + attrs + '>';`,
			},

			// ----- Hand-authored JSX <svg> is how @atlaskit/icon glyphs are built -----
			{
				name: 'inline <svg> JSX element',
				code: `export const CheckIcon = () => (
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden>
						<path d="M6 12L2 8l1.4-1.4L6 9.2l6.6-6.6L14 4z" />
					</svg>
				);`,
			},

			// ----- Template literal with no inlined payload -----
			{
				name: 'interpolated url() with no payload',
				// oxlint-disable-next-line no-template-curly-in-string
				code: 'const cssRule = (url) => `background-image: url(${url})`;',
			},

			// ----- Empty-payload data URIs carry no inlined bytes, e.g. the favicon-suppression
			// idiom `href="data:image/x-icon;,"` -----
			{
				name: 'empty-payload data URI as a JSX attribute value',
				code: `export const NoFavicon = () => <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon" />;`,
			},
			{
				name: 'empty-payload data URI in a plain string literal',
				code: `const noFavicon = 'data:image/x-icon;,';`,
			},
			{
				name: 'empty-payload data URI as the tail quasi of a template literal',
				// oxlint-disable-next-line no-template-curly-in-string
				code: 'const html = `${prefix}<link href="data:image/x-icon;," />`;',
			},
		],

		invalid: [
			// ----- Exclusion false-positive traps: these MUST still be linted -----
			...[
				'packages/foo/src/latest/thing.ts',
				'packages/foo/src/contest.ts',
				'packages/foo/src/attestation/thing.ts',
				'packages/linking-platform/src/store-widgets/thing.tsx',
				'packages/linking-platform/src/store-sections/thing.tsx',
				'packages/foo/src/protest.tsx',
				'packages/foo/src/exampleData.ts',
			].map((filename) => ({
				name: `not excluded: ${filename}`,
				code: OFFENDING,
				filename,
				errors: [{ messageId: 'dataUri' }],
			})),
			{
				name: 'codegen artifact with a SignedSource banner',
				code: [
					'/**',
					' * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}',
					' * @codegen <<SignedSource::3ee8292a79b161f2b692708d346bda7d>>',
					' * @codegenCommand yarn workspace @atlaskit/logo generate:components',
					' */',
					OFFENDING,
				].join('\n'),
				filename: 'packages/design-system/logo/src/artifacts/admin/logo.tsx',
				errors: [{ messageId: 'dataUri' }],
			},
			{
				name: 'base64 raster data URI',
				code: `const logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==';`,
				errors: [{ messageId: 'dataUri' }],
			},
			{
				name: 'svg+xml data URI, not base64',
				code: `const icon = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3C/svg%3E';`,
				errors: [{ messageId: 'dataUri' }],
			},
			{
				name: 'template literal whose static prefix is a data URI',
				// oxlint-disable-next-line no-template-curly-in-string
				code: 'const toUri = (bytes) => `data:image/jpeg;base64,${bytes}`;',
				errors: [{ messageId: 'dataUri' }],
			},
			{
				name: 'data URI as a JSX attribute value',
				code: `export const Avatar = () => <img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />;`,
				errors: [{ messageId: 'dataUri' }],
			},
			{
				name: 'data URI inside a CSS url() in a style string',
				code: `const backgroundRule = 'background-image: url(data:image/webp;base64,UklGRhIAAABXRUJQVlA4TAYAAAAvAAAAAA==)';`,
				errors: [{ messageId: 'dataUri' }],
			},
			{
				name: 'concatenation whose first operand carries the data URI prefix',
				code: `const toUri = (bytes) => 'data:image/avif;base64,' + bytes;`,
				errors: [{ messageId: 'dataUri' }],
			},
		],
	});
});
