import React from 'react';
import { makeConfluenceObjectResult } from '../../../__tests__/unit/_test-util';
import { ContentType } from '../../../model/Result';
import FileTypes24File24ImageIcon from '@atlaskit/icon-file-type/glyph/image/24';
import FileTypes24File24ExcelSpreadsheetIcon from '@atlaskit/icon-file-type/glyph/excel-spreadsheet/24';
import FileTypes24File24VideoIcon from '@atlaskit/icon-file-type/glyph/video/24';
import FileTypes24File24ArchiveIcon from '@atlaskit/icon-file-type/glyph/archive/24';
import FileTypes24File24PowerpointPresentationIcon from '@atlaskit/icon-file-type/glyph/powerpoint-presentation/24';
import FileTypes24File24SourceCodeIcon from '@atlaskit/icon-file-type/glyph/source-code/24';
import FileTypes24File24AudioIcon from '@atlaskit/icon-file-type/glyph/audio/24';
import FileTypes24File24WordDocumentIcon from '@atlaskit/icon-file-type/glyph/word-document/24';
import FileTypes24File24PdfDocumentIcon from '@atlaskit/icon-file-type/glyph/pdf-document/24';
import FileTypes24File24GenericIcon from '@atlaskit/icon-file-type/glyph/generic/24';

import { getAvatarForConfluenceObjectResult } from '../../confluence-avatar-util';

const TEST_FILE_PREFIXES = [
  '',
  'test123',
  '©©©!@#$%^&*()',
  'test.zip',
  'test.jpeg',
];

/**
 * Given a list of file extensions, return an array of test filenames containing
 * those file extensions to test against.
 */
function generateTestCasesForExtensions(extensionsToTest: Array<string>) {
  // generate a 2d array of filenames
  const tests = extensionsToTest.map((extension: string) => {
    return TEST_FILE_PREFIXES.map(prefix => `${prefix}.${extension}`);
  });
  // flatten the array, done
  return ([] as Array<string>).concat(...tests);
}

describe('confluence-avatar-util', () => {
  function executeTest(
    fileName: string,
    iconClass: string,
    ExpectedAvatar: React.ComponentClass<any>,
  ) {
    const confluenceResult = makeConfluenceObjectResult({
      contentType: ContentType.ConfluenceAttachment,
      name: fileName,
      iconClass: iconClass,
    });

    // assert correct icon is returned with correct props
    const avatar = getAvatarForConfluenceObjectResult(confluenceResult);
    expect(avatar).toEqual(<ExpectedAvatar label={fileName} size="medium" />);
  }

  function describeTestGroup(
    groupType: string,
    testExtensions: string[],
    cqlIconClass: string,
    quickNavIconClass: string,
    expectedAvatar: React.ComponentClass<any, any>,
  ) {
    describe(`${groupType} attachments`, () => {
      const testCases = generateTestCasesForExtensions(testExtensions);
      testCases.forEach(testFileName => {
        it(`file name should be correctly mapped to the ${groupType} attachment icon: ${testFileName}`, () => {
          executeTest(testFileName, cqlIconClass, expectedAvatar);
          executeTest(testFileName, quickNavIconClass, expectedAvatar);
        });
      });
    });
  }

  [
    {
      id: 'image',
      quickNavIconClass: 'content-type-attachment-image',
      cqlIconClass: 'icon-file-image',
      extensions: ['gif', 'jpeg', 'jpg', 'png'],
      expectedAvatar: FileTypes24File24ImageIcon,
    },
    {
      id: 'audio',
      quickNavIconClass: 'content-type-attachment-multimedia',
      cqlIconClass: 'icon-file-multimedia',
      extensions: ['wma', 'wmv', 'ram', 'mp3'],
      expectedAvatar: FileTypes24File24AudioIcon,
    },
    {
      id: 'code',
      quickNavIconClass: 'content-type-attachment-code',
      cqlIconClass: 'icon-file-code',
      extensions: ['xml', 'html', 'js', 'css', 'java', 'jar', 'war', 'ear'],
      expectedAvatar: FileTypes24File24SourceCodeIcon,
    },
    {
      id: 'document',
      quickNavIconClass: 'content-type-attachment-document',
      cqlIconClass: 'icon-file-document',
      extensions: ['docx', 'dotx', 'doc', 'dot'],
      expectedAvatar: FileTypes24File24WordDocumentIcon,
    },
    {
      id: 'pdf',
      quickNavIconClass: 'content-type-attachment-pdf',
      cqlIconClass: 'icon-file-pdf',
      extensions: ['pdf'],
      expectedAvatar: FileTypes24File24PdfDocumentIcon,
    },
    {
      id: 'presentation',
      quickNavIconClass: 'content-type-attachment-presentation',
      cqlIconClass: 'icon-file-presentation',
      extensions: ['pptx', 'ppsx', 'potx', 'pot', 'ppt', 'pptm'],
      expectedAvatar: FileTypes24File24PowerpointPresentationIcon,
    },
    {
      id: 'spreadsheet',
      quickNavIconClass: 'content-type-attachment-excel',
      cqlIconClass: 'icon-file-presentation',
      extensions: ['xlt', 'xls', 'xlsm', 'xlsx', 'xlst'],
      expectedAvatar: FileTypes24File24ExcelSpreadsheetIcon,
    },
    {
      id: 'video',
      quickNavIconClass: 'content-type-attachment-multimedia',
      cqlIconClass: 'icon-file-video',
      extensions: ['mov', 'mpeg', 'mpg', 'mp4', 'avi'],
      expectedAvatar: FileTypes24File24VideoIcon,
    },
    {
      id: 'zip',
      quickNavIconClass: 'content-type-attachment-zip',
      cqlIconClass: 'icon-file-zip',
      extensions: ['zip'],
      expectedAvatar: FileTypes24File24ArchiveIcon,
    },
    {
      id: 'generic',
      quickNavIconClass: 'dummy-unmatched-icon-class',
      cqlIconClass: 'dummy-unmatched-icon-class',
      extensions: ['unknown', 'test'],
      expectedAvatar: FileTypes24File24GenericIcon,
    },
  ].forEach(testGroup => {
    describeTestGroup(
      testGroup.id,
      testGroup.extensions,
      testGroup.cqlIconClass,
      testGroup.quickNavIconClass,
      testGroup.expectedAvatar,
    );
  });
});
