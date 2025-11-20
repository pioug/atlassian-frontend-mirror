import React from 'react';
import {
	IconWrapper as CompiledIconWrapper,
	EmojiWrapper as CompiledEmojiWrapper,
	IconTitleWrapper as CompiledIconTitleWrapper,
	LozengeWrapper as CompiledLozengeWrapper,
	LozengeBlockWrapper as CompiledLozengeBlockWrapper,
	RightIconPositionWrapper as CompiledRightIconPositionWrapper,
	IconPositionWrapper as CompiledIconPositionWrapper,
	IconEmptyWrapper as CompiledIconEmptyWrapper,
} from './styled-compiled';

export const IconWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledIconWrapper {...props} />;

export const EmojiWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledEmojiWrapper {...props} />;

export const IconTitleWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledIconTitleWrapper {...props} />;

export const LozengeWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledLozengeWrapper {...props} />;

export const LozengeBlockWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledLozengeBlockWrapper {...props} />;

export const RightIconPositionWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledRightIconPositionWrapper {...props} />;

export const IconPositionWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledIconPositionWrapper {...props} />;

export const IconEmptyWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledIconEmptyWrapper {...props} />;
