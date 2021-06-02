import React from 'react';
import { shallow } from 'enzyme';
import { MediaTypeIcon } from '@atlaskit/media-ui/media-type-icon';
import { MimeTypeIcon } from '@atlaskit/media-ui';
import PdfDocumentIcon from '@atlaskit/icon-file-type/glyph/pdf-document/24';
import GifIcon from '@atlaskit/icon-file-type/glyph/gif/24';
import PowerpointPresentationIcon from '@atlaskit/icon-file-type/glyph/powerpoint-presentation/24';
import WordDocumentIcon from '@atlaskit/icon-file-type/glyph/word-document/24';
import SketchIcon from '@atlaskit/icon-file-type/glyph/sketch/24';
import FigmaIcon from '@atlaskit/icon-file-type/glyph/figma/24';
import ExecutableIcon from '@atlaskit/icon-file-type/glyph/executable/24';
import GoogleDocIcon from '@atlaskit/icon-file-type/glyph/google-doc/24';
import GoogleFormIcon from '@atlaskit/icon-file-type/glyph/google-form/24';
import GoogleSheetIcon from '@atlaskit/icon-file-type/glyph/google-sheet/24';
import GoogleSlideIcon from '@atlaskit/icon-file-type/glyph/google-slide/24';
import ExcelSpreadsheetIcon from '@atlaskit/icon-file-type/glyph/excel-spreadsheet/24';
import SpreadsheetIcon from '@atlaskit/icon-file-type/glyph/spreadsheet/24';
import PresentationIcon from '@atlaskit/icon-file-type/glyph/presentation/24';
import SourceCodeIcon from '@atlaskit/icon-file-type/glyph/source-code/24';

describe('MimeType Icon', () => {
  it('mimeType cannot be categorised, default to mediaTypeIcon', () => {
    const component = shallow(
      <MimeTypeIcon
        mediaType={'image'}
        mimeType={'image/png'}
        name={'test.png'}
      />,
    );
    const wrapper = component.find(MediaTypeIcon);
    expect(wrapper).toHaveLength(1);
  });

  it('mimeType can be categorised, thus render the appropriate mimeTypeIcon', () => {
    [
      { mime: 'application/pdf', name: '.pdf', icon: PdfDocumentIcon },
      {
        mime:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        name: '.excel',
        icon: ExcelSpreadsheetIcon,
      },
      { mime: 'image/gif', name: '.gif', icon: GifIcon },
      {
        mime: 'application/vnd.ms-powerpoint',
        name: '.powerpoint',
        icon: PowerpointPresentationIcon,
      },
      {
        mime: 'application/msword',
        name: '.wordDoc',
        icon: WordDocumentIcon,
      },
      {
        mime: 'binary/octet-stream',
        name: '.sketch',
        icon: SketchIcon,
      },
      {
        mime: 'application/octet-stream',
        name: '.fig',
        icon: FigmaIcon,
      },
      { mime: 'binary/octet-stream', name: '.exe', icon: ExecutableIcon },
      {
        mime: 'application/vnd.google-apps.document',
        name: '.google-docs',
        icon: GoogleDocIcon,
      },
      {
        mime: 'application/vnd.google-apps.presentation',
        name: '.google-slides',
        icon: GoogleSlideIcon,
      },
      {
        mime: 'application/vnd.google-apps.spreadsheet',
        name: '.goole-sheets',
        icon: GoogleSheetIcon,
      },
      {
        mime: 'application/vnd.google-apps.form',
        name: '.google-form',
        icon: GoogleFormIcon,
      },
      { mime: 'text/csv', name: '.csv', icon: SpreadsheetIcon },
      {
        mime: 'application/x-iwork-keynote-sffkey',
        name: '.presentation',
        icon: PresentationIcon,
      },
      { mime: 'text/plain', name: '.source-code.c', icon: SourceCodeIcon },
    ].forEach((doc) => {
      const component = shallow(
        <MimeTypeIcon mediaType={'doc'} mimeType={doc.mime} name={doc.name} />,
      );
      const mediaIcon = component.find(MediaTypeIcon);
      expect(mediaIcon).toHaveLength(0);

      const mimeIcon = component.find(doc.icon);
      expect(mimeIcon).toHaveLength(1);
    });
  });
});
