import React from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button';

import * as Styled from './styled';

interface FooterProps {
	currentScreenIdx: number;
	numScreens: number;
	submitButton: React.ReactNode;
	onNext: () => void;
	onPrevious: () => void;
	onCancel: () => void;
	secondaryActions: React.ReactNode;
}

export default class Footer extends React.Component<FooterProps> {
	render(): React.JSX.Element {
		const {
			currentScreenIdx,
			numScreens,
			onCancel,
			onNext,
			onPrevious,
			secondaryActions,
			submitButton,
		} = this.props;
		return (
			<Styled.FooterOuter>
				<div>{secondaryActions}</div>

				<ButtonGroup>
					{currentScreenIdx < 1 ? (
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
						<Button onClick={onCancel}>Cancel</Button>
					) : (
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
						<Button onClick={onPrevious}>Previous</Button>
					)}

					{currentScreenIdx < numScreens - 1 ? (
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
						<Button appearance="primary" onClick={onNext}>
							Next
						</Button>
					) : (
						submitButton
					)}
				</ButtonGroup>
			</Styled.FooterOuter>
		);
	}
}
