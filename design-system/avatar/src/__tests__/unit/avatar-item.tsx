import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';

import Avatar, { AvatarItem } from '../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Avatar', () => {
	it('should render a span when neither onClick or href us supplied', () => {
		render(<AvatarItem avatar={<Avatar />} testId={'avatar'} />);

		expect(screen.getByTestId('avatar--itemInner').tagName).toEqual('SPAN');
	});

	it('should render a BUTTON when onClick is supplied', () => {
		render(
			<AvatarItem
				avatar={<Avatar name="Alexander Nevermind" />}
				testId={'avatar'}
				onClick={() => null}
			/>,
		);

		expect(screen.getByTestId('avatar--itemInner').tagName).toEqual('BUTTON');
	});

	it('isDisabled - should render a BUTTON when using onClick', () => {
		render(
			<AvatarItem
				avatar={<Avatar name="Alexander Nevermind" />}
				testId={'avatar'}
				isDisabled
				onClick={() => null}
			/>,
		);
		const element = screen.getByTestId('avatar--itemInner');

		expect(element.tagName).toEqual('BUTTON');
	});

	it('isDisabled - should render a BUTTON when using href', () => {
		render(
			<AvatarItem
				avatar={<Avatar name="Alexander Nevermind" />}
				testId={'avatar'}
				isDisabled
				onClick={() => null}
			/>,
		);
		const element = screen.getByTestId('avatar--itemInner');

		expect(element.tagName).toEqual('BUTTON');
	});

	it('should render anchor when href is supplied', () => {
		render(
			<AvatarItem
				avatar={<Avatar name="Alexander Nevermind" />}
				testId={'avatar'}
				href={'https://atlaskit.atlassian.com/'}
			/>,
		);
		expect(screen.getByTestId('avatar--itemInner').tagName).toEqual('A');
	});

	it('should render an anchor with appropriate rel attribute if target blank is supplied', () => {
		render(
			<AvatarItem
				avatar={<Avatar name="Alexander Nevermind" />}
				testId={'avatar'}
				href={'https://atlaskit.atlassian.com/'}
				target="_blank"
			/>,
		);
		const element = screen.getByTestId('avatar--itemInner');

		expect(element.tagName).toEqual('A');
		expect(element).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('should render an anchor without rel attribute if target blank is not supplied', () => {
		render(
			<AvatarItem
				avatar={<Avatar name="Alexander Nevermind" />}
				testId={'avatar'}
				href={'https://atlaskit.atlassian.com/'}
			/>,
		);
		const element = screen.getByTestId('avatar--itemInner');

		expect(element.tagName).toEqual('A');
		expect(element).not.toHaveAttribute('rel');
	});

	it('should not call onclick if disabled', () => {
		const onClick = jest.fn();

		render(
			<AvatarItem
				avatar={<Avatar name="Alexander Nevermind" />}
				testId={'avatar'}
				onClick={onClick}
				isDisabled
			/>,
		);
		const element = screen.getByTestId('avatar--itemInner');

		fireEvent.click(element);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('should output an aria-label on A tag', () => {
		render(
			<AvatarItem
				avatar={<Avatar />}
				testId={'avatar'}
				href={'https://atlaskit.atlassian.com/'}
				label="Test avatar"
			/>,
		);
		const element = screen.getByTestId('avatar--itemInner');

		expect(element.tagName).toEqual('A');
		expect(element).toHaveAttribute('aria-label', 'Test avatar');
	});

	it('should output an aria-label on BUTTON tag', () => {
		render(
			<AvatarItem avatar={<Avatar />} testId={'avatar'} onClick={__noop} label="Test avatar" />,
		);
		const element = screen.getByTestId('avatar--itemInner');

		expect(element.tagName).toEqual('BUTTON');
		expect(element).toHaveAttribute('aria-label', 'Test avatar');
	});
});
