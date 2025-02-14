/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

import { css, jsx, styled } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import { LoadingButton } from '@atlaskit/button';
import { ErrorMessage, Field } from '@atlaskit/form';
import CrossCircleIcon from '@atlaskit/icon/core/migration/cross-circle';
import QuestionCircleIcon from '@atlaskit/icon/core/migration/question-circle';
import SearchIcon from '@atlaskit/icon/core/migration/search--editor-search';
import CheckCircleIcon from '@atlaskit/icon/core/migration/success--check-circle';
import { fg } from '@atlaskit/platform-feature-flags';
import Spinner from '@atlaskit/spinner';
import Textfield from '@atlaskit/textfield';
import { G300, N500, R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { type AqlValidationResult, useValidateAqlText } from '../../../../hooks/useValidateAqlText';
import { aqlKey } from '../../../../types/assets/types';

import { AqlSearchInputOld } from './aql-search-input-old';
import { searchInputMessages } from './messages';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const FieldContainer = styled.div({
	flex: 1,
	marginTop: token('space.negative.100', '-8px'),
});

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
		return <Spinner size="medium" testId="assets-datasource-modal--aql-validating" />;
	}
	if (lastValidationResult.type === 'invalid') {
		return (
			<CrossCircleIcon
				label="label"
				color={token('color.icon.danger', R400)}
				LEGACY_size="medium"
				testId="assets-datasource-modal--aql-invalid"
				spacing="spacious"
			/>
		);
	}
	if (lastValidationResult.type === 'valid') {
		return (
			<CheckCircleIcon
				label="label"
				color={token('color.icon.success', G300)}
				LEGACY_size="medium"
				testId="assets-datasource-modal--aql-valid"
				spacing="spacious"
			/>
		);
	}
	return (
		<SearchIcon
			label="label"
			LEGACY_size="medium"
			testId="assets-datasource-modal--aql-idle"
			color="currentColor"
			spacing="spacious"
		/>
	);
};

export const AqlSearchInputNew = ({
	value,
	workspaceId,
	testId = 'assets-datasource-modal--aql-search-input',
	isSearching,
}: AqlSearchInputProps) => {
	const { formatMessage } = useIntl();

	const { debouncedValidation, lastValidationResult } = useValidateAqlText(workspaceId, value);

	return (
		<FieldContainer>
			<Field name={aqlKey} defaultValue={value} validate={debouncedValidation}>
				{({ fieldProps }) => (
					<Fragment>
						<Textfield
							{...fieldProps}
							elemBeforeInput={
								<span
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
									style={{ paddingLeft: token('space.075', '6px'), width: 24, display: 'flex' }}
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
										<a href={AQLSupportDocumentLink} target="_blank" css={buttonBaseStyles}>
											<QuestionCircleIcon
												label="label"
												color={token('color.icon', N500)}
												LEGACY_size="medium"
												testId="assets-datasource-modal-help"
												spacing="spacious"
											/>
										</a>
									</Tooltip>
									<LoadingButton
										appearance="primary"
										css={searchButtonStyles}
										iconBefore={
											<SearchIcon
												label={formatMessage(searchInputMessages.placeholder)}
												LEGACY_size="medium"
												color="currentColor"
												spacing="spacious"
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
						{lastValidationResult.type === 'invalid' && lastValidationResult.error && (
							<ErrorMessage>{lastValidationResult.error}</ErrorMessage>
						)}
					</Fragment>
				)}
			</Field>
		</FieldContainer>
	);
};

export const AqlSearchInput = (props: AqlSearchInputProps) => {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <AqlSearchInputNew {...props} />;
	} else {
		return <AqlSearchInputOld {...props} />;
	}
};
