import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { setParameters } from '../../index';
import {
	resolveNativeEmbedEffectiveWidth,
	resolveNativeEmbedInitialLayout,
} from '../initial-layout';

describe('resolveNativeEmbedInitialLayout', () => {
	it('returns fallback dimensions for undefined params', () => {
		expect(resolveNativeEmbedInitialLayout({})).toEqual({
			alignment: 'center',
			effectiveHeight: 600,
			effectiveWidth: undefined,
			hasEmbedBorder: true,
			lockAspectRatio: true,
			placeholderId: undefined,
		});
	});

	it('uses fallback dimensions when no explicit width or height are stored', () => {
		const parameters = setParameters({}, { url: 'https://example.com/native' });

		expect(resolveNativeEmbedInitialLayout({ parameters })).toMatchObject({
			effectiveHeight: 600,
			effectiveWidth: undefined,
			lockAspectRatio: true,
		});
	});

	it('uses explicit width and height macro params', () => {
		const parameters = setParameters({}, { width: 900, height: 500 });

		expect(resolveNativeEmbedInitialLayout({ parameters })).toMatchObject({
			effectiveHeight: 500,
			effectiveWidth: 900,
		});
	});

	it('derives height from explicit aspect ratio and width', () => {
		const parameters = setParameters({}, { width: 1200, aspectRatio: 6 });

		expect(resolveNativeEmbedInitialLayout({ parameters })).toMatchObject({
			effectiveHeight: 200,
			effectiveWidth: 1200,
		});
	});

	it('uses manifest default dimensions when macro params are absent', () => {
		const parameters = setParameters({}, { url: 'https://example.com/native' });

		expect(
			resolveNativeEmbedInitialLayout({
				manifest: { parameterDefaults: { width: 760, height: 420 } },
				parameters,
			}),
		).toMatchObject({
			effectiveHeight: 420,
			effectiveWidth: 760,
		});
	});

	describe('manifest aspect ratio defaults', () => {
		const manifest = { parameterDefaults: { width: 760, aspectRatio: 16 / 9 } };

		it.each([
			{ dimensions: {}, expectedWidth: 760, expectedHeight: 428 },
			{ dimensions: { width: 960 }, expectedWidth: 960, expectedHeight: 540 },
			{ dimensions: { aspectRatio: 2 }, expectedWidth: 760, expectedHeight: 380 },
			{ dimensions: { height: 600 }, expectedWidth: 760, expectedHeight: 600 },
		])('resolves $dimensions with the gate on', ({ dimensions, expectedWidth, expectedHeight }) => {
			passGate('native_embeds_manifest_dimension_defaults');
			expect(
				resolveNativeEmbedInitialLayout({ manifest, parameters: setParameters({}, dimensions) }),
			).toMatchObject({ effectiveWidth: expectedWidth, effectiveHeight: expectedHeight });
		});

		it('keeps legacy height with the gate off', () => {
			failGate('native_embeds_manifest_dimension_defaults');
			expect(resolveNativeEmbedInitialLayout({ manifest })).toMatchObject({
				effectiveWidth: 760,
				effectiveHeight: 600,
			});
		});

		it.each([0, -1, Infinity, NaN])('ignores invalid default aspect ratio %s', (aspectRatio) => {
			passGate('native_embeds_manifest_dimension_defaults');
			expect(
				resolveNativeEmbedInitialLayout({
					manifest: { parameterDefaults: { width: 760, aspectRatio } },
				}),
			).toMatchObject({ effectiveWidth: 760, effectiveHeight: 600 });
		});
	});

	it('respects manifest border and aspect ratio settings', () => {
		expect(
			resolveNativeEmbedInitialLayout({
				manifest: {
					lockResizeAspectRatio: false,
					uiConfig: { showBorder: false },
				},
			}),
		).toMatchObject({
			hasEmbedBorder: false,
			lockAspectRatio: false,
		});
	});

	it('supports raw macro param value-object and primitive shapes', () => {
		expect(
			resolveNativeEmbedInitialLayout({
				parameters: {
					macroParams: {
						alignment: { value: 'left' },
						width: { value: '800' },
						height: '450' as never,
					},
				},
			}),
		).toMatchObject({
			alignment: 'left',
			effectiveHeight: 450,
			effectiveWidth: 800,
		});
	});
});

describe('resolveNativeEmbedEffectiveWidth', () => {
	it.each([
		{ width: undefined, defaultWidth: undefined, expectedWidth: undefined },
		{ width: undefined, defaultWidth: 760, expectedWidth: 760 },
		{ width: 900, defaultWidth: undefined, expectedWidth: 900 },
		{ width: 900, defaultWidth: 760, expectedWidth: 900 },
		{ width: 0, defaultWidth: 760, expectedWidth: 0 },
	])(
		'resolves stored width $width with manifest default $defaultWidth',
		({ width, defaultWidth, expectedWidth }) => {
			expect(
				resolveNativeEmbedEffectiveWidth({
					manifest:
						defaultWidth === undefined ? undefined : { parameterDefaults: { width: defaultWidth } },
					width,
				}),
			).toBe(expectedWidth);
		},
	);
});
