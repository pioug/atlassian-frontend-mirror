/**
 * Ideally these are exported by @atlaskit/page
 */
export type Spacing = 'comfortable' | 'cosy' | 'compact';

export type Status = 'unvisited' | 'visited' | 'current' | 'disabled';

/**
 * @deprecated
 */
// eslint-disable-next-line
export type StatusType = Status;
export interface Stage {
	id: string;
	label: string;
	percentageComplete: number;
	status: Status;
	noLink?: boolean;
	href?: string;
	onClick?: () => void;
}

export type Stages = Stage[];

export interface LinkComponentProps {
	item: Stage;
}

export interface ProgressTrackerStageRenderProp {
	link: (props: LinkComponentProps) => JSX.Element;
}
