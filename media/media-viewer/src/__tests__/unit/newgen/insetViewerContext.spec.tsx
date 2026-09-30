import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import {
	InsetViewerProvider,
	useIsInsetViewer,
	withInsetViewer,
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
});
