import truncate from '../../../utils/Truncate';

describe('Feedback collector > utils > truncate unit tests', () => {
  it('should return a truncated string', () => {
    const input =
      'Cupidatat aliquip nulla culpa nulla cupidatat dolore ex aute. Quis quis labore culpa eu consectetur dolor sint laborum ut ullamco. Quis qui eiusmod duis nisi aute cupidatat proident cupidatat qui.';

    const expected = 'Cupidatat aliquip nulla culpa nulla cupidatat dolore...';

    const output = truncate(input, 52);

    expect(output).toEqual(expected);
  });

  it('should return a not truncated string', () => {
    const input =
      'Cupidatat aliquip nulla culpa nulla cupidatat dolore ex aute. Quis quis labore culpa eu consectetur dolor sint laborum ut ullamco. Quis qui eiusmod duis nisi aute cupidatat proident cupidatat qui.';

    const expected = input;

    const output = truncate(input, 0);

    expect(output).toEqual(expected);
  });

  it('should return whole string', () => {
    const input =
      'Cupidatat aliquip nulla culpa nulla cupidatat dolore ex aute. Quis quis labore culpa eu consectetur dolor sint laborum ut ullamco. Quis qui eiusmod duis nisi aute cupidatat proident cupidatat qui.';

    const expected = input;

    const output = truncate(input, Infinity);

    expect(output).toEqual(expected);
  });
});
