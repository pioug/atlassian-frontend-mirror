import {
  isCodeViewerItem,
  getLanguage,
} from '../../../../../newgen/viewers/codeViewer/util';
import { ProcessedFileState } from '@atlaskit/media-client';

describe('CodeViewer Utility Function', () => {
  const isCodeItemCasesDirectMapping = [
    '.abap',
    '.ada',
    '.c',
    '.css',
    '.d',
    '.dart',
    '.go',
    '.graphql',
    '.groovy',
    '.html',
    '.java',
    '.json',
    '.matlab',
    '.xml',
    '.lua',
    '.puppet',
    '.qml',
    '.sass',
    '.sql',
    '.php',
    '.r',
    '.swift',
    '.tcl',
    '.vala',
    '.vhdl',
    '.xquery',
  ];

  function getFileState(name: string): ProcessedFileState {
    const fileState: ProcessedFileState = {
      id: 'some-id',
      status: 'processed',
      name: name,
      size: 11222,
      mediaType: 'archive',
      mimeType: 'zip',
      artifacts: {},
      representations: {
        image: {},
      },
    };
    return fileState;
  }

  // testing the direct mapping cases for code items, i.e item with the filename test.c has the language "c"
  test.each(isCodeItemCasesDirectMapping)(
    'should calculate based on the name %p that it IS a Codeviewer item with the language %p',
    name => {
      expect(getLanguage(getFileState(name))).toEqual(
        name.split('.').pop() as string,
      );
      expect(isCodeViewerItem(getFileState(name))).toEqual(true);
    },
  );

  // extensions != language name, but it is a code item, i.e item with the filename test.py has the language "python"
  [
    { extensions: ['.as', '.asc'], language: 'actionscript' },
    { extensions: ['.ino'], language: 'arduino' },
    { extensions: ['.au3'], language: 'autoit' },
    { extensions: ['.h', '.c++'], language: 'c++' },
    { extensions: ['.coffee'], language: 'coffeescript' },
    { extensions: ['.cs'], language: 'csharp' },
    { extensions: ['.cu'], language: 'cuda' },
    { extensions: ['.pas', '.dpr', '.dproj', '.dpk'], language: 'delphi' },
    { extensions: ['.ex', '.exs'], language: 'elixir' },
    { extensions: ['.erl', '.hrl'], language: 'erlang' },
    {
      extensions: ['.f90', '.for', '.f', '.fpp', '.i', '.i90', '.ftn'],
      language: 'fortran',
    },
    { extensions: ['.dbc'], language: 'foxpro' },
    { extensions: ['.hs', '.has'], language: 'haskell' },
    { extensions: ['.hx'], language: 'haxe' },
    { extensions: ['.js'], language: 'javascript' },
    { extensions: ['.jl'], language: 'julia' },
    { extensions: ['.kt'], language: 'kotlin' },
    { extensions: ['.m', '.mm'], language: 'objective-c' },
    { extensions: ['.j'], language: 'objective-j' },
    { extensions: ['.tex'], language: 'latex' },
    { extensions: ['.nb', '.cdf'], language: 'mathematica' },
    { extensions: ['.cma'], language: 'ocaml' },
    { extensions: ['.pl'], language: 'perl' },
    { extensions: ['.py'], language: 'python' },
    { extensions: ['.ps1', '.psd1', '.psm1'], language: 'powershell' },
    { extensions: ['.rb'], language: 'ruby' },
    { extensions: ['.rst'], language: 'restructuredtext' },
    { extensions: ['.rs'], language: 'rust' },
    { extensions: ['.rkt'], language: 'racket' },
    { extensions: ['.sh'], language: 'shell' },
    { extensions: ['.sc', '.sch'], language: 'scheme' },
    { extensions: ['.txt', '.msg', '.log', '.csv'], language: 'text' },
    { extensions: ['.ts'], language: 'typescript' },
    { extensions: ['.v'], language: 'verilog' },
    { extensions: ['.xq', '.xql', '.xqm', '.xqy'], language: 'xquery' },
  ].forEach(({ extensions, language }) => {
    it(`should calculate based on the name(s) ${extensions} that it IS a Codeviewer item with the language ${language}`, () => {
      extensions.forEach(function (name) {
        expect(getLanguage(getFileState(name))).toEqual(language);
        expect(isCodeViewerItem(getFileState(name))).toEqual(true);
      });
    });
  });
});
