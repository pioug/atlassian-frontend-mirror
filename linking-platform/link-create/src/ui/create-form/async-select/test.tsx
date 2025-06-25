import React from 'react';

import { act, render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import { IntlProvider } from 'react-intl-next';

import { flushPromises } from '@atlaskit/link-test-helpers';
import { AsyncSelect as AkAsyncSelect } from '@atlaskit/select';

import { LinkCreateCallbackProvider } from '../../../controllers/callback-context';
import { FormContextProvider } from '../../../controllers/form-context';

import { AsyncSelect, TEST_ID } from './main';

jest.mock('@atlaskit/select', () => {
	const originalModule = jest.requireActual('@atlaskit/select');
	return {
		...originalModule,
		AsyncSelect: jest.fn((props) => <originalModule.AsyncSelect {...props} />),
	};
});

describe('AsyncSelect', () => {
	const setup = (props: Partial<React.ComponentProps<typeof AsyncSelect>> = {}) => {
		const onCreate = jest.fn();
		const onFailure = jest.fn();

		render(
			<IntlProvider locale="en">
				<FormContextProvider>
					<LinkCreateCallbackProvider onCreate={onCreate} onFailure={onFailure}>
						<Form onSubmit={() => {}}>
							{() => (
								<form>
									<AsyncSelect name="select" label="select an option" testId={TEST_ID} {...props} />
								</form>
							)}
						</Form>
					</LinkCreateCallbackProvider>
				</FormContextProvider>
			</IntlProvider>,
		);

		return {
			onCreate,
			onFailure,
		};
	};

	it("should find LinkCreate by its testid when it's active", async () => {
		setup();

		expect(screen.getByTestId(TEST_ID)).toBeTruthy();
	});

	it('should load options using loadOptions fn', async () => {
		const loadOptions = jest.fn();
		loadOptions.mockImplementation(
			() =>
				new Promise<{ label: string; value: string }[]>((resolve) => {
					setTimeout(() => {
						resolve([{ label: 'Option 1', value: '1' }]);
						resolve([{ label: 'Option 2', value: '2' }]);
					}, 10);
				}),
		);
		setup({ loadOptions });

		await act(async () => {
			await flushPromises();
		});

		expect(loadOptions).toHaveBeenCalled();
	});

	it('should wrap loadOptions fn prop with error handler', async () => {
		const loadOptions = jest.fn(() => {
			throw new Response(null, { status: 500 });
		});
		const { onFailure } = setup({ loadOptions });

		expect(AkAsyncSelect).not.toBeCalledWith(
			expect.objectContaining({
				loadOptions,
			}),
		);
		expect(AkAsyncSelect).toBeCalledWith(
			expect.objectContaining({
				loadOptions: expect.any(Function),
			}),
			{},
		);

		await act(async () => {
			await flushPromises();
		});

		expect(loadOptions).toHaveBeenCalled();
		expect(onFailure).toHaveBeenCalledWith(expect.any(Response));
	});
	it('should capture and report a11y violations', async () => {
		const onCreate = jest.fn();
		const onFailure = jest.fn();
		const { container } = render(
			<IntlProvider locale="en">
				<FormContextProvider>
					<LinkCreateCallbackProvider onCreate={onCreate} onFailure={onFailure}>
						<Form onSubmit={() => {}}>
							{() => (
								<form>
									<AsyncSelect name="select" label="select an option" testId={TEST_ID} />
								</form>
							)}
						</Form>
					</LinkCreateCallbackProvider>
				</FormContextProvider>
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});
});
