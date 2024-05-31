import React, { useCallback, useEffect, useRef } from 'react';

import _isEqual from 'lodash/isEqual';
import _mergeRecursive from 'lodash/merge';
import memoizeOne from 'memoize-one';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { withAnalyticsContext, withAnalyticsEvents } from '@atlaskit/analytics-next';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	fireAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import type {
	ExtensionManifest,
	FieldDefinition,
	OnSaveCallback,
	Parameters,
	TabField,
	TabGroupField,
} from '@atlaskit/editor-common/extensions';
import { isTabGroup, configPanelMessages as messages } from '@atlaskit/editor-common/extensions';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import Form, { FormFooter } from '@atlaskit/form';

import type { ExtensionPlugin, RejectSave } from '../../types';

import { ALLOWED_LOGGED_MACRO_PARAMS } from './constants';
import ErrorMessage from './ErrorMessage';
import FormContent from './FormContent';
import { FormErrorBoundary } from './FormErrorBoundary';
import Header from './Header';
import LoadingState from './LoadingState';
import { deserialize, findDuplicateFields, serialize } from './transformers';
import type { OnFieldChange, ValidationErrors } from './types';
import { getLoggedParameters } from './utils';

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
	contextIdentifierProvider,
	featureFlags,
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
	contextIdentifierProvider?: ContextIdentifierProvider | undefined;
	featureFlags?: FeatureFlags;
} & WrappedComponentProps) {
	useEffect(() => {
		if (fields) {
			const firstDuplicateField = findDuplicateFields(fields);
			if (firstDuplicateField) {
				throw new Error(`Possible duplicate field name: \`${firstDuplicateField.name}\`.`);
			}
		}
	}, [fields]);

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
				onFieldChange={onFieldChange}
				firstVisibleFieldName={firstVisibleFieldName}
				contextIdentifierProvider={contextIdentifierProvider}
				featureFlags={featureFlags}
			/>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={canSave ? {} : { display: 'none' }}>
				<FormFooter align="start">
					<ButtonGroup>
						<Button type="submit" appearance="primary">
							{intl.formatMessage(messages.submit)}
						</Button>
						<Button appearance="default" isDisabled={submitting} onClick={onCancel}>
							{intl.formatMessage(messages.cancel)}
						</Button>
					</ButtonGroup>
				</FormFooter>
			</div>
		</>
	);
}

const ConfigFormIntl = injectIntl(ConfigForm);

const WithOnFieldChange = ({
	getState,
	autoSave,
	handleSubmit,
	children,
}: {
	getState: () => { values: Parameters; errors: ValidationErrors };
	autoSave: boolean;
	handleSubmit: (parameters: Parameters) => void;
	children: (onFieldChange: OnFieldChange) => React.ReactElement;
}) => {
	const getStateRef = useRef<() => { values: Parameters; errors: ValidationErrors }>(getState);

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
	autoSaveTrigger?: () => void;
	autoSaveReject?: RejectSave;
	showHeader?: boolean;
	closeOnEsc?: boolean;
	onChange: OnSaveCallback;
	onCancel: () => void;
	errorMessage: string | null;
	isLoading?: boolean;
	featureFlags?: FeatureFlags;
	api: ExtractInjectionAPI<ExtensionPlugin> | undefined;
} & WithAnalyticsEventsProps;

type State = {
	hasParsedParameters: boolean;
	currentParameters: Parameters;
	firstVisibleFieldName?: string;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
class ConfigPanel extends React.Component<Props, State> {
	onFieldChange: OnFieldChange | null;

	constructor(props: Props) {
		super(props);

		this.state = {
			hasParsedParameters: false,
			currentParameters: {},
			firstVisibleFieldName: props.fields ? this.getFirstVisibleFieldName(props.fields) : undefined,
		};

		this.onFieldChange = null;
	}

	componentDidMount() {
		const { fields, parameters } = this.props;
		this.parseParameters(fields, parameters);
	}

	componentWillUnmount() {
		const { createAnalyticsEvent, extensionManifest, fields } = this.props;
		const { currentParameters } = this.state;

		fireAnalyticsEvent(createAnalyticsEvent)({
			payload: {
				action: ACTION.CLOSED,
				actionSubject: ACTION_SUBJECT.CONFIG_PANEL,
				eventType: EVENT_TYPE.UI,
				attributes: {
					extensionKey: extensionManifest?.key,
					extensionType: extensionManifest?.type,
					...(extensionManifest?.key && ALLOWED_LOGGED_MACRO_PARAMS[extensionManifest.key]
						? {
								parameters: getLoggedParameters(extensionManifest.key, currentParameters, fields),
							}
						: {}),
				},
			},
		});
	}

	componentDidUpdate(prevProps: Props) {
		const { parameters, fields, autoSaveTrigger, extensionManifest } = this.props;

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
		const getRelevantData = (
			field: TabGroupField | TabField,
			formParams: Parameters,
			currentParams: Parameters,
			backfill: Parameters,
		) => {
			if (field.hasGroupedValues && !(field.name in backfill)) {
				backfill[field.name] = {};
			}

			const actualFormParams = field.hasGroupedValues ? formParams[field.name] || {} : formParams;
			const actualCurrentParams = field.hasGroupedValues
				? currentParams[field.name] || {}
				: currentParams;
			const actualBackfillParams = field.hasGroupedValues ? backfill[field.name] : backfill;

			return {
				formParams: actualFormParams,
				currentParams: actualCurrentParams,
				backfillParams: actualBackfillParams,
			};
		};

		// Traverse any tab structures and backfill field values on tabs
		// which aren't shown. This filter should be ok because tabs are
		// currently only allowed on top level
		const mergedTabGroups = fields.filter(isTabGroup).reduce((missingBackfill, tabGroup) => {
			const {
				formParams: tabGroupFormData,
				currentParams: tabGroupCurrentData,
				backfillParams: tabGroupParams,
			} = getRelevantData(tabGroup, formData, currentParameters, missingBackfill);

			// Loop through tabs and see what fields are missing from current data
			tabGroup.fields.forEach((tabField: TabField) => {
				const {
					formParams: tabFormData,
					currentParams: tabCurrentData,
					backfillParams: tabParams,
				} = getRelevantData(tabField, tabGroupFormData, tabGroupCurrentData, tabGroupParams);

				tabField.fields.forEach((field) => {
					if (field.name in tabFormData || !(field.name in tabCurrentData)) {
						return;
					}

					tabParams[field.name] = tabCurrentData[field.name];
				});
			});

			return missingBackfill;
		}, {} as Parameters);

		return _mergeRecursive({}, mergedTabGroups, formData);
	};

	handleSubmit = async (formData: Parameters) => {
		const { fields, extensionManifest, onChange, autoSaveReject } = this.props;

		if (!extensionManifest || !fields) {
			if (!extensionManifest) {
				autoSaveReject?.(new Error('Extension manifest not loaded'));
			} else if (!fields) {
				autoSaveReject?.(new Error('Config fields not loaded'));
			}
			return;
		}

		try {
			const serializedData = await serialize(
				extensionManifest,
				this.backfillTabFormData(fields, formData, this.state.currentParameters),
				fields,
			);

			onChange(serializedData);
		} catch (error) {
			autoSaveReject?.(error);
			// eslint-disable-next-line no-console
			console.error(`Error serializing parameters`, error);
		}
	};

	parseParameters = async (fields?: FieldDefinition[], parameters?: Parameters) => {
		const { extensionManifest } = this.props;

		if (!extensionManifest || !fields || fields.length === 0) {
			// do not parse while fields are not returned
			return;
		}

		if (typeof parameters === 'undefined') {
			this.setState({ currentParameters: {}, hasParsedParameters: true });
			return;
		}

		const currentParameters = await deserialize(extensionManifest, parameters, fields);
		this.setState({ currentParameters, hasParsedParameters: true });
	};

	// memoized to prevent rerender on new parameters
	renderHeader = memoizeOne((extensionManifest: ExtensionManifest) => {
		const { onCancel, showHeader } = this.props;

		// Use a temporary allowlist of top 3 macros to test out a new "Documentation" CTA ("Need help?")
		// This will be removed when Top 5 Modernized Macros updates are rolled out
		const modernizedMacrosList = ['children', 'recently-updated', 'excerpt'];
		const enableHelpCTA = modernizedMacrosList.includes(extensionManifest.key);

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
				enableHelpCTA={enableHelpCTA}
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
				const firstVisibleFieldWithinFieldset = firstVisibleField.fields.find(nonHidden);

				newFirstVisibleFieldName =
					firstVisibleFieldWithinFieldset && firstVisibleFieldWithinFieldset.name;
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
		const { extensionManifest, featureFlags } = this.props;
		if (!extensionManifest) {
			return <LoadingState />;
		}

		const { errorMessage, fields, isLoading, onCancel, api } = this.props;
		const { currentParameters, hasParsedParameters, firstVisibleFieldName } = this.state;
		const { handleSubmit, handleKeyDown } = this;

		return (
			<Form onSubmit={handleSubmit}>
				{({ formProps, getState, submitting }) => {
					return (
						<WithOnFieldChange
							autoSave={true}
							getState={
								getState as () => {
									values: Parameters;
									errors: ValidationErrors;
								}
							}
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
										<ConfigFormIntlWithBoundary
											api={api}
											canSave={false}
											errorMessage={errorMessage}
											extensionManifest={extensionManifest}
											fields={fields ?? []}
											firstVisibleFieldName={firstVisibleFieldName}
											hasParsedParameters={hasParsedParameters}
											isLoading={isLoading || false}
											onCancel={onCancel}
											onFieldChange={onFieldChange}
											parameters={currentParameters}
											submitting={submitting}
											featureFlags={featureFlags}
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

function ConfigFormIntlWithBoundary({
	api,
	fields,
	submitting,
	parameters,
	featureFlags,
	canSave,
	extensionManifest,
	onFieldChange,
	onCancel,
	isLoading,
	hasParsedParameters,
	firstVisibleFieldName,
	errorMessage,
}: {
	api: ExtractInjectionAPI<ExtensionPlugin> | undefined;
	fields: FieldDefinition[];
	submitting: boolean;
	parameters: Parameters;
	featureFlags?: FeatureFlags;
	canSave: boolean;
	extensionManifest: ExtensionManifest;
	onFieldChange: OnFieldChange;
	onCancel: () => void;
	isLoading: boolean;
	hasParsedParameters: boolean;
	firstVisibleFieldName?: string;
	errorMessage: string | null;
}) {
	const { contextIdentifierState } = useSharedPluginState(api, ['contextIdentifier']);
	const { contextIdentifierProvider } = contextIdentifierState ?? {};

	return (
		<FormErrorBoundary
			contextIdentifierProvider={contextIdentifierProvider}
			extensionKey={extensionManifest.key}
			fields={fields}
		>
			<ConfigFormIntl
				canSave={canSave}
				errorMessage={errorMessage}
				extensionManifest={extensionManifest}
				fields={fields}
				firstVisibleFieldName={firstVisibleFieldName}
				hasParsedParameters={hasParsedParameters}
				isLoading={isLoading || false}
				onCancel={onCancel}
				onFieldChange={onFieldChange}
				parameters={parameters}
				submitting={submitting}
				contextIdentifierProvider={contextIdentifierProvider}
				featureFlags={featureFlags}
			/>
		</FormErrorBoundary>
	);
}

export default withAnalyticsContext({ source: 'ConfigPanel' })(withAnalyticsEvents()(ConfigPanel));
