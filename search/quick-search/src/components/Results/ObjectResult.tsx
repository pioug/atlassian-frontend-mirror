import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';

import ResultBase from './ResultBase';
import { type CommonResultProps } from './types';

export type Props = CommonResultProps & {
	/** Name of the container. Provides the main text to be displayed as the item. */
	name: React.ReactNode;
	/** Text to appear to the right of the text. It has a lower font-weight. */
	caption?: string;
	/** Name of the container to which the object belongs. Displayed alongside the name */
	containerName?: React.ReactNode;
	/** Set whether to display a lock on the result's icon */
	isPrivate?: boolean;
	/** A key or identifier of the object. Ajoined to the `containerName` when provided. */
	objectKey?: React.ReactNode;
};

/**
 * Generic result type for Atlassian objects.
 */
export default class ObjectResult extends React.PureComponent<Props> {
	getAvatar = (): string | number | true | Iterable<React.ReactNode> | React.JSX.Element => {
		if (this.props.avatar) {
			return this.props.avatar;
		}

		return (
			<Avatar
				borderColor="transparent"
				src={this.props.avatarUrl}
				appearance="square"
				size="small"
				status={this.props.isPrivate ? 'locked' : null}
				testId="object-result"
			/>
		);
	};

	getSubtext():
		| string
		| number
		| boolean
		| Iterable<React.ReactNode>
		| React.JSX.Element
		| null
		| undefined {
		const { objectKey, containerName } = this.props;
		if (objectKey && containerName) {
			return (
				<span>
					{objectKey} · {containerName}
				</span>
			);
		}

		return containerName || objectKey;
	}

	render(): React.JSX.Element {
		const {
			name,
			containerName,
			isPrivate,
			objectKey,
			type = 'object',
			...commonResultProps
		} = this.props;

		return (
			<ResultBase
				{...commonResultProps}
				type={type}
				text={name}
				subText={this.getSubtext()}
				icon={this.getAvatar()}
			/>
		);
	}
}
