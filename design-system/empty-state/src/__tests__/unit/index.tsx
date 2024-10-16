import React from 'react';

import { render, screen } from '@testing-library/react';

import Button from '@atlaskit/button/new';

import EmptyState from '../../empty-state';
import type { RenderImageProps } from '../../types';

describe('Empty state', () => {
	it('should render primary action when primaryAction prop is not empty', async () => {
		render(
			<EmptyState
				header="Test header"
				primaryAction={<Button testId="primary-action">Action Button</Button>}
			/>,
		);

		const buttons = await screen.findAllByRole('button');

		expect(screen.getByTestId('primary-action')).toBeInTheDocument();
		expect(buttons).toHaveLength(1);
	});

	it('should render secondary action when secondaryAction prop is not empty', async () => {
		render(
			<EmptyState
				header="Test header"
				secondaryAction={<Button testId="secondary-action">Action Button</Button>}
			/>,
		);

		const buttons = await screen.findAllByRole('button');

		expect(screen.getByTestId('secondary-action')).toBeInTheDocument();
		expect(buttons).toHaveLength(1);
	});

	it('should render tertiary action when tertiaryAction prop is not empty', async () => {
		render(
			<EmptyState
				header="Test header"
				tertiaryAction={<Button testId="tertiary-action">Action Button</Button>}
			/>,
		);

		const buttons = await screen.findAllByRole('button');

		expect(screen.getByTestId('tertiary-action')).toBeInTheDocument();
		expect(buttons).toHaveLength(1);
	});

	it('should render no action when no action prop is provided', () => {
		render(<EmptyState header="Test header" />);

		const buttons = screen.queryAllByRole('button');

		expect(buttons).toHaveLength(0);
	});

	it('should render image when imageUrl prop is not empty', async () => {
		render(<EmptyState header="Test header" imageUrl="test" />);

		const images = await screen.findAllByRole('presentation');

		expect(images).toHaveLength(1);
		expect(images[0]).toHaveAttribute('src', 'test');
		expect(images[0]).toHaveAttribute('alt', '');
	});

	it('should render description when description prop is not empty', () => {
		render(<EmptyState header="Test header" description="test-description" />);

		expect(screen.getByText('test-description')).toBeInTheDocument();
	});

	it('should render spinner when isLoading prop is true', () => {
		render(<EmptyState header="Test header" isLoading />);

		expect(screen.getByTestId('empty-state-spinner')).toBeInTheDocument();
	});

	it('should render primary and seconday actions inside a ButtonGroup', async () => {
		render(
			<EmptyState
				header="Test header"
				primaryAction={<Button testId="primary-action">Action Button</Button>}
				secondaryAction={<Button testId="secondary-action">Action Button</Button>}
			/>,
		);

		const buttons = await screen.findAllByRole('button');

		expect(screen.getByTestId('primary-action')).toBeInTheDocument();
		expect(screen.getByTestId('secondary-action')).toBeInTheDocument();
		expect(buttons).toHaveLength(2);
	});

	it('should render image with fixed width and height so it does not jump around when the image is loading in', async () => {
		render(<EmptyState header="Test header" imageUrl="test" imageHeight={100} imageWidth={200} />);

		const images = await screen.findAllByRole('presentation');

		expect(images).toHaveLength(1);
		expect(images[0]).toHaveAttribute('height', '100');
		expect(images[0]).toHaveAttribute('width', '200');
	});

	it('should render ImageComponent with RenderImageProps', () => {
		const TestImageComponent = (props: RenderImageProps) => {
			const { imageHeight, imageWidth, maxImageHeight, maxImageWidth } = props;

			return (
				<img
					data-testid="image-component"
					src="test"
					height={imageHeight}
					width={imageWidth}
					alt={`maxImageHeight: ${maxImageHeight}, maxImageWidth: ${maxImageWidth}`}
				/>
			);
		};

		render(
			<EmptyState
				header="Test header"
				renderImage={(props) => <TestImageComponent {...props} />}
				imageHeight={100}
				imageWidth={200}
				maxImageHeight={300}
				maxImageWidth={400}
			/>,
		);

		const image = screen.getByTestId('image-component');

		expect(image).toBeInTheDocument();
		expect(image).toHaveAttribute('height', '100');
		expect(image).toHaveAttribute('width', '200');
		expect(image).toHaveAttribute('alt', 'maxImageHeight: 300, maxImageWidth: 400');
	});

	it('imageUrl should take precedence over ImageComponent', async () => {
		const TestImageComponent = () => (
			<img src="custom-image-url" data-testid="custom-image-component" alt="" />
		);
		render(
			<EmptyState
				header="Test header"
				imageUrl="image-url-in-props"
				renderImage={() => <TestImageComponent />}
			/>,
		);

		const images = await screen.findAllByRole('presentation');

		expect(screen.queryByTestId('custom-image-component')).not.toBeInTheDocument();
		expect(images).toHaveLength(1);
		expect(images[0]).toHaveAttribute('src', 'image-url-in-props');
	});

	it('should render heading level without passed `headingLevel` correctly', async () => {
		render(<EmptyState header="Test header" imageUrl="image-url-in-props" />);

		expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
	});

	it('should render heading level with passed `headingLevel = 2` correctly', async () => {
		render(<EmptyState header="Test header" headingLevel={2} imageUrl="image-url-in-props" />);

		expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
	});

	it('should render heading level with passed `headingLevel = value that is less than 1` correctly', async () => {
		render(<EmptyState header="Test header" headingLevel={0} imageUrl="image-url-in-props" />);

		expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
	});

	it('should render heading level with passed `headingLevel = value greater than 6` correctly', async () => {
		render(<EmptyState header="Test header" headingLevel={7} imageUrl="image-url-in-props" />);

		expect(screen.getByRole('heading', { level: 6 })).toBeInTheDocument();
	});
	it('button group should have default label value', async () => {
		const primary = <Button testId="primary-action">Action Button</Button>;
		const secondary = <Button testId="secondary-action">Action Button</Button>;
		const props = {
			header: 'Test header',
			primaryAction: primary,
			secondaryAction: secondary,
			testId: 'empty-state-test',
		};
		render(<EmptyState {...props} />);
		const buttonGroupContainer = screen.getByTestId(`${props.testId}-button-group`);

		expect(buttonGroupContainer).toHaveAttribute('aria-label');
		expect(buttonGroupContainer.getAttribute('aria-label')).toBeTruthy();
	});
	it('button group should receive dynamic label value', async () => {
		const primary = <Button testId="primary-action">Action Button</Button>;
		const secondary = <Button testId="secondary-action">Action Button</Button>;
		const props = {
			header: 'Test header',
			primaryAction: primary,
			secondaryAction: secondary,
			testId: 'empty-state-test',
			buttonGroupLabel: 'Actions container',
		};
		render(<EmptyState {...props} />);
		const buttonGroupContainer = screen.getByTestId(`${props.testId}-button-group`);

		expect(buttonGroupContainer).toHaveAttribute('aria-label', props.buttonGroupLabel);
	});
});
