/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import { type CustomThemeButtonProps } from '@atlaskit/button/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import IntegrationButtonNext from './IntegrationButtonNext';

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
const integrationButtonCopyWrapperStyle = css`
	display: flex;
	justify-content: left;
`;

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
const integrationIconWrapperStyle = css`
	margin: ${token('space.025', '2px')} ${token('space.100', '8px')} ${token('space.0', '0px')}
		${token('space.0', '0px')};
`;

type Props = CustomThemeButtonProps & {
	IntegrationIcon: React.ComponentType;
	text: React.ReactNode;
	textColor?: string;
};

const IntegrationButtonInner: React.FC<Props> = (props) => {
	const { text, textColor, IntegrationIcon, ...restProps } = props;
	return (
		// TODO: (from codemod) CustomThemeButton will be deprecated. Please consider migrating to Pressable or Anchor Primitives with custom styles.
		<Button {...restProps}>
			<span
				css={integrationButtonCopyWrapperStyle}
				style={{ color: textColor || token('color.text', N500) }}
			>
				<span css={integrationIconWrapperStyle}>
					<IntegrationIcon />
				</span>
				<span>{text}</span>
			</span>
		</Button>
	);
};

const IntegrationButton: React.FC<Props> = (props) =>
	fg('share-compiled-migration') ? (
		<IntegrationButtonNext
			text={props.text}
			onClick={props.onClick}
			IntegrationIcon={props.IntegrationIcon}
		/>
	) : (
		<IntegrationButtonInner {...props} />
	);

IntegrationButton.displayName = 'IntegrationButton';

export default IntegrationButton;
