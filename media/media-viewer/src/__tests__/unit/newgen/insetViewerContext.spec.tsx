import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import {
	InsetViewerProvider,
	useHasMediaFooterVideoControls,
	useIsInsetViewer,
	useSetMediaFooterControls,
	withInsetViewer,
	withInsetViewerFooter,
	type WithInsetViewerFooterProps,
	type WithInsetViewerProps,
} from '../../../insetViewerContext';

describe('insetViewerContext', () => {
	describe('useIsInsetViewer', () => {
		const FlagProbe = () => <span data-testid="flag">{String(useIsInsetViewer())}</span>;

		it('should default to false when there is no provider', async () => {
			render(<FlagProbe />);
			expect(screen.getByTestId('flag')).toHaveTextContent('false');

			await expect(document.body).toBeAccessible();
		});

		it('should default to false when the provider does not receive the flag', () => {
			render(
				<InsetViewerProvider>
					<FlagProbe />
				</InsetViewerProvider>,
			);
			expect(screen.getByTestId('flag')).toHaveTextContent('false');
		});

		it('should be false when the provider is given false', () => {
			render(
				<InsetViewerProvider isInsetViewer={false}>
					<FlagProbe />
				</InsetViewerProvider>,
			);
			expect(screen.getByTestId('flag')).toHaveTextContent('false');
		});

		it('should be true when the provider is given true', () => {
			render(
				<InsetViewerProvider isInsetViewer>
					<FlagProbe />
				</InsetViewerProvider>,
			);
			expect(screen.getByTestId('flag')).toHaveTextContent('true');
		});
	});

	describe('withInsetViewer', () => {
		class ClassProbe extends React.Component<WithInsetViewerProps & { label: string }> {
			static displayName = 'ClassProbe';
			render() {
				return (
					<span data-testid="probe">
						{this.props.label}:{String(this.props.isInsetViewer)}
					</span>
				);
			}
		}

		const Wrapped = withInsetViewer(ClassProbe);

		it('should supply false to a class component outside a provider', () => {
			render(<Wrapped label="probe" />);
			expect(screen.getByTestId('probe')).toHaveTextContent('probe:false');
		});

		it('should supply the flag to a class component inside a provider', () => {
			render(
				<InsetViewerProvider isInsetViewer>
					<Wrapped label="probe" />
				</InsetViewerProvider>,
			);
			expect(screen.getByTestId('probe')).toHaveTextContent('probe:true');
		});

		it('should forward a ref to the wrapped component', () => {
			const ref = React.createRef<ClassProbe>();
			render(<Wrapped label="probe" ref={ref} />);
			expect(ref.current).toBeInstanceOf(ClassProbe);
		});

		it.each([
			{ source: 'its displayName', component: ClassProbe, expected: 'WithInsetViewer(ClassProbe)' },
			{
				source: 'its function name',
				component: function NamedProbe() {
					return null;
				},
				expected: 'WithInsetViewer(NamedProbe)',
			},
			{
				source: 'a generic name when it has neither',
				component: Object.defineProperty(() => null, 'name', { value: '' }),
				expected: 'WithInsetViewer(Component)',
			},
		])('should name the wrapper from $source', ({ component, expected }) => {
			expect(withInsetViewer(component as React.ComponentType).displayName).toBe(expected);
		});
	});

	describe('media footer', () => {
		class FooterProbe extends React.Component<WithInsetViewerFooterProps> {
			static displayName = 'FooterProbe';
			render() {
				const { isInsetViewer, mediaFooterControls } = this.props;
				return (
					<div>
						<span data-testid="footer-flag">{String(isInsetViewer)}</span>
						<span data-testid="footer-controls">
							{mediaFooterControls?.dataset.testid ?? 'none'}
						</span>
					</div>
				);
			}
		}

		const WrappedFooter = withInsetViewerFooter(FooterProbe);

		const FooterHost = () => {
			const setControls = useSetMediaFooterControls();
			return <div data-testid="the-footer" ref={setControls} />;
		};

		it('should supply the inset flag and no footer element before one is registered', () => {
			render(
				<InsetViewerProvider isInsetViewer>
					<WrappedFooter />
				</InsetViewerProvider>,
			);

			expect(screen.getByTestId('footer-flag')).toHaveTextContent('true');
			expect(screen.getByTestId('footer-controls')).toHaveTextContent('none');
		});

		it('should supply the registered footer element to the wrapped component', () => {
			render(
				<InsetViewerProvider isInsetViewer>
					<FooterHost />
					<WrappedFooter />
				</InsetViewerProvider>,
			);

			expect(screen.getByTestId('footer-controls')).toHaveTextContent('the-footer');
		});

		it('should fall back to a no-op setter without a provider', () => {
			render(
				<>
					<FooterHost />
					<WrappedFooter />
				</>,
			);

			expect(screen.getByTestId('footer-controls')).toHaveTextContent('none');
		});

		it('should forward a ref to the wrapped component', () => {
			const ref = React.createRef<FooterProbe>();
			render(<WrappedFooter ref={ref} />);
			expect(ref.current).toBeInstanceOf(FooterProbe);
		});

		it.each([
			{
				source: 'its displayName',
				component: FooterProbe,
				expected: 'WithInsetViewerFooter(FooterProbe)',
			},
			{
				source: 'its function name',
				component: function NamedFooter() {
					return null;
				},
				expected: 'WithInsetViewerFooter(NamedFooter)',
			},
			{
				source: 'a generic name when it has neither',
				component: Object.defineProperty(() => null, 'name', { value: '' }),
				expected: 'WithInsetViewerFooter(Component)',
			},
		])('should name the wrapper from $source', ({ component, expected }) => {
			expect(withInsetViewerFooter(component as React.ComponentType).displayName).toBe(expected);
		});
	});
	describe('media footer video controls', () => {
		const VideoControlsProbe = () => (
			<span data-testid="has-video">{String(useHasMediaFooterVideoControls())}</span>
		);

		class Setter extends React.Component<WithInsetViewerFooterProps> {
			render() {
				return (
					<button type="button" onClick={() => this.props.setHasVideoControls?.(true)}>
						register video controls
					</button>
				);
			}
		}
		const WrappedSetter = withInsetViewerFooter(Setter);

		it('should default to false', () => {
			render(
				<InsetViewerProvider isInsetViewer>
					<VideoControlsProbe />
				</InsetViewerProvider>,
			);
			expect(screen.getByTestId('has-video')).toHaveTextContent('false');
		});

		it('should become true once a viewer registers video controls', async () => {
			render(
				<InsetViewerProvider isInsetViewer>
					<WrappedSetter />
					<VideoControlsProbe />
				</InsetViewerProvider>,
			);

			await userEvent.click(screen.getByRole('button', { name: 'register video controls' }));

			expect(screen.getByTestId('has-video')).toHaveTextContent('true');
		});

		it('should tolerate registering video controls without a provider', async () => {
			render(<WrappedSetter />);

			await userEvent.click(screen.getByRole('button', { name: 'register video controls' }));

			expect(screen.getByRole('button', { name: 'register video controls' })).toBeInTheDocument();
		});
	});
});
