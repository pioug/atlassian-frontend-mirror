import React from 'react';
import type { RichMediaLayout } from '@atlaskit/adf-schema';
import { WidthContext } from '@atlaskit/editor-common/ui';
import '@atlaskit/link-test-helpers/jest';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { RendererAppearance } from '@atlaskit/renderer';
import { Pressable } from '@atlaskit/primitives/compiled';

import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { Card } from '@atlaskit/smart-card';
import { render } from '@testing-library/react';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import EmbedCard from '../../../../react/nodes/embedCard';
import { getCardClickHandler } from '../../../../react/utils/getCardClickHandler';

jest.mock('@atlaskit/smart-card', () => {
	const originalModule = jest.requireActual('@atlaskit/smart-card');
	return {
		...originalModule,
		Card: jest.fn(() => <div data-testid="smart-card" />),
	};
});

jest.mock('@atlaskit/smart-card/ssr', () => ({
	CardSSR: jest.fn(() => <div data-testid="smart-card-ssr" />),
}));

jest.mock('@atlaskit/tmp-editor-statsig/experiments', () => ({
	// The width matrix verifies embed MediaSingle sizing. Keep the responsive
	// preview-panel wrapper disabled so narrow widths do not intentionally render
	// as block cards and remove the MediaSingle container under assertion.
	editorExperiment: () => false,
}));

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - React/Nodes/EmbedCard', () => {
	const url =
		'https://pug.jira-dev.com/wiki/spaces/CE/blog/2017/08/18/3105751050/A+better+REST+API+for+Confluence+Cloud+via+Swagger';

	it('should call consumer onClick with destinationUrl from Card when provided', () => {
		passGate('platform_smartlink_xpc_url_wrapping');
		const mockedOnClick = jest.fn();
		const mockedEvent = { target: {} } as unknown as React.MouseEvent<HTMLElement>;

		// Test getCardClickHandler directly — the Card mock calls onClick(e) without the
		// second argument, so we test the closure in isolation to verify the destinationUrl
		// extraction logic without the mock Card interfering.
		const onCardClick = getCardClickHandler({ smartCard: { onClick: mockedOnClick } }, url);

		// Card/CardSSR now calls onClick(e, { destinationUrl }) — simulate that
		onCardClick!(mockedEvent, {
			destinationUrl: 'https://resolved.com',
			url: 'https://original.com',
		});

		// Consumer (e.g. Confluence router) receives the resolved url, not the ADF url
		expect(mockedOnClick).toHaveBeenCalledWith(mockedEvent, 'https://resolved.com');
	});

	it('should fall back to ADF url when Card onClick fires with no destinationUrl', () => {
		passGate('platform_smartlink_xpc_url_wrapping');
		const mockedOnClick = jest.fn();
		const mockedEvent = { target: {} } as unknown as React.MouseEvent<HTMLElement>;

		const onCardClick = getCardClickHandler({ smartCard: { onClick: mockedOnClick } }, url);

		// Card fires onClick with empty meta (no destinationUrl)
		// @ts-ignore Ignore for testing purpose
		onCardClick!(mockedEvent, {});

		// Falls back to the ADF node's url when destinationUrl is absent
		expect(mockedOnClick).toHaveBeenCalledWith(mockedEvent, url);
	});

	it('should render Card with frameStyle if provided as SmartLinks prop', () => {
		render(
			<Provider client={new Client('staging')}>
				<EmbedCard url={url} layout={'full-width'} smartLinks={{ frameStyle: 'hide' }} />
			</Provider>,
		);
		expect(Card).toBeCalledWith(
			expect.objectContaining({
				frameStyle: 'hide',
				appearance: 'embed',
			}),
			expect.anything(),
		);
	});

	describe('width', () => {
		const mediaSingleSelector = '.mediaSingleView-content-wrap';

		const mountEmbedCard = (
			documentWidth: number = 0,
			props?: Partial<React.ComponentProps<typeof EmbedCard>>,
		) =>
			render(
				<Provider client={new Client('staging')}>
					<WidthContext.Provider value={{ width: documentWidth, breakpoint: 'S' }}>
						<EmbedCard layout="full-width" url={url} {...props} />
					</WidthContext.Provider>
				</Provider>,
			);

		const runTest = (
			documentWidth: number,
			rendererAppearance: RendererAppearance,
			layout: RichMediaLayout,
			expectedWidth: string,
			isInsideOfInlineExtension = false,
		) => {
			it(`should set container width to ${expectedWidth}`, () => {
				const { baseElement } = mountEmbedCard(documentWidth, {
					layout,
					rendererAppearance,
					isInsideOfInlineExtension,
				});

				expect(baseElement.querySelector(mediaSingleSelector)).toHaveStyleDeclaration(
					'width',
					expectedWidth,
				);
			});
		};

		const runScenarios = (
			documentWidth: number,
			scenarios: { [key: string]: string },
			isInsideOfInlineExtension?: boolean,
		) => {
			describe(`when document width is ${documentWidth}`, () => {
				describe.each([['comment'], ['full-page'], ['full-width'], ['mobile']])(
					'with renderer appearance %s',
					(rendererAppearance: string) => {
						describe.each(Object.entries(scenarios))(
							'with layout %s',
							(layout: string, expectedWidth: string) => {
								runTest(
									documentWidth,
									rendererAppearance as RendererAppearance,
									layout as RichMediaLayout,
									expectedWidth,
									isInsideOfInlineExtension,
								);
							},
						);
					},
				);
			});
		};

		runScenarios(2000, { 'full-width': '1800px', wide: '1010px' });
		runScenarios(1000, { 'full-width': '904px', wide: '904px' });
		runScenarios(600, { 'full-width': '504px', wide: '100%' });
		runScenarios(200, { 'full-width': '104px', wide: '100%' });

		// when embedcard is rendered inside of inline extension
		runScenarios(2000, { 'full-width': '1800px', wide: '1010px' });
		runScenarios(1000, { 'full-width': '904px', wide: '904px' });
		runScenarios(600, { 'full-width': '504px', wide: '600px' }, true);
		runScenarios(200, { 'full-width': '104px', wide: '200px' }, true);

		describe('with ssr', () => {
			const mountEmbedCardSSR = (rendererAppearance: RendererAppearance = 'full-width') =>
				mountEmbedCard(0, {
					rendererAppearance,
					smartLinks: { ssr: true },
				});

			it(`should set container width to editor full layout width on renderer appearance full-width`, () => {
				const { baseElement } = mountEmbedCardSSR();

				expect(baseElement.querySelector(mediaSingleSelector)).toHaveStyleDeclaration(
					'width',
					'1704px',
				);
			});

			it(`should set container width to editor default layout width on renderer appearance that is not full-width`, () => {
				const { baseElement } = mountEmbedCardSSR('full-page');

				expect(baseElement.querySelector(mediaSingleSelector)).toHaveStyleDeclaration(
					'width',
					'664px',
				);
			});

			describe('when isSSR is true', () => {
				const BASE_ENV = process.env;
				const mountEmbedCardSSR = (rendererAppearance: RendererAppearance = 'full-width') =>
					mountEmbedCard(0, {
						rendererAppearance,
						smartLinks: { ssr: true },
						layout: 'center',
					});
				beforeEach(() => {
					process.env = {
						...process.env,
						REACT_SSR: '1',
					};
				});

				afterEach(() => {
					process.env = BASE_ENV;
				});

				it('should media container has correct max width', () => {
					// this test is to ensure the embed card media container has correct max-width applied
					// HOT-117393 https://ops.internal.atlassian.com/jira/browse/HOT-117393?src=confmacro
					const { baseElement } = mountEmbedCardSSR();
					const mediaSingleElement = baseElement.querySelector(mediaSingleSelector);
					expect(mediaSingleElement).toHaveAttribute('data-width-type', 'percentage');
					expect(mediaSingleElement).toHaveStyleDeclaration(
						'max-width',
						'var(--ak-editor-max-container-width)',
					);
				});
			});
		});
	});
});

describe('Renderer - React/Nodes/EmbedCard - CompetitorPrompt', () => {
	const MockCompetitorPrompt = jest.fn(() => (
		<Pressable role="button" aria-label="competitor prompt">
			Prompt
		</Pressable>
	));

	beforeEach(() => {
		MockCompetitorPrompt.mockClear();
	});

	it('should pass through CompetitorPrompt compeont when provided', () => {
		render(
			<Provider client={new Client('staging')}>
				<EmbedCard
					url={'test.com'}
					layout={'full-width'}
					smartLinks={{
						CompetitorPrompt: MockCompetitorPrompt,
					}}
				/>
			</Provider>,
		);

		expect(Card).toHaveBeenCalledWith(
			expect.objectContaining({
				CompetitorPrompt: MockCompetitorPrompt,
				url: 'test.com',
			}),
			expect.anything(),
		);
	});
});
