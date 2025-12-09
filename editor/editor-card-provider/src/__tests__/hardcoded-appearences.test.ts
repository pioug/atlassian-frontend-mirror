import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import { EditorCardProvider } from '..';
import { mocks } from './__fixtures__/mocks';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import { _overrides } from '@atlaskit/tmp-editor-statsig/setup';

import { getMockProvidersResponse, expectedInlineAdf, expectedEmbedAdf } from './test-utils';

const mockGetExperimentValue = jest.fn();
FeatureGates.getExperimentValue = mockGetExperimentValue;

describe('hardcoded appearences', () => {
	let mockFetch: jest.Mock;

	beforeEach(() => {
		// Since we use module level caching,
		// we need to clear it up for clean test run
		jest.resetModules();
		mockFetch = jest.fn();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(global as any).fetch = mockFetch;
		setBooleanFeatureFlagResolver((flag) => flag === 'avp_unfurl_shared_charts_embed_by_default_2');
	});

	afterAll(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		delete (global as any).fetch;
	});

	it.each<[string, string]>([
		['Slack message', 'https://atlassian.slack.com/archives/C014W1DTRHS/p1614244582005100'],
		[
			'Slack message in thread',
			'https://atlassian.slack.com/archives/C014W1DTRHS/p1614306173007200?thread_ts=1614244582.005100&cid=C014W1DTRHS',
		],
	])('returns inline when %s link inserted, calling /providers endpoint', async (_, url) => {
		const provider = new EditorCardProvider();
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
		['AVP Visualization view with numeric entity-id', 'https://hello.atlassian.net/avpviz/c/12345'],
		[
			'AVP Visualization view with UUID entity-id',
			'https://hello.atlassian.net/avpviz/c/8fb8c642-803d-59fe-8d1c-066610e860c6',
		],
		[
			'AVP Visualization view with alphanumeric entity-id',
			'https://hello.atlassian.net/avpviz/c/abc123-def456',
		],
		[
			'AVP Visualization view with query parameters',
			'https://hello.atlassian.net/avpviz/c/12345?foo=bar&baz=qux',
		],
		['AVP Visualization view with trailing slash', 'https://hello.atlassian.net/avpviz/c/12345/'],
		[
			'AVP Visualization view with query parameters and trailing slash',
			'https://hello.atlassian.net/avpviz/c/12345/?foo=bar',
		],
		['AVP Visualization view on different domain', 'https://jdog.jira-dev.com/avpviz/c/entity-123'],
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
		['URL with avpviz but missing /c/ segment', 'https://hello.atlassian.net/avpviz/12345'],
		[
			'URL with avpviz but different path structure',
			'https://hello.atlassian.net/avpviz/view/12345',
		],
		['URL with avpviz but empty entity-id', 'https://hello.atlassian.net/avpviz/c/'],
		['URL with avpviz in query parameter', 'https://hello.atlassian.net/some/path?avpviz=c/12345'],
		['URL with avpviz in fragment', 'https://hello.atlassian.net/some/path#avpviz/c/12345'],
	])(
		'returns inlineCard when %s public link is inserted, calling /providers and /resolve/batch endpoint',
		async (_, url) => {
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
			expect(adf).toEqual(expectedInlineAdf(url));
		},
	);
});
