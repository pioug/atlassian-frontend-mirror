const mockStopMeasureDuration = 1234;

jest.mock('@atlaskit/editor-common/performance-measures', () => ({
	...jest.requireActual<object>('@atlaskit/editor-common/performance-measures'),
	startMeasure: jest.fn(),
	stopMeasure: jest.fn(
		(measureName: string, onMeasureComplete?: (duration: number, startTime: number) => void) => {
			onMeasureComplete && onMeasureComplete(mockStopMeasureDuration, 1);
		},
	),
}));
const mockIntlProvider = jest.fn();
jest.mock('react-intl', () => {
	const actual = jest.requireActual('react-intl');
	const react = jest.requireActual('react');
	return {
		...actual,
		IntlProvider: (props: Record<string, unknown>) => {
			mockIntlProvider(props);
			return react.createElement(actual.IntlProvider, props);
		},
	};
});

jest.mock('@atlaskit/editor-common/performance/measure-tti', () => ({
	...jest.requireActual<object>('@atlaskit/editor-common/performance/measure-tti'),
	measureTTI: jest.fn(),
}));

import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import { a, b, doc, heading, p, text } from '@atlaskit/adf-utils/builders';
import FabricAnalyticsListeners from '@atlaskit/analytics-listeners/FabricAnalyticsListeners';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners/types';
import { EDITOR_APPEARANCE_CONTEXT } from '@atlaskit/analytics-namespaced-context/FabricEditorAnalyticsContext';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { analyticsClient } from '@atlaskit/editor-test-helpers/analytics-client-mock';
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';

import * as renderDocumentModule from '../../../render-document';
import Renderer from '../../../ui/Renderer';
import type { RendererProps } from '../../../ui/renderer-props';
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

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('@atlaskit/renderer/ui/Renderer', () => {
	const initRenderer = (doc: any = initialDoc, props: Partial<RendererProps> = {}) =>
		// eslint-disable-next-line react/jsx-props-no-spreading
		render(<Renderer document={doc} {...props} />);

	beforeEach(() => {
		mockIntlProvider.mockClear();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should re-render when appearance changes', () => {
		const renderMock = jest.fn();
		const WrappedRenderer = (props: any) => {
			renderMock();
			// eslint-disable-next-line react/jsx-props-no-spreading
			return <Renderer {...props} />;
		};
		const { rerender } = render(<WrappedRenderer document={initialDoc} />);

		rerender(<WrappedRenderer document={initialDoc} appearance="full-width" />);
		rerender(<WrappedRenderer document={initialDoc} appearance="full-page" />);

		expect(renderMock).toHaveBeenCalledTimes(3);
	});

	it('should re-render when allowCustomPanels changes', async () => {
		const renderMock = jest.fn();
		const WrappedRenderer = (props: any) => {
			renderMock();
			return <Renderer {...props} />;
		};
		const { rerender } = render(<WrappedRenderer document={initialDoc} />);

		rerender(<WrappedRenderer document={initialDoc} allowCustomPanels={false} />);
		rerender(<WrappedRenderer document={initialDoc} allowCustomPanels={true} />);

		expect(renderMock).toHaveBeenCalledTimes(3); // Initial render + 2 updates

		await expect(document.body).toBeAccessible();
	});

	it('should not re-render when allowCustomPanels does not change', async () => {
		const renderMock = jest.fn();
		const WrappedRenderer = (props: any) => {
			renderMock();
			return <Renderer {...props} />;
		};
		const { rerender } = render(<WrappedRenderer document={initialDoc} />);

		rerender(<WrappedRenderer document={initialDoc} allowCustomPanels={false} />);
		rerender(<WrappedRenderer document={initialDoc} allowCustomPanels={false} />);

		expect(renderMock).toHaveBeenCalledTimes(3); // Initial render + 2 updates

		await expect(document.body).toBeAccessible();
	});

	it('should catch errors and render unsupported content text', async () => {
		const { container } = initRenderer(invalidDoc);

		expect(container.querySelectorAll('.unsupported')).toHaveLength(1);

		await expect(document.body).toBeAccessible();
	});

	it('should call onError callback when catch error', async () => {
		const onError = jest.fn();
		initRenderer(invalidDoc, {
			onError,
		});

		expect(onError).toHaveBeenCalled();

		await expect(document.body).toBeAccessible();
	});

	describe('react-intl', () => {
		describe('when IntlProvider is not in component ancestry', () => {
			it('should not throw an error', async () => {
				expect(() => {
					initRenderer(intlRequiredDoc);
				}).not.toThrow();

				await expect(document.body).toBeAccessible();
			});
		});

		describe('when IntlProvider is in component ancestry', () => {
			const renderWithProvidedIntl = () =>
				render(
					<IntlProvider locale="es">
						<Renderer document={intlRequiredDoc} />
					</IntlProvider>,
				);

			it('should not throw an error', async () => {
				expect(() => renderWithProvidedIntl()).not.toThrow();

				await expect(document.body).toBeAccessible();
			});

			it('should use the provided IntlProvider, and not setup a default IntlProvider', async () => {
				renderWithProvidedIntl();

				expect(mockIntlProvider).toHaveBeenCalledTimes(1);
				expect(mockIntlProvider).toHaveBeenCalledWith(expect.objectContaining({ locale: 'es' }));

				await expect(document.body).toBeAccessible();
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
				const { container } = initRenderer(docWithCaption);
				expect(container.textContent).toContain(captionText);
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

			it('should remove stage0 marks if flag is not explicitly set to "stage0"', async () => {
				initRenderer(docWithStage0Mark);

				await expect(document.body).toBeAccessible();
			});

			it('should keep stage0 marks if flag is explicitly set to "stage0"', async () => {
				initRenderer(docWithStage0Mark, { adfStage: 'stage0' });

				await expect(document.body).toBeAccessible();
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

		it('should not render link mark around mediaSingle if media.allowLinking is undefined', async () => {
			const { container } = initRenderer(linkDoc, {});

			expect(container.querySelectorAll('[data-block-link]')).toHaveLength(0);

			await expect(document.body).toBeAccessible();
		});

		it('should not render link mark around media if media.allowLinking is false', async () => {
			const { container } = initRenderer(linkDoc, {});

			expect(container.querySelectorAll('[data-block-link]')).toHaveLength(0);

			await expect(document.body).toBeAccessible();
		});

		it('should render link mark around media if media.allowLinking is true', async () => {
			const { container } = initRenderer(linkDoc, {
				media: { allowLinking: true },
			});

			expect(container.querySelectorAll('[data-block-link]').length).not.toEqual(0);

			// the link wraps a media card that never resolves in jsdom, so the anchor has no
			// discernible text and trips `link-name`
			// eslint-disable-next-line @atlassian/a11y/no-violation-count
			await expect(document.body).toBeAccessible({ violationCount: 1 });
		});
	});

	describe('Truncated Renderer', () => {
		const truncationWrapper = (container: HTMLElement) => container.firstElementChild;

		// jsdom does not resolve `::after` declarations through `getComputedStyle`, so the offset the
		// fade starts at has to be read out of the rule emotion generated for the wrapper
		const fadeStartsAt = (container: HTMLElement) => {
			const selectors = Array.from(truncationWrapper(container)!.classList).map(
				(className) => `.${className}::after`,
			);
			const fadeRule = Array.from(document.querySelectorAll('style'))
				.map((style) => style.textContent ?? '')
				.find((rule) => selectors.some((selector) => rule.includes(selector)));

			return /top:\s*(\S+?);/u.exec(fadeRule ?? '')?.[1];
		};

		it('should truncate to 95px when truncated prop is true and maxHeight is undefined', async () => {
			const { container } = initRenderer(initialDoc, { truncated: true });

			expect(truncationWrapper(container)).toHaveStyle({ maxHeight: '95px' });

			await expect(document.body).toBeAccessible();
		});

		it('should truncate to custom height when truncated prop is true and maxHeight is defined', async () => {
			const { container } = initRenderer(initialDoc, { truncated: true, maxHeight: 100 });

			expect(truncationWrapper(container)).toHaveStyle({ maxHeight: '100px' });

			await expect(document.body).toBeAccessible();
		});

		it("shouldn't truncate when truncated prop is undefined and maxHeight is defined", async () => {
			const { container } = initRenderer(initialDoc, { maxHeight: 100 });

			expect(truncationWrapper(container)).toHaveClass('ak-renderer-wrapper');

			await expect(document.body).toBeAccessible();
		});

		it("shouldn't truncate when truncated prop is undefined and maxHeight is undefined", async () => {
			const { container } = initRenderer();

			expect(truncationWrapper(container)).toHaveClass('ak-renderer-wrapper');

			await expect(document.body).toBeAccessible();
		});

		it('should truncate and adjust fade out if fadeoutHeight prop is defined', async () => {
			const { container } = initRenderer(initialDoc, {
				truncated: true,
				maxHeight: 100,
				fadeOutHeight: 50,
			});

			expect(truncationWrapper(container)).toHaveStyle({ maxHeight: '100px' });
			expect(fadeStartsAt(container)).toEqual('50px');

			await expect(document.body).toBeAccessible();
		});
	});

	describe('Analytics', () => {
		let client: AnalyticsWebClient;

		const initRendererWithAnalytics = (props: Partial<RendererProps> = {}) =>
			render(
				<FabricAnalyticsListeners client={client}>
					{/* eslint-disable-next-line react/jsx-props-no-spreading */}
					<Renderer document={initialDoc} {...props} />
				</FabricAnalyticsListeners>,
			);

		beforeEach(() => {
			client = analyticsClient();
			jest.useFakeTimers();
			jest.spyOn(window, 'requestAnimationFrame').mockImplementation((fn: Function) => fn());
			// The renderer started/rendered events are sampled, so pin the sample draw.
			jest.spyOn(Math, 'random').mockReturnValue(0.05);
		});

		afterEach(() => {
			(window.requestAnimationFrame as jest.Mock).mockRestore();
			(Math.random as jest.Mock).mockRestore();
			jest.useRealTimers();
		});

		it('should fire heading anchor hit analytics event', async () => {
			const oldHash = window.location.hash;
			window.location.hash = '#test';

			render(
				<FabricAnalyticsListeners client={client}>
					<Renderer document={validDoc} />
				</FabricAnalyticsListeners>,
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

			window.location.hash = oldHash;
		});

		it('should fire analytics event on renderer started', async () => {
			initRendererWithAnalytics();

			expect(client.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'started',
					actionSubject: 'renderer',
					attributes: expect.objectContaining({ platform: 'web' }),
				}),
			);
		});

		const appearances: {
			analyticsAppearance: EDITOR_APPEARANCE_CONTEXT;
			appearance: RendererAppearance;
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
			it(`adds appearance to analytics events for ${appearance.appearance} renderer`, async () => {
				initRendererWithAnalytics({
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
		it('should render the custom table component', async () => {
			const { container } = initRenderer(tableLayout, { nodeComponents: { table } });

			expect(container.querySelectorAll('table.custom-component')).toHaveLength(12);

			await expect(document.body).toBeAccessible();
		});
		it('should render default tables', async () => {
			const { container } = initRenderer(tableLayout);

			expect(container.querySelectorAll('table.custom-component')).toHaveLength(0);
			expect(container.querySelectorAll('table')).toHaveLength(12);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('Extension Handlers', () => {
		// IMPORTANT: This test is needed to avoid SSR pages with extensions breaking. This test should only be changed when the
		// ReactSerializer has been update to be more targetted in it updates.
		it('serializer passed to the renderDocument should have changed', async () => {
			const renderMock = jest.fn();
			const WrappedRenderer = (props: any) => {
				renderMock();
				return <Renderer {...props} />;
			};
			const { rerender } = render(<WrappedRenderer document={initialDoc} />);
			const renderDocumentSpy = jest.spyOn(renderDocumentModule, 'renderDocument');

			rerender(<WrappedRenderer document={initialDoc} extensionHandlers={{}} />);
			rerender(<WrappedRenderer document={initialDoc} extensionHandlers={{}} />);

			expect(renderMock).toHaveBeenCalledTimes(3);
			expect(renderDocumentSpy).toHaveBeenCalledTimes(2);

			// IMPORTANT: 2 renders have occured both times being passed 2 different extension handler objects
			// This means the serializer passed to the renderDocument should have changed and NOT be the same serialzer instance
			// Which was passed the first time.
			// This is due to a HOT created in an attempt to reduce re-renders, which broken dynamic extensions on SSR pages
			// PIR Action - https://product-fabric.atlassian.net/browse/ED-19393
			// https://product-fabric.atlassian.net/wiki/spaces/E/pages/3656254243/PIR-15961+HOT-104596+-+Macros+are+not+loaded+on+SSR+enabled+views
			expect(renderDocumentSpy.mock.calls[0][1]).not.toEqual(renderDocumentSpy.mock.calls[1][1]);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('ExtensionHandlers', () => {
		beforeEach(() => {
			jest.clearAllMocks();
			jest.resetAllMocks();
		});
		it('should not re-render when extensionHandlers has not change', async () => {
			const renderMock = jest.fn();
			const WrappedRenderer = (props: any) => {
				renderMock();
				return <Renderer {...props} />;
			};
			const { rerender } = render(<WrappedRenderer document={initialDoc} />);
			const renderDocumentSpy = jest.spyOn(renderDocumentModule, 'renderDocument');

			const emptyExtensionHandlers: ExtensionHandlers = {};
			rerender(
				<WrappedRenderer document={initialDoc} extensionHandlers={emptyExtensionHandlers} />,
			);
			rerender(
				<WrappedRenderer document={initialDoc} extensionHandlers={emptyExtensionHandlers} />,
			);

			expect(renderMock).toHaveBeenCalledTimes(3); // Initial render + 2 updates, each rerender causes an update
			expect(renderDocumentSpy).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});
	});
});
