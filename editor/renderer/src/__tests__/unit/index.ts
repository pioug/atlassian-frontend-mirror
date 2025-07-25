import assert from 'assert';
import sinon from 'sinon';
import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import {
	NodeNestingTransformError,
	transformNestedTablesIncomingDocument,
} from '@atlaskit/adf-utils/transforms';
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

jest.mock('@atlaskit/adf-utils/transforms', () => ({
	__esModule: true,
	...jest.requireActual<Object>('@atlaskit/adf-utils/transforms'),
	transformNestedTablesIncomingDocument: jest.fn((adf) => ({
		transformedAdf: adf,
		isTransformed: true,
	})),
}));

import * as common from '@atlaskit/editor-common/validator';
import { type Serializer } from '../../serializer';
import { renderDocument } from '../../render-document';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';

import { PLATFORM } from '../../analytics/events';
import doc from '../__fixtures__/basic-document.adf.json';
import dateDoc from '../__fixtures__/date.adf.json';
import headingsDoc from '../__fixtures__/headings-adf.json';
import { ffTest } from '@atlassian/feature-flags-test-utils';

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
				} catch (e) {}

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

				expect(transformNestedTablesIncomingDocument).toHaveBeenCalledWith(document, {
					environment: 'renderer',
					disableNestedRendererTreatment: false,
				});
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
				expect(transformNestedTablesIncomingDocument).toHaveBeenCalledWith(document, {
					environment: 'renderer',
					disableNestedRendererTreatment: false,
				});
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

			ffTest.on(
				'platform_editor_nested_table_extension_comment_fix',
				'bodied extension comment fix enabled',
				() => {
					it('should pass disableNestedRendererTreatment as true', () => {
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

						expect(transformNestedTablesIncomingDocument).toHaveBeenCalledWith(document, {
							environment: 'renderer',
							disableNestedRendererTreatment: true,
						});
					});
				},
			);
		});
	});
});
