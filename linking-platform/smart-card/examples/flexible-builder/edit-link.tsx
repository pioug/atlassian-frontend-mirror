import React, { useCallback, useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { type JsonLd } from '@atlaskit/json-ld-types';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import JsonldEditorInput from '../jsonld-editor/jsonld-editor-input';
import JsonldExample from '../jsonld-editor/jsonld-example';
import LoadLinkForm from '../jsonld-editor/load-link-form';

import Code from './code';
import type { FlexibleTemplate } from './types';

const buttonGroupStyles = xcss({
	textAlign: 'right',
});

const EditLink = ({
	initialJson,
	jsonError,
	onJsonChange,
	onSubmitUrl,
	onTextChange,
	template,
	text,
	urlError,
}: {
	initialJson: JsonLd.Response;
	jsonError?: string;
	onJsonChange: (json: JsonLd.Response) => void;
	onSubmitUrl: (url: string, ari?: string) => void;
	onTextChange: (str: string) => void;
	template: FlexibleTemplate;
	text: string;
	urlError?: string;
}) => {
	const [showCode, setShowCode] = useState<boolean>(true);
	const [showEditLink, setShowEditLink] = useState<boolean>(false);
	const [showJsonld, setShowJsonld] = useState<boolean>(false);

	const onShowCodeClick = useCallback(() => setShowCode(!showCode), [showCode]);

	const onShowEditLinkClick = useCallback(() => setShowEditLink(!showEditLink), [showEditLink]);

	const onShowJsonldClick = useCallback(() => setShowJsonld(!showJsonld), [showJsonld]);

	return (
		<Stack space="space.200">
			<Box xcss={buttonGroupStyles}>
				<ButtonGroup>
					<Button appearance="subtle" onClick={onShowCodeClick} spacing="compact">
						Code
					</Button>
					<Button appearance="subtle" onClick={onShowEditLinkClick} spacing="compact">
						Change link
					</Button>
					<Button appearance="subtle" onClick={onShowJsonldClick} spacing="compact">
						Edit JSON-LD
					</Button>
				</ButtonGroup>
			</Box>
			{showCode && <Code template={template} />}
			{showEditLink && (
				<React.Fragment>
					<LoadLinkForm onSubmit={onSubmitUrl} error={urlError} />
					<JsonldExample defaultValue={initialJson} onSelect={onJsonChange} />
				</React.Fragment>
			)}
			{showJsonld && <JsonldEditorInput error={jsonError} onChange={onTextChange} value={text} />}
		</Stack>
	);
};

export default EditLink;
