import Box from '@atlaskit/primitives/box';
import noop from '@atlaskit/ds-lib/noop';
import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

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
