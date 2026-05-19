import React from 'react';

import { act, render } from '@atlassian/testing-library';

import { FlagEventType } from '../../src/types';
import GiveKudosLauncher from '../../src/ui/GiveKudosLauncher/main';

const TRUSTED_BASE_URL = 'https://team.atlassian.com';

const defaultProps = {
	isOpen: true,
	onClose: jest.fn(),
	analyticsSource: 'test',
	teamCentralBaseUrl: TRUSTED_BASE_URL,
	cloudId: 'test-cloud-id',
};

const postMessage = (data: string | object, origin: string) => {
	const event = new MessageEvent('message', {
		data: typeof data === 'string' ? data : JSON.stringify(data),
		origin,
	});
	act(() => {
		window.dispatchEvent(event);
	});
};

describe('GiveKudosLauncher — spoofing attack prevention', () => {
	it('ignores messages from an untrusted origin', () => {
		const onClose = jest.fn();
		render(<GiveKudosLauncher {...defaultProps} onClose={onClose} />);

		postMessage('close', 'https://evil.com');

		expect(onClose).not.toHaveBeenCalled();
	});

	it('processes messages from the trusted origin', async () => {
		const onClose = jest.fn();
		const { container } = render(<GiveKudosLauncher {...defaultProps} onClose={onClose} />);

		await expect(container).toBeAccessible();

		postMessage('close', TRUSTED_BASE_URL);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('blocks jira-kudos-created even from a trusted origin when the URL is not https', () => {
		const addFlag = jest.fn();
		render(<GiveKudosLauncher {...defaultProps} addFlag={addFlag} />);

		postMessage(
			{
				eventType: FlagEventType.JIRA_KUDOS_CREATED,
				kudosUuid: 'real-uuid',
				jiraKudosUrl: 'http://evil.com/malicious',
			},
			TRUSTED_BASE_URL,
		);

		expect(addFlag).not.toHaveBeenCalled();
	});

	it('ignores messages when the drawer is closed', () => {
		const onClose = jest.fn();
		render(<GiveKudosLauncher {...defaultProps} isOpen={false} onClose={onClose} />);

		postMessage('close', TRUSTED_BASE_URL);

		expect(onClose).not.toHaveBeenCalled();
	});
});
