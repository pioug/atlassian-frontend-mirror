import { type JsonLd } from '@atlaskit/json-ld-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { IconType, SmartLinkStatus } from '../../../constants';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../../../extractors/constants';
import { messages } from '../../../messages';
import { getContextByStatus, getRetryOptions } from '../utils';

describe('getContextByStatus', () => {
	const url = 'some-url';

	it('return context for Pending status', () => {
		const context = getContextByStatus({
			url,
			status: SmartLinkStatus.Pending,
		});

		expect(context).toEqual(
			expect.objectContaining({ linkTitle: { text: url, onClick: undefined, url }, url }),
		);
	});

	it('return context for Resolving status', () => {
		const context = getContextByStatus({
			url,
			status: SmartLinkStatus.Resolving,
		});

		expect(context).toEqual(
			expect.objectContaining({ linkTitle: { text: url, onClick: undefined, url }, url }),
		);
	});

	ffTest.both('platform_navx_smart_link_icon_label_a11y', '', () => {
		it('return context for Resolved status', () => {
			const context = getContextByStatus({
				url,
				status: SmartLinkStatus.Resolved,
				response: {
					meta: {
						auth: [],
						definitionId: 'confluence-object-provider',
						visibility: 'restricted',
						access: 'granted',
						resourceType: 'page',
						key: 'confluence-object-provider',
					},
					data: {
						'@context': {
							'@vocab': 'https://www.w3.org/ns/activitystreams#',
							atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
							schema: 'http://schema.org/',
						},
						generator: {
							'@type': 'Application',
							'@id': 'https://www.atlassian.com/#Confluence',
							name: 'Confluence',
						},
						'@type': ['Document', 'schema:TextDigitalDocument'],
						url: 'https://confluence-url/wiki/spaces/space-id/pages/page-id',
						name: 'Everything you need to know about ShipIt53!',
						summary: 'ShipIt 53 is on 9 Dec 2021 and 10 Dec 2021!',
					},
				},
			});
			expect(context).toEqual(
				expect.objectContaining({
					actions: {
						CopyLinkAction: {
							invokeAction: {
								actionFn: expect.any(Function),
								actionSubjectId: 'copyLink',
								actionType: 'CopyLinkAction',
								definitionId: 'confluence-object-provider',
								display: undefined,
								extensionKey: 'confluence-object-provider',
								id: undefined,
								resourceType: 'page',
							},
						},
						DownloadAction: undefined,
						FollowAction: undefined,
						PreviewAction: undefined,
						AutomationAction: undefined,
						AISummaryAction: undefined,
						ViewRelatedLinksAction: undefined,
					},
					linkIcon: {
						icon: 'FileType:Document',
						...(fg('platform_navx_smart_link_icon_label_a11y')
							? { label: 'document' }
							: { label: 'Everything you need to know about ShipIt53!' }),
						render: undefined,
					},
					provider: { icon: 'Provider:Confluence', label: 'Confluence' },
					snippet: 'ShipIt 53 is on 9 Dec 2021 and 10 Dec 2021!',
					linkTitle: expect.objectContaining({
						text: 'Everything you need to know about ShipIt53!',
					}),
					url: 'https://confluence-url/wiki/spaces/space-id/pages/page-id',
					type: ['schema:TextDigitalDocument', 'Document'],
					meta: expect.objectContaining({
						resourceType: 'page',
					}),
				}),
			);
		});
	});

	it('return context for Unauthorized status', () => {
		const context = getContextByStatus({
			url,
			status: SmartLinkStatus.Unauthorized,
		});

		expect(context).toEqual(
			expect.objectContaining({
				linkIcon: { icon: IconType.Forbidden },
				linkTitle: { text: url, onClick: undefined, url },
				url,
			}),
		);
	});

	it('return context for Forbidden status', () => {
		const context = getContextByStatus({
			url,
			status: SmartLinkStatus.Forbidden,
		});

		expect(context).toEqual(
			expect.objectContaining({
				linkIcon: { icon: IconType.Forbidden },
				linkTitle: { text: url, onClick: undefined, url },
				url,
			}),
		);
	});

	it('return context for NotFound status', () => {
		const context = getContextByStatus({
			url,
			status: SmartLinkStatus.NotFound,
		});

		expect(context).toEqual(
			expect.objectContaining({
				linkIcon: { icon: IconType.Error },
				linkTitle: { text: url, onClick: undefined, url },
				url,
			}),
		);
	});

	it('return context for Errored status', () => {
		const context = getContextByStatus({
			url,
			status: SmartLinkStatus.Errored,
		});

		expect(context).toEqual(
			expect.objectContaining({
				linkIcon: { icon: IconType.Default },
				linkTitle: { text: url, onClick: undefined, url },
				url,
			}),
		);
	});

	it('return context for Fallback status', () => {
		const context = getContextByStatus({
			url,
			status: SmartLinkStatus.Fallback,
		});

		expect(context).toEqual(
			expect.objectContaining({
				linkIcon: { icon: IconType.Default },
				linkTitle: { text: url, onClick: undefined, url },
				url,
			}),
		);
	});

	/**
	 * The `platform_sl_google_rebrand` gate controls which provider extractor is used
	 * for non-resolved statuses (Unauthorized, Forbidden, NotFound, Errored, Fallback).
	 *
	 * For known providers (Confluence, Jira), both extractors return the same IconType-based
	 * descriptor — the gate has no visible difference for these.
	 *
	 * For third-party providers, the gate matters:
	 *   - ON:  uses `extractProvider` → returns `{ label, url }` only when providerName is truthy
	 *   - OFF: uses `extractSmartLinkProviderIcon` → returns `{ label, url }` via extractUrlIcon
	 */
	ffTest.both('platform_sl_google_rebrand', 'provider field in error statuses', () => {
		const makeResponse = (generatorId: string, name: string, iconUrl: string) =>
			({
				meta: { access: 'forbidden' as const, visibility: 'restricted' as const },
				data: {
					'@context': {
						'@vocab': 'https://www.w3.org/ns/activitystreams#',
						atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
						schema: 'http://schema.org/',
					},
					'@type': 'Document',
					url,
					generator: {
						'@type': 'Application',
						'@id': generatorId,
						name,
						icon: { '@type': 'Image', url: iconUrl },
					},
				},
			}) as unknown as JsonLd.Response;

		it.each([
			[SmartLinkStatus.Unauthorized],
			[SmartLinkStatus.Forbidden],
			[SmartLinkStatus.NotFound],
			[SmartLinkStatus.Errored],
			[SmartLinkStatus.Fallback],
		])('returns Confluence icon type provider for both gate states — status: %s', (status) => {
			const response = makeResponse(
				CONFLUENCE_GENERATOR_ID,
				'Confluence',
				'https://confluence-icon.com/icon.png',
			);
			const context = getContextByStatus({ url, status, response });

			// Both extractProvider (gate ON) and extractSmartLinkProviderIcon (gate OFF)
			// return the same IconType-based descriptor for Confluence
			expect(context?.provider).toEqual({
				icon: IconType.Confluence,
				label: 'Confluence',
			});
		});

		it.each([
			[SmartLinkStatus.Unauthorized],
			[SmartLinkStatus.Forbidden],
			[SmartLinkStatus.NotFound],
			[SmartLinkStatus.Errored],
			[SmartLinkStatus.Fallback],
		])('returns Jira icon type provider for both gate states — status: %s', (status) => {
			const response = makeResponse(JIRA_GENERATOR_ID, 'Jira', 'https://jira-icon.com/icon.png');
			const context = getContextByStatus({ url, status, response });

			// Both extractProvider (gate ON) and extractSmartLinkProviderIcon (gate OFF)
			// return the same IconType-based descriptor for Jira
			expect(context?.provider).toEqual({
				icon: IconType.Jira,
				label: 'Jira',
			});
		});

		it('returns url-based provider for third-party when gate is OFF, label+url when ON', () => {
			const thirdPartyIconUrl = 'https://figma-icon.com/icon.png';
			const response = makeResponse('https://figma.com', 'Figma', thirdPartyIconUrl);

			const context = getContextByStatus({
				url,
				status: SmartLinkStatus.Unauthorized,
				response,
			});

			// Both gate states return { label, url } for third-party providers
			expect(context?.provider).toEqual({
				label: 'Figma',
				url: thirdPartyIconUrl,
			});
		});

		it('returns undefined provider when response has no generator', () => {
			const responseWithNoGenerator = {
				meta: { access: 'forbidden' as const, visibility: 'restricted' as const },
				data: { '@type': 'Document', url },
			} as unknown as JsonLd.Response;

			const context = getContextByStatus({
				url,
				status: SmartLinkStatus.Forbidden,
				response: responseWithNoGenerator,
			});

			expect(context?.provider).toBeUndefined();
		});
	});
});

describe('getRetryOptions', () => {
	const url = 'some-url';

	describe('Forbidden status', () => {
		const response = (accessType?: string) =>
			({
				meta: {
					access: 'forbidden',
					visibility: 'restricted',
					requestAccess: { accessType },
				},
			}) as unknown as JsonLd.Response;

		it('return default retry option', () => {
			const retry = getRetryOptions(url, SmartLinkStatus.Forbidden, response());

			expect(retry).toEqual(
				expect.objectContaining({
					descriptor: messages.restricted_link,
				}),
			);
		});

		it('return retry option for DIRECT_ACCESS', () => {
			const retry = getRetryOptions(url, SmartLinkStatus.Forbidden, response('DIRECT_ACCESS'));

			expect(retry).toEqual(
				expect.objectContaining({
					descriptor: fg('confluence-issue-terminology-refresh')
						? messages.join_to_viewIssueTermRefresh
						: messages.join_to_view,
					onClick: expect.any(Function),
				}),
			);
		});

		it('return retry option for REQUEST_ACCESS', () => {
			const retry = getRetryOptions(url, SmartLinkStatus.Forbidden, response('REQUEST_ACCESS'));

			expect(retry).toEqual(
				expect.objectContaining({
					descriptor: fg('confluence-issue-terminology-refresh')
						? messages.request_access_to_viewIssueTermRefresh
						: messages.request_access_to_view,
					onClick: expect.any(Function),
				}),
			);
		});

		it('return retry option for PENDING_REQUEST_EXISTS', () => {
			const retry = getRetryOptions(
				url,
				SmartLinkStatus.Forbidden,
				response('PENDING_REQUEST_EXISTS'),
			);

			expect(retry).toEqual(expect.objectContaining({ descriptor: messages.pending_request }));
		});

		it('return retry option for FORBIDDEN', () => {
			const retry = getRetryOptions(url, SmartLinkStatus.Forbidden, response('FORBIDDEN'));

			expect(retry).toEqual(expect.objectContaining({ descriptor: messages.forbidden_access }));
		});

		it('return retry option for DENIED_REQUEST_EXISTS', () => {
			const retry = getRetryOptions(
				url,
				SmartLinkStatus.Forbidden,
				response('DENIED_REQUEST_EXISTS'),
			);

			expect(retry).toEqual(expect.objectContaining({ descriptor: messages.request_denied }));
		});
	});

	it('returns retry option for Unauthorized status', () => {
		const retry = getRetryOptions(url, SmartLinkStatus.Unauthorized, undefined, () => {});

		expect(retry).toEqual(
			expect.objectContaining({
				descriptor: messages.connect_link_account_card_name,
				onClick: expect.any(Function),
			}),
		);
	});

	it('does not return retry option for Unauthorized status when onAuthorize is not defined', () => {
		const retry = getRetryOptions(url, SmartLinkStatus.Unauthorized);

		expect(retry).toBeUndefined();
	});

	it('returns retry option for NotFound status', () => {
		const retry = getRetryOptions(url, SmartLinkStatus.NotFound);

		expect(retry).toEqual(expect.objectContaining({ descriptor: messages.cannot_find_link }));
	});
});
