import React, { type FC, type MouseEventHandler, type ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import cases from 'jest-in-case';

import {
	type AnalyticsEventPayload,
	AnalyticsListener,
	UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';

import Avatar, { AVATAR_SIZES, AvatarContext, type SizeType } from '../../index';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

describe('Avatar', () => {
	it('should render a span when neither onClick or href are supplied', () => {
		render(<Avatar testId={'avatar'} />);

		expect(screen.getByTestId('avatar--inner').tagName).toEqual('SPAN');
	});

	it('should render a button when onClick is supplied', () => {
		render(
			<Avatar
				name="Alexander Nevermind"
				testId={'avatar'}
				onClick={(event, analyticsEvent) => null}
			/>,
		);

		expect(screen.getByTestId('avatar--inner').tagName).toEqual('BUTTON');
	});

	it('should render a disabled button when using onClick', () => {
		render(
			<Avatar
				testId={'avatar'}
				isDisabled
				name="Alexander Nevermind"
				onClick={(event, analyticsEvent) => null}
			/>,
		);
		const element = screen.getByTestId('avatar--inner');

		expect(element.tagName).toEqual('BUTTON');
		expect(element).toBeDisabled();
	});

	it('should render a disabled button when using href', () => {
		render(
			<Avatar
				testId={'avatar'}
				isDisabled
				href={'https://atlaskit.atlassian.com/'}
				name="Alexander Nevermind"
			/>,
		);
		const element = screen.getByTestId('avatar--inner');

		expect(element.tagName).toEqual('BUTTON');
		expect(element).toBeDisabled();
	});

	it('should render an anchor when href is supplied', () => {
		render(
			<Avatar
				name="Alexander Nevermind"
				testId={'avatar'}
				href={'https://atlaskit.atlassian.com/'}
			/>,
		);
		expect(screen.getByTestId('avatar--inner').tagName).toEqual('A');
	});

	it('should render an anchor with appropriate rel attribute if target blank is supplied', () => {
		render(
			<Avatar
				testId={'avatar'}
				href={'https://atlaskit.atlassian.com/'}
				name="Alexander Nevermind"
				target="_blank"
			/>,
		);
		const element = screen.getByTestId('avatar--inner');

		expect(element.tagName).toEqual('A');
		expect(element).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('should render an anchor without rel attribute if target blank is not supplied', () => {
		render(
			<Avatar
				name="Alexander Nevermind"
				testId={'avatar'}
				href={'https://atlaskit.atlassian.com/'}
			/>,
		);
		const element = screen.getByTestId('avatar--inner');

		expect(element.tagName).toEqual('A');
		expect(element).not.toHaveAttribute('rel');
	});

	describe('Custom Avatar', () => {
		const MyComponent: FC<{ children: ReactNode; testId?: string }> = ({
			children,
			testId,
			...props
		}) => (
			// Allow spread props here because for testing, we want everything
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			<div data-testid={testId} {...props}>
				{children}
			</div>
		);
		const name = 'Name';
		const status = 'Status';

		it('should render', () => {
			render(
				<Avatar testId={'avatar'} href={'https://atlaskit.atlassian.com/'}>
					{({ ref, ...props }) => <MyComponent {...props} />}
				</Avatar>,
			);
			expect(screen.getByTestId('avatar--inner').tagName).toEqual('DIV');
		});

		it('should add an `aria-label` regardless of interactivity', () => {
			const interactiveTestId = 'interactive';
			const nonInteractiveTestId = 'not-interactive';
			render(
				<>
					<Avatar
						testId={interactiveTestId}
						href={'https://atlaskit.atlassian.com/'}
						name={name}
						status={status}
					>
						{({ ref, ...props }) => <MyComponent {...props} />}
					</Avatar>
					<Avatar testId={nonInteractiveTestId} name={name} status={status}>
						{({ ref, ...props }) => <MyComponent {...props} />}
					</Avatar>
				</>,
			);
			[interactiveTestId, nonInteractiveTestId].forEach((testId) => {
				expect(screen.getByTestId(`${testId}--inner`)).toHaveAttribute(
					'aria-label',
					`${name} (${status})`,
				);
			});
		});
	});

	it('should call onClick with analytics event when clicked', async () => {
		const user = userEvent.setup();
		const onEvent = jest.fn();

		render(
			<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
				<Avatar
					testId={'avatar'}
					name="Alexander Nevermind"
					onClick={(_, analyticsEvent) => analyticsEvent && analyticsEvent.fire()}
				/>
				,
			</AnalyticsListener>,
		);
		const element = screen.getByTestId('avatar--inner');

		await user.click(element);

		expect(onEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				payload: {
					action: 'clicked',
					actionSubject: 'avatar',
					attributes: {
						componentName: 'avatar',
						packageName,
						packageVersion,
					},
				},
			}),
			'atlaskit',
		);
	});

	it('should call onClick when clicked on an anchor component', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();

		render(
			<Avatar
				testId={'avatar'}
				href={'https://atlaskit.atlassian.com/'}
				name="Alexander Nevermind"
				onClick={(event) => onClick(event)}
			/>,
		);

		const element = screen.getByTestId('avatar--inner');
		await user.click(element);

		expect(onClick).toHaveBeenCalled();
	});

	it('should call onClick with analytics event when a custom component is clicked', async () => {
		const user = userEvent.setup();
		const onEvent = jest.fn();

		const MyComponent: FC<{
			children: ReactNode;
			testId?: string;
			onClick?: MouseEventHandler;
		}> = ({ testId, onClick, children }) => (
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
			<div onClick={(e) => typeof onClick === 'function' && onClick(e)} data-testid={testId}>
				{children}
			</div>
		);

		render(
			<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
				<Avatar
					testId={'avatar'}
					onClick={(_, analyticsEvent) => analyticsEvent && analyticsEvent.fire()}
				>
					{(props) => <MyComponent {...props} />}
				</Avatar>
			</AnalyticsListener>,
		);

		const element = screen.getByTestId('avatar--inner');

		await user.click(element);

		expect(onEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				payload: {
					action: 'clicked',
					actionSubject: 'avatar',
					attributes: {
						componentName: 'avatar',
						packageName,
						packageVersion,
					},
				},
			}),
			'atlaskit',
		);
	});

	it('should fire an event on the atlaskit channel', async () => {
		const user = userEvent.setup();
		const onEvent = jest.fn();
		const extraContext = { hello: 'world' };
		render(
			<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
				<Avatar
					testId={'avatar'}
					name="Alexander Nevermind"
					onClick={(_, analyticsEvent) => analyticsEvent && analyticsEvent.fire()}
					analyticsContext={extraContext}
				/>
			</AnalyticsListener>,
		);
		const avatar: HTMLElement = screen.getByTestId('avatar--inner');

		await user.click(avatar);

		const expected = new UIAnalyticsEvent({
			payload: {
				action: 'clicked',
				actionSubject: 'avatar',
				attributes: {
					componentName: 'avatar',
					packageName,
					packageVersion,
				},
			},
			context: [
				{
					componentName: 'avatar',
					packageName,
					packageVersion,
					...extraContext,
				},
			],
		});
		expect(onEvent).toHaveBeenCalledTimes(1);
		expect(onEvent.mock.calls[0][0].payload).toEqual(expected.payload);
		expect(onEvent.mock.calls[0][0].context).toEqual(expected.context);
	});

	it('should fire an event', async () => {
		const user = userEvent.setup();
		const onEvent = jest.fn();
		render(
			<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
				<Avatar
					testId={'avatar'}
					name="Alexander Nevermind"
					onClick={(_, analyticsEvent) => analyticsEvent && analyticsEvent.fire()}
				/>
			</AnalyticsListener>,
		);
		const avatar: HTMLElement = screen.getByTestId('avatar--inner');

		await user.click(avatar);

		const expected: AnalyticsEventPayload = {
			action: 'clicked',
			actionSubject: 'avatar',
			attributes: {
				componentName: 'avatar',
				packageName,
				packageVersion,
			},
		};
		expect(onEvent).toHaveBeenCalledTimes(1);
		expect(onEvent.mock.calls[0][0].payload).toEqual(expected);
	});

	it('should fire an event on the public channel and the internal channel', async () => {
		const user = userEvent.setup();
		const onPublicEvent = jest.fn();
		const onAtlaskitEvent = jest.fn();
		function WithBoth() {
			return (
				<AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
					<AnalyticsListener onEvent={onPublicEvent}>
						<Avatar
							testId={'avatar'}
							name="Alexander Nevermind"
							onClick={(_, analyticsEvent) => analyticsEvent && analyticsEvent.fire()}
						/>
					</AnalyticsListener>
				</AnalyticsListener>
			);
		}
		render(<WithBoth />);
		const avatar: HTMLElement = screen.getByTestId('avatar--inner');

		await user.click(avatar);

		const expected: AnalyticsEventPayload = {
			action: 'clicked',
			actionSubject: 'avatar',
			attributes: {
				componentName: 'avatar',
				packageName,
				packageVersion,
			},
		};
		expect(onPublicEvent).toHaveBeenCalledTimes(1);
		expect(onPublicEvent.mock.calls[0][0].payload).toEqual(expected);
		expect(onAtlaskitEvent).toHaveBeenCalledTimes(1);
		expect(onAtlaskitEvent.mock.calls[0][0].payload).toEqual(expected);
	});

	it('should not error if there is no analytics provider', async () => {
		const user = userEvent.setup();
		const error = jest.spyOn(console, 'error');
		const onClick = jest.fn();
		render(<Avatar name="Alexander Nevermind" testId="avatar" onClick={onClick} />);

		const avatar: HTMLElement = screen.getByTestId('avatar--inner');
		await user.click(avatar);

		expect(error).not.toHaveBeenCalled();
		error.mockRestore();
	});

	it('should not call onclick if disabled', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();

		render(<Avatar name="Alexander Nevermind" testId={'avatar'} onClick={onClick} isDisabled />);
		const element = screen.getByTestId('avatar--inner');

		await user.click(element);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('should put `name` and `status` or `presence` together on an `img` element', () => {
		const name = 'name';
		const presence = 'presence';

		render(<Avatar name={name} presence={presence} />);

		expect(screen.getByRole('img')).toHaveAccessibleName(new RegExp(`${name}.*${presence}`, 'g'));
	});

	it('should not render image role if no text or src is provided', () => {
		render(<Avatar />);

		expect(screen.queryByRole('img')).not.toBeInTheDocument();
	});

	// Every combination of src, name, and presence to ensure everything gets the
	// proper accessible name
	const imageRoleTestCases = [
		// Disabled until https://product-fabric.atlassian.net/browse/DSP-17031 is resolved
		/**{
      name: 'src',
      src: true,
      _name: false,
      presence: false,
    },*/
		{
			name: 'src, name',
			src: true,
			_name: true,
			presence: false,
		},
		{
			name: 'name',
			src: false,
			_name: true,
			presence: false,
		},
		{
			name: 'src, presence',
			src: true,
			_name: false,
			presence: true,
		},
		{
			name: 'presence',
			src: false,
			_name: false,
			presence: true,
		},
		{
			name: 'src, name, presence',
			src: true,
			_name: true,
			presence: true,
		},
		{
			name: 'name, presence',
			src: false,
			_name: true,
			presence: true,
		},
	];

	cases(
		'should render an image role when label text is present on non-interactive avatars',
		({ src, _name, presence }: { src: boolean; _name: boolean; presence: boolean }) => {
			const imageSrc = 'data:image/png;base64,';

			render(
				<Avatar
					src={src ? imageSrc : undefined}
					name={_name ? 'name' : undefined}
					presence={presence ? 'presence' : undefined}
				/>,
			);

			// Label text contains any combination of name, presence, and status
			const expectedRoles = _name || presence ? 1 : 0;
			expect(screen.queryAllByRole('img')).toHaveLength(expectedRoles);
		},
		imageRoleTestCases,
	);

	cases(
		'should render an image role when an image and a name is provided on interactive avatars',
		({ src, _name, presence }: { src: boolean; _name: boolean; presence: boolean }) => {
			const imageSrc = 'data:image/png;base64,';

			render(
				<Avatar
					src={src ? imageSrc : undefined}
					name={_name ? 'name' : undefined}
					presence={presence ? 'presence' : undefined}
					onClick={__noop}
				/>,
			);

			// If an image is provided, it passes along the `name` prop
			const expectedRoles = src && _name ? 1 : 0;
			expect(screen.queryAllByRole('img')).toHaveLength(expectedRoles);
		},
		imageRoleTestCases,
	);

	it('should not show a presence indicator not provided', () => {
		render(<Avatar testId={'avatar'} />);

		expect(screen.queryByTestId('avatar--presence')).not.toBeInTheDocument();
	});

	it('should show a presence indicator if provided', () => {
		render(<Avatar testId={'avatar'} presence="busy" />);

		expect(screen.getByTestId('avatar--presence')).toBeInTheDocument();
	});

	it('should remove presence from the accessibility tree', () => {
		render(<Avatar testId={'avatar'} presence="offline" />);

		expect(screen.queryByTestId('avatar--presence')).toHaveAttribute('aria-hidden', 'true');
	});

	it('should show a custom presence indicator if provided', () => {
		const MyComponent: FC = () => <div data-testid="custom-presence">yo</div>;

		render(<Avatar testId={'avatar'} presence={<MyComponent />} />);
		const element = screen.getByTestId('custom-presence');

		expect(element.tagName).toEqual('DIV');
	});

	it('should not show a status indicator if not provided', () => {
		render(<Avatar testId={'avatar'} />);

		expect(screen.queryByTestId('avatar--status')).not.toBeInTheDocument();
	});

	it('should show a status indicator if provided', () => {
		render(<Avatar testId={'avatar'} status="approved" />);

		expect(screen.getByTestId('avatar--status')).toBeInTheDocument();
	});

	it('should remove status from the accessibility tree', () => {
		render(<Avatar testId={'avatar'} status="declined" />);

		expect(screen.queryByTestId('avatar--status')).toHaveAttribute('aria-hidden', 'true');
	});

	it('should show a custom status indicator if provided', () => {
		const MyComponent: FC = () => <div data-testid="custom-status">yo</div>;

		render(<Avatar testId={'avatar'} status={<MyComponent />} />);
		const element = screen.getByTestId('custom-status');

		expect(element.tagName).toEqual('DIV');
	});

	it('should show only a status indicator if both presence and status are provided', () => {
		render(<Avatar testId={'avatar'} presence="busy" status="declined" />);

		expect(screen.getByTestId('avatar--status')).toBeInTheDocument();
		expect(screen.queryByTestId('avatar--presence')).not.toBeInTheDocument();
	});

	it('should NOT output an aria-label on SPAN tag', () => {
		render(<Avatar testId={'avatar'} label="Test avatar" />);
		const element = screen.getByTestId('avatar--inner');

		expect(element.tagName).toEqual('SPAN');
		expect(element).not.toHaveAttribute('aria-label');
	});

	it('should output an aria-label on A tag', () => {
		render(
			<Avatar testId={'avatar'} href={'https://atlaskit.atlassian.com/'} label="Test avatar" />,
		);
		const element = screen.getByTestId('avatar--inner');

		expect(element.tagName).toEqual('A');
		expect(element).toHaveAttribute('aria-label', 'Test avatar');
	});

	it('should output an aria-label on BUTTON tag', () => {
		render(<Avatar testId={'avatar'} onClick={__noop} label="Test avatar" />);
		const element = screen.getByTestId('avatar--inner');

		expect(element.tagName).toEqual('BUTTON');
		expect(element).toHaveAttribute('aria-label', 'Test avatar');
	});

	it('should render a wrapping div element by default', () => {
		render(<Avatar name="Alexander Nevermind" testId={'avatar'} onClick={__noop} />);
		const avatar = screen.getByTestId('avatar');

		expect(avatar.tagName).toEqual('DIV');
	});

	it('should render a wrapping span element if supplied by the as prop', () => {
		render(<Avatar testId={'avatar'} as="span" />);
		const avatar = screen.getByTestId('avatar');

		expect(avatar.tagName).toEqual('SPAN');
	});

	describe('avatar context', () => {
		it('should pass down size values from the provider into the avatar', () => {
			const withContext = 'With Context';
			const withContextSize: SizeType = 'xlarge';
			const noContext = 'No Context';
			const noContextSize: SizeType = 'small';

			render(
				<div>
					<Avatar name={noContext} size={noContextSize} testId={noContextSize} />
					<AvatarContext.Provider value={{ size: withContextSize }}>
						<Avatar name={withContext} testId={withContextSize} />
					</AvatarContext.Provider>
				</div>,
			);

			const avatarNoContext = screen.getByTestId(`${noContextSize}--inner`);
			const avatarWithContext = screen.getByTestId(`${withContextSize}--inner`);

			expect(avatarNoContext).toBeInTheDocument();
			expect(avatarNoContext).toHaveStyleDeclaration('height', `${AVATAR_SIZES[noContextSize]}px`);
			expect(avatarNoContext).toHaveStyleDeclaration('width', `${AVATAR_SIZES[noContextSize]}px`);

			expect(avatarWithContext).toBeInTheDocument();
			expect(avatarWithContext).toHaveStyleDeclaration(
				'height',
				`${AVATAR_SIZES[withContextSize]}px`,
			);
			expect(avatarWithContext).toHaveStyleDeclaration(
				'width',
				`${AVATAR_SIZES[withContextSize]}px`,
			);
		});

		it('should always prefer the provided prop value over the context value', () => {
			const withContext = 'With Context';
			const withContextSize: SizeType = 'xlarge';
			const providedSize: SizeType = 'small';

			render(
				<div>
					<AvatarContext.Provider value={{ size: withContextSize }}>
						<Avatar name={withContext} size={providedSize} testId={withContextSize} />
					</AvatarContext.Provider>
				</div>,
			);

			const avatarWithContext = screen.getByTestId(`${withContextSize}--inner`);

			expect(avatarWithContext).toBeInTheDocument();
			expect(avatarWithContext).toHaveStyleDeclaration('height', `${AVATAR_SIZES[providedSize]}px`);
			expect(avatarWithContext).toHaveStyleDeclaration('width', `${AVATAR_SIZES[providedSize]}px`);
			expect(avatarWithContext).not.toHaveStyleDeclaration(
				'height',
				`${AVATAR_SIZES[withContextSize]}px`,
			);
			expect(avatarWithContext).not.toHaveStyleDeclaration(
				'width',
				`${AVATAR_SIZES[withContextSize]}px`,
			);
		});
	});
});
