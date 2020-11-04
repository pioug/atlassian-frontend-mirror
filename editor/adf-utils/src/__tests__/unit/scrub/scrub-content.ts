import { scrubAttrs, scrubStr, scrubLink } from '../../../scrub/scrub-content';

describe('scrubAttrs', () => {
  beforeAll(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
  });

  it('should replace string attributes values with dummy text of the same length', () => {
    const attrs = {
      text: 'DONE',
      localId: 'e6764f45-4d69-49f8-9e0a-3a83fb9c0db7',
    };

    const scrubbedAttrs = scrubAttrs('status', attrs);

    expect(scrubbedAttrs).toEqual({
      text: 'Lore',
      localId: 'Lorem ipsum dolor sit amet, consecte',
    });
  });

  it('should replace numeric attributes values with dummy numbers of the same length', () => {
    const attrs = {
      attr1: 123,
      attr2: 1234567,
    };

    const scrubbedAttrs = scrubAttrs('coolNodeType', attrs);

    expect(scrubbedAttrs).toEqual({
      attr1: 100,
      attr2: 1000000,
    });
  });

  it('should throw an error if attrs is not an object', () => {
    const attrs = ['attr1', 'attr2'];

    expect(() => {
      scrubAttrs('coolNodeType', attrs);
    }).toThrowError(/scrubAttrs: encountered unsupported attributes type/);
  });

  it('should replace nested attributes values with dummy values of the same length', () => {
    const attrs = {
      parameters: {
        extensionId: 'e6764f45-4d69-49f8-9e0a-3a83fb9c0db7',
        localId: '0',
        text: 'Extension',
        macroMetadata: {
          macroId: {
            value: 1598252695991,
          },
          schemaVersion: {
            value: '2',
          },
        },
      },
    };

    const scrubbedAttrs = scrubAttrs('extension', attrs);

    expect(scrubbedAttrs).toEqual({
      parameters: {
        extensionId: 'Lorem ipsum dolor sit amet, consecte',
        localId: 'L',
        text: 'Lorem ips',
        macroMetadata: {
          macroId: {
            value: 1000000000000,
          },
          schemaVersion: {
            value: 'L',
          },
        },
      },
    });
  });

  describe('bypassed attributes', () => {
    it('should not replace bypassed attributes for bodiedExtension node', () => {
      const attrs = {
        extensionType: 'bodied-extension',
        extensionKey: 'bodied-extension-key',
        layout: 'wide',
      };

      const scrubbedAttrs = scrubAttrs('bodiedExtension', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });

    it('should not replace bypassed attributes for codeBlock node', () => {
      const attrs = {
        language: 'javascript',
      };

      const scrubbedAttrs = scrubAttrs('codeBlock', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });

    it('should not replace bypassed attributes for decisionItem node', () => {
      const attrs = {
        state: 'DECIDED',
      };

      const scrubbedAttrs = scrubAttrs('decisionItem', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });

    it('should not replace bypassed attributes for embedCard node', () => {
      const attrs = {
        originalHeight: 1874,
        originalWidth: 1078,
        width: 1078,
        layout: 'full-width',
      };

      const scrubbedAttrs = scrubAttrs('embedCard', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });

    it('should not replace bypassed attributes for extension node', () => {
      const attrs = {
        extensionType: 'extension',
        extensionKey: 'extension-key',
        layout: 'wide',
      };

      const scrubbedAttrs = scrubAttrs('extension', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });

    it('should not replace bypassed attributes for heading node', () => {
      const attrs = {
        level: 5,
      };

      const scrubbedAttrs = scrubAttrs('heading', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });

    it('should not replace bypassed attributes for inlineExtension node', () => {
      const attrs = {
        extensionType: 'inline-extension',
        extensionKey: 'inline-extension-key',
        layout: 'wide',
      };

      const scrubbedAttrs = scrubAttrs('inlineExtension', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });

    it('should not replace bypassed attributes for layoutColumn node', () => {
      const attrs = {
        width: 100,
      };

      const scrubbedAttrs = scrubAttrs('layoutColumn', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });

    it('should not replace bypassed attributes for media node', () => {
      const attrs = {
        height: 1078,
        width: 500,
        __fileSize: 123456,
        __fileMimeType: 'image/jpeg',
      };

      const scrubbedAttrs = scrubAttrs('media', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });

    it('should not replace bypassed attributes for mediaSingle node', () => {
      const attrs = {
        width: 500,
        layout: 'center',
      };

      const scrubbedAttrs = scrubAttrs('mediaSingle', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });

    it('should not replace bypassed attributes for orderedList node', () => {
      const attrs = {
        order: 1,
      };

      const scrubbedAttrs = scrubAttrs('orderedList', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });

    it('should not replace bypassed attributes for panel node', () => {
      const attrs = {
        panelType: 'success',
      };

      const scrubbedAttrs = scrubAttrs('panel', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });

    it('should not replace bypassed attributes for status node', () => {
      const attrs = {
        color: 'green',
        style: 'bold',
      };

      const scrubbedAttrs = scrubAttrs('status', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });

    it('should not replace bypassed attributes for table node', () => {
      const attrs = {
        isNumberColumnEnabled: true,
        layout: 'default',
      };

      const scrubbedAttrs = scrubAttrs('table', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });

    it('should not replace bypassed attributes for tableCell node', () => {
      const attrs = {
        colspan: 1,
        rowspan: 1,
        colwidth: 250,
        background: null,
      };

      const scrubbedAttrs = scrubAttrs('tableCell', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });

    it('should not replace bypassed attributes for tableHeader node', () => {
      const attrs = {
        colspan: 1,
        rowspan: 1,
        colwidth: 250,
        background: '#DEEBFF',
      };

      const scrubbedAttrs = scrubAttrs('tableHeader', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });

    it('should not replace bypassed attributes for taskItem node', () => {
      const attrs = {
        state: 'TODO',
      };

      const scrubbedAttrs = scrubAttrs('taskItem', attrs);
      expect(scrubbedAttrs).toEqual(attrs);
    });
  });
});

describe('scrubStr', () => {
  it('should replace string with dummy text of the same length', () => {
    const scrubbedStr = scrubStr('abcde');
    expect(scrubbedStr).toEqual('Lorem');
  });

  it('should repeat dummy text if the length of the original text is longer', () => {
    const scrubbedStr = scrubStr(`iMSZz4HfMPrinSDhDDTpkE2pNtUAl5wnkuIb2hr5K4NrC9iv1jif
    2K54aHq7K4TDiRLe4z6swasZb7WaPTWVXWkFtI2vxwFWtPFqPWnfJb9BHBPMaAi6vIGHst8OZ3bb860c0j
    D0JvkufJXn8Z2CA0tp19Fq6kU0mTPzGMAS0cyw2tBbj3Chl0ec66a9i6wSNR1HRLASyKMsBVDM002M2TTq
    G5whAnkZCxfPuu9JaQsgSMEA6BFhEizCX6EaZTYR37Uis7SkOy7dVAlzsSUVE4MMn6kVQbf4QRgOeYxn94
    92hUPWzbfPL9KIg853hf6d1oQoInybOEvZOEle7XcIEUZ9Llyhp2AcBaTznWEZmfCRiZEjmKIQgYtJ1DUk
    CdtdeXjSuKJLQKFG9cPl0mjIOcOOExzYwrBwUJzkmkgGZyt7SEhuI6ZX1rRYPKzfN1R70NmPwArYU1rckv
    uM5jh3gOZeHB6SWDzNB5Fm6walziIwFLMv2LJs`);

    expect(scrubbedStr).toEqual(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incidi',
    );
  });

  it('should handle 0 length string', () => {
    const scrubbedStr = scrubStr('');
    expect(scrubbedStr).toEqual('');
  });
});

describe('scrubLink', () => {
  it('should replace href attribute in link marks', () => {
    const originalMarks = [
      {
        type: 'link',
        attrs: {
          href: 'https://www.atlassian.com',
        },
      },
    ];

    const expectedMarks = [
      {
        type: 'link',
        attrs: {
          href: 'https://www.google.com',
        },
      },
    ];

    expect(scrubLink(originalMarks)).toEqual(expectedMarks);
  });

  it('should not replace non link marks', () => {
    const originalMarks = [
      {
        type: 'em',
        attrs: { some_attr: 'some value' },
      },
      {
        type: 'strong',
        attrs: { some_attr: 'some value' },
      },
      {
        type: 'underline',
        attrs: { some_attr: 'some value' },
      },
    ];

    expect(scrubLink(originalMarks)).toEqual(originalMarks);
  });
});
