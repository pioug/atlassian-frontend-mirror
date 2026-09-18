import React, { type ComponentProps, Fragment, type ReactElement } from 'react';

import { IntlProvider } from 'react-intl'; // eslint-disable-line import/no-extraneous-dependencies
import { DiProvider } from 'react-magnetic-di';

import { render } from '@atlassian/testing-library';

type RenderOptions = NonNullable<Parameters<typeof render>[1]>;

type RenderResult = ReturnType<typeof render>;

const Provider = ({
	children,
	use,
	target,
}: JSX.LibraryManagedAttributes<typeof DiProvider, ComponentProps<typeof DiProvider>>) => (
	<IntlProvider locale="en">
		<DiProvider use={use} target={target}>
			{children}
		</DiProvider>
	</IntlProvider>
);

/**
 * Render into a container which is appended to `document.body`.
 *
 * Includes `IntlProvider` wrapper
 *
 * @param node The React element to render
 * @param dependencies List of React Magnetic DI dependencies to inject
 * @param options React Testing Library options
 */
export const renderWithDi = (
	node: ReactElement,
	dependencies: any[] = [],
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	options?: RenderOptions & { target?: any },
): RenderResult =>
	render(node, {
		...options,
		wrapper({ children }) {
			const CustomWrapper = options?.wrapper ?? Fragment;
			return (
				<Provider use={[...dependencies]} target={options?.target}>
					<CustomWrapper>{children}</CustomWrapper>
				</Provider>
			);
		},
	});
