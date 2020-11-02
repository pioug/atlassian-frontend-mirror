import React from 'react';
import memoizeOne from 'memoize-one';
import {
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { ExtensionManifest } from '@atlaskit/editor-common';
import Form from '@atlaskit/form';

import {
  FieldDefinition,
  Parameters,
  OnSaveCallback,
} from '@atlaskit/editor-common/extensions';

import {
  fireAnalyticsEvent,
  EVENT_TYPE,
  ACTION_SUBJECT,
  ACTION,
} from '../../plugins/analytics';

import LoadingState from './LoadingState';
import Header from './Header';
import ConfigForm from './Form';
import ErrorMessage from './ErrorMessage';
import { serialize, deserialize } from './transformers';

type Props = {
  extensionManifest?: ExtensionManifest;
  fields?: FieldDefinition[];
  parameters?: Parameters;
  autoSave?: boolean;
  autoSaveTrigger?: unknown;
  showHeader?: boolean;
  closeOnEsc?: boolean;
  onChange: OnSaveCallback;
  onCancel: () => void;
  errorMessage: string | null;
  isLoading?: boolean;
} & WithAnalyticsEventsProps;

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
      firstVisibleFieldName: props.fields
        ? this.getFirstVisibleFieldName(props.fields)
        : undefined,
    };
  }

  componentDidMount() {
    const { fields, parameters, createAnalyticsEvent } = this.props;
    this.parseParameters(fields, parameters);

    fireAnalyticsEvent(createAnalyticsEvent)({
      payload: {
        action: ACTION.OPENED,
        actionSubject: ACTION_SUBJECT.CONFIG_PANEL,
        eventType: EVENT_TYPE.UI,
        attributes: {},
      },
    });
  }

  componentWillUnmount() {
    fireAnalyticsEvent(this.props.createAnalyticsEvent)({
      payload: {
        action: ACTION.CLOSED,
        actionSubject: ACTION_SUBJECT.CONFIG_PANEL,
        eventType: EVENT_TYPE.UI,
        attributes: {},
      },
    });
  }

  componentDidUpdate(prevProps: Props) {
    const { parameters, fields } = this.props;

    if (
      (parameters && parameters !== prevProps.parameters) ||
      (fields &&
        (!prevProps.fields || fields.length !== prevProps.fields.length))
    ) {
      this.parseParameters(fields, parameters);
    }

    if (
      fields &&
      (!prevProps.fields || fields.length !== prevProps.fields.length)
    ) {
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
    if (!extensionManifest || !fields) {
      return;
    }

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
    fields?: FieldDefinition[],
    parameters?: Parameters,
  ) => {
    const { extensionManifest } = this.props;

    if (!extensionManifest || !fields || fields.length === 0) {
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

  // memoized to prevent rerender on new parameters
  renderHeader = memoizeOne((extensionManifest: ExtensionManifest) => {
    const { onCancel, showHeader } = this.props;

    if (!showHeader) {
      return null;
    }

    return (
      <Header
        icon={extensionManifest.icons['48']}
        title={extensionManifest.title}
        description={extensionManifest.description}
        summary={extensionManifest.summary}
        documentationUrl={extensionManifest.documentationUrl}
        onClose={onCancel}
      />
    );
  });

  renderBody = (extensionManifest: ExtensionManifest, submitting: boolean) => {
    const {
      autoSave,
      autoSaveTrigger,
      errorMessage,
      fields,
      isLoading,
      onCancel,
    } = this.props;

    const {
      currentParameters,
      hasParsedParameters,
      firstVisibleFieldName,
    } = this.state;

    if (isLoading || (!hasParsedParameters && errorMessage === null)) {
      return <LoadingState />;
    }

    return errorMessage || !fields ? (
      <ErrorMessage errorMessage={errorMessage || ''} />
    ) : (
      <ConfigForm
        extensionManifest={extensionManifest}
        fields={fields}
        parameters={currentParameters}
        onCancel={onCancel}
        autoSave={autoSave}
        autoSaveTrigger={autoSaveTrigger}
        submitting={submitting}
        firstVisibleFieldName={firstVisibleFieldName}
      />
    );
  };

  getFirstVisibleFieldName = memoizeOne((fields: FieldDefinition[]) => {
    function nonHidden(field: FieldDefinition) {
      if ('isHidden' in field) {
        return !field.isHidden;
      }
      return true;
    }

    // finds the first visible field, true for FieldSets too
    const firstVisibleField = fields.find(nonHidden);
    let newFirstVisibleFieldName;

    if (firstVisibleField) {
      // if it was a fieldset, go deeper trying to locate the field
      if (firstVisibleField.type === 'fieldset') {
        const firstVisibleFieldWithinFieldset = firstVisibleField.fields.find(
          nonHidden,
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
    const { extensionManifest } = this.props;
    if (!extensionManifest) {
      return <LoadingState />;
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        {({ formProps, submitting }) => {
          return (
            <form
              {...formProps}
              noValidate
              onKeyDown={this.handleKeyDown}
              data-testid="extension-config-panel"
            >
              {this.renderHeader(extensionManifest)}
              {this.renderBody(extensionManifest, submitting)}
            </form>
          );
        }}
      </Form>
    );
  }
}

export default withAnalyticsContext({ source: 'ConfigPanel' })(
  withAnalyticsEvents()(ConfigPanel),
);
