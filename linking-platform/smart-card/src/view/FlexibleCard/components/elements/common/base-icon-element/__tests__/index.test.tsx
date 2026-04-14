/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { PureComponent } from 'react';

import { css, jsx } from '@compiled/react';
import { IntlProvider } from 'react-intl';

import type { GlyphProps } from '@atlaskit/icon/types';
import { token } from '@atlaskit/tokens';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { render, screen } from '@atlassian/testing-library';

import { IconType, SmartLinkSize } from '../../../../../../../constants';
import IconElement from '../index';

const mockAppearanceTestId = 'mock-appearance-test-id';
jest.mock('../../../../common/image-icon', () => ({
	...jest.requireActual('../../../../common/image-icon'),
	__esModule: true,
	default: jest.fn((props) => {
		const Component = jest.requireActual('../../../../common/image-icon').default;

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
	it('should capture and report a11y violations', async () => {
		const { container } = render(<IconElement />);

		await expect(container).toBeAccessible();
	});

	it('renders element', async () => {
		render(<IconElement />);

		const element = await screen.findByTestId('smart-element-icon');

		expect(element).toBeTruthy();
		expect(element.getAttribute('data-smart-element-icon')).toBeTruthy();
	});

	it('renders icon using render function when provided', async () => {
		const testId = 'custom-icon';
		const renderCustomIcon = () => <span data-testid={testId}>💡</span>;
		render(<IconElement render={renderCustomIcon} />);

		const element = await screen.findByTestId(testId);

		expect(element).toBeTruthy();
		expect(element).toHaveTextContent('💡');
	});

	it('renders ImageIcon when url is provided', async () => {
		render(
			<IntlProvider locale={'en'}>
				<IconElement icon={IconType.Document} url="src-loaded" />
			</IntlProvider>,
		);

		const element = await screen.findByTestId('smart-element-icon-image');

		expect(element).toBeTruthy();
	});

	it('should send appearance prop to image icon', async () => {
		render(
			<IntlProvider locale={'en'}>
				<IconElement icon={IconType.Document} url="src-loaded" appearance="round" />
			</IntlProvider>,
		);

		await screen.findByTestId('smart-element-icon-image');

		expect(screen.getByTestId(mockAppearanceTestId)).toHaveTextContent('round');
	});

	it('renders AtlaskitIcon when url is not provided', async () => {
		render(<IconElement icon={IconType.Document} />);

		const element = await screen.findByTestId('smart-element-icon-icon');

		expect(element).toBeTruthy();
	});

	it('renders default icon when neither icon nor url is provided', async () => {
		render(<IconElement />);

		const element = await screen.findByTestId('smart-element-icon-default');

		expect(element).toBeTruthy();
	});

	it('renders override icon when provided', async () => {
		render(<IconElement overrideIcon={<TestIcon label="test" />} />);

		const element = await screen.findByTestId('smart-element-icon-overrideIcon');

		expect(element).toBeTruthy();
	});

	describe('priority', () => {
		it('priorities custom render function', async () => {
			const testId = 'custom-icon';
			const renderCustomIcon = () => <span data-testid={testId}>💡</span>;
			render(<IconElement icon={IconType.Document} render={renderCustomIcon} url="src-loaded" />);

			const customIcon = await screen.findByTestId(testId);
			const imageIcon = screen.queryByTestId('smart-element-icon-image');
			const akIcon = screen.queryByTestId('smart-element-icon-icon');

			expect(customIcon).toHaveTextContent('💡');
			expect(imageIcon).not.toBeInTheDocument();
			expect(akIcon).not.toBeInTheDocument();
		});

		it('priorities url icon', async () => {
			const renderCustomIcon = () => undefined;
			render(
				<IntlProvider locale={'en'}>
					<IconElement icon={IconType.Document} render={renderCustomIcon} url="src-loaded" />
				</IntlProvider>,
			);

			const imageIcon = await screen.findByTestId('smart-element-icon-image');
			const akIcon = screen.queryByTestId('smart-element-icon-icon');

			expect(imageIcon).toBeTruthy();
			expect(akIcon).not.toBeInTheDocument();
		});

		it('priorities atlaskit icon', async () => {
			const renderCustomIcon = () => undefined;
			render(<IconElement icon={IconType.Document} render={renderCustomIcon} />);

			const imageIcon = screen.queryByTestId('smart-element-icon-image');
			const akIcon = await screen.findByTestId('smart-element-icon-icon');

			expect(imageIcon).not.toBeInTheDocument();
			expect(akIcon).toBeTruthy();
		});

		it('priorities override icon', async () => {
			const renderCustomIcon = () => undefined;
			render(
				<IconElement
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

	describe('ImageIcon', () => {
		it('renders image icon', async () => {
			render(
				<IntlProvider locale={'en'}>
					<IconElement url="src-loaded" />
				</IntlProvider>,
			);

			const element = await screen.findByTestId('smart-element-icon-image');

			expect(element).toBeTruthy();
		});

		describe('when hideLoadingSkeleton is undefined', () => {
			it('renders shimmer placeholder on loading', async () => {
				render(
					<IntlProvider locale={'en'}>
						<IconElement url="src-loading" />
					</IntlProvider>,
				);

				const element = await screen.findByTestId('smart-element-icon-loading');

				expect(element).toBeTruthy();
			});

			it('renders default icon on error', async () => {
				render(
					<IntlProvider locale={'en'}>
						<IconElement url="src-error" />
					</IntlProvider>,
				);

				const element = await screen.findByTestId('smart-element-icon-default');

				expect(element).toBeTruthy();
			});
		});

		describe('when hideLoadingSkeleton is true', () => {
			it('does not render loading placeholder', async () => {
				render(
					<IntlProvider locale={'en'}>
						<IconElement url="src-loading" hideLoadingSkeleton={true} />
					</IntlProvider>,
				);

				const loading = screen.queryByTestId('smart-element-icon-loading');
				expect(loading).not.toBeInTheDocument();

				const image = await screen.findByTestId('smart-element-icon-image');
				expect(image).toBeTruthy();
			});
		});
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			backgroundColor: 'blue',
		});
		render(
			<IntlProvider locale={'en'}>
				<IconElement css={overrideCss} />
			</IntlProvider>,
		);

		const element = await screen.findByTestId('smart-element-icon');

		expect(element).toHaveCompiledCss('background-color', 'blue');
	});

	describe('isTiledIcon with platform_sl_3p_preauth_better_hovercard_killswitch', () => {
		ffTest.on('platform_sl_3p_preauth_better_hovercard_killswitch', '', () => {
			it('renders Tile wrapper when killswitch is enabled', () => {
				render(<IconElement isTiledIcon icon={IconType.Document} />);

				expect(screen.getByTestId('smart-element-icon-tile')).toBeInTheDocument();
				expect(screen.queryByTestId('smart-element-icon-box')).not.toBeInTheDocument();
			});
		});

		ffTest.off('platform_sl_3p_preauth_better_hovercard_killswitch', '', () => {
			it('does not render Tile when flag is disabled', () => {
				render(<IconElement isTiledIcon icon={IconType.Document} />);

				expect(screen.queryByTestId('smart-element-icon-tile')).not.toBeInTheDocument();
				expect(screen.getByTestId('smart-element-icon-box')).toBeInTheDocument();
			});
		});
	});

	describe('tile size mapping with platform_sl_3p_preauth_better_hovercard_killswitch', () => {
		ffTest.on('platform_sl_3p_preauth_better_hovercard_killswitch', '', () => {
			it('uses SmartLink medium size directly for tiled icons when killswitch is enabled', () => {
				render(<IconElement isTiledIcon icon={IconType.Document} size={SmartLinkSize.Medium} />);

				expect(screen.getByTestId('smart-element-icon-tile')).toHaveCompiledCss('width', '2pc');
				expect(screen.getByTestId('smart-element-icon-tile')).toHaveCompiledCss('height', '2pc');
			});

			it('uses the small image width token for non-tiled medium url icons when killswitch is enabled', async () => {
				render(
					<IntlProvider locale={'en'}>
						<IconElement url="src-loaded" size={SmartLinkSize.Medium} />
					</IntlProvider>,
				);

				expect(await screen.findByTestId('smart-element-icon-image')).toHaveStyle({
					width: token('space.200'),
					height: token('space.200'),
				});
			});

			it('uses the medium image width token for tiled medium url icons when killswitch is enabled', async () => {
				render(
					<IntlProvider locale={'en'}>
						<IconElement url="src-loaded" size={SmartLinkSize.Medium} isTiledIcon />
					</IntlProvider>,
				);

				expect(await screen.findByTestId('smart-element-icon-image')).toHaveStyle({
					width: token('space.250'),
					height: token('space.250'),
				});
			});
		});

		ffTest.off('platform_sl_3p_preauth_better_hovercard_killswitch', '', () => {
			it('does not use tile sizing when killswitch is disabled', () => {
				render(<IconElement isTiledIcon icon={IconType.Document} size={SmartLinkSize.Large} />);

				expect(screen.getByTestId('smart-element-icon-box')).toHaveStyle({
					width: token('space.300'),
					height: token('space.300'),
				});
			});
		});
	});
});
