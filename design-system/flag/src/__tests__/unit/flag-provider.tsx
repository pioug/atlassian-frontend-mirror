import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';
import { Box } from '@atlaskit/primitives/compiled';

import { type CreateFlagArgs, type DismissFn, FlagsProvider, useFlags } from '../../index';

jest.mock('@atlaskit/motion', () => {
	const actualMotion = jest.requireActual('@atlaskit/motion');
	return {
		...actualMotion,
		ExitingPersistence: ({ children }: any) => children,
	};
});

const getUniqueId = (() => {
	let count: number = 0;
	return () => `flag-provider-unique-id:${count++}`;
})();

const Consumer = (props: Partial<CreateFlagArgs>) => {
	const { showFlag } = useFlags();
	const show = (): void => {
		showFlag({
			id: getUniqueId(),
			title: 'title',
			description: 'description',
			icon: <Box />,
			testId: 'flag',
			...props,
		});
	};
	return (
		<button type="button" onClick={show}>
			show
		</button>
	);
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('flag provider', () => {
	it('should render children', () => {
		render(<FlagsProvider>child</FlagsProvider>);
		expect(screen.getByText('child')).toBeInTheDocument();
	});

	it('should render 3 flags', () => {
		render(
			<FlagsProvider>
				<Consumer />
			</FlagsProvider>,
		);
		const showFlagButton = screen.getByText('show');
		fireEvent.click(showFlagButton);
		fireEvent.click(showFlagButton);
		fireEvent.click(showFlagButton);

		expect(screen.queryAllByText('title')).toHaveLength(3);
	});

	it('should dismiss the 2nd flag and only render 1 when directly closing the flag', () => {
		jest.useFakeTimers();
		render(
			<FlagsProvider>
				<Consumer />
			</FlagsProvider>,
		);
		const showFlagButton = screen.getByText('show');
		fireEvent.click(showFlagButton);
		fireEvent.click(showFlagButton);
		fireEvent.click(screen.getByTestId('flag-dismiss'));

		act(() => {
			jest.runAllTimers();
		});
		expect(screen.queryAllByText('title')).toHaveLength(1);
		jest.useRealTimers();
	});

	describe('hideFlag', () => {
		function setup() {
			const apiRef = React.createRef<ReturnType<typeof useFlags>>();
			function App() {
				(apiRef as React.MutableRefObject<ReturnType<typeof useFlags>>).current = useFlags();
				return null;
			}
			render(
				<FlagsProvider>
					<App />
				</FlagsProvider>,
			);
			return apiRef;
		}

		it('dismisses the flag matching the supplied id', () => {
			const apiRef = setup();
			act(() => {
				apiRef.current?.showFlag({ id: 'a', title: 'title-a', icon: <Box /> });
				apiRef.current?.showFlag({ id: 'b', title: 'title-b', icon: <Box /> });
			});
			expect(screen.queryAllByText(/title/)).toHaveLength(2);

			act(() => {
				apiRef.current?.hideFlag('a');
			});

			expect(screen.queryByText('title-a')).not.toBeInTheDocument();
			expect(screen.getByText('title-b')).toBeInTheDocument();
		});

		it('is a no-op when called with an id that is not currently shown', () => {
			const apiRef = setup();
			act(() => {
				apiRef.current?.showFlag({ id: 'a', title: 'title-a', icon: <Box /> });
			});
			expect(screen.getByText('title-a')).toBeInTheDocument();

			act(() => {
				apiRef.current?.hideFlag('does-not-exist');
			});

			expect(screen.getByText('title-a')).toBeInTheDocument();
		});

		it('leaves focus on the trigger unchanged whether the flag is dismissed via hideFlag or via the DismissFn from showFlag (focus outside the flag group)', () => {
			function renderApp() {
				const apiRef = React.createRef<ReturnType<typeof useFlags>>();
				function App() {
					(apiRef as React.MutableRefObject<ReturnType<typeof useFlags>>).current = useFlags();
					return (
						<button type="button" data-testid="outside">
							outside
						</button>
					);
				}
				const { unmount } = render(
					<FlagsProvider>
						<App />
					</FlagsProvider>,
				);
				return { apiRef, unmount };
			}

			const view = renderApp();
			let dismissFn: (() => void) | undefined;
			act(() => {
				dismissFn = view.apiRef.current?.showFlag({
					id: 'a',
					title: 'title-a',
					icon: <Box />,
				});
			});
			const outsideA = screen.getByTestId('outside');
			outsideA.focus();
			act(() => {
				dismissFn?.();
			});
			expect(outsideA).toHaveFocus();
			view.unmount();

			const utils = renderApp();
			act(() => {
				utils.apiRef.current?.showFlag({ id: 'a', title: 'title-a', icon: <Box /> });
			});
			const outsideB = screen.getByTestId('outside');
			outsideB.focus();
			act(() => {
				utils.apiRef.current?.hideFlag('a');
			});
			expect(outsideB).toHaveFocus();
		});

		it('produces matching focus state after dismissal when focus was INSIDE the dismissed flag (hideFlag and DismissFn parity)', () => {
			function renderApp() {
				const apiRef = React.createRef<ReturnType<typeof useFlags>>();
				function App() {
					(apiRef as React.MutableRefObject<ReturnType<typeof useFlags>>).current = useFlags();
					return null;
				}
				const { unmount } = render(
					<FlagsProvider>
						<App />
					</FlagsProvider>,
				);
				return { apiRef, unmount };
			}

			const view = renderApp();
			let dismissFn: (() => void) | undefined;
			act(() => {
				dismissFn = view.apiRef.current?.showFlag({
					id: 'a',
					title: 'title-a',
					icon: <Box />,
					testId: 'flag-a',
				});
			});
			const dismissBtnA = screen.getByTestId('flag-a-dismiss');
			dismissBtnA.focus();
			expect(dismissBtnA).toHaveFocus();
			act(() => {
				dismissFn?.();
			});
			expect(screen.queryByTestId('flag-a-dismiss')).not.toBeInTheDocument();
			view.unmount();

			const utils = renderApp();
			act(() => {
				utils.apiRef.current?.showFlag({
					id: 'a',
					title: 'title-a',
					icon: <Box />,
					testId: 'flag-a',
				});
			});
			const dismissBtnB = screen.getByTestId('flag-a-dismiss');
			dismissBtnB.focus();
			expect(dismissBtnB).toHaveFocus();
			act(() => {
				utils.apiRef.current?.hideFlag('a');
			});
			expect(screen.queryByTestId('flag-a-dismiss')).not.toBeInTheDocument();
		});

		it('leaves focus on a sibling flag unchanged whether dismissal is via hideFlag or DismissFn', () => {
			function renderApp() {
				const apiRef = React.createRef<ReturnType<typeof useFlags>>();
				const dismissRefs: Array<(() => void) | undefined> = [];
				function App() {
					(apiRef as React.MutableRefObject<ReturnType<typeof useFlags>>).current = useFlags();
					return null;
				}
				const { unmount } = render(
					<FlagsProvider>
						<App />
					</FlagsProvider>,
				);
				return { apiRef, dismissRefs, unmount };
			}

			const view = renderApp();
			act(() => {
				view.dismissRefs[0] = view.apiRef.current?.showFlag({
					id: 'a',
					title: 'title-a',
					icon: <Box />,
					testId: 'flag-a',
				});
				view.dismissRefs[1] = view.apiRef.current?.showFlag({
					id: 'b',
					title: 'title-b',
					icon: <Box />,
					testId: 'flag-b',
				});
			});
			const survivingDismissA = screen.getByTestId('flag-b-dismiss');
			survivingDismissA.focus();
			act(() => {
				view.dismissRefs[0]?.();
			});
			expect(survivingDismissA).toHaveFocus();
			view.unmount();

			const utils = renderApp();
			act(() => {
				utils.apiRef.current?.showFlag({
					id: 'a',
					title: 'title-a',
					icon: <Box />,
					testId: 'flag-a',
				});
				utils.apiRef.current?.showFlag({
					id: 'b',
					title: 'title-b',
					icon: <Box />,
					testId: 'flag-b',
				});
			});
			const survivingDismissB = screen.getByTestId('flag-b-dismiss');
			survivingDismissB.focus();
			act(() => {
				utils.apiRef.current?.hideFlag('a');
			});
			expect(survivingDismissB).toHaveFocus();
		});
	});
});

describe('flags-renderer', () => {
	it('should render two flags', () => {
		let showFlag: (args: CreateFlagArgs) => DismissFn = () => noop;
		function App() {
			const result = useFlags();
			showFlag = result.showFlag;
			return null;
		}
		render(
			<FlagsProvider>
				<App />
			</FlagsProvider>,
		);
		act(() => {
			showFlag({
				title: 'title1',
				icon: <Box />,
			});
			showFlag({
				title: 'title2',
				icon: <Box />,
			});
		});
		expect(screen.queryAllByText(/title/)).toHaveLength(2);
	});

	it('should dismiss the first flag', () => {
		let showFlag: (args: CreateFlagArgs) => DismissFn = () => noop;
		function App() {
			const result = useFlags();
			showFlag = result.showFlag;
			return null;
		}

		render(
			<FlagsProvider>
				<App />
			</FlagsProvider>,
		);
		let dismissFirstFlag: DismissFn = noop;
		act(() => {
			dismissFirstFlag = showFlag({
				id: 'id1',
				title: 'title1',
				icon: <Box />,
			});
			showFlag({
				id: 'id2',
				title: 'title2',
				icon: <Box />,
			});
		});
		act(() => {
			dismissFirstFlag();
		});
		expect(screen.queryAllByText(/title/)).toHaveLength(1);
		expect(screen.getByText('title2')).toBeInTheDocument();
	});

	it('should dismiss the second flag', () => {
		let showFlag: (args: CreateFlagArgs) => DismissFn = () => noop;
		function App() {
			const result = useFlags();
			showFlag = result.showFlag;
			return null;
		}
		render(
			<FlagsProvider>
				<App />
			</FlagsProvider>,
		);
		act(() => {
			showFlag({
				title: 'title1',
				icon: <Box />,
			});
			const dismissFlag = showFlag({
				title: 'title2',
				icon: <Box />,
			});
			dismissFlag();
		});
		expect(screen.queryAllByText(/title/)).toHaveLength(1);
		expect(screen.getByText('title1')).toBeInTheDocument();
	});

	it('should not submit multiple flags if the id is a duplicate', () => {
		let showFlag: (args: CreateFlagArgs) => DismissFn = () => noop;
		function App() {
			const result = useFlags();
			showFlag = result.showFlag;
			return null;
		}
		render(
			<FlagsProvider>
				<App />
			</FlagsProvider>,
		);
		act(() => {
			showFlag({
				id: 'duplicate-id',
				title: 'title1',
				icon: <Box />,
			});
			showFlag({
				id: 'duplicate-id',
				title: 'title2',
				icon: <Box />,
			});
		});
		expect(screen.queryAllByText(/title/)).toHaveLength(1);
	});
});
