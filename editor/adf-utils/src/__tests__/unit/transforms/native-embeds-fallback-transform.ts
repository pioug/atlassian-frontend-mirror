import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { nativeEmbedsFallbackTransform } from '../../../transforms/native-embeds-fallback-transform';
import type { ADFEntity } from '../../../types';

const schema = defaultSchema;

describe('nativeEmbedsFallbackTransform', () => {
	it('returns unchanged ADF when extension is not a native embed', () => {
		const adf: ADFEntity = {
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'extension',
					attrs: {
						extensionType: 'com.atlassian.confluence.macro.core',
						extensionKey: 'some-macro',
						parameters: { url: 'https://example.com' },
					},
				},
			],
		};

		const result = nativeEmbedsFallbackTransform(adf, schema);

		expect(result.hasValidTransform).toBe(false);
		expect(result.transformedAdf).toEqual(adf);
	});

	it('transforms extension with native-embed key and URL into embedCard when at the document root', () => {
		const adf: ADFEntity = {
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'extension',
					attrs: {
						extensionType: 'com.atlassian.some-other-extension-type',
						extensionKey: 'native-embed:whiteboard',
						parameters: {
							macroParams: {
								url: { value: 'https://example.atlassian.net/wiki/spaces/DEMO/whiteboard/12345' },
							},
						},
					},
				},
			],
		};

		const result = nativeEmbedsFallbackTransform(adf, schema);
		const transformedAdf = result.transformedAdf as ADFEntity;

		expect(result.hasValidTransform).toBe(true);
		expect(transformedAdf.content?.[0]).toEqual({
			type: 'embedCard',
			attrs: {
				url: 'https://example.atlassian.net/wiki/spaces/DEMO/whiteboard/12345',
				layout: 'center',
			},
		});
	});

	describe('parent-context aware transformation', () => {
		const buildNativeEmbedExtension = () => ({
			type: 'extension',
			attrs: {
				extensionType: 'com.atlassian.some-other-extension-type',
				extensionKey: 'native-embed:whiteboard',
				parameters: {
					macroParams: {
						url: { value: 'https://example.atlassian.net/wiki/spaces/DEMO/whiteboard/12345' },
					},
				},
			},
		});

		const runTransformWithMockedValidator = (adf: ADFEntity) => {
			let result: ReturnType<typeof nativeEmbedsFallbackTransform> | undefined;
			jest.isolateModules(() => {
				jest.mock('../../../validator/validator', () => ({
					validator: () => () => ({ valid: true }),
				}));
				const {
					nativeEmbedsFallbackTransform: isolatedTransform,
				} = require('../../../transforms/native-embeds-fallback-transform');
				result = isolatedTransform(adf, schema);
			});
			return result!;
		};

		it('returns empty allowed-parents set and always falls back when schema has no embedCard', () => {
			const adf: ADFEntity = {
				type: 'doc',
				version: 1,
				content: [buildNativeEmbedExtension()],
			};

			// Build a minimal fake schema with no `embedCard` node
			const fakeSchema = { nodes: {} } as unknown as typeof schema;
			let result: ReturnType<typeof nativeEmbedsFallbackTransform> | undefined;
			jest.isolateModules(() => {
				jest.mock('../../../validator/validator', () => ({
					validator: () => () => ({ valid: true }),
				}));
				const {
					nativeEmbedsFallbackTransform: isolatedTransform,
				} = require('../../../transforms/native-embeds-fallback-transform');
				result = isolatedTransform(adf, fakeSchema);
			});

			const transformedAdf = result!.transformedAdf as ADFEntity;
			expect(result!.hasValidTransform).toBe(true);
			expect(transformedAdf.content?.[0]).toMatchObject({
				type: 'paragraph',
				content: [{ type: 'inlineCard' }],
			});
		});

		it.each([
			['blockquote'],
			['panel'],
			['listItem'],
			['taskItem'],
			['decisionItem'],
			['nestedExpand'],
			['paragraph'],
			['heading'],
			['caption'],
			['mediaSingle'],
			['extensionFrame'],
		])(
			'falls back to paragraph with inlineCard when nested inside %s (embedCard not allowed)',
			(parentType) => {
				const adf: ADFEntity = {
					type: 'doc',
					version: 1,
					content: [
						{
							type: parentType,
							content: [buildNativeEmbedExtension()],
						},
					],
				};

				const result = runTransformWithMockedValidator(adf);
				const transformedAdf = result.transformedAdf as ADFEntity;

				expect(result.hasValidTransform).toBe(true);
				expect(transformedAdf.content?.[0]).toMatchObject({
					type: parentType,
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'inlineCard',
									attrs: {
										url: 'https://example.atlassian.net/wiki/spaces/DEMO/whiteboard/12345',
									},
								},
							],
						},
					],
				});
			},
		);

		it.each([
			['layoutColumn'],
			['tableCell'],
			['tableHeader'],
			['expand'],
			['bodiedSyncBlock'],
			['bodiedExtension'],
		])('transforms to embedCard when nested inside %s (embedCard allowed)', (parentType) => {
			const adf: ADFEntity = {
				type: 'doc',
				version: 1,
				content: [
					{
						type: parentType,
						content: [buildNativeEmbedExtension()],
					},
				],
			};

			const result = runTransformWithMockedValidator(adf);
			const transformedAdf = result.transformedAdf as ADFEntity;

			expect(result.hasValidTransform).toBe(true);
			expect(transformedAdf.content?.[0]).toMatchObject({
				type: parentType,
				content: [
					{
						type: 'embedCard',
						attrs: {
							url: 'https://example.atlassian.net/wiki/spaces/DEMO/whiteboard/12345',
							layout: 'center',
						},
					},
				],
			});
		});
	});

	it('drops native-embed extension when URL is missing', () => {
		const adf: ADFEntity = {
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'extension',
					attrs: {
						extensionType: 'com.atlassian.some-other-extension-type',
						extensionKey: 'native-embed:database',
						parameters: {},
					},
				},
			],
		};

		const result = nativeEmbedsFallbackTransform(adf, schema);
		const transformedAdf = result.transformedAdf as ADFEntity;

		expect(result.hasValidTransform).toBe(true);
		expect(transformedAdf.content).toEqual([]);
	});

	it('returns original ADF when transformed output fails ADF schema validation', () => {
		const originalAdf: ADFEntity = {
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'extension',
					attrs: {
						extensionType: 'com.atlassian.some-other-extension-type',
						extensionKey: 'native-embed:whiteboard',
						parameters: { macroParams: { url: { value: 'https://example.com' } } },
					},
				},
			],
		};

		jest.isolateModules(() => {
			const mockValidate = jest.fn().mockReturnValue({ valid: false });
			jest.mock('../../../validator/validator', () => ({
				validator: () => mockValidate,
			}));

			const {
				nativeEmbedsFallbackTransform: isolatedTransform,
			} = require('../../../transforms/native-embeds-fallback-transform');

			const result = isolatedTransform(originalAdf, schema);

			// Because the transformed ADF is invalid, it should fall back to the original
			expect(result.hasValidTransform).toBe(false);
			expect(result.transformedAdf).toEqual(originalAdf);
		});
	});

	it('returns transformed ADF when it passes ADF schema validation', () => {
		const adf: ADFEntity = {
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'extension',
					attrs: {
						extensionType: 'com.atlassian.some-other-extension-type',
						extensionKey: 'native-embed:whiteboard',
						parameters: {
							macroParams: {
								url: { value: 'https://example.atlassian.net/wiki/spaces/DEMO/whiteboard/12345' },
							},
						},
					},
				},
			],
		};

		const result = nativeEmbedsFallbackTransform(adf, schema);
		const transformedAdf = result.transformedAdf as ADFEntity;

		// The transform should succeed and the result should pass validation
		expect(result.hasValidTransform).toBe(true);
		expect(transformedAdf.content?.[0]).toEqual({
			type: 'embedCard',
			attrs: {
				url: 'https://example.atlassian.net/wiki/spaces/DEMO/whiteboard/12345',
				layout: 'center',
			},
		});
	});
});
