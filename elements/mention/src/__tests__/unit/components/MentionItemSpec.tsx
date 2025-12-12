import React, { type ReactChildren } from 'react';
import MentionItem from '../../../components/MentionItem';
import { type Props } from '../../../components/MentionList';
import { type MentionDescription, type LozengeProps } from '../../../types';
import { screen, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

// Helper to make <React.Suspense> and React.lazy() work with Enzyme
jest.mock('react', () => {
	const React = jest.requireActual('react');
	return {
		...React,
		Suspense: ({ children }: { children: ReactChildren }) => children,
		lazy: jest.fn().mockImplementation((fn) => {
			const Component = (props: any) => {
				const [C, setC] = React.useState();
				React.useEffect(() => {
					fn().then((v: any) => {
						setC(v);
					});
				}, []);
				return C ? <C.default {...props} /> : null;
			};
			return Component;
		}),
	};
});

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
});
