type Primitive = number | string | boolean | bigint | symbol | null | undefined;

export const captureException = async (
  error: Error,
  packageName: string,
  tags?: { [key: string]: Primitive },
) => {
  // Re-introduce in EDM-9682
  return;
};
