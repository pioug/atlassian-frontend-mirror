const mockStopMeasureDuration = 1234;

jest.mock('@atlaskit/editor-common/performance-measures', () => ({
	...jest.requireActual<Object>('@atlaskit/editor-common/performance-measures'),
	startMeasure: jest.fn(),
	stopMeasure: jest.fn(
		(measureName: string, onMeasureComplete?: (duration: number, startTime: number) => void) => {
			onMeasureComplete && onMeasureComplete(mockStopMeasureDuration, 1);
		},
	),
}));
jest.mock('@atlaskit/editor-common/performance/measure-tti', () => ({
	...jest.requireActual<Object>('@atlaskit/editor-common/performance/measure-tti'),
	measureTTI: jest.fn(),
}));

import React from 'react';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { mount, ReactWrapper } from 'enzyme';

import type { DocNode } from '@atlaskit/adf-schema';
import { a, b, doc, heading, p, text } from '@atlaskit/adf-utils/builders';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';
import { EDITOR_APPEARANCE_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { analyticsClient } from '@atlaskit/editor-test-helpers/analytics-client-mock';
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';
import { render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import { Media } from '../../../react/nodes';
import * as renderDocumentModule from '../../../render-document';
import type { RendererProps } from '../../../ui/renderer-props';
import Renderer from '../../../ui/Renderer';
import type { RendererAppearance } from '../../../ui/Renderer/types';
import { initialDoc } from '../../__fixtures__/initial-doc';
import { intlRequiredDoc } from '../../__fixtures__/intl-required-doc';
import { invalidDoc } from '../../__fixtures__/invalid-doc';
import * as linkDoc from '../../__fixtures__/links.adf.json';
import { tableLayout } from '../../__fixtures__/table';

const validDoc = doc(
	heading({ level: 1 })(text('test')),
	p(
		a({ href: 'https://www.atlassian.com' })('Hello, '),
		a({ href: 'https://www.atlassian.com' })(b('World!')),
	),
);

describe('@atlaskit/renderer/ui/Renderer', () => {
	let renderer: ReactWrapper;

	const initRenderer = (doc: any = initialDoc, props: Partial<RendererProps> = {}) =>
		mount(<Renderer document={doc} {...props} />);

	afterEach(() => {
		if (renderer && renderer.length) {
			renderer.unmount();
		}
		jest.restoreAllMocks();
	});
	describe('should re-render when appearance changes', () => {
		const renderMock = jest.fn();
		const WrappedRenderer = (props: any) => {
			renderMock();
			return <Renderer {...props} />;
		};
		renderer = mount(<WrappedRenderer document={initialDoc} />);
		renderer.setProps({ appearance: 'full-width' });
		renderer.setProps({ appearance: 'full-page' });
		expect(renderMock).toHaveBeenCalledTimes(3);
	});

	it('should re-render when allowCustomPanels changes', () => {
		const renderMock = jest.fn();
		const WrappedRenderer = (props: any) => {
			renderMock();
			return <Renderer {...props} />;
		};
		renderer = mount(<WrappedRenderer document={initialDoc} />);
		renderer.setProps({ allowCustomPanels: false });
		renderer.setProps({ allowCustomPanels: true });
		expect(renderMock).toHaveBeenCalledTimes(3); // Initial render + 2 updates
	});

	it('should not re-render when allowCustomPanels does not change', () => {
		const renderMock = jest.fn();
		const WrappedRenderer = (props: any) => {
			renderMock();
			return <Renderer {...props} />;
		};
		renderer = mount(<WrappedRenderer document={initialDoc} />);
		renderer.setProps({ allowCustomPanels: false });
		renderer.setProps({ allowCustomPanels: false });
		expect(renderMock).toHaveBeenCalledTimes(3); // Initial render + 1 update
	});

	it('should catch errors and render unsupported content text', () => {
		const wrapper = initRenderer(invalidDoc, {
			useSpecBasedValidator: true,
		});
		expect(wrapper.find('UnsupportedBlockNode')).toHaveLength(1);
		wrapper.unmount();
	});

	it('should call onError callback when catch error', () => {
		const onError = jest.fn();
		const wrapper = initRenderer(invalidDoc, {
			useSpecBasedValidator: true,
			onError,
		});
		expect(onError).toHaveBeenCalled();
		wrapper.unmount();
	});

	describe('react-intl-next', () => {
		describe('when IntlProvider is not in component ancestry', () => {
			it('should not throw an error', () => {
				expect(() => {
					const renderer = initRenderer(intlRequiredDoc, {
						useSpecBasedValidator: true,
					});
					renderer.unmount();
				}).not.toThrow();
			});
		});

		describe('when IntlProvider is in component ancestry', () => {
			let rendererWithIntl: ReactWrapper;

			beforeEach(() => {
				rendererWithIntl = mount(
					<IntlProvider locale="es">
						<Renderer document={intlRequiredDoc} useSpecBasedValidator />
					</IntlProvider>,
				);
			});

			afterEach(() => {
				rendererWithIntl.unmount();
			});

			it('should not throw an error', () => {
				expect(() => rendererWithIntl).not.toThrow();
			});

			it('should use the provided IntlProvider, and not setup a default IntlProvider', () => {
				const intlProviderWrapper = rendererWithIntl.find(IntlProvider);
				expect(intlProviderWrapper.length).toEqual(1);
				expect(intlProviderWrapper.props()).toEqual(expect.objectContaining({ locale: 'es' }));
			});
		});
	});

	describe('Stage0', () => {
		describe('captions', () => {
			const captionText = 'this is a caption';
			const docWithCaption = {
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'mediaSingle',
						attrs: {
							layout: 'center',
						},
						content: [
							{
								type: 'media',
								attrs: {
									id: '0a7b3495-d1e5-4b27-90fb-a2589cd96e3b',
									type: 'file',
									collection: 'MediaServicesSample',
									width: 1874,
									height: 1078,
								},
							},
							{
								type: 'caption',
								content: [{ type: 'text', text: captionText }],
							},
						],
					},
					{
						type: 'paragraph',
						content: [],
					},
				],
			};
			xit('should render caption text', () => {
				renderer = initRenderer(docWithCaption);
				expect(renderer.text()).toContain(captionText);
			});
		});

		describe('marks', () => {
			const docWithStage0Mark = {
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'text',
								text: 'Hello World',
								marks: [
									{
										type: 'confluenceInlineComment',
										attrs: {
											reference: 'ref',
										},
									},
								],
							},
						],
					},
				],
			};

			it('should remove stage0 marks if flag is not explicitly set to "stage0"', () => {
				renderer = initRenderer(docWithStage0Mark);
				expect(renderer.find('ConfluenceInlineComment')).toHaveLength(0);
			});

			it('should keep stage0 marks if flag is explicitly set to "stage0"', () => {
				renderer = initRenderer(docWithStage0Mark, { adfStage: 'stage0' });
				expect(renderer.find('ConfluenceInlineComment')).toHaveLength(1);
			});
		});

		describe('alt text', () => {
			const docWithAltText: DocNode = {
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'mediaSingle',
						attrs: {
							layout: 'center',
						},
						content: [
							{
								type: 'media',
								attrs: {
									id: '0a7b3495-d1e5-4b27-90fb-a2589cd96e3b',
									type: 'file',
									collection: 'MediaServicesSample',
									width: 1874,
									height: 1078,
									alt: 'This is an alt text',
								},
							},
						],
					},
					{
						type: 'paragraph',
						content: [],
					},
				],
			};
			const mediaProvider: MediaProvider = {
				viewMediaClientConfig: getDefaultMediaClientConfig(),
			};
			let providerFactory: ProviderFactory;
			beforeEach(() => {
				providerFactory = new ProviderFactory();
				providerFactory.setProvider('mediaProvider', Promise.resolve(mediaProvider));
			});

			afterEach(() => {
				providerFactory.destroy();
			});

			it.each<[string, boolean]>([
				['should add alt text on images if flag allowAltTextOnImages is on', true],
				['should not add alt text on images if flag allowAltTextOnImages is off', false],
			])('%s', async (_, altTextFlag: boolean) => {
				const { container } = render(
					<Renderer
						document={docWithAltText}
						allowAltTextOnImages={altTextFlag}
						dataProviders={providerFactory}
					/>,
				);

				if (altTextFlag) {
					await waitFor(() =>
						expect(container.querySelector('[data-node-type="media"]')).toHaveAttribute(
							'data-alt',
							'This is an alt text',
						),
					);
				} else {
					await waitFor(() =>
						expect(container.querySelector('[data-node-type="media"]')).not.toHaveAttribute(
							'data-alt',
							'This is an alt text',
						),
					);
				}
			});
		});

		it('should not render link mark around mediaSingle if media.allowLinking is undefined', () => {
			renderer = initRenderer(linkDoc, {});
			const media = renderer.find(Media);
			const dataBlockLink = media.find('[data-block-link]');
			expect(dataBlockLink.length).toEqual(0);
		});

		it('should not render link mark around media if media.allowLinking is false', () => {
			renderer = initRenderer(linkDoc, {});
			const media = renderer.find(Media);
			const dataBlockLink = media.find('[data-block-link]');
			expect(dataBlockLink.length).toEqual(0);
		});

		it('should render link mark around media if media.allowLinking is true', () => {
			renderer = initRenderer(linkDoc, {
				media: { allowLinking: true },
			});
			const media = renderer.find(Media);
			const dataBlockLink = media.find('[data-block-link]');
			expect(dataBlockLink.length).not.toEqual(0);
		});
	});

	describe('Truncated Renderer', () => {
		it('should truncate to 95px when truncated prop is true and maxHeight is undefined', () => {
			renderer = initRenderer(initialDoc, { truncated: true });

			expect(renderer.find('TruncatedWrapper')).toHaveLength(1);

			const wrapper = renderer.find('TruncatedWrapper').childAt(0);
			expect(wrapper.props().height).toEqual(95);
		});

		it('should truncate to custom height when truncated prop is true and maxHeight is defined', () => {
			renderer = initRenderer(initialDoc, { truncated: true, maxHeight: 100 });
			expect(renderer.find('TruncatedWrapper')).toHaveLength(1);
			expect(renderer.find('TruncatedWrapper').props().height).toEqual(100);
		});

		it("shouldn't truncate when truncated prop is undefined and maxHeight is defined", () => {
			renderer = initRenderer(initialDoc, { maxHeight: 100 });
			expect(renderer.find('TruncatedWrapper')).toHaveLength(0);
		});

		it("shouldn't truncate when truncated prop is undefined and maxHeight is undefined", () => {
			renderer = initRenderer();
			expect(renderer.find('TruncatedWrapper')).toHaveLength(0);
		});

		it('should truncate and adjust fade out if fadeoutHeight prop is defined', () => {
			renderer = initRenderer(initialDoc, {
				truncated: true,
				maxHeight: 100,
				fadeOutHeight: 50,
			});
			expect(renderer.find('TruncatedWrapper')).toHaveLength(1);
			expect((renderer.find('TruncatedWrapper').props() as any).fadeHeight).toEqual(50);
		});
	});

	describe('Analytics', () => {
		let client: AnalyticsWebClient;

		const initRendererWithAnalytics = (props: Partial<RendererProps> = {}) =>
			mount(
				<FabricAnalyticsListeners client={client}>
					<Renderer document={initialDoc} {...props} />
				</FabricAnalyticsListeners>,
			);

		beforeEach(() => {
			client = analyticsClient();
			jest.useFakeTimers();
			jest.spyOn(window, 'requestAnimationFrame').mockImplementation((fn: Function) => fn());
		});

		afterEach(() => {
			(window.requestAnimationFrame as jest.Mock).mockRestore();
			jest.useRealTimers();
		});

		it('should fire heading anchor hit analytics event', () => {
			const oldHash = window.location.hash;
			window.location.hash = '#test';

			renderer = mount(
				<FabricAnalyticsListeners client={client}>
					<Renderer document={validDoc} />
				</FabricAnalyticsListeners>,
				{
					attachTo: document.body,
				},
			);

			jest.runAllTimers();

			expect(client.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'viewed',
					actionSubject: 'anchorLink',
					attributes: expect.objectContaining({
						platform: 'web',
						mode: 'renderer',
					}),
				}),
			);

			renderer.detach();
			window.location.hash = oldHash;
		});

		it('should fire analytics event on renderer started', () => {
			renderer = initRendererWithAnalytics();

			expect(client.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'started',
					actionSubject: 'renderer',
					attributes: expect.objectContaining({ platform: 'web' }),
				}),
			);
		});

		const appearances: {
			appearance: RendererAppearance;
			analyticsAppearance: EDITOR_APPEARANCE_CONTEXT;
		}[] = [
			{
				appearance: 'full-page',
				analyticsAppearance: EDITOR_APPEARANCE_CONTEXT.FIXED_WIDTH,
			},
			{
				appearance: 'comment',
				analyticsAppearance: EDITOR_APPEARANCE_CONTEXT.COMMENT,
			},
			{
				appearance: 'full-width',
				analyticsAppearance: EDITOR_APPEARANCE_CONTEXT.FULL_WIDTH,
			},
		];
		appearances.forEach((appearance) => {
			it(`adds appearance to analytics events for ${appearance.appearance} renderer`, () => {
				renderer = initRendererWithAnalytics({
					appearance: appearance.appearance,
				});

				expect(client.sendUIEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						attributes: expect.objectContaining({
							appearance: appearance.analyticsAppearance,
						}),
					}),
				);
			});
		});
	});

	describe('Custom components', () => {
		const table = (props: any) => (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			<table className="custom-component">
				<tbody>{props.children}</tbody>
			</table>
		);
		it('should find the prop nodeComponents', () => {
			const renderer = initRenderer(tableLayout, { nodeComponents: { table } });
			expect(renderer.props()).toEqual(expect.objectContaining({ nodeComponents: { table } }));
		});
		it('should render the custom table component', () => {
			const renderer = initRenderer(tableLayout, { nodeComponents: { table } });
			expect(renderer.find(table)).toHaveLength(12);
		});
		it('should render default tables', () => {
			const renderer = initRenderer(tableLayout);
			expect(renderer.find(table)).toHaveLength(0);
			expect(renderer.find('table')).toHaveLength(12);
		});
	});

	describe('Extension Handlers', () => {
		// IMPORTANT: This test is needed to avoid SSR pages with extensions breaking. This test should only be changed when the
		// ReactSerializer has been update to be more targetted in it updates.
		it('serializer passed to the renderDocument should have changed', () => {
			const renderMock = jest.fn();
			const WrappedRenderer = (props: any) => {
				renderMock();
				return <Renderer {...props} />;
			};
			renderer = mount(<WrappedRenderer document={initialDoc} />);
			const renderDocumentSpy = jest.spyOn(renderDocumentModule, 'renderDocument');

			renderer.setProps({ extensionHandlers: {} });
			renderer.setProps({ extensionHandlers: {} });

			expect(renderMock).toHaveBeenCalledTimes(3);
			expect(renderDocumentSpy).toHaveBeenCalledTimes(2);

			// IMPORTANT: 2 renders have occured both times being passed 2 different extension handler objects
			// This means the serializer passed to the renderDocument should have changed and NOT be the same serialzer instance
			// Which was passed the first time.
			// This is due to a HOT created in an attempt to reduce re-renders, which broken dynamic extensions on SSR pages
			// PIR Action - https://product-fabric.atlassian.net/browse/ED-19393
			// https://product-fabric.atlassian.net/wiki/spaces/E/pages/3656254243/PIR-15961+HOT-104596+-+Macros+are+not+loaded+on+SSR+enabled+views
			expect(renderDocumentSpy.mock.calls[0][1]).not.toEqual(renderDocumentSpy.mock.calls[1][1]);
		});
	});

	describe('ExtensionHandlers', () => {
		beforeEach(() => {
			jest.clearAllMocks();
			jest.resetAllMocks();
		});
		it('should not re-render when extensionHandlers has not change', () => {
			const renderMock = jest.fn();
			const WrappedRenderer = (props: any) => {
				renderMock();
				return <Renderer {...props} />;
			};
			renderer = mount(<WrappedRenderer document={initialDoc} />);
			const renderDocumentSpy = jest.spyOn(renderDocumentModule, 'renderDocument');

			const emptyExtensionHandlers: ExtensionHandlers = {};
			renderer.setProps({ extensionHandlers: emptyExtensionHandlers });
			renderer.setProps({ extensionHandlers: emptyExtensionHandlers });

			expect(renderMock).toHaveBeenCalledTimes(3); // Initial render + 2 updates each setProps causes an update
			expect(renderDocumentSpy).toHaveBeenCalledTimes(1);
		});
	});
});
