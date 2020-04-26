import React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import { ExtensionManifest } from '@atlaskit/editor-common';
import Form from '@atlaskit/form';
import Spinner from '@atlaskit/spinner';

import {
  FieldDefinition,
  Parameters,
  OnSaveCallback,
} from '@atlaskit/editor-common/extensions';

import Header from './Header';
import ConfigForm from './Form';
import { serialize, deserialize } from './transformers';

type Props = {
  extensionManifest: ExtensionManifest;
  fields: FieldDefinition[];
  parameters?: Parameters;
  autoSave?: boolean;
  showHeader?: boolean;
  closeOnEsc?: boolean;
  onChange: OnSaveCallback;
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

  handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if ((e.key === 'Esc' || e.key === 'Escape') && this.props.closeOnEsc) {
      this.props.onCancel();
    }
  };

  handleSubmit = async (formData: FormData) => {
    const { fields, extensionManifest } = this.props;

    try {
      const serializedData = await serialize(
        extensionManifest,
        formData,
        fields,
      );

      this.props.onChange(serializedData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error serializing parameters`, error);
    }
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

    try {
      const currentParameters = await deserialize(
        extensionManifest,
        parameters,
        fields,
      );
      this.setState({ currentParameters, hasParsedParameters: true });
    } catch (error) {
      this.setState({ currentParameters: {}, hasParsedParameters: true });

      // eslint-disable-next-line no-console
      console.error(`Error deserializing parameters`, error);
    }
  };

  render() {
    const {
      fields,
      onCancel,
      extensionManifest,
      autoSave,
      showHeader,
    } = this.props;

    const { currentParameters, hasParsedParameters } = this.state;

    if (!hasParsedParameters) {
      return <Spinner size="small" />;
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        {({ formProps, submitting }) => (
          <form {...formProps} noValidate onKeyDown={this.handleKeyDown}>
            {showHeader && (
              <Header
                icon={extensionManifest.icons['48']}
                title={extensionManifest.title}
                description={extensionManifest.description}
                onClose={onCancel}
              />
            )}
            <ConfigForm
              extensionManifest={extensionManifest}
              fields={fields}
              parameters={currentParameters}
              onCancel={onCancel}
              autoSave={autoSave}
              submitting={submitting}
            />
          </form>
        )}
      </Form>
    );
  }
}

export default injectIntl(ConfigPanel);
