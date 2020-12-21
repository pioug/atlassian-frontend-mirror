import React from 'react';
import memoizeOne from 'memoize-one';
import {
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { ExtensionManifest } from '@atlaskit/editor-common';
import Form from '@atlaskit/form';
import isEmpty from 'lodash/isEmpty';

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
import ErrorMessage from './ErrorMessage';
import { serialize, deserialize } from './transformers';

import { InjectedIntlProps, injectIntl } from 'react-intl';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import { FormFooter } from '@atlaskit/form';

import FormContent from './FormContent';
import { messages } from './messages';

function ConfigForm({
  canSave,
  errorMessage,
  extensionManifest,
  fields,
  firstVisibleFieldName,
  hasParsedParameters,
  intl,
  isLoading,
  onCancel,
  onFieldBlur,
  parameters,
  submitting,
}: {
  canSave: boolean;
  errorMessage: string | null;
  extensionManifest: ExtensionManifest;
  fields?: FieldDefinition[];
  firstVisibleFieldName?: string;
  hasParsedParameters: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onFieldBlur: () => void;
  parameters: Parameters;
  submitting: boolean;
} & InjectedIntlProps) {
  if (isLoading || (!hasParsedParameters && errorMessage === null)) {
    return <LoadingState />;
  }

  if (errorMessage || !fields) {
    return <ErrorMessage errorMessage={errorMessage || ''} />;
  }

  return (
    <>
      <FormContent
        fields={fields}
        parameters={parameters}
        extensionManifest={extensionManifest}
        onFieldBlur={onFieldBlur}
        firstVisibleFieldName={firstVisibleFieldName}
      />
      <div style={canSave ? {} : { display: 'none' }}>
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
      </div>
    </>
  );
}

const ConfigFormIntl = injectIntl(ConfigForm);

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
  onFieldBlur: (() => void) | null;

  constructor(props: Props) {
    super(props);

    this.state = {
      hasParsedParameters: false,
      currentParameters: {},
      firstVisibleFieldName: props.fields
        ? this.getFirstVisibleFieldName(props.fields)
        : undefined,
    };

    this.onFieldBlur = null;
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
    const { parameters, fields, autoSaveTrigger } = this.props;

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

    if (prevProps.autoSaveTrigger !== autoSaveTrigger) {
      if (this.onFieldBlur) {
        this.onFieldBlur();
      }
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

    const { autoSave, errorMessage, fields, isLoading, onCancel } = this.props;
    const {
      currentParameters,
      hasParsedParameters,
      firstVisibleFieldName,
    } = this.state;
    const { handleSubmit, handleKeyDown } = this;

    return (
      <Form onSubmit={handleSubmit}>
        {({ formProps, getState, submitting }) => {
          function onFieldBlur() {
            if (!autoSave) {
              return;
            }

            // dont submit if validation failed
            const { errors, values } = getState();
            if (!isEmpty(errors)) {
              return;
            }

            handleSubmit(values);
          }

          this.onFieldBlur = onFieldBlur;
          return (
            <form
              {...formProps}
              noValidate
              onKeyDown={handleKeyDown}
              data-testid="extension-config-panel"
            >
              {this.renderHeader(extensionManifest)}
              <ConfigFormIntl
                canSave={!autoSave}
                errorMessage={errorMessage}
                extensionManifest={extensionManifest}
                fields={fields}
                firstVisibleFieldName={firstVisibleFieldName}
                hasParsedParameters={hasParsedParameters}
                isLoading={isLoading || false}
                onCancel={onCancel}
                onFieldBlur={onFieldBlur}
                parameters={currentParameters}
                submitting={submitting}
              />
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
