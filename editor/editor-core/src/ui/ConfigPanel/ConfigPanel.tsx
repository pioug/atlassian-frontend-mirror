import React, {
  FunctionComponent,
  useCallback,
  ReactElement,
  useRef,
  useEffect,
} from 'react';
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
  isTabGroup,
} from '@atlaskit/editor-common/extensions';
import _isEqual from 'lodash/isEqual';

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

import { pluginKey as extensionPluginKey } from '../../plugins/extension/plugin-key';
import WithPluginState from '../WithPluginState';
import FormContent from './FormContent';
import { messages } from './messages';
import { OnFieldChange, ValidationErrors } from './types';

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
  onFieldChange,
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
  onFieldChange: OnFieldChange;
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
    <WithPluginState
      plugins={{ extension: extensionPluginKey }}
      render={({ extension }) => (
        <>
          <FormContent
            fields={fields}
            parameters={parameters}
            extensionManifest={extensionManifest}
            onFieldChange={onFieldChange}
            firstVisibleFieldName={firstVisibleFieldName}
            contextIdentifierProvider={extension?.contextIdentifierProvider}
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
      )}
    />
  );
}

const ConfigFormIntl = injectIntl(ConfigForm);

const WithOnFieldChange: FunctionComponent<{
  getState: () => { values: Parameters; errors: Record<string, any> };
  autoSave: boolean;
  handleSubmit: (parameters: Parameters) => void;
  children: (onFieldChange: OnFieldChange) => ReactElement;
}> = ({ getState, autoSave, handleSubmit, children }) => {
  const getStateRef = useRef<
    () => { values: Parameters; errors: ValidationErrors }
  >(getState);

  useEffect(() => {
    getStateRef.current = getState;
  }, [getState]);

  const handleFieldChange = useCallback(
    (name: string, isDirty: boolean) => {
      if (!autoSave) {
        return;
      }

      // Don't trigger submit if nothing actually changed
      if (!isDirty) {
        return;
      }

      const { errors, values } = getStateRef.current();

      // Get only values that does not contain errors
      const validValues: Parameters = {};
      for (const key of Object.keys(values)) {
        if (!errors[key]) {
          // not has error
          validValues[key] = values[key];
        }
      }

      handleSubmit(validValues);
    },
    [autoSave, handleSubmit],
  );

  return children(handleFieldChange);
};

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
  onFieldChange: OnFieldChange | null;

  constructor(props: Props) {
    super(props);

    this.state = {
      hasParsedParameters: false,
      currentParameters: {},
      firstVisibleFieldName: props.fields
        ? this.getFirstVisibleFieldName(props.fields)
        : undefined,
    };

    this.onFieldChange = null;
  }

  componentDidMount() {
    const { fields, parameters } = this.props;
    this.parseParameters(fields, parameters);
  }

  componentWillUnmount() {
    const { createAnalyticsEvent, extensionManifest } = this.props;

    fireAnalyticsEvent(createAnalyticsEvent)({
      payload: {
        action: ACTION.CLOSED,
        actionSubject: ACTION_SUBJECT.CONFIG_PANEL,
        eventType: EVENT_TYPE.UI,
        attributes: {
          extensionKey: extensionManifest?.key,
          extensionType: extensionManifest?.type,
        },
      },
    });
  }

  componentDidUpdate(prevProps: Props) {
    const {
      parameters,
      fields,
      autoSaveTrigger,
      extensionManifest,
    } = this.props;

    if (
      (parameters && parameters !== prevProps.parameters) ||
      (fields && (!prevProps.fields || !_isEqual(fields, prevProps.fields)))
    ) {
      this.parseParameters(fields, parameters);
    }

    if (fields && (!prevProps.fields || !_isEqual(fields, prevProps.fields))) {
      this.setFirstVisibleFieldName(fields);
    }

    if (prevProps.autoSaveTrigger !== autoSaveTrigger) {
      if (this.onFieldChange) {
        this.onFieldChange('', true);
      }
    }

    if (
      prevProps.extensionManifest === undefined &&
      prevProps.extensionManifest !== extensionManifest
    ) {
      // This will only be fired once when extensionManifest is loaded initially
      // Can't do this in componentDidMount because extensionManifest is still undefined at that point
      fireAnalyticsEvent(this.props.createAnalyticsEvent)({
        payload: {
          action: ACTION.OPENED,
          actionSubject: ACTION_SUBJECT.CONFIG_PANEL,
          eventType: EVENT_TYPE.UI,
          attributes: {
            extensionKey: extensionManifest?.key,
            extensionType: extensionManifest?.type,
          },
        },
      });
    }
  }

  handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if ((e.key === 'Esc' || e.key === 'Escape') && this.props.closeOnEsc) {
      this.props.onCancel();
    }
  };

  // https://product-fabric.atlassian.net/browse/DST-2697
  // workaround for DST-2697, remove this function once fix.
  backfillTabFormData = (
    fields: FieldDefinition[],
    formData: Parameters,
    currentParameters: Parameters,
  ): Parameters => {
    const mergedTabGroups = fields.filter(isTabGroup).reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: {
          ...(currentParameters[field.name] || {}),
          ...(formData[field.name] || {}),
        },
      }),
      {},
    );

    return { ...formData, ...mergedTabGroups };
  };

  handleSubmit = async (formData: Parameters) => {
    const { fields, extensionManifest, onChange } = this.props;
    if (!extensionManifest || !fields) {
      return;
    }

    try {
      const serializedData = await serialize(
        extensionManifest,
        this.backfillTabFormData(
          fields,
          formData,
          this.state.currentParameters,
        ),
        fields,
      );

      onChange(serializedData);
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
          return (
            <WithOnFieldChange
              autoSave={!!autoSave}
              getState={getState}
              handleSubmit={handleSubmit}
            >
              {(onFieldChange) => {
                this.onFieldChange = onFieldChange;
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
                      onFieldChange={onFieldChange}
                      parameters={currentParameters}
                      submitting={submitting}
                    />
                  </form>
                );
              }}
            </WithOnFieldChange>
          );
        }}
      </Form>
    );
  }
}

export default withAnalyticsContext({ source: 'ConfigPanel' })(
  withAnalyticsEvents()(ConfigPanel),
);
