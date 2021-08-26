import React from 'react';

import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';

import { Checkbox } from '@atlaskit/checkbox';
import { AutoDismissFlag } from '@atlaskit/flag';
import { Field } from '@atlaskit/form';
import Select from '@atlaskit/select';

import FeedbackCollector from '../../components/FeedbackCollector';
import FeedbackFlag from '../../components/FeedbackFlag';
import FeedbackForm from '../../components/FeedbackForm';
import { FormFields } from '../../types';

import {
  customFieldRecords,
  customOptionsData,
  defaultFieldRecords,
  emptyOptionData,
} from './_data';

describe('Feedback Collector unit tests', () => {
  describe('Feedback integration', () => {
    test('Feedback collector should render a component', () => {
      const wrapper = mount(
        <FeedbackCollector
          onClose={() => {}}
          onSubmit={() => {}}
          email="email"
          name="name"
          requestTypeId="request_type_id"
          embeddableKey="embeddable_key"
        />,
      );
      expect(wrapper).toBeDefined();
    });

    describe('Transforming form values into format', () => {
      let wrapper: ReactWrapper<{}, {}, FeedbackCollector>;

      beforeEach(() => {
        wrapper = mount(
          <FeedbackCollector
            email="email"
            name="name"
            requestTypeId="request_type_id"
            embeddableKey="embeddable_key"
          />,
        );
      });
      test('value is selected, everything else is empty', () => {
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
              id: 'email',
              value: 'do-not-reply@atlassian.com',
            },
            {
              id: 'customfield_10045',
              value: 'name',
            },
          ],
        };

        expect(wrapper.instance().mapFormToJSD(formValues)).toEqual(
          resultValues,
        );
      });

      test('value is selected, description is filled, everything else is empty', () => {
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
              id: 'email',
              value: 'do-not-reply@atlassian.com',
            },
            {
              id: 'customfield_10045',
              value: 'name',
            },
          ],
        };

        expect(wrapper.instance().mapFormToJSD(formValues)).toEqual(
          resultValues,
        );
      });

      test('value is selected, description is filled, consent to contact is given', () => {
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
              id: 'email',
              value: 'email',
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
          ],
        };

        expect(wrapper.instance().mapFormToJSD(formValues)).toEqual(
          resultValues,
        );
      });

      test('value is selected, description is filled, consent to contact is given, enrolled in research', () => {
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
              id: 'email',
              value: 'email',
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

        expect(wrapper.instance().mapFormToJSD(formValues)).toEqual(
          resultValues,
        );
      });
    });

    describe('Without reason select', () => {
      let wrapper: ReactWrapper<{}, {}, FeedbackCollector>;

      beforeEach(() => {
        wrapper = mount(
          <FeedbackCollector
            email="email"
            name="name"
            requestTypeId="request_type_id"
            embeddableKey="embeddable_key"
            showTypeField={false}
          />,
        );
      });

      test('Should set feedback without a feedback type', () => {
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
              id: 'email',
              value: 'email',
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

        expect(wrapper.instance().mapFormToJSD(formValues)).toEqual(
          resultValues,
        );
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
            email="email"
            name="name"
            requestTypeId="request_type_id"
            embeddableKey="embeddable_key"
            showTypeField={false}
            feedbackTitle="Custom title"
            feedbackTitleDetails={
              <>
                <div id="test-preamble-content">{customPreamble}</div>
              </>
            }
            summaryPlaceholder="Enter your feedback here"
            canBeContactedLabel={
              <p id="test-contacted-content">
                Atlassian can contact me about my feedback
              </p>
            }
            enrolInResearchLabel={
              <p id="test-research-content">
                Please enroll me in research program
              </p>
            }
          />,
        );
      });

      test('Should render the custom copy in the component without reason select', () => {
        expect(wrapper.contains('Select')).toBeFalsy();
        expect(wrapper.find('#test-preamble-content').text()).toEqual(
          customPreamble,
        );
        expect(wrapper.find('#test-contacted-content').text()).toEqual(
          customCanContact,
        );
        expect(wrapper.find('#test-research-content').text()).toEqual(
          customEnroll,
        );
      });

      test('Should render the custom copy in the component with reason select', () => {
        wrapper.setProps({
          showTypeField: true,
          submitButtonLabel: 'Submit Button',
          cancelButtonLabel: 'Cancel Button',
          feedbackGroupLabels: customFieldRecords,
        });

        const { options, defaultValue } = wrapper.find(Select).props();
        const feedbackFormWrapper = wrapper.find(FeedbackForm);

        expect(wrapper.find('button')).toBeTruthy();
        expect(wrapper.find('button').length).toBe(2);
        wrapper.find('button')?.forEach((action, index) => {
          expect(action.text()).toEqual(expectedButtonLabels[index]);
        });

        expect(wrapper.find(Select)).toBeTruthy();
        expect(defaultValue).toEqual(emptyOptionData);
        expect(options).toEqual(customOptionsData);
        for (const [key, value] of Object.entries(customFieldRecords)) {
          if (key !== 'empty') {
            feedbackFormWrapper.setState({ type: key });
            expect(wrapper.find(Field).at(0).props().label).toBe(
              value.fieldLabel,
            );
            expect(wrapper.find('#test-preamble-content').text()).toEqual(
              customPreamble,
            );
            expect(wrapper.find('#test-contacted-content').text()).toEqual(
              customCanContact,
            );
            expect(wrapper.find('#test-research-content').text()).toEqual(
              customEnroll,
            );
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
        const unmountSpy = jest.spyOn(
          TestableFeedbackCollector.prototype,
          'componentWillUnmount',
        );

        const wrapper = shallow<TestableFeedbackCollector>(
          <TestableFeedbackCollector
            onClose={() => wrapper.unmount()}
            onSubmit={onSubmit}
            timeoutOnSubmit={timeoutOnSubmit}
            email="email"
            name="name"
            embeddableKey=""
            requestTypeId=""
          />,
        );
        const feedbackCollector = wrapper.instance();

        // Emulates the user clicking the submit button within the rendered form.
        const feedback: FormFields = {
          type: 'empty',
          description: `This won't actually dispatch due to missing embeddableKey & requestTypeId props`,
          canBeContacted: false,
          enrollInResearchGroup: false,
        };

        feedbackCollector.postFeedback(feedback);

        // Wait for the timeout to occur. The component will unmount before this triggers.
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, timeoutOnSubmit);
        });

        expect(unmountSpy).toHaveBeenCalled();
        expect(onSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('Feedback Form integration', () => {
    test('FeedbackForm should select only by default', () => {
      const wrapper = mount(
        <FeedbackForm onClose={() => {}} onSubmit={() => {}} />,
      );

      expect(wrapper.find(Select)).toHaveLength(1);
      expect(wrapper.find('textarea')).toHaveLength(0);
      expect(wrapper.find(Checkbox)).toHaveLength(0);
    });

    test('FeedbackForm should render checkboxes and textarea when something is selected', () => {
      const wrapper = mount(
        <FeedbackForm onClose={() => {}} onSubmit={() => {}} />,
      );

      wrapper.setState({ type: 'comment' });

      // explicitly update the wrapper to ensure the subsequent renders are flushed.
      wrapper.update();

      expect(wrapper.find(Select)).toHaveLength(1);
      expect(wrapper.find('textarea')).toHaveLength(1);
      expect(wrapper.find(Checkbox)).toHaveLength(2);
    });

    test('should render a field label based on type', () => {
      const wrapper = mount(
        <FeedbackForm onClose={() => {}} onSubmit={() => {}} />,
      );

      for (const [key, value] of Object.entries(defaultFieldRecords)) {
        if (key !== 'empty') {
          wrapper.setState({ type: key });
          expect(wrapper.find(Field).at(0).props().label).toBe(
            value.fieldLabel,
          );
        }
      }
    });
  });

  describe('Feedback Flag', () => {
    let wrapper: ShallowWrapper<typeof FeedbackFlag>;

    beforeEach(() => {
      wrapper = shallow(<FeedbackFlag />);
    });

    test('FeedbackFlag should have default content', () => {
      const { title, description } = wrapper.find(AutoDismissFlag).props();
      expect(title).toEqual('Thanks!');
      expect(description).toEqual(
        'Your valuable feedback helps us continually improve our products.',
      );
    });

    test('FeedbackFlag should have custom copy', () => {
      wrapper.setProps({
        title: 'Feedback Title',
        description: 'Feedback Description',
      });
      const { title, description } = wrapper.find(AutoDismissFlag).props();
      expect(title).toEqual('Feedback Title');
      expect(description).toEqual('Feedback Description');
    });
  });
});
