export default function (name: string): string | null {
	if (
		!process.env.hasOwnProperty(name) ||
		!process.env[name] ||
		typeof process.env[name] !== 'string'
	) {
		return null;
	}
	return process.env[name] as string;
}
