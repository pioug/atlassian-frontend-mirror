import React, { type PropsWithChildren, useCallback, useMemo } from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { type EnvironmentsKeys, SmartCardProvider } from '@atlaskit/link-provider';

import JsonldEditorClient from './jsonld-editor-client';

type Props = PropsWithChildren<{
	ari?: string;
	branchDeploy?: string;
	envKey?: EnvironmentsKeys;
	json?: JsonLd.Response;
	onError?: (error: Error) => void;
	onFetch?: () => JsonLd.Response | undefined;
	onResolve?: (json: JsonLd.Response) => void;
	url: string;
}>;

const JsonldEditorProvider = ({
	ari,
	branchDeploy,
	children,
	envKey = 'staging',
	onError,
	onFetch,
	onResolve,
}: Props) => {
	// This will cause Provider to rerender which is not a normal use case for
	// smart links. We are hacking it so that we can force using json from
	// jsonld editor.
	const client = useMemo(
		() => new JsonldEditorClient(envKey, onFetch, onResolve, onError, ari, branchDeploy),
		[ari, branchDeploy, envKey, onError, onFetch, onResolve],
	);

	return (
		<SmartCardProvider
			client={client}
			isAdminHubAIEnabled={true}
			product="CONFLUENCE"
			rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: false }}
		>
			{children}
		</SmartCardProvider>
	);
};

const withJsonldEditorProvider =
	<P extends object>(Component: React.ComponentType<P>) =>
	(props: P & Props): React.JSX.Element => {
		const { ari, branchDeploy, envKey, json, onError, onResolve, url } = props;
		const onFetch = useCallback(() => json, [json]);

		return (
			<JsonldEditorProvider
				ari={ari}
				branchDeploy={branchDeploy}
				envKey={envKey}
				onError={onError}
				onFetch={onFetch}
				onResolve={onResolve}
				url={url}
			>
				<Component {...props} />
			</JsonldEditorProvider>
		);
	};

export default withJsonldEditorProvider;
