import React, { Component, Fragment } from 'react';

import Button from '@atlaskit/button/standard-button';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { Field } from '@atlaskit/form';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@atlaskit/modal-dialog';
import Select from '@atlaskit/select';
import TextArea from '@atlaskit/textarea';

import { FormFields, SelectOptionDetails, SelectValue } from '../types';

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
  /**  Message for submit button label **/
  submitButtonLabel?: string;
  /**  Message for cancel button label **/
  cancelButtonLabel?: string;
  /**  Message for select option labels and field labels **/
  feedbackGroupLabels?: Record<SelectValue, SelectOptionDetails>;
  /** Function that will be called to initiate the exit transition. */
  onClose: () => void;
  /** Function that will be called immediately after the submit action  */
  onSubmit: (formValues: FormFields) => void;
}

export interface OptionType {
  label: string;
  value: SelectValue;
}

const getFieldLabels = (
  record?: Record<SelectValue, SelectOptionDetails>,
): Record<SelectValue, string> => {
  return {
    bug: record?.bug.fieldLabel
      ? record.bug.fieldLabel
      : 'Describe the bug or issue',
    comment: record?.comment.fieldLabel
      ? record.comment.fieldLabel
      : "Let us know what's on your mind",
    suggestion: record?.suggestion.fieldLabel
      ? record.suggestion.fieldLabel
      : "Let us know what you'd like to improve",
    question: record?.question.fieldLabel
      ? record.question.fieldLabel
      : 'What would you like to know?',
    empty: record?.empty.fieldLabel
      ? record.empty.fieldLabel
      : 'Select an option',
  };
};

const getSelectOptions = (
  record?: Record<SelectValue, SelectOptionDetails>,
): OptionType[] => {
  return [
    {
      label: record?.question.selectOptionLabel
        ? record.question.selectOptionLabel
        : 'Ask a question',
      value: 'question',
    },
    {
      label: record?.comment.selectOptionLabel
        ? record.comment.selectOptionLabel
        : 'Leave a comment',
      value: 'comment',
    },
    {
      label: record?.bug.selectOptionLabel
        ? record.bug.selectOptionLabel
        : 'Report a bug',
      value: 'bug',
    },
    {
      label: record?.suggestion.selectOptionLabel
        ? record.suggestion.selectOptionLabel
        : 'Suggest an improvement',
      value: 'suggestion',
    },
  ];
};

const getDefaultSelectValue = (
  record?: Record<SelectValue, SelectOptionDetails>,
): OptionType => {
  return {
    label: record?.empty.selectOptionLabel
      ? record.empty.selectOptionLabel
      : 'I want to...',
    value: 'empty',
  };
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
    submitButtonLabel: 'Send feedback',
    cancelButtonLabel: 'Cancel',
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
      <Modal onClose={this.props.onClose}>
        <Form onSubmit={this.onSubmit}>
          {({ formProps }) => (
            <form {...formProps}>
              <ModalHeader>
                <ModalTitle>{this.props.feedbackTitle}</ModalTitle>
              </ModalHeader>
              <ModalBody>
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
                    defaultValue={getDefaultSelectValue(
                      this.props.feedbackGroupLabels,
                    )}
                    options={getSelectOptions(this.props.feedbackGroupLabels)}
                  />
                ) : null}

                {canShowTextField ? (
                  <Fragment>
                    <Field
                      label={
                        showTypeField
                          ? getFieldLabels(this.props.feedbackGroupLabels)[
                              this.state.type
                            ]
                          : null
                      }
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
              </ModalBody>
              <ModalFooter>
                <Button appearance="subtle" onClick={this.props.onClose}>
                  {this.props.cancelButtonLabel}
                </Button>
                <Button
                  appearance="primary"
                  type="submit"
                  isDisabled={isDisabled}
                >
                  {this.props.submitButtonLabel}
                </Button>
              </ModalFooter>
            </form>
          )}
        </Form>
      </Modal>
    );
  }
}
