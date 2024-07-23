/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { configPanelMessages as messages } from '@atlaskit/editor-common/extensions';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { N80, R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const removableFieldWrapperStyles = css({
	position: 'relative',
	marginBottom: 0,
});

const wrapperWithMarginBottomStyles = css({
	marginBottom: token('space.200', '16px'),
});

const removeButtonWrapperStyles = css({
	position: 'absolute',
	right: 0,
	top: 0,
	cursor: 'pointer',

	color: token('color.icon.subtle', N80),

	'&:hover': {
		color: token('color.icon.danger', R300),
	},
});

type Props = {
	name: string;
	onClickRemove?: (fieldName: string) => void;
	canRemoveField?: boolean;
	children: React.ReactElement;
	className?: string;
} & WrappedComponentProps;

const RemovableField = ({
	name,
	canRemoveField,
	onClickRemove,
	children,
	intl,
	className,
}: Props) => {
	const onClickCallback = React.useCallback(
		() => onClickRemove && onClickRemove(name),
		[name, onClickRemove],
	);

	const hasMarginBottom = children.props.field?.type !== 'expand';

	return (
		<div
			css={[removableFieldWrapperStyles, hasMarginBottom && wrapperWithMarginBottomStyles]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
		>
			{children}
			{canRemoveField && (
				<div
					css={removeButtonWrapperStyles}
					data-testid={`remove-field-${name}`}
					onClick={onClickCallback}
				>
					<Tooltip content={intl.formatMessage(messages.removeField)} position="left">
						<CrossCircleIcon size="small" label={intl.formatMessage(messages.removeField)} />
					</Tooltip>
				</div>
			)}
		</div>
	);
};

export default injectIntl(RemovableField);
