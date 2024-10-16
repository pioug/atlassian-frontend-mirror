import React from 'react';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import Icon from '../index';
import { IconType, SmartLinkPosition, SmartLinkSize } from '../../../../../../constants';
import { PureComponent } from 'react';
import type { GlyphProps } from '@atlaskit/icon/types';

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
		expect(element.textContent).toBe('💡');
	});

	it('renders ImageIcon when url is provided', async () => {
		render(<Icon icon={IconType.Document} url="src-loaded" />);

		const element = await screen.findByTestId('smart-element-icon-image');

		expect(element).toBeTruthy();
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

			expect(customIcon.textContent).toBe('💡');
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

			expect(element).toHaveStyleDeclaration('height', expectedSize);
			expect(element).toHaveStyleDeclaration('width', expectedSize);
		});
	});

	describe('position', () => {
		it.each([
			[SmartLinkPosition.Top, 'flex-start'],
			[SmartLinkPosition.Center, 'center'],
		])('renders element at %s position', async (position, expectedAlignSelf) => {
			render(<Icon position={position} size={SmartLinkSize.Small} />);

			const element = await screen.findByTestId('smart-element-icon');

			expect(element).toHaveStyleDeclaration('align-self', expectedAlignSelf);
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
		render(<Icon overrideCss={overrideCss} />);

		const element = await screen.findByTestId('smart-element-icon');

		expect(element).toHaveStyleDeclaration('background-color', 'blue');
	});
});
