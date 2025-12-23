import React from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button';

import { fg } from '@atlaskit/platform-feature-flags';

import * as Styled from './styled';
import { FormattedMessage } from 'react-intl-next';
import { footerMessages } from '../../messages';

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
							{fg('people-teams-fix-no-literal-string-in-jsx') ? (
								<FormattedMessage {...footerMessages.cancel} />
							) : (
								'Cancel'
							)}
						</Button>
					) : (
						<Button onClick={onPrevious}>
							{fg('people-teams-fix-no-literal-string-in-jsx') ? (
								<FormattedMessage {...footerMessages.previous} />
							) : (
								'Previous'
							)}
						</Button>
					)}

					{currentScreenIdx < numScreens - 1 ? (
						<Button appearance="primary" onClick={onNext}>
							{fg('people-teams-fix-no-literal-string-in-jsx') ? (
								<FormattedMessage {...footerMessages.next} />
							) : (
								'Next'
							)}
						</Button>
					) : (
						submitButton
					)}
				</ButtonGroup>
			</Styled.FooterOuter>
		);
	}
}
