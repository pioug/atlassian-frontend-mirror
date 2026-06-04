import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';

export function fixExcludes(marks: { [key: string]: MarkSpec }): {
	[key: string]: MarkSpec;
} {
	const markKeys = Object.keys(marks);
	const markGroups = new Set(markKeys.map((mark) => marks[mark].group));

	markKeys.forEach((markKey) => {
		const mark = marks[markKey];
		if (mark.excludes) {
			// eslint-disable-next-line @atlassian/perf-linting/no-expensive-split-replace -- Ignored via go/ees017 (to be fixed)
			mark.excludes = mark.excludes
				.split(' ')
				.filter((group) => markGroups.has(group))
				.join(' ');
		}
	});
	return marks;
}
