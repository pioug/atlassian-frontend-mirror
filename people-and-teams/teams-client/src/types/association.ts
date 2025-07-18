import { type TeamsClientUser } from "./user"

export type TeamAgentAssociation = {
    associationId: {
        teamId: string;
        memberId: string;
    }
    agent: TeamsClientUser;
}