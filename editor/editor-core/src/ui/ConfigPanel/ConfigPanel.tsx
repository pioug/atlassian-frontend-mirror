import React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import { ExtensionManifest } from '@atlaskit/editor-common';
import Button, { ButtonGroup } from '@atlaskit/button';
import Form, { FormFooter } from '@atlaskit/form';
import Spinner from '@atlaskit/spinner';

import {
  FieldDefinition,
  Parameters,
} from '@atlaskit/editor-common/extensions';

import FormContent from './FormContent';
import { messages } from './messages';
import { serialize, deserialize } from './transformers';

type Props = {
  extensionManifest: ExtensionManifest;
  fields: FieldDefinition[];
  parameters?: Parameters;
  onSave: (data: Parameters) => void | string;
  onCancel: () => void;
} & InjectedIntlProps;

type State = {
  hasParsedParameters: boolean;
  currentParameters: Parameters;
};

class ConfigPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasParsedParameters: false,
      currentParameters: {},
    };
  }

  componentDidMount() {
    const { fields, parameters } = this.props;
    this.parseParameters(fields, parameters);
  }

  componentDidUpdate(prevProps: Props) {
    const { parameters, fields } = this.props;

    if (
      (parameters && parameters !== prevProps.parameters) ||
      (fields && fields.length !== prevProps.fields.length)
    ) {
      this.parseParameters(fields, parameters);
    }
  }

  onSubmit = (formData: FormData) => {
    const { fields, extensionManifest } = this.props;

    return serialize(extensionManifest, formData, fields).then(serializedData =>
      this.props.onSave(serializedData),
    );
  };

  parseParameters = async (
    fields: FieldDefinition[],
    parameters?: Parameters,
  ) => {
    const { extensionManifest } = this.props;

    if (fields.length === 0) {
      // do not parse while fields are not returned
      return;
    }

    if (typeof parameters === 'undefined') {
      this.setState({ currentParameters: {}, hasParsedParameters: true });
      return;
    }

    const currentParameters = await deserialize(
      extensionManifest,
      parameters,
      fields,
    );

    this.setState({ currentParameters, hasParsedParameters: true });
  };

  render() {
    const { intl, fields, onCancel, extensionManifest } = this.props;

    const { currentParameters, hasParsedParameters } = this.state;

    if (!hasParsedParameters) {
      return <Spinner size="small" />;
    }

    return (
      <Form onSubmit={this.onSubmit}>
        {({ formProps, submitting }) => (
          <form {...formProps} noValidate>
            <FormContent
              extensionManifest={extensionManifest}
              fields={fields}
              parameters={currentParameters}
            />
            <FormFooter align="start">
              <ButtonGroup>
                <Button type="submit" appearance="primary">
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
          </form>
        )}
      </Form>
    );
  }
}

export default injectIntl(ConfigPanel);
