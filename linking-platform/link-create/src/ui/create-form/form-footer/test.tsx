import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type MutableState, type Tools } from 'final-form';
import { Form } from 'react-final-form';
import { IntlProvider } from 'react-intl-next';

import { asMock } from '@atlaskit/link-test-helpers/jest';

import { useFormContext } from '../../../controllers/form-context';

import { CreateFormFooter } from './main';

jest.mock('../../../controllers/form-context', () => {
	const originalModule = jest.requireActual('../../../controllers/form-context');
	return {
		...originalModule,
		useFormContext: jest.fn(originalModule.useFormContext),
	};
});

const editButtonLabel = 'Create + Open';

describe('FormFooter', () => {
	it('should find the FormFooter error by its id if formErrorMessage is defined', async () => {
		const testId = 'link-create-form';

		const { getByTestId } = render(
			<IntlProvider locale="en">
				<Form<FormData> onSubmit={() => {}}>
					{({}) => {
						return (
							<form onSubmit={() => {}}>
								<CreateFormFooter
									formErrorMessage={'errorMessage'}
									handleCancel={() => {}}
									testId={testId}
								/>
							</form>
						);
					}}
				</Form>
			</IntlProvider>,
		);

		expect(getByTestId(`${testId}-error`)).toBeInTheDocument();
	});

	it('should not find edit button in the FormFooter if enableEditView is undefined', async () => {
		const testId = 'link-create-form';

		asMock(useFormContext).mockReturnValue({
			enableEditView: undefined,
		});

		render(
			<IntlProvider locale="en">
				<Form<FormData> onSubmit={() => {}}>
					{(props) => {
						return (
							<form onSubmit={props.handleSubmit}>
								<CreateFormFooter
									formErrorMessage={undefined}
									handleCancel={() => {}}
									testId={testId}
								/>
							</form>
						);
					}}
				</Form>
			</IntlProvider>,
		);

		expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('type', 'button');
		expect(screen.getByRole('button', { name: 'Create' })).toHaveAttribute('type', 'submit');
		expect(screen.queryByRole('button', { name: editButtonLabel })).not.toBeInTheDocument();
	});

	it('should show edit button when enableEditView is defined and only load edit button when edit button is clicked', async () => {
		const testId = 'link-create-form';

		asMock(useFormContext).mockReturnValue({
			enableEditView: jest.fn(),
		});

		render(
			<IntlProvider locale="en">
				<Form<FormData>
					onSubmit={() =>
						new Promise((res) => {
							setTimeout(res, 100);
						})
					}
					mutators={{
						setField: <K extends keyof FormData>(
							args: [K, FormData[K]],
							state: MutableState<FormData>,
							tools: Tools<FormData>,
						) => {
							tools.changeValue(state, args[0].toString(), () => args[1]);
						},
					}}
				>
					{(props) => {
						return (
							<form onSubmit={props.handleSubmit}>
								<CreateFormFooter
									formErrorMessage={undefined}
									handleCancel={() => {}}
									testId={testId}
								/>
							</form>
						);
					}}
				</Form>
			</IntlProvider>,
		);

		expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('type', 'button');
		const submitButton = screen.getByRole('button', { name: 'Create' });
		expect(submitButton).toHaveAttribute('type', 'submit');

		const editButton = screen.getByRole('button', { name: editButtonLabel });
		expect(editButton).toHaveAttribute('type', 'button');

		expect(editButton).not.toHaveAttribute('data-has-overlay');

		await userEvent.click(editButton);
		expect(editButton).toHaveAttribute('data-has-overlay', 'true');
	});

	it('should show edit button when enableEditView is defined and only load submit button when submit button is clicked', async () => {
		const testId = 'link-create-form';

		asMock(useFormContext).mockReturnValue({
			enableEditView: jest.fn(),
		});

		render(
			<IntlProvider locale="en">
				<Form<FormData>
					onSubmit={() =>
						new Promise((res) => {
							setTimeout(res, 100);
						})
					}
					mutators={{
						setField: <K extends keyof FormData>(
							args: [K, FormData[K]],
							state: MutableState<FormData>,
							tools: Tools<FormData>,
						) => {
							tools.changeValue(state, args[0].toString(), () => args[1]);
						},
					}}
				>
					{(props) => {
						return (
							<form onSubmit={props.handleSubmit}>
								<CreateFormFooter
									formErrorMessage={undefined}
									handleCancel={() => {}}
									testId={testId}
								/>
							</form>
						);
					}}
				</Form>
			</IntlProvider>,
		);

		expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('type', 'button');
		const submitButton = screen.getByRole('button', { name: 'Create' });
		expect(submitButton).toHaveAttribute('type', 'submit');

		const editButton = screen.getByRole('button', { name: editButtonLabel });
		expect(editButton).toHaveAttribute('type', 'button');
		expect(submitButton).not.toHaveAttribute('data-has-overlay');

		await userEvent.click(submitButton);
		expect(submitButton).toHaveAttribute('data-has-overlay', 'true');
	});
});
