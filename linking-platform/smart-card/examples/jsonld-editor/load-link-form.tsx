import React, { useCallback, useMemo, useState } from 'react';

import Button from '@atlaskit/button/new';
import Form, { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import type { EnvironmentsKeys } from '@atlaskit/linking-common';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Anchor, Box, Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import Tooltip from '@atlaskit/tooltip';

const PROD_URLS = ['https://hello.atlassian.net', 'https://product-fabric.atlassian.net'];

const tooltipAnchorStyles = xcss({
	color: 'color.text.inverse',
});
const urlPattern = new RegExp(
	'^(https?:\\/\\/)?' + // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
		'(\\#[-a-z\\d_]*)?$',
	'i',
); // fragment locator
const validateUrl = (str: unknown) => {
	if (!urlPattern.test(str as string)) {
		return 'INCORRECT_URL_FORMAT';
	}
};

const ariPattern = new RegExp('^ari:cloud:.+$');
const validateAri = (str: unknown) => {
	if (str && !ariPattern.test(str as string)) {
		return 'INCORRECT_ARI_FORMAT';
	}
};

const validateBranchDeploy = (str: unknown) => {
	if (str && !['jira-object-provider.stg-west'].includes(str as string)) {
		return 'INCORRECT_BRANCH_DEPLOY_FORMAT';
	}
};

const LoadLinkForm = ({
	error: urlError,
	onSubmit,
	branchDeploy,
}: {
	branchDeploy?: string;
	error?: string;
	onSubmit: (url: string, ari?: string, branchDeploy?: string, envKey?: EnvironmentsKeys) => void;
}) => {
	const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

	const handleSubmit = useCallback(
		(formState: { ari: string; branchDeploy: string; url: string }) => {
			const envKey = PROD_URLS.some((prodUrl) => formState.url.startsWith(prodUrl))
				? 'production'
				: 'staging';
			onSubmit(formState.url, formState.ari, formState.branchDeploy, envKey);
		},
		[onSubmit],
	);

	const helpMessageUrl = useMemo(
		() => (
			<Tooltip
				content={
					<Box padding="space.075">
						<Box>
							We know it's not a usual "log in" but we need to acquire ASAP-signed JWT token through
							a micros static server for our Atlaskit examples.{' '}
							<Anchor
								href="https://product-fabric.atlassian.net/wiki/spaces/MEX/pages/3057025945"
								target="_blank"
								xcss={tooltipAnchorStyles}
							>
								Read more about that here.
							</Anchor>
						</Box>
						<Box>
							For Atlassian product links such as Confluence or Jira, please use staging links such
							as pug or jdog. Production links including hello and product fabric will not resolve
							on staging environment.
						</Box>
					</Box>
				}
			>
				{(tooltipProps) => (
					// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
					<a href="https://pug.jira-dev.com" target="_blank" {...tooltipProps}>
						To load link, please log in to staging environment (required VPN).
					</a>
				)}
			</Tooltip>
		),
		[],
	);

	const ariLabel = useMemo(
		() => (
			<Tooltip
				content={
					<Box padding="space.075">
						<Box>
							Third-party Smart Links are typically installed on{' '}
							<Anchor
								href="https://developer.atlassian.com/platform/atlassian-resource-identifier/resource-owners/registry/"
								target="_blank"
								xcss={tooltipAnchorStyles}
							>
								ARIs
							</Anchor>
							.
						</Box>
						<Box>
							To load link from a specific ARI, please enter the ARI in following format;
							ari:cloud:confluence::site/your-site-id
						</Box>
						<Box>
							Your site ID can be found by navigating to the{' '}
							<Anchor
								href="https://pug.jira-dev.com/_edge/tenant_info"
								target="_blank"
								xcss={tooltipAnchorStyles}
							>
								instance with the installed resolver
							</Anchor>{' '}
							and appending "/_edge/tenant_info" to the domain.
						</Box>
					</Box>
				}
				tag="span"
			>
				{(tooltipProps) => (
					<Box {...tooltipProps}>
						<Inline alignBlock="center" space="space.025">
							<Box>ARI</Box> <Text size="small">(?)</Text>
						</Inline>
					</Box>
				)}
			</Tooltip>
		),
		[],
	);

	return (
		<Form onSubmit={handleSubmit}>
			{({ formProps }) => (
				<form {...formProps} name="load-link">
					<Stack>
						<Field
							aria-required={true}
							defaultValue=""
							label="URL"
							isRequired
							name="url"
							validate={validateUrl}
						>
							{({ fieldProps, error, meta: { dirtySinceLastSubmit } }: any) => (
								<React.Fragment>
									<Textfield {...fieldProps} />
									{error === 'INCORRECT_URL_FORMAT' && (
										<ErrorMessage>Please enter a valid url.</ErrorMessage>
									)}
									{!dirtySinceLastSubmit && urlError && <ErrorMessage>{urlError}</ErrorMessage>}
								</React.Fragment>
							)}
						</Field>
						{showAdvancedOptions && (
							<React.Fragment>
								<Field label={ariLabel} name="ari" validate={validateAri} defaultValue="">
									{({ fieldProps, error }: any) => (
										<React.Fragment>
											<Textfield {...fieldProps} />
											{error === 'INCORRECT_ARI_FORMAT' && (
												<ErrorMessage>Please enter a valid ARI.</ErrorMessage>
											)}
										</React.Fragment>
									)}
								</Field>
								<Field
									label="Branch deploy"
									name="branchDeploy"
									validate={validateBranchDeploy}
									defaultValue={branchDeploy}
								>
									{({ fieldProps, error }: any) => (
										<React.Fragment>
											<Textfield {...fieldProps} />
											{error === 'INCORRECT_BRANCH_DEPLOY_FORMAT' && (
												<ErrorMessage>Please enter a valid Branch Deploy</ErrorMessage>
											)}
										</React.Fragment>
									)}
								</Field>
							</React.Fragment>
						)}
						<HelperMessage>{helpMessageUrl}</HelperMessage>
						<Box paddingBlockStart="space.100">
							<Inline space="space.100">
								<Button type="submit" appearance="primary">
									Load URL
								</Button>
								<Button onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
									Advanced
								</Button>
							</Inline>
						</Box>
					</Stack>
				</form>
			)}
		</Form>
	);
};

export default LoadLinkForm;
