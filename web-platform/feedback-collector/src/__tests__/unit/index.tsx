import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import FeedbackCollector from '../../components/FeedbackCollector';
import FeedbackFlag from '../../components/FeedbackFlag';
import FeedbackForm, { type OptionType } from '../../components/FeedbackForm';
import { type FormFields } from '../../types';

import { customFieldRecords, emptyOptionData } from './_data';

jest.mock('../../i18n/fr', () => ({
	'feedback-collector.feedback-title': 'Translated feedback title (FR)',
}));

jest
	.spyOn(FeedbackCollector.prototype, 'getEntitlementInformation')
	// @ts-ignore
	.mockImplementation(() => {
		return null;
	});

const renderFeedbackCollector = (props = {}) =>
	render(
		<FeedbackCollector
			locale={'en'}
			onClose={() => {}}
			onSubmit={() => {}}
			name="name"
			entrypointId="entrypoint_id"
			{...props}
		/>,
	);

describe('Feedback Collector unit tests', () => {
	describe('Feedback integration', () => {
		test('should render visual instruction for mandatory field', () => {
			renderFeedbackCollector({});
			const visualInstruction = screen.getByText('Required fields are marked with an asterisk');
			expect(visualInstruction).toBeInTheDocument();
		});

		describe('Transforming form values into format', () => {
			let feedbackCollector: FeedbackCollector;
			beforeEach(() => {
				feedbackCollector = new FeedbackCollector({
					...FeedbackCollector.defaultProps,
					entrypointId: 'entrypoint_id',
				});
			});

			test('value is selected, everything else is empty', async () => {
				const formValues: FormFields = {
					type: 'bug',
					description: '',
					canBeContacted: false,
					enrollInResearchGroup: false,
				};

				const resultValues = {
					fields: [
						{
							id: 'customfield_10042',
							value: {
								id: '10105',
							},
						},
						{
							id: 'summary',
							value: '',
						},
						{
							id: 'description',
							value: '',
						},
						{
							id: 'aaidOrHash',
							value: undefined,
						},
						{
							id: 'customfield_10045',
							value: 'unknown',
						},
						{
							id: 'customfield_10043',
							value: [{ id: '10111' }],
						},
						{
							id: 'customfield_10044',
							value: [{ id: '10112' }],
						},
					],
				};

				const resultJsd = await feedbackCollector.mapFormToJSD(formValues);

				expect(resultJsd).toEqual(resultValues);
			});

			test('value is selected, description is filled, everything else is empty', async () => {
				const formValues: FormFields = {
					type: 'comment',
					description: 'some text',
					canBeContacted: false,
					enrollInResearchGroup: false,
				};

				const resultValues = {
					fields: [
						{
							id: 'customfield_10042',
							value: {
								id: '10106',
							},
						},
						{
							id: 'summary',
							value: 'some text',
						},
						{
							id: 'description',
							value: 'some text',
						},
						{
							id: 'aaidOrHash',
							value: undefined,
						},
						{
							id: 'customfield_10045',
							value: 'unknown',
						},
						{
							id: 'customfield_10043',
							value: [{ id: '10111' }],
						},
						{
							id: 'customfield_10044',
							value: [{ id: '10112' }],
						},
					],
				};

				const resultJsd = await feedbackCollector.mapFormToJSD(formValues);

				expect(resultJsd).toEqual(resultValues);
			});

			test('value is selected, description is filled, consent to contact is given', async () => {
				const formValues: FormFields = {
					type: 'suggestion',
					description: 'some text',
					canBeContacted: true,
					enrollInResearchGroup: false,
				};

				const resultValues = {
					fields: [
						{
							id: 'customfield_10042',
							value: {
								id: '10107',
							},
						},
						{
							id: 'summary',
							value: 'some text',
						},
						{
							id: 'description',
							value: 'some text',
						},
						{
							id: 'aaidOrHash',
							value: undefined,
						},
						{
							id: 'customfield_10045',
							value: 'unknown',
						},
						{
							id: 'customfield_10043',
							value: [{ id: '10109' }],
						},
						{
							id: 'customfield_10044',
							value: [{ id: '10112' }],
						},
					],
				};

				const resultJsd = await feedbackCollector.mapFormToJSD(formValues);

				expect(resultJsd).toEqual(resultValues);
			});

			test('value is selected, description is filled, consent to contact is given, enrolled in research', async () => {
				const formValues: FormFields = {
					type: 'question',
					description: 'some text',
					canBeContacted: true,
					enrollInResearchGroup: true,
				};

				const resultValues = {
					fields: [
						{
							id: 'customfield_10042',
							value: {
								id: '10108',
							},
						},
						{
							id: 'summary',
							value: 'some text',
						},
						{
							id: 'description',
							value: 'some text',
						},
						{
							id: 'aaidOrHash',
							value: undefined,
						},
						{
							id: 'customfield_10045',
							value: 'unknown',
						},
						{
							id: 'customfield_10043',
							value: [
								{
									id: '10109',
								},
							],
						},
						{
							id: 'customfield_10044',
							value: [
								{
									id: '10110',
								},
							],
						},
					],
				};

				const resultJsd = await feedbackCollector.mapFormToJSD(formValues);

				expect(resultJsd).toEqual(resultValues);
			});
		});

		describe('Without reason select', () => {
			let feedbackCollector: FeedbackCollector;
			beforeEach(() => {
				feedbackCollector = new FeedbackCollector({
					...FeedbackCollector.defaultProps,
					entrypointId: 'entrypoint_id',
					name: 'name',
				});
			});
			test('Should set feedback without a feedback type', async () => {
				const formValues: FormFields = {
					type: 'question',
					description: 'some text',
					canBeContacted: true,
					enrollInResearchGroup: true,
				};

				const resultValues = {
					fields: [
						{
							id: 'customfield_10042',
							value: {
								id: '10108',
							},
						},
						{
							id: 'summary',
							value: 'some text',
						},
						{
							id: 'description',
							value: 'some text',
						},
						{
							id: 'aaidOrHash',
							value: undefined,
						},
						{
							id: 'customfield_10045',
							value: 'name',
						},
						{
							id: 'customfield_10043',
							value: [
								{
									id: '10109',
								},
							],
						},
						{
							id: 'customfield_10044',
							value: [
								{
									id: '10110',
								},
							],
						},
					],
				};

				const resultJsd = await feedbackCollector.mapFormToJSD(formValues);

				expect(resultJsd).toEqual(resultValues);
			});

			test('should add context with email', async () => {
				feedbackCollector = new FeedbackCollector({
					...FeedbackCollector.defaultProps,
					entrypointId: 'entrypoint_id',
					email: 'test@test.com',
					name: 'name',
				});

				const formValues: FormFields = {
					type: 'question',
					description: 'some text',
					canBeContacted: true,
					enrollInResearchGroup: true,
				};

				const resultValues = {
					fields: [
						{
							id: 'customfield_10042',
							value: {
								id: '10108',
							},
						},
						{
							id: 'summary',
							value: 'some text',
						},
						{
							id: 'description',
							value: 'some text',
						},
						{
							id: 'aaidOrHash',
							value: undefined,
						},
						{
							id: 'customfield_10045',
							value: 'name',
						},
						{
							id: 'customfield_10043',
							value: [
								{
									id: '10109',
								},
							],
						},
						{
							id: 'customfield_10044',
							value: [
								{
									id: '10110',
								},
							],
						},
						{
							id: 'customfield_10047',
							value: 'email: test@test.com',
						},
					],
				};

				const resultJsd = await feedbackCollector.mapFormToJSD(formValues);

				expect(resultJsd).toEqual(resultValues);
			});

			test('should add email to existing context', async () => {
				feedbackCollector = new FeedbackCollector({
					...FeedbackCollector.defaultProps,
					entrypointId: 'entrypoint_id',
					email: 'test@test.com',
					name: 'name',
					additionalFields: [
						{
							id: 'customfield_10047',
							value: 'This is a test\nWe have some formatting here',
						},
					],
				});
				const formValues: FormFields = {
					type: 'question',
					description: 'some text',
					canBeContacted: true,
					enrollInResearchGroup: true,
				};

				const resultValues = {
					fields: [
						{
							id: 'customfield_10042',
							value: {
								id: '10108',
							},
						},
						{
							id: 'summary',
							value: 'some text',
						},
						{
							id: 'description',
							value: 'some text',
						},
						{
							id: 'aaidOrHash',
							value: undefined,
						},
						{
							id: 'customfield_10045',
							value: 'name',
						},
						{
							id: 'customfield_10043',
							value: [
								{
									id: '10109',
								},
							],
						},
						{
							id: 'customfield_10044',
							value: [
								{
									id: '10110',
								},
							],
						},
						{
							id: 'customfield_10047',
							value: `This is a test
We have some formatting here
        email: test@test.com`,
						},
					],
				};

				const resultJsd = await feedbackCollector.mapFormToJSD(formValues);

				expect(resultJsd).toEqual(resultValues);
			});
		});

		describe('With custom copy', () => {
			const customPreamble = 'Your feedback means a lot to us, thank you.';

			test('Should render the custom copy in the component without reason select', () => {
				const { getByTestId } = renderFeedbackCollector({
					showTypeField: false,
					feedbackTitle: 'Custom title',
					feedbackTitleDetails: (
						<>
							<div data-testid="test-preamble-content">
								Your feedback means a lot to us, thank you.
							</div>
						</>
					),
					summaryPlaceholder: 'Enter your feedback here',
					canBeContactedLabel: (
						<p id="test-contacted-content">Atlassian can contact me about my feedback</p>
					),
					enrolInResearchLabel: (
						<p id="test-research-content">Please enroll me in research program</p>
					),
				});
				expect(getByTestId('test-preamble-content').textContent).toEqual(customPreamble);
			});

			test('Should render the custom copy in the component with reason select', () => {
				const { getAllByRole, getByRole, getByText } = renderFeedbackCollector({
					showTypeField: true,
					submitButtonLabel: 'Submit Button',
					cancelButtonLabel: 'Cancel Button',
					feedbackGroupLabels: customFieldRecords,
				});

				expect(getAllByRole('button').length).toBe(3); // now includes 'x'

				expect(getByRole('combobox', { name: 'Select feedback' })).toBeTruthy();
				expect(getByText(emptyOptionData).textContent).toEqual(emptyOptionData);
			});

			test('Should render the custom copy in the component with reason select and aaid', () => {
				const { getAllByRole, getByRole, getByText } = renderFeedbackCollector({
					atlassianAccountId: 'aaid',
					showTypeField: true,
					submitButtonLabel: 'Submit Button',
					cancelButtonLabel: 'Cancel Button',
					feedbackGroupLabels: customFieldRecords,
				});

				expect(getAllByRole('button').length).toBe(3); // now includes 'x'

				expect(getByRole('combobox', { name: 'Select feedback' })).toBeTruthy();
				expect(getByText(emptyOptionData).textContent).toEqual(emptyOptionData);
			});
		});

		describe('Posting feedback', () => {
			let feedbackCollector: FeedbackCollector;
			beforeEach(() => {
				feedbackCollector = new FeedbackCollector({
					...FeedbackCollector.defaultProps,
					entrypointId: 'entrypoint_id',
				});
			});
			test('Should invoke props.onSubmit', async () => {
				class TestableFeedbackCollector extends FeedbackCollector {}

				const onSubmit = jest.fn();
				const timeoutOnSubmit = 700;
				feedbackCollector = new FeedbackCollector({
					...FeedbackCollector.defaultProps,
					entrypointId: '',
					onSubmit,
					timeoutOnSubmit,
					name: 'name',
				});
				render(
					<TestableFeedbackCollector
						onClose={() => {}}
						onSubmit={onSubmit}
						timeoutOnSubmit={timeoutOnSubmit}
						name="name"
						entrypointId=""
					/>,
				);

				// Emulates the user clicking the submit button within the rendered form.
				const feedback: FormFields = {
					type: 'empty',
					description: `This won't actually dispatch due to missing entrypointId prop`,
					canBeContacted: false,
					enrollInResearchGroup: false,
				};

				feedbackCollector.postFeedback(feedback);

				// Wait for the timeout to occur. The component will unmount before this triggers.
				await new Promise<void>((resolve) => {
					setTimeout(() => {
						resolve();
					}, timeoutOnSubmit);
				});

				expect(onSubmit).toHaveBeenCalled();
			});

			test.each`
				url               | customGatewayUrl        | expected
				${'/gateway/api'} | ${undefined}            | ${'/gateway/api'}
				${undefined}      | ${'custom-gateway-url'} | ${'custom-gateway-url'}
				${'/gateway/api'} | ${'custom-gateway-url'} | ${'custom-gateway-url'}
			`(
				'Should try to get entitlement based on url or customGatewayUrl',
				async ({ url, customGatewayUrl, expected }) => {
					feedbackCollector = new FeedbackCollector({
						...FeedbackCollector.defaultProps,
						entrypointId: 'entrypoint_id',
						url,
						customGatewayUrl,
					});

					const gatewayUrl = feedbackCollector.getGatewayUrl();
					expect(gatewayUrl).toStrictEqual(expected);

					const entitlementSpy = jest.spyOn(
						FeedbackCollector.prototype,
						'getEntitlementInformation',
					);
					entitlementSpy.mockResolvedValue([]);

					// Emulates the user clicking the submit button within the rendered form.
					const feedback: FormFields = {
						type: 'empty',
						description: `This won't actually dispatch due to missing entrypointId prop`,
						canBeContacted: false,
						enrollInResearchGroup: false,
					};

					await feedbackCollector.postFeedback(feedback);

					expect(entitlementSpy).toHaveBeenCalled();
				},
			);

			test.each`
				url                     | expected
				${'/not-a-gateway-url'} | ${'https://feedback-collector-api.services.atlassian.com/v2/feedback'}
				${'/gateway/api'}       | ${'/gateway/api/feedback-collector-api/v2/feedback'}
			`('Should call $expected when called url is $url', async ({ url, expected }) => {
				fetchMock.mockClear();
				const mocked = fetchMock.mockResponseOnce(
					JSON.stringify({
						status: 'OK',
						message: 'Successfully collected and dispatched Feedback',
					}),
				);
				render(
					<FeedbackCollector
						entrypointId="entrypoint_id"
						url={url}
						showTypeField={false}
						atlassianAccountId={'12345'}
						summaryPlaceholder="Let us know what's on your mind"
					/>,
				);
				const textarea = screen.getByPlaceholderText("Let us know what's on your mind");
				textarea.innerText = 'Some comment';
				fireEvent.change(textarea);
				const submitBtn = screen.getByTestId('feedbackCollectorSubmitBtn');
				await waitFor(() => {
					expect(submitBtn).not.toBeDisabled();
				});
				fireEvent.click(submitBtn);
				await waitFor(() => {
					expect(mocked.mock.calls?.[0]?.[0]).toBe(expected);
				});
			});

			test.each`
				url                     | customFeedbackUrl        | expected
				${'/not-a-gateway-url'} | ${undefined}             | ${'https://feedback-collector-api.services.atlassian.com/v2/feedback'}
				${'/not-a-gateway-url'} | ${'custom-feedback-url'} | ${'custom-feedback-url/v2/feedback'}
				${'/gateway/api'}       | ${undefined}             | ${'/gateway/api/feedback-collector-api/v2/feedback'}
			`(
				'Should correctly determine feedback url based on passed parameters',
				async ({ url, customFeedbackUrl, expected }) => {
					fetchMock.mockClear();
					const mocked = fetchMock.mockResponse(
						JSON.stringify({
							status: 'OK',
							message: 'Successfully collected and dispatched Feedback',
						}),
					);
					render(
						<FeedbackCollector
							entrypointId="entrypoint_id"
							url={url}
							customFeedbackUrl={customFeedbackUrl}
							showTypeField={false}
							summaryPlaceholder="Let us know what's on your mind"
						/>,
					);
					const textarea = screen.getByPlaceholderText("Let us know what's on your mind");
					textarea.innerText = 'Some comment';
					fireEvent.change(textarea);
					const submitBtn = screen.getByTestId('feedbackCollectorSubmitBtn');
					await waitFor(() => {
						expect(submitBtn).not.toBeDisabled();
					});
					fireEvent.click(submitBtn);
					await waitFor(() => {
						if (process.env.IS_REACT_18) {
							expect(mocked.mock.calls?.[3]?.[0]).toBe(expected);
						} else {
							expect(mocked.mock.calls?.[4]?.[0]).toBe(expected);
						}
					});
				},
			);

			test('should not send requests for entitlement if shouldGetEntitlementDetails is false', async () => {
				feedbackCollector = new FeedbackCollector({
					...FeedbackCollector.defaultProps,
					entrypointId: 'entrypoint_id',
					customGatewayUrl: '/custom-gateway-url',
					customFeedbackUrl: '/custom-feedback-url',
					shouldGetEntitlementDetails: false,
				});

				const feedback: FormFields = {
					type: 'empty',
					description: `This won't actually dispatch due to missing entrypointId prop`,
					canBeContacted: true,
					enrollInResearchGroup: false,
				};
				const entitlementSpy = jest.spyOn(FeedbackCollector.prototype, 'getEntitlementInformation');
				const gatewayUrlSpy = jest.spyOn(FeedbackCollector.prototype, 'getGatewayUrl');

				entitlementSpy.mockClear();
				gatewayUrlSpy.mockClear();
				await feedbackCollector.mapFormToJSD(feedback);

				expect(entitlementSpy).not.toHaveBeenCalled();
				expect(gatewayUrlSpy).not.toHaveBeenCalled();
			});
		});

		describe('Localisation', () => {
			test('should be supported when a locale is passed', async () => {
				const { findByText } = render(
					<FeedbackCollector locale="fr" entrypointId="entrypoint_id" />,
				);

				expect(await findByText('Translated feedback title (FR)')).toBeDefined();
			});
		});
	});

	describe('Feedback Form integration', () => {
		test('FeedbackForm should select only by default', async () => {
			const { getAllByRole } = render(
				<FeedbackForm locale={'en'} onClose={() => {}} onSubmit={async () => {}} />,
			);

			expect(getAllByRole('combobox')).toHaveLength(1);
		});

		test('FeedbackForm should render textarea when something is selected', () => {
			const { getAllByRole } = render(
				<FeedbackForm locale={'en'} onClose={() => {}} onSubmit={async () => {}} />,
			);

			const select = getAllByRole('combobox')[0];
			fireEvent.change(select, { target: { value: 'comment' } });
			fireEvent.keyDown(select, { key: 'Enter', code: 13 });

			expect(getAllByRole('combobox')).toHaveLength(1);
			expect(getAllByRole('textbox')).toHaveLength(1);
		});

		test('FeedbackForm should render checkboxes and textarea when something is selected', () => {
			const { getByRole, getAllByRole } = render(
				<FeedbackForm locale={'en'} onClose={() => {}} onSubmit={async () => {}} />,
			);

			const select = getByRole('combobox', { name: 'Select feedback' });
			fireEvent.change(select, { target: { value: 'comment' } });
			fireEvent.keyDown(select, { key: 'Enter', code: 13 });

			expect(getAllByRole('combobox')).toHaveLength(1);
			expect(getAllByRole('textbox')).toHaveLength(1);
			expect(getAllByRole('checkbox')).toHaveLength(2);
		});

		test('FeedbackForm should render textarea and anon panel when something is selected', async () => {
			const { getByRole, getAllByRole } = render(
				<FeedbackForm
					locale={'en'}
					onClose={() => {}}
					onSubmit={async () => {}}
					anonymousFeedback={true}
				/>,
			);
			const select = getByRole('combobox', { name: 'Select feedback' });
			fireEvent.change(select, { target: { value: 'comment' } });
			fireEvent.keyDown(select, { key: 'Enter', code: 13 });

			expect(getAllByRole('combobox')).toHaveLength(1);
			expect(getAllByRole('textbox')).toHaveLength(1);
			expect(getByRole('heading', { name: 'Anonymous feedback' })).toBeInTheDocument();
		});

		test('should render a correct field label name when selectLabel is passed in', () => {
			render(
				<FeedbackForm
					locale={'en'}
					onClose={() => {}}
					onSubmit={async () => {}}
					selectLabel="test label name"
				/>,
			);
			const label = screen.getByText('test label name');
			expect(label).toBeInTheDocument();
		});
	});

	describe('Feedback Flag', () => {
		test('FeedbackFlag should have default content', () => {
			const { getByText } = render(<FeedbackFlag />);
			const title = getByText('Thanks!');
			const description = getByText(
				'Your valuable feedback helps us continually improve our products.',
			);
			expect(title).toBeInTheDocument();
			expect(description).toBeInTheDocument();
		});

		test('FeedbackFlag should have custom copy', () => {
			const { getByText } = render(
				<FeedbackFlag title={'Feedback Title'} description={'Feedback Description'} />,
			);

			const title = getByText('Feedback Title');
			const description = getByText('Feedback Description');
			expect(title).toBeInTheDocument();
			expect(description).toBeInTheDocument();
		});
	});
	describe('Feedback Select Type', () => {
		describe('Custom Feedback Select Options with FF true/false', () => {
			const customFeedbackOptions: OptionType[] = [
				{
					label: 'Leave a comment',
					value: 'comment',
				},
				{
					label: 'Give a suggestion',
					value: 'suggestion',
				},
			];
			ffTest(
				'platform.custom-select-feedback-options_c61l9',
				() => {
					const { getByRole } = render(
						<FeedbackForm
							locale={'en'}
							onClose={() => {}}
							onSubmit={async () => {}}
							customFeedbackOptions={customFeedbackOptions}
						/>,
					);

					const combobox = getByRole('combobox');
					fireEvent.keyDown(combobox, { key: 'ArrowDown', code: 40 });
					const options = document.querySelectorAll('#react-select-12-listbox > div > div');

					expect(options).toHaveLength(customFeedbackOptions.length);
				},
				() => {
					const { getByRole } = render(
						<FeedbackForm
							locale={'en'}
							onClose={() => {}}
							onSubmit={async () => {}}
							customFeedbackOptions={customFeedbackOptions}
						/>,
					);

					const combobox = getByRole('combobox');
					fireEvent.keyDown(combobox, { key: 'ArrowDown', code: 40 });
					const options = document.querySelectorAll('#react-select-12-listbox > div > div');
					expect(options).not.toHaveLength(customFeedbackOptions.length);
				},
			);
		});
	});
});
