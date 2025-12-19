/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { cssMap, jsx } from '@compiled/react';

const bodyStyles = cssMap({
    root: {
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        height: '100%',
        justifyContent: 'start',
    }
});

export interface FlyoutBodyProps {
    /**
     * The content to display within the main body of the flyout menu.
     * Typically includes the primary interactive elements.
     */
    children?: React.ReactNode;

    /**
	 * A unique string that appears as data attribute data-testid in the
     * rendered code, serving as a hook for automated tests.
     */
    testId?: string;
}

/**
 * __Flyout menu item body__
 *
 * The main section of a flyout menu. This component is used to render the
 * primary contents of the flyout menu. This component should be placed between
 * FlyoutHeader and FlyoutFooter (if present), as is scrollable if the content
 * exceeds the available space.
 */
export const FlyoutBody = (props: FlyoutBodyProps) => {
    const { children, testId } = props;

    return (
        <div css={bodyStyles.root} data-testid={testId}>
            {children}
        </div>
    )
};
