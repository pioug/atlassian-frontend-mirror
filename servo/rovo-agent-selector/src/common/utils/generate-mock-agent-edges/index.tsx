export const generateMockAgentEdges = (count: number) => {
	const agents = Array.from({ length: count }, (_, i) => ({
		id: `agent-${i}`,
		name: `Agent ${i}`,
		externalConfigReference: `ref-${i}`,
		identityAccountId: `account-${i}`,
		creatorType: 'CUSTOMER' as const,
	}));

	return agents.map((node) => ({
		node,
		cursor: `cursor-${node.id}`,
	}));
};
