/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { PureComponent } from 'react';
import { css, jsx } from '@compiled/react';
import { type Appearance, type ContentRef, type TaskType, type DecisionType } from '../types';
import { token } from '@atlaskit/tokens';

export interface Props {
	icon: JSX.Element;
	itemType: TaskType | DecisionType;
	children?: any;
	appearance?: Appearance;
	contentRef?: ContentRef;
	placeholder?: string;
	showPlaceholder?: boolean;
	dataAttributes?: { [key: string]: string | number };
	checkBoxId?: string;
}

const placeholderStyles = css({
	position: 'absolute',
	color: token('color.text.subtlest'),
	margin: `0 0 0 calc(${token('space.100', '8px')} * 3.5)`,
	pointerEvents: 'none',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	maxWidth: 'calc(100% - 50px)',
});

const placeholderTaskStyles = css({
	margin: `0 0 0 calc(${token('space.100', '8px')} * 3)`,
});

const decisionStyles = css({
	display: 'flex',
	flexDirection: 'row',
	marginTop: token('space.100', '8px'),
	marginRight: 0,
	marginBottom: 0,
	marginLeft: 0,
	paddingTop: token('space.100', '8px'),
	paddingRight: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
	paddingLeft: token('space.150', '12px'),
	borderRadius: token('border.radius.100', '3px'),
	backgroundColor: token('color.background.neutral'),
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.decision-item': {
		cursor: 'initial',
	},
});

const contentStyles = css({
	margin: 0,
	wordWrap: 'break-word',
	minWidth: 0,
	flex: '1 1 auto',
});

const taskStyles = css({
	display: 'flex',
	flexDirection: 'row',
	position: 'relative',
});

export default class Item extends PureComponent<Props, {}> {
	public static defaultProps: Partial<Props> = {
		appearance: 'inline',
	};

	private renderPlaceholder() {
		const { children, placeholder, showPlaceholder, itemType } = this.props;
		if (!showPlaceholder || !placeholder || children) {
			return null;
		}

		return (
			<span
				data-testid="task-decision-item-placeholder"
				data-component="placeholder"
				css={[placeholderStyles, itemType === 'TASK' && placeholderTaskStyles]}
				contentEditable={false}
			>
				{placeholder}
			</span>
		);
	}

	renderMessageAppearance() {
		const { contentRef, children, icon, itemType, checkBoxId, dataAttributes } = this.props;

		if (itemType === 'TASK') {
			return (
				<div css={taskStyles} id={`${checkBoxId}-wrapper`}>
					{icon}
					{this.renderPlaceholder()}
					<div data-component="content" css={contentStyles} ref={contentRef} {...dataAttributes}>
						{children}
					</div>
				</div>
			);
		} else if (itemType === 'DECISION') {
			return (
				<div data-testid="elements-decision-item" css={decisionStyles} data-decision-wrapper="true">
					{icon}
					{this.renderPlaceholder()}
					<div data-component="content" css={contentStyles} ref={contentRef} {...dataAttributes}>
						{children}
					</div>
				</div>
			);
		}

		return null;
	}

	render() {
		return this.renderMessageAppearance();
	}
}
