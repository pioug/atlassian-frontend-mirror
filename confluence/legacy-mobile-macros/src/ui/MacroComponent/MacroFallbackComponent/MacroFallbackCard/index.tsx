import React from 'react';

import styled from 'styled-components';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { macroIcon } from './MacroIcon';
import { type MacroCardType } from './types';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Card = styled.span({
	display: 'flex',
	height: 'initial',
	whiteSpace: 'normal',
	textAlign: 'left',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Content = styled.span({
	flex: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ContentWrapper = styled.span({
	flex: 1,
	paddingLeft: token('space.100', '8px'),
	display: 'flex',
	justifyContent: 'space-between',
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Error = styled.span({
	flexBasis: '100%',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingTop: '10px',
	display: 'flex',
	flexWrap: 'wrap',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ErrorMessage = styled.span({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text.subtlest', colors.N90),
	paddingLeft: token('space.050', '4px'),
	marginTop: token('space.negative.050', '-4px'),
	wordBreak: 'break-word',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const SecondaryAction = styled.span({
	flexBasis: '100%',
	paddingLeft: token('space.150', '12px'),
	marginTop: token('space.negative.100', '-8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Icon = styled.span({
	alignItems: 'center',
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> img': {
		paddingLeft: token('space.050', '4px'),
		paddingRight: token('space.050', '4px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const CardBody = styled.span({
	flex: 1,
	flexWrap: 'wrap',
	marginTop: token('space.050', '4px'),
	marginBottom: token('space.050', '4px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ErrorContent = styled.span({
	display: 'flex',
});

export const MacroFallbackCard = ({
	macroName,
	iconUrl,
	action,
	errorMessage,
	extensionKey,
	loading,
	secondaryAction,
}: MacroCardType) => (
	<Card>
		<Icon>{macroIcon(iconUrl, extensionKey, macroName)}</Icon>
		<CardBody>
			<ContentWrapper>
				<Content>{macroName}</Content>
				{action}
			</ContentWrapper>
			{errorMessage && !loading && (
				<Error>
					<ErrorContent>
						<ErrorIcon
							primaryColor={token('color.icon.danger', colors.R300)}
							size="medium"
							label={errorMessage}
						/>
						<ErrorMessage>{errorMessage}</ErrorMessage>
					</ErrorContent>
					<SecondaryAction>{secondaryAction}</SecondaryAction>
				</Error>
			)}
		</CardBody>
	</Card>
);
