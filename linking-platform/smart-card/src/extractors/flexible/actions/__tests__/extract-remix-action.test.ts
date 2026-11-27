import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { wasExperimentExposed } from '@atlassian/experiment-test-utils/was-experiment-exposed';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { CardAction, InternalActionName } from '../../../../constants';
import { TEST_DOCUMENT, TEST_RESOLVED_META_DATA } from '../../../common/__mocks__/jsonld';
import extractRemixAction from '../extract-remix-action';

const KILL_SWITCH = 'platform_sl_3p_auth_visualize_killswitch';
const EXPERIMENT = 'platform_sl_3p_auth_visualize_exp';

const createRemix = (isAvailable: boolean = true) => ({
	isAvailable: jest.fn(() => isAvailable),
	open: jest.fn(),
});

const response: JsonLd.Response = {
	data: {
		...TEST_DOCUMENT,
		'@type': ['Document', 'schema:SpreadsheetDigitalDocument'],
		url: 'https://canonical.example.com/sheet',
	},
	meta: {
		...TEST_RESOLVED_META_DATA,
		definitionId: 'd1',
		key: 'google-object-provider',
		resourceType: 'r1',
	},
};

const actionOptions = { hide: false, remixAction: { optIn: true } };

const enableRemixExperiment = () => {
	passGate(KILL_SWITCH);
	mockExpEnabled(EXPERIMENT);
};

describe('extractRemixAction', () => {
	it('extracts an opted-in Remix action for supported Google Sheets links', () => {
		enableRemixExperiment();
		const action = extractRemixAction({
			actionOptions,
			appearance: 'block',
			id: 'test-id',
			remix: createRemix(),
			response,
			url: 'https://original.example.com/sheet',
		});

		expect(action).toEqual({
			invokeAction: {
				actionSubjectId: 'remix',
				actionType: InternalActionName.RemixAction,
				definitionId: 'd1',
				display: 'block',
				extensionKey: 'google-object-provider',
				id: 'test-id',
				resourceType: 'r1',
			},
			url: 'https://canonical.example.com/sheet',
		});
		expect(wasExperimentExposed(EXPERIMENT)).toBe(false);
	});

	it('falls back to the original URL when the response has no canonical URL', () => {
		enableRemixExperiment();

		const { url: _url, ...dataWithoutUrl } = response.data as JsonLd.Data.Document;

		const action = extractRemixAction({
			actionOptions,
			remix: createRemix(),
			response: {
				...response,
				data: dataWithoutUrl,
			},
			url: 'https://original.example.com/sheet',
		});

		expect(action?.url).toBe('https://original.example.com/sheet');
	});

	it('returns undefined if the action is not opted in', () => {
		expect(
			extractRemixAction({
				actionOptions: { hide: false },
				remix: createRemix(),
				response,
			}),
		).toBeUndefined();
	});

	it('returns undefined if actionOptions hides all actions', () => {
		expect(
			extractRemixAction({
				actionOptions: { hide: true },
				remix: createRemix(),
				response,
			}),
		).toBeUndefined();
	});

	it('returns undefined if excluded in actionOptions', () => {
		expect(
			extractRemixAction({
				actionOptions: {
					hide: false,
					exclude: [CardAction.RemixAction],
					remixAction: { optIn: true },
				},
				remix: createRemix(),
				response,
			}),
		).toBeUndefined();
	});

	it('returns undefined if the Remix plugin is unavailable', () => {
		expect(
			extractRemixAction({
				actionOptions,
				remix: createRemix(false),
				response,
			}),
		).toBeUndefined();
	});

	it('does not require a hosting product when the surface opts in', () => {
		enableRemixExperiment();
		expect(extractRemixAction({ actionOptions, remix: createRemix(), response })).toBeDefined();
	});

	it('returns undefined if the experiment is disabled', () => {
		passGate(KILL_SWITCH);
		mockExpDisabled(EXPERIMENT);

		expect(extractRemixAction({ actionOptions, remix: createRemix(), response })).toBeUndefined();
	});

	it('returns undefined if the kill switch is off', () => {
		failGate(KILL_SWITCH);
		mockExpEnabled(EXPERIMENT);

		expect(extractRemixAction({ actionOptions, remix: createRemix(), response })).toBeUndefined();
	});
});
