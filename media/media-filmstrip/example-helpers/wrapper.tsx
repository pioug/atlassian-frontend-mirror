/** @jsx jsx */
import { jsx } from '@emotion/react';
import { type ReactNode } from 'react';
import {
	controlLabelStyles,
	editableBoxStyles,
	pureComponentBoxStyles,
	separatorStyles,
} from './styles';

export const ControlLabel = ({
	children,
	htmlFor,
}: {
	children: ReactNode;
	htmlFor?: string | undefined;
}) => (
	<label css={controlLabelStyles} htmlFor={htmlFor}>
		{children}
	</label>
);

export const EditableBox = ({ grow, children }: { grow?: number; children: ReactNode }) => (
	<div css={editableBoxStyles({ grow })}>{children}</div>
);

export const Separator = () => <hr css={separatorStyles} />;

export const PureComponentBox = () => <div css={pureComponentBoxStyles} />;
