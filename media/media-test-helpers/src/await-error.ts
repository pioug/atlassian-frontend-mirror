export async function awaitError(
  response: Promise<Error>,
  expectedMessage: string,
) {
  try {
    await response;
  } catch (err) {
    if (err.message !== expectedMessage) {
      throw err;
    }
  }
}
