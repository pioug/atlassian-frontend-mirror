import React from 'react';
import { act } from '@testing-library/react';
import type { AnnotationId, DocNode } from '@atlaskit/adf-schema';
import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema';
import type { AnnotationProviders, AnnotationState } from '@atlaskit/editor-common/types';
import { AnnotationUpdateEmitter } from '@atlaskit/editor-common/types';
import { UnsupportedBlock, UnsupportedInline } from '@atlaskit/editor-common/ui';
import { fg } from '@atlaskit/platform-feature-flags';
import { mount, type ReactWrapper, shallow, type ShallowWrapper } from 'enzyme';

import {
	SEVERITY,
	UNSUPPORTED_CONTENT_LEVEL_SEVERITY_THRESHOLD_DEFAULTS,
} from '@atlaskit/editor-common/utils';

import { stopMeasure } from '@atlaskit/editor-common/performance-measures';

import type { CreateUIAnalyticsEvent, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import RendererDefaultComponent, {
	DEGRADED_SEVERITY_THRESHOLD,
	NORMAL_SEVERITY_THRESHOLD,
	RendererFunctionalComponent as Renderer,
} from '../../';
import { ValidationContextProvider } from '../../ValidationContext';
import { Paragraph } from '../../../../react/nodes';
import { AnnotationsContextWrapper } from '../../../annotations/wrapper';
import type { RendererAppearance } from '../../types';
import { IntlProvider } from 'react-intl-next';
import { adfNestedTableData } from '../__fixtures__/mockData';

const mockCreateAnalyticsEvent = jest.fn(() => ({ fire() {} }));

jest.mock('@atlaskit/editor-common/ui', () => {
	const WithCreateAnalyticsEventMock = (props: any) => props.render(mockCreateAnalyticsEvent);
	return {
		...jest.requireActual<Object>('@atlaskit/editor-common/ui'),
		WithCreateAnalyticsEvent: WithCreateAnalyticsEventMock,
	};
});

jest.mock('@atlaskit/editor-common/performance-measures', () => {
	return {
		...jest.requireActual<Object>('@atlaskit/editor-common/performance-measures'),
		stopMeasure: jest.fn(),
	};
});

jest.mock('@atlaskit/platform-feature-flags', () => ({
	...jest.requireActual<any>('@atlaskit/platform-feature-flags'),
	fg: jest.fn(),
}));

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
			const wrapper = mount(<Renderer document={adf} appearance="full-page" />);
			expect(wrapper!.find('div.ak-renderer-wrapper.is-full-page')).toHaveLength(1);
			wrapper.unmount();
		});
	});

	describe('annotationProvider', () => {
		it('should call the provider with ids inside of the document', () => {
			const wrapper = mount(
				<IntlProvider locale="en">
					<RendererDefaultComponent
						annotationProvider={annotationProvider}
						document={adf}
						allowAnnotations
					/>
				</IntlProvider>,
			);

			expect(getStateCallbackMock).toHaveBeenCalledWith(annotationsId);
			wrapper.unmount();
		});
	});

	describe('when the allowAnnotations is enabled', () => {
		it('should render the AnnotationsContextWrapper', () => {
			const wrapper = mount(
				<RendererDefaultComponent
					annotationProvider={annotationProvider}
					document={adf}
					allowAnnotations={true}
				/>,
			);
			expect(wrapper!.find(AnnotationsContextWrapper)).toHaveLength(1);
			wrapper.unmount();
		});
	});

	describe('when the allowAnnotations is disabled', () => {
		it('should not render the AnnotationsContextWrapper', () => {
			let wrapper: ReactWrapper;
			act(() => {
				wrapper = mount(
					<RendererDefaultComponent
						annotationProvider={annotationProvider}
						document={adf}
						allowAnnotations={false}
					/>,
				);
			});

			expect(wrapper!.find(AnnotationsContextWrapper)).toHaveLength(0);
		});
	});

	describe('error boundary', () => {
		it.skip('should log error on Renderer render errors', () => {
			let wrapper: ReactWrapper;
			wrapper = mount(<RendererDefaultComponent document={adf} />);
			const rendererWrapper = wrapper.find(Renderer);
			expect(() => rendererWrapper.simulateError(new Error('Oh no!'))).toThrow();

			expect(mockCreateAnalyticsEvent).toHaveBeenLastCalledWith(
				expect.objectContaining({
					action: 'unhandledErrorCaught',
					actionSubject: 'renderer',
					actionSubjectId: undefined,
					attributes: expect.objectContaining({
						platform: 'web',
						errorMessage: 'Oh no!',
						errorStack: expect.any(String),
						componentStack: expect.any(String),
						errorRethrown: true,
					}),
				}),
			);
		});
	});

	describe('Serializer', () => {
		const mockCustomSerializerText = 'Custom Serializer';
		const mockCustomSerializeFragment = jest.fn(() => <div>{mockCustomSerializerText}</div>);
		const customCreateSerializer = () => {
			return {
				serializeFragment: mockCustomSerializeFragment,
			};
		};

		const expectSerializer = ({ custom, wrapper }: { custom: boolean; wrapper: ReactWrapper }) => {
			const wrapperDivs = wrapper.find('div');
			expect(wrapperDivs).toHaveLength(4);

			if (custom) {
				expect(mockCustomSerializeFragment).toHaveBeenCalled();
				expect(wrapperDivs.at(0).text()).toEqual(mockCustomSerializerText);
			} else {
				expect(mockCustomSerializeFragment).not.toHaveBeenCalled();
				expect(wrapperDivs.at(0).text()).not.toEqual(mockCustomSerializerText);
			}
		};

		afterEach(() => {
			mockCustomSerializeFragment.mockClear();
			(fg as jest.Mock).mockReset();
		});

		it('should use default Serializer when createSerializer is not defined and FF is enabled', () => {
			(fg as jest.Mock).mockImplementation(
				(gateName) => gateName === 'cc_complexit_fe_progressive_adf_rendering',
			);
			const wrapper = mount(
				<IntlProvider locale="en">
					<RendererDefaultComponent document={adf} />
				</IntlProvider>,
			);
			expectSerializer({ wrapper, custom: false });
			wrapper.unmount();
		});

		it('should use custom Serializer when createSerializer is defined and FF is enabled', () => {
			(fg as jest.Mock).mockImplementation(
				(gateName) => gateName === 'cc_complexit_fe_progressive_adf_rendering',
			);
			const wrapper = mount(
				<IntlProvider locale="en">
					<RendererDefaultComponent document={adf} createSerializer={customCreateSerializer} />
				</IntlProvider>,
			);
			expectSerializer({ wrapper, custom: true });
			wrapper.unmount();
		});

		it('should use default Serializer when FF is disabled', () => {
			(fg as jest.Mock).mockImplementation(() => false);
			const wrapper = mount(
				<IntlProvider locale="en">
					<RendererDefaultComponent document={adf} createSerializer={customCreateSerializer} />
				</IntlProvider>,
			);
			expectSerializer({ wrapper, custom: false });
			wrapper.unmount();
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
		let wrapper: ShallowWrapper;
		act(() => {
			wrapper = shallow(<Renderer document={docWithInvalidBlock} useSpecBasedValidator={true} />);
		});

		expect(wrapper!.find(UnsupportedBlock)).not.toHaveLength(0);
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

		let wrapper: ShallowWrapper;
		act(() => {
			wrapper = shallow(<Renderer document={docWithValidParagraph} useSpecBasedValidator={true} />);
		});

		expect(wrapper!.find(UnsupportedBlock)).toHaveLength(0);
		expect(wrapper!.find(Paragraph)).not.toHaveLength(0);
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

		let wrapper: ShallowWrapper;
		act(() => {
			wrapper = shallow(<Renderer document={docWithInvalidInline} useSpecBasedValidator={true} />);
		});

		expect(wrapper!.find(UnsupportedInline)).not.toHaveLength(0);
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

		let wrapper: ShallowWrapper;
		act(() => {
			wrapper = shallow(<Renderer document={docWithValidInline} useSpecBasedValidator={true} />);
		});

		expect(wrapper!.find(UnsupportedInline)).toHaveLength(0);
		expect(wrapper!.find(Paragraph)).not.toHaveLength(0);
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
	let rendererWrapper: ShallowWrapper | null = null;

	const renderDoc = (
		doc: any,
		unsupportedContentLevelsTracking: any,
		appearance?: RendererAppearance,
	) => {
		rendererWrapper = shallow(
			<RendererIsolated
				document={doc}
				useSpecBasedValidator
				unsupportedContentLevelsTracking={unsupportedContentLevelsTracking}
				createAnalyticsEvent={createAnalyticsEvent}
				appearance={appearance}
			/>,
		);
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
					rendererWrapper!.render();
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
					...jest.requireActual<Object>('@atlaskit/editor-common/utils'),
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
						shallow(
							<RendererIsolated
								document={doc}
								useSpecBasedValidator
								unsupportedContentLevelsTracking={unsupportedContentLevelsTracking}
								createAnalyticsEvent={createAnalyticsEvent}
							/>,
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

describe('severity', () => {
	const createAnalyticsEvent: CreateUIAnalyticsEvent = jest.fn(
		() => ({ fire() {} }) as UIAnalyticsEvent,
	);

	jest
		.spyOn(window, 'requestAnimationFrame')
		.mockImplementation((callback: FrameRequestCallback) => callback(1) as any);

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

	beforeEach(() => {
		jest.clearAllMocks();
	});

	// Ignored via go/ees007
	// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
	// FIXME: Jest upgrade
	// Assertion error
	it.skip.each`
		condition                                                                         | threshold                          | severity
		${'when duration <= NORMAL_SEVERITY_THRESHOLD'}                                   | ${NORMAL_SEVERITY_THRESHOLD}       | ${SEVERITY.NORMAL}
		${'when duration > NORMAL_SEVERITY_THRESHOLD and <= DEGRADED_SEVERITY_THRESHOLD'} | ${NORMAL_SEVERITY_THRESHOLD + 1}   | ${SEVERITY.DEGRADED}
		${'when duration > DEGRADED_SEVERITY_THRESHOLD'}                                  | ${DEGRADED_SEVERITY_THRESHOLD + 1} | ${SEVERITY.BLOCKING}
	`(
		'should fire event with $severity severity when $condition',
		({ condition, threshold, severity }) => {
			act(() => {
				(stopMeasure as any).mockImplementation((name: any, callback: any) => {
					callback && callback(threshold, 1);
				});

				shallow(
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
			});

			expect(createAnalyticsEvent).toHaveBeenLastCalledWith(
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

			shallow(
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
});

describe('ValidationContext', () => {
	describe('render nested content in render under validation context', () => {
		it('it do', () => {
			const wrapper = mount(
				<ValidationContextProvider value={{ skipValidation: true }}>
					<IntlProvider locale="en">
						<RendererDefaultComponent
							document={adfNestedTableData as DocNode}
							useSpecBasedValidator={true}
						/>
					</IntlProvider>
				</ValidationContextProvider>,
			);
			expect(wrapper.find('table')).toHaveLength(2);
			wrapper.unmount();
		});
	});

	describe('do not render nested content in render under validation context if skipValidation is false', () => {
		it('do not', () => {
			const wrapper = mount(
				<ValidationContextProvider value={{ skipValidation: false }}>
					<IntlProvider locale="en">
						<RendererDefaultComponent
							document={adfNestedTableData as DocNode}
							useSpecBasedValidator={true}
						/>
					</IntlProvider>
				</ValidationContextProvider>,
			);
			expect(wrapper.find(UnsupportedBlock)).toHaveLength(1);
			wrapper.unmount();
		});
	});

	describe('allowNestedTables', () => {
		it('it should render nested tables if allowNestedTables is enabled', () => {
			const wrapper = mount(
				<ValidationContextProvider value={{ allowNestedTables: true }}>
					<IntlProvider locale="en">
						<RendererDefaultComponent
							document={adfNestedTableData as DocNode}
							useSpecBasedValidator={true}
						/>
					</IntlProvider>
				</ValidationContextProvider>,
			);
			expect(wrapper.find('table')).toHaveLength(2);
			wrapper.unmount();
		});

		it('it should not render nested tables if allowNestedTables is enabled', () => {
			const wrapper = mount(
				<ValidationContextProvider value={{ allowNestedTables: false }}>
					<IntlProvider locale="en">
						<RendererDefaultComponent
							document={adfNestedTableData as DocNode}
							useSpecBasedValidator={true}
						/>
					</IntlProvider>
				</ValidationContextProvider>,
			);
			expect(wrapper.find(UnsupportedBlock)).toHaveLength(1);
			wrapper.unmount();
		});
	});
});
