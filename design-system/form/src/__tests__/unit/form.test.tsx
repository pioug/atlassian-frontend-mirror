import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from '@atlaskit/button/new';
import TextField from '@atlaskit/textfield';

import Field from '../../field';
import Form from '../../form';

describe('Form', () => {
	const user = userEvent.setup();

	it('should call `onSubmit` when submitted using mouse', async () => {
		const handleSubmit = jest.fn();
		render(
			<Form onSubmit={(values) => handleSubmit(values)}>
				{({ formProps }) => (
					<form {...formProps}>
						<Field name="username" label="Username" defaultValue="Charlie">
							{({ fieldProps }) => <TextField {...fieldProps} testId="Username" />}
						</Field>
						<Button type="submit" testId="SubmitButton">
							Submit
						</Button>
					</form>
				)}
			</Form>,
		);

		expect(handleSubmit).not.toHaveBeenCalled();
		await user.click(screen.getByTestId('SubmitButton'));
		expect(handleSubmit).toHaveBeenCalled();
	});

	it('should call `onSubmit` when sub mitted using `enter`', async () => {
		const handleSubmit = jest.fn();
		render(
			<Form onSubmit={(values) => handleSubmit(values)}>
				{({ formProps }) => (
					<form {...formProps}>
						<Field name="username" label="Username" defaultValue="Charlie">
							{({ fieldProps }) => <TextField {...fieldProps} testId="Username" />}
						</Field>
						<Button type="submit" testId="SubmitButton">
							Submit
						</Button>
					</form>
				)}
			</Form>,
		);

		expect(handleSubmit).not.toHaveBeenCalled();
		await user.type(screen.getByTestId('Username'), '{Enter}');
		expect(handleSubmit).toHaveBeenCalled();
	});

	it('should update the onSubmit prop when it was updated', async () => {
		const handleSubmit = jest.fn();
		render(
			<Form onSubmit={(values) => handleSubmit(values)}>
				{({ formProps }) => (
					<form {...formProps}>
						<Field name="username" label="Username" defaultValue="">
							{({ fieldProps }) => <TextField {...fieldProps} testId="Username" />}
						</Field>
						<Button type="submit" testId="SubmitButton">
							Submit
						</Button>
					</form>
				)}
			</Form>,
		);

		await user.keyboard(`{Tab}charlie`);
		await user.click(screen.getByTestId('SubmitButton'));

		expect(handleSubmit).toHaveBeenCalledWith({
			username: 'charlie',
		});
	});

	it('should not blow up when calling onSubmit programatically', () => {
		const onSubmit = jest.fn();

		expect(() => {
			render(
				<Form onSubmit={onSubmit}>
					{({ formProps }) => {
						formProps.onSubmit();
						return null;
					}}
				</Form>,
			);
		}).not.toThrow();
	});

	it('should reset the form when the reset function is triggered', async () => {
		const handleSubmit = jest.fn();
		render(
			<Form onSubmit={(values) => handleSubmit(values)}>
				{({ formProps, reset }) => (
					<form {...formProps}>
						<Field name="username" label="Username" defaultValue="">
							{({ fieldProps }) => <TextField {...fieldProps} testId="Username" />}
						</Field>
						<Field name="email" label="Email" defaultValue="foo@atlassian.com">
							{({ fieldProps }) => <TextField {...fieldProps} testId="Email" />}
						</Field>
						<Button appearance="subtle" onClick={() => reset()} testId="ResetButton">
							Reset form
						</Button>
						<Button type="submit" testId="SubmitButton">
							Submit
						</Button>
					</form>
				)}
			</Form>,
		);

		const emailInput = screen.getByTestId('Email');
		const submitButton = screen.getByTestId('SubmitButton');
		const resetButton = screen.getByTestId('ResetButton');

		await user.keyboard(`{Tab}charlie`);
		await user.clear(emailInput);
		await user.keyboard(`bar@atlassian.com`);
		await user.click(submitButton);

		expect(handleSubmit).toHaveBeenCalledWith({
			username: 'charlie',
			email: 'bar@atlassian.com',
		});

		await user.click(resetButton);
		await user.click(submitButton);

		expect(handleSubmit).toHaveBeenCalledTimes(2);
		expect(handleSubmit).toHaveBeenCalledWith({
			username: '',
			email: 'foo@atlassian.com',
		});
	});

	it('should be able to update form state imperatively', async () => {
		const handleSubmit = jest.fn();
		render(
			<Form onSubmit={(values) => handleSubmit(values)}>
				{({ formProps, setFieldValue }) => (
					<form {...formProps}>
						<Field name="username" label="Username" defaultValue="">
							{({ fieldProps }) => (
								<TextField
									{...fieldProps}
									onChange={(e) => {
										e.currentTarget.value;
										setFieldValue('slug', `${e.currentTarget.value}-brown`);
										fieldProps.onChange(e);
									}}
									testId="Username"
								/>
							)}
						</Field>
						<Field name="slug" label="Slug" defaultValue="">
							{({ fieldProps }) => <TextField {...fieldProps} />}
						</Field>
						<Button type="submit" testId="SubmitButton">
							Submit
						</Button>
					</form>
				)}
			</Form>,
		);

		await user.keyboard(`{Tab}charlie`);
		await user.click(screen.getByTestId('SubmitButton'));

		expect(handleSubmit).toHaveBeenCalledWith({
			username: 'charlie',
			slug: 'charlie-brown',
		});
	});
});
