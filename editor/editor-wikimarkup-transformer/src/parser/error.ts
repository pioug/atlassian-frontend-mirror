export function error(
  message: string,
  _input: string,
  line: number,
  column: number,
) {
  throw createError({
    message,
    line,
    column,
  });
}

function createError(props: any) {
  const err = Object.create(SyntaxError.prototype);

  Object.assign(err, props, {
    name: 'SyntaxError',
  });

  return err;
}
