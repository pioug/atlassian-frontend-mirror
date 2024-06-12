/** @jsx jsx */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import {
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const editedContentStyles = css({
	color: token('color.text.subtlest', N200),
});

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export interface EditedProps extends WithAnalyticsEventsProps {
	/**
	 * Content to render indicating that the comment has been edited.
	 */
	children?: ReactNode;
	/**
	 * Handler called when the element is focused.
	 */
	onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
	/**
	 * Handler called when the element is moused over.
	 */
	onMouseOver?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const Edited: FC<EditedProps> = ({ children, onFocus, onMouseOver }) => {
	return (
		<span css={editedContentStyles} onFocus={onFocus} onMouseOver={onMouseOver}>
			{children}
		</span>
	);
};

Edited.displayName = 'Edited';

export { Edited as CommentEditedWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
	componentName: 'commentEdited',
	packageName,
	packageVersion,
})(
	withAnalyticsEvents({
		onClick: createAndFireEventOnAtlaskit({
			action: 'clicked',
			actionSubject: 'commentEdited',

			attributes: {
				componentName: 'commentEdited',
				packageName,
				packageVersion,
			},
		}),
	})(Edited),
);
