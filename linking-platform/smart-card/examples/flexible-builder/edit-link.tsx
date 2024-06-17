/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React, { useCallback, useState } from 'react';
import { type JsonLd } from 'json-ld-types';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import LoadLinkForm from '../jsonld-editor/load-link-form';
import JsonldExample from '../jsonld-editor/jsonld-example';
import JsonldEditorInput from '../jsonld-editor/jsonld-editor-input';
import type { FlexibleTemplate } from './types';
import Code from './code';

const buttonGroupStyles = css({
	textAlign: 'right',
});

const EditLink: React.FC<{
	initialJson: JsonLd.Response;
	jsonError?: string;
	onJsonChange: (json: JsonLd.Response) => void;
	onSubmitUrl: (url: string, ari?: string) => void;
	onTextChange: (str: string) => void;
	template: FlexibleTemplate;
	text: string;
	urlError?: string;
}> = ({
	initialJson,
	jsonError,
	onJsonChange,
	onSubmitUrl,
	onTextChange,
	template,
	text,
	urlError,
}) => {
	const [showCode, setShowCode] = useState<boolean>(true);
	const [showEditLink, setShowEditLink] = useState<boolean>(false);
	const [showJsonld, setShowJsonld] = useState<boolean>(false);

	const onShowCodeClick = useCallback(() => setShowCode(!showCode), [showCode]);

	const onShowEditLinkClick = useCallback(() => setShowEditLink(!showEditLink), [showEditLink]);

	const onShowJsonldClick = useCallback(() => setShowJsonld(!showJsonld), [showJsonld]);

	return (
		<React.Fragment>
			<div css={buttonGroupStyles}>
				<ButtonGroup appearance="subtle-link">
					<Button onClick={onShowCodeClick} spacing="compact">
						Code
					</Button>
					<Button onClick={onShowEditLinkClick} spacing="compact">
						Change link
					</Button>
					<Button onClick={onShowJsonldClick} spacing="compact">
						Edit JSON-LD
					</Button>
				</ButtonGroup>
			</div>
			{showCode && <Code template={template} />}
			{showEditLink && (
				<React.Fragment>
					<LoadLinkForm onSubmit={onSubmitUrl} error={urlError} />
					<JsonldExample defaultValue={initialJson} onSelect={onJsonChange} />
				</React.Fragment>
			)}
			{showJsonld && <JsonldEditorInput error={jsonError} onChange={onTextChange} value={text} />}
		</React.Fragment>
	);
};

export default EditLink;
