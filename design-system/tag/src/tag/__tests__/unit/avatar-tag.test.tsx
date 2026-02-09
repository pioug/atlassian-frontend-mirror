import React from 'react';

import { render as rtlRender, screen } from '@testing-library/react';

import Avatar from '@atlaskit/avatar';
import TeamAvatar from '@atlaskit/teams-avatar';

import { AvatarTag } from '../../../tag-new';

const render = (component: React.ReactNode) => {
	return rtlRender(<React.StrictMode>{component}</React.StrictMode>);
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('AvatarTag component', () => {
	const testId = 'test-avatar-tag';

	describe('type="user" (circular avatar)', () => {
		it('should render with circular avatar', () => {
			render(
				<AvatarTag
					type="user"
					text="Jane Smith"
					avatar={Avatar}
					testId={testId}
					isRemovable={false}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			// Avatar also renders the name for accessibility, so use getAllByText
			expect(screen.getAllByText('Jane Smith').length).toBeGreaterThan(0);
		});

		it('should render with remove button by default', () => {
			render(
				<AvatarTag
					type="user"
					text="Alice Williams"
					avatar={Avatar}
					removeButtonLabel="Remove"
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.getByTestId(`close-button-${testId}`)).toBeInTheDocument();
		});

		it('should not render remove button when isRemovable is false', () => {
			render(
				<AvatarTag
					type="user"
					text="Charlie Brown"
					avatar={Avatar}
					isRemovable={false}
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.queryByTestId(`close-button-${testId}`)).not.toBeInTheDocument();
		});

		it('should render as interactive when href is provided', () => {
			render(
				<AvatarTag
					type="user"
					text="Link Person"
					avatar={Avatar}
					href="https://atlassian.com/user/123"
					isRemovable={false}
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
		});
	});

	describe('type="other" (square avatar)', () => {
		it('should render with square avatar', () => {
			render(
				<AvatarTag
					type="other"
					text="Design System Team"
					avatar={TeamAvatar}
					testId={testId}
					isRemovable={false}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.getByText('Design System Team')).toBeInTheDocument();
		});

		it('should render with remove button', () => {
			render(
				<AvatarTag
					type="other"
					text="Engineering Team"
					avatar={TeamAvatar}
					removeButtonLabel="Remove Team"
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.getByTestId(`close-button-${testId}`)).toBeInTheDocument();
		});

		it('should accept isVerified prop', () => {
			render(
				<AvatarTag
					type="other"
					text="Verified Team"
					avatar={TeamAvatar}
					isVerified={true}
					testId={testId}
					isRemovable={false}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			// isVerified is accepted but not visually rendered yet
		});

		it('should render as interactive when href is provided', () => {
			render(
				<AvatarTag
					type="other"
					text="Linked Team"
					avatar={TeamAvatar}
					href="https://atlassian.com/team/123"
					isRemovable={false}
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
		});
	});

	describe('type="agent" (hexagonal avatar)', () => {
		it('should render with hexagonal avatar', () => {
			render(
				<AvatarTag
					type="agent"
					text="Rovo"
					avatar={Avatar}
					testId={testId}
					isRemovable={false}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			// Avatar also renders the name for accessibility, so use getAllByText
			expect(screen.getAllByText('Rovo').length).toBeGreaterThan(0);
		});

		it('should render with remove button', () => {
			render(
				<AvatarTag
					type="agent"
					text="AI Assistant"
					avatar={Avatar}
					removeButtonLabel="Remove Agent"
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.getByTestId(`close-button-${testId}`)).toBeInTheDocument();
		});

		it('should render as interactive when href is provided', () => {
			render(
				<AvatarTag
					type="agent"
					text="Linked Agent"
					avatar={Avatar}
					href="https://atlassian.com/agent/123"
					isRemovable={false}
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
		});
	});
});
