import React, { useMemo, useState } from 'react';

import cloneDeepWith from 'lodash/cloneDeepWith';

import Button from '@atlaskit/button/new';
import { code } from '@atlaskit/docs';
import type { AllEditorPresetPluginTypes } from '@atlaskit/editor-common/preset';
import { type EditorProps } from '@atlaskit/editor-core';
import { createUniversalPresetInternal } from '@atlaskit/editor-core/preset-universal';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import { Box } from '@atlaskit/primitives';

import { getDefaultPresetOptionsFromEditorProps } from '../src/create-editor/create-plugins-list';
import { createFeatureFlagsFromProps } from '../src/create-editor/feature-flags-from-props';
import { type EditorNextProps } from '../src/types/editor-props';

type Complete<T> = {
	[P in keyof Required<T>]: undefined;
};

function camelToKebabCase(input: string): string {
	return input.replace(/([A-Z])/g, '-$1').toLowerCase();
}

// All composable editor props that are valid
const allComposableEditorProps: Complete<EditorNextProps> = {
	appearance: undefined,
	preset: undefined,
	emojiProvider: undefined,
	contentComponents: undefined,
	primaryToolbarIconBefore: undefined,
	secondaryToolbarComponents: undefined,
	persistScrollGutter: undefined,
	quickInsert: undefined,
	shouldFocus: undefined,
	disabled: undefined,
	contextPanel: undefined,
	errorReporterHandler: undefined,
	contentTransformerProvider: undefined,
	maxHeight: undefined,
	minHeight: undefined,
	defaultValue: undefined,
	assistiveLabel: undefined,
	popupsMountPoint: undefined,
	popupsBoundariesElement: undefined,
	popupsScrollableElement: undefined,
	editorActions: undefined,
	onEditorReady: undefined,
	onDestroy: undefined,
	onChange: undefined,
	onCancel: undefined,
	inputSamplingLimit: undefined,
	extensionProviders: undefined,
	UNSAFE_useAnalyticsContext: undefined,
	useStickyToolbar: undefined,
	featureFlags: undefined,
	__livePage: undefined,
	onSave: undefined,
	performanceTracking: undefined,
	sanitizePrivateContent: undefined,
	collabEdit: undefined,
	primaryToolbarComponents: undefined,
	allowUndoRedoButtons: undefined,
	activityProvider: undefined,
	searchProvider: undefined,
	collabEditProvider: undefined,
	assistiveDescribedBy: undefined,
	taskDecisionProvider: undefined,
	annotationProviders: undefined,
	presenceProvider: undefined,
	legacyImageUploadProvider: undefined,
	mentionProvider: undefined,
	macroProvider: undefined,
	contextIdentifierProvider: undefined,
	autoformattingProvider: undefined,
	placeholder: undefined,
	linking: undefined,
	media: undefined,
	placeholderBracketHint: undefined,
	trackValidTransactions: undefined,
	hideAvatarGroup: undefined,
};

const pluginNameExceptions = {
	pasteOptionsToolbarPlugin: 'pasteOptionsToolbarPlugin',
	table: 'tablesPlugin',
};

type VariableType = {
	type: 'migratorVariable';
	value: string;
};

function isVariableType(value: any): value is VariableType {
	return typeof value === 'object' && (value as VariableType)?.type === 'migratorVariable';
}

function deepReplaceSpecialValues(obj: any): any {
	return cloneDeepWith(obj, (value) => {
		if (isVariableType(value)) {
			return value.value; // Replace with the inner value
		}
		// Return undefined to continue the default cloning behavior
		return undefined;
	});
}

function converter(props: EditorProps) {
	const preset = createUniversalPresetInternal({
		appearance: props.appearance,
		props: getDefaultPresetOptionsFromEditorProps(props),
		featureFlags: createFeatureFlagsFromProps(props),
	});
	const plugins = preset.build({});

	// @ts-expect-error
	const basePlugins: AllEditorPresetPluginTypes[] = preset.data.reverse().filter(Boolean);

	const optimisedPresetAdds = basePlugins
		.map((plugin, idx) => {
			const pluginName = Object.keys(pluginNameExceptions).includes(plugins[idx].name)
				? // @ts-expect-error
					pluginNameExceptions[plugins[idx].name]
				: plugins[idx].name + 'Plugin';
			if (Array.isArray(plugin) && plugin[1] && Object.keys(plugin[1]).length > 0) {
				const parsedPluginOptions =
					typeof plugin[1] === 'object' ? deepReplaceSpecialValues(plugin[1]) : plugin[1];
				return `       .add([${pluginName}, ${JSON.stringify(parsedPluginOptions)}])`;
			}
			return `       .add(${pluginName})`;
		})
		.join('\n');

	const pluginImports = basePlugins
		.map((_, idx) => {
			const pluginName = Object.keys(pluginNameExceptions).includes(plugins[idx].name)
				? // @ts-expect-error
					pluginNameExceptions[plugins[idx].name]
				: plugins[idx].name + 'Plugin';
			return `import { ${pluginName} } from '@atlaskit/editor-plugins/${camelToKebabCase(plugins[idx].name)}';`;
		})
		.join('\n');

	const otherProps = Object.keys(props)
		.filter((prop) => Object.keys(allComposableEditorProps).includes(prop))
		.map((prop) => {
			const value = props[prop as keyof EditorProps];

			// If it's our special parsed value
			const parsedValue = isVariableType(value) ? value?.value : value;
			return `        ${prop}={${typeof value === 'string' ? `"${value}"` : parsedValue}}`;
		})
		.join('\n');

	const template = `
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
${pluginImports}

function Editor() {
  const { preset } = usePreset((builder) => {
	  return builder
${optimisedPresetAdds}
  })

  return (
	  <ComposableEditor
	    preset={preset}${otherProps ? '\n' + otherProps : ''}
	  />
  );
}
	`;
	return template;
}

function stripTabs(input: string): string {
	return input.replace(/\t/g, '  ').replace(/\n/g, ' ');
}

function getValidProps(propsString: string): EditorProps | null {
	const props: EditorProps = {};
	// Regular expression to match key-value pairs and boolean attributes
	const regex = /(\w+)(?:=(?:"([^"]*)"|{([^}]+)}))?/g;
	let match;
	while ((match = regex.exec(propsString)) !== null) {
		const [_, key, stringValue, objectValue] = match;
		if (stringValue !== undefined) {
			// String value
			// @ts-expect-error
			props[key] = stringValue;
		} else if (objectValue !== undefined) {
			// Attempt to parse boolean literals or objects
			try {
				// Use JSON.parse for simple boolean or object values
				if (objectValue === 'true' || objectValue === 'false') {
					// @ts-expect-error
					props[key] = objectValue === 'true';
				} else {
					// @ts-expect-error
					props[key] = JSON.parse(objectValue);
				}
			} catch {
				// If parsing fails, return the unparsed string
				// @ts-expect-error
				props[key] = { type: 'migratorVariable', value: objectValue };
			}
		} else {
			// Boolean attribute
			// @ts-expect-error
			props[key] = true;
		}
	}
	return props;
}

export default function Example() {
	const [legacyEditorValue, setLegacyEditorValue] = useState(
		'<Editor allowIndentation allowAnalyticsGASV3 />',
	);

	const convertedValue = useMemo(() => {
		const propsString = legacyEditorValue.match(/<Editor\s+([^>]+)\s*\/>/)?.[1];
		if (!propsString) {
			return { type: 'failure' };
		}
		const props = getValidProps(stripTabs(propsString));
		if (props === null) {
			return { type: 'failure' };
		}
		const value = converter(props);
		return { type: 'success', value };
	}, [legacyEditorValue]);

	return (
		<Box padding="space.100">
			<textarea
				value={legacyEditorValue}
				rows={10}
				cols={100}
				placeholder='Please add your editor (eg. "<Editor allowIndentation />") and we will convert it to the "ComposableEditor"'
				onChange={(e) => {
					setLegacyEditorValue(stripTabs(e.target.value));
				}}
			/>
			<div>
				{convertedValue.type === 'success' && convertedValue.value && (
					<Button
						onClick={() => {
							navigator.clipboard.writeText(convertedValue.value);
						}}
						iconAfter={(iconProps) => <CopyIcon {...iconProps} />}
					>
						Copy
					</Button>
				)}
			</div>
			{convertedValue.type === 'failure'
				? 'Please pass a valid Editor.'
				: code`${convertedValue.value}`}
		</Box>
	);
}
