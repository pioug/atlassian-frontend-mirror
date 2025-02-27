import type { TeamContainer } from '../../common/types';

export interface TeamContainerProps {
	/**
	 * The team id to fetch the team container for
	 */
	teamId: string;
	/**
	 * The function to call when the add a container button is clicked
	 */
	onAddAContainerClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	addedTeamContainer?: TeamContainer;
}
