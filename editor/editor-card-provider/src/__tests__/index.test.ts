import { ffTest } from '@atlassian/feature-flags-test-utils';

import { type Datasource, type EnvironmentsKeys, type ProductType } from '@atlaskit/linking-common';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import { EditorCardProvider } from '..';
import { type LinkAppearance, type ProviderPattern, type UserPreferences } from '../types';
import { mocks } from './__fixtures__/mocks';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import { isJiraWorkItem } from '../provider';

const mockGetExperimentValue = jest.fn();
FeatureGates.getExperimentValue = mockGetExperimentValue;

type PatternsProviderResponse = {
	providers: Provider[];
	userPreferences?: UserPreferences;
};

type Provider = {
	key: string;
	patterns: ProviderPattern[];
};

const getMockProvidersResponse = ({
	userPreferences,
}: { userPreferences?: UserPreferences } = {}): PatternsProviderResponse => ({
	providers: [
		{
			key: 'google-object-provider',
			patterns: [
				{
					source:
						'^https:\\/\\/docs.google.com\\/(?:spreadsheets|document|presentation)\\/d\\/[^\\\\]+\\/|^https:\\/\\/drive.google.com\\/file\\/d\\/[^\\\\]+\\/|^https:\\/\\/drive.google.com\\/open\\?id=[^&]+|^https:\\/\\/drive.google.com\\/drive\\/u\\/\\d+\\/folders\\/[^&\\?]+|^https:\\/\\/drive.google.com\\/drive\\/folders\\/[^&\\?]+',
				},
			],
		},
		{
			key: 'provider-with-default-view',
			patterns: [
				{
					source: '^https:\\/\\/site-with-default-view.com\\/.*?/?$',
					defaultView: 'embed',
				},
			],
		},
		{
			key: 'jira-object-provider',
			patterns: [
				{
					source: '^https:\\/\\/.*?\\.jira-dev\\.com\\/browse\\/([a-zA-Z0-9]+-\\d+)#?.*?\\/?$',
				},
				{
					source:
						'^https:\\/\\/.*?\\.jira-dev\\.com\\/jira\\/software\\/(c\\/)?projects\\/([^\\/]+?)\\/(list|issues)\\/?',
				},
				{
					source:
						'^https:\\/\\/.*?\\.jira-dev\\.com\\/jira\\/software\\/(c\\/)?projects\\/([^\\/]+?)\\/boards\\/(\\d+)\\/(timeline|roadmap)\\/?',
				},
				{
					source:
						'^https:\\/\\/.*?\\.jira-dev\\.com\\/jira\\/core\\/projects\\/(?<resourceId>\\w+)\\/(timeline|calendar|list|board|issues|summary)\\/?',
				},
				{
					source:
						'^https:\\/\\/.*?\\.jira-dev\\.com\\/jira\\/core\\/projects\\/(?<resourceId>\\w+)\\/form\\/(?<formId>\\w+)\\/?',
				},
				{
					source:
						'^https:\\/\\/[^/]+\\.jira-dev\\.com\\/jira\\/(core|software(\\/c)?|servicedesk)\\/projects\\/(\\w+)\\/forms\\/form\\/direct\\/\\d+\\/\\d+.*$',
				},
			],
		},
		{
			key: 'slack-object-provider',
			patterns: [
				{
					source:
						'^https:\\/\\/.+?\\.slack\\.com\\/archives\\/[CG][A-Z0-9][^/]+\\/?$|^https:\\/\\/app\\.slack\\.com\\/client\\/T[A-Z0-9]+\\/[CG][A-Z0-9][^/]+\\/?$|^https:\\/\\/.+?\\.slack\\.com\\/archives\\/[CG][A-Z0-9][^/]+\\/p[0-9]+(\\?.*)?$',
				},
			],
		},
		{
			key: 'polaris-object-provider',
			patterns: [
				{
					source:
						'^https:\\/\\/.*?\\/jira\\/polaris\\/projects\\/[^\\/]+?\\/ideas\\/view\\/\\d+$|^https:\\/\\/.*?\\/secure\\/JiraProductDiscoveryAnonymous\\.jspa\\?hash=\\w+|^https:\\/\\/.*?\\/jira\\/polaris\\/share\\/\\w+',
				},
			],
		},
		{
			key: 'jpd-views-service-object-provider',
			patterns: [
				{
					source:
						'^https:\\/\\/.*?\\/jira\\/polaris\\/share\\/\\w+|^https:\\/\\/.*?\\/jira\\/discovery\\/share\\/views\\/[\\w-]+(\\?selectedIssue=[\\w-]+&issueViewLayout=sidebar&issueViewSection=[\\w-]+)?$',
				},
			],
		},
		{
			key: 'rovo-object-provider',
			patterns: [
				{
					source: '^https:\\/\\/.*?\\/people\\/agent\\/.*$',
				},
			],
		},
		{
			key: 'confluence-object-provider',
			patterns: [
				{
					source:
						'^https:\\/\\/[^/]+\\.jira-dev\\.com\\/wiki\\/spaces\\/([^\\/]+)\\/calendars\\/([a-zA-Z0-9-]+)',
				},
			],
		},
	],
	...(userPreferences
		? {
				userPreferences,
			}
		: {}),
});

const expectedInlineAdf = (url: string) => ({
	type: 'inlineCard',
	attrs: {
		url,
	},
});

const expectedEmbedAdf = (url: string) => ({
	type: 'embedCard',
	attrs: {
		url,
		layout: 'wide',
	},
});

const expectedBlockAdf = (url: string) => ({
	type: 'blockCard',
	attrs: {
		url,
	},
});

const expectedDatasourceAdf = (datasource: Datasource, url?: string) => ({
	type: 'blockCard',
	attrs: {
		datasource,
		url,
	},
});

describe('providers > editor', () => {
	let mockFetch: jest.Mock;

	// This ensures that @atlaskit/link-provider's client cache gets cleared
	const setupEditorCardProvider = (
		envKey?: EnvironmentsKeys,
		baseUrlOverride?: string,
		product?: ProductType,
	) => {
		jest.isolateModules(() => {
			require('..').EditorCardProvider;
		});

		const IsolatedEditorCardProvider: typeof EditorCardProvider = require('..').EditorCardProvider;
		return new IsolatedEditorCardProvider(envKey, baseUrlOverride, product);
	};

	beforeEach(() => {
		// Since we use module level caching,
		// we need to clear it up for clean test run
		jest.resetModules();
		mockFetch = jest.fn();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(global as any).fetch = mockFetch;
		setBooleanFeatureFlagResolver(
			(flag) => flag === 'smartlink_jira_software_form' || flag === 'plan_smart_link_base_url',
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		delete (global as any).fetch;
	});

	it('should use baseUrl defined by provided environment for /providers call', async () => {
		const provider = setupEditorCardProvider('stg');
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const url = 'https://drive.google.com/file/d/123/view?usp=sharing';
		await provider.resolve(url, 'inline', false);
		expect(mockFetch).toHaveBeenCalledWith(
			// eslint-disable-next-line require-unicode-regexp
			expect.stringMatching(/.*?pug\.jira-dev.*?\/providers/),
			expect.objectContaining({
				method: 'post',
				headers: expect.objectContaining({
					Origin: 'https://pug.jira-dev.com/gateway/api',
				}),
			}),
		);
	});

	it('should use baseUrl defined by provided override for /providers call', async () => {
		const provider = setupEditorCardProvider('stg', 'https://trellis.coffee/gateway/api');
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const url = 'https://drive.google.com/file/d/123/view?usp=sharing';
		await provider.resolve(url, 'inline', false);
		expect(mockFetch).toHaveBeenCalledWith(
			'https://trellis.coffee/gateway/api/object-resolver/providers',
			expect.objectContaining({
				method: 'post',
				headers: expect.objectContaining({
					Origin: 'https://trellis.coffee/gateway/api',
				}),
			}),
		);
	});

	it('should use baseUrl defined by provided environment for /resolve/batch call', async () => {
		const provider = setupEditorCardProvider('stg');
		// Mocking call to /providers
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		// Mocking call to /resolve/batch
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.success, status: 200 }],
			ok: true,
		});
		const url = 'https://site-without-pattern.com';
		await provider.findPattern(url);
		expect(mockFetch).toHaveBeenCalledWith(
			// eslint-disable-next-line require-unicode-regexp
			expect.stringMatching(/.*?pug\.jira-dev.*?\/resolve\/batch/),
			expect.objectContaining({
				body: JSON.stringify([
					{
						resourceUrl: url,
					},
				]),
				method: 'post',
			}),
		);
	});

	it('should use baseUrl defined by provided override for /resolve/batch call', async () => {
		const provider = setupEditorCardProvider('stg', 'https://trellis.coffee/gateway/api');
		// Mocking call to /providers
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		// Mocking call to /resolve/batch
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.success, status: 200 }],
			ok: true,
		});
		const url = 'https://site-without-pattern.com';
		await provider.findPattern(url);
		expect(mockFetch).toHaveBeenCalledWith(
			'https://trellis.coffee/gateway/api/object-resolver/resolve/batch',
			expect.objectContaining({
				body: JSON.stringify([
					{
						resourceUrl: url,
					},
				]),
				method: 'post',
			}),
		);
	});

	it('if product is provided, should forward product value as X-Product header in /resolve/batch call', async () => {
		const provider = setupEditorCardProvider(
			'stg',
			'https://trellis.coffee/gateway/api',
			'CONFLUENCE',
		);

		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.success, status: 200 }],
			ok: true,
		});
		const url = 'https://site-without-pattern.com';

		await provider.findPattern(url);

		expect(mockFetch).toHaveBeenCalledWith(
			'https://trellis.coffee/gateway/api/object-resolver/resolve/batch',
			expect.objectContaining({
				method: 'post',
				headers: expect.objectContaining({
					'X-Product': 'CONFLUENCE',
				}),
			}),
		);
	});

	it('if product is not provided, should not set X-Product header in /resolve/batch call', async () => {
		const provider = setupEditorCardProvider('stg', 'https://trellis.coffee/gateway/api');

		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.success, status: 200 }],
			ok: true,
		});
		const url = 'https://site-without-pattern.com';

		await provider.findPattern(url);

		expect(mockFetch).toHaveBeenCalledWith(
			'https://trellis.coffee/gateway/api/object-resolver/resolve/batch',
			expect.objectContaining({
				method: 'post',
				headers: expect.not.objectContaining({
					'X-Product': expect.anything(),
				}),
			}),
		);
	});

	it('returns inlineCard when calling /providers endpoint', async () => {
		const provider = setupEditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const url = 'https://drive.google.com/file/d/123/view?usp=sharing';
		const adf = await provider.resolve(url, 'inline', false);
		expect(adf).toEqual(expectedInlineAdf(url));
	});

	it('returns blockCard when calling /providers endpoint', async () => {
		const provider = setupEditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const url = 'https://drive.google.com/file/d/123/view?usp=sharing';
		const adf = await provider.resolve(url, 'block', false);
		expect(adf).toEqual(expectedBlockAdf(url));
	});

	it.each<[string, string]>([
		['Slack message', 'https://atlassian.slack.com/archives/C014W1DTRHS/p1614244582005100'],
		[
			'Slack message in thread',
			'https://atlassian.slack.com/archives/C014W1DTRHS/p1614306173007200?thread_ts=1614244582.005100&cid=C014W1DTRHS',
		],
	])('returns inline when %s link inserted, calling /providers endpoint', async (_, url) => {
		const provider = setupEditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const adf = await provider.resolve(url, 'inline', false);
		expect(adf).toEqual(expectedInlineAdf(url));
	});

	it.each<[string, string]>([
		['Giphy Gif', 'https://giphy.com/gifs/happy-kawaii-nice-yCZEmKBKejysx5V2Ya'],
		['Giphy Gif with extension', 'https://media.giphy.com/media/OEv64W2RHusD9BrQ9z/giphy.gif'],
		[
			'Giphy Mp4 video',
			'https://media3.giphy.com/media/tYaV2Xd7SzmARXOWjO/giphy360p.mp4?cid=ecf05e47tqlptrwmtazt5a732xtckc235h1nxhh8l5r8557k&rid=giphy360p.mp4&ct=v',
		],
		[
			'Giphy Clip',
			'https://giphy.com/clips/studiosoriginals-omg-shocked-surprised-2P4BzWM98c2IzSoqN5',
		],
		['Youtube Video', 'https://www.youtube.com/watch?v=Hd0JflMdqyM'],
		['Youtube Video Mobile', 'https://m.youtube.com/watch?v=Hd0JflMdqyM'],
		['Youtube Short', 'https://www.youtube.com/shorts/_RVT1ZM2W9A'],
		['Youtu.be link', 'https://youtu.be/fFGS4zZWGoA'],
		['Youtube.ch link', 'https://www.youtube.ch/watch?v=w7ejDZ8SWv8'],
		['Loom Video share', 'https://www.loom.com:44/share/4e890d2246f945aa9239e1f38c64ec05'],
		['Loom Video embed', 'https://www.loom.com/embed/4e890d2246f945aa9239e1f38c64ec05'],
		[
			'Loom Video w/sid',
			'https://www.loom.com/share/4e890d2246f945aa9239e1f38c64ec05?sid=9a042073-5133-4064-af01-c7b60ab27023',
		],
		[
			'Loom Video human readable section',
			'https://www.loom.com/share/human-readable-text-9b62d620bbea4476bbf2286a6b0c83cf',
		],
		['A whiteboard', 'https://pug.jira-dev.com/wiki/spaces/BT2/whiteboard/452724424706'],
		[
			'A whiteboard with query params',
			'https://pug.jira-dev.com/wiki/spaces/BT2/whiteboard/452724424706?myQueryParam=foo&bar=baz',
		],
		[
			'A database with a user space',
			'https://databases-playground.jira-dev.com/wiki/spaces/~123456789/database/12345',
		],
		[
			'A database with no user space',
			'https://databases-playground.jira-dev.com/wiki/spaces/ABC/database/12345',
		],
		[
			'A database with an entryId query parameter that has a valid UUID',
			'https://pug.jira-dev.com/wiki/spaces/~448762021/database/452927129132?entryId=8fb8c642-803d-59fe-8d1c-066610e860c6',
		],
		[
			'A database with a savedViewId query parameter that has a valid UUID',
			'https://pug.jira-dev.com/wiki/spaces/~448762021/database/452927129132?savedViewId=8fb8c642-803d-59fe-8d1c-066610e860c6',
		],
		[
			'A database with a savedViewId query parameter that is all-entries',
			'https://pug.jira-dev.com/wiki/spaces/~448762021/database/452927129132?savedViewId=all-entries',
		],
		[
			'A database with a savedViewId query parameter that is default',
			'https://pug.jira-dev.com/wiki/spaces/~448762021/database/452927129132?savedViewId=default',
		],
		[
			'A database with an unsavedView query parameter that has a valid UUID',
			'https://pug.jira-dev.com/wiki/spaces/~448762021/database/452927129132?unsavedView=7b7b1118-86b2-427d-ac31-ae09141ab3e6',
		],
		[
			'A database with both a savedViewId and unsavedView query parameter',
			'https://pug.jira-dev.com/wiki/spaces/~448762021/database/452927129132?savedViewId=7318ab9e-6269-4997-9941-5c92f86e5d56&unsavedView=7b7b1118-86b2-427d-ac31-ae09141ab3e6',
		],
		[
			'roadmap embed',
			'https://jdog.jira-dev.com/jira/software/projects/DL39857/boards/3186/roadmap',
		],
		[
			'roadmap embed with query parameter',
			'https://jdog.jira-dev.com/jira/software/projects/DL39857/boards/3186/roadmap?shared=&atlOrigin=eyJpIjoiYmFlNzRlMzAyYjAyNDlkZTgxZDc5ZTIzYmNlZmI5MjAiLCJwIjoiaiJ9',
		],
		[
			'classic roadmap embed',
			'https://jdog.jira-dev.com/jira/software/c/projects/DL39857/boards/3186/roadmap',
		],
		[
			'timeline embed',
			'https://jdog.jira-dev.com/jira/software/projects/DL39857/boards/3186/timeline',
		],
		[
			'timeline embed with query parameter',
			'https://jdog.jira-dev.com/jira/software/projects/DL39857/boards/3186/timeline?shared=&atlOrigin=eyJpIjoiYmFlNzRlMzAyYjAyNDlkZTgxZDc5ZTIzYmNlZmI5MjAiLCJwIjoiaiJ9',
		],
		[
			'classic timeline embed',
			'https://jdog.jira-dev.com/jira/software/c/projects/DL39857/boards/3186/timeline',
		],
		[
			'Polaris view link',
			'https://polaris-v0.jira-dev.com/jira/polaris/projects/CS10/ideas/view/8981',
		],
		[
			'Polaris anonymous share view',
			'https://polaris-v0.jira-dev.com/jira/polaris/share/b2029c50914309acb37699615b1137da5',
		],
		[
			'Polaris anonymous share view fullscreen',
			'https://polaris-v0.jira-dev.com/jira/polaris/share/89cb70599021ac29e227fc49c56782969?fullscreen=true',
		],
		[
			'Polaris anonymous resolved view',
			'https://polaris-v0.jira-dev.com/secure/JiraProductDiscoveryAnonymous.jspa?hash=b2029c50914309acb37699615b1137da5',
		],
		[
			'Polaris published view',
			'https://polaris-v0.jira-dev.com/jira/discovery/share/views/c722b7ce-cd8a-4f0c-838c-7add80ba3277',
		],
		[
			'Polaris published view with idea opened in sidebar',
			'https://polaris-v0.jira-dev.com/jira/discovery/share/views/c722b7ce-cd8a-4f0c-838c-7add80ba3277?selectedIssue=SO-2&issueViewLayout=sidebar&issueViewSection=overview',
		],
		[
			'Jira work management (JWM) timeline view',
			'https://jdog.jira-dev.com/jira/core/projects/NPM5/timeline',
		],
		[
			'Jira work management (JWM) calendar view',
			'https://jdog.jira-dev.com/jira/core/projects/NPM5/calendar',
		],
		[
			'Jira work management (JWM) list view',
			'https://jdog.jira-dev.com/jira/core/projects/NPM5/list',
		],
		[
			'Jira work management (JWM) issue navigator view',
			'https://jdog.jira-dev.com/jira/core/projects/NPM5/issues',
		],
		[
			'Jira work management (JWM) board view',
			'https://jdog.jira-dev.com/jira/core/projects/NPM5/board',
		],
		[
			'Jira work management (JWM) summary view',
			'https://gopi-2.jira-dev.com/jira/core/projects/T2/summary',
		],
		[
			'Jira work management (JWM) form view',
			'https://jdog.jira-dev.com/jira/core/projects/NPM5/form/1',
		],
		[
			'Jira work management (JWM) form view with Query Params',
			'https://jdog.jira-dev.com/jira/core/projects/NPM5/form/1?atlOrigin=eyJpIjoiM2MzNTA5N2FmNzNjNDQxNmFhNDAzNDhhYmIyZTRiNGQiLCJwIjoiaiJ9',
		],
		[
			'ProForma issue forms direct view',
			'https://jdog.jira-dev.com/jira/servicedesk/projects/PROFORMA/forms/form/direct/10/10048',
		],
		[
			'ProForma issue forms direct view with query parameter',
			'https://jdog.jira-dev.com/jira/servicedesk/projects/PROFORMA/forms/form/direct/10/10048?requestTypeId=509',
		],
		['Jira list embed', 'https://jdog.jira-dev.com/jira/software/c/projects/DL39857/list'],
		['Jira Dashboard', 'https://product-fabric.atlassian.net/jira/dashboards/15429'],
		['Jira Dashboard embed', 'https://product-fabric.atlassian.net/jira/dashboards/15429/embed'],
		[
			'Jira Dashboard gadget',
			'https://product-fabric.atlassian.net/jira/dashboards/15429?maximized=26563',
		],
		[
			'Jira Dashboard gadget embed',
			'https://product-fabric.atlassian.net/jira/dashboards/15429/embed?maximized=26563',
		],
		[
			'Jira backlog embed (team managed)',
			'https://pgayee.jira-dev.com/jira/software/projects/T1/boards/2/backlog',
		],
		[
			'Jira backlog embed (company managed)',
			'https://pgayee.jira-dev.com/jira/software/c/projects/T2/boards/3/backlog',
		],
		[
			'Jira backlog embed (team managed) with query params',
			'https://pgayee.jira-dev.com/jira/software/projects/T1/boards/2/backlog?assignee=6334ac9ab2e3c5ad0fa50712',
		],
		[
			'Jira backlog embed (company managed) with query params',
			'https://pgayee.jira-dev.com/jira/software/c/projects/T2/boards/3/backlog?assignee=712020%3A415eb090-5446-408d-b958-82871ce65b6b',
		],
		[
			'Jira board embed (team managed)',
			'https://maguilar-stg.jira-dev.com/jira/software/projects/MT/boards/1',
		],
		[
			'Jira board embed (team managed) with query params',
			'https://maguilar-stg.jira-dev.com/jira/software/projects/MT/boards/1?assignee=712020%3A415eb090-5446-408d-b958-82871ce65b6b%2C6154a4939cdb9300722dff44',
		],
		[
			'Jira board embed (company managed)',
			'https://maguilar-stg.jira-dev.com/jira/software/c/projects/ACMP/boards/2',
		],
		[
			'Jira board embed (company managed) with query params',
			'https://maguilar-stg.jira-dev.com/jira/software/c/projects/ACMP/boards/2?assignee=712020%3A415eb090-5446-408d-b958-82871ce65b6b',
		],
		['Jira plan embed', 'https://hello.atlassian.net/jira/plans/24'],
		['Jira plan timeline embed', 'https://hello.atlassian.net/jira/plans/24/scenarios/24/timeline'],
		['Jira plan summary embed', 'https://hello.atlassian.net/jira/plans/24/scenarios/24/summary'],
		['Jira plan calendar embed', 'https://hello.atlassian.net/jira/plans/24/scenarios/24/calendar'],
		[
			'Jira plan program board embed',
			'https://hello.atlassian.net/jira/plans/24/scenarios/24/program/1',
		],
		[
			'Jira plan dependencies report embed',
			'https://hello.atlassian.net/jira/plans/24/scenarios/24/dependencies',
		],
		[
			'Jira Version embed',
			'https://cdeyoung.jira-dev.com/projects/CT/versions/10000/tab/release-report-all-issues',
		],
		[
			'Rovo agent embed',
			'https://hello.atlassian.net/people/agent/b7e4b64f-25fd-4a5f-b45f-2e607d31571b',
		],
		['Jira Form embed', 'https://hello.jira.atlassian.cloud/jira/software/projects/RAYM/form/4431'],
		[
			'Jira CMP Form embed',
			'https://hello.jira.atlassian.cloud/jira/software/c/projects/TNK/form/4056',
		],
		[
			'Jira Issue Navigator embed',
			'https://jdog.jira-dev.com/jira/software/c/projects/DL39857/issues',
		],
	])(
		'returns embedCard when %s public link is inserted, calling /providers and /resolve/batch endpoint',
		async (_, url) => {
			mockGetExperimentValue.mockReturnValue(true);
			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () => getMockProvidersResponse(),
				ok: true,
			});
			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedEmbedAdf(url));
		},
	);

	it.each<[string, string]>([
		[
			'Domain ending in "giphy"',
			'https://dodgygiphy.com/gifs/happy-kawaii-nice-yCZEmKBKejysx5V2Yaa',
		],
		['Giphy profile', 'https://giphy.com/Ellienka'],
	])(
		'returns inlineCard when %s public link is inserted, calling /providers and /resolve/batch endpoint',
		async (_, url) => {
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () => getMockProvidersResponse(),
				ok: true,
			});
			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		},
	);

	it('returns datasource when jql link inserted, calling /resolve endpoint', async () => {
		const url =
			'https://forge-smart-link-battleground.jira-dev.com/issues/EDJ-3?filter=-4&jql=ORDER%20BY%20assignee%20DESC';
		const provider = setupEditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const mockResolveResponse = {
			json: async () => [{ body: mocks.datasourceSuccess, status: 200 }],
			ok: true,
		};
		mockFetch.mockResolvedValueOnce(mockResolveResponse);
		const datasourceAdfData: Datasource = {
			id: mocks.datasourceSuccess.datasources[0].id,
			parameters: mocks.datasourceSuccess.datasources[0].parameters,
			views: [{ type: 'table' }],
		};
		const adf = await provider.resolve(url, 'inline', false);
		expect(adf).toEqual(expectedDatasourceAdf(datasourceAdfData, url));
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});

	it('returns inlineCard when calling /providers endpoint, with fallback to /resolve', async () => {
		const provider = setupEditorCardProvider();
		// Mocking call to /providers
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		// Mocking call to /resolve/batch
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.success, status: 200 }],
			ok: true,
		});
		const url = 'https://drive.google.com/file/123';
		const adf = await provider.resolve(url, 'inline', false);
		expect(adf).toEqual(expectedInlineAdf(url));
	});

	it('returns undefined when calling /providers endpoint, with fallback to /resolve, not supported', async () => {
		const provider = setupEditorCardProvider();
		// Mocking call to /providers
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		// Mocking call to /resolve/batch
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.notFound, status: 404 }],
			ok: true,
		});

		const url = 'https://drive.google.com/file/123';
		const promise = provider.resolve(url, 'inline', false);
		await expect(promise).rejects.toEqual(undefined);
	});

	it('returns undefined when calling /providers endpoint, with fallback to /resolve, both fail', async () => {
		const provider = setupEditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => {
				throw Error();
			},
		});
		mockFetch.mockResolvedValueOnce({
			json: async () => {
				throw Error();
			},
		});
		const url = 'https://drive.google.com/file/123';
		const promise = provider.resolve(url, 'inline', false);
		await expect(promise).rejects.toEqual(undefined);
	});

	it('calls /providers endpoint only once', async () => {
		const provider = setupEditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		await Promise.all([
			provider.resolve('https://drive.google.com/file/d/123/view', 'inline'),
			provider.resolve('https://drive.google.com/file/d/456/view', 'inline'),
			provider.resolve('https://drive.google.com/file/d/789/view', 'inline'),
		]);
		expect(mockFetch).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining('/providers'),
			expect.any(Object),
		);
	});

	it('calls /providers endpoint again if the first request fails', async () => {
		const mockResolveResponse = {
			json: async () => [{ body: mocks.success, status: 200 }],
			ok: true,
		};
		// Mocking call to /providers (failed)
		mockFetch.mockResolvedValueOnce({
			json: async () => {
				throw Error();
			},
			ok: true,
		});
		// Mocking call to /resolve/batch (success)
		mockFetch.mockResolvedValueOnce(mockResolveResponse);
		// Mocking call to /providers (success)
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		// Mocking call to /resolve/batch (success)
		mockFetch.mockResolvedValueOnce(mockResolveResponse);

		const provider = setupEditorCardProvider();

		// Expected: Pattern not matched, /batch/resolve is called.
		const url1 = 'https://site-without-pattern.com';
		const adf1 = await provider.resolve(url1, 'inline', false);
		expect(adf1).toEqual(expectedInlineAdf(url1));

		// Expected: /providers failed, resolve/batch is called.
		const url2 = 'https://drive.google.com/file/d/123/view?usp=sharing';
		const adf2 = await provider.resolve(url2, 'inline', false);
		expect(adf2).toEqual(expectedInlineAdf(url2));

		// Expected: /provider retried and success, pattern matched.
		const url3 = 'https://drive.google.com/file/d/456/view?usp=sharing';
		const adf3 = await provider.resolve(url3, 'inline', false);
		expect(adf3).toEqual(expectedInlineAdf(url3));

		// Expected: Pattern matched, no request is made.
		const url4 = 'https://drive.google.com/file/d/789/view?usp=sharing';
		const adf4 = await provider.resolve(url4, 'inline', false);
		expect(adf4).toEqual(expectedInlineAdf(url4));

		expect(mockFetch).toHaveBeenCalledTimes(6);
		expect(mockFetch).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining('/providers'),
			expect.any(Object),
		);
		expect(mockFetch).toHaveBeenNthCalledWith(
			2,
			expect.stringContaining('/resolve'),
			expect.any(Object),
		);
		expect(mockFetch).toHaveBeenNthCalledWith(
			3,
			expect.stringContaining('/providers'),
			expect.any(Object),
		);
		expect(mockFetch).toHaveBeenNthCalledWith(
			4,
			expect.stringContaining('/resolve'),
			expect.any(Object),
		);
	});

	it('should return EmbedCard when defaultView specifies it', async () => {
		const provider = setupEditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const url = 'https://site-with-default-view.com/testing';
		const adf = await provider.resolve(url, 'inline', false);
		expect(adf).toEqual(expectedEmbedAdf(url));
	});

	it('should find pattern for a link', async () => {
		const provider = setupEditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const url = 'https://site-with-default-view.com/testing';
		expect(await provider.findPattern(url)).toBe(true);
	});

	it('should not find pattern for a link', async () => {
		const provider = setupEditorCardProvider();
		// Mocking call to /providers
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		// Mocking call to /resolve/batch
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.notFound, status: 404 }],
			ok: true,
		});
		const url = 'https://site-without-pattern.com';
		expect(await provider.findPattern(url)).toBe(false);
	});

	it('should return true when /resolve returns positive results but pattern is not found', async () => {
		const provider = setupEditorCardProvider();
		// Mocking call to /providers
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		// Mocking call to /resolve/batch
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.success, status: 200 }],
			ok: true,
		});
		const url = 'https://site-without-pattern.com';
		expect(await provider.findPattern(url)).toBe(true);
	});

	it('should not call /resolve/batch second time', async () => {
		const provider = setupEditorCardProvider();
		// Mocking call to /providers
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		// Mocking call to /resolve/batch
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.success, status: 200 }],
			ok: true,
		});
		const url = 'https://site-without-pattern.com';
		expect(await provider.findPattern(url)).toBe(true);
		expect(await provider.findPattern(url)).toBe(true);
	});

	describe('with user preferences', () => {
		it('should use throw when default user preferences is url', async () => {
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'url',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const promise = provider.resolve(url, 'inline', false);
			await expect(promise).rejects.toEqual(undefined);
		});

		it('should return default user preference appearance adf', async () => {
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedBlockAdf(url));
		});

		it('should return specific url user preference appearance adf', async () => {
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [
								{
									urlSegment: 'site-with-default-view.com/testing',
									appearance: 'inline',
								},
							],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should throw when specific url user preference appearance is url', async () => {
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [
								{
									urlSegment: 'some-other-path.com',
									appearance: 'embed',
								},
								{
									urlSegment: 'site-with-default-view.com/testing',
									appearance: 'url',
								},
							],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const promise = provider.resolve(url, 'inline', false);
			await expect(promise).rejects.toEqual(undefined);
		});

		it('should return specific url user preference appearance adf when its not first in the map', async () => {
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [
								{
									urlSegment: 'some-other-path.com',
									appearance: 'embed',
								},
								{
									urlSegment: 'site-with-default-view.com/testing',
									appearance: 'inline',
								},
							],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should use user default appearance even for urls we have hardcoded appearance for', async () => {
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url = 'https://jdog.jira-dev.com/jira/core/projects/NPM5/board';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedBlockAdf(url));
		});

		it('should use hardcoded appearance when user has "inline" default appearance (and no pattern matches url)', async () => {
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url = 'https://jdog.jira-dev.com/jira/core/projects/NPM5/board';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedEmbedAdf(url));
		});

		it('should use user appearance over hardcoded one when url matches users pattern', async () => {
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [
								{
									urlSegment: 'jdog.jira-dev.com/jira/core',
									appearance: 'inline',
								},
							],
						},
					}),
				ok: true,
			});

			const url = 'https://jdog.jira-dev.com/jira/core/projects/NPM5/board';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should use providers default appearance if user default appearance is inline (and no pattern matches url)', async () => {
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedEmbedAdf(url));
		});

		it('should use the appearance associated with the preference containing the longest urlSegment that matches the url', async () => {
			const provider = setupEditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [
								{
									urlSegment: 'box.com',
									appearance: 'block',
								},
								{
									urlSegment: 'box.com/s',
									appearance: 'embed',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://app.box.com/s/yyr1vmw55haa09jnuj439amf0w7r5q1b';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedEmbedAdf(url));
		});

		it('should match a urlSegment as full word prior to location of urlSegment', async () => {
			const provider = setupEditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [
								{
									urlSegment: 'box.com',
									appearance: 'block',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://dropbox.com/foo';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should match a urlSegment as full word at the start of the url', async () => {
			const provider = setupEditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [
								{
									urlSegment: 'box.com',
									appearance: 'block',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'http://box.com/foo';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedBlockAdf(url));
		});

		it('should match a urlSegment as full word after the location of urlSegment', async () => {
			const provider = setupEditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [
								{
									urlSegment: 'box.com',
									appearance: 'block',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://box.community/foo';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should match a urlSegment as full word at the end of the url', async () => {
			const provider = setupEditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [
								{
									urlSegment: 'box.com/foo/bar/index.html',
									appearance: 'block',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://box.com/foo/bar/index.html';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedBlockAdf(url));
		});

		it('should match urlSegment to url of subdomain', async () => {
			const provider = setupEditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [
								{
									urlSegment: 'box.com',
									appearance: 'block',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://app.box.com/foo';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedBlockAdf(url));
		});

		it('should escape the url segment', async () => {
			const provider = setupEditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [
								{
									urlSegment: 'box.com',
									appearance: 'block',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			// If the '.' was not escaped it would match any character literally.
			const url = 'https://boxacom/foo';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should match against urlSegment which starts with non-letter character', async () => {
			const provider = setupEditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'url',
							appearances: [
								{
									urlSegment: '.box.com',
									appearance: 'inline',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://app.box.com/foo';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should match against urlSegment which ends with non-letter character', async () => {
			const provider = setupEditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'url',
							appearances: [
								{
									urlSegment: 'wikipedia.org/wiki/Leif_',
									appearance: 'inline',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://en.wikipedia.org/wiki/Leif_Edling';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should match against urlSegment which starts and ends with non-letter character', async () => {
			const provider = setupEditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'url',
							appearances: [
								{
									urlSegment: '.box.com/',
									appearance: 'inline',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://app.box.com/foo';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		describe('With entities', () => {
			it('should return EmbedCard when defaultView specifies it', async () => {
				const provider = new EditorCardProvider();
				mockFetch.mockResolvedValueOnce({
					json: async () =>
						getMockProvidersResponse({
							userPreferences: {
								defaultAppearance: 'embed',
								appearances: [],
							},
						}),
					ok: true,
				});

				// Mocking call to /resolve/batch
				mockFetch.mockResolvedValueOnce({
					json: async () => [{ body: mocks.entityDataSuccess, status: 200 }],
					ok: true,
				});

				const url = 'https://drive.google.com/file/d/123/view?usp=sharing';
				const adf = await provider.resolve(url, 'inline', false);
				expect(adf).toEqual(expectedEmbedAdf(url));
			});
		});
	});

	describe('when consumer calls function without shouldForceAppearance argument defined', () => {
		const allUserPreferencesCombinations = [
			...(['url', 'inline', 'block', 'embed'] as LinkAppearance[]).map<[string, UserPreferences]>(
				(defaultAppearance) => [
					` default appearance = ${defaultAppearance}`,
					{
						defaultAppearance,
						appearances: [],
					} as UserPreferences,
				],
			),
			...(['url', 'inline', 'block', 'embed'] as LinkAppearance[]).map<[string, UserPreferences]>(
				(defaultAppearance) => [
					`specific url appearance = ${defaultAppearance}`,
					{
						defaultAppearance: 'block',
						appearances: [
							{
								urlSegment: 'some-domain.com',
								appearance: 'embed',
							},
						],
					} as UserPreferences,
				],
			),
		];

		it.each<[string, UserPreferences]>(allUserPreferencesCombinations)(
			"should use requested appearance over user's preferred %s",
			async (_, userPreferences) => {
				const provider = setupEditorCardProvider();
				mockFetch.mockResolvedValueOnce({
					json: async () =>
						getMockProvidersResponse({
							userPreferences,
						}),
					ok: true,
				});
				mockFetch.mockResolvedValueOnce({
					json: async () => [{ body: mocks.success, status: 200 }],
					ok: true,
				});

				const url = 'https://docs.google.com/testing/index.html';
				const adf = await provider.resolve(url, 'inline');
				expect(adf).toEqual(expectedInlineAdf(url));
			},
		);

		it("should use requested appearance over provider's appearance", async () => {
			// This means for pre-G released editor we will not be using provider specific appearance
			// If we to do otherwise we would introduce a bug where user switching to URL and back would not get
			// appearance they chose, but instead provider's specific appearance would be used.

			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const adf = await provider.resolve(url, 'inline');
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should use hardcoded appearance over requested appearance', async () => {
			// This means for pre-G released editor we still have a bug,
			// where if user switches to URL first and then back to `inline` for Jira Roadmap link for ex,
			// we will display embed instead. That is an existing bug.

			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [
								{
									urlSegment: 'jdog.jira-dev.com/jira/core',
									appearance: 'block',
								},
							],
						},
					}),
				ok: true,
			});

			const url = 'https://jdog.jira-dev.com/jira/core/projects/NPM5/board';
			const adf = await provider.resolve(url, 'inline');
			expect(adf).toEqual(expectedEmbedAdf(url));
		});
	});

	describe('when appearance is manually changed on the frontend', () => {
		it('should take manually specified appearance over provider default appearance', async () => {
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () => getMockProvidersResponse(),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const adf = await provider.resolve(url, 'inline', true);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should take manually specified appearance over user default appearance', async () => {
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const adf = await provider.resolve(url, 'inline', true);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should take manually specified appearance over user path based appearance', async () => {
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [
								{
									urlSegment: 'site-with-default-view.com/testing',
									appearance: 'url',
								},
							],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const adf = await provider.resolve(url, 'inline', true);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should take manually specified appearance over hardcoded appearance', async () => {
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () => getMockProvidersResponse(),
				ok: true,
			});

			const url = 'https://jdog.jira-dev.com/jira/core/projects/NPM5/board';
			const adf = await provider.resolve(url, 'inline', true);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should not call /providers when shouldForceAppearance is true', async () => {
			const provider = setupEditorCardProvider();

			const url = 'https://site-with-default-view.com/testing/index.html';
			await provider.resolve(url, 'inline', true);
			expect(mockFetch).not.toHaveBeenCalled();
		});
	});

	describe('when consumer calls function with isEmbedFriendlyLocation as false', () => {
		it('should not use hardcoded appearance even if it matches regexp', async () => {
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url = 'https://jdog.jira-dev.com/jira/core/projects/NPM5/board';
			const adf = await provider.resolve(url, 'inline', false, false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});
	});
	describe('when consumer calls function with isEmbedFriendlyLocation as true', () => {
		it('should use hardcoded appearance if it matches regexp', async () => {
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url = 'https://jdog.jira-dev.com/jira/core/projects/NPM5/board';
			const adf = await provider.resolve(url, 'inline', false, true);
			expect(adf).toEqual(expectedEmbedAdf(url));
		});

		it('should not use embed appearance for team calendar smart link when FF is off', async () => {
			setBooleanFeatureFlagResolver(() => false);
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url =
				'https://jdog.jira-dev.com/wiki/spaces/kb/calendars/1bb45655-f521-4379-8353-59b423abfffb';
			const adf = await provider.resolve(url, 'inline', false, true);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should use embed appearance for team calendar smart link when FF is on', async () => {
			setBooleanFeatureFlagResolver(() => true);
			const provider = setupEditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url =
				'https://jdog.jira-dev.com/wiki/spaces/kb/calendars/1bb45655-f521-4379-8353-59b423abfffb';
			const adf = await provider.resolve(url, 'inline', false, true);
			expect(adf).toEqual(expectedEmbedAdf(url));
		});
	});

	describe('prompt linked issues experiment', () => {
		ffTest.on('issue-link-suggestions-in-comments', 'fg on', () => {
			it('should call onResolve for issue links', async () => {
				const baseUrl = 'https://jdog.jira-dev.com';
				const onResolveMock = jest.fn();

				const provider = new EditorCardProvider(undefined, baseUrl, undefined, onResolveMock);

				const issueAri = 'ari:cloud:jira:b5c3749a-7037-44ec-a059-fb4f675acf90:issue/10050';
				const issueUrl = 'https://jdog.jira-dev.com/browse/BNP-1';

				mockFetch.mockResolvedValueOnce({
					json: async () =>
						getMockProvidersResponse({
							userPreferences: {
								defaultAppearance: 'inline',
								appearances: [],
							},
						}),
					ok: true,
				});

				mockFetch.mockResolvedValueOnce({
					json: async () => [
						{
							body: {
								...mocks.entityDataSuccess,
								data: { ...mocks.entityDataSuccess.data, 'atlassian:ari': issueAri },
							},
							status: 200,
						},
					],
					ok: true,
				});

				await provider.resolve(issueUrl, 'inline', false);

				expect(onResolveMock).toHaveBeenCalledWith(issueUrl, issueAri);
				expect(onResolveMock).toHaveBeenCalledTimes(1);
			});

			it('should not call onResolve for remote issue links', async () => {
				const baseUrl = 'https://sdog.jira-dev.com';
				const onResolveMock = jest.fn();

				const provider = new EditorCardProvider(undefined, baseUrl, undefined, onResolveMock);

				const issueAri = 'ari:cloud:jira:b5c3749a-7037-44ec-a059-fb4f675acf90:issue/10050';
				const issueUrl = 'https://jdog.jira-dev.com/browse/BNP-1';

				mockFetch.mockResolvedValueOnce({
					json: async () =>
						getMockProvidersResponse({
							userPreferences: {
								defaultAppearance: 'inline',
								appearances: [],
							},
						}),
					ok: true,
				});

				mockFetch.mockResolvedValueOnce({
					json: async () => [
						{
							body: {
								...mocks.entityDataSuccess,
								data: { ...mocks.entityDataSuccess.data, 'atlassian:ari': issueAri },
							},
							status: 200,
						},
					],
					ok: true,
				});

				await provider.resolve(issueUrl, 'inline', false);

				expect(onResolveMock).toHaveBeenCalledTimes(0);
			});
		});

		ffTest.off('issue-link-suggestions-in-comments', 'fg off', () => {
			it('should not call onResolve for an issue link', async () => {
				const baseUrl = 'https://jdog.jira-dev.com';
				const onResolveMock = jest.fn();

				const provider = new EditorCardProvider(undefined, baseUrl, undefined, onResolveMock);

				mockFetch.mockResolvedValueOnce({
					json: async () =>
						getMockProvidersResponse({
							userPreferences: {
								defaultAppearance: 'inline',
								appearances: [],
							},
						}),
					ok: true,
				});

				const issueUrl = 'https://jdog.jira-dev.com/browse/BNP-1';
				await provider.resolve(issueUrl, 'inline', false);

				expect(onResolveMock).not.toHaveBeenCalled();
			});
		});
	});

	describe('isJiraWorkItem regexp', () => {
		it.each([
			'https://jv3.jira-dev.com/browse/BNP-1',
			'https://jira.company.com/browse/TEST-123',
			'https://my-instance.atlassian.net/browse/PROJ-999',
			'https://jira.example.com/browse/ABC-123',
		])('should return true for valid work item url: %s', (url) => {
			expect(isJiraWorkItem(url)).toBe(true);
		});

		it('should return false for URLs without /browse', () => {
			const url = 'https://jira.example.com/EXAMPLE-123';
			expect(isJiraWorkItem(url)).toBe(false);
		});

		it.each([
			'',
			'not-a-url',
			'http://',
			'https://jira.example.com',
			'https://jira.example.com/browse/',
			'https://jira.example.com/browse/123',
		])('should return false for invalid work item url: %s', (url) => {
			expect(isJiraWorkItem(url)).toBe(false);
		});
	});
});
