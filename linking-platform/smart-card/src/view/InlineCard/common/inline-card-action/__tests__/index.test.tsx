import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import { InternalActionName } from '../../../../../constants';
import extractRemixAction from '../../../../../extractors/flexible/actions/extract-remix-action';
import useInlineTailoredAction from '../../../../../state/hooks/use-inline-tailored-actions';
import { InlineCardAction } from '../index';

jest.mock('@atlaskit/link-provider/use-plugins', () => ({
	usePlugins: () => ({ remix: { open: jest.fn() } }),
}));
jest.mock('@atlaskit/link-provider/use-smart-link-context', () => ({
	useSmartLinkContext: () => ({ product: 'CONFLUENCE' }),
}));
jest.mock('../../../../../state/store', () => ({ useSmartCardState: () => ({ details: {} }) }));
jest.mock('../../../../../extractors/flexible/actions/extract-remix-action', () => ({
	__esModule: true,
	default: jest.fn(),
}));
jest.mock('../../../../../state/hooks/use-inline-tailored-actions', () => ({
	__esModule: true,
	default: jest.fn(),
}));
jest.mock('../../remix-action', () => ({
	__esModule: true,
	default: () => <button>Remix</button>,
}));
jest.mock('../../rovo-actions-cta', () => ({
	InlineRovoActionButton: () => <button>Chat</button>,
}));

const mockExtractRemixAction = jest.mocked(extractRemixAction);
const mockTailoredAction = jest.mocked(useInlineTailoredAction);

describe('InlineCardAction', () => {
	beforeEach(() => {
		mockExtractRemixAction.mockReset();
		mockTailoredAction.mockReset();
		mockTailoredAction.mockReturnValue({ isEnabled: true });
	});

	it('shows only Remix when both actions are eligible', () => {
		passGate('platform_sl_3p_auth_visualize_killswitch');
		mockExtractRemixAction.mockReturnValue({
			url: 'https://example.com',
			invokeAction: { actionSubjectId: 'remix', actionType: InternalActionName.RemixAction },
		});
		render(<InlineCardAction url="https://example.com" />);
		expect(screen.getByRole('button', { name: 'Remix' })).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Chat' })).not.toBeInTheDocument();
		expect(screen.getAllByRole('button')).toHaveLength(1);
	});

	it('falls back to Chat when Remix is ineligible', () => {
		passGate('platform_sl_3p_auth_visualize_killswitch');
		render(<InlineCardAction url="https://example.com" />);
		expect(screen.getByRole('button', { name: 'Chat' })).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Remix' })).not.toBeInTheDocument();
	});

	it('keeps the legacy Chat path when the kill switch is off', () => {
		failGate('platform_sl_3p_auth_visualize_killswitch');
		render(<InlineCardAction url="https://example.com" />);
		expect(screen.getByRole('button', { name: 'Chat' })).toBeInTheDocument();
		expect(mockExtractRemixAction).not.toHaveBeenCalled();
	});

	it('shows no action when neither is eligible', () => {
		passGate('platform_sl_3p_auth_visualize_killswitch');
		mockTailoredAction.mockReturnValue({ isEnabled: false });
		render(<InlineCardAction url="https://example.com" />);
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});
});
