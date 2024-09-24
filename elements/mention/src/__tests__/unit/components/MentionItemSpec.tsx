// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import LockCircleIcon from '@atlaskit/icon/core/migration/lock-locked--lock-circle';
import { type ReactWrapper } from 'enzyme';
import React, { type ReactChildren } from 'react';
import MentionItem from '../../../components/MentionItem';
import { type Props, type State } from '../../../components/MentionList';
import { type MentionDescription, type LozengeProps } from '../../../types';
import Lozenge from '@atlaskit/lozenge';
import { act } from '@testing-library/react';

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

function setupMentionItem(mention: MentionDescription, props?: Props): ReactWrapper<Props, State> {
	return mountWithIntl(<MentionItem mention={mention} onSelection={props && props.onSelection} />);
}

describe('MentionItem', () => {
	it('should display @-nickname if nickname is present', () => {
		const component = setupMentionItem(mentionWithNickname);
		expect(component.html()).toContain(`@${mentionWithNickname.nickname}`);
	});

	it('should not display @-name if nickname is not present', () => {
		const component = setupMentionItem(mentionWithoutNickname);
		expect(component.html()).not.toContain('@');
	});

	it('should display access restriction if accessLevel is NONE', async () => {
		const component = setupMentionItem({
			id: '1',
			name: 'Kaitlyn Prouty',
			mentionName: 'Fidela',
			avatarUrl: '',
			accessLevel: 'NONE',
		});

		// await for LockCircle async import
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});
		component.update();

		var icon = component.find(LockCircleIcon);
		expect(icon).toHaveLength(1);

		expect(component.find(LockCircleIcon)).toHaveLength(1);
	});

	it('should not display access restriction if accessLevel is CONTAINER', () => {
		const component = setupMentionItem({
			id: '1',
			name: 'Kaitlyn Prouty',
			mentionName: 'Fidela',
			avatarUrl: '',
			accessLevel: 'CONTAINER',
		});
		expect(component.find(LockCircleIcon)).toHaveLength(0);
	});

	it('should not display access restriction if no accessLevel data', () => {
		const component = setupMentionItem({
			id: '1',
			name: 'Kaitlyn Prouty',
			mentionName: 'Fidela',
			avatarUrl: '',
		});
		expect(component.find(LockCircleIcon)).toHaveLength(0);
	});

	lozengeExamples.forEach((example) => {
		it(`should render lozenge when passing in text of type ${typeof example} within LozengeProps`, () => {
			const component = setupMentionItem({
				id: '1',
				name: 'Pranay Marella',
				mentionName: 'Pmarella',
				avatarUrl: '',
				lozenge: example,
			});

			expect(component.find(Lozenge).text()).toContain('GUEST');
			expect(component.find(Lozenge).prop('appearance')).toEqual('new');
		});
	});
});
