import React, { ReactNode, useCallback } from 'react';

import { di } from 'react-magnetic-di';

import { HelperMessage } from '@atlaskit/form';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useEditorViewHasWarnings } from '../../../../hooks/use-editor-view-has-warnings';
import {
  useExternalMessages,
  useHydratedDeprecations,
  useIntl,
} from '../../../../state';
import { ExternalWarning } from '../../../../state/types';
import { HydratedDeprecatedField } from '../../../jql-editor/types';
import { FormatMessages, MessageContainer } from '../format';

import { messages } from './messages';

const softDeprecateEpicParentDocsLink =
  'https://support.atlassian.com/jira-software-cloud/docs/upcoming-changes-epic-link-replaced-with-parent/';

const getEpicLinkDeprecationTerm = (
  hydratedDeprecations: HydratedDeprecatedField[],
): string | null => {
  const epicLinkWarning = hydratedDeprecations.filter(
    (warning: HydratedDeprecatedField) =>
      warning.deprecatedSearcherKey ===
      'com.pyxis.greenhopper.jira:gh-epic-link-searcher',
  );

  return epicLinkWarning.length > 0 ? epicLinkWarning[0].id : null;
};

const getParentLinkDeprecationTerm = (
  hydratedDeprecations: HydratedDeprecatedField[],
): string | null => {
  const parentLinkWarning = hydratedDeprecations.filter(
    (warning: HydratedDeprecatedField) =>
      warning.deprecatedSearcherKey ===
      'com.atlassian.jpo:jpo-custom-field-parent-searcher',
  );

  return parentLinkWarning.length > 0 ? parentLinkWarning[0].id : null;
};

export const useFormattedWarningMessage = (): ReactNode => {
  di(
    useHydratedDeprecations,
    useExternalMessages,
    useEditorViewHasWarnings,
    useIntl,
  );

  const [hydratedDeprecations] = useHydratedDeprecations();
  const [{ warnings: externalWarnings }] = useExternalMessages();
  const hasWarnings = useEditorViewHasWarnings();
  const [{ formatMessage }] = useIntl();

  const epicLinkDeprecationTerm =
    getEpicLinkDeprecationTerm(hydratedDeprecations);
  const parentLinkDeprecationTerm =
    getParentLinkDeprecationTerm(hydratedDeprecations);

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
  } else if (
    epicLinkDeprecationTerm == null &&
    parentLinkDeprecationTerm == null
  ) {
    return formatWarnings(
      formatMessage(messages.defaultWarning, {
        deprecatedField: hydratedDeprecations[0]?.id,
      }),
    );
  } else if (epicLinkDeprecationTerm && parentLinkDeprecationTerm) {
    return formatWarnings(
      formatMessage(messages.deprecatedBothParentReplacementMessage, {
        link: (chunks: React.ReactNode[]) => (
          <a
            href={softDeprecateEpicParentDocsLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            {chunks}
          </a>
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
          <a
            href={softDeprecateEpicParentDocsLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            {chunks}
          </a>
        ),
        deprecatedField: epicLinkDeprecationTerm
          ? epicLinkDeprecationTerm
          : parentLinkDeprecationTerm,
        parentReplacement: 'Parent',
      }),
    );
  }
};

export const WarningMessages = () => {
  di(useFormattedWarningMessage);

  const warningMessage = useFormattedWarningMessage();

  return warningMessage != null ? (
    <MessageContainer>
      <HelperMessage testId="jql-editor-warning-message">
        <WarningIcon
          label=""
          primaryColor={token('color.icon.warning', colors.Y400)}
          size="small"
        />
        {warningMessage}
      </HelperMessage>
    </MessageContainer>
  ) : null;
};
