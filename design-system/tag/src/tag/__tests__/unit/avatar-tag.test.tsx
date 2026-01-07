import React from 'react';

import { render as rtlRender, screen } from '@testing-library/react';

import Avatar from '@atlaskit/avatar';

import { AvatarTag } from '../../../tag-new';

const render = (component: React.ReactNode) => {
	return rtlRender(<React.StrictMode>{component}</React.StrictMode>);
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('AvatarTag component', () => {
	const testId = 'test-avatar-tag';

	describe('basic rendering', () => {
		it('should render with avatar component', () => {
			render(<AvatarTag text="Jane Smith" avatar={Avatar} testId={testId} isRemovable={false} />);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			// Avatar also renders the name for accessibility, so use getAllByText
			expect(screen.getAllByText('Jane Smith').length).toBeGreaterThan(0);
		});

		it('should render with avatar render function', () => {
			render(
				<AvatarTag
					text="John Doe"
					avatar={(props) => <Avatar {...props} />}
					testId={testId}
					isRemovable={false}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			// Avatar also renders the name for accessibility, so use getAllByText
			expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
		});

		it('should render with avatar image via render function', () => {
			render(
				<AvatarTag
					text="Bob Johnson"
					avatar={(props) => <Avatar {...props} src="https://example.com/avatar.jpg" />}
					testId={testId}
					isRemovable={false}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
		});
	});

	describe('removable behavior', () => {
		it('should render with remove button by default', () => {
			render(
				<AvatarTag
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
				<AvatarTag text="Charlie Brown" avatar={Avatar} isRemovable={false} testId={testId} />,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.queryByTestId(`close-button-${testId}`)).not.toBeInTheDocument();
		});

		it('should render with both avatar and remove button', () => {
			render(
				<AvatarTag
					text="Diana Prince"
					avatar={Avatar}
					removeButtonLabel="Remove"
					testId={testId}
				/>,
			);
			expect(screen.getByTestId(testId)).toBeInTheDocument();
			expect(screen.getByTestId(`close-button-${testId}`)).toBeInTheDocument();
		});
	});

	describe('interaction states', () => {
		it('should render as interactive when href is provided', () => {
			render(
				<AvatarTag
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
});
