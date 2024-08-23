import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { IntlProvider } from 'react-intl-next';

import { FlagsProvider } from '@atlaskit/flag';

import { useDatasourceTableFlag } from '../useDatasourceTableFlag';

interface ConsumerProps {
	options?: Parameters<typeof useDatasourceTableFlag>[0];
	flag?: Parameters<ReturnType<typeof useDatasourceTableFlag>['showErrorFlag']>[0];
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
				'We had an issue trying to complete the update. Wait a few minutes, then try again. Contact support if this keeps happening.',
			),
		).toBeInTheDocument();
	});

	it('shows 403 error flag', () => {
		setup({ flag: { status: 403 } });

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.queryByText('Changes not saved')).toBeInTheDocument();
		expect(
			screen.queryByText('You need the right permissions to edit this item.'),
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
});
