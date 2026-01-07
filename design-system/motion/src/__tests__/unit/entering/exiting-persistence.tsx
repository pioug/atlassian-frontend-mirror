import React, { useEffect } from 'react';

import { act, render, screen, waitFor, within } from '@testing-library/react';

import ExitingPersistence from '../../../entering/exiting-persistence';
import KeyframesMotion from '../../../entering/keyframes-motion';
import { isReducedMotion } from '../../../utils/accessibility';

jest.mock('../../../utils/accessibility');

const Motion = ({ id, color, onRender }: { id: string; color?: string; onRender?: Function }) => {
	useEffect(() => {
		onRender?.();
	}, [onRender]);
	return (
		<KeyframesMotion animationTimingFunction="linear" duration="large" enteringAnimation="fade-in">
			{(props) => (
				<div {...props} data-testid={id} data-color={color}>
					hello, world
				</div>
			)}
		</KeyframesMotion>
	);
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<ExitingPersistence />', () => {
	beforeEach(() => {
		(isReducedMotion as jest.Mock).mockReturnValue(false);
	});
	afterEach(() => {
		jest.useRealTimers();
	});

	it('should not persist if reduced motion is preferred', () => {
		(isReducedMotion as jest.Mock).mockReturnValue(true);
		const { baseElement, rerender } = render(
			<ExitingPersistence>
				<Motion id="element" />
			</ExitingPersistence>,
		);

		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		expect(within(baseElement).queryByTestId('element')).not.toBeInTheDocument();
	});

	it('should persist a single child when being removed', () => {
		const { rerender } = render(
			<ExitingPersistence>
				<Motion id="element" />
			</ExitingPersistence>,
		);

		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		expect(screen.getByTestId('element')).toBeInTheDocument();
	});

	it('should remove the child once the exit motion is finished', () => {
		jest.useFakeTimers();
		const { baseElement, rerender } = render(
			<ExitingPersistence>
				<div>
					<Motion id="element" />
				</div>
			</ExitingPersistence>,
		);
		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		act(() => {
			jest.runAllTimers();
		});

		expect(within(baseElement).queryByTestId('element')).not.toBeInTheDocument();
	});

	it('should persist a removed child inside a list', () => {
		const { rerender } = render(
			<ExitingPersistence>
				{[
					<Motion id="element1" key="element1" />,
					<Motion id="element2" key="element2" />,
					<Motion id="element3" key="element3" />,
				]}
			</ExitingPersistence>,
		);

		rerender(
			<ExitingPersistence>
				{[<Motion id="element1" key="element1" />, <Motion id="element3" key="element3" />]}
			</ExitingPersistence>,
		);

		expect(screen.getByTestId('element2')).toBeInTheDocument();
	});

	it('should remove the child inside a list when the motion is finished', () => {
		jest.useFakeTimers();
		const { baseElement, rerender } = render(
			<ExitingPersistence>
				{[
					<Motion id="element1" key="element1" />,
					<Motion id="element2" key="element2" />,
					<Motion id="element3" key="element3" />,
				]}
			</ExitingPersistence>,
		);
		rerender(
			<ExitingPersistence>
				{[<Motion id="element1" key="element1" />, <Motion id="element3" key="element3" />]}
			</ExitingPersistence>,
		);

		act(() => {
			jest.runAllTimers();
		});

		expect(within(baseElement).queryByTestId('element2')).not.toBeInTheDocument();
	});

	it('should add back a child that was removed from the list in a previous render', () => {
		jest.useFakeTimers();
		const { rerender } = render(
			<ExitingPersistence>
				{[
					<Motion id="element1" key="Bitbucket" />,
					<Motion id="element2" key="Confluence" />,
					<Motion id="element3" key="Jira Service Management" />,
					<Motion id="element4" key="Jira Software" />,
					<Motion id="element5" key="Opsgenie" />,
					<Motion id="element6" key="Statuspage" />,
				]}
			</ExitingPersistence>,
		);
		rerender(
			<ExitingPersistence>
				{[
					<Motion id="element1" key="Bitbucket" />,
					<Motion id="element2" key="Confluence" />,
					<Motion id="element4" key="Jira Software" />,
					<Motion id="element5" key="Opsgenie" />,
					<Motion id="element6" key="Statuspage" />,
				]}
			</ExitingPersistence>,
		);
		act(() => {
			jest.runAllTimers();
		});

		rerender(
			<ExitingPersistence>
				{[
					<Motion id="element1" key="Bitbucket" />,
					<Motion id="element2" key="Confluence" />,
					<Motion id="element3" key="Jira Service Management" />,
					<Motion id="element4" key="Jira Software" />,
					<Motion id="element5" key="Opsgenie" />,
					<Motion id="element6" key="Statuspage" />,
				]}
			</ExitingPersistence>,
		);

		expect(screen.getByTestId('element3')).toBeInTheDocument();
	});

	it('should persist the child if it is replaced with another element', () => {
		const { rerender } = render(
			<ExitingPersistence>
				{[
					<Motion id="element1" key="element1" />,
					<Motion id="element2" key="element2" />,
					<Motion id="element3" key="element3" />,
				]}
			</ExitingPersistence>,
		);

		rerender(
			<ExitingPersistence>
				{[
					<Motion id="element1" key="element1" />,
					<Motion id="element3" key="element3" />,
					<Motion id="element4" key="element4" />,
				]}
			</ExitingPersistence>,
		);

		expect(screen.getByTestId('element2')).toBeInTheDocument();
	});

	it('should persist a list of children if they are all removed', () => {
		const { rerender } = render(
			<ExitingPersistence>
				{[
					<Motion id="element1" key="element1" />,
					<Motion id="element2" key="element2" />,
					<Motion id="element3" key="element3" />,
				]}
			</ExitingPersistence>,
		);

		rerender(<ExitingPersistence>{false}</ExitingPersistence>);

		expect(screen.getByTestId('element1')).toBeInTheDocument();
		expect(screen.getByTestId('element2')).toBeInTheDocument();
		expect(screen.getByTestId('element3')).toBeInTheDocument();
	});

	it('should ensure when persisting children other child elements are updated', async () => {
		const { rerender } = render(
			<ExitingPersistence>
				{[
					<Motion id="element1" key="element1" color="purple" />,
					<Motion id="element2" key="element2" color="red" />,
					<Motion id="element3" key="element3" color="blurple" />,
				]}
			</ExitingPersistence>,
		);

		rerender(
			<ExitingPersistence>
				{[
					<Motion id="element1" key="element1" color="blue" />,
					<Motion id="element3" key="element3" color="red" />,
				]}
			</ExitingPersistence>,
		);
		await waitFor(() =>
			expect(screen.getByTestId('element1')).toHaveAttribute('data-color', 'blue'),
		);
	});

	it('should persist a child when being removed when there are multiple conditional children', () => {
		const { rerender } = render(
			<ExitingPersistence>
				<Motion id="element1" />
				<Motion id="element2" />
				<Motion id="element3" />
			</ExitingPersistence>,
		);

		rerender(
			<ExitingPersistence>
				<Motion id="element1" />
				{false}
				<Motion id="element3" />
			</ExitingPersistence>,
		);

		expect(screen.getByTestId('element2')).toBeInTheDocument();
	});

	it('should remove a child when motion is finished when there are multiple conditional children', () => {
		jest.useFakeTimers();
		const { baseElement, rerender } = render(
			<ExitingPersistence>
				<Motion id="element1" />
				<Motion id="element2" />
				<Motion id="element3" />
			</ExitingPersistence>,
		);
		rerender(
			<ExitingPersistence>
				<Motion id="element1" />
				{false}
				<Motion id="element3" />
			</ExitingPersistence>,
		);

		act(() => {
			jest.runAllTimers();
		});

		expect(within(baseElement).queryByTestId('element2')).not.toBeInTheDocument();
	});

	it('should not remount other children when a child is persisted', () => {
		const UnmountCallback = (props: { onUnmount: () => void }) => {
			// We only want this to fire on mount and never again.
			// eslint-disable-next-line react-hooks/exhaustive-deps
			useEffect(() => () => props.onUnmount(), []);
			return <div />;
		};
		const callback = jest.fn();
		const { rerender } = render(
			<ExitingPersistence>
				<Motion id="element1" />
				<UnmountCallback onUnmount={callback} />
			</ExitingPersistence>,
		);

		rerender(
			<ExitingPersistence>
				<UnmountCallback onUnmount={callback} />
			</ExitingPersistence>,
		);

		expect(callback).not.toHaveBeenCalled();
	});

	it('should mount a new child at the same time as one is exiting', () => {
		const { rerender } = render(
			<ExitingPersistence>
				<Motion id="element1" key="1" />
			</ExitingPersistence>,
		);

		rerender(
			<ExitingPersistence>
				<Motion id="element2" key="2" />
			</ExitingPersistence>,
		);

		expect(screen.getByTestId('element2')).toBeInTheDocument();
	});

	it('should splice new children added at the same time as some are exiting', () => {
		const { container, rerender } = render(
			<ExitingPersistence>
				{[
					<Motion id="element1" key="element1" />,
					<Motion id="element2" key="element2" />,
					<Motion id="element3" key="element3" />,
				]}
			</ExitingPersistence>,
		);

		rerender(
			<ExitingPersistence>
				{[
					<Motion id="element1" key="element1" />,
					<Motion id="element2" key="element2" />,
					<Motion id="element4" key="element4" />,
				]}
			</ExitingPersistence>,
		);

		/**
		 * The children, in order, with <style> tags filtered out.
		 */
		// eslint-disable-next-line testing-library/no-node-access
		const nonStyleChildren = Array.from(container.children).filter(
			(child) => child.tagName !== 'STYLE',
		);

		expect(nonStyleChildren).toEqual([
			screen.getByTestId('element1'),
			screen.getByTestId('element2'),
			screen.getByTestId('element3'),
			screen.getByTestId('element4'),
		]);
	});

	it('should persist an element when switching to and from during an inflight motion', () => {
		jest.useFakeTimers();
		const { rerender } = render(
			<ExitingPersistence>
				<Motion id="element1" key="1" />
			</ExitingPersistence>,
		);

		rerender(
			<ExitingPersistence>
				<Motion id="element2" key="2" />
			</ExitingPersistence>,
		);
		jest.advanceTimersByTime(50);

		rerender(
			<ExitingPersistence>
				<Motion id="element1" key="1" />
			</ExitingPersistence>,
		);

		expect(screen.getByTestId('element1')).toBeInTheDocument();
		expect(screen.getByTestId('element2')).toBeInTheDocument();
	});

	it.skip('should persist exiting children when sequential exits happen during another exit motion', () => {
		jest.useFakeTimers();
		const { rerender } = render(
			<ExitingPersistence>
				{[
					<Motion id="element1" key="element1" />,
					<Motion id="element2" key="element2" />,
					<Motion id="element3" key="element3" />,
				]}
			</ExitingPersistence>,
		);

		rerender(
			<ExitingPersistence>
				{[<Motion id="element2" key="element2" />, <Motion id="element3" key="element3" />]}
			</ExitingPersistence>,
		);
		jest.advanceTimersByTime(99);
		rerender(<ExitingPersistence>{[<Motion id="element3" key="element3" />]}</ExitingPersistence>);
		jest.advanceTimersByTime(99);
		rerender(<ExitingPersistence>{[]}</ExitingPersistence>);
		jest.advanceTimersByTime(99);

		expect(screen.getByTestId('element1')).toBeInTheDocument();
		expect(screen.getByTestId('element2')).toBeInTheDocument();
		expect(screen.getByTestId('element3')).toBeInTheDocument();
	});

	it('should remove sequential exiting children after all inflight exits have finished', () => {
		jest.useFakeTimers();
		const { baseElement, rerender } = render(
			<ExitingPersistence>
				{[
					<Motion id="element1" key="element1" />,
					<Motion id="element2" key="element2" />,
					<Motion id="element3" key="element3" />,
				]}
			</ExitingPersistence>,
		);

		rerender(
			<ExitingPersistence>
				{[<Motion id="element2" key="element2" />, <Motion id="element3" key="element3" />]}
			</ExitingPersistence>,
		);
		act(() => {
			jest.advanceTimersByTime(99);
		});
		rerender(<ExitingPersistence>{[<Motion id="element3" key="element3" />]}</ExitingPersistence>);
		act(() => {
			jest.advanceTimersByTime(99);
		});
		rerender(<ExitingPersistence>{[]}</ExitingPersistence>);
		act(() => {
			jest.runAllTimers();
		});
		expect(within(baseElement).queryByTestId('element1')).not.toBeInTheDocument();
		expect(within(baseElement).queryByTestId('element2')).not.toBeInTheDocument();
		expect(within(baseElement).queryByTestId('element3')).not.toBeInTheDocument();
	});

	it('should remove exiting elements before entering new ones', () => {
		const { baseElement, rerender } = render(
			<ExitingPersistence exitThenEnter>
				<Motion id="element1" key="1" />
			</ExitingPersistence>,
		);

		rerender(
			<ExitingPersistence exitThenEnter>
				<Motion id="element2" key="2" />
			</ExitingPersistence>,
		);

		expect(within(baseElement).queryByTestId('element2')).not.toBeInTheDocument();
	});

	it('should render entering elements after exiting elements have left', () => {
		jest.useFakeTimers();
		const { rerender } = render(
			<ExitingPersistence exitThenEnter>
				<Motion id="element1" key="1" />
			</ExitingPersistence>,
		);
		rerender(
			<ExitingPersistence exitThenEnter>
				<Motion id="element2" key="2" />
			</ExitingPersistence>,
		);

		act(() => {
			jest.runAllTimers();
		});

		expect(screen.getByTestId('element2')).toBeInTheDocument();
	});

	it('should re-render once', () => {
		const onRender = jest.fn();
		const { rerender } = render(
			<ExitingPersistence>
				<Motion id="target" onRender={onRender} />
			</ExitingPersistence>,
		);

		rerender(
			<ExitingPersistence>
				<Motion id="target" onRender={onRender} />
			</ExitingPersistence>,
		);

		expect(onRender).toHaveBeenCalled();
	});

	it('should re-render non-exiting element once', () => {
		jest.useFakeTimers();
		const onRender = jest.fn();
		const { rerender } = render(
			<ExitingPersistence>
				<Motion id="persisted" onRender={onRender} />
				<Motion id="target" />
			</ExitingPersistence>,
		);

		rerender(
			<ExitingPersistence>
				<Motion id="persisted" onRender={onRender} />
				{false}
			</ExitingPersistence>,
		);
		act(() => {
			jest.runAllTimers();
		});

		expect(onRender).toHaveBeenCalled();
	});

	it('should allow child motions to appear on initial mount', () => {
		render(
			<ExitingPersistence appear>
				<KeyframesMotion
					enteringAnimation="fade-in"
					animationTimingFunction="linear"
					duration="small"
				>
					{(props) => <div {...props} data-testid="target" />}
				</KeyframesMotion>
			</ExitingPersistence>,
		);

		expect(screen.getByTestId('target')).toHaveCompiledCss('animation-duration', '.1s');
	});

	it('should immediately show child motions on initial mount', () => {
		render(
			<ExitingPersistence>
				<KeyframesMotion
					enteringAnimation="fade-in"
					animationTimingFunction="linear"
					duration="small"
				>
					{(props) => <div {...props} data-testid="target" />}
				</KeyframesMotion>
			</ExitingPersistence>,
		);

		expect(screen.getByTestId('target')).not.toHaveCompiledCss('animation-play-state', 'running');
	});

	it('should have child elements appear after the initial mount when initial mount was immediate', () => {
		const { rerender } = render(<ExitingPersistence>{false}</ExitingPersistence>);

		rerender(
			<ExitingPersistence>
				<KeyframesMotion
					enteringAnimation="fade-in"
					animationTimingFunction="linear"
					duration="small"
				>
					{(props) => <div {...props} data-testid="target" />}
				</KeyframesMotion>
			</ExitingPersistence>,
		);

		expect(screen.getByTestId('target')).toHaveCompiledCss('animation-duration', '.1s');
	});

	it('should have child elements appear after the initial mount when initial mount they appeared', () => {
		const { rerender } = render(<ExitingPersistence appear>{false}</ExitingPersistence>);

		rerender(
			<ExitingPersistence appear>
				<KeyframesMotion
					enteringAnimation="fade-in"
					animationTimingFunction="linear"
					duration="small"
				>
					{(props) => <div {...props} data-testid="target" />}
				</KeyframesMotion>
			</ExitingPersistence>,
		);

		expect(screen.getByTestId('target')).toHaveCompiledCss('animation-duration', '.1s');
	});

	it('should let motions appear by default outside of a exiting persistence', () => {
		render(
			<KeyframesMotion
				enteringAnimation="fade-in"
				animationTimingFunction="linear"
				duration="small"
			>
				{(props) => <div {...props} data-testid="target" />}
			</KeyframesMotion>,
		);

		expect(screen.getByTestId('target')).toHaveCompiledCss('animation-duration', '.1s');
	});
});
