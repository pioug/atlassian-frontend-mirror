/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useMouseDownEvent } from '../../../state/analytics/useLinkClicked';

export interface ContentHeaderProps {
	onClick: React.MouseEventHandler;
	link: string;
	children: React.ReactNode;
}

/**
 * Class name for selecting non-flexible block card header
 *
 * @deprecated {@link https://hello.jira.atlassian.cloud/browse/ENGHEALTH-6878 Internal documentation for deprecation (no external access)}
 * Using this selctor is deprecated as once the flexible block card feature flag is removed, this class will no longer be used.
 */
export const blockCardContentHeaderClassName = 'block-card-content-header';

export const ContentHeader = ({ onClick, link, children }: ContentHeaderProps) => {
	const onMouseDown = useMouseDownEvent();

	return (
		<a
			onClick={onClick}
			onMouseDown={onMouseDown}
			href={link}
			target="_blank"
			css={{
				display: 'flex',
				alignItems: 'flex-start',
				// EDM-713: fixes copy-paste from renderer to editor for Firefox
				// due to HTML its unwrapping behaviour on paste.
				MozUserSelect: 'none',
			}}
			data-trello-do-not-use-override="block-card-content-header"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={blockCardContentHeaderClassName}
		>
			{children}
		</a>
	);
};
