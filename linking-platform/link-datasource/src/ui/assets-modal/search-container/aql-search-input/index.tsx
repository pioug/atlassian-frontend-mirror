/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { LoadingButton } from '@atlaskit/button';
import { ErrorMessage, Field } from '@atlaskit/form';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import SearchIcon from '@atlaskit/icon/glyph/editor/search';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import Spinner from '@atlaskit/spinner';
import Textfield from '@atlaskit/textfield';
import { G300, N500, R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import {
  AqlValidationResult,
  useValidateAqlText,
} from '../../../../hooks/useValidateAqlText';
import { aqlKey } from '../../../../types/assets/types';
import { FieldContainer } from '../styled';

import { searchInputMessages } from './messages';

const buttonBaseStyles = css({
  display: 'flex',
  height: '100%',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  marginRight: token('space.100', '0.5em'),
});

const AQLSupportDocumentLink =
  'https://support.atlassian.com/jira-service-management-cloud/docs/use-assets-query-language-aql/';
export interface AqlSearchInputProps {
  value: string;
  workspaceId: string;
  testId?: string;
  isSearching: boolean;
}

const searchButtonStyles = css({
  marginRight: token('space.075', '6px'),
});

const renderValidatorIcon = (lastValidationResult: AqlValidationResult) => {
  if (lastValidationResult.type === 'loading') {
    return (
      <Spinner size="medium" testId="assets-datasource-modal--aql-validating" />
    );
  }
  if (lastValidationResult.type === 'invalid') {
    return (
      <CrossCircleIcon
        label="label"
        primaryColor={token('color.icon.danger', R400)}
        size="medium"
        testId="assets-datasource-modal--aql-invalid"
      />
    );
  }
  if (lastValidationResult.type === 'valid') {
    return (
      <CheckCircleIcon
        label="label"
        primaryColor={token('color.icon.success', G300)}
        size="medium"
        testId="assets-datasource-modal--aql-valid"
      />
    );
  }
  return (
    <SearchIcon
      label="label"
      size="medium"
      testId="assets-datasource-modal--aql-idle"
    />
  );
};

export const AqlSearchInput = ({
  value,
  workspaceId,
  testId = 'assets-datasource-modal--aql-search-input',
  isSearching,
}: AqlSearchInputProps) => {
  const { formatMessage } = useIntl();

  const { debouncedValidation, lastValidationResult } = useValidateAqlText(
    workspaceId,
    value,
  );

  return (
    <FieldContainer>
      <Field name={aqlKey} defaultValue={value} validate={debouncedValidation}>
        {({ fieldProps }) => (
          <Fragment>
            <Textfield
              {...fieldProps}
              elemBeforeInput={
                <span
                  style={{ paddingLeft: token('space.075', '6px'), width: 24 }}
                >
                  {renderValidatorIcon(lastValidationResult)}
                </span>
              }
              elemAfterInput={
                <Fragment>
                  <Tooltip
                    content={formatMessage(searchInputMessages.helpTooltipText)}
                    position="bottom"
                  >
                    <a
                      href={AQLSupportDocumentLink}
                      target="_blank"
                      css={buttonBaseStyles}
                    >
                      <QuestionCircleIcon
                        label="label"
                        primaryColor={token('color.icon', N500)}
                        size="medium"
                        testId="assets-datasource-modal-help"
                      />
                    </a>
                  </Tooltip>
                  <LoadingButton
                    appearance="primary"
                    css={searchButtonStyles}
                    iconBefore={
                      <SearchIcon
                        label={formatMessage(searchInputMessages.placeholder)}
                        size="medium"
                      />
                    }
                    isLoading={isSearching}
                    spacing="none"
                    testId="assets-datasource-modal--aql-search-button"
                    type="submit"
                    isDisabled={lastValidationResult.type !== 'valid'}
                  />
                </Fragment>
              }
              placeholder={formatMessage(searchInputMessages.placeholder)}
              testId={testId}
            />
            {lastValidationResult.type === 'invalid' &&
              lastValidationResult.error && (
                <ErrorMessage>{lastValidationResult.error}</ErrorMessage>
              )}
          </Fragment>
        )}
      </Field>
    </FieldContainer>
  );
};
