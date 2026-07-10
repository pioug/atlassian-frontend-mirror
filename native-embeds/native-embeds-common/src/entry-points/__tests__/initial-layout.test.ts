import { setParameters } from '../../index';
import { resolveNativeEmbedInitialLayout } from '../initial-layout';

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
