// We don't statically export these so we supress the error.
// This is done so we can copy and paste the script to run it in Figma.
import {
  // @ts-ignore
  formatDescription as format,
  FormatDescription,
} from '../../synchronize-figma-tokens';

const formatDescription: FormatDescription = format;

describe('formatDescription', () => {
  it('should return the token description', () => {
    const description = formatDescription({
      value: '#FF0000',
      attributes: {
        group: 'paint',
        state: 'active',
        introduced: '0.1.0',
        description: 'Primary text color',
      },
    });

    expect(description).toBe('Primary text color');
  });

  it('should prefix a warning to the description of deprecated tokens', () => {
    const description = formatDescription({
      value: '#FF0000',
      attributes: {
        group: 'paint',
        state: 'deprecated',
        introduced: '0.1.0',
        deprecated: '0.2.0',
        description: 'Primary text color',
      },
    });

    expect(description).toBe(`DEPRECATED do not use. \nPrimary text color`);
  });

  it('should supply replacement options in the description of deprecated tokens', () => {
    const description1 = formatDescription({
      value: '#FF0000',
      attributes: {
        group: 'paint',
        state: 'deprecated',
        introduced: '0.1.0',
        deprecated: '0.2.0',
        replacement: 'color.text.brand',
        description: 'Primary text color',
      },
    });

    const description2 = formatDescription({
      value: '#FF0000',
      attributes: {
        group: 'paint',
        state: 'deprecated',
        introduced: '0.1.0',
        deprecated: '0.2.0',
        replacement: ['color.text.brand', 'color.text.danger'],
        description: 'Primary text color',
      },
    });

    // Single replacement option
    expect(description1).toBe(
      'DEPRECATED use color.text.brand instead. \nPrimary text color',
    );

    // Multiple replacement options
    expect(description2).toBe(
      'DEPRECATED use color.text.brand | color.text.danger instead. \nPrimary text color',
    );
  });

  it('should not prefix a warning to the description of non-deprecated tokens', () => {
    const description = formatDescription({
      value: '#FF0000',
      attributes: {
        group: 'paint',
        state: 'active',
        description: 'Primary text color',
        introduced: '0.1.0',
      },
    });

    expect(description).toEqual(
      expect.not.stringContaining('DEPRECATED do not use. '),
    );
  });
});
