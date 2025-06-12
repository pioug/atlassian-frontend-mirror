import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Example } from '../../example';

const MockComponent = () => <div>Mock Component</div>;
const mockSource = '<div>sourcecode</div>';

describe('<Example />', () => {
	it('should display the button title', () => {
		render(
			<Example
				Component={MockComponent}
				language="javascript"
				source={mockSource}
				title="example title"
				packageName="@atlaskit/somewhere"
				highlight="1"
			/>,
		);

		expect(screen.getByRole('button', { name: 'example title' })).toBeInTheDocument();
	});

	describe('when the appearance is "showcase-and-source"', () => {
		it('should not display source code by default', () => {
			render(
				<Example
					Component={MockComponent}
					language="javascript"
					source={mockSource}
					title="example title"
					packageName="@atlaskit/somewhere"
				/>,
			);

			expect(screen.queryByText('sourcecode')).not.toBeInTheDocument();
		});

		it('should display the source code when the source toggle button is clicked', async () => {
			render(
				<Example
					Component={MockComponent}
					language="javascript"
					source={mockSource}
					title="example title"
					packageName="@atlaskit/somewhere"
				/>,
			);

			expect(screen.queryByText('sourcecode')).not.toBeInTheDocument();

			await userEvent.click(screen.getByRole('button', { name: 'example title' }));

			expect(screen.getByText('sourcecode')).toBeInTheDocument();
		});

		it('should display the source code by default when isDefaultSourceVisible is true', () => {
			render(
				<Example
					Component={MockComponent}
					language="javascript"
					source={mockSource}
					title="example title"
					packageName="@atlaskit/somewhere"
					isDefaultSourceVisible
				/>,
			);
			expect(screen.getByText('sourcecode')).toBeInTheDocument();
		});

		it('should display the component showcase (preview)', () => {
			render(
				<Example
					Component={MockComponent}
					language="javascript"
					source={mockSource}
					title="example title"
					packageName="@atlaskit/somewhere"
				/>,
			);

			expect(screen.getByText('Mock Component')).toBeInTheDocument();
		});

		it('should keep displaying the component showcase (preview) when the source toggle button is clicked', async () => {
			render(
				<Example
					Component={MockComponent}
					language="javascript"
					source={mockSource}
					title="example title"
					packageName="@atlaskit/somewhere"
				/>,
			);

			expect(screen.getByText('Mock Component')).toBeInTheDocument();
		});
	});

	describe('when the appearance is "source-only"', () => {
		it('should not display source code by default', () => {
			render(
				<Example
					Component={MockComponent}
					language="javascript"
					source={mockSource}
					title="example title"
					packageName="@atlaskit/somewhere"
					appearance="source-only"
				/>,
			);

			expect(screen.queryByText('sourcecode')).not.toBeInTheDocument();
		});

		it('should display the source code when the source toggle button is clicked', async () => {
			render(
				<Example
					Component={MockComponent}
					language="javascript"
					source={mockSource}
					title="example title"
					packageName="@atlaskit/somewhere"
					appearance="source-only"
				/>,
			);

			expect(screen.queryByText('sourcecode')).not.toBeInTheDocument();

			await userEvent.click(screen.getByRole('button', { name: 'example title' }));

			expect(screen.getByText('sourcecode')).toBeInTheDocument();
		});

		it('should display the source code by default when isDefaultSourceVisible is true', () => {
			render(
				<Example
					Component={MockComponent}
					language="javascript"
					source={mockSource}
					title="example title"
					packageName="@atlaskit/somewhere"
					isDefaultSourceVisible
				/>,
			);
			expect(screen.getByText('sourcecode')).toBeInTheDocument();
		});

		it('should not display the component showcase (preview)', () => {
			render(
				<Example
					Component={MockComponent}
					language="javascript"
					source={mockSource}
					title="example title"
					packageName="@atlaskit/somewhere"
					appearance="source-only"
				/>,
			);

			expect(screen.queryByText('Mock Component')).not.toBeInTheDocument();
		});

		it('should not display the source code when the source toggle button is clicked', async () => {
			render(
				<Example
					Component={MockComponent}
					language="javascript"
					source={mockSource}
					title="example title"
					packageName="@atlaskit/somewhere"
					appearance="source-only"
				/>,
			);

			expect(screen.queryByText('sourcecode')).not.toBeInTheDocument();

			await userEvent.click(screen.getByRole('button', { name: 'example title' }));

			expect(screen.getByText('sourcecode')).toBeInTheDocument();
		});
	});
});
