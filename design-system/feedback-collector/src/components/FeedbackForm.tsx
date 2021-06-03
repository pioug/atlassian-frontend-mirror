import React, { Component, Fragment } from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import Form, { Field } from '@atlaskit/form';
import Modal from '@atlaskit/modal-dialog';
import Select from '@atlaskit/select';
import TextArea from '@atlaskit/textarea';

import { FormFields, SelectValue } from '../types';

interface Props {
  /**  Message which will be shown as the title of the feedback dialog **/
  feedbackTitle?: React.ReactText;
  /**  Override to hide the feedback type select drop down for the feedback **/
  showTypeField?: boolean;
  /**  Message which will be shown below the title of the feedback dialog **/
  feedbackTitleDetails?: React.ReactChild;
  /**  Message which will be shown next to the enrol in research checkbox **/
  enrolInResearchLabel: React.ReactChild;
  /**  Message which will be shown next to the can be contacted checkbox **/
  canBeContactedLabel?: React.ReactChild;
  /**  Message which will be shown inside the summary text field **/
  summaryPlaceholder?: string;
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

  static defaultProps = {
    showTypeField: true,
    feedbackTitle: 'Share your thoughts',
    enrolInResearchLabel: "I'd like to participate in product research",
    canBeContactedLabel: 'Atlassian can contact me about this feedback',
    onClose: () => {},
    onSubmit: () => {},
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
    const { showTypeField } = this.props;
    const canShowTextField = this.isTypeSelected() || !showTypeField;
    const isDisabled = showTypeField
      ? !this.isTypeSelected() || !this.state.description
      : !this.state.description;

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
        heading={this.props.feedbackTitle}
        onClose={this.props.onClose}
      >
        <Form
          onSubmit={() => {
            /* TODO: this is a NOOP until Modal can take a container prop */
          }}
        >
          {({ formProps }) => (
            <form {...formProps}>
              {this.props.feedbackTitleDetails}

              {showTypeField ? (
                <Select<OptionType>
                  onChange={(option) => {
                    if (!option || option instanceof Array) {
                      return;
                    }

                    this.setState({ type: (option as OptionType).value });
                  }}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                  defaultValue={defaultSelectValue}
                  options={selectOptions}
                />
              ) : null}

              {canShowTextField ? (
                <Fragment>
                  <Field
                    label={showTypeField ? fieldLabel[this.state.type] : null}
                    isRequired
                    name="description"
                  >
                    {({ fieldProps }) => (
                      <TextArea
                        {...fieldProps}
                        name="foo"
                        minimumRows={6}
                        placeholder={this.props.summaryPlaceholder}
                        onChange={(e) =>
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
                        label={this.props.canBeContactedLabel}
                        onChange={(event) =>
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
                        label={this.props.enrolInResearchLabel}
                        onChange={(event) =>
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
