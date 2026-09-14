import React from 'react';
import { render } from '@testing-library/react';
import Avatar from '@atlaskit/avatar/avatar';
import PersonResult from '../../PersonResult';

const DUMMY_AVATAR = <Avatar key="test-avatar" />;

describe('Person Result', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<PersonResult resultId="testPerson" name="test" />);
		await expect(container).toBeAccessible();
	});

	it('should render an avatar if `avatarUrl` is provided', () => {
		expect(
			render(
				<PersonResult resultId="testPerson" name="test" avatarUrl="not null" />,
			).container.querySelectorAll('img, svg').length,
		).toBeGreaterThan(0);
	});

	it('should render an avatar if `avatarUrl` is not provided', () => {
		expect(
			render(<PersonResult resultId="testPerson" name="test" />).container.querySelectorAll(
				'img, svg',
			).length,
		).toBeGreaterThan(0);
	});

	it('should render an avatar if `avatar` is provided as a component', () => {
		expect(
			render(
				<PersonResult resultId="testPerson" name="test" avatar={DUMMY_AVATAR} />,
			).container.querySelectorAll('img, svg').length,
		).toBeGreaterThan(0);
	});

	it('should render avatar component if both avatar props are set', () => {
		expect(
			render(
				<PersonResult
					resultId="testPerson"
					name="test"
					avatar={DUMMY_AVATAR}
					avatarUrl="not null"
				/>,
			).container.querySelectorAll('img, svg').length,
		).toBeGreaterThan(0);
	});

	it('should render `name` prop', () => {
		const name = 'Charlie Atlas';
		expect(
			render(<PersonResult resultId="testPerson" name={name} />).getByText(name),
		).toBeInTheDocument();
	});

	it("should render mentionName prop prepended with an '@' (w/ default mentionPrefix)", () => {
		const mentionName = 'atlassian';
		expect(
			render(<PersonResult resultId="testPerson" name="test" mentionName={mentionName} />)
				.container,
		).toHaveTextContent(`@${mentionName}`);
	});

	it('should render mentionPrefix prepended to mentionName', () => {
		const mentionName = 'atlassian';
		const mentionPrefix = '[at]';
		expect(
			render(
				<PersonResult
					resultId="testPerson"
					name="test"
					mentionName={mentionName}
					mentionPrefix={mentionPrefix}
				/>,
			).container,
		).toHaveTextContent(`${mentionPrefix}${mentionName}`);
	});

	it('should not render mentionPrefix if mentionName is not provided', () => {
		const mentionPrefix = '[at]';
		expect(
			render(<PersonResult resultId="testPerson" name="test" mentionPrefix={mentionPrefix} />)
				.container,
		).not.toHaveTextContent(mentionPrefix);
	});

	it('should render presenceMessage if provided', () => {
		const presenceMessage = "Gone fishin'";
		expect(
			render(<PersonResult resultId="testPerson" name="test" presenceMessage={presenceMessage} />)
				.container,
		).toHaveTextContent(presenceMessage);
	});

	it('known presence states are still valid', () => {
		for (const presenceState of ['online', 'offline', 'busy'] as const) {
			const { container } = render(
				<PersonResult resultId="testPerson" name="test" presenceState={presenceState} />,
			);
			expect(container.querySelector('svg')).toBeInTheDocument();
		}
	});
});
