import React, { Fragment } from 'react';

import { useIntl } from 'react-intl-next';

import type { ExtensionManifest } from '@atlaskit/editor-common/extensions';
import { configPanelMessages as messages } from '@atlaskit/editor-common/extensions';
import { Box, Text, xcss } from '@atlaskit/primitives';

import { HelpLink } from './HelpLink';

const descriptionStyles = xcss({
	marginBottom: 'space.300',
});

const helpLinkStyles = xcss({
	paddingTop: 'space.150',
});

type DescriptionSummaryProps = {
	extensionManifest: ExtensionManifest;
};

export function DescriptionSummary({ extensionManifest }: DescriptionSummaryProps) {
	const { formatMessage } = useIntl();
	const { description, deprecation, documentationUrl } = extensionManifest;
	// Use a temporary allowlist of top 3 macros to test out a new "Documentation" CTA ("Need help?")
	// This will be removed when Top 5 Modernized Macros updates are rolled out
	const modernizedMacrosList = ['children', 'recently-updated', 'excerpt'];
	const enableHelpCTA = modernizedMacrosList.includes(extensionManifest.key);

	return (
		<Fragment>
			{(description || documentationUrl) && (
				<Box xcss={descriptionStyles}>
					<Text as="p" testId="config-panel-header-description">
						{description && (
							<Fragment>
								{
									// Ignored via go/ees005
									// eslint-disable-next-line require-unicode-regexp
									description.replace(/([^.])$/, '$1.')
								}{' '}
							</Fragment>
						)}
						{deprecation?.isDeprecated && deprecation?.message && (
							<Box paddingBlockStart="space.150">{deprecation.message}</Box>
						)}
						{documentationUrl &&
							(enableHelpCTA ? (
								<Box xcss={helpLinkStyles}>
									<Text as="p">
										<HelpLink
											documentationUrl={documentationUrl}
											label={formatMessage(messages.help)}
										/>
									</Text>
								</Box>
							) : (
								<HelpLink
									documentationUrl={documentationUrl}
									label={formatMessage(messages.documentation)}
								/>
							))}
					</Text>
				</Box>
			)}
		</Fragment>
	);
}
