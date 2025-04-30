/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { PureComponent } from 'react';

import { css, jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';

import type { GlyphProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { IconType, SmartLinkPosition, SmartLinkSize } from '../../../../../../constants';
import Icon from '../index';

const mockAppearanceTestId = 'mock-appearance-test-id';
jest.mock('../../../common/image-icon', () => ({
	...jest.requireActual('../../../common/image-icon'),
	__esModule: true,
	default: jest.fn((props) => {
		const Component = jest.requireActual('../../../common/image-icon').default;

		return (
			<div>
				<div data-testid={mockAppearanceTestId}>{props.appearance || 'no-appearance'}</div>
				<Component {...props} />
			</div>
		);
	}),
}));

class TestIcon extends PureComponent<Omit<GlyphProps, 'primaryColor' | 'secondaryColor'>> {
	render() {
		return <div data-testid={'smart-element-icon-overrideIcon'}>{'test'}</div>;
	}
}

jest.mock('react-render-image', () => ({ src, loading, loaded, errored }: any) => {
	switch (src) {
		case 'src-loading':
			return loading;
		case 'src-loaded':
			return loaded;
		case 'src-error':
			return errored;
		default:
			return <span>{src}</span>;
	}
});

describe('Element: Icon', () => {
	it('renders element', async () => {
		render(<Icon />);

		const element = await screen.findByTestId('smart-element-icon');

		expect(element).toBeTruthy();
		expect(element.getAttribute('data-smart-element-icon')).toBeTruthy();
	});

	it('renders icon using render function when provided', async () => {
		const testId = 'custom-icon';
		const renderCustomIcon = () => <span data-testid={testId}>💡</span>;
		render(<Icon render={renderCustomIcon} />);

		const element = await screen.findByTestId(testId);

		expect(element).toBeTruthy();
		expect(element).toHaveTextContent('💡');
	});

	it('renders ImageIcon when url is provided', async () => {
		render(<Icon icon={IconType.Document} url="src-loaded" />);

		const element = await screen.findByTestId('smart-element-icon-image');

		expect(element).toBeTruthy();
	});

	ffTest.both('platform-linking-visual-refresh-v2', '', () => {
		it('should send appearance prop to image icon', async () => {
			render(<Icon icon={IconType.Document} url="src-loaded" appearance="round" />);

			await screen.findByTestId('smart-element-icon-image');

			expect(screen.getByTestId(mockAppearanceTestId)).toHaveTextContent(
				fg('platform-linking-visual-refresh-v2') ? 'round' : 'no-appearance',
			);
		});
	});

	it('renders AtlaskitIcon when url is not provided', async () => {
		render(<Icon icon={IconType.Document} />);

		const element = await screen.findByTestId('smart-element-icon-icon');

		expect(element).toBeTruthy();
	});

	it('renders default icon when neither icon nor url is provided', async () => {
		render(<Icon />);

		const element = await screen.findByTestId('smart-element-icon-default');

		expect(element).toBeTruthy();
	});

	it('renders override icon when provided', async () => {
		render(<Icon overrideIcon={<TestIcon label="test" />} />);

		const element = await screen.findByTestId('smart-element-icon-overrideIcon');

		expect(element).toBeTruthy();
	});

	describe('priority', () => {
		it('priorities custom render function', async () => {
			const testId = 'custom-icon';
			const renderCustomIcon = () => <span data-testid={testId}>💡</span>;
			render(<Icon icon={IconType.Document} render={renderCustomIcon} url="src-loaded" />);

			const customIcon = await screen.findByTestId(testId);
			const imageIcon = screen.queryByTestId('smart-element-icon-image');
			const akIcon = screen.queryByTestId('smart-element-icon-icon');

			expect(customIcon).toHaveTextContent('💡');
			expect(imageIcon).not.toBeInTheDocument();
			expect(akIcon).not.toBeInTheDocument();
		});

		it('priorities url icon', async () => {
			const renderCustomIcon = () => undefined;
			render(<Icon icon={IconType.Document} render={renderCustomIcon} url="src-loaded" />);

			const imageIcon = await screen.findByTestId('smart-element-icon-image');
			const akIcon = screen.queryByTestId('smart-element-icon-icon');

			expect(imageIcon).toBeTruthy();
			expect(akIcon).not.toBeInTheDocument();
		});

		it('priorities atlaskit icon', async () => {
			const renderCustomIcon = () => undefined;
			render(<Icon icon={IconType.Document} render={renderCustomIcon} />);

			const imageIcon = screen.queryByTestId('smart-element-icon-image');
			const akIcon = await screen.findByTestId('smart-element-icon-icon');

			expect(imageIcon).not.toBeInTheDocument();
			expect(akIcon).toBeTruthy();
		});

		it('priorities override icon', async () => {
			const renderCustomIcon = () => undefined;
			render(
				<Icon
					overrideIcon={<TestIcon label="test" />}
					icon={IconType.Document}
					render={renderCustomIcon}
				/>,
			);

			const imageIcon = screen.queryByTestId('smart-element-icon-image');
			const akIcon = screen.queryByTestId('smart-element-icon-icon');
			const bitbucketIcon = await screen.findByTestId('smart-element-icon-overrideIcon');

			expect(imageIcon).not.toBeInTheDocument();
			expect(akIcon).not.toBeInTheDocument();
			expect(bitbucketIcon).toBeTruthy();
		});
	});

	describe('size', () => {
		it.each([
			[SmartLinkSize.XLarge, '2rem'],
			[SmartLinkSize.Large, '1.5rem'],
			[SmartLinkSize.Medium, '1rem'],
			[SmartLinkSize.Small, '.75rem'],
		])('renders element in %s size', async (size: SmartLinkSize, expectedSize: string) => {
			render(<Icon size={size} />);

			const element = await screen.findByTestId('smart-element-icon');

			expect(element).toHaveCompiledCss('height', expectedSize);
			expect(element).toHaveCompiledCss('width', expectedSize);
		});
	});

	describe('position', () => {
		it.each([
			[SmartLinkPosition.Top, 'flex-start'],
			[SmartLinkPosition.Center, 'center'],
		])('renders element at %s position', async (position, expectedAlignSelf) => {
			render(<Icon position={position} size={SmartLinkSize.Small} />);

			const element = await screen.findByTestId('smart-element-icon');

			expect(element).toHaveCompiledCss('align-self', expectedAlignSelf);
		});
	});

	describe('ImageIcon', () => {
		it('renders image icon', async () => {
			render(<Icon url="src-loaded" />);

			const element = await screen.findByTestId('smart-element-icon-image');

			expect(element).toBeTruthy();
		});

		it('renders shimmer placeholder on loading', async () => {
			render(<Icon url="src-loading" />);

			const element = await screen.findByTestId('smart-element-icon-loading');

			expect(element).toBeTruthy();
		});

		it('renders default icon on error', async () => {
			render(<Icon url="src-error" />);

			const element = await screen.findByTestId('smart-element-icon-default');

			expect(element).toBeTruthy();
		});
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			backgroundColor: 'blue',
		});
		render(<Icon css={overrideCss} />);

		const element = await screen.findByTestId('smart-element-icon');

		expect(element).toHaveCompiledCss('background-color', 'blue');
	});
});
