import { scrubAttrs, scrubStr, scrubLink } from '../../../scrub/scrub-content';

describe('scrubAttrs', () => {
  it('should replace string attributes values with dummy text of the same length', () => {
    const attrs = {
      text: 'DONE',
      localId: 'e6764f45-4d69-49f8-9e0a-3a83fb9c0db7',
    };

    const scrubbedAttrs = scrubAttrs('status', attrs);

    expect(scrubbedAttrs).toEqual({
      text: 'LORE',
      localId: 'l7435o18-2r43-91e0-7m3i-1p02su3m9do0',
    });
  });

  it('should replace numeric attributes values with dummy numbers of the same length', () => {
    const attrs = {
      attr1: 123,
      attr2: 1234567,
    };

    const scrubbedAttrs = scrubAttrs('coolNodeType', attrs);

    expect(scrubbedAttrs).toEqual({
      attr1: 274,
      attr2: 2743591,
    });
  });

  it('should replace array attributes', () => {
    const attrs = ['abcd', 123, { attr: 'abc' }];

    const scrubbedAttrs = scrubAttrs('coolNodeType', attrs);

    expect(scrubbedAttrs).toEqual(['lore', 274, { attr: 'lor' }]);
  });

  it('should throw an error if attrs are not supported', () => {
    const attrs = function () {};
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
        extensionId: 'l7435o18-2r43-91e0-7m3i-1p02su3m9do0',
        localId: '2',
        text: 'Loremipsu',
        macroMetadata: {
          macroId: {
            value: 2743591802743,
          },
          schemaVersion: {
            value: '2',
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
    expect(scrubbedStr).toEqual('lorem');
  });

  it('should retain character case', () => {
    const scrubbedStr = scrubStr('AbCdE');
    expect(scrubbedStr).toEqual('LoReM');
  });

  it('should retain whitespace', () => {
    const scrubbedStr = scrubStr(' a b c  d ');
    expect(scrubbedStr).toEqual(' l o r  e ');
  });

  it('should retain punctuation', () => {
    const scrubbedStr = scrubStr(
      'This. is. unbelievable! I; am at a loss for words.',
    );
    expect(scrubbedStr).toEqual(
      'Lore. mi. psumdolorsit! A; me tc o nsec tet uradi.',
    );
  });

  it('should repeat dummy text if the length of the original text is longer', () => {
    const scrubbedStr = scrubStr(
      `Boudin pork belly flank turducken meatball pancetta jerky short loin pork chop frankfurter shankle. Tenderloin sirloin pastrami ground round capicola drumstick pork sausage prosciutto shank. Fatback ribeye pork chop meatball leberkas brisket. Prosciutto alcatra spare ribs salami pork loin sirloin frankfurter filet mignon, strip steak landjaeger burgdoggen. Jowl hamburger swine beef, pastrami pancetta t-bone corned beef. Short loin pastrami shank, tongue bresaola jowl tenderloin ham cow biltong doner. Boudin pork belly flank turducken meatball pancetta jerky short loin pork chop frankfurter shankle. Tenderloin sirloin pastrami ground round capicola drumstick pork sausage prosciutto shank. Fatback ribeye pork chop meatball leberkas brisket. Prosciutto alcatra spare ribs salami pork loin sirloin frankfurter filet mignon, strip steak landjaeger burgdoggen. Jowl hamburger swine beef, pastrami pancetta t-bone corned beef. Short loin pastrami shank, tongue bresaola jowl tenderloin ham cow biltong doner.`,
    );

    expect(scrubbedStr).toEqual(
      'Loremi psum dolor sitam etconsect eturadip iscingel itsed doeiu smod temp orin cididuntutl aboreet. Doloremagn aaliqua utenimad minimv eniam quisnost rudexerci tati onullam colaborisn isiut. Aliquip exeaco mmod ocon sequatdu isauteir uredolo. Rinreprehe nderiti nvolu ptat evelit esse cill umdolor eeufugiatnu llapa riatur, excep teurs intoccaeca tcupidatat. Nonp roidentsu ntinc ulpa, quioffic iadeseru n-tmol litani mide. Stlab orum loremips umdol, orsita metconse ctet uradipisci nge lit seddoei usmod. Tempor inci didun tutla boreetdol oremagna aliquaut enima dmini mven iamq uisn ostrudexerc itation. Ullamcolab orisnis iutaliqu ipexea commo doconseq uatduisau teir uredolo rinreprehe nderi. Tinvolu ptatev elit esse cillumdo loreeufu giatnul. Lapariatur excepte ursin tocc aecatc upid atat nonproi dentsuntinc ulpaq uioffi, ciade serun tmollitani midestlabo. Ruml oremipsum dolor sita, metconse cteturad i-pisc ingeli tsed. Doeiu smod temporin cidid, untutl aboreetd olor emagnaaliq uau ten imadmin imven.',
    );
  });

  it('should handle 0 length string', () => {
    const scrubbedStr = scrubStr('');
    expect(scrubbedStr).toEqual('');
  });

  it('should replace emoji', () => {
    const scrubbedStr = scrubStr('😀😃😄😁😆😅😂');
    expect(scrubbedStr).toEqual('⭐️⭐️⭐️⭐️⭐️⭐️⭐️');
  });

  it('should replace compound emoji', () => {
    const scrubbedStr = scrubStr('🏄‍♂️');
    expect(scrubbedStr).toEqual('⭐️‍');
  });

  it('should replace unicode', () => {
    const scrubbedStr = scrubStr('𝖀𝖓𝖎𝖈𝖔𝖉𝖊');
    expect(scrubbedStr).toEqual('loremip');
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
          href: 'https://hello.atlassian.net/wiki/spaces/TEAMA/pages/838645985',
        },
      },
    ];

    expect(
      scrubLink(originalMarks, {
        valueReplacements: {
          href: () =>
            'https://hello.atlassian.net/wiki/spaces/TEAMA/pages/838645985',
        },
      }),
    ).toEqual(expectedMarks);
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

    expect(
      scrubLink(originalMarks, {
        valueReplacements: {
          href: () =>
            'https://hello.atlassian.net/wiki/spaces/TEAMA/pages/838645985',
        },
      }),
    ).toEqual(originalMarks);
  });
});
