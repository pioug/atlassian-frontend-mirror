// TODO: Remove this eslint-disable when prop names have been renamed.
// This rule is here as prop name changes are a major as they are used
// by our consumers. This can be done in the next lite-mode conversion.
/* eslint-disable @repo/internal/react/boolean-prop-naming-convention */
import React, { type ReactElement, type ReactNode } from 'react';

import {
	ActionsWrapper,
	BottomBarWrapper,
	OuterWrapper,
	StyledTitleWrapper,
	TitleContainer,
	TitleWrapper,
} from './styled';

type PageHeaderProps = {
	/**
	 * Contents of the action bar to be rendered next to the page title.
	 */
	actions?: ReactElement;
	/**
	 * Contents of the action bar to be rendered next to the page title. Typically a button group.
	 */
	bottomBar?: ReactElement;
	/**
	 * Page breadcrumbs to be rendered above the title.
	 */
	breadcrumbs?: ReactElement;
	/**
	 * Contents of the bottom bar to be rendered below the page title. Typically contains a search bar and/or filters.
	 */
	children?: ReactNode;
	/**
	 * Content of the page title. The text wraps by default.
	 */
	disableTitleStyles?: boolean;
	/**
	 * Returns the inner ref to the DOM element of the title. This is exposed so the focus can be set.
	 */
	innerRef?: (element: HTMLElement) => void;
	/**
	 * Prevent the title from wrapping across lines. Avoid using this wherever possible, as truncation can make page headings inaccessible.
	 */
	truncateTitle?: boolean;
	/**
	 * Used as the ID of the inner h1 tag. This is exposed so the header text can be used as label of other elements by aria-labelledby.
	 */
	id?: string;
	/**
	 * A testId prop is provided for specified elements, which is a unique string that appears as a data attribute data-testid in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
};

/**
 * __Page header__
 *
 * A page header defines the top of a page. It contains a title and can be optionally combined with
 * breadcrumbs buttons, search, and filters.
 *
 * - [Examples](https://atlassian.design/components/page-header/examples)
 * - [Code](https://atlassian.design/components/page-header/code)
 * - [Usage](https://atlassian.design/components/page-header/usage)
 */
const PageHeader = ({
	innerRef,
	breadcrumbs,
	actions,
	bottomBar,
	children,
	id,
	disableTitleStyles = false,
	truncateTitle = false,
	testId,
}: PageHeaderProps): React.JSX.Element => {
	return (
		<OuterWrapper>
			{breadcrumbs}
			<TitleWrapper truncateTitle={truncateTitle}>
				<TitleContainer truncateTitle={truncateTitle}>
					{disableTitleStyles ? (
						children
					) : (
						<StyledTitleWrapper
							ref={innerRef as React.Ref<HTMLHeadingElement>}
							truncateTitle={truncateTitle}
							id={id}
							testId={testId}
						>
							{children}
						</StyledTitleWrapper>
					)}
				</TitleContainer>
				{actions && <ActionsWrapper>{actions}</ActionsWrapper>}
			</TitleWrapper>
			{bottomBar && <BottomBarWrapper> {bottomBar} </BottomBarWrapper>}
		</OuterWrapper>
	);
};

export default PageHeader;
