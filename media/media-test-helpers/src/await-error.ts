export async function awaitError(response: Promise<Error>, expectedMessage: string): Promise<void> {
	try {
		await response;
	} catch (err) {
		if (err instanceof Error && err.message !== expectedMessage) {
			throw err;
		}
	}
}
