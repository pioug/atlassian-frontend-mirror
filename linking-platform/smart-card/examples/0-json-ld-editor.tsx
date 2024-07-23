/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import CardExample from './jsonld-editor/card-example';
import JsonldExample from './jsonld-editor/jsonld-example';
import LoadLinkForm from './jsonld-editor/load-link-form';
import JsonldEditorInput from './jsonld-editor/jsonld-editor-input';
import JsonldEditor from './jsonld-editor/jsonld-editor';

const styles = css({
	display: 'flex',
	gap: '1rem',
	height: 'fit-content',
	padding: '2rem',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div': {
		width: '50%',
	},
});

const Example = () => {
	return (
		<JsonldEditor>
			{({
				ari,
				branchDeploy,
				initialJson,
				isEmbedSupported,
				json,
				jsonError,
				onJsonChange,
				onSubmitUrl,
				onTextChange,
				onUrlError,
				onUrlResolve,
				text,
				url,
				urlError,
			}) => (
				<div css={styles}>
					<div>
						<CardExample
							ari={ari}
							branchDeploy={branchDeploy}
							isEmbedSupported={isEmbedSupported}
							json={json}
							onError={onUrlError}
							onResolve={onUrlResolve}
							url={url}
						/>
					</div>
					<div>
						<h6>JSON-LD</h6>
						<LoadLinkForm onSubmit={onSubmitUrl} error={urlError} branchDeploy={branchDeploy} />
						<JsonldExample defaultValue={initialJson} onSelect={onJsonChange} />
						<JsonldEditorInput error={jsonError} onChange={onTextChange} value={text} />
					</div>
				</div>
			)}
		</JsonldEditor>
	);
};

export default Example;
