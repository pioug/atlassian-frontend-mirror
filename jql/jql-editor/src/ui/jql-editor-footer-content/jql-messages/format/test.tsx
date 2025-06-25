import React, { type ComponentProps } from 'react';

import { render } from '@testing-library/react';

import { extractMessageNodes, FormatMessages } from './index';

describe('FormatMessages', () => {
	const renderComponent = (props: ComponentProps<typeof FormatMessages>) => {
		return render(<FormatMessages {...props} />);
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render null if there are no messages', () => {
		const { container } = renderComponent({ messages: [] });
		expect(container.firstChild).toBeNull();
	});

	it('should render a single message', () => {
		const { getByText } = renderComponent({
			messages: [{ type: 'info', message: 'info1' }],
		});
		expect(getByText('info1')).toBeInTheDocument();
	});

	it('should render a few messages', () => {
		const { getByText } = renderComponent({
			messages: [
				{ type: 'info', message: 'info1' },
				{ type: 'info', message: 'info2' },
			],
		});
		expect(getByText('info1')).toBeInTheDocument();
		expect(getByText('info2')).toBeInTheDocument();
	});

	it('should render no more than 10 messages', () => {
		const { getAllByText } = renderComponent({
			messages: Array(20)
				.fill(1)
				.map(() => ({ type: 'info', message: 'info' })),
		});
		expect(getAllByText('info')).toHaveLength(10);
	});
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<FormatMessages
				messages={Array(20)
					.fill(1)
					.map(() => ({ type: 'info', message: 'info' }))}
			/>,
		);
		await expect(container).toBeAccessible();
	});
});

describe('extractMessageNodes from ExternalMessage array', () => {
	it('should return no more than 10 messages', () => {
		expect(
			extractMessageNodes(
				Array(20)
					.fill(1)
					.map(() => ({ type: 'info', message: 'info' })),
			),
		).toHaveLength(10);
	});

	it('should handle empty arrays', () => {
		expect(extractMessageNodes([])).toStrictEqual([]);
	});

	it('should extract the messages correctly', () => {
		expect(
			extractMessageNodes([
				{ type: 'error', message: 'foo' },
				{ type: 'info', message: 'bar' },
			]),
		).toStrictEqual([<>foo</>, <>bar</>]);
	});
});
