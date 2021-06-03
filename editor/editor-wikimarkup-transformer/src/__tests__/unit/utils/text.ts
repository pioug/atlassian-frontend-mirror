import {
  isBlank,
  isDigit,
  isNotBlank,
  StringBuffer,
} from '../../../parser/utils/text';

describe('StringBuffer', () => {
  it('should find last index of character', () => {
    expect(new StringBuffer('abcabc').lastIndexOf('b')).toEqual(
      'abcabc'.lastIndexOf('b'),
    );
  });

  it('should find index of character', () => {
    expect(new StringBuffer('abcabc').indexOf('b')).toEqual(
      'abcabc'.indexOf('b'),
    );
  });

  it('should return the buffer length', () => {
    expect(new StringBuffer('abcd').length()).toEqual(4);
  });

  it('should return buffer when converted to string', () => {
    let buffer = new StringBuffer('abcd');
    expect('' + buffer).toEqual('abcd');
  });

  it('should delete substrings', () => {
    let buffer = new StringBuffer('abcd');
    buffer.delete(1, 3);
    expect(buffer.toString()).toEqual('ad');
    expect(buffer.length()).toEqual(2);
  });

  it('should delete substrings starting at 0', () => {
    let buffer = new StringBuffer('abcd');
    buffer.delete(0, 3);
    expect(buffer.toString()).toEqual('d');
    expect(buffer.length()).toEqual(1);
  });

  it('should append strings', () => {
    let buffer = new StringBuffer('abcd');
    buffer.append('efg');
    expect(buffer.toString()).toEqual('abcdefg');
    expect(buffer.length()).toEqual(7);
  });

  it('should return substrings', () => {
    let buffer = new StringBuffer('abcd');
    expect(buffer.substring(1, 3)).toEqual('bc');
  });

  it('should delete single characters', () => {
    let buffer = new StringBuffer('abcd');
    buffer.deleteCharAt(1);
    expect(buffer.toString()).toEqual('acd');
  });
});

describe('isDigit', () => {
  it('should return true if character is a digit', () => {
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      .map((v) => String(v))
      .forEach((value) => {
        expect(isDigit(value)).toEqual(true);
      });
  });

  it('should return false if character is not digit', () => {
    ['a', 'z', 'A', 'Z', ' ', '\t'].forEach((value) => {
      expect(isDigit(value)).toEqual(false);
    });
  });
});

describe('isBlank / isNotBlank', () => {
  /*
    https://commons.apache.org/proper/commons-lang/javadocs/api-2.6/org/apache/commons/lang/StringUtils.html#isBlank(java.lang.String)

        StringUtils.isBlank(null)      = true
        StringUtils.isBlank("")        = true
        StringUtils.isBlank(" ")       = true
        StringUtils.isBlank("bob")     = false
        StringUtils.isBlank("  bob  ") = false
     */

  const scenarios: [string, string | null, boolean][] = [
    ['null', null, true],
    ["''", '', true],
    ["' '", ' ', true],
    ["'bob'", 'bob', false],
    ["' bob '", '  bob  ', false],
  ];

  scenarios.forEach(([label, input, expectedOutput]) => {
    it(`isBlank(${label}) = ${expectedOutput}`, () => {
      expect(isBlank(input)).toEqual(expectedOutput);
    });

    it(`isNotBlank(${label}) = ${!expectedOutput}`, () => {
      expect(isNotBlank(input)).toEqual(!expectedOutput);
    });
  });
});
