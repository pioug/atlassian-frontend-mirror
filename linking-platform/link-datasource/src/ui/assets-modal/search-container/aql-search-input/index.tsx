/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

import { css, cssMap, jsx, styled } from '@compiled/react';
import { useIntl } from 'react-intl';

import { IconButton } from '@atlaskit/button/new';
import { ErrorMessage, Field } from '@atlaskit/form';
import CrossCircleIcon from '@atlaskit/icon/core/cross-circle';
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle';
import SearchIcon from '@atlaskit/icon/core/search';
import CheckCircleIcon from '@atlaskit/icon/core/status-success';
import { Box } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { type AqlValidationResult, useValidateAqlText } from '../../../../hooks/useValidateAqlText';
import { aqlKey } from '../../../../types/assets/types';

import { searchInputMessages } from './messages';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const FieldContainer = styled.div({
	flex: 1,
	marginTop: token('space.negative.100'),
});

const buttonBaseStyles = css({
	display: 'flex',
	height: '100%',
	position: 'relative',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
	marginRight: token('space.100'),
});

const AQLSupportDocumentLink =
	'https://support.atlassian.com/jira-service-management-cloud/docs/use-assets-query-language-aql/';
export interface AqlSearchInputProps {
	isSearching: boolean;
	testId?: string;
	value: string;
	workspaceId: string;
}

const styles = cssMap({
	searchButtonContainer: { marginRight: token('space.075') },
});

const renderValidatorIcon = (lastValidationResult: AqlValidationResult) => {
	if (lastValidationResult.type === 'loading') {
		return <Spinner size="medium" testId="assets-datasource-modal--aql-validating" />;
	}
	if (lastValidationResult.type === 'invalid') {
		return (
			<CrossCircleIcon
				label="label"
				color={token('color.icon.danger')}
				testId="assets-datasource-modal--aql-invalid"
				spacing="spacious"
			/>
		);
	}
	if (lastValidationResult.type === 'valid') {
		return (
			<CheckCircleIcon
				label="label"
				color={token('color.icon.success')}
				testId="assets-datasource-modal--aql-valid"
				spacing="spacious"
			/>
		);
	}
	return (
		<SearchIcon
			label="label"
			testId="assets-datasource-modal--aql-idle"
			color="currentColor"
			spacing="spacious"
		/>
	);
};

export const AqlSearchInput = ({
	value,
	workspaceId,
	testId = 'assets-datasource-modal--aql-search-input',
	isSearching,
}: AqlSearchInputProps): JSX.Element => {
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
									style={{ paddingLeft: token('space.075'), width: 24, display: 'flex' }}
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
										{/* eslint-disable-next-line @atlaskit/design-system/no-html-anchor */}
										<a href={AQLSupportDocumentLink} target="_blank" css={buttonBaseStyles}>
											<QuestionCircleIcon
												label="label"
												color={token('color.icon')}
												testId="assets-datasource-modal-help"
												spacing="spacious"
											/>
										</a>
									</Tooltip>

									<Box xcss={styles.searchButtonContainer}>
										<IconButton
											appearance="primary"
											isLoading={isSearching}
											icon={(iconProps) => (
												<SearchIcon {...iconProps} spacing="spacious" color="currentColor" />
											)}
											spacing="compact"
											type="submit"
											label={formatMessage(searchInputMessages.placeholder)}
											isDisabled={lastValidationResult.type !== 'valid'}
											testId="assets-datasource-modal--aql-search-button"
										/>
									</Box>
								</Fragment>
							}
							placeholder={formatMessage(searchInputMessages.placeholder)}
							testId={testId}
							aria-label={formatMessage(searchInputMessages.placeholder)}
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
