import React, { type ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import cases from 'jest-in-case';

import { axe } from '@af/accessibility-testing';
import Checkbox from '@atlaskit/checkbox';
import noop from '@atlaskit/ds-lib/noop';
import Range from '@atlaskit/range';
import TextField from '@atlaskit/textfield';

import Form, {
	CharacterCounterField,
	CheckboxField,
	ErrorMessage,
	Field,
	Fieldset,
	FormFooter,
	FormHeader,
	FormSection,
	HelperMessage,
	Label,
	Legend,
	RangeField,
	RequiredAsterisk,
	ValidMessage,
} from '../../index';

describe('should pass axe accessibility testing', () => {
	it('Form', async () => {
		const { container } = render(<Form onSubmit={noop}>{null}</Form>);
		await axe(container);
	});

	cases(
		'Organizational Elements',
		async ({ jsx }: { jsx: ReactElement }) => {
			const { container } = render(jsx);
			await axe(container);
		},
		[
			{ name: 'FormHeader', jsx: <FormHeader>Test</FormHeader> },
			{ name: 'FormFooter', jsx: <FormFooter>Test</FormFooter> },
			{ name: 'FormSection', jsx: <FormSection>Test</FormSection> },
		],
	);

	cases(
		'Messages',
		async ({ jsx }: { jsx: ReactElement }) => {
			const { container } = render(jsx);
			await axe(container);
		},
		[
			{ name: 'ErrorMessage', jsx: <ErrorMessage>Test</ErrorMessage> },
			{ name: 'HelperMessage', jsx: <HelperMessage>Test</HelperMessage> },
			{ name: 'ValidMessage', jsx: <ValidMessage>Test</ValidMessage> },
		],
	);

	it('RequiredAsterisk', async () => {
		const { container } = render(<RequiredAsterisk />);

		await axe(container);
	});

	it('Label', async () => {
		const { container } = render(
			<>
				<Label htmlFor="test">Label</Label>
				<input type="text" id="test" />
			</>,
		);

		await axe(container);
	});

	it('Legend', async () => {
		const { container } = render(
			<fieldset>
				<Legend>Legend</Legend>
			</fieldset>,
		);

		await axe(container);
	});

	describe('Fields', () => {
		// This is separate because not having these messages will throw the axe
		// check. The aria-describedby references these IDs so they should be
		// present
		const messages = (
			<>
				<HelperMessage>Test</HelperMessage>
				<ErrorMessage>Test</ErrorMessage>
				<ValidMessage>Test</ValidMessage>
			</>
		);

		it('Field', async () => {
			const { container } = render(
				<Form onSubmit={noop}>
					{() => (
						<Field name="test" label="Test">
							{({ fieldProps }) => (
								<>
									<input type="text" {...fieldProps} />
									{messages}
								</>
							)}
						</Field>
					)}
				</Form>,
			);

			await axe(container);
		});

		it('CheckboxField', async () => {
			const { container } = render(
				<Form onSubmit={noop}>
					{() => (
						<CheckboxField name="app" value="jira">
							{({ fieldProps }) => (
								<>
									<Checkbox {...fieldProps} label="Jira" />
									{messages}
								</>
							)}
						</CheckboxField>
					)}
				</Form>,
			);

			await axe(container);
		});

		it('RangeField', async () => {
			const { container } = render(
				<Form onSubmit={noop}>
					{() => (
						<RangeField name="threshold" defaultValue={50} label="Threshold">
							{({ fieldProps }) => (
								<>
									<Range {...fieldProps} min={0} max={70} />
									{messages}
								</>
							)}
						</RangeField>
					)}
				</Form>,
			);

			await axe(container);
		});

		it('Fieldset', async () => {
			const { container } = render(
				<Form onSubmit={noop}>
					{() => (
						<Fieldset legend="Legend">
							<CheckboxField name="app" value="jira">
								{({ fieldProps }) => (
									<>
										<Checkbox {...fieldProps} label="Jira" />
										{messages}
									</>
								)}
							</CheckboxField>
						</Fieldset>
					)}
				</Form>,
			);

			await axe(container);
		});

		describe('CharacterCounterField', () => {
			it('under maximum characters', async () => {
				const { container } = render(
					<Form onSubmit={noop}>
						<CharacterCounterField
							name="description"
							label="Description"
							maxCharacters={50}
							testId="character-field"
						>
							{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
						</CharacterCounterField>
					</Form>,
				);

				const input = screen.getByTestId('text-field');
				await userEvent.type(input, 'Valid text that meets minimum');

				await axe(container);
			});

			it('over maximum characters', async () => {
				const { container } = render(
					<Form onSubmit={noop}>
						<CharacterCounterField
							name="description"
							label="Description"
							maxCharacters={10}
							testId="character-field"
						>
							{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
						</CharacterCounterField>
					</Form>,
				);

				const input = screen.getByTestId('text-field');
				await userEvent.type(input, 'Valid text that exceeds maximum');

				await axe(container);
			});
		});
	});
});
