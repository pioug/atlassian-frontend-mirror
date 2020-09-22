import React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import { ExtensionManifest } from '@atlaskit/editor-common';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import { FormFooter } from '@atlaskit/form';

import {
  FieldDefinition,
  Parameters,
} from '@atlaskit/editor-common/extensions';

import FormContent from './FormContent';
import { messages } from './messages';

type Props = {
  extensionManifest: ExtensionManifest;
  fields: FieldDefinition[];
  parameters?: Parameters;
  autoSave?: boolean;
  submitting?: boolean;
  onCancel: () => void;
  firstVisibleFieldName?: string;
} & InjectedIntlProps;

class Form extends React.Component<Props> {
  private submitButton: React.RefObject<HTMLButtonElement>;

  constructor(props: Props) {
    super(props);
    this.submitButton = React.createRef<HTMLButtonElement>();
  }

  onFieldBlur = () => {
    const { autoSave } = this.props;

    if (autoSave && this.submitButton.current) {
      this.submitButton.current.click();
    }
  };

  render() {
    const {
      intl,
      fields,
      onCancel,
      extensionManifest,
      parameters,
      autoSave,
      submitting,
      firstVisibleFieldName,
    } = this.props;

    return (
      <React.Fragment>
        <FormContent
          fields={fields}
          parameters={parameters}
          extensionManifest={extensionManifest}
          onFieldBlur={this.onFieldBlur}
          firstVisibleFieldName={firstVisibleFieldName}
        />
        <div style={autoSave ? { display: 'none' } : {}}>
          <FormFooter align="start">
            <ButtonGroup>
              <Button
                type="submit"
                appearance="primary"
                ref={this.submitButton}
              >
                {intl.formatMessage(messages.submit)}
              </Button>
              <Button
                appearance="default"
                isDisabled={submitting}
                onClick={onCancel}
              >
                {intl.formatMessage(messages.cancel)}
              </Button>
            </ButtonGroup>
          </FormFooter>
        </div>
      </React.Fragment>
    );
  }
}

export default injectIntl(Form);
