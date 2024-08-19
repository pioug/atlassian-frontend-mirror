import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { IntlProvider } from 'react-intl-next';

import { type CreateFlagArgs, FlagsProvider } from '@atlaskit/flag';

import { useDatasourceTableFlag } from '../useDatasourceTableFlag';

interface ConsumerProps {
	options?: Parameters<typeof useDatasourceTableFlag>[0];
	flag?: Partial<CreateFlagArgs>;
}
const Consumer = (props?: ConsumerProps) => {
	const { showErrorFlag } = useDatasourceTableFlag(props?.options);

	return (
		<button type="button" onClick={() => showErrorFlag(props?.flag)}>
			show
		</button>
	);
};

describe('useDatasourceTableFlag', () => {
	const setup = (args?: ConsumerProps) => {
		render(
			<IntlProvider locale="en">
				<FlagsProvider>
					<Consumer {...args} />
				</FlagsProvider>
			</IntlProvider>,
		);

		const button = screen.getByRole('button');
		fireEvent.click(button);
	};

	it('throws when FlagProvider is not provided', () => {
		const { result } = renderHook(() => useDatasourceTableFlag(), {
			wrapper: ({ children }) => <IntlProvider locale="en">{children}</IntlProvider>,
		});
		expect(result.error).toEqual(Error('Unable to find FlagProviderContext'));
	});

	it('shows error flag', () => {
		setup();

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.queryByText('Something went wrong')).toBeInTheDocument();
		expect(
			screen.queryByText(
				'We had an issue trying to complete the update. Refresh the page and try again.',
			),
		).toBeInTheDocument();
	});

	it('shows error flag with custom content', () => {
		setup({
			flag: {
				title: 'custom title',
				description: 'custom description',
			},
		});

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.queryByText('custom title')).toBeInTheDocument();
		expect(screen.queryByText('custom description')).toBeInTheDocument();
	});

	it('shows link to resource when url is provided', () => {
		setup({ options: { url: 'some-url' } });

		const link = screen.queryByRole('link');

		expect(link).toBeInTheDocument();
		expect(link?.textContent).toEqual('Go to item');
	});
});
