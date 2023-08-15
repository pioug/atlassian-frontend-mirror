/** @jsx jsx */
import { Fragment, useCallback, useRef } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { LoadingButton } from '@atlaskit/button';
import { Field } from '@atlaskit/form';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import SearchIcon from '@atlaskit/icon/glyph/editor/search';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import Spinner from '@atlaskit/spinner';
import Textfield from '@atlaskit/textfield';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { useValidateAqlText } from '../../../../hooks/useValidateAqlText';
import { aqlKey } from '../../../../types/assets/types';
import { FieldContainer } from '../styled';

import { searchInputMessages } from './messages';

/* Meta isn't exported in @atlaskit/form
Taken from packages/design-system/form/src/field.tsx */
interface Meta {
  dirty: boolean;
  dirtySinceLastSubmit: boolean;
  submitFailed: boolean;
  submitting: boolean;
  touched: boolean;
  valid: boolean;
  error?: string;
  submitError?: boolean;
  validating?: boolean;
}

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

export const SEARCH_DEBOUNCE_MS = 350;

const renderValidatorIcon = (
  value: string | undefined,
  error: string | undefined,
  meta: Meta,
) => {
  if (value && meta?.validating) {
    return (
      <Spinner size="medium" testId="assets-datasource-modal--aql-validating" />
    );
  }
  if (value && error) {
    return (
      <CrossCircleIcon
        label="label"
        primaryColor="red"
        size="medium"
        testId="assets-datasource-modal--aql-invalid"
      />
    );
  }
  if (value && meta.valid) {
    return (
      <CheckCircleIcon
        label="label"
        primaryColor="green"
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
  const timeout = useRef<Function>();
  const lastValue = useRef<string | undefined>(value);
  const lastResult = useRef<Promise<string | undefined>>(
    Promise.resolve(undefined),
  );

  const { validateAqlText } = useValidateAqlText(workspaceId);

  // Validation expects undefined when valid and a string as an error message when invalid
  const handleValidation = useCallback(
    async (newUnvalidatedQlQuery: string | undefined) => {
      if (!newUnvalidatedQlQuery) {
        return undefined;
      }
      const isValid = await validateAqlText(newUnvalidatedQlQuery);
      return isValid ? undefined : 'invalid';
    },
    [validateAqlText],
  );

  /* Debounce async validation for input, validation is also called on every field change
  in a form so we need to also memoize. The async validate function is expected to either:
  Immediately return a promise (which is then collected into an array, every single time validation is run),
  or immediately return either undefined or an error message */
  const debouncedMemoizedValidation = (value: string | undefined) =>
    new Promise<string | undefined>(resolve => {
      if (timeout.current) {
        timeout.current();
      }
      if (value !== lastValue.current) {
        const timerId = setTimeout(() => {
          lastValue.current = value;
          lastResult.current = handleValidation(value);
          resolve(lastResult.current);
        }, SEARCH_DEBOUNCE_MS);
        timeout.current = () => {
          clearTimeout(timerId);
          resolve('debouncing');
        };
      } else {
        resolve(lastResult.current);
      }
    });

  return (
    <FieldContainer>
      <Field
        name={aqlKey}
        defaultValue={value}
        validate={debouncedMemoizedValidation}
      >
        {({ fieldProps, meta, error }) => (
          <Textfield
            {...fieldProps}
            elemBeforeInput={
              <span style={{ paddingLeft: 6, width: 24 }}>
                {renderValidatorIcon(fieldProps.value, error, meta)}
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
                  isDisabled={
                    fieldProps.value.trim() === '' ||
                    meta.validating ||
                    !meta.valid
                  }
                />
              </Fragment>
            }
            placeholder={formatMessage(searchInputMessages.placeholder)}
            testId={testId}
          />
        )}
      </Field>
    </FieldContainer>
  );
};
