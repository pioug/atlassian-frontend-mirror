import React from 'react';

import { Box } from '@atlaskit/primitives/compiled/box';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { screen } from '@atlassian/testing-library/screen';
import { fireEvent, render, waitFor } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { expectElementWithText } from '../../../../../__tests__/__utils__/unit-helpers';
import { ExpandedFrame } from '../../../components/ExpandedFrame';

describe('ExpandedFrame', () => {
	const experiment = 'platform_editor_embed_open_in_new_tab';

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<ExpandedFrame icon={<span data-testid="icon" />} isPlaceholder={true} />,
		);

		await expect(container).toBeAccessible();
	});

	it('should render an icon when provided', async () => {
		render(<ExpandedFrame icon={<span data-testid="icon" />} />);
		expect(await screen.findByTestId('icon')).toBeInTheDocument();
	});

	it('should not render text when isPlaceholder=true', async () => {
		render(<ExpandedFrame text="foobar" isPlaceholder={true} />);
		await expectElementWithText('expanded-frame', '');
	});

	it('should render text when isPlaceholder=false', async () => {
		render(<ExpandedFrame text="foobar" isPlaceholder={false} />);
		await expectElementWithText('expanded-frame', 'foobar');
	});

	it.each([true, false])(
		'applies the header pointer cursor only when navigation is enabled: %s',
		(enabled) => {
			if (enabled) {
				mockExpEnabled(experiment);
			} else {
				mockExpDisabled(experiment);
			}
			render(
				<ExpandedFrame text="Link title" href="https://example.com">
					<a href="https://example.com/content">Content link</a>
				</ExpandedFrame>,
			);

			const headerLink = screen.getByRole('link', { name: 'Link title' });
			if (enabled) {
				expect(headerLink).toHaveCompiledCss({ cursor: 'pointer' });
			} else {
				expect(headerLink).not.toHaveCompiledCss({ cursor: 'pointer' });
			}
			expect(screen.getByRole('link', { name: 'Content link' })).not.toHaveCompiledCss({
				cursor: 'pointer',
			});
		},
	);

	it('does not apply navigation styles when the frame has no destination', () => {
		mockExpEnabled(experiment);
		render(<ExpandedFrame text="Link title" />);

		const title = screen.getByText('Link title');
		expect(title).not.toHaveCompiledCss({ cursor: 'pointer' });
		expect(title).not.toHaveCompiledCss('position', 'absolute', { target: ':after' });
	});

	it('stretches the title anchor across the frame for native link actions', () => {
		mockExpEnabled(experiment);
		render(<ExpandedFrame text="Link title" href="https://example.com" />);

		const titleLink = screen.getByRole('link', { name: 'Link title' });
		expect(titleLink).toHaveCompiledCss('position', 'absolute', { target: ':after' });
		expect(titleLink).toHaveCompiledCss('top', '0', { target: ':after' });
		expect(titleLink).toHaveCompiledCss('right', '0', { target: ':after' });
		expect(titleLink).toHaveCompiledCss('bottom', '0', { target: ':after' });
		expect(titleLink).toHaveCompiledCss('left', '0', { target: ':after' });
		expect(titleLink).toHaveCompiledCss('z-index', '-1', { target: ':after' });
	});

	it('should not allow scrolling when allowScrolling is undefined', async () => {
		render(<ExpandedFrame />);
		expect(await screen.findByTestId('embed-content-wrapper')).toHaveCompiledCss({
			'overflow-x': 'hidden',
			'overflow-y': 'hidden',
		});
	});

	it('should not allow scrolling when allowScrolling is false', async () => {
		render(<ExpandedFrame allowScrollBar={false} setOverflow={true} />);
		expect(await screen.findByTestId('embed-content-wrapper')).toHaveCompiledCss({
			'overflow-x': 'hidden',
			'overflow-y': 'hidden',
		});
	});

	it('should allow scrolling when allowScrolling is true', async () => {
		render(<ExpandedFrame allowScrollBar={true} />);
		expect(await screen.findByTestId('embed-content-wrapper')).toHaveCompiledCss({
			'overflow-x': 'auto',
			'overflow-y': 'auto',
		});
	});

	it('should allow scrolling when allowScrolling is true and setOverflow is true', async () => {
		render(<ExpandedFrame allowScrollBar={true} setOverflow={true} />);
		expect(await screen.findByTestId('embed-content-wrapper')).toHaveCompiledCss({
			'overflow-x': 'auto',
			'overflow-y': 'auto',
		});
	});

	it('should not set overflow property when setOverflow is false', async () => {
		render(<ExpandedFrame allowScrollBar={false} setOverflow={false} />);
		expect(await screen.findByTestId('embed-content-wrapper')).not.toHaveCompiledCss({
			'overflow-x': expect.any(String),
			'overflow-y': expect.any(String),
		});
	});
	it('should not allow scrolling (or clip content) when setOverflow is false even if allowScrollBar is true', async () => {
		render(<ExpandedFrame allowScrollBar={true} setOverflow={false} />);
		expect(await screen.findByTestId('embed-content-wrapper')).not.toHaveCompiledCss({
			'overflow-x': expect.any(String),
			'overflow-y': expect.any(String),
		});
	});

	it('should clip content and not allow scrolling when setOverflow is true and allowScrollBar is false', async () => {
		render(<ExpandedFrame allowScrollBar={false} setOverflow={true} />);
		expect(await screen.findByTestId('embed-content-wrapper')).toHaveCompiledCss({
			'overflow-x': 'hidden',
			'overflow-y': 'hidden',
		});
	});

	it('should not render header and frame when frameStyle = "hide" & href is provided', async () => {
		render(<ExpandedFrame frameStyle="hide" href="some.url" text="some text" />);
		expect(await screen.findByTestId('expanded-frame')).toBeDefined();
		expect(screen.queryByRole('link', { name: 'some text' })).not.toBeInTheDocument();
	});

	it('should not render header and frame when frameStyle = "hide" & placeholder is true', async () => {
		render(
			<ExpandedFrame
				frameStyle="hide"
				icon={<span data-testid="header-icon" />}
				isPlaceholder={true}
			/>,
		);
		expect(await screen.findByTestId('expanded-frame')).toBeDefined();
		expect(screen.queryByTestId('header-icon')).not.toBeInTheDocument();
	});

	it('No tooltip is rendered by default', () => {
		render(<ExpandedFrame text="foobar" isPlaceholder={false} />);
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('Tooltip is rendered when hovered', async () => {
		const user = userEvent.setup();
		render(<ExpandedFrame text="foobar" isPlaceholder={false} />);
		const header = await screen.findByText('foobar');

		await user.hover(header);

		await waitFor(() => {
			expect(screen.getByRole('tooltip', { name: 'foobar' })).toBeInTheDocument();
		});
	});

	it('Tooltip is not rendered when not hovered', async () => {
		render(<ExpandedFrame text="foobar" isPlaceholder={false} />);
		const header = await screen.findByText('foobar');

		await userEvent.hover(header);
		await userEvent.unhover(header);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('routes modified clicks from the header and middle-clicks from frame chrome', () => {
		mockExpEnabled(experiment);
		const onClick = jest.fn();
		render(
			<ExpandedFrame
				icon={<span data-testid="frame-icon" />}
				text="Link title"
				href="https://example.com"
				isPlaceholder={false}
				onClick={onClick}
			/>,
		);

		const frame = screen.getByTestId('expanded-frame');
		fireEvent.click(screen.getByTestId('frame-icon'), { metaKey: true });
		fireEvent.click(screen.getByTestId('frame-icon'), { ctrlKey: true });
		fireEvent.click(frame, { metaKey: true });
		expect(onClick).toHaveBeenCalledTimes(3);

		fireEvent(frame, new MouseEvent('auxclick', { button: 1, bubbles: true, cancelable: true }));

		expect(onClick).toHaveBeenCalledTimes(4);
	});

	it('routes a modifier click on the title anchor exactly once', () => {
		mockExpEnabled(experiment);
		const onClick = jest.fn((event: React.MouseEvent) => event.preventDefault());
		render(<ExpandedFrame text="Link title" href="https://example.com" onClick={onClick} />);

		fireEvent.click(screen.getByRole('link', { name: 'Link title' }), { metaKey: true });

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it.each([
		{
			gesture: 'modifier click',
			event: new MouseEvent('click', { metaKey: true, bubbles: true, cancelable: true }),
		},
		{
			gesture: 'middle-click',
			event: new MouseEvent('auxclick', { button: 1, bubbles: true, cancelable: true }),
		},
	])('routes a $gesture on the header background exactly once', ({ event }) => {
		mockExpEnabled(experiment);
		const onClick = jest.fn();
		render(<ExpandedFrame text="Link title" href="https://example.com" onClick={onClick} />);

		const header = screen.getByText('Link title').closest('.embed-header');
		if (!header) {
			throw new Error('Expected the title to be inside the embed header');
		}
		fireEvent(header, event);

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('routes unmodified double-clicks from frame chrome and the title link', async () => {
		mockExpEnabled(experiment);
		const onClick = jest.fn();
		render(
			<ExpandedFrame
				icon={<span data-testid="frame-icon" />}
				text="Link title"
				href="https://example.com"
				isPlaceholder={false}
				onClick={onClick}
			/>,
		);

		await userEvent.dblClick(screen.getByTestId('expanded-frame'));
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick.mock.calls[0][0].type).toBe('dblclick');

		onClick.mockClear();
		await userEvent.dblClick(screen.getByRole('link', { name: 'Link title' }));
		expect(onClick.mock.calls.filter(([event]) => event.type === 'dblclick')).toHaveLength(1);
	});

	it('does not route double-clicks from header controls or embed content', async () => {
		mockExpEnabled(experiment);
		const onClick = jest.fn();
		const CompetitorPrompt = () => <button data-testid="header-control">Open menu</button>;
		const { getByTestId } = render(
			<ExpandedFrame
				text="Link title"
				href="https://example.com"
				isPlaceholder={false}
				onClick={onClick}
				CompetitorPrompt={CompetitorPrompt}
			>
				<button data-testid="embed-control">Inside embed content</button>
				<span data-testid="embed-background">Embed background</span>
			</ExpandedFrame>,
		);

		await userEvent.dblClick(getByTestId('header-control'));
		await userEvent.dblClick(getByTestId('embed-control'));
		await userEvent.dblClick(getByTestId('embed-background'));

		expect(onClick).not.toHaveBeenCalled();
	});

	it.each([
		{ modifier: 'Shift', eventOptions: { shiftKey: true } },
		{ modifier: 'Alt', eventOptions: { altKey: true } },
	])('does not route $modifier double-clicks', ({ eventOptions }) => {
		mockExpEnabled(experiment);
		const onClick = jest.fn();
		render(
			<ExpandedFrame
				text="Link title"
				href="https://example.com"
				isPlaceholder={false}
				onClick={onClick}
			/>,
		);

		fireEvent(
			screen.getByTestId('expanded-frame'),
			new MouseEvent('dblclick', {
				...eventOptions,
				button: 0,
				bubbles: true,
				cancelable: true,
				detail: 2,
			}),
		);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('does not route double-click events whose detail is not two', () => {
		mockExpEnabled(experiment);
		const onClick = jest.fn();
		render(
			<ExpandedFrame
				text="Link title"
				href="https://example.com"
				isPlaceholder={false}
				onClick={onClick}
			/>,
		);

		fireEvent(
			screen.getByTestId('expanded-frame'),
			new MouseEvent('dblclick', { button: 0, bubbles: true, cancelable: true, detail: 1 }),
		);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('stops eligible mousedown before native editor listeners while leaving controls and embed content alone', () => {
		mockExpEnabled(experiment);
		const CompetitorPrompt = () => (
			<>
				<a href="#competitor" role="link" tabIndex={-1} data-testid="header-link">
					Open competitor link
				</a>
				<button data-testid="header-control">Open menu</button>
			</>
		);
		const { getByTestId } = render(
			<div contentEditable suppressContentEditableWarning>
				<ExpandedFrame
					icon={<span data-testid="frame-icon" />}
					text="Link title"
					href="https://example.com"
					isPlaceholder={false}
					CompetitorPrompt={CompetitorPrompt}
				>
					<button data-testid="embed-control">Inside embed content</button>
					<span data-testid="embed-background">Embed background</span>
				</ExpandedFrame>
			</div>,
		);
		const nativeParentMouseDown = jest.fn();
		getByTestId('expanded-frame').parentElement?.addEventListener(
			'mousedown',
			nativeParentMouseDown,
		);

		fireEvent.mouseDown(getByTestId('frame-icon'), { metaKey: true });
		expect(nativeParentMouseDown).not.toHaveBeenCalled();

		fireEvent.mouseDown(getByTestId('header-control'), { metaKey: true });
		fireEvent.mouseDown(getByTestId('header-link'), { metaKey: true });
		fireEvent.mouseDown(getByTestId('embed-control'), { metaKey: true });
		fireEvent.mouseDown(getByTestId('embed-background'), { metaKey: true });
		fireEvent.mouseDown(getByTestId('frame-icon'), { button: 2, metaKey: true });
		expect(nativeParentMouseDown).toHaveBeenCalledTimes(5);
	});

	it('preserves the title anchor native middle-click and nested control handlers', () => {
		mockExpEnabled(experiment);
		const onClick = jest.fn();
		const onAuxClick = jest.fn();
		const onHeaderLinkClick = jest.fn();
		const CompetitorPrompt = () => (
			<a
				href="#competitor"
				role="link"
				tabIndex={-1}
				data-testid="header-link"
				onClick={onHeaderLinkClick}
			>
				Open competitor link
			</a>
		);
		render(
			<ExpandedFrame
				icon={<span data-testid="frame-icon" />}
				text="Link title"
				href="https://example.com"
				isPlaceholder={false}
				onClick={onClick}
				onAuxClick={onAuxClick}
				CompetitorPrompt={CompetitorPrompt}
			>
				<button data-testid="embed-control">Inside embed content</button>
				<span data-testid="embed-background">Embed background</span>
			</ExpandedFrame>,
		);

		const auxClick = new MouseEvent('auxclick', { button: 1, bubbles: true, cancelable: true });
		fireEvent(screen.getByRole('link', { name: 'Link title' }), auxClick);
		fireEvent.click(screen.getByTestId('header-link'), { metaKey: true });
		fireEvent.click(screen.getByTestId('embed-control'), { metaKey: true });
		fireEvent.click(screen.getByTestId('embed-background'), { metaKey: true });

		expect(onAuxClick).toHaveBeenCalledTimes(1);
		expect(onHeaderLinkClick).toHaveBeenCalledTimes(1);
		expect(onClick).not.toHaveBeenCalled();
		expect(auxClick.defaultPrevented).toBe(false);
	});

	it('leaves chrome clicks unchanged when the experiment is disabled', () => {
		mockExpDisabled(experiment);
		const onClick = jest.fn();
		render(
			<ExpandedFrame
				icon={<span data-testid="frame-icon" />}
				text="Link title"
				href="https://example.com"
				isPlaceholder={false}
				onClick={onClick}
			/>,
		);

		fireEvent.click(screen.getByTestId('frame-icon'), { metaKey: true });
		const nativeParentMouseDown = jest.fn();
		screen
			.getByTestId('expanded-frame')
			.parentElement?.addEventListener('mousedown', nativeParentMouseDown);
		fireEvent.mouseDown(screen.getByTestId('frame-icon'), { metaKey: true });

		expect(onClick).not.toHaveBeenCalled();
		expect(nativeParentMouseDown).toHaveBeenCalledTimes(1);
	});

	it('prevents middle-button defaults only on frame chrome', () => {
		mockExpEnabled(experiment);
		render(
			<ExpandedFrame href="https://example.com" text="Link title">
				<span data-testid="embed-background">Embed background</span>
			</ExpandedFrame>,
		);
		const chromePress = new MouseEvent('mousedown', {
			button: 1,
			bubbles: true,
			cancelable: true,
		});
		const titlePress = new MouseEvent('mousedown', {
			button: 1,
			bubbles: true,
			cancelable: true,
		});
		const contentPress = new MouseEvent('mousedown', {
			button: 1,
			bubbles: true,
			cancelable: true,
		});

		fireEvent(screen.getByTestId('expanded-frame'), chromePress);
		fireEvent(screen.getByRole('link', { name: 'Link title' }), titlePress);
		fireEvent(screen.getByTestId('embed-background'), contentPress);

		expect(chromePress.defaultPrevented).toBe(true);
		expect(titlePress.defaultPrevented).toBe(false);
		expect(contentPress.defaultPrevented).toBe(false);
	});

	it('leaves a header control outside the tab order to its own handlers', () => {
		mockExpEnabled(experiment);
		const onClick = jest.fn();
		const onControlClick = jest.fn();
		const onControlMouseDown = jest.fn();
		const CompetitorPrompt = () => <span tabIndex={-1} data-testid="header-widget" />;
		render(
			<ExpandedFrame
				href="https://example.com"
				text="Link title"
				onClick={onClick}
				CompetitorPrompt={CompetitorPrompt}
			/>,
		);
		const control = screen.getByTestId('header-widget');
		control.addEventListener('click', onControlClick);
		control.addEventListener('mousedown', onControlMouseDown);

		fireEvent.mouseDown(control, { metaKey: true });
		fireEvent.click(control, { metaKey: true });

		expect(onControlMouseDown).toHaveBeenCalledTimes(1);
		expect(onControlClick).toHaveBeenCalledTimes(1);
		expect(onClick).not.toHaveBeenCalled();
	});

	it.each([
		{ gesture: 'modified primary', button: 0, metaKey: true },
		{ gesture: 'middle-button', button: 1, metaKey: false },
	])(
		'does not handle chrome gestures when the title link is hidden: $gesture',
		({ button, metaKey }) => {
			mockExpEnabled(experiment);
			const onClick = jest.fn();
			const { getByTestId } = render(
				<div>
					<ExpandedFrame href="https://example.com" frameStyle="hide" onClick={onClick} />
				</div>,
			);
			const nativeParentMouseDown = jest.fn();
			getByTestId('expanded-frame').parentElement?.addEventListener(
				'mousedown',
				nativeParentMouseDown,
			);

			const event = new MouseEvent('mousedown', {
				metaKey,
				button,
				bubbles: true,
				cancelable: true,
			});
			const frame = getByTestId('expanded-frame');
			fireEvent(frame, event);
			fireEvent.click(frame, { metaKey: true });
			fireEvent(frame, new MouseEvent('auxclick', { button: 1, bubbles: true, cancelable: true }));

			expect(nativeParentMouseDown).toHaveBeenCalledTimes(1);
			expect(event.defaultPrevented).toBe(false);
			expect(onClick).not.toHaveBeenCalled();
		},
	);

	it('does not stop modified mousedown without a navigable frame', () => {
		mockExpEnabled(experiment);
		const { getByTestId } = render(
			<div>
				<ExpandedFrame
					icon={<span data-testid="placeholder-icon" />}
					isPlaceholder={true}
					testId="placeholder-frame"
				/>
				<ExpandedFrame
					icon={<span data-testid="no-href-icon" />}
					isPlaceholder={false}
					testId="no-href-frame"
				/>
			</div>,
		);
		const nativeParentMouseDown = jest.fn();
		getByTestId('placeholder-frame').parentElement?.addEventListener(
			'mousedown',
			nativeParentMouseDown,
		);

		fireEvent.mouseDown(getByTestId('placeholder-icon'), { metaKey: true });
		fireEvent.mouseDown(getByTestId('no-href-icon'), { metaKey: true });

		expect(nativeParentMouseDown).toHaveBeenCalledTimes(2);
	});
});

describe('ExpandedFrame with CompetitorPrompt', () => {
	const CompetitorPrompt = () => <Box testId="competitor-prompt">Prompt</Box>;

	it('should render CompetitorPrompt when provided and conditions are met', async () => {
		render(
			<ExpandedFrame
				text="foobar"
				href="https://example.com"
				CompetitorPrompt={CompetitorPrompt}
				isPlaceholder={false}
			/>,
		);

		const competitorPrompt = await screen.findByTestId('competitor-prompt');
		expect(competitorPrompt).toBeInTheDocument();
		expect(competitorPrompt).toHaveTextContent('Prompt');
	});
});
