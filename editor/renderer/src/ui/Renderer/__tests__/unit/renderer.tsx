import React from 'react';

import { act, render } from '@testing-library/react';
import createStub from 'raf-stub';
import { IntlProvider } from 'react-intl';

import type { AnnotationId } from '@atlaskit/adf-schema/annotation';
import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema/annotation';
import type { DocNode } from '@atlaskit/adf-schema/doc';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { stopMeasure } from '@atlaskit/editor-common/performance-measures';
import type { AnnotationProviders, AnnotationState } from '@atlaskit/editor-common/types';
import { AnnotationUpdateEmitter } from '@atlaskit/editor-common/types';
import {
	SEVERITY,
	UNSUPPORTED_CONTENT_LEVEL_SEVERITY_THRESHOLD_DEFAULTS,
} from '@atlaskit/editor-common/utils';

import RendererDefaultComponent, {
	DEGRADED_SEVERITY_THRESHOLD,
	NORMAL_SEVERITY_THRESHOLD,
	RendererFunctionalComponent as Renderer,
} from '../../';
import { RendererContextProvider } from '../../../../renderer-context';
import type { RendererAppearance } from '../../types';
import { ValidationContextProvider } from '../../ValidationContext';
import { adfNestedTableData } from '../__fixtures__/mockData';
const mockCreateAnalyticsEvent = jest.fn(() => ({ fire() {} }));

jest.mock('@atlaskit/editor-common/ui', () => {
	const WithCreateAnalyticsEventMock = (props: any) => props.render(mockCreateAnalyticsEvent);
	return {
		...jest.requireActual<object>('@atlaskit/editor-common/ui'),
		WithCreateAnalyticsEvent: WithCreateAnalyticsEventMock,
	};
});

jest.mock('@atlaskit/editor-common/performance-measures', () => {
	return {
		...jest.requireActual<object>('@atlaskit/editor-common/performance-measures'),
		stopMeasure: jest.fn(),
	};
});

const mockAnnotationsContextWrapper = jest.fn();
jest.mock('../../../annotations/wrapper', () => {
	const actual = jest.requireActual('../../../annotations/wrapper');
	const react = jest.requireActual('react');
	return {
		AnnotationsContextWrapper: (props: Record<string, unknown>) => {
			mockAnnotationsContextWrapper();
			return react.createElement(actual.AnnotationsContextWrapper, props);
		},
	};
});

jest.mock('@atlaskit/platform-feature-flags/fg', () => ({
	...jest.requireActual('@atlaskit/platform-feature-flags/fg'),
	fg: jest.fn(),
}));

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer', () => {
	const annotationsId: string[] = ['id_1', 'id_2', 'id_3'];

	const adf: DocNode = {
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						text: 'rodrigo',
						marks: [
							{
								type: 'annotation' as const,
								attrs: {
									id: annotationsId[0],
									annotationType: AnnotationTypes.INLINE_COMMENT,
								},
							},
						],
					},
					{
						type: 'text',
						text: ' banana ',
					},
				],
			},
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						text: 'melao ',
					},
					{
						type: 'text',
						text: 'bola',
						marks: [
							{
								type: 'annotation' as const,
								attrs: {
									id: annotationsId[1],
									annotationType: AnnotationTypes.INLINE_COMMENT,
								},
							},
							{
								type: 'annotation' as const,
								attrs: {
									id: annotationsId[2],
									annotationType: AnnotationTypes.INLINE_COMMENT,
								},
							},
						],
					},
				],
			},
		],
	};

	let getStateCallbackMock: jest.Mock;
	let annotationProvider: AnnotationProviders;
	beforeEach(() => {
		mockCreateAnalyticsEvent.mockClear();
		mockAnnotationsContextWrapper.mockClear();
		getStateCallbackMock = jest.fn();
		annotationProvider = {
			[AnnotationTypes.INLINE_COMMENT]: {
				getState: async (
					ids: AnnotationId[],
				): Promise<AnnotationState<AnnotationTypes.INLINE_COMMENT>[]> => {
					getStateCallbackMock(ids);
					return ids.map((id) => ({
						id,
						annotationType: AnnotationTypes.INLINE_COMMENT,
						state: AnnotationMarkStates.ACTIVE,
					}));
				},

				selectionComponent: jest.fn(),
				updateSubscriber: new AnnotationUpdateEmitter(),
			},
		};
	});

	describe('RendererWrapper', () => {
		it('should have a class describing the appearance', () => {
			const { container } = render(<Renderer document={adf} appearance="full-page" />);

			expect(container.querySelectorAll('div.ak-renderer-wrapper.is-full-page')).toHaveLength(1);
		});
	});

	describe('annotationProvider', () => {
		it('should call the provider with ids inside of the document', () => {
			render(
				<IntlProvider locale="en">
					<RendererDefaultComponent
						annotationProvider={annotationProvider}
						document={adf}
						allowAnnotations
					/>
				</IntlProvider>,
			);

			expect(getStateCallbackMock).toHaveBeenCalledWith(annotationsId);
		});
	});

	describe('when the allowAnnotations is enabled', () => {
		it('should render the AnnotationsContextWrapper', () => {
			render(
				<RendererDefaultComponent
					annotationProvider={annotationProvider}
					document={adf}
					allowAnnotations={true}
				/>,
			);

			expect(mockAnnotationsContextWrapper).toHaveBeenCalled();
		});
	});

	describe('when the allowAnnotations is disabled', () => {
		it('should not render the AnnotationsContextWrapper', () => {
			act(() => {
				render(
					<RendererDefaultComponent
						annotationProvider={annotationProvider}
						document={adf}
						allowAnnotations={false}
					/>,
				);
			});

			expect(mockAnnotationsContextWrapper).not.toHaveBeenCalled();
		});
	});

	describe('Serializer', () => {
		const mockCustomSerializerText = 'Custom Serializer';
		const mockCustomSerializeFragment = jest.fn(() => <div>{mockCustomSerializerText}</div>);
		const customCreateSerializer = () => ({
			serializeFragment: mockCustomSerializeFragment,
		});

		const expectSerializer = ({
			custom,
			container,
		}: {
			container: HTMLElement;
			custom: boolean;
		}) => {
			const wrapperDivs = container.querySelectorAll('div');
			expect(wrapperDivs).toHaveLength(4);

			if (custom) {
				expect(mockCustomSerializeFragment).toHaveBeenCalled();
				expect(wrapperDivs[0].textContent).toEqual(mockCustomSerializerText);
			} else {
				expect(mockCustomSerializeFragment).not.toHaveBeenCalled();
				expect(wrapperDivs[0].textContent).not.toEqual(mockCustomSerializerText);
			}
		};

		afterEach(() => {
			mockCustomSerializeFragment.mockClear();
		});

		it('should use default Serializer when createSerializer is not defined', () => {
			const { container } = render(
				<IntlProvider locale="en">
					<RendererDefaultComponent document={adf} />
				</IntlProvider>,
			);

			expectSerializer({ container, custom: false });
		});

		it('should use custom Serializer when createSerializer is defined', () => {
			const { container } = render(
				<IntlProvider locale="en">
					<RendererDefaultComponent document={adf} createSerializer={customCreateSerializer} />
				</IntlProvider>,
			);

			expectSerializer({ container, custom: true });
		});
	});
});

describe('spec based validator', () => {
	it('should render unsupported content block when the document has invalid block', () => {
		// @ts-ignore
		const docWithInvalidBlock = {
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'paragraph1232',
					content: [
						{
							type: 'text',
							text: 'hello',
						},
					],
				},
			],
		} as DocNode;
		let container!: HTMLElement;
		act(() => {
			({ container } = render(
				<IntlProvider locale="en">
					<Renderer document={docWithInvalidBlock} useSpecBasedValidator={true} />
				</IntlProvider>,
			));
		});

		expect(container.querySelectorAll('.unsupported').length).not.toEqual(0);
	});

	it('should NOT render unsupported content block when the document is valid', () => {
		const docWithValidParagraph: DocNode = {
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'hello',
						},
					],
				},
			],
		};

		let container!: HTMLElement;
		act(() => {
			({ container } = render(
				<IntlProvider locale="en">
					<Renderer document={docWithValidParagraph} useSpecBasedValidator={true} />
				</IntlProvider>,
			));
		});

		expect(container.querySelectorAll('.unsupported')).toHaveLength(0);
		expect(container.querySelectorAll('p').length).not.toEqual(0);
	});

	it('should render unsupported inline when the document has invalid inline', () => {
		// @ts-ignore
		const docWithInvalidInline = {
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'unknown type',
							attrs: {
								text: 'fallback text',
							},
						},
					],
				},
			],
		} as DocNode;

		let container!: HTMLElement;
		act(() => {
			({ container } = render(
				<IntlProvider locale="en">
					<Renderer document={docWithInvalidInline} useSpecBasedValidator={true} />
				</IntlProvider>,
			));
		});

		expect(container.querySelectorAll('[class*="-UnsupportedInlineNode"]').length).not.toEqual(0);
	});

	it('should NOT render unsupported inline when the document has valid inline', () => {
		const docWithValidInline: DocNode = {
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'mention',
							attrs: {
								id: '1',
								text: '@Oscar Wallhult',
							},
						},
					],
				},
			],
		};

		let container!: HTMLElement;
		act(() => {
			({ container } = render(
				<IntlProvider locale="en">
					<Renderer document={docWithValidInline} useSpecBasedValidator={true} />
				</IntlProvider>,
			));
		});

		expect(container.querySelectorAll('[class*="-UnsupportedInlineNode"]')).toHaveLength(0);
		expect(container.querySelectorAll('p').length).not.toEqual(0);
	});
});

describe('unsupported content levels severity', () => {
	const createAnalyticsEvent: CreateUIAnalyticsEvent = jest.fn(
		() => ({ fire() {} }) as UIAnalyticsEvent,
	);

	let RendererIsolated: any;

	beforeEach(() => {
		jest.useFakeTimers();
		jest.resetModules();
		jest.isolateModules(() => {
			const { RendererFunctionalComponent } = require('../..');
			RendererIsolated = RendererFunctionalComponent;
		});
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.clearAllMocks();
	});

	const validParagraph = {
		type: 'paragraph',
		content: [
			{
				type: 'text',
				text: 'good paragraph',
			},
		],
	};
	const invalidParagraph = {
		type: 'badparagraph',
		content: [
			{
				type: 'text',
				text: 'bad paragraph',
			},
		],
	};
	let rerenderDoc: (() => void) | null = null;

	const renderDoc = (
		doc: any,
		unsupportedContentLevelsTracking: any,
		appearance?: RendererAppearance,
	) => {
		const element = (
			<IntlProvider locale="en">
				<RendererIsolated
					document={doc}
					useSpecBasedValidator
					unsupportedContentLevelsTracking={unsupportedContentLevelsTracking}
					createAnalyticsEvent={createAnalyticsEvent}
					appearance={appearance}
				/>
			</IntlProvider>
		);
		const { rerender } = render(element);
		rerenderDoc = () => rerender(element);
	};

	type TimesToRenderMap = { [appearance: string]: number };

	const renderDocs = (
		timesToRenderMap: TimesToRenderMap,
		validDoc: any,
		unsupportedContentLevels: any,
	) => {
		for (const [appearance, timesToRender] of Object.entries(timesToRenderMap)) {
			for (let i = 0; i < timesToRender; i++) {
				renderDoc(validDoc, unsupportedContentLevels, appearance as RendererAppearance);
			}
		}
	};

	describe('unsupportedContentLevelsTracking.enabled = false', () => {
		it('should NOT fire unsupportedContentLevelsTrackingSucceeded event with unsupportedContentLevelSeverity', () => {
			const validDoc = {
				type: 'doc',
				version: 1,
				content: [validParagraph],
			};
			const unsupportedContentLevelsTracking = {
				enabled: false,
			};
			renderDoc(validDoc, unsupportedContentLevelsTracking);
			jest.runAllTimers();
			expect(createAnalyticsEvent).not.toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'unsupportedContentLevelsTrackingSucceeded',
					actionSubject: 'renderer',
					eventType: 'operational',
				}),
			);
		});
	});

	describe('unsupportedContentLevelsTracking.enabled = true', () => {
		describe('with user-defined thresholds', () => {
			const unsupportedContentLevelsTracking = {
				enabled: true,
				thresholds: {
					degraded: 10,
					blocking: 50,
				},
			};

			it(`should fire unsupportedContentLevelsTrackingSucceeded event with unsupportedContentLevelSeverity "normal" when unsupported content is less then ${unsupportedContentLevelsTracking.thresholds.degraded}% of the document`, () => {
				const validDoc = {
					type: 'doc',
					version: 1,
					content: [validParagraph],
				};
				renderDoc(validDoc, unsupportedContentLevelsTracking);
				jest.runAllTimers();
				expect(createAnalyticsEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'unsupportedContentLevelsTrackingSucceeded',
						actionSubject: 'renderer',
						attributes: expect.objectContaining({
							platform: 'web',
							unsupportedContentLevelSeverity: 'normal',
							unsupportedContentLevelPercentage: 0,
							unsupportedNodesCount: 0,
							supportedNodesCount: 3,
						}),
						eventType: 'operational',
					}),
				);
			});

			it(`should fire unsupportedContentLevelsTrackingSucceeded event with unsupportedContentLevelSeverity "degraded" when unsupported content is between ${unsupportedContentLevelsTracking.thresholds.degraded}% and ${unsupportedContentLevelsTracking.thresholds.blocking}% of the document`, () => {
				const partiallyInvalidDoc = {
					type: 'doc',
					version: 1,
					content: [validParagraph, validParagraph, validParagraph, invalidParagraph],
				};
				renderDoc(partiallyInvalidDoc, unsupportedContentLevelsTracking);
				jest.runAllTimers();
				expect(createAnalyticsEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'unsupportedContentLevelsTrackingSucceeded',
						actionSubject: 'renderer',
						attributes: expect.objectContaining({
							platform: 'web',
							unsupportedContentLevelSeverity: 'degraded',
							unsupportedContentLevelPercentage: 22,
							unsupportedNodesCount: 2,
							supportedNodesCount: 7,
						}),
						eventType: 'operational',
					}),
				);
			});

			it(`should fire unsupportedContentLevelsTrackingSucceeded event with unsupportedContentLevelSeverity "blocking" when unsupported content is equal to or more than ${unsupportedContentLevelsTracking.thresholds.blocking}% of the document`, () => {
				const mostlyInvalidDoc = {
					type: 'doc',
					version: 1,
					content: [validParagraph, invalidParagraph, invalidParagraph, invalidParagraph],
				};
				renderDoc(mostlyInvalidDoc, unsupportedContentLevelsTracking);
				jest.runAllTimers();
				expect(createAnalyticsEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'unsupportedContentLevelsTrackingSucceeded',
						actionSubject: 'renderer',
						attributes: expect.objectContaining({
							platform: 'web',
							unsupportedContentLevelSeverity: 'blocking',
							unsupportedContentLevelPercentage: 67,
							unsupportedNodesCount: 6,
							supportedNodesCount: 3,
						}),
						eventType: 'operational',
					}),
				);
			});

			it('should only fire unsupportedContentLevelsTrackingSucceeded event for initial render of renderer instance', () => {
				const expectUnsupportedContentTrackingCalledNTimes = (nTimes: number) => {
					expect(
						(createAnalyticsEvent as jest.Mock).mock.calls.filter(
							(callArgs) => callArgs[0].action === 'unsupportedContentLevelsTrackingSucceeded',
						).length,
					).toEqual(nTimes);
				};
				const validDoc = {
					type: 'doc',
					version: 1,
					content: [validParagraph],
				};
				expectUnsupportedContentTrackingCalledNTimes(0);
				const levels = {
					...unsupportedContentLevelsTracking,
					samplingRates: {
						comment: 3,
					},
				};
				renderDoc(validDoc, levels, 'comment');
				for (let i = 0; i < 10; i++) {
					rerenderDoc!();
				}
				jest.runAllTimers();
				expectUnsupportedContentTrackingCalledNTimes(1);
			});

			it('should fire unsupportedContentLevelsTrackingSucceeded event at sampled rates by appearance for all renderer instances', () => {
				const expectTrackingCalledNTimesByAppearance = (nTimes: number, appearance: string) => {
					expect(
						(createAnalyticsEvent as jest.Mock).mock.calls.filter(
							(callArgs) =>
								callArgs[0].action === 'unsupportedContentLevelsTrackingSucceeded' &&
								callArgs[0].attributes.appearance === appearance,
						).length,
					).toEqual(nTimes);
				};
				const validDoc = {
					type: 'doc',
					version: 1,
					content: [validParagraph],
				};
				const unsupportedContentLevels = {
					enabled: true,
					thresholds: {
						degraded: 10,
						blocking: 50,
					},
					samplingRates: {
						comment: 3,
						'full-page': 2,
					},
				};
				const timesToRenderMap = {
					comment: 12,
					'full-page': 5,
					mobile: 101,
				};
				renderDocs(timesToRenderMap, validDoc, unsupportedContentLevels);
				jest.runAllTimers();
				expectTrackingCalledNTimesByAppearance(4, 'comment');
				expectTrackingCalledNTimesByAppearance(3, 'fixedWidth');
				expectTrackingCalledNTimesByAppearance(2, 'mobile');
			});
		});

		describe('without user-defined thresholds (i.e. with default thresholds)', () => {
			const unsupportedContentLevelsTracking = {
				enabled: true,
			};
			it(`should fire unsupportedContentLevelsTrackingSucceeded event with unsupportedContentLevelSeverity "normal" when unsupported content is less then ${UNSUPPORTED_CONTENT_LEVEL_SEVERITY_THRESHOLD_DEFAULTS.DEGRADED}% of the document`, () => {
				const validDoc = {
					type: 'doc',
					version: 1,
					content: [validParagraph],
				};
				renderDoc(validDoc, unsupportedContentLevelsTracking);
				jest.runAllTimers();
				expect(createAnalyticsEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'unsupportedContentLevelsTrackingSucceeded',
						actionSubject: 'renderer',
						attributes: expect.objectContaining({
							platform: 'web',
							unsupportedContentLevelSeverity: 'normal',
							unsupportedContentLevelPercentage: 0,
							unsupportedNodesCount: 0,
							supportedNodesCount: 3,
						}),
						eventType: 'operational',
					}),
				);
			});

			it(`should fire unsupportedContentLevelsTrackingSucceeded event with unsupportedContentLevelSeverity "degraded" when unsupported content is between ${UNSUPPORTED_CONTENT_LEVEL_SEVERITY_THRESHOLD_DEFAULTS.DEGRADED}% and ${UNSUPPORTED_CONTENT_LEVEL_SEVERITY_THRESHOLD_DEFAULTS.BLOCKING}% of the document`, () => {
				const partiallyInvalidDoc = {
					type: 'doc',
					version: 1,
					content: [validParagraph, validParagraph, validParagraph, invalidParagraph],
				};
				renderDoc(partiallyInvalidDoc, unsupportedContentLevelsTracking);
				jest.runAllTimers();
				expect(createAnalyticsEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'unsupportedContentLevelsTrackingSucceeded',
						actionSubject: 'renderer',
						attributes: expect.objectContaining({
							platform: 'web',
							unsupportedContentLevelSeverity: 'degraded',
							unsupportedContentLevelPercentage: 22,
							unsupportedNodesCount: 2,
							supportedNodesCount: 7,
						}),
						eventType: 'operational',
					}),
				);
			});

			it(`should fire unsupportedContentLevelsTrackingSucceeded event with unsupportedContentLevelSeverity "blocking" when unsupported content is equal to or more than ${UNSUPPORTED_CONTENT_LEVEL_SEVERITY_THRESHOLD_DEFAULTS.BLOCKING}% of the document`, () => {
				const mostlyInvalidDoc = {
					type: 'doc',
					version: 1,
					content: [validParagraph, invalidParagraph, invalidParagraph, invalidParagraph],
				};
				renderDoc(mostlyInvalidDoc, unsupportedContentLevelsTracking);
				jest.runAllTimers();
				expect(createAnalyticsEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'unsupportedContentLevelsTrackingSucceeded',
						actionSubject: 'renderer',
						attributes: expect.objectContaining({
							platform: 'web',
							unsupportedContentLevelSeverity: 'blocking',
							unsupportedContentLevelPercentage: 67,
							unsupportedNodesCount: 6,
							supportedNodesCount: 3,
						}),
						eventType: 'operational',
					}),
				);
			});
		});

		describe('errors', () => {
			let renderDoc: any;

			beforeEach(() => {
				jest.resetModules();
				jest.doMock('@atlaskit/editor-common/utils', () => ({
					...jest.requireActual<object>('@atlaskit/editor-common/utils'),
					getUnsupportedContentLevelData: jest.fn(() => {
						throw new Error('custom mocked error');
					}),
				}));

				jest.isolateModules(() => {
					const { RendererFunctionalComponent } = require('../..');
					RendererIsolated = RendererFunctionalComponent;
				});

				renderDoc = (doc: any, unsupportedContentLevelsTracking: any) => {
					act(() => {
						render(
							<IntlProvider locale="en">
								<RendererIsolated
									document={doc}
									useSpecBasedValidator
									unsupportedContentLevelsTracking={unsupportedContentLevelsTracking}
									createAnalyticsEvent={createAnalyticsEvent}
								/>
							</IntlProvider>,
						);
					});
				};
			});

			it('should fire unsupportedContentLevelsTrackingErrored event with error string', () => {
				const unsupportedContentLevelsTracking = {
					enabled: true,
					thresholds: {
						degraded: 10,
						blocking: 50,
					},
				};
				const validDoc = {
					type: 'doc',
					version: 1,
					content: [validParagraph],
				};
				renderDoc(validDoc, unsupportedContentLevelsTracking);
				jest.runAllTimers();
				expect(createAnalyticsEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						action: 'unsupportedContentLevelsTrackingErrored',
						actionSubject: 'renderer',
						attributes: expect.objectContaining({
							platform: 'web',
							error: 'custom mocked error',
						}),
						eventType: 'operational',
					}),
				);
			});
		});
	});
});

let rafStub: {
	add: (cb: Function) => number;
	flush: () => void;
	step: (steps?: number) => void;
};
let rafSpy: jest.SpyInstance;

describe('renderer rendered analytics event', () => {
	const createAnalyticsEvent: CreateUIAnalyticsEvent = jest.fn(
		() => ({ fire() {} }) as UIAnalyticsEvent,
	);

	const doc = {
		type: 'doc',
		version: 1,
		content: [
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						text: 'hello',
					},
				],
			},
		],
	} as DocNode;

	beforeAll(() => {
		rafStub = createStub();
		rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(rafStub.add);
	});

	afterAll(() => {
		rafSpy.mockRestore();
	});

	beforeEach(() => {
		jest.clearAllMocks();
		// The renderer started/rendered events are sampled, so pin the sample draw.
		jest.spyOn(Math, 'random').mockReturnValue(0);
	});

	afterEach(() => {
		(Math.random as jest.Mock).mockRestore();
	});

	it.each`
		condition                                                                         | threshold                          | severity
		${'when duration <= NORMAL_SEVERITY_THRESHOLD'}                                   | ${NORMAL_SEVERITY_THRESHOLD}       | ${SEVERITY.NORMAL}
		${'when duration > NORMAL_SEVERITY_THRESHOLD and <= DEGRADED_SEVERITY_THRESHOLD'} | ${NORMAL_SEVERITY_THRESHOLD + 1}   | ${SEVERITY.DEGRADED}
		${'when duration > DEGRADED_SEVERITY_THRESHOLD'}                                  | ${DEGRADED_SEVERITY_THRESHOLD + 1} | ${SEVERITY.BLOCKING}
	`(
		'should fire event with $severity severity when $condition',
		({ _condition, threshold, severity }) => {
			(stopMeasure as any).mockImplementation((name: any, callback: any) => {
				callback(threshold, 1);
			});

			render(
				<Renderer
					document={doc}
					analyticsEventSeverityTracking={{
						enabled: true,
						severityNormalThreshold: NORMAL_SEVERITY_THRESHOLD,
						severityDegradedThreshold: DEGRADED_SEVERITY_THRESHOLD,
					}}
					createAnalyticsEvent={createAnalyticsEvent}
				/>,
			);

			// Flush RAF callbacks to trigger the analytics event
			rafStub.flush();

			expect(createAnalyticsEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'rendered',
					actionSubject: 'renderer',
					attributes: expect.objectContaining({
						duration: threshold,
						severity,
					}),
				}),
			);
		},
	);

	it('should NOT fire event when analyticsEventSeverityTracking is explicitly disabled', () => {
		act(() => {
			(stopMeasure as any).mockImplementation((name: any, callback: any) => {
				callback && callback(NORMAL_SEVERITY_THRESHOLD, 1);
			});

			render(
				<Renderer
					document={doc}
					analyticsEventSeverityTracking={{
						enabled: false,
						severityNormalThreshold: NORMAL_SEVERITY_THRESHOLD,
						severityDegradedThreshold: DEGRADED_SEVERITY_THRESHOLD,
					}}
					createAnalyticsEvent={createAnalyticsEvent}
				/>,
			);
		});

		expect(createAnalyticsEvent).not.toHaveBeenCalledWith(
			expect.objectContaining({
				action: 'rendered',
				actionSubject: 'renderer',
			}),
		);
	});

	describe('nestedRendererType analytics', () => {
		it('should include nestedRendererType in rendered event when context is provided', () => {
			(stopMeasure as any).mockImplementation((name: any, callback: any) => {
				callback(NORMAL_SEVERITY_THRESHOLD, 1);
			});

			render(
				<RendererContextProvider value={{ nestedRendererType: 'syncedBlock' }}>
					<Renderer document={doc} createAnalyticsEvent={createAnalyticsEvent} />
				</RendererContextProvider>,
			);

			// Flush RAF callbacks to trigger the analytics event
			rafStub.flush();

			expect(createAnalyticsEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'rendered',
					actionSubject: 'renderer',
					attributes: expect.objectContaining({
						nestedRendererType: 'syncedBlock',
					}),
				}),
			);
		});
	});
});

describe('ValidationContext', () => {
	describe('render nested content in render under validation context', () => {
		it('it do', () => {
			const { container } = render(
				<ValidationContextProvider value={{ skipValidation: true }}>
					<IntlProvider locale="en">
						<RendererDefaultComponent
							document={adfNestedTableData as DocNode}
							useSpecBasedValidator={true}
						/>
					</IntlProvider>
				</ValidationContextProvider>,
			);
			expect(container.querySelectorAll('table')).toHaveLength(2);
		});
	});

	describe('do not render nested content in render under validation context if skipValidation is false', () => {
		it('do not', () => {
			const { container } = render(
				<ValidationContextProvider value={{ skipValidation: false }}>
					<IntlProvider locale="en">
						<RendererDefaultComponent
							document={adfNestedTableData as DocNode}
							useSpecBasedValidator={true}
						/>
					</IntlProvider>
				</ValidationContextProvider>,
			);
			expect(container.querySelectorAll('.unsupported')).toHaveLength(1);
		});
	});

	describe('allowNestedTables', () => {
		it('it should render nested tables if allowNestedTables is enabled', () => {
			const { container } = render(
				<ValidationContextProvider value={{ allowNestedTables: true }}>
					<IntlProvider locale="en">
						<RendererDefaultComponent
							document={adfNestedTableData as DocNode}
							useSpecBasedValidator={true}
						/>
					</IntlProvider>
				</ValidationContextProvider>,
			);
			expect(container.querySelectorAll('table')).toHaveLength(2);
		});

		it('it should not render nested tables if allowNestedTables is enabled', () => {
			const { container } = render(
				<ValidationContextProvider value={{ allowNestedTables: false }}>
					<IntlProvider locale="en">
						<RendererDefaultComponent
							document={adfNestedTableData as DocNode}
							useSpecBasedValidator={true}
						/>
					</IntlProvider>
				</ValidationContextProvider>,
			);
			expect(container.querySelectorAll('.unsupported')).toHaveLength(1);
		});
	});
});
