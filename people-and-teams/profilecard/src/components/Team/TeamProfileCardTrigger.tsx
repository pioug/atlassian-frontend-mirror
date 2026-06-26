import React from 'react';

/**
 * @private
 * @deprecated This component is deprecated and provides no functionality.
 * It simply renders its children without any profile card behavior.
 * Use `@atlassian/team-profilecard` instead for team profile card functionality.
 */
const TeamProfileCardTrigger = ({
	children,
}: {
	children?: React.ReactNode;
}): React.JSX.Element => <>{children}</>;

export default TeamProfileCardTrigger;
