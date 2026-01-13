import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import Button from '@atlaskit/button';

import * as Styled from './styled';
import { type DropDownListProps } from './types';
import { overviewMessages, dropDownListMessages } from '../../messages';

type State = {
	isExpanded: boolean;
};

const COLLAPSED_LIST_SITE_COUNT = 3;

export class DropdownList extends React.Component<DropDownListProps, State> {
	state = {
		isExpanded: false,
	};

	showDropdownList = (): void => {
		this.setState({ isExpanded: true });
	};

	hideDropdownList = (): void => {
		this.setState({ isExpanded: false });
	};

	getVisibleSites = () => {
		return this.state.isExpanded
			? this.props.accessibleSites
			: this.props.accessibleSites.slice(0, COLLAPSED_LIST_SITE_COUNT);
	};

	render(): React.JSX.Element {
		const { accessibleSites } = this.props;
		const { isExpanded } = this.state;
		const visibleSites = this.getVisibleSites();

		const footNote = visibleSites.length === accessibleSites.length && (
			<Styled.AccessibleSitesListFootnote>
				<FormattedMessage {...overviewMessages.paragraphLoseAccessFootnote} />
			</Styled.AccessibleSitesListFootnote>
		);

		const toggleExpand = accessibleSites.length > COLLAPSED_LIST_SITE_COUNT && (
			<Styled.ButtonWrapper>
				<Button
					onClick={isExpanded ? this.hideDropdownList : this.showDropdownList}
					appearance="link"
					spacing="none"
				>
					{isExpanded ? (
						<FormattedMessage {...dropDownListMessages.collapseButton} />
					) : (
						<FormattedMessage
							{...dropDownListMessages.expandButton}
							values={{ num: accessibleSites.length - 3 }}
						/>
					)}
				</Button>
			</Styled.ButtonWrapper>
		);

		return (
			<>
				<Styled.AccessibleSitesList>
					{visibleSites.map((url, idx) => (
						<li key={idx}>{url}</li>
					))}
				</Styled.AccessibleSitesList>
				{footNote}
				{toggleExpand}
			</>
		);
	}
}

export default DropdownList;
