import React from 'react';
import { screen } from '@testing-library/react';
import {
	mockReactDomWarningGlobal,
	renderWithIntl,
	useFakeTimers,
} from '../__tests__/_testing-library';
import {
	Counter,
	RENDER_COUNTER_TESTID,
	type CounterProps,
	RENDER_LABEL_TESTID,
	RENDER_COMPONENT_WRAPPER,
} from './Counter';

jest.mock('@atlaskit/motion', () => {
	const actualMotion = jest.requireActual('@atlaskit/motion');
	return {
		...actualMotion,
		ExitingPersistence: ({ children }: any) => children,
	};
});

const renderCounter = (props: CounterProps) => {
	return renderWithIntl(<Counter {...props} />);
};

describe('@atlaskit/reactions/components/Counter', () => {
	mockReactDomWarningGlobal();
	useFakeTimers();

	it('should render counter', async () => {
		const value = 10;
		renderCounter({ value });
		const labelWrapper = await screen.findByTestId(RENDER_LABEL_TESTID);
		expect(labelWrapper).toBeInTheDocument();
		expect(labelWrapper.textContent).toEqual(value.toString());

		const wrapper = await screen.findByTestId(RENDER_COMPONENT_WRAPPER);
		expect(wrapper).toBeInTheDocument();
		expect(wrapper).toHaveCompiledCss('color', 'var(--ds-text-subtlest,#8993a4)');
	});

	it('should render counter with darker font if useDarkerFont is true', async () => {
		const value = 10;
		renderCounter({ value, useDarkerFont: true });
		const wrapper = await screen.findByTestId(RENDER_COMPONENT_WRAPPER);
		expect(wrapper).toBeInTheDocument();
		expect(wrapper).toHaveCompiledCss('color', 'var(--ds-text-subtle,#44546f)');
	});

	it('should render counter with margin top if useUpdatedStyles is true', async () => {
		const value = 10;
		renderCounter({ value, useUpdatedStyles: true });
		const wrapper = await screen.findByTestId(RENDER_COMPONENT_WRAPPER);
		expect(wrapper).toBeInTheDocument();
		expect(wrapper).toHaveCompiledCss('margin-top', 'var(--ds-space-025,2px)');
	});

	it('should render each number breakpoint', () => {
		renderCounter({ value: 100 });
		const count1 = screen.getByText('100');
		expect(count1).toBeDefined();

		renderCounter({ value: 1000 });
		const count2 = screen.getByText('1K');
		expect(count2).toBeDefined();

		renderCounter({ value: 1476 });
		const count3 = screen.getByText('1.4K');
		expect(count3).toBeDefined();

		renderCounter({ value: 18000 });
		const count4 = screen.getByText('18K');
		expect(count4).toBeDefined();

		renderCounter({ value: 987576 });
		const count5 = screen.getByText('987.5K');
		expect(count5).toBeDefined();

		renderCounter({ value: 77777777 });
		const count6 = screen.getByText('77.7M');
		expect(count6).toBeDefined();
	});

	it('should render using custom limit and label', async () => {
		const value = 10;
		const limit = 10;
		const overLimitLabel = '9+';
		renderCounter({
			value,
			limit,
			overLimitLabel,
		});
		const labelWrapper = await screen.findByTestId(RENDER_LABEL_TESTID);
		expect(labelWrapper).toBeInTheDocument();
		expect(labelWrapper.textContent).toEqual(overLimitLabel);
	});

	it('should add highlight class', async () => {
		const value = 10;
		const highlight = true;
		renderCounter({ value, highlight });
		const labelWrapper = await screen.findByTestId(RENDER_LABEL_TESTID);
		expect(labelWrapper).toBeInTheDocument();
		expect(labelWrapper).toHaveCompiledCss('color', 'var(--ds-text-selected,#0052cc)');
	});

	describe('should update number', () => {
		it('new entering ', async () => {
			const { rerender } = renderCounter({
				value: 5,
				animationDuration: 'large',
			});

			const animatedContainer = await screen.findByTestId(RENDER_COUNTER_TESTID);
			expect(animatedContainer).toBeInTheDocument();

			rerender(<Counter value={6} animationDuration="large" />);
			const labelWrapper = await screen.findByTestId(RENDER_LABEL_TESTID);
			expect(labelWrapper).toBeInTheDocument();
			expect(labelWrapper).toHaveTextContent('6');
		});

		it('value decreases', async () => {
			const { rerender } = renderCounter({
				value: 5,
				animationDuration: 'large',
			});

			const animatedContainer = await screen.findByTestId(RENDER_COUNTER_TESTID);
			expect(animatedContainer).toBeInTheDocument();

			rerender(<Counter value={4} animationDuration="large" />);
			const labelWrapper = await screen.findByTestId(RENDER_LABEL_TESTID);
			expect(labelWrapper).toBeInTheDocument();
			expect(labelWrapper).toHaveTextContent('4');
		});
	});
});
