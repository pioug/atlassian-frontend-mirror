import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { type LozengeProps } from '../../../../../types';
import { InlineCardResolvedView } from '../../index';

jest.mock('react-render-image', () => ({
	...jest.requireActual('react-render-image'),
	__esModule: true,
	default: jest.fn(({ loaded }) => {
		return <>{loaded}</>;
	}),
}));

const mockTypeTestId = 'mocked-type-test-id';
jest.mock('../../../IconAndTitleLayout', () => ({
	...jest.requireActual('../../../IconAndTitleLayout'),
	IconAndTitleLayout: jest.fn((props) => {
		const Component = jest.requireActual('../../../IconAndTitleLayout').IconAndTitleLayout;

		return (
			<>
				<div data-testid={mockTypeTestId}>{props.type?.join(', ')}</div>
				<Component {...props} />
			</>
		);
	}),
}));

describe('ResolvedView', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<InlineCardResolvedView title="some text content" />);

		await expect(container).toBeAccessible();
	});

	it('should render the title', async () => {
		render(<InlineCardResolvedView title="some text content" />);
		expect(await screen.findByText('some text content')).toBeVisible();
	});

	it('should render an icon when one is provided', async () => {
		render(<InlineCardResolvedView icon="some-link-to-icon" title="some text content" />);
		expect(await screen.findByTestId('inline-card-icon-and-title-image')).toHaveAttribute(
			'src',
			'some-link-to-icon',
		);
	});

	ffTest.both('platform-linking-visual-refresh-v2', '', () => {
		it('should send type to IconAndTitleLayout', () => {
			render(
				<InlineCardResolvedView
					icon="some-link-to-icon"
					title="some text content"
					type={['Document', 'Profile']}
				/>,
			);

			if (fg('platform-linking-visual-refresh-v2')) {
				expect(screen.getByTestId(mockTypeTestId)).toHaveTextContent('Document, Profile');
			} else {
				expect(screen.getByTestId(mockTypeTestId)).toBeEmptyDOMElement();
			}
		});
	});

	it('should not render icon when one is not provided', async () => {
		render(<InlineCardResolvedView title="some text content" />);
		expect(await screen.findByRole('img')).not.toHaveAttribute('src');
	});

	it('should render text color when provided', async () => {
		render(
			<InlineCardResolvedView
				icon="some-link-to-icon"
				title="some text content"
				titleTextColor={token('color.text.inverse', '#FFFFFF')}
			/>,
		);
		expect(await screen.findByText('some text content')).toHaveStyle(
			`color: var(--ds-text-inverse, '#FFFFFF')`,
		);
	});

	it('should render a lozenge when one is provided', async () => {
		const lozengeProps: LozengeProps = {
			text: 'some-lozenge-text',
			isBold: true,
			appearance: 'inprogress',
		};
		render(<InlineCardResolvedView title="some text content" lozenge={lozengeProps} />);
		const lozenge = await screen.findByTestId('inline-card-resolved-view-lozenge');
		expect(lozenge).toHaveCompiledCss(
			'background-color',
			'var(--ds-background-information-bold,#0c66e4)',
		);

		expect(lozenge).toHaveStyle(`color: ${token('color.text.inverse', '#FFFFFF')}`);
	});

	it('should not render a lozenge when one is not provided', () => {
		render(<InlineCardResolvedView title="some text content" />);
		expect(screen.queryByTestId('inline-card-resolved-view-lozenge')).not.toBeInTheDocument();
	});

	it('should render a hover preview when its prop is enabled and link is included', async () => {
		render(
			<IntlProvider locale="en">
				<Provider>
					<InlineCardResolvedView showHoverPreview={true} link="www.test.com" />,
				</Provider>
				,
			</IntlProvider>,
		);
		expect(await screen.findByTestId('hover-card-trigger-wrapper')).toBeInTheDocument();
	});

	it('should not render a hover preview when its prop is disabled and link is not included', () => {
		render(<InlineCardResolvedView showHoverPreview={false} />);
		expect(screen.queryByTestId('hover-card-trigger-wrapper')).not.toBeInTheDocument();
	});

	it('should not render a hover preview when prop is enabled and link is not included', () => {
		render(<InlineCardResolvedView showHoverPreview={true} />);
		expect(screen.queryByTestId('hover-card-trigger-wrapper')).not.toBeInTheDocument();
	});

	it('should not render a hover preview when prop is disabled and link is included', () => {
		render(<InlineCardResolvedView showHoverPreview={false} link="www.test.com" />);
		expect(screen.queryByTestId('hover-card-trigger-wrapper')).not.toBeInTheDocument();
	});

	it('should not render a hover preview when prop is not provided', () => {
		render(<InlineCardResolvedView link="www.test.com" />);
		expect(screen.queryByTestId('hover-card-trigger-wrapper')).not.toBeInTheDocument();
	});
});
