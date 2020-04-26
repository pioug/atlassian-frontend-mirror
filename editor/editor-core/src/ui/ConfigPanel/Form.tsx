import React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import { ExtensionManifest } from '@atlaskit/editor-common';
import Button, { ButtonGroup } from '@atlaskit/button';
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
    } = this.props;

    return (
      <React.Fragment>
        <FormContent
          extensionManifest={extensionManifest}
          fields={fields}
          parameters={parameters}
          onFieldBlur={this.onFieldBlur}
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
