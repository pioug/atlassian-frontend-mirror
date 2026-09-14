import {
	getAgentColor as getAgentColorInternal,
	type AgentColor as AgentColorInternal,
	type GetAgentColorProps as GetAgentColorPropsInternal,
} from './get-agent-color';

export type AgentColor = AgentColorInternal;
export type GetAgentColorProps = GetAgentColorPropsInternal;

export const getAgentColor = (props: GetAgentColorProps): AgentColor =>
	getAgentColorInternal(props);
