import React, { useCallback, useState } from 'react';

import { Box, Grid, Stack } from '@atlaskit/primitives';

import EditLink from './flexible-builder/edit-link';
import TemplateBuilder from './flexible-builder/template-builder';
import TemplateRenderer from './flexible-builder/template-renderer';
import { type FlexibleTemplate } from './flexible-builder/types';
import { getExampleFromLocalStorage, setExampleToLocalStorage } from './flexible-builder/utils';
import JsonldEditor from './jsonld-editor/jsonld-editor';

export default () => {
	const [template, setTemplate] = useState<FlexibleTemplate>(getExampleFromLocalStorage());

	const onChange = useCallback((updatedTemplate: FlexibleTemplate) => {
		setTemplate(updatedTemplate);
		setExampleToLocalStorage(updatedTemplate);
	}, []);

	return (
		<Box padding="space.400">
			<Grid gap="space.400" templateColumns="1fr 300px">
				<Stack space="space.100">
					<JsonldEditor>
						{({
							ari,
							initialJson,
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
							<React.Fragment>
								<TemplateRenderer
									template={template}
									ari={ari}
									json={json}
									onError={onUrlError}
									onResolve={onUrlResolve}
									url={url}
								/>
								<EditLink
									initialJson={initialJson}
									jsonError={jsonError}
									onJsonChange={onJsonChange}
									onSubmitUrl={onSubmitUrl}
									onTextChange={onTextChange}
									template={template}
									text={text}
									urlError={urlError}
								/>
							</React.Fragment>
						)}
					</JsonldEditor>
				</Stack>
				<Box>
					<TemplateBuilder template={template} onChange={onChange} />
				</Box>
			</Grid>
		</Box>
	);
};
