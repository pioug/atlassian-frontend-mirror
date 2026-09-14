import React, { type ReactNode, useCallback } from 'react';

import { di } from 'react-magnetic-di';

import Link from '@atlaskit/link/link';

import { useEditorViewHasWarnings } from '../../../../hooks/use-editor-view-has-warnings';
import { useExternalMessages, useHydratedDeprecations, useIntl } from '../../../../state';
import { type ExternalWarning } from '../../../../state/types';
import { type HydratedDeprecatedField } from '../../../jql-editor/types';
import { FormatMessages } from '../format/FormatMessages';

import { messages } from './messages';

import { softDeprecateEpicParentDocsLink } from './index';

const getEpicLinkDeprecationTerm = (
	hydratedDeprecations: HydratedDeprecatedField[],
): string | null => {
	const epicLinkWarning = hydratedDeprecations.filter(
		(warning: HydratedDeprecatedField) =>
			warning.deprecatedSearcherKey === 'com.pyxis.greenhopper.jira:gh-epic-link-searcher',
	);

	return epicLinkWarning.length > 0 ? epicLinkWarning[0].id : null;
};

const getParentLinkDeprecationTerm = (
	hydratedDeprecations: HydratedDeprecatedField[],
): string | null => {
	const parentLinkWarning = hydratedDeprecations.filter(
		(warning: HydratedDeprecatedField) =>
			warning.deprecatedSearcherKey === 'com.atlassian.jpo:jpo-custom-field-parent-searcher',
	);

	return parentLinkWarning.length > 0 ? parentLinkWarning[0].id : null;
};

export const useFormattedWarningMessage = (): ReactNode => {
	di(useHydratedDeprecations, useExternalMessages, useEditorViewHasWarnings, useIntl);

	const [hydratedDeprecations] = useHydratedDeprecations();
	const [{ warnings: externalWarnings }] = useExternalMessages();
	const hasWarnings = useEditorViewHasWarnings();
	const [{ formatMessage }] = useIntl();

	const epicLinkDeprecationTerm = getEpicLinkDeprecationTerm(hydratedDeprecations);
	const parentLinkDeprecationTerm = getParentLinkDeprecationTerm(hydratedDeprecations);

	const formatWarnings = useCallback(
		(message: ReactNode): ReactNode => {
			const combinedMessages = [
				{ type: 'warning', message } as ExternalWarning,
				...externalWarnings,
			];
			return <FormatMessages messages={combinedMessages} />;
		},
		[externalWarnings],
	);

	if (!hasWarnings) {
		return null;
	} else if (!hydratedDeprecations.length && externalWarnings.length) {
		return <FormatMessages messages={externalWarnings} />;
	} else if (epicLinkDeprecationTerm == null && parentLinkDeprecationTerm == null) {
		return formatWarnings(
			formatMessage(messages.defaultWarning, {
				deprecatedField: hydratedDeprecations[0]?.id,
			}),
		);
	} else if (epicLinkDeprecationTerm && parentLinkDeprecationTerm) {
		return formatWarnings(
			formatMessage(messages.deprecatedBothParentReplacementMessage, {
				link: (chunks: React.ReactNode[]) => (
					<Link
						href={softDeprecateEpicParentDocsLink}
						target="_blank"
						rel="noopener noreferrer"
						onClick={(e) => e.stopPropagation()}
					>
						{chunks}
					</Link>
				),
				receivedFirst: epicLinkDeprecationTerm,
				receivedSecond: parentLinkDeprecationTerm,
				parentReplacement: 'Parent',
			}),
		);
	} else if (epicLinkDeprecationTerm || parentLinkDeprecationTerm) {
		return formatWarnings(
			formatMessage(messages.deprecatedParentReplacementMessage, {
				link: (chunks: React.ReactNode[]) => (
					<Link
						href={softDeprecateEpicParentDocsLink}
						target="_blank"
						rel="noopener noreferrer"
						onClick={(e) => e.stopPropagation()}
					>
						{chunks}
					</Link>
				),
				deprecatedField: epicLinkDeprecationTerm
					? epicLinkDeprecationTerm
					: parentLinkDeprecationTerm,
				parentReplacement: 'Parent',
			}),
		);
	}
};
