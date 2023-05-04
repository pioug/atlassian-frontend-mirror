/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Fragment, useMemo, useCallback } from 'react';
import { FormattedMessage } from 'react-intl-next';

import { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

import type { FC } from 'react';
import type { LozengeActionErrorProps } from './types';
import { token } from '@atlaskit/tokens';
import { R50, R500 } from '@atlaskit/theme/colors';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import {
  dropdownItemGroupStyles,
  contentStyles,
  linkStyles,
  textStyles,
} from './styled';
import { getFormattedMessage } from '../../../utils';
import { messages } from '../../../../../../messages';
import { useFlexibleUiAnalyticsContext } from '../../../../../../state/flexible-ui-context';
import { openPreviewModal } from '../../../../../EmbedModal/utils';
import useResolve from '../../../../../../state/hooks/use-resolve';

const MAX_LINE_NUMBER = 8;

const LozengeActionError: FC<LozengeActionErrorProps> = ({
  errorMessage,
  testId,
  maxLineNumber = MAX_LINE_NUMBER,
  url,
  previewData,
}) => {
  const reload = useResolve();
  const analytics = useFlexibleUiAnalyticsContext();
  const isPreviewAvailable = previewData && previewData.src !== undefined;

  const handlePreviewClose = useCallback(() => {
    if (url) {
      reload(url, true);
    }
  }, [reload, url]);

  const handlePreviewOpen = useCallback(() => {
    if (isPreviewAvailable) {
      return openPreviewModal({
        ...previewData,
        analytics,
        onClose: handlePreviewClose,
      });
    }
  }, [analytics, handlePreviewClose, isPreviewAvailable, previewData]);

  const content = useMemo(() => {
    return (
      <Fragment>
        <div css={contentStyles}>
          <ErrorIcon
            testId={`${testId}-icon`}
            size="medium"
            primaryColor={token('color.icon.danger', R500)}
            secondaryColor={token('color.background.danger', R50)}
            label={'error'}
          />
          <span
            css={textStyles(maxLineNumber)}
            data-testid={`${testId}-error-message`}
          >
            {typeof errorMessage === 'string'
              ? errorMessage
              : getFormattedMessage(errorMessage)}
          </span>
        </div>
        {isPreviewAvailable ? (
          <div css={linkStyles}>
            <a
              target="_blank"
              data-testid={`${testId}-open-embed`}
              onClick={handlePreviewOpen}
            >
              <FormattedMessage {...messages.open_issue_in_jira} />
            </a>
          </div>
        ) : null}
      </Fragment>
    );
  }, [
    errorMessage,
    handlePreviewOpen,
    isPreviewAvailable,
    maxLineNumber,
    testId,
  ]);

  return (
    <span
      css={dropdownItemGroupStyles}
      data-testid={`${testId}-error-item-group`}
    >
      <DropdownItemGroup>
        <DropdownItem testId={`${testId}-error`}>{content}</DropdownItem>
      </DropdownItemGroup>
    </span>
  );
};

export default LozengeActionError;
