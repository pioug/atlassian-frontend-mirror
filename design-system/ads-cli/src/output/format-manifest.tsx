/**
 * Format a scannable human catalog of the ADS CLI capability manifest.
 */
export const formatManifest = (data: unknown): string | null => {
	if (
		typeof data !== 'object' ||
		data === null ||
		!('bin' in data) ||
		typeof data.bin !== 'string' ||
		!('version' in data) ||
		typeof data.version !== 'string' ||
		!('invocation' in data) ||
		typeof data.invocation !== 'string' ||
		!('commands' in data) ||
		!Array.isArray(data.commands)
	) {
		return null;
	}

	const commands = data.commands.flatMap((command) => {
		if (
			typeof command !== 'object' ||
			command === null ||
			!('name' in command) ||
			typeof command.name !== 'string' ||
			!('description' in command) ||
			typeof command.description !== 'string'
		) {
			return [];
		}

		const jsonFlag =
			'jsonSupported' in command && command.jsonSupported === true ? ' [--json]' : '';
		return [`  ${command.name}${jsonFlag}\n    ${command.description}`];
	});

	const commandCount = commands.length;
	const commandLabel = commandCount === 1 ? 'command' : 'commands';

	return [
		`${data.bin} v${data.version} — ${commandCount} ${commandLabel}`,
		'',
		commands.join('\n'),
		'',
		`Run \`${data.invocation} manifest --json\` for the full structured manifest.`,
	].join('\n');
};
