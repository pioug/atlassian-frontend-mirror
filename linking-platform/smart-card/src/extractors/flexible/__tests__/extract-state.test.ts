import type { JsonLd } from 'json-ld-types';

import { SmartLinkActionType } from '@atlaskit/linking-types';

import jiraTask from '../../../__fixtures__/jira-task';
import extractState from '../extract-state';

describe('extractState', () => {
	const response = (serverAction = {}, preview = {}): JsonLd.Response =>
		({
			...jiraTask,
			data: {
				...jiraTask.data,
				preview: { ...preview },
				'atlassian:serverAction': serverAction,
			},
		}) as JsonLd.Response;

	it('returns state lozenge content', () => {
		const content = extractState(jiraTask as JsonLd.Response);

		expect(content?.text).toBeDefined();
		expect(content?.appearance).toBeDefined();
	});

	describe('server action', () => {
		const id = 'link-id';
		const url = jiraTask.data.url;
		const providerKey = jiraTask.meta.key;
		const resourceIdentifiers = jiraTask.data['atlassian:serverAction'][0].resourceIdentifiers;

		const previewData = {
			isSupportTheming: true,
			linkIcon: {
				url: 'https://some-jira-instance/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315',
			},
			providerName: 'Jira',
			src: 'https://some-jira-instance/browse/AT-1/embed?parentProduct=smartlink',
			title: 'AT-1: TESTTTTTT',
			url,
		};

		const read = {
			action: {
				actionType: SmartLinkActionType.GetStatusTransitionsAction,
				resourceIdentifiers,
			},
			providerKey,
		};

		const update = {
			action: {
				actionType: SmartLinkActionType.StatusUpdateAction,
				resourceIdentifiers,
			},
			providerKey,
			details: { url, id },
		};

		it('returns lozenge action when actionOptions is not provided', () => {
			const state = extractState(jiraTask as JsonLd.Response);

			expect(state?.action).toBeDefined();
			expect(state?.action?.read).toBeDefined();
			expect(state?.action?.update).toBeDefined();
		});

		it('returns lozenge action when actionOptions is enabled', () => {
			const state = extractState(jiraTask as JsonLd.Response, { hide: false }, id);

			expect(state?.action).toBeDefined();
			expect(state?.action?.read).toBeDefined();
			expect(state?.action?.update).toBeDefined();
		});

		it('does not return lozenge action when actionOptions is disabled', () => {
			const state = extractState(jiraTask as JsonLd.Response, { hide: true }, id);

			expect(state?.action).toBeUndefined();
		});

		it('does not return lozenge action when actionOptions is not defined', () => {
			const state = extractState(response(), { hide: false }, id);

			expect(state?.action).toBeUndefined();
		});

		it('does not return lozenge action when actionOptions are empty', () => {
			const state = extractState(response([]), { hide: false }, id);

			expect(state?.action).toBeUndefined();
		});

		it('returns read and update action', () => {
			const state = extractState(jiraTask as JsonLd.Response, { hide: false }, id);

			expect(state?.action).toEqual({ read, update });
		});

		it('returns only read action when update action is not provided', () => {
			const state = extractState(
				response([
					{
						'@type': 'UpdateAction',
						name: 'UpdateAction',
						dataRetrievalAction: {
							'@type': 'ReadAction',
							name: SmartLinkActionType.GetStatusTransitionsAction,
						},
						refField: 'tag',
						resourceIdentifiers,
					},
				]),
				{ hide: false },
				id,
			);

			expect(state?.action).toEqual({ read });
		});

		it('returns only update action when read action is not provided', () => {
			const state = extractState(
				response([
					{
						'@type': 'UpdateAction',
						name: 'UpdateAction',
						dataUpdateAction: {
							'@type': 'UpdateAction',
							name: SmartLinkActionType.StatusUpdateAction,
						},
						refField: 'tag',
						resourceIdentifiers,
					},
				]),
				{ hide: false },
				id,
			);

			expect(state?.action).toEqual({ update });
		});

		it('does not return action when action name is not provided', () => {
			const state = extractState(
				response([
					{
						'@type': 'UpdateAction',
						name: 'UpdateAction',
						dataRetrievalAction: {
							'@type': 'ReadAction',
						},
						dataUpdateAction: {
							'@type': 'UpdateAction',
						},
						refField: 'tag',
						resourceIdentifiers,
					},
				]),
				{ hide: false },
				id,
			);

			expect(state?.action).toBeUndefined();
		});

		it('does not return action when resource identifier is not provided', () => {
			const state = extractState(
				response([
					{
						'@type': 'UpdateAction',
						name: 'UpdateAction',
						dataRetrievalAction: {
							'@type': 'ReadAction',
							name: SmartLinkActionType.GetStatusTransitionsAction,
						},
						refField: 'tag',
					},
				]),
				{ hide: false },
				id,
			);

			expect(state?.action).toBeUndefined();
		});

		it('does not return preview data inside the action when preview is not provided in response', () => {
			const state = extractState(
				response([
					{
						'@type': 'UpdateAction',
						name: 'UpdateAction',
						dataUpdateAction: {
							'@type': 'UpdateAction',
							name: SmartLinkActionType.StatusUpdateAction,
						},
						refField: 'tag',
						resourceIdentifiers,
					},
				]),
				{ hide: false },
				id,
			);

			expect(state?.action).toBeDefined();
			expect(state?.action?.update?.details).toEqual({
				id,
				url,
			});
		});

		it('returns preview data inside the action when preview is provided in response', () => {
			const state = extractState(
				response(
					[
						{
							'@type': 'UpdateAction',
							name: 'UpdateAction',
							dataUpdateAction: {
								'@type': 'UpdateAction',
								name: SmartLinkActionType.StatusUpdateAction,
							},
							refField: 'tag',
							resourceIdentifiers,
						},
					],
					previewData,
				),
				{ hide: false },
				id,
			);

			expect(state?.action).toBeDefined();
			expect(state?.action?.update?.details).toEqual({
				id,
				url,
				previewData: {
					isSupportTheming: true,
					isTrusted: true,
					linkIcon: {
						url: 'https://icon-url',
						label: 'Flexible UI Task',
					},
					providerName: 'Jira',
					src: 'https://jira-url/browse/id',
					title: 'Flexible UI Task',
					url,
				},
			});
		});

		describe('server action options', () => {
			it('returns action by default when actionOptions are undefined', () => {
				const state = extractState(jiraTask as JsonLd.Response, undefined, id);

				expect(state?.action).toEqual({ read, update });
			});

			it('returns action when action options are not hidden', () => {
				const state = extractState(jiraTask as JsonLd.Response, { hide: false }, id);

				expect(state?.action).toEqual({ read, update });
			});

			it('does not return action when action options are hidden', () => {
				const state = extractState(jiraTask as JsonLd.Response, { hide: true }, id);

				expect(state?.action).toBeUndefined();
			});
		});
	});
});
