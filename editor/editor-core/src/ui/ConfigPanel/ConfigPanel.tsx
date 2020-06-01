import React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import memoizeOne from 'memoize-one';

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
  firstVisibleFieldName?: string;
};

class ConfigPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasParsedParameters: false,
      currentParameters: {},
      firstVisibleFieldName: this.getFirstVisibleFieldName(props.fields),
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

    if (fields && fields.length !== prevProps.fields.length) {
      this.setFirstVisibleFieldName(fields);
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

  // memoized to prevent rerender on new parameters
  renderHeader = memoizeOne(() => {
    const { onCancel, extensionManifest, showHeader } = this.props;

    if (!showHeader) {
      return null;
    }

    return (
      <Header
        icon={extensionManifest.icons['48']}
        title={extensionManifest.title}
        description={extensionManifest.description}
        onClose={onCancel}
      />
    );
  });

  getFirstVisibleFieldName = memoizeOne((fields: FieldDefinition[]) => {
    // finds the first visible field. Returns true for fieldsets too.
    const firstVisibleField = fields.find(field => {
      if (field.type === 'fieldset') {
        return true;
      }
      return !field.isHidden;
    });

    let newFirstVisibleFieldName;

    if (firstVisibleField) {
      // if it was a fieldset, go deeper trying to locate the field
      if (firstVisibleField.type === 'fieldset') {
        const firstVisibleFieldWithinFieldset = firstVisibleField.fields.find(
          fieldsetField => !fieldsetField.isHidden,
        );

        newFirstVisibleFieldName =
          firstVisibleFieldWithinFieldset &&
          firstVisibleFieldWithinFieldset.name;
      } else {
        newFirstVisibleFieldName = firstVisibleField.name;
      }
    }

    return newFirstVisibleFieldName;
  });

  setFirstVisibleFieldName = (fields: FieldDefinition[]) => {
    const newFirstVisibleFieldName = this.getFirstVisibleFieldName(fields);

    if (newFirstVisibleFieldName !== this.state.firstVisibleFieldName) {
      this.setState({
        firstVisibleFieldName: newFirstVisibleFieldName,
      });
    }
  };

  render() {
    const { fields, onCancel, extensionManifest, autoSave } = this.props;

    const {
      currentParameters,
      hasParsedParameters,
      firstVisibleFieldName,
    } = this.state;

    if (!hasParsedParameters) {
      return <Spinner size="small" />;
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        {({ formProps, submitting }) => {
          return (
            <form {...formProps} noValidate onKeyDown={this.handleKeyDown}>
              {this.renderHeader()}
              <ConfigForm
                extensionManifest={extensionManifest}
                fields={fields}
                parameters={currentParameters}
                onCancel={onCancel}
                autoSave={autoSave}
                submitting={submitting}
                firstVisibleFieldName={firstVisibleFieldName}
              />
            </form>
          );
        }}
      </Form>
    );
  }
}

export default injectIntl(ConfigPanel);
