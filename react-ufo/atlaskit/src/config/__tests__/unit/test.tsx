import { getInteractionRate, getTypingPerformanceTracingMethod, setUFOConfig } from '../../index';

describe('rate-control', () => {
	it('uses default rate when a key cannot be found', () => {
		setUFOConfig({
			product: 'test',
			region: 'test',
			rates: {},
		});
		expect(getInteractionRate('some.event', 'page_load')).toEqual(0);
	});

	it('uses remote rate when key is found', () => {
		setUFOConfig({
			product: 'test',
			region: 'test',
			rates: {
				'some.event': 3,
			},
		});

		expect(getInteractionRate('some.event', 'page_load')).toEqual(3);
	});

	it('killswitch has the most priority', () => {
		setUFOConfig({
			product: 'test',
			region: 'test',
			killswitch: ['some.event'],
			rates: { 'some.event': 2 },
		});

		expect(getInteractionRate('some.event', 'page_load')).toEqual(0);
	});

	it('uses rate from rules if there is a match', () => {
		setUFOConfig({
			product: 'test',
			region: 'test',
			rules: [
				{
					test: '^jira.*',
					rate: 1,
				},
			],
		});

		expect(getInteractionRate('jira.random.event', 'page_load')).toEqual(1);
	});

	it('should be able to explicitly set a custom rate for an event', () => {
		setUFOConfig({
			product: 'test',
			region: 'test',
			killswitch: [],
			rates: { 'some.event': 123 },
		});

		expect(getInteractionRate('some.event', 'page_load')).toBe(123);
	});

	it('should be able to use custom rules to determine the rate of an event', () => {
		setUFOConfig({
			product: 'test',
			region: 'test',
			killswitch: [],
			rates: {},
			rules: [
				{ test: '[a-f]+', rate: 123 },
				{ test: '[g-z]+', rate: 999 },
			],
		});

		expect(getInteractionRate('aaa', 'page_load')).toBe(123);
		expect(getInteractionRate('zzz', 'page_load')).toBe(999);
		// Order matters
		expect(getInteractionRate('aaazzz', 'page_load')).toBe(123);
	});

	it('should be able to killswitch a number of events with a rule', () => {
		setUFOConfig({
			product: 'test',
			region: 'test',
			killswitch: [],
			rules: [
				{
					test: 'UNKNOWN',
					rate: 0,
				},
			],
		});

		const rate = getInteractionRate('UNKNOWN', 'page_load');
		expect(rate).toBe(0);
	});

	it('should return the same values as the existing config with a realistic config', () => {
		setUFOConfig({
			product: 'test',
			region: 'test',
			killswitch: ['platform.fe.inline-result.dropzone.media-drag-drop-upload'],
			rules: [
				{
					test: '^.*UNKNOWN.*$',
					rate: 0,
				},
				{
					test: '^jira.*',
					rate: 1,
				},
				{
					test: 'invalid-experience$',
					rate: 0,
				},
			],
			kind: {
				page_load: 1,
				transition: 0,
				hover: 0,
				legacy: 0,
				press: 0,
				typing: 0,
			},
		});

		const check = {
			'platform.fe.inline.invite-people.invite-people-rendered': 1,
			'platform.fe.inline.invite-people.invite-form-submitted': 1,
			'platform.fe.inline.invite-people.third-party-results-loaded': 1,
			'platform.fe.inline.invitee-list.invite-people-rendered': 1,
			'platform.fe.inline.invitee-list.invite-form-submitted': 1,
			'platform.fe.inline.invitee-list.third-party-results-loaded': 1,
			'platform.fe.inline.people.render-team-member-invite-dialog': 1,
			'platform.fe.inline.people.render-team-member-remove-dialog': 1,
			'platform.fe.inline.people.remove-member-from-team-action': 1,
			'platform.fe.inline.people.add-new-member-to-team-action': 1,
			'platform.fe.inline.people.render-people-nav-menu': 1,
			'platform.fe.inline.people.team-creation-action': 1,
			'platform.fe.inline.people.remove-a-member-from-team': 1,
			'platform.fe.inline.people.invite-members-to-team': 1,
			'platform.fe.inline.people.render-share-dialog': 1,
			'platform.fe.inline.people.share-submit-action': 1,
			'platform.fe.inline.editor.editSession': 1,
			'platform.fe.inline.editor.load': 1,
			'platform.fe.inline.editor.type': 1,
			'platform.fe.inline.editor.interact': 1,
			'platform.fe.inline.smart-links.smart-link-rendered': 1,
			'platform.fe.inline.smart-links.smart-link-authenticated': 1,
			'platform.fe.inline.smart-links.smart-link-action-invocation': 1,
			'platform.fe.inline-result.emoji.emoji-rendered': 1,
			'platform.fe.inline-result.emoji.emoji-resource-fetched': 1,
			'platform.fe.inline-result.emoji.emoji-picker-opened': 1,
			'platform.fe.inline-result.emoji.emoji-searched': 1,
			'platform.fe.inline-result.emoji.emoji-uploaded': 1,
			'platform.fe.inline-result.emoji.emoji-section-recorded': 1,
			'platform.fe.inline-result.emoji-picker.emoji-rendered': 1,
			'platform.fe.inline-result.emoji-picker.emoji-resource-fetched': 1,
			'platform.fe.inline-result.emoji-picker.emoji-picker-opened': 1,
			'platform.fe.inline-result.emoji-picker.emoji-searched': 1,
			'platform.fe.inline-result.emoji-picker.emoji-uploaded': 1,
			'platform.fe.inline-result.emoji-picker.emoji-section-recorded': 1,
			'platform.fe.inline-result.emoji-provider.emoji-rendered': 1,
			'platform.fe.inline-result.emoji-provider.emoji-resource-fetched': 1,
			'platform.fe.inline-result.emoji-provider.emoji-picker-opened': 1,
			'platform.fe.inline-result.emoji-provider.emoji-searched': 1,
			'platform.fe.inline-result.emoji-provider.emoji-uploaded': 1,
			'platform.fe.inline-result.emoji-provider.emoji-section-recorded': 1,
			'platform.fe.inline-result.reactions-picker.reactions-rendered': 1,
			'platform.fe.inline-result.reactions-picker.reactions-picker-opened': 1,
			'platform.fe.inline-result.reactions-picker.reaction-added': 1,
			'platform.fe.inline-result.reactions-picker.reaction-removed': 1,
			'platform.fe.inline-result.reactions-list.reactions-rendered': 1,
			'platform.fe.inline-result.reactions-list.reactions-picker-opened': 1,
			'platform.fe.inline-result.reactions-list.reaction-added': 1,
			'platform.fe.inline-result.reactions-list.reaction-removed': 1,
			'platform.fe.inline-result.media-viewer.media-file': 1,
			'platform.fe.inline-result.media-picker-dropzone.media-upload': 1,
			'platform.fe.experience.share-to-slack.slack-request-sent': 1,
			'platform.fe.experience.share-to-slack.slack-segment-rendered': 1,
			'platform.fe.inline.invite-people.invalid-experience': 0,
			'platform.fe.inline.invitee-list.invalid-experience': 0,
			'platform.fe.inline.people.invalid-experience': 0,
			'platform.fe.inline.editor.invalid-experience': 0,
			'platform.fe.inline.smart-links.invalid-experience': 0,
			'platform.fe.inline-result.dropzone.media-drag-drop-upload': 0,
			'platform.fe.inline-result.emoji.invalid-experience': 0,
			'platform.fe.inline-result.emoji-picker.invalid-experience': 0,
			'platform.fe.inline-result.emoji-provider.invalid-experience': 0,
			'platform.fe.inline-result.reactions-picker.invalid-experience': 0,
			'platform.fe.inline-result.reactions-list.invalid-experience': 0,
			'jira.random.UNKNOWN': 0,
		};
		Object.entries(check).forEach(([key, rate]: [any, any]) => {
			expect(getInteractionRate(key, 'page_load')).toBe(rate);
		});
	});
});

describe('getTypeMethod', () => {
	it('should get timeout from config', () => {
		setUFOConfig({
			product: 'test',
			region: 'test',
			typingMethod: 'timeout',
		});
		expect(getTypingPerformanceTracingMethod()).toBe('timeout');
	});
	it('should get timeoutNoAlloc from config', () => {
		setUFOConfig({
			product: 'test',
			region: 'test',
			typingMethod: 'timeoutNoAlloc',
		});
		expect(getTypingPerformanceTracingMethod()).toBe('timeoutNoAlloc');
	});
	it('should get mutationObserver from config', () => {
		setUFOConfig({
			product: 'test',
			region: 'test',
			typingMethod: 'mutationObserver',
		});
		expect(getTypingPerformanceTracingMethod()).toBe('mutationObserver');
	});
	it('should return default typing method when config typingMethod is invalid', () => {
		setUFOConfig({
			product: 'test',
			region: 'test',
			typingMethod: 'invalid',
		});
		expect(getTypingPerformanceTracingMethod()).toBe('timeout');
	});
});
