import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mount, type ReactWrapper, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { Checkbox } from '@atlaskit/checkbox';
import { AutoDismissFlag } from '@atlaskit/flag';
import { Field } from '@atlaskit/form';
import Select from '@atlaskit/select';

import FeedbackCollector from '../../components/FeedbackCollector';
import FeedbackFlag from '../../components/FeedbackFlag';
import FeedbackForm from '../../components/FeedbackForm';
import { type FormFields } from '../../types';

import {
	customFieldRecords,
	customOptionsData,
	defaultFieldRecords,
	emptyOptionData,
} from './_data';

jest.mock('../../i18n/fr', () => ({
	'feedback-collector.feedback-title': 'Translated feedback title (FR)',
}));

jest
	.spyOn(FeedbackCollector.prototype, 'getEntitlementInformation')
	// @ts-ignore
	.mockImplementation(() => {
		return null;
	});

describe('Feedback Collector unit tests', () => {
	describe('Feedback integration', () => {
		test('Feedback collector should render a component', () => {
			const wrapper = mount(
				<FeedbackCollector
					onClose={() => {}}
					onSubmit={() => {}}
					name="name"
					entrypointId="entrypoint_id"
				/>,
			);
			expect(wrapper).toBeDefined();
			wrapper.unmount();
		});

		test('should render visual instruction for mandatory field', () => {
			render(
				<FeedbackCollector
					onClose={() => {}}
					onSubmit={() => {}}
					name="name"
					entrypointId="entrypoint_id"
				/>,
			);
			const visualInstruction = screen.getByText('Required fields are marked with an asterisk');
			expect(visualInstruction).toBeInTheDocument();
		});

		describe('Transforming form values into format', () => {
			let wrapper: ReactWrapper<{}, {}, FeedbackCollector>;

			beforeEach(() => {
				wrapper = mount(<FeedbackCollector name="name" entrypointId="entrypoint_id" />);
			});

			afterEach(() => {
				wrapper.unmount();
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
							value: 'name',
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

				const resultJsd = await wrapper.instance().mapFormToJSD(formValues);

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
							value: 'name',
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

				const resultJsd = await wrapper.instance().mapFormToJSD(formValues);

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
							value: 'name',
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

				const resultJsd = await wrapper.instance().mapFormToJSD(formValues);

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

				const resultJsd = await wrapper.instance().mapFormToJSD(formValues);

				expect(resultJsd).toEqual(resultValues);
			});
		});

		describe('Without reason select', () => {
			let wrapper: ReactWrapper<{}, {}, FeedbackCollector>;

			beforeEach(() => {
				wrapper = mount(
					<FeedbackCollector name="name" entrypointId="entrypoint_id" showTypeField={false} />,
				);
			});

			afterEach(() => {
				wrapper.unmount();
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

				const resultJsd = await wrapper.instance().mapFormToJSD(formValues);

				expect(resultJsd).toEqual(resultValues);
			});

			test('should add context with email', async () => {
				const formValues: FormFields = {
					type: 'question',
					description: 'some text',
					canBeContacted: true,
					enrollInResearchGroup: true,
				};
				wrapper.setProps({
					email: 'test@test.com',
				});

				const resultValues = {
					fields: [
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

				const resultJsd = await wrapper.instance().mapFormToJSD(formValues);

				expect(resultJsd).toEqual(resultValues);
			});

			test('should add email to existing context', async () => {
				const formValues: FormFields = {
					type: 'question',
					description: 'some text',
					canBeContacted: true,
					enrollInResearchGroup: true,
				};
				wrapper.setProps({
					email: 'test@test.com',
					additionalFields: [
						{
							id: 'customfield_10047',
							value: `This is a test
          We have some formatting here`,
						},
					],
				});

				const resultValues = {
					fields: [
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

				const resultJsd = await wrapper.instance().mapFormToJSD(formValues);

				expect(resultJsd).toEqual(resultValues);
			});

			test('Should not render Select in the component', () => {
				expect(wrapper.contains('Select')).toBeFalsy();
			});
		});

		describe('With custom copy', () => {
			let wrapper: ReactWrapper<{}, {}, FeedbackCollector>;
			const customPreamble = 'Your feedback means a lot to us, thank you.';
			const customCanContact = 'Atlassian can contact me about my feedback';
			const customEnroll = 'Please enroll me in research program';
			const expectedButtonLabels = ['Cancel Button', 'Submit Button'];

			beforeEach(() => {
				wrapper = mount(
					<FeedbackCollector
						name="name"
						entrypointId="entrypoint_id"
						showTypeField={false}
						feedbackTitle="Custom title"
						feedbackTitleDetails={
							<>
								<div id="test-preamble-content">{customPreamble}</div>
							</>
						}
						summaryPlaceholder="Enter your feedback here"
						canBeContactedLabel={
							<p id="test-contacted-content">Atlassian can contact me about my feedback</p>
						}
						enrolInResearchLabel={
							<p id="test-research-content">Please enroll me in research program</p>
						}
					/>,
				);
			});

			afterEach(() => {
				wrapper.unmount();
			});

			test('Should render the custom copy in the component without reason select', () => {
				expect(wrapper.contains('Select')).toBeFalsy();
				expect(wrapper.find('#test-preamble-content').text()).toEqual(customPreamble);
			});

			test('Should render the custom copy in the component with reason select', () => {
				wrapper.setProps({
					showTypeField: true,
					submitButtonLabel: 'Submit Button',
					cancelButtonLabel: 'Cancel Button',
					feedbackGroupLabels: customFieldRecords,
				});

				const { options, placeholder } = wrapper.find(Select).props();
				const feedbackFormWrapper = wrapper.find(FeedbackForm);

				expect(wrapper.find('button')).toBeTruthy();
				expect(wrapper.find('button').length).toBe(3); // now includes 'x'
				wrapper
					.find('button')
					?.slice(1)
					.forEach((action, index) => {
						expect(action.text()).toEqual(expectedButtonLabels[index]);
					});

				expect(wrapper.find(Select)).toBeTruthy();
				expect(placeholder).toEqual(emptyOptionData);
				expect(options).toEqual(customOptionsData);
				for (const [key, value] of Object.entries(customFieldRecords)) {
					if (key !== 'empty') {
						act(() => {
							feedbackFormWrapper.find(Select).props().onChange({ value: key });
						});
						feedbackFormWrapper.update();
						expect(wrapper.find(Field).at(1).props().label).toBe(value.fieldLabel);
						expect(wrapper.find('#test-preamble-content').text()).toEqual(customPreamble);
					}
				}
			});

			test('Should render the custom copy in the component with reason select and aaid', () => {
				wrapper.setProps({
					atlassianAccountId: 'aaid',
					showTypeField: true,
					submitButtonLabel: 'Submit Button',
					cancelButtonLabel: 'Cancel Button',
					feedbackGroupLabels: customFieldRecords,
				});

				const { options, placeholder } = wrapper.find(Select).props();
				const feedbackFormWrapper = wrapper.find(FeedbackForm);

				expect(wrapper.find('button')).toBeTruthy();
				expect(wrapper.find('button').length).toBe(3); // now includes 'x'
				wrapper
					.find('button')
					?.slice(1)
					.forEach((action, index) => {
						expect(action.text()).toEqual(expectedButtonLabels[index]);
					});

				expect(wrapper.find(Select)).toBeTruthy();
				expect(placeholder).toEqual(emptyOptionData);
				expect(options).toEqual(customOptionsData);
				for (const [key, value] of Object.entries(customFieldRecords)) {
					if (key !== 'empty') {
						act(() => {
							feedbackFormWrapper.find(Select).props().onChange({ value: key });
						});
						feedbackFormWrapper.update();
						expect(wrapper.find(Field).at(1).props().label).toBe(value.fieldLabel);
						expect(wrapper.find('#test-preamble-content').text()).toEqual(customPreamble);
						expect(wrapper.find('#test-contacted-content').text()).toEqual(customCanContact);
						expect(wrapper.find('#test-research-content').text()).toEqual(customEnroll);
					}
				}
			});
		});

		describe('Posting feedback', () => {
			test('Should invoke props.onSubmit even after FeedbackCollector unmounts', async () => {
				class TestableFeedbackCollector extends FeedbackCollector {
					componentWillUnmount() {
						// Empty placeholder to allow spying on this lifecycle method within a unit test,
						// because the real component doesn't declare one, and sadly, Enzyme doesn't allow
						// access to the inherited React lifecycle methods.
					}
				}

				const onSubmit = jest.fn();
				const timeoutOnSubmit = 700;
				const unmountSpy = jest.spyOn(TestableFeedbackCollector.prototype, 'componentWillUnmount');

				const wrapper = mount<TestableFeedbackCollector>(
					<TestableFeedbackCollector
						onClose={() => wrapper.unmount()}
						onSubmit={onSubmit}
						timeoutOnSubmit={timeoutOnSubmit}
						name="name"
						entrypointId=""
					/>,
				);
				const feedbackCollector = wrapper.instance();

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

				expect(unmountSpy).toHaveBeenCalled();
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
					class TestableFeedbackCollector extends FeedbackCollector {}

					const onSubmit = jest.fn();
					const timeoutOnSubmit = 700;

					const wrapper = shallow<TestableFeedbackCollector>(
						<TestableFeedbackCollector
							onClose={() => wrapper.unmount()}
							onSubmit={onSubmit}
							timeoutOnSubmit={timeoutOnSubmit}
							name="name"
							entrypointId="some-id"
							url={url}
							customGatewayUrl={customGatewayUrl}
						/>,
					);
					const feedbackCollector = wrapper.instance();

					const gatewayUrl = feedbackCollector.getGatewayUrl();
					expect(gatewayUrl).toStrictEqual(expected);

					const entitlementSpy = jest.spyOn(feedbackCollector, 'getEntitlementInformation');
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
						expect(mocked.mock.calls?.[4]?.[0]).toBe(expected);
					});
				},
			);

			test('should not send requests for entitlement if shouldGetEntitlementDetails is false', async () => {
				class TestableFeedbackCollector extends FeedbackCollector {}

				const onSubmit = jest.fn();
				const timeoutOnSubmit = 700;

				const wrapper = shallow<TestableFeedbackCollector>(
					<TestableFeedbackCollector
						onClose={() => wrapper.unmount()}
						onSubmit={onSubmit}
						timeoutOnSubmit={timeoutOnSubmit}
						name="name"
						entrypointId="entrypoint_id"
						customFeedbackUrl={'/custom-feedback-url'}
						customGatewayUrl={'/custom-gateway-url'}
						shouldGetEntitlementDetails={false}
					/>,
				);
				const feedbackCollector = wrapper.instance();
				const feedback: FormFields = {
					type: 'empty',
					description: `This won't actually dispatch due to missing entrypointId prop`,
					canBeContacted: true,
					enrollInResearchGroup: false,
				};
				const entitlementSpy = jest.spyOn(feedbackCollector, 'getEntitlementInformation');
				const gatewayUrlSpy = jest.spyOn(feedbackCollector, 'getGatewayUrl');

				entitlementSpy.mockClear();
				gatewayUrlSpy.mockClear();
				await feedbackCollector.mapFormToJSD(feedback);

				expect(entitlementSpy).not.toHaveBeenCalled();
				expect(gatewayUrlSpy).not.toHaveBeenCalled();
			});
		});

		describe('Localisation', () => {
			test('should be supported when a locale is passed', async () => {
				const wrapper = render(<FeedbackCollector locale="fr" entrypointId="entrypoint_id" />);

				expect(await wrapper.findByText('Translated feedback title (FR)')).toBeDefined();
			});
		});
	});

	describe('Feedback Form integration', () => {
		test('FeedbackForm should select only by default', () => {
			const wrapper = mount(<FeedbackForm onClose={() => {}} onSubmit={async () => {}} />);

			expect(wrapper.find(Select)).toHaveLength(1);
			expect(wrapper.find('textarea')).toHaveLength(0);
			expect(wrapper.find(Checkbox)).toHaveLength(0);
		});

		test('FeedbackForm should render textarea when something is selected', () => {
			const wrapper = mount(<FeedbackForm onClose={() => {}} onSubmit={async () => {}} />);

			act(() => {
				wrapper.find(Select).props().onChange({ value: 'comment' });
			});

			// explicitly update the wrapper to ensure the subsequent renders are flushed.
			wrapper.update();

			expect(wrapper.find(Select)).toHaveLength(1);
			expect(wrapper.find('textarea')).toHaveLength(1);
		});

		test('FeedbackForm should render checkboxes and textarea when something is selected', () => {
			const wrapper = mount(<FeedbackForm onClose={() => {}} onSubmit={async () => {}} />);

			act(() => {
				wrapper.find(Select).props().onChange({ value: 'comment' });
			});

			// explicitly update the wrapper to ensure the subsequent renders are flushed.
			wrapper.update();

			expect(wrapper.find(Select)).toHaveLength(1);
			expect(wrapper.find('textarea')).toHaveLength(1);
			expect(wrapper.find(Checkbox)).toHaveLength(2);
		});

		test('FeedbackForm should render textarea and anon panel when something is selected', () => {
			const wrapper = mount(
				<FeedbackForm onClose={() => {}} onSubmit={async () => {}} anonymousFeedback={true} />,
			);
			act(() => {
				wrapper.find(Select).props().onChange({ value: 'question' });
			});

			wrapper.update();
			expect(wrapper.find(Select)).toHaveLength(1);
			expect(wrapper.find('textarea')).toHaveLength(1);
			expect(wrapper.find(Field).at(2).props().name).toBe('anonymousFeedback');
		});

		test('should render a field label based on type', () => {
			const wrapper = mount(<FeedbackForm onClose={() => {}} onSubmit={async () => {}} />);

			for (const [key, value] of Object.entries(defaultFieldRecords)) {
				if (key !== 'empty') {
					act(() => {
						wrapper.find(Select).props().onChange({ value: key });
					});
					wrapper.update();
					expect(wrapper.find(Field).at(1).props().label).toBe(value.fieldLabel);
				}
			}
		});

		test('should render a correct field label name when selectLabel is passed in', () => {
			render(
				<FeedbackForm onClose={() => {}} onSubmit={async () => {}} selectLabel="test label name" />,
			);
			const label = screen.getByText('test label name');
			expect(label).toBeInTheDocument();
		});
	});

	describe('Feedback Flag', () => {
		test('FeedbackFlag should have default content', () => {
			const wrapper = mount(<FeedbackFlag />);
			const { title, description } = wrapper.find(AutoDismissFlag).props();
			expect(title).toEqual('Thanks!');
			expect(description).toEqual(
				'Your valuable feedback helps us continually improve our products.',
			);
		});

		test('FeedbackFlag should have custom copy', () => {
			const wrapper = mount(
				<FeedbackFlag title={'Feedback Title'} description={'Feedback Description'} />,
			);
			const { title, description } = wrapper.find(AutoDismissFlag).props();
			expect(title).toEqual('Feedback Title');
			expect(description).toEqual('Feedback Description');
		});
	});
});
