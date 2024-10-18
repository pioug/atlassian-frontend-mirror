import { Box, Grid, xcss } from '@atlaskit/primitives';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import React from 'react';
import CardExample from './jsonld-editor/card-example';
import JsonldEditor from './jsonld-editor/jsonld-editor';
import JsonldEditorInput from './jsonld-editor/jsonld-editor-input';
import JsonldExample from './jsonld-editor/jsonld-example';
import LoadLinkForm from './jsonld-editor/load-link-form';

const tabPanelStyles = xcss({ width: '100%' });
const Example = () => {
	return (
		<JsonldEditor>
			{({
				ari,
				branchDeploy,
				envKey,
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
				<Box padding="space.400">
					<Grid gap="space.400" templateColumns="1fr 1fr">
						<CardExample
							ari={ari}
							branchDeploy={branchDeploy}
							envKey={envKey}
							isEmbedSupported={isEmbedSupported}
							json={json}
							onError={onUrlError}
							onResolve={onUrlResolve}
							url={url}
						/>
						<Box>
							<Tabs id="json-ld-editor">
								<TabList>
									<Tab>Load URL</Tab>
									<Tab>Load JSON-LD Examples</Tab>
								</TabList>
								<TabPanel>
									<Box xcss={tabPanelStyles}>
										<LoadLinkForm
											onSubmit={onSubmitUrl}
											error={urlError}
											branchDeploy={branchDeploy}
										/>
									</Box>
								</TabPanel>
								<TabPanel>
									<Box paddingBlock="space.100" xcss={tabPanelStyles}>
										<JsonldExample defaultValue={initialJson} onSelect={onJsonChange} />
									</Box>
								</TabPanel>
							</Tabs>
							<h6>JSON-LD Editor</h6>
							<Box paddingBlock="space.200">
								<JsonldEditorInput error={jsonError} onChange={onTextChange} value={text} />
							</Box>
						</Box>
					</Grid>
				</Box>
			)}
		</JsonldEditor>
	);
};

export default Example;
