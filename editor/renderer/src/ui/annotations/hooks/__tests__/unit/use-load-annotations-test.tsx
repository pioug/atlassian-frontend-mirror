import { render, waitFor } from '@atlassian/testing-library';
import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema/annotation';
import type { AnnotationProviders, AnnotationState } from '@atlaskit/editor-common/types';
import { AnnotationUpdateEmitter, AnnotationUpdateEvent } from '@atlaskit/editor-common/types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer/types';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import React from 'react';
import RendererActions from '../../../../../actions/index';
import { RendererContext } from '../../../../RendererActionsContext';
import { ProvidersContext } from '../../../context';
import { useLoadAnnotations } from '../../use-load-annotations';
import type { LoadCompleteHandler } from '../../use-load-annotations';

function createFakeMark(id: string): Mark {
	// @ts-ignore
	const fakeMark: Mark = {
		attrs: {
			id,
		},
	};

	return fakeMark;
}

type CustomCompProps = {
	adfDocument?: JSONDocNode;
	isNestedRender?: boolean;
	onLoadComplete?: LoadCompleteHandler;
};

function createFakeAnnotationState(id: string): AnnotationState<AnnotationTypes.INLINE_COMMENT> {
	return {
		id,
		annotationType: AnnotationTypes.INLINE_COMMENT,
		state: AnnotationMarkStates.ACTIVE,
	};
}

describe('Annotations: Hooks/useLoadAnnotations', () => {
	const defaultAdfDocument: JSONDocNode = {
		version: 1,
		type: 'doc',
		content: [],
	};

	const adfDocumentForExcerptMacro: JSONDocNode = {
		type: 'doc',
		content: [
			{
				type: 'bodiedExtension',
				attrs: {
					layout: 'default',
					extensionType: 'com.atlassian.confluence.macro.core',
					extensionKey: 'excerpt',
					parameters: {},
				},
				content: [
					{
						type: 'paragraph',
						content: [
							{
								text: 'excerpt',
								type: 'text',
							},
						],
					},
				],
			},
		],
		version: 1,
	};

	describe('#useLoadAnnotations', () => {
		const CustomComp = ({
			adfDocument = defaultAdfDocument,
			isNestedRender = false,
			onLoadComplete = () => {},
		}: CustomCompProps) => {
			useLoadAnnotations({ adfDocument, isNestedRender, onLoadComplete });
			return <div data-testid="annotation-hook-probe">Annotation hook probe</div>;
		};

		const fakeMarksIds = ['lol1', 'lol2', 'lol3'];
		const fakeMarks: Mark[] = fakeMarksIds.map(createFakeMark);
		const fakeDataReturn = fakeMarksIds.map(createFakeAnnotationState);

		let getStateFake: jest.Mock;
		let actionsFake: RendererActions;
		let providers: AnnotationProviders;
		let updateSubscriberFake: AnnotationUpdateEmitter;
		beforeEach(() => {
			getStateFake = jest.fn().mockReturnValue(Promise.resolve(fakeDataReturn));
			jest.spyOn(RendererActions.prototype, 'getAnnotationMarks').mockReturnValue(fakeMarks);
			jest.spyOn(AnnotationUpdateEmitter.prototype, 'emit');

			actionsFake = new RendererActions();
			updateSubscriberFake = new AnnotationUpdateEmitter();
			providers = {
				inlineComment: {
					getState: getStateFake,
					updateSubscriber: updateSubscriberFake,
				},
			};
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		describe('when the document changes', () => {
			it('should call getState again', () => {
				const CustomComp = ({ adfDocument = defaultAdfDocument }: CustomCompProps) => {
					useLoadAnnotations({
						adfDocument,
						isNestedRender: false,
					});
					return null;
				};

				expect(providers.inlineComment.getState).toHaveBeenCalledTimes(0);
				const { rerender } = render(
					<RendererContext.Provider value={actionsFake}>
						<ProvidersContext.Provider value={providers}>
							<CustomComp adfDocument={defaultAdfDocument} />
						</ProvidersContext.Provider>
					</RendererContext.Provider>,
				);
				expect(providers.inlineComment.getState).toHaveBeenCalledTimes(1);

				const sameDocument = defaultAdfDocument;

				rerender(
					<RendererContext.Provider value={actionsFake}>
						<ProvidersContext.Provider value={providers}>
							<CustomComp adfDocument={sameDocument} />
						</ProvidersContext.Provider>
					</RendererContext.Provider>,
				);
				expect(providers.inlineComment.getState).toHaveBeenCalledTimes(1);

				const newAdfDocument: JSONDocNode = {
					version: 1,
					type: 'doc',
					content: [],
				};

				rerender(
					<RendererContext.Provider value={actionsFake}>
						<ProvidersContext.Provider value={providers}>
							<CustomComp adfDocument={newAdfDocument} />
						</ProvidersContext.Provider>
					</RendererContext.Provider>,
				);
				expect(providers.inlineComment.getState).toHaveBeenCalledTimes(2);
			});
		});

		it('should call getState from Inline Comment provider with Annotations from action', async () => {
			expect(providers.inlineComment.getState).toHaveBeenCalledTimes(0);

			const { container } = render(
				<RendererContext.Provider value={actionsFake}>
					<ProvidersContext.Provider value={providers}>
						<CustomComp />
					</ProvidersContext.Provider>
				</RendererContext.Provider>,
			);

			expect(providers.inlineComment.getState).toHaveBeenCalledWith(fakeMarksIds, false);
			await expect(container).toBeAccessible();
		});

		it('should call getState from Inline Comment provider with isNestedRender: true when the adf is a bodiedExtention macro', () => {
			expect(providers.inlineComment.getState).toHaveBeenCalledTimes(0);

			render(
				<RendererContext.Provider value={actionsFake}>
					<ProvidersContext.Provider value={providers}>
						<CustomComp adfDocument={adfDocumentForExcerptMacro} isNestedRender />
					</ProvidersContext.Provider>
				</RendererContext.Provider>,
			);

			expect(providers.inlineComment.getState).toHaveBeenCalledWith(fakeMarksIds, true);
		});

		it('should call getState when there are no annotations', () => {
			jest.spyOn(RendererActions.prototype, 'getAnnotationMarks').mockReturnValue([]);

			expect(providers.inlineComment.getState).toHaveBeenCalledTimes(0);

			render(
				<RendererContext.Provider value={actionsFake}>
					<ProvidersContext.Provider value={providers}>
						<CustomComp />
					</ProvidersContext.Provider>
				</RendererContext.Provider>,
			);

			expect(providers.inlineComment.getState).toHaveBeenCalledTimes(1);
		});

		describe('when the getState is resolved', () => {
			it('should emit SET_ANNOTATION_STATE event on updateSubscriber', (done) => {
				expect(updateSubscriberFake.emit).toHaveBeenCalledTimes(0);

				render(
					<RendererContext.Provider value={actionsFake}>
						<ProvidersContext.Provider value={providers}>
							<CustomComp />
						</ProvidersContext.Provider>
					</RendererContext.Provider>,
				);

				const expected = fakeDataReturn.reduce((acc, cur) => {
					return {
						...acc,
						[cur.id]: cur,
					};
				}, {});
				process.nextTick(() => {
					expect(updateSubscriberFake.emit).toHaveBeenCalledWith(
						AnnotationUpdateEvent.SET_ANNOTATION_STATE,
						expected,
					);
					done();
				});
			});
		});

		describe('callback function', () => {
			it('calls onLoadComplete with correct annotation count after annotations are loaded', async () => {
				const mockOnLoadComplete = jest.fn();

				render(
					<RendererContext.Provider value={actionsFake}>
						<ProvidersContext.Provider value={providers}>
							<CustomComp onLoadComplete={mockOnLoadComplete} />
						</ProvidersContext.Provider>
					</RendererContext.Provider>,
				);

				await waitFor(() => {
					expect(mockOnLoadComplete).toHaveBeenCalledWith({
						numberOfUnresolvedInlineComments: 3,
					});
				});
			});

			it('calls onLoadComplete with zero when there are no annotations', async () => {
				const fakeMarksIds: string[] = []; // Empty array for zero marks
				const fakeDataReturn = fakeMarksIds.map(createFakeAnnotationState);
				getStateFake.mockReturnValue(Promise.resolve(fakeDataReturn));

				const mockOnLoadComplete = jest.fn();

				render(
					<RendererContext.Provider value={actionsFake}>
						<ProvidersContext.Provider value={providers}>
							<CustomComp onLoadComplete={mockOnLoadComplete} />
						</ProvidersContext.Provider>
					</RendererContext.Provider>,
				);

				await waitFor(() => {
					expect(mockOnLoadComplete).toHaveBeenCalledWith({
						numberOfUnresolvedInlineComments: 0,
					});
				});
			});
		});
	});
});
