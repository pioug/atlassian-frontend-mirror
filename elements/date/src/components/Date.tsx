import { DateLozenge } from './DateLozenge';
import type { Color } from './DateLozenge';
import React from 'react';
import format from 'date-fns/format';

export type ValueType = number;

export type OnClick = (value: ValueType, event: React.SyntheticEvent<any>) => void;

export type Props = {
	children?: // eslint-disable-next-line @typescript-eslint/ban-types
		React.FunctionComponent<React.PropsWithChildren<Props>> | string | React.ReactNode;
	className?: string;
	color?: Color;
	format?: string;
	onClick?: OnClick;
	value: ValueType;
};

const isClickable = <P extends { onClick?: OnClick }, T extends P & { onClick: OnClick }>(
	props: P,
): props is T => !!props.onClick;

export class Date extends React.Component<Props> {
	static displayName = 'Date';
	static defaultProps: Partial<Props> = {
		format: 'dd/MM/yyyy',
		color: 'grey',
	};

	handleOnClick = (event: React.SyntheticEvent<any>): void => {
		if (isClickable(this.props)) {
			this.props.onClick(this.props.value, event);
		}
	};

	renderContent = () => {
		if (this.props.children) {
			if (typeof this.props.children === 'function') {
				return (
					// prettier-ignore
					// eslint-disable-next-line @typescript-eslint/ban-types
					(this.props.children as React.FunctionComponent<Props>)(this.props)
				);
			}
			return this.props.children;
		}
		return format(this.props.value, this.props.format || '');
	};

	render(): React.JSX.Element {
		return (
			<DateLozenge
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={this.props.className}
				onClick={isClickable(this.props) ? this.handleOnClick : undefined}
				color={this.props.color}
			>
				{this.renderContent()}
			</DateLozenge>
		);
	}
}
