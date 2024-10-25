import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { type JsonLd } from 'json-ld-types';
import { IntlProvider } from 'react-intl-next';
import { DiProvider, injectable } from 'react-magnetic-di';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { AnalyticsContext } from '@atlaskit/analytics-next';


import {
	AsanaTask,
	AtlasProject,
	JiraIssue,
} from '../../../../../../../examples-helpers/_jsonLDExamples';
import useRelatedUrls, {
	type RelatedUrlsResponse,
} from '../../../../../../state/hooks/use-related-urls';
import RelatedUrlsBlock from '../index';

const mockGetRelatedUrlsResponseDefault: RelatedUrlsResponse = {
	resolvedResults: [AsanaTask, AtlasProject, JiraIssue] as JsonLd.Response[],
};

const mockGetRelatedUrls = jest.fn<Promise<RelatedUrlsResponse>, any[]>();

const mockuseRelatedUrls = () => mockGetRelatedUrls;

const injectableUseRelatedUrls = injectable(useRelatedUrls, mockuseRelatedUrls);

describe('RelatedUrlsBlock', () => {
	const rootTestId = 'smart-block-related-urls';
	const resolvedViewTestId = `${rootTestId}-resolved-view`;
	const eventCommonAttributes = {
		canBeDatasource: false,
		destinationCategory: 'object',
		destinationContainerId: '10004',
		destinationObjectId: '10014',
		destinationObjectType: 'issue',
		destinationProduct: 'jira',
		destinationSubproduct: 'core',
		destinationTenantId: '9a257bbc-b7c6-47c8-b1dc-c3db3ac8954b',
		display: 'hoverCardPreview',
		displayCategory: 'smartLink',
		extensionKey: 'jira-object-provider',
		status: 'resolved',
	};
	beforeEach(() => {
		mockGetRelatedUrls.mockReturnValue(
			Promise.resolve<RelatedUrlsResponse>(mockGetRelatedUrlsResponseDefault),
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const renderRelatedUrlsBlock = () => {
		const mockAnalyticsClient: AnalyticsWebClient = {
			sendUIEvent: jest.fn().mockResolvedValue(undefined),
			sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
			sendTrackEvent: jest.fn().mockResolvedValue(undefined),
			sendScreenEvent: jest.fn().mockResolvedValue(undefined),
		};

		const renderResult = render(
			<FabricAnalyticsListeners client={mockAnalyticsClient}>
				<DiProvider use={[injectableUseRelatedUrls]}>
					<IntlProvider locale="en">
						<AnalyticsContext
							data={{
								attributes: eventCommonAttributes,
							}}
						>
							<RelatedUrlsBlock url="https://this-url-has-related-urls.com" />,
						</AnalyticsContext>
					</IntlProvider>
				</DiProvider>
				,
			</FabricAnalyticsListeners>,
		);

		return { ...renderResult, mockAnalyticsClient };
	};

	it('renders related urls list section with title', async () => {
		const { mockAnalyticsClient } = renderRelatedUrlsBlock();
		const relatedUrlsBlock = await screen.findByTestId(`${resolvedViewTestId}-list`);
		expect(relatedUrlsBlock.textContent).toBe('Last mentioned in');
		expect(mockAnalyticsClient.sendTrackEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				action: 'loaded',
				actionSubject: 'relatedLinks',
				attributes: expect.objectContaining({
					relatedLinksCount: 3,
					...eventCommonAttributes,
				}),
			}),
		);
	});

	it('renders related urls section and expands when title clicked', async () => {
		const { mockAnalyticsClient } = renderRelatedUrlsBlock();
		const expandTitle = await screen.findByTestId(`${resolvedViewTestId}-list-expand-title`);
		fireEvent.click(expandTitle);
		const urlItems = await screen.findAllByTestId(`${resolvedViewTestId}-list-item`);
		expect(urlItems.length).toBe(3);

		expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				action: 'viewed',
				actionSubject: 'relatedLinks',
				attributes: expect.objectContaining({
					relatedLinksCount: 3,
					componentHierarchy: 'relatedLinksSection',
					...eventCommonAttributes,
				}),
			}),
		);
	});

	it('renders related url items correctly', async () => {
		const { mockAnalyticsClient } = renderRelatedUrlsBlock();
		const expandTitle = await screen.findByTestId(`${resolvedViewTestId}-list-expand-title`);
		fireEvent.click(expandTitle);

		const icons = await screen.findAllByTestId(`${resolvedViewTestId}-list-item-icon`);
		expect(icons.length).toBe(3);
		const links = await screen.findAllByTestId(`${resolvedViewTestId}-list-item-link`);
		expect(links.length).toBe(3);
		links.forEach((link) => {
			expect(link).toHaveAttribute('href');
		});

		fireEvent.click(links[0]);
		expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				action: 'clicked',
				actionSubject: 'link',
				attributes: expect.objectContaining({
					componentHierarchy: 'relatedLinksSection.relatedLink',
				}),
			}),
		);
	});

	it('renders url items with correct href value', async () => {
		const resolvedResults = [
			{
				data: {
					url: 'url-1',
					'@context': {
						'@vocab': 'https://www.w3.org/ns/activitystreams#',
						atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
						schema: 'http://schema.org/',
					},
					'@type': 'Document',
					name: 'title 1',
				},
				meta: { access: 'granted', visibility: 'public' },
			},
			{
				data: {
					url: 'url-2',
					'@context': {
						'@vocab': 'https://www.w3.org/ns/activitystreams#',
						atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
						schema: 'http://schema.org/',
					},
					'@type': 'Document',
					name: 'title 2',
				},
				meta: { access: 'granted', visibility: 'public' },
			},
		];
		mockGetRelatedUrls.mockReturnValueOnce(
			Promise.resolve({
				resolvedResults: resolvedResults as RelatedUrlsResponse['resolvedResults'],
			}),
		);
		renderRelatedUrlsBlock();
		const expandTitle = await screen.findByTestId(`${resolvedViewTestId}-list-expand-title`);
		fireEvent.click(expandTitle);

		const links = await screen.findAllByTestId(`${resolvedViewTestId}-list-item-link`);
		links.forEach((link, idx) => {
			expect(link.getAttribute('href')).toEqual(resolvedResults[idx].data.url);
			expect(link.textContent).toEqual(resolvedResults[idx].data.name);
		});
	});

	it('renders empty message', async () => {
		mockGetRelatedUrls.mockReturnValueOnce(
			Promise.resolve({
				resolvedResults: [],
			}),
		);
		renderRelatedUrlsBlock();
		const resolvedView = await screen.findByTestId(resolvedViewTestId);
		expect(resolvedView.textContent).toBe('This link is not mentioned anywhere else.');
	});
});
