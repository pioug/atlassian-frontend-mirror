import React, { Component, Fragment } from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import Form, { Field } from '@atlaskit/form';
import Modal from '@atlaskit/modal-dialog';
import Select from '@atlaskit/select';
import TextArea from '@atlaskit/textarea';

import { FormFields, SelectValue } from '../types';

interface Props {
  /** Function that will be called to initiate the exit transition. */
  onClose: () => void;
  /** Function that will be called immediately after the submit action  */
  onSubmit: (formValues: FormFields) => void;
}

interface OptionType {
  label: string;
  value: SelectValue;
}

export const fieldLabel: Record<string, string> = {
  bug: 'Describe the bug or issue',
  comment: "Let us know what's on your mind",
  suggestion: "Let us know what you'd like to improve",
  question: 'What would you like to know?',
  empty: 'Select an option',
};

const selectOptions: OptionType[] = [
  { label: 'Ask a question', value: 'question' },
  { label: 'Leave a comment', value: 'comment' },
  { label: 'Report a bug', value: 'bug' },
  { label: 'Suggest an improvement', value: 'suggestion' },
];

const defaultSelectValue: OptionType = {
  label: 'I want to...',
  value: 'empty',
};

export default class FeedbackForm extends Component<Props, FormFields> {
  state: FormFields = {
    type: 'empty',
    description: '',
    canBeContacted: false,
    enrollInResearchGroup: false,
  };

  isTypeSelected = () => this.state.type !== 'empty';

  onSubmit = () => {
    const {
      type,
      description,
      canBeContacted,
      enrollInResearchGroup,
    } = this.state;

    this.props.onSubmit({
      type,
      description,
      canBeContacted,
      enrollInResearchGroup,
    });
  };

  render() {
    const isDisabled = !this.isTypeSelected() || !this.state.description;

    return (
      <Modal
        actions={[
          {
            text: 'Send feedback',
            appearance: 'primary',
            type: 'submit',
            isDisabled,
            onClick: this.onSubmit,
          },
          {
            text: 'Cancel',
            onClick: this.props.onClose,
            appearance: 'subtle',
          },
        ]}
        heading="Share your thoughts"
        onClose={this.props.onClose}
      >
        <Form
          onSubmit={() => {
            /* TODO: this is a NOOP until Modal can take a container prop */
          }}
        >
          {({ formProps }) => (
            <form {...formProps}>
              <Select<OptionType>
                onChange={option => {
                  if (!option || option instanceof Array) {
                    return;
                  }

                  this.setState({ type: (option as OptionType).value });
                }}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: base => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
                defaultValue={defaultSelectValue}
                options={selectOptions}
              />

              {this.isTypeSelected() ? (
                <Fragment>
                  <Field
                    label={fieldLabel[this.state.type]}
                    isRequired
                    name="description"
                  >
                    {({ fieldProps }) => (
                      <TextArea
                        {...fieldProps}
                        name="foo"
                        minimumRows={6}
                        onChange={e =>
                          this.setState({
                            description: e.target.value,
                          })
                        }
                        value={this.state.description}
                      />
                    )}
                  </Field>

                  <Field name="can-be-contacted">
                    {({ fieldProps }) => (
                      <Checkbox
                        {...fieldProps}
                        label="Atlassian can contact me about this feedback"
                        onChange={event =>
                          this.setState({
                            canBeContacted: event.target.checked,
                          })
                        }
                      />
                    )}
                  </Field>

                  <Field name="enroll-in-research-group">
                    {({ fieldProps }) => (
                      <Checkbox
                        {...fieldProps}
                        label="I'd like to participate in product research"
                        onChange={event =>
                          this.setState({
                            enrollInResearchGroup: event.target.checked,
                          })
                        }
                      />
                    )}
                  </Field>
                </Fragment>
              ) : (
                <Fragment />
              )}
            </form>
          )}
        </Form>
      </Modal>
    );
  }
}
