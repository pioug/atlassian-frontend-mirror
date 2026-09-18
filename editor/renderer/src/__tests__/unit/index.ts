import assert from 'assert';

import sinon from 'sinon';

import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import {
	nativeEmbedsFallbackTransform,
	NodeNestingTransformError,
	transformNestedTablesIncomingDocument,
} from '@atlaskit/adf-utils/transforms';
import { fg } from '@atlaskit/platform-feature-flags/fg';
/**
 * TS 3.9+ defines non-configurable property for exports, that's why it's not possible to mock them like this anymore:
 *
 * ```
 * import * as tableUtils from '../../../../../plugins/table/utils';
 * jest.spyOn(tableUtils, 'getColumnsWidths')
 * ```
 *
 * This is a workaround: https://github.com/microsoft/TypeScript/issues/38568#issuecomment-628637477
 */
jest.mock('@atlaskit/editor-common/validator', () => ({
	__esModule: true,
	...jest.requireActual<Object>('@atlaskit/editor-common/validator'),
}));

jest.mock('@atlaskit/editor-common/utils', () => ({
	__esModule: true,
	...jest.requireActual<Object>('@atlaskit/editor-common/utils'),
}));

jest.mock('@atlaskit/adf-utils/transforms', () => ({
	__esModule: true,
	...jest.requireActual<Object>('@atlaskit/adf-utils/transforms'),
	nativeEmbedsFallbackTransform: jest.fn((adf) => ({
		transformedAdf: adf,
		hasValidTransform: false,
	})),
	transformNestedTablesIncomingDocument: jest.fn((adf) => ({
		transformedAdf: adf,
		isTransformed: true,
	})),
}));

jest.mock('@atlaskit/platform-feature-flags/fg', () => ({
	...jest.requireActual('@atlaskit/platform-feature-flags/fg'),
	__esModule: true,
	fg: jest.fn(() => false),
}));

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(() => false),
}));

import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import * as commonUtils from '@atlaskit/editor-common/utils';
import * as common from '@atlaskit/editor-common/validator';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { PLATFORM } from '../../analytics/events';
import { renderDocument } from '../../render-document';
import type { Serializer } from '../../serializer';
import doc from '../__fixtures__/basic-document.adf.json';
import dateDoc from '../__fixtures__/date.adf.json';
import headingsDoc from '../__fixtures__/headings-adf.json';

class MockSerializer implements Serializer<string> {
	serializeFragment(_fragment: any) {
		return 'dummy';
	}
}

describe('Renderer', () => {
	describe('renderDocument', () => {
		const serializer = new MockSerializer();
		let getValidDocumentSpy: sinon.SinonSpy;

		beforeEach(() => {
			getValidDocumentSpy = sinon.spy(common, 'getValidDocument');
		});

		afterEach(() => {
			getValidDocumentSpy.restore();
		});

		it('should call getValidDocument', () => {
			renderDocument(doc, serializer, schema);
			expect(getValidDocumentSpy.calledWith(doc)).toEqual(true);
		});

		it('should only call schema.nodeFromJSON when needed', () => {
			// Different doc to all the other tests to avoid memoize
			const spy = sinon.spy(schema, 'nodeFromJSON');

			renderDocument(headingsDoc, serializer, schema);
			expect(spy.called).toEqual(true);
			const { callCount } = spy;

			// Call again to ensure memoize worked on objA===objB
			renderDocument(headingsDoc, serializer, schema);
			expect(spy.callCount).toEqual(callCount);

			// Call again to ensure memoize worked on equal doc content
			renderDocument({ ...headingsDoc }, serializer, schema);
			expect(spy.callCount).toEqual(callCount);

			// Call again to ensure memoize worked on different doc
			renderDocument(doc, serializer, schema);
			expect(spy.callCount).toEqual(callCount + 4);
		});

		it('should only call serializer.serializeFragment when needed', () => {
			// Different doc to all the other tests to avoid memoize
			const spy = sinon.spy(serializer, 'serializeFragment');
			renderDocument(dateDoc, serializer, schema);
			expect(spy.called).toEqual(true);
			expect(spy.callCount).toEqual(1);

			// Call again to ensure memoize worked
			renderDocument(dateDoc, serializer, schema);
			expect(spy.callCount).toEqual(1);
		});

		it('should return result and stat fields', () => {
			const res = renderDocument(doc, serializer, schema);

			assert(res.result, 'Output is missing');
			assert(res.stat, 'Stat is missing');
			expect(res.result).toBe('dummy');
		});

		it('should return null if document is invalid', () => {
			const unexpectedContent = [
				true,
				false,
				new Date(),
				'',
				1,
				[],
				{},
				{
					content: [{}],
				},
			];

			unexpectedContent.forEach((content) => {
				expect(renderDocument(content, serializer).result).toEqual(null);
			});
		});

		it('should not call getValidDocument when useSpecBasedValidator is TRUE', () => {
			renderDocument(doc, serializer, schema, 'final', true);
			expect(getValidDocumentSpy.called).toEqual(false);
		});

		it('should return stat when useSpecBasedValidator is TRUE', () => {
			const result = renderDocument(doc, serializer, schema, 'final', true);
			expect(getValidDocumentSpy.called).toEqual(false);
			expect(result.stat.sanitizeTime).toBeGreaterThan(0);
			expect(result.stat.buildTreeTime).toBeDefined();
			expect(result.stat.buildTreeTime).toBeGreaterThan(0);
			expect(result.stat.serializeTime).toBeDefined();
			expect(result.stat.serializeTime).toBeGreaterThan(0);
		});

		it.each(['final', 'stage0'] as const)(
			'should tell validateADFEntity the document is %s when useSpecBasedValidator is TRUE',
			(adfStage) => {
				const validateADFEntitySpy = sinon.spy(commonUtils, 'validateADFEntity');
				// A document unique to this case, otherwise `memoValidation`, which compares documents by
				// content rather than by identity, returns a memoized result and never reaches the validator.
				const docForStage = {
					version: 1,
					type: 'doc',
					content: [
						{ type: 'paragraph', content: [{ type: 'text', text: `adfStage ${adfStage}` }] },
					],
				};
				try {
					renderDocument(docForStage, serializer, schema, adfStage, true);

					expect(validateADFEntitySpy.callCount).toEqual(1);
					expect(validateADFEntitySpy.lastCall.args[4]).toEqual(adfStage);
				} finally {
					validateADFEntitySpy.restore();
				}
			},
		);

		// A caller with no stage to declare must not be validated against full ADF, so the stage reaches
		// `validateADFEntity` as `undefined` rather than as this function's own default.
		it('should leave the stage undefined for validateADFEntity when the caller omits it', () => {
			const validateADFEntitySpy = sinon.spy(commonUtils, 'validateADFEntity');
			const docWithoutStage = {
				version: 1,
				type: 'doc',
				content: [{ type: 'paragraph', content: [{ type: 'text', text: 'no adfStage supplied' }] }],
			};
			try {
				renderDocument(docWithoutStage, serializer, schema, undefined, true);

				expect(validateADFEntitySpy.callCount).toEqual(1);
				expect(validateADFEntitySpy.lastCall.args[4]).toBeUndefined();
			} finally {
				validateADFEntitySpy.restore();
			}
		});

		// A `layoutSection` with one column is a stage-0-only construct. Rendering it without declaring
		// a stage keeps the column, rather than wrapping it as unsupported content.
		it('should keep a single-column layoutSection when the caller declares no stage', () => {
			const singleColumnLayout = {
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'layoutSection',
						content: [
							{
								type: 'layoutColumn',
								attrs: { width: 50 },
								content: [
									{ type: 'paragraph', content: [{ type: 'text', text: 'single column' }] },
								],
							},
						],
					},
				],
			};

			const result = renderDocument(singleColumnLayout, serializer, schema, undefined, true);

			expect(JSON.stringify(result.result)).not.toContain('unsupportedBlock');
		});

		it('should return stat when useSpecBasedValidator is false', () => {
			const result = renderDocument(doc, serializer, schema, 'final', false);
			expect(result.stat.sanitizeTime).toBeGreaterThan(0);
			expect(result.stat.buildTreeTime).toBeDefined();
			expect(result.stat.buildTreeTime).toBeGreaterThan(0);
			expect(result.stat.serializeTime).toBeDefined();
			expect(result.stat.serializeTime).toBeGreaterThan(0);
		});

		it(`should return prosemirror doc with empty paragraph when useSpecBasedValidator is true
         and supplied a doc without content`, () => {
			const initialDoc = {
				type: 'doc',
				content: [],
			};
			const expectedDoc = {
				type: 'doc',
				content: [
					{
						attrs: {
							localId: null,
						},
						type: 'paragraph',
					},
				],
			};
			const result = renderDocument(initialDoc, serializer, schema, 'final', true);
			expect(result.pmDoc).toBeDefined();
			expect(result.pmDoc!.toJSON()).toEqual(expectedDoc);
		});

		describe('when there is a textColor mark with a link', () => {
			const initialDoc = {
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'text',
								text: 'lol',
								marks: [
									{
										type: 'link',
										attrs: {
											href: 'http://gnu.org',
										},
									},

									{
										type: 'textColor',
										attrs: {
											color: '#ff991f',
										},
									},
								],
							},
						],
					},
				],
			};

			it('should not throw an ProseMirror error validation', () => {
				expect(() => {
					renderDocument(initialDoc, serializer, schema, 'final', true);
				}).not.toThrow();
			});
		});

		describe('when there is an invalid ProseMirror document', () => {
			const getInvalidDoc = (text: string) => {
				return {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text,
									marks: [
										{
											type: 'link',
											attrs: {
												href: 'http://gnu.org',
											},
										},
										{
											type: 'link',
											attrs: {
												href: 'http://atlassian.com',
											},
										},
									],
								},
							],
						},
					],
				};
			};

			it('should not throw an error', () => {
				expect(() => {
					renderDocument(getInvalidDoc('no throw'), serializer, schema, 'final', true);
				}).not.toThrow();
			});

			it('should call the dispatchAnalyticsEvent', () => {
				const dispatchAnalyticsEvent = jest.fn();
				try {
					renderDocument(
						getInvalidDoc('call dispatch'),
						serializer,
						schema,
						'final',
						true,
						undefined,
						dispatchAnalyticsEvent,
					);
				} catch {}

				expect(dispatchAnalyticsEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: ACTION.INVALID_PROSEMIRROR_DOCUMENT,
						actionSubject: ACTION_SUBJECT.RENDERER,
						eventType: EVENT_TYPE.OPERATIONAL,
						attributes: {
							platform: PLATFORM.WEB,
							errorStack: 'Invalid collection of marks for node text: link,link',
						},
					}),
				);
			});
		});

		describe('nested tables', () => {
			const mockDispatchAnalyticsEvent = jest.fn();

			beforeEach(() => {
				jest.clearAllMocks();
			});

			it('should transform nested tables', () => {
				const document = {
					type: 'doc',
					version: 1,
					content: [
						{
							attrs: {
								localId: null,
							},
							type: 'paragraph',
							content: [{ type: 'text', text: 'A' }],
						},
					],
				};

				renderDocument(
					document,
					serializer,
					schema,
					undefined,
					true,
					undefined,
					mockDispatchAnalyticsEvent,
				);

				expect(transformNestedTablesIncomingDocument).toHaveBeenCalledWith(document);
				expect(mockDispatchAnalyticsEvent).toHaveBeenCalledWith({
					action: 'nestedTableTransformed',
					actionSubject: 'renderer',
					eventType: 'operational',
				});
			});

			it('should fire analytics event when failing to transform nested tables', () => {
				// Prevent console.error from showing in the test output
				jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());

				(
					transformNestedTablesIncomingDocument as jest.MockedFunction<
						typeof transformNestedTablesIncomingDocument
					>
				).mockImplementationOnce(() => {
					throw new NodeNestingTransformError('Error transforming nested tables');
				});

				const document = {
					type: 'doc',
					version: 1,
					content: [
						{
							attrs: {
								localId: null,
							},
							type: 'paragraph',
							content: [{ type: 'text', text: 'C' }],
						},
					],
				};

				renderDocument(
					document,
					serializer,
					schema,
					undefined,
					true,
					undefined,
					mockDispatchAnalyticsEvent,
				);
				expect(transformNestedTablesIncomingDocument).toHaveBeenCalledWith(document);
				expect(mockDispatchAnalyticsEvent).toHaveBeenCalledWith({
					action: 'invalidProsemirrorDocument',
					actionSubject: 'renderer',
					eventType: 'operational',
					attributes: {
						platform: 'web',
						errorStack: expect.any(String),
					},
				});
			});

			it('should call transformNestedTablesIncomingDocument without options', () => {
				const document = {
					type: 'doc',
					version: 1,
					content: [
						{
							attrs: {
								localId: null,
							},
							type: 'paragraph',
							content: [{ type: 'text', text: 'A' }],
						},
					],
				};

				renderDocument(
					document,
					serializer,
					schema,
					undefined,
					true,
					undefined,
					mockDispatchAnalyticsEvent,
				);

				expect(transformNestedTablesIncomingDocument).toHaveBeenCalledWith(document);
			});
		});

		describe('native embeds fallback feature gate', () => {
			const gateOffDocument = {
				type: 'doc',
				version: 1,
				content: [
					{
						attrs: {
							localId: null,
						},
						type: 'paragraph',
						content: [{ type: 'text', text: 'native embeds gate test' }],
					},
				],
			};

			const nativeEmbedsEnabledDocument = {
				type: 'doc',
				version: 1,
				content: [
					{
						attrs: {
							localId: null,
						},
						type: 'paragraph',
						content: [{ type: 'text', text: 'native embeds enabled test' }],
					},
				],
			};

			const gateOnDocument = {
				type: 'doc',
				version: 1,
				content: [
					{
						attrs: {
							localId: null,
						},
						type: 'paragraph',
						content: [{ type: 'text', text: 'native embeds gate test on' }],
					},
				],
			};

			const mockDispatchAnalyticsEvent = jest.fn();

			beforeEach(() => {
				jest.clearAllMocks();
				(fg as jest.Mock).mockImplementation(() => false);
				(expValEquals as jest.Mock).mockImplementation(() => false);
				(
					nativeEmbedsFallbackTransform as jest.MockedFunction<typeof nativeEmbedsFallbackTransform>
				).mockImplementation((adf) => ({
					transformedAdf: adf,
					hasValidTransform: false,
				}));
			});

			it('should not run nativeEmbedsFallbackTransform when gate is off', () => {
				renderDocument(
					gateOffDocument,
					serializer,
					schema,
					undefined,
					true,
					undefined,
					mockDispatchAnalyticsEvent,
				);

				expect(nativeEmbedsFallbackTransform).not.toHaveBeenCalled();
			});

			it('should not run nativeEmbedsFallbackTransform when native embeds are enabled via cc-maui-experiment', () => {
				(fg as jest.Mock).mockImplementation(
					(flagName: string) => flagName === 'platform_editor_native_embeds_fallback_transform',
				);
				(expValEquals as jest.Mock).mockImplementation(
					(experimentName: string, param: string, expectedValue: boolean) =>
						experimentName === 'cc-maui-experiment' &&
						param === 'isEnabled' &&
						expectedValue === true,
				);

				renderDocument(
					nativeEmbedsEnabledDocument,
					serializer,
					schema,
					undefined,
					true,
					undefined,
					mockDispatchAnalyticsEvent,
				);

				expect(nativeEmbedsFallbackTransform).not.toHaveBeenCalled();
			});

			it('should not run nativeEmbedsFallbackTransform when native embeds are enabled via platform_native_embeds_rollout_non_maui_experience', () => {
				(fg as jest.Mock).mockImplementation(
					(flagName: string) =>
						flagName === 'platform_editor_native_embeds_fallback_transform' ||
						flagName === 'platform_native_embeds_rollout_non_maui_experience',
				);
				(expValEquals as jest.Mock).mockImplementation(() => false);

				renderDocument(
					nativeEmbedsEnabledDocument,
					serializer,
					schema,
					undefined,
					true,
					undefined,
					mockDispatchAnalyticsEvent,
				);

				expect(nativeEmbedsFallbackTransform).not.toHaveBeenCalled();
			});

			it('should run nativeEmbedsFallbackTransform and fire analytics when gate is on and native embeds are not enabled', () => {
				(fg as jest.Mock).mockImplementation(
					(flagName: string) => flagName === 'platform_editor_native_embeds_fallback_transform',
				);
				(expValEquals as jest.Mock).mockImplementation(() => false);
				(
					nativeEmbedsFallbackTransform as jest.MockedFunction<typeof nativeEmbedsFallbackTransform>
				).mockImplementation((adf) => ({
					transformedAdf: adf,
					hasValidTransform: true,
				}));

				renderDocument(
					gateOnDocument,
					serializer,
					schema,
					undefined,
					true,
					undefined,
					mockDispatchAnalyticsEvent,
				);

				expect(nativeEmbedsFallbackTransform).toHaveBeenCalledWith(gateOnDocument, schema);
				expect(mockDispatchAnalyticsEvent).toHaveBeenCalledWith({
					action: ACTION.NATIVE_EMBEDS_TRANSFORMED,
					actionSubject: ACTION_SUBJECT.RENDERER,
					eventType: EVENT_TYPE.OPERATIONAL,
				});
			});
		});
	});
});
