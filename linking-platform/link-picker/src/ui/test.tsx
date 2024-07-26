import React, { type PropsWithChildren } from 'react';

import { screen } from '@testing-library/dom';
import { waitForElementToBeRemoved } from '@testing-library/react';

import { renderWithIntl as render } from '@atlaskit/link-test-helpers';
import '@testing-library/jest-dom';

import type { LinkPickerProps } from '../common/types';

import type { LinkPicker as LinkPickerType } from './link-picker';

const testIds = {
	urlInputField: 'link-url',
	errorBoundary: 'link-picker-root-error-boundary-ui',
	loaderBoundary: 'link-picker-root-loader-boundary-ui',
	tabList: 'link-picker-tabs',
	tabItem: 'link-picker-tab',
	linkPickerRoot: 'link-picker-root',
	actionButton: 'link-picker-action-button',
};

describe('lazy loaded export', () => {
	const setupLazyLinkPicker = ({ url = '', component, plugins }: Partial<LinkPickerProps> = {}) => {
		jest.isolateModules(() => {
			const LinkPicker: typeof LinkPickerType = require('./index').DeprecatedLazyLinkPickerExport;
			render(
				<LinkPicker
					component={component}
					url={url}
					onSubmit={jest.fn()}
					plugins={plugins ?? []}
					onCancel={jest.fn()}
				/>,
			);
		});
	};

	it('after resolving it should load the LinkPicker component', async () => {
		setupLazyLinkPicker();

		await waitForElementToBeRemoved(() => screen.getByTestId(testIds.loaderBoundary));

		expect(screen.getByTestId(testIds.urlInputField)).toBeInTheDocument();
	});

	it('should render loader-fallback', () => {
		setupLazyLinkPicker();
		expect(screen.getByTestId(testIds.loaderBoundary)).toBeInTheDocument();
	});
});

describe.each(['default', 'DeprecatedLazyLinkPickerExport'])(`using export %s`, (namedExport) => {
	const setupLinkPicker = ({ url = '', component, plugins }: Partial<LinkPickerProps> = {}) => {
		jest.isolateModules(() => {
			const LinkPicker: typeof LinkPickerType = require('./index')[namedExport];
			render(
				<LinkPicker
					component={component}
					url={url}
					onSubmit={jest.fn()}
					plugins={plugins ?? []}
					onCancel={jest.fn()}
				/>,
			);
		});
	};

	describe('error boundary', () => {
		it('renders a fallback ui if the inner link picker component throws an error', async () => {
			jest.spyOn(console, 'error').mockImplementation(() => {});

			// Provide an invalid initial prop to throw an error
			setupLinkPicker({
				url: new URL('https://atlassian.com') as any,
			});

			expect(await screen.findByTestId(testIds.errorBoundary)).toBeInTheDocument();
		});
	});

	describe('with root component', () => {
		it('should render the default root component if nothing was specified', async () => {
			setupLinkPicker();

			expect(screen.getByTestId(testIds.linkPickerRoot)).toBeInTheDocument();
		});

		it('should render a customized root component', async () => {
			const CustomRootComponent = ({ children }: PropsWithChildren<Partial<LinkPickerProps>>) => {
				return <div data-testid="custom-test-id">{children}</div>;
			};
			setupLinkPicker({
				component: CustomRootComponent,
			});

			expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
		});

		it('should allow the customized root component to overwrite the plugins prop', async () => {
			const plugin1 = {
				tabKey: 'tab1',
				tabTitle: 'tab1',
				resolve: () => Promise.resolve({ data: [] }),
			};
			const plugin2 = {
				tabKey: 'tab2',
				tabTitle: 'tab2',
				resolve: () => Promise.resolve({ data: [] }),
			};
			const CustomRootComponent: React.ComponentType<
				Partial<LinkPickerProps> & { children: React.ReactElement }
			> = ({ children }) => {
				return React.cloneElement(children, {
					plugins: [plugin1, plugin2],
				});
			};

			setupLinkPicker({
				component: CustomRootComponent,
				plugins: [plugin1],
			});

			expect(await screen.findByTestId(testIds.tabList)).toBeInTheDocument();
			const tabItems = screen.getAllByTestId(testIds.tabItem);
			expect(tabItems).toHaveLength(2);
		});
	});
});
