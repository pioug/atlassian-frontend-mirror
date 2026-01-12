import React, { type FC } from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import cases from 'jest-in-case';

import { skipA11yAudit } from '@af/accessibility-testing';
import {
	type AnalyticsEventPayload,
	AnalyticsListener,
	UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';

import Avatar, { AvatarContent, AvatarContext, type SizeType } from '../../index';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;
const testId = 'testId';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Avatar', () => {
	beforeEach(() => {
		skipA11yAudit();
	});
	it('should render a span when neither onClick or href are supplied', () => {
		render(<Avatar testId={testId} />);

		expect(screen.getByTestId(`${testId}--inner`).tagName).toEqual('SPAN');
	});

	it('should render a button when onClick is supplied', () => {
		render(<Avatar name="Alexander Nevermind" testId={testId} onClick={() => null} />);

		expect(screen.getByTestId(`${testId}--inner`).tagName).toEqual('BUTTON');
	});

	it('should render a disabled button when using onClick', () => {
		render(<Avatar testId={testId} isDisabled name="Alexander Nevermind" onClick={() => null} />);
		const element = screen.getByTestId(`${testId}--inner`);

		expect(element.tagName).toEqual('BUTTON');
		expect(element).toBeDisabled();
	});

	it('should render a disabled button when using href', () => {
		render(
			<Avatar
				testId={testId}
				isDisabled
				href={'https://atlaskit.atlassian.com/'}
				name="Alexander Nevermind"
			/>,
		);
		const element = screen.getByTestId(`${testId}--inner`);

		expect(element.tagName).toEqual('BUTTON');
		expect(element).toBeDisabled();
	});

	it('should render an anchor when href is supplied', () => {
		render(
			<Avatar
				name="Alexander Nevermind"
				testId={testId}
				href={'https://atlaskit.atlassian.com/'}
			/>,
		);
		expect(screen.getByTestId(`${testId}--inner`).tagName).toEqual('A');
	});

	it('should render an anchor with appropriate rel attribute if target blank is supplied', () => {
		render(
			<Avatar
				testId={testId}
				href={'https://atlaskit.atlassian.com/'}
				name="Alexander Nevermind"
				target="_blank"
			/>,
		);
		const element = screen.getByTestId(`${testId}--inner`);

		expect(element.tagName).toEqual('A');
		expect(element).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('should render an anchor without rel attribute if target blank is not supplied', () => {
		render(
			<Avatar
				name="Alexander Nevermind"
				testId={testId}
				href={'https://atlaskit.atlassian.com/'}
			/>,
		);
		const element = screen.getByTestId(`${testId}--inner`);

		expect(element.tagName).toEqual('A');
		expect(element).not.toHaveAttribute('rel');
	});

	it('should call onClick with analytics event when clicked', async () => {
		const user = userEvent.setup();
		const onEvent = jest.fn();

		render(
			<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
				<Avatar
					testId={testId}
					name="Alexander Nevermind"
					onClick={(_, analyticsEvent) => analyticsEvent && analyticsEvent.fire()}
				/>
				,
			</AnalyticsListener>,
		);
		const element = screen.getByTestId(`${testId}--inner`);

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
				testId={testId}
				href={'https://atlaskit.atlassian.com/'}
				name="Alexander Nevermind"
				onClick={(event) => onClick(event)}
			/>,
		);

		const element = screen.getByTestId(`${testId}--inner`);
		await user.click(element);

		expect(onClick).toHaveBeenCalled();
	});

	it('should fire an event on the atlaskit channel', async () => {
		const user = userEvent.setup();
		const onEvent = jest.fn();
		const extraContext = { hello: 'world' };
		render(
			<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
				<Avatar
					testId={testId}
					name="Alexander Nevermind"
					onClick={(_, analyticsEvent) => analyticsEvent && analyticsEvent.fire()}
					analyticsContext={extraContext}
				/>
			</AnalyticsListener>,
		);
		const avatar: HTMLElement = screen.getByTestId(`${testId}--inner`);

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
					testId={testId}
					name="Alexander Nevermind"
					onClick={(_, analyticsEvent) => analyticsEvent && analyticsEvent.fire()}
				/>
			</AnalyticsListener>,
		);
		const avatar: HTMLElement = screen.getByTestId(`${testId}--inner`);

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
							testId={testId}
							name="Alexander Nevermind"
							onClick={(_, analyticsEvent) => analyticsEvent && analyticsEvent.fire()}
						/>
					</AnalyticsListener>
				</AnalyticsListener>
			);
		}
		render(<WithBoth />);
		const avatar: HTMLElement = screen.getByTestId(`${testId}--inner`);

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
		render(<Avatar name="Alexander Nevermind" testId={testId} onClick={onClick} />);

		const avatar: HTMLElement = screen.getByTestId(`${testId}--inner`);
		await user.click(avatar);

		expect(error).not.toHaveBeenCalled();
		error.mockRestore();
	});

	it('should not call onclick if disabled', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();

		render(<Avatar name="Alexander Nevermind" testId={testId} onClick={onClick} isDisabled />);
		const element = screen.getByTestId(`${testId}--inner`);

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

	it('should render a decorative image if `name` is not provided', () => {
		const imageSrc = 'data:image/png;base64,';

		render(<Avatar src={imageSrc} testId={testId} />);

		expect(screen.queryAllByRole('img')).toHaveLength(0);
		const image = screen.getByTestId(testId);
		expect(image).not.toHaveAccessibleName();
	});

	it('should render an image role if `name` is not provided but `status` or `presence` is provided', () => {
		const imageSrc = 'data:image/png;base64,';

		[{ presence: 'approved' }, { status: 'online' }].forEach((props) => {
			const { unmount } = render(<Avatar src={imageSrc} testId={testId} {...props} />);

			expect(screen.queryAllByRole('img')).toHaveLength(1);
			const image = screen.getByTestId(testId);
			expect(image).toHaveAccessibleName();
			unmount();
		});
	});

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
		render(<Avatar testId={testId} />);

		expect(screen.queryByTestId(`${testId}--presence`)).not.toBeInTheDocument();
	});

	it('should show a presence indicator if provided', () => {
		render(<Avatar testId={testId} presence="busy" />);

		expect(screen.getByTestId(`${testId}--presence`)).toBeInTheDocument();
	});

	it('should remove presence from the accessibility tree', () => {
		render(<Avatar testId={testId} presence="offline" />);

		expect(screen.queryByTestId(`${testId}--presence`)).toHaveAttribute('aria-hidden', 'true');
	});

	it('should show a custom presence indicator if provided', () => {
		const MyComponent: FC = () => <div data-testid="custom-presence">yo</div>;

		render(<Avatar testId={testId} presence={<MyComponent />} />);
		const element = screen.getByTestId('custom-presence');

		expect(element.tagName).toEqual('DIV');
	});

	it('should not show a status indicator if not provided', () => {
		render(<Avatar testId={testId} />);

		expect(screen.queryByTestId(`${testId}--status`)).not.toBeInTheDocument();
	});

	it('should show a status indicator if provided', () => {
		render(<Avatar testId={testId} status="approved" />);

		expect(screen.getByTestId(`${testId}--status`)).toBeInTheDocument();
	});

	it('should remove status from the accessibility tree', () => {
		render(<Avatar testId={testId} status="declined" />);

		expect(screen.queryByTestId(`${testId}--status`)).toHaveAttribute('aria-hidden', 'true');
	});

	it('should show a custom status indicator if provided', () => {
		const MyComponent: FC = () => <div data-testid="custom-status">yo</div>;

		render(<Avatar testId={testId} status={<MyComponent />} />);
		const element = screen.getByTestId('custom-status');

		expect(element.tagName).toEqual('DIV');
	});

	it('should show only a status indicator if both presence and status are provided', () => {
		render(<Avatar testId={testId} presence="busy" status="declined" />);

		expect(screen.getByTestId(`${testId}--status`)).toBeInTheDocument();
		expect(screen.queryByTestId(`${testId}--presence`)).not.toBeInTheDocument();
	});

	it('should NOT output an aria-label on SPAN tag', () => {
		render(<Avatar testId={testId} label="Test avatar" />);
		const element = screen.getByTestId(`${testId}--inner`);

		expect(element.tagName).toEqual('SPAN');
		expect(element).not.toHaveAttribute('aria-label');
	});

	it('should output an aria-label on A tag', () => {
		render(<Avatar testId={testId} href={'https://atlaskit.atlassian.com/'} label="Test avatar" />);
		const element = screen.getByTestId(`${testId}--inner`);

		expect(element.tagName).toEqual('A');
		expect(element).toHaveAttribute('aria-label', 'Test avatar');
	});

	it('should output an aria-label on BUTTON tag', () => {
		render(<Avatar testId={testId} onClick={__noop} label="Test avatar" />);
		const element = screen.getByTestId(`${testId}--inner`);

		expect(element.tagName).toEqual('BUTTON');
		expect(element).toHaveAttribute('aria-label', 'Test avatar');
	});

	it('should render a wrapping div element by default', () => {
		render(<Avatar name="Alexander Nevermind" testId={testId} onClick={__noop} />);
		const avatar = screen.getByTestId(testId);

		expect(avatar.tagName).toEqual('DIV');
	});

	it('should render a wrapping span element if supplied by the as prop', () => {
		render(<Avatar testId={testId} as="span" />);
		const avatar = screen.getByTestId(testId);

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
			expect(avatarNoContext).toHaveCompiledCss({ height: '24px' });
			expect(avatarNoContext).toHaveCompiledCss({ width: '24px' });

			expect(avatarWithContext).toBeInTheDocument();
			expect(avatarWithContext).toHaveCompiledCss({ height: '6pc' });
			expect(avatarWithContext).toHaveCompiledCss({ width: '6pc' });
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
			expect(avatarWithContext).toHaveCompiledCss({ height: '24px' });
			expect(avatarWithContext).toHaveCompiledCss({ width: '24px' });
			expect(avatarWithContext).not.toHaveCompiledCss({
				height: '6pc',
			});
			expect(avatarWithContext).not.toHaveCompiledCss({
				width: '6pc',
			});
		});
	});

	describe('AvatarContent composition', () => {
		it('should render custom avatar content when composed with AvatarContent', () => {
			render(
				<Avatar>
					<AvatarContent>
						<div data-testid="custom-content">ABC</div>
					</AvatarContent>
				</Avatar>,
			);
			expect(screen.getByTestId('custom-content')).toBeVisible();
		});

		it('should render the default avatar when composed with AvatarContent and AvatarContent does not have children', () => {
			render(
				<Avatar testId={testId}>
					<AvatarContent />
				</Avatar>,
			);
			expect(screen.getByTestId(testId)).toBeVisible();
		});

		it('should prefer the ref from AvatarContent over the ref from Avatar', () => {
			const ref = React.createRef<HTMLDivElement>();
			const refContent = React.createRef<HTMLDivElement>();

			render(
				<Avatar ref={ref}>
					<AvatarContent ref={refContent} />
				</Avatar>,
			);

			expect(ref.current).not.toBe(refContent.current);
		});

		it('should use the ref from Avatar if AvatarContent does not have a ref', () => {
			const ref = React.createRef<HTMLDivElement>();

			render(
				<Avatar ref={ref}>
					<AvatarContent />
				</Avatar>,
			);

			expect(ref.current).toBeVisible();
		});

		it('should throw an error when AvatarContent is not used within an Avatar component', () => {
			const consoleError = jest.spyOn(console, 'error').mockImplementation(__noop);
			expect(() => {
				render(
					<AvatarContent>
						<div>ABC</div>
					</AvatarContent>,
				);
			}).toThrowErrorMatchingInlineSnapshot(
				`"Avatar sub-components must be used within a Avatar component."`,
			);
			consoleError.mockRestore();
		});

		it('should call onClick with analytics event when a custom component is clicked', async () => {
			const user = userEvent.setup();
			const onEvent = jest.fn();

			render(
				<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
					<Avatar
						testId={testId}
						onClick={(_, analyticsEvent) => analyticsEvent && analyticsEvent.fire()}
					>
						<AvatarContent>Custom</AvatarContent>
					</Avatar>
				</AnalyticsListener>,
			);

			const element = screen.getByTestId(`${testId}--inner`);

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
	});
	it('should render avatar with aria-labelledby when isDecorative is false', () => {
		render(<Avatar name="Alexander Nevermind" testId={testId} presence="presence" />);
		const avatar = screen.getByTestId(testId);
		expect(avatar).toHaveAttribute('aria-labelledby');
	});
	it('should render avatar without aria-labelledby when isDecorative is true', () => {
		render(
			<Avatar name="Alexander Nevermind" testId={testId} presence="presence" isDecorative={true} />,
		);
		const avatar = screen.getByTestId(testId);
		expect(avatar).not.toHaveAttribute('aria-labelledby');
	});
});
