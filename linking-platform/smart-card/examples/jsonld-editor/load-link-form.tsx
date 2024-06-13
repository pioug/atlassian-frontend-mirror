/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useCallback, useMemo } from 'react';
import Button from '@atlaskit/button/new';
import Form, { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const labelHelpMessageStyles = css({
	fontWeight: 'normal',
	fontSize: '0.9em',
	verticalAlign: 'text-top',
});

const textFieldStyles = css({
	alignContent: 'stretch',
	alignItems: 'center',
	display: 'flex',
	gap: '1rem',
});

const tooltipStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	a: {
		color: token('color.background.accent.blue.subtle', '#579DFF'),
		'&:active': {
			color: token('color.text.information', '#85B8FF'),
		},
		'&:hover': {
			color: token('color.background.accent.blue.subtle', '#579DFF'),
		},
	},
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

const LoadLinkForm: React.FC<{
	error?: string;
	onSubmit: (url: string, ari?: string, branchDeploy?: string) => void;
	branchDeploy?: string;
}> = ({ error: urlError, onSubmit, branchDeploy }) => {
	const handleSubmit = useCallback(
		(formState: { url: string; ari: string; branchDeploy: string }) => {
			onSubmit(formState.url, formState.ari, formState.branchDeploy);
		},
		[onSubmit],
	);

	const helpMessageUrl = useMemo(
		() => (
			<Tooltip
				content={
					<div css={tooltipStyles}>
						<p>
							We know it's not a usual "log in" but we need to acquire ASAP-signed JWT token through
							a micros static server for our Atlaskit examples.{' '}
							<a
								href="https://product-fabric.atlassian.net/wiki/spaces/MEX/pages/3057025945"
								target="_blank"
							>
								Read more about that here.
							</a>
						</p>
						<p>
							For Atlassian product links such as Confluence or Jira, please use staging links such
							as pug or jdog. Production links including hello and product fabric will not resolve
							on staging environment.
						</p>
					</div>
				}
			>
				{(tooltipProps) => (
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
					<div css={tooltipStyles}>
						<p>
							Third-party Smart Links are typically installed on{' '}
							<a
								href="https://developer.atlassian.com/platform/atlassian-resource-identifier/resource-owners/registry/"
								target="_blank"
							>
								ARIs
							</a>
							.
						</p>
						<p>
							To load link from a specific ARI, please enter the ARI in following format;
							ari:cloud:confluence::site/your-site-id
						</p>
						<p>
							Your site ID can be found by navigating to the{' '}
							<a href="https://pug.jira-dev.com/_edge/tenant_info" target="_blank">
								instance with the installed resolver
							</a>{' '}
							and appending "/_edge/tenant_info" to the domain.
						</p>
					</div>
				}
				tag="span"
			>
				{(tooltipProps) => (
					<span {...tooltipProps}>
						ARI <span css={labelHelpMessageStyles}>(?)</span>
					</span>
				)}
			</Tooltip>
		),
		[],
	);

	return (
		<Form onSubmit={handleSubmit}>
			{({ formProps }) => (
				<form {...formProps} name="load-link">
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
								<div css={textFieldStyles}>
									<Textfield {...fieldProps} />
								</div>
								{error === 'INCORRECT_URL_FORMAT' && (
									<ErrorMessage>Please enter a valid url.</ErrorMessage>
								)}
								{!dirtySinceLastSubmit && urlError && <ErrorMessage>{urlError}</ErrorMessage>}
							</React.Fragment>
						)}
					</Field>
					<Field label={ariLabel} name="ari" validate={validateAri} defaultValue="">
						{({ fieldProps, error }: any) => (
							<React.Fragment>
								<div css={textFieldStyles}>
									<Textfield {...fieldProps} />
								</div>
								{error === 'INCORRECT_ARI_FORMAT' && (
									<ErrorMessage>Please enter a valid ARI.</ErrorMessage>
								)}
							</React.Fragment>
						)}
					</Field>
					<Field
						label="Branch Deploy"
						name="branchDeploy"
						validate={validateBranchDeploy}
						defaultValue={branchDeploy}
					>
						{({ fieldProps, error }: any) => (
							<React.Fragment>
								<div css={textFieldStyles}>
									<Textfield {...fieldProps} />
								</div>
								{error === 'INCORRECT_BRANCH_DEPLOY_FORMAT' && (
									<ErrorMessage>Please enter a valid Branch Deploy</ErrorMessage>
								)}
							</React.Fragment>
						)}
					</Field>
					<HelperMessage>{helpMessageUrl}</HelperMessage>
					<p></p>
					<Button type="submit" appearance="primary">
						Load URL
					</Button>
				</form>
			)}
		</Form>
	);
};

export default LoadLinkForm;
