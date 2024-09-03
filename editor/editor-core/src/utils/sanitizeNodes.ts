import type { MarkSpec, NodeSpec } from '@atlaskit/editor-prosemirror/model';

export function sanitizeNodes(
	nodes: { [key: string]: NodeSpec },
	supportedMarks: { [key: string]: MarkSpec },
): { [key: string]: NodeSpec } {
	const nodeNames = Object.keys(nodes);
	nodeNames.forEach((nodeKey) => {
		const nodeSpec = { ...nodes[nodeKey] };
		if (nodeSpec.marks && nodeSpec.marks !== '_') {
			nodeSpec.marks = nodeSpec.marks
				.split(' ')
				.filter((mark) => !!supportedMarks[mark])
				.join(' ');
		}
		if (nodeSpec.content) {
			nodeSpec.content = sanitizeNodeSpecContent(nodes, nodeSpec.content);
		}
		nodes[nodeKey] = nodeSpec;
	});
	return nodes;
}

function sanitizeNodeSpecContent(nodes: { [key: string]: NodeSpec }, rawContent: string): string {
	const content = rawContent.replace(/\W/g, ' ');
	const contentKeys = content.split(' ');
	const unsupportedContentKeys = contentKeys.filter(
		(contentKey) => !isContentSupported(nodes, contentKey),
	);
	return unsupportedContentKeys.reduce(
		(newContent, nodeName) => sanitizedContent(newContent, nodeName),
		rawContent,
	);
}

function sanitizedContent(content: string | undefined, invalidContent: string): string {
	if (!invalidContent.length) {
		return content || '';
	}

	if (!content || !content.match(/\w/)) {
		return '';
	}

	const pattern = `(${invalidContent}((\\s)*\\|)+)|((\\|(\\s)*)+${invalidContent})|(${invalidContent}$)|(${invalidContent}(\\+|\\*))`;
	return content.replace(new RegExp(pattern, 'g'), '').replace('  ', ' ').trim();
}

function isContentSupported(nodes: { [key: string]: NodeSpec }, contentKey: string): boolean {
	const nodeKeys = Object.keys(nodes);

	// content is with valid node
	if (nodeKeys.indexOf(contentKey) > -1) {
		return true;
	}

	// content is with valid group
	for (const supportedKey in nodes) {
		const nodeSpec = nodes[supportedKey];
		if (nodeSpec && nodeSpec.group === contentKey) {
			return true;
		}
	}

	return false;
}
