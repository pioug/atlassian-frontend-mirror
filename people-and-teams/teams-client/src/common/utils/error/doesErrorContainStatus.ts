export function doesErrorContainStatus(statusCode: number, message: string): boolean {
	const reg = new RegExp(`status .*(${statusCode})`);
	return reg.test(message);
}
