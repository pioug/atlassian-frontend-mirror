import React from 'react';

import { screen, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import MentionItem from '../../../components/MentionItem';
import { type Props } from '../../../components/MentionList';
import { type MentionDescription, type LozengeProps } from '../../../types';

const mentionWithNickname = {
	id: '0',
	name: 'Raina Halper',
	mentionName: 'Caprice',
	nickname: 'Carolyn',
	avatarUrl: '',
};

const mentionWithoutNickname = {
	id: '1',
	name: 'Kaitlyn Prouty',
	mentionName: 'Fidela',
	avatarUrl: '',
};

const xProductUserMention = {
	id: '2',
	name: 'Sam Cooper',
	mentionName: 'Sam Cooper',
	avatarUrl: '',
	isXProductUser: true,
};

const lozengeExamples: LozengeProps[] = [
	{
		text: 'GUEST',
		appearance: 'new',
	},
	{
		text: <div>GUEST</div>,
		appearance: 'new',
	},
];

function setupMentionItem(mention: MentionDescription, props?: Props): ReturnType<typeof render> {
	return render(
		<IntlProvider locale="en">
			<MentionItem mention={mention} onSelection={props && props.onSelection} />
		</IntlProvider>,
	);
}

describe('MentionItem', () => {
	it('should display @-nickname if nickname is present', async () => {
		setupMentionItem(mentionWithNickname);

		expect(screen.getByText(`@${mentionWithNickname.nickname}`)).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should not display @-name if nickname is not present', async () => {
		setupMentionItem(mentionWithoutNickname);

		const nicknameAt = screen.queryByText('@');
		expect(nicknameAt).toBeNull();

		await expect(document.body).toBeAccessible();
	});

	describe('agent marker', () => {
		it('should mark agent mention items', async () => {
			setupEditorExperiments('test', { platform_editor_agent_mentions: true });
			passGate('platform_editor_agent_mentions_drop_one_fixes');
			setupMentionItem({
				id: 'agent-1',
				name: 'Agent Smith',
				mentionName: 'Agent Smith',
				userType: 'AGENT',
			});

			expect(screen.getByTestId('mention-item-agent-1')).toHaveAttribute(
				'data-mention-is-agent',
				'true',
			);
		});

		it('should mark APP mentions with an agent app type', async () => {
			setupEditorExperiments('test', { platform_editor_agent_mentions: true });
			passGate('platform_editor_agent_mentions_drop_one_fixes');
			setupMentionItem({
				id: 'agent-2',
				name: 'Agent Smith',
				mentionName: 'Agent Smith',
				userType: 'APP',
				appType: 'agent',
			});

			expect(screen.getByTestId('mention-item-agent-2')).toHaveAttribute(
				'data-mention-is-agent',
				'true',
			);
		});

		it('should not mark people mention items as agents', async () => {
			setupEditorExperiments('test', { platform_editor_agent_mentions: true });
			passGate('platform_editor_agent_mentions_drop_one_fixes');
			setupMentionItem({
				id: 'person-1',
				name: 'Person Smith',
				mentionName: 'Person Smith',
				userType: 'DEFAULT',
			});

			expect(screen.getByTestId('mention-item-person-1')).not.toHaveAttribute(
				'data-mention-is-agent',
			);
		});

		it('should mark bare APP mention items as agents', async () => {
			setupEditorExperiments('test', { platform_editor_agent_mentions: true });
			passGate('platform_editor_agent_mentions_drop_one_fixes');
			setupMentionItem({
				id: 'app-1',
				name: 'App Smith',
				mentionName: 'App Smith',
				userType: 'APP',
			});

			expect(screen.getByTestId('mention-item-app-1')).toHaveAttribute(
				'data-mention-is-agent',
				'true',
			);
		});

		it('should not mark agent mention items when the refreshed row is disabled', async () => {
			setupEditorExperiments('test', { platform_editor_agent_mentions: false });
			setupMentionItem({
				id: 'agent-1',
				name: 'Agent Smith',
				mentionName: 'Agent Smith',
				userType: 'AGENT',
			});

			expect(screen.getByTestId('mention-item-agent-1')).not.toHaveAttribute(
				'data-mention-is-agent',
			);
		});

		it('should not mark agent mention items when the refreshed row gate is disabled', async () => {
			setupEditorExperiments('test', { platform_editor_agent_mentions: true });
			failGate('platform_editor_agent_mentions_drop_one_fixes');
			setupMentionItem({
				id: 'agent-1',
				name: 'Agent Smith',
				mentionName: 'Agent Smith',
				userType: 'AGENT',
			});

			expect(screen.getByTestId('mention-item-agent-1')).not.toHaveAttribute(
				'data-mention-is-agent',
			);
		});
	});

	it('should display access restriction if accessLevel is NONE', async () => {
		setupMentionItem({
			id: '1',
			name: 'Kaitlyn Prouty',
			mentionName: 'Fidela',
			avatarUrl: '',
			accessLevel: 'NONE',
		});

		expect(await screen.findByLabelText('No access')).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should not display access restriction if accessLevel is CONTAINER', async () => {
		setupMentionItem({
			id: '1',
			name: 'Kaitlyn Prouty',
			mentionName: 'Fidela',
			avatarUrl: '',
			accessLevel: 'CONTAINER',
		});

		const lockIcon = screen.queryByLabelText('No access');
		expect(lockIcon).toBeNull();

		await expect(document.body).toBeAccessible();
	});

	it('should not display access restriction if no accessLevel data', async () => {
		setupMentionItem({
			id: '1',
			name: 'Kaitlyn Prouty',
			mentionName: 'Fidela',
			avatarUrl: '',
		});

		const lockIcon = screen.queryByLabelText('No access');
		expect(lockIcon).toBeNull();

		await expect(document.body).toBeAccessible();
	});

	lozengeExamples.forEach((example) => {
		it(`should render lozenge when passing in text of type ${typeof example} within LozengeProps`, async () => {
			setupMentionItem({
				id: '1',
				name: 'Pranay Marella',
				mentionName: 'Pmarella',
				avatarUrl: '',
				lozenge: example,
			});

			expect(screen.getByText(`GUEST`)).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});
	});

	it('should display mention description if the mentioned user is x-product user in confluence', async () => {
		setupMentionItem(xProductUserMention);
		expect(screen.getByText(`Needs access to Confluence`)).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	describe('loading placeholder', () => {
		const onSelection = jest.fn();
		const placeholder: MentionDescription = {
			id: '__rovo-agents-loading__',
			isPlaceholder: true,
			placeholderType: 'loading',
		};

		afterEach(() => {
			onSelection.mockClear();
		});

		it('renders a non-interactive loading row with an accessible label', async () => {
			setupMentionItem(placeholder, { onSelection } as unknown as Props);

			// The placeholder is lazy-loaded, so wait for the row to resolve.
			const row = await screen.findByRole('status');
			expect(row).toHaveAccessibleName('Loading');
			// No real name/byline content is rendered for the placeholder.
			expect(screen.queryByText('Raina Halper')).not.toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});

		it('does not invoke onSelection when the placeholder row is clicked', async () => {
			setupMentionItem(placeholder, { onSelection } as unknown as Props);

			const row = await screen.findByRole('status');
			row.click();

			expect(onSelection).not.toHaveBeenCalled();
		});

		it('renders multiple placeholders (with distinct ids) as separate loading rows', async () => {
			render(
				<IntlProvider locale="en">
					<MentionItem
						mention={{ id: '__loading-0__', isPlaceholder: true, placeholderType: 'loading' }}
					/>
					<MentionItem
						mention={{ id: '__loading-1__', isPlaceholder: true, placeholderType: 'loading' }}
					/>
				</IntlProvider>,
			);

			const rows = await screen.findAllByRole('status');
			expect(rows).toHaveLength(2);
		});
	});
});
