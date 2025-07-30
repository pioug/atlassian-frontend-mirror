import { type Breakpoint } from '../common';

export type StyledBarProps = {
	progress?: number;
	breakpoint: Breakpoint;
	positionBottom: boolean;
	showOnTop: boolean;
	ariaLabel?: string;
};
