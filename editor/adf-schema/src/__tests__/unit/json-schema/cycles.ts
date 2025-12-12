// @ts-nocheck
import v1SchemaFull from '../../../../json-schema/v1/full.json';
import v1SchemaStage0 from '../../../../json-schema/v1/stage-0.json';

describe('infinite nesting', () => {
	it('should allow infinite nesting only for allowed nodes - full schema', () => {
		const graph = createGraphFromSchema(v1SchemaFull);
		const cyclicNodes = detectAllCycles(graph);
		cyclicNodes.sort();
		expect(cyclicNodes.length).toBe(3);
		expect(cyclicNodes).toStrictEqual(
			expect.arrayContaining([
				{ from: 'taskList_node', to: 'taskList_node' },
				{ from: 'bulletList_node', to: 'listItem_node' },
				{ from: 'listItem_node', to: 'orderedList_node' },
			]),
		);
	});

	it('should allow infinite nesting only for allowed nodes - stage-0', () => {
		const graph = createGraphFromSchema(v1SchemaStage0);
		const cyclicNodes = detectAllCycles(graph);
		cyclicNodes.sort();
		expect(cyclicNodes.length).toBe(5);
		expect(cyclicNodes).toStrictEqual(
			expect.arrayContaining([
				{ from: 'taskList_node', to: 'taskList_node' },
				{ from: 'bulletList_node', to: 'listItem_node' },
				{ from: 'listItem_node', to: 'orderedList_node' },
				{ from: 'bulletList_node', to: 'listItem_with_nested_decision_node' },
				{ from: 'orderedList_node', to: 'listItem_with_nested_decision_node' },
			]),
		);
	});

	const createGraphFromSchema = (schema): object => {
		const nodeGraph = {};
		const definitions = schema.definitions ?? {};
		Object.entries(definitions).forEach(([parentName, value]) => {
			createGraphHelper(value, parentName, nodeGraph);
		});

		return nodeGraph;
	};

	const createGraphHelper = (obj, parent: string, nodeGraph: object) => {
		if (obj === null || typeof obj !== 'object') {
			return;
		}

		Object.entries(obj).forEach(([key, value]) => {
			if (key === '$ref' && typeof value === 'string') {
				if (nodeGraph[parent] === undefined) {
					nodeGraph[parent] = [];
				}

				const childNodeName = value.split('/')[2];
				nodeGraph[parent].push(childNodeName);
			}

			createGraphHelper(value, parent, nodeGraph);
		});
	};

	const detectAllCycles = (graph: object): Array<string> => {
		const visited = {};
		const recStack = {};
		const cycles = [];
		Object.entries(graph).forEach(([key]) => {
			detectAllCyclesHelper(key, '', graph, visited, recStack, cycles);
		});

		return cycles;
	};

	const detectAllCyclesHelper = (
		key: string,
		parent: string,
		graph: object,
		visited: object,
		recStack: object,
		cycles: Array<object>,
	) => {
		if (recStack[key] && recStack[key] === true) {
			const loop = {
				from: key,
				to: parent,
			};

			if (!cycles.includes(loop)) {
				cycles.push(loop);
			}

			return;
		}

		if (visited[key] && visited[key] === true) {
			return;
		}

		visited[key] = true;
		recStack[key] = true;

		const children = graph[key] || [];

		for (let i = 0; i < children.length; i++) {
			detectAllCyclesHelper(children[i], key, graph, visited, recStack, cycles);
		}

		recStack[key] = false;
	};
});
