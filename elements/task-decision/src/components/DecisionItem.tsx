/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import DecisionIcon from '@atlaskit/icon/core/decision';
import { token } from '@atlaskit/tokens';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { type Appearance, type ContentRef } from '../types';
import Item from './Item';
import { messages } from './i18n';

const iconStyles = css({
	flex: '0 0 16px',
	height: '16px',
	width: '16px',
	marginTop: token('space.050', '4px'),
	marginRight: token('space.150', '12px'),
	marginBottom: 0,
	marginLeft: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	color: token('color.icon.success'),
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const iconStylesWithPlaceholder = css({
	color: token('color.icon.subtle'),
});

export interface Props {
	appearance?: Appearance;
	children?: any;
	contentRef?: ContentRef;
	dataAttributes?: { [key: string]: string | number };
	placeholder?: string;
	showPlaceholder?: boolean;
}

const DecisionItem = ({
	appearance,
	children,
	contentRef,
	placeholder,
	showPlaceholder,
	dataAttributes,
}: Props) => {
	const { formatMessage } = useIntl();

	const icon = (
		<span contentEditable={false} css={[iconStyles, showPlaceholder && iconStylesWithPlaceholder]}>
			<DecisionIcon
				label={
					expValEquals('editor_a11y_decision_aria_label', 'isEnabled', true)
						? showPlaceholder && children === undefined
							? formatMessage(messages.undefinedDecisionAriaLabel)
							: formatMessage(messages.decisionAriaLabel)
						: 'Decision'
				}
				spacing="spacious"
				color="currentColor"
			/>
		</span>
	);

	return (
		<Item
			appearance={appearance}
			contentRef={contentRef}
			icon={icon}
			placeholder={placeholder}
			showPlaceholder={showPlaceholder}
			itemType="DECISION"
			dataAttributes={dataAttributes}
		>
			{children}
		</Item>
	);
};

export default DecisionItem;
