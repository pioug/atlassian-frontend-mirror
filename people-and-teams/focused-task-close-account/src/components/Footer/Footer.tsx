import React from 'react';

import { FormattedMessage } from 'react-intl';

import Button from '@atlaskit/button/button';
import ButtonGroup from '@atlaskit/button/button-group';

import { footerMessages } from '../../messages';
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
						<Button onClick={onCancel}>
							<FormattedMessage {...footerMessages.cancel} />
						</Button>
					) : (
						<Button onClick={onPrevious}>
							<FormattedMessage {...footerMessages.previous} />
						</Button>
					)}

					{currentScreenIdx < numScreens - 1 ? (
						<Button appearance="primary" onClick={onNext}>
							<FormattedMessage {...footerMessages.next} />
						</Button>
					) : (
						submitButton
					)}
				</ButtonGroup>
			</Styled.FooterOuter>
		);
	}
}
