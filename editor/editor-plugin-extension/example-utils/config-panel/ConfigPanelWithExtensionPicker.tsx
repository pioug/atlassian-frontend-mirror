/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';

// eslint-disable-next-line import/no-extraneous-dependencies
import { CodeBlock } from '@atlaskit/code';
import type {
	ExtensionModule,
	ExtensionProvider,
	Parameters,
} from '@atlaskit/editor-common/extensions';
import { getExtensionKeyAndNodeKey } from '@atlaskit/editor-common/extensions';
import Heading from '@atlaskit/heading';
import { Box, xcss } from '@atlaskit/primitives';
import TextArea from '@atlaskit/textarea';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useStateFromPromise } from '../../src/ui/ConfigPanel/use-state-from-promise';

import ConfigPanelWithProviders from './ConfigPanelWithProviders';
import type { CallbackParams } from './ExtensionNodePicker';
import ExtensionNodePicker from './ExtensionNodePicker';

const wrapperStyles = xcss({ margin: 'space.200' });

const exampleWrapperStyles = css({ display: 'flex', flexDirection: 'row' });

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const column = (width: number | string) =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `${width}px`,
		margin: token('space.200', '16px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		h3: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			borderBottom: `1px solid ${colors.N50}`,
			marginBottom: token('space.200', '16px'),
		},
	});

const codeWrapperStyles = css({
	marginTop: token('space.200', '16px'),
});

function ExtensionConfigPanel({
	extension,
	node,
	nodeKey,
	extensionProvider,
	parameters: initialParameters = {},
	item,
}: { extensionProvider: ExtensionProvider; nodeKey: string } & CallbackParams) {
	const [fields] = useStateFromPromise(
		function getFields() {
			if (node && typeof node.getFieldsDefinition === 'function') {
				return node.getFieldsDefinition({});
			}
		},
		[node],
		[],
	);

	const [parametersJson, setParametersJson] = useState(() => JSON.stringify(initialParameters));

	const [parameters, setParameters] = useState(initialParameters);

	const onChangeParametersJson: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
		setParametersJson(event.target.value);
	};

	useEffect(() => {
		try {
			setParameters({
				...parameters,
				...JSON.parse(parametersJson),
			});
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error('Invalid JSON Parameters', e instanceof Error ? e.message : String(e));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [parametersJson]);

	if (!extension || !node || !item) {
		return null;
	}

	return (
		<div css={exampleWrapperStyles}>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage */}
			<div css={column(400)} key="config-panel">
				<Heading size="medium">Config panel:</Heading>
				<ConfigPanelWithProviders
					extensionType={extension.type}
					extensionKey={extension.key}
					nodeKey={nodeKey}
					extensionProvider={extensionProvider}
					parameters={parameters}
					onChange={setParameters}
				/>
			</div>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage */}
			<div css={column(500)} key="parameters">
				<Heading size="medium">Initial Parameters:</Heading>
				<div css={codeWrapperStyles}>
					{parameters && <TextArea onChange={onChangeParametersJson} value={parametersJson} />}
				</div>
				<Heading size="medium">State:</Heading>
				<div css={codeWrapperStyles}>
					{parameters && (
						<CodeBlock
							language="json"
							text={JSON.stringify(parameters, null, 4)}
							showLineNumbers={false}
						/>
					)}
				</div>
			</div>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage */}
			<div css={column(500)} key="fields-definition">
				<Heading size="medium">Fields definition:</Heading>
				<div css={codeWrapperStyles}>
					<CodeBlock
						language="json"
						text={JSON.stringify(fields, null, 4)}
						showLineNumbers={false}
					/>
				</div>
			</div>
		</div>
	);
}

const addHashToTheUrl = (extensionPath: string): void => {
	// @ts-expect-error
	window.top.location.hash = extensionPath;
};

const getHashFromUrl = (): string =>
	// @ts-expect-error
	window.top.location.hash &&
	// @ts-expect-error
	decodeURIComponent(window.top.location.hash.slice(1));

export default function ConfigPanelWithExtensionPicker({
	extensionProvider,
	parameters = {},
}: {
	extensionProvider: ExtensionProvider;
	parameters?: Parameters;
}) {
	const [hash, setHash] = useState<string>(getHashFromUrl());
	const [extensionNode, setNodeAndParameters] = useState<CallbackParams>();
	const [item, setItem] = useState<ExtensionModule>();
	const [extensionKey, nodeKey] = getExtensionKeyAndNodeKey(
		hash,
		extensionNode && extensionNode.extension ? extensionNode.extension.type : '',
	);

	const actualParameters =
		extensionNode && extensionNode.parameters && Object.keys(extensionNode.parameters).length > 0
			? extensionNode.parameters
			: parameters;

	return (
		<IntlProvider locale="en-AU">
			<Box xcss={wrapperStyles}>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ float: 'left' }} key="panel">
					{extensionNode?.node && item && (
						<ExtensionConfigPanel
							key={hash}
							extension={extensionNode.extension}
							extensionProvider={extensionProvider}
							nodeKey={nodeKey}
							node={extensionNode.node}
							item={item}
							parameters={actualParameters}
						/>
					)}
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ float: 'right' }} key="picker">
					<ExtensionNodePicker
						selectedExtension={extensionKey}
						selectedNode={nodeKey}
						extensionProvider={extensionProvider}
						onSelect={(params) => {
							setNodeAndParameters(params);
							setItem(params.item);

							if (params.extension) {
								const hash = `${params.extension.key}:${params.nodeKey}`;
								addHashToTheUrl(hash);
								setHash(hash);
							}
						}}
					/>
				</div>
			</Box>
		</IntlProvider>
	);
}
