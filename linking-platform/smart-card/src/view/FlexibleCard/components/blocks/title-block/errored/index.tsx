/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { SmartLinkAlignment, SmartLinkDirection, SmartLinkSize } from '../../../../../../constants';
import { LinkIcon } from '../../../elements';
import { getLinkLineHeight, getLinkSizeStyles, getTruncateStyles } from '../../../utils';
import Block from '../../block';
import ElementGroup from '../../element-group';
import { type TitleBlockViewProps } from '../types';

const actionStyles: SerializedStyles = css({
	cursor: 'pointer',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover': {
		color: token('color.text.subtle', '#8993A4'),
		textDecoration: 'underline',
	},
});

const actionHoverStyles: SerializedStyles = css({
	position: 'relative',
	zIndex: 1,
	'&:focus': {
		outlineOffset: token('space.negative.025', '-2px'),
	},
});

const getMessageStyles = (size: SmartLinkSize, hasAction: boolean): SerializedStyles => {
	const sizeStyles = getLinkSizeStyles(size);
	return css(
		{
			flex: '1 1 auto',
			justifyContent: 'flex-end',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		hasAction ? actionStyles : '',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		sizeStyles,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		getTruncateStyles(1, getLinkLineHeight(size)),
		{
			color: token('color.text.disabled', '#6B778C'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			':focus': {
				outline: `${token('color.border.focused', '#388BFF')} solid 2px`,
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		hasAction ? actionHoverStyles : '',
	);
};

/**
 * Represents an Errored TitleBlock view.
 * This will render when a Smart Link did not successfully resolve.
 * This may be a result of a Smart Link not having the correct credentials,
 * or the backend response was errored or malformed.
 * @see TitleBlock
 */
const TitleBlockErroredView = ({
	actionGroup,
	retry,
	position,
	testId,
	title,
	icon,
	hideIcon,
	...blockProps
}: TitleBlockViewProps) => {
	const { descriptor, onClick, values } = retry || {};
	const { size = SmartLinkSize.Medium } = blockProps;
	const hasAction = onClick !== undefined;
	return (
		<Block {...blockProps} testId={`${testId}-errored-view`}>
			{!hideIcon && <LinkIcon overrideIcon={icon} position={position} />}
			{title}
			{descriptor && (
				<ElementGroup direction={SmartLinkDirection.Horizontal} align={SmartLinkAlignment.Right}>
					<Box
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						xcss={getMessageStyles(size, hasAction)}
						onClick={onClick}
						testId={`${testId}-errored-view-message`}
						tabIndex={hasAction ? 0 : -1}
					>
						<FormattedMessage {...descriptor} values={values} />
					</Box>
				</ElementGroup>
			)}
			{actionGroup}
		</Block>
	);
};

export default TitleBlockErroredView;
