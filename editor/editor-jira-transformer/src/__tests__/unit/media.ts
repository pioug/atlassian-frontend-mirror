import * as assert from 'assert';
import {
  doc,
  mediaGroup,
  mediaSingle,
  media,
  p,
} from '@atlaskit/editor-test-helpers';
import {
  checkParse,
  checkEncode,
  checkParseEncodeRoundTrips,
} from './_test-helpers';
import { createJIRASchema } from '@atlaskit/adf-schema';
import { JIRATransformer } from '../../index';

const schema = createJIRASchema({ allowMedia: true });

const fragment1 = `
<span class="image-wrap" style="">
  <a
    id="262500_thumb"
    href="/secure/attachment/262500/262500_foo.png"
    title="foo.png"
    file-preview-type="image"
    file-preview-id="262500"
    file-preview-title="foo.png"
    resolved=""
  >
    <jira-attachment-thumbnail
      url="https://jdog.jira-dev.com/secure/thumbnail/262500/foo.png?default=false"
      jira-url="https://jdog.jira-dev.com/secure/thumbnail/262500/foo.png"
      filename="foo.png"
      resolved=""
    >
      <img
        alt="foo.png"
        src="https://jdog.jira-dev.com/secure/thumbnail/262500/foo.png?default=false"
        class="thumbnail-attachment"
        data-media-services-id="42"
        data-media-services-type="file"
        data-attachment-name="foo.png"
        data-attachment-type="thumbnail"
      >
    </jira-attachment-thumbnail>
  </a>
</span>
`;

const fragment2 = `
<span class="nobr">
  <a
    href="/secure/attachment/263215/263215_bar.pdf"
    title="bar.pdf attached to IR-694"
    class="file-attachment"
    data-media-services-id="36"
    data-media-services-type="file"
    data-attachment-name="bar.pdf"
    data-attachment-type="file"
  >
    bar.pdf
    <sup>
      <img
        class="rendericon"
        src="/images/icons/link_attachment_7.gif"
        height="7"
        width="7"
        align="absmiddle"
        alt=""
        border="0"
      >
    </sup>
  </a>
</span>
`;

describe('JIRATransformer', () => {
  describe('media', () => {
    describe('mediaGroup', () => {
      checkParseEncodeRoundTrips(
        'thumbnail type (viewContext)',
        schema,
        '<p class="mediaGroup"><span class="image-wrap"><a><jira-attachment-thumbnail><img alt="foo.png" src="HOST/file/42/image?token=TOKEN&client=CLIENT_ID&collection=&width=200&height=200&mode=fit" data-attachment-type="thumbnail" data-attachment-name="foo.png" data-media-services-type="file" data-media-services-id="42"></jira-attachment-thumbnail></a></span></p>',
        doc(
          mediaGroup(
            media({
              id: '42',
              type: 'file',
              collection: '',
              __fileName: 'foo.png',
              __displayType: 'thumbnail',
            })(),
          ),
        ),
        {},
        {
          viewContext: {
            baseUrl: 'HOST',
            clientId: 'CLIENT_ID',
            token: 'TOKEN',
            collection: '',
          },
        },
      );

      checkParseEncodeRoundTrips(
        'file type',
        schema,
        '<p class="mediaGroup"><span class="nobr"><a data-attachment-type="file" data-attachment-name="foo.pdf" data-media-services-type="file" data-media-services-id="42">foo.pdf</a></span></p>',
        doc(
          mediaGroup(
            media({
              id: '42',
              type: 'file',
              collection: '',
              __fileName: 'foo.pdf',
              __displayType: 'file',
            })(),
          ),
        ),
      );

      checkParse(
        '!foo.jpg|thumbnail!',
        schema,
        [`<p>${fragment1}</p>`],
        doc(
          mediaGroup(
            media({
              id: '42',
              type: 'file',
              collection: '',
              __fileName: 'foo.png',
              __displayType: 'thumbnail',
            })(),
          ),
        ),
      );

      checkParse(
        '[^bar.pdf]',
        schema,
        [`<p>${fragment2}</p>`],
        doc(
          mediaGroup(
            media({
              id: '36',
              type: 'file',
              collection: '',
              __fileName: 'bar.pdf',
              __displayType: 'file',
            })(),
          ),
        ),
      );

      checkParse(
        '!foo.jpg|thumbnail! [^bar.pdf]',
        schema,
        [`<p>${fragment1}${fragment2}</p>`],
        doc(
          mediaGroup(
            media({
              id: '42',
              type: 'file',
              collection: '',
              __fileName: 'foo.png',
              __displayType: 'thumbnail',
            })(),
            media({
              id: '36',
              type: 'file',
              collection: '',
              __fileName: 'bar.pdf',
              __displayType: 'file',
            })(),
          ),
        ),
      );

      checkParse(
        'thumbnail type (uploadContext)',
        schema,
        [
          '<p class="mediaGroup"><span class="image-wrap"><a><jira-attachment-thumbnail><img alt="foo.png" src="HOST/file/42/image?token=TOKEN&client=CLIENT_ID&collection=MediaServicesSample&width=200&height=200&mode=fit" data-attachment-type="thumbnail" data-attachment-name="foo.png" data-media-services-type="file" data-media-services-id="42"></jira-attachment-thumbnail></a></span></p>',
        ],
        doc(
          mediaGroup(
            media({
              id: '42',
              type: 'file',
              collection: '',
              __fileName: 'foo.png',
              __displayType: 'thumbnail',
            })(),
          ),
        ),
      );

      checkParse(
        'Converts a paragraph with mixed text and media content',
        schema,
        [
          `<p>dgdsfg <span class="image-wrap" style=""><a><jira-attachment-thumbnail url="HOST/secure/thumbnail/10000/some_image.jpg?default=false" jira-url="HOST/secure/thumbnail/10000/some_image.jpg" filename="Some Image.jpg"><img src="HOST/servicedesk/customershim/secure/thumbnail/10000/some_image.jpg?fromIssue=10001" data-attachment-name="Some Image.jpg" data-attachment-type="thumbnail" data-media-services-id="42" data-media-services-type="file" style="border: 0px solid black"></jira-attachment-thumbnail></a></span> </p>`,
        ],
        doc(
          p('dgdsfg '),
          mediaGroup(
            media({
              id: '42',
              type: 'file',
              collection: '',
              __fileName: 'Some Image.jpg',
              __displayType: 'thumbnail',
            })(),
          ),
        ),
      );

      checkEncode(
        'thumbnail type (uploadContext)',
        schema,
        doc(
          mediaGroup(
            media({
              id: '42',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileName: 'foo.png',
              __displayType: 'thumbnail',
            })(),
          ),
        ),
        '<p class="mediaGroup"><span class="image-wrap"><a><jira-attachment-thumbnail><img alt="foo.png" src="HOST/file/42/image?token=TOKEN&client=CLIENT_ID&collection=MediaServicesSample&width=200&height=200&mode=fit" data-attachment-type="thumbnail" data-attachment-name="foo.png" data-media-services-type="file" data-media-services-id="42" data-media-services-collection="MediaServicesSample"></jira-attachment-thumbnail></a></span></p>',
        {},
        {
          uploadContext: {
            baseUrl: 'HOST',
            clientId: 'CLIENT_ID',
            token: 'TOKEN',
            collection: 'MediaServicesSample',
          },
        },
      );

      checkEncode(
        'file type (without __displayType)',
        schema,
        doc(
          mediaGroup(
            media({
              id: '42',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileName: 'foo.pdf',
              __displayType: null,
              __fileMimeType: 'application/pdf',
            })(),
          ),
        ),
        '<p class="mediaGroup"><span class="nobr"><a data-attachment-type="file" data-attachment-name="foo.pdf" data-media-services-type="file" data-media-services-id="42" data-media-services-collection="MediaServicesSample">foo.pdf</a></span></p>',
      );

      checkEncode(
        'thumbnail type (without __displayType)',
        schema,
        doc(
          mediaGroup(
            media({
              id: '42',
              type: 'file',
              collection: 'MediaServicesSample',
              __fileName: 'foo.png',
              __displayType: null,
              __fileMimeType: 'image/png',
            })(),
          ),
        ),
        '<p class="mediaGroup"><span class="image-wrap"><a><jira-attachment-thumbnail><img alt="foo.png" data-attachment-type="thumbnail" data-attachment-name="foo.png" data-media-services-type="file" data-media-services-id="42" data-media-services-collection="MediaServicesSample"></jira-attachment-thumbnail></a></span></p>',
      );

      it('should not throw error when trying to parse media nodes within non-media schema', () => {
        const schema = createJIRASchema({ allowMedia: false });
        const transformer = new JIRATransformer(schema);

        assert.doesNotThrow(
          () => transformer.parse(`<p>${fragment1}</p>`),
          'JIRATransformer.parse() should not throw exception',
        );
        expect(() => transformer.parse(`<p>${fragment1}</p>`)).not.toThrow();
      });

      it('should not throw error when trying to parse media groups within non-media schema', () => {
        const schema = createJIRASchema({ allowMedia: false });
        const transformer = new JIRATransformer(schema);

        assert.doesNotThrow(
          () =>
            transformer.parse(
              '<p class="mediaGroup"><span class="image-wrap"><a><jira-attachment-thumbnail><img alt="foo.png" src="HOST/file/42/image?token=TOKEN&client=CLIENT_ID&collection=&width=200&height=200&mode=fit" data-attachment-type="thumbnail" data-attachment-name="foo.png" data-media-services-type="file" data-media-services-id="42"></jira-attachment-thumbnail></a></span></p>',
            ),
          'JIRATransformer.parse() should not throw exception',
        );
        expect(() => transformer.parse(`<p>${fragment1}</p>`)).not.toThrow();
      });
    });

    describe('mediaSingle', () => {
      checkParseEncodeRoundTrips(
        'thumbnail type (viewContext)',
        schema,
        '<p class="mediaSingle"><span class="image-wrap"><a><jira-attachment-thumbnail><img alt="foo.png" src="HOST/file/42/image?token=TOKEN&client=CLIENT_ID&collection=&width=200&height=200&mode=fit" data-attachment-type="thumbnail" data-attachment-name="foo.png" data-width="200" data-height="200" data-media-services-type="file" data-media-services-id="42"></jira-attachment-thumbnail></a></span></p>',
        doc(
          mediaSingle({ layout: 'center' })(
            media({
              id: '42',
              type: 'file',
              collection: '',
              width: 200,
              height: 200,
              __fileName: 'foo.png',
              __displayType: 'thumbnail',
            })(),
          ),
        ),
        {},
        {
          viewContext: {
            baseUrl: 'HOST',
            clientId: 'CLIENT_ID',
            token: 'TOKEN',
            collection: '',
          },
        },
      );

      checkParse(
        'thumbnail type (uploadContext)',
        schema,
        [
          '<p class="mediaSingle"><span class="image-wrap"><a><jira-attachment-thumbnail><img alt="foo.png" src="HOST/file/42/image?token=TOKEN&client=CLIENT_ID&collection=MediaServicesSample&width=200&height=200&mode=fit" data-attachment-type="thumbnail" data-attachment-name="foo.png" data-media-services-type="file" data-media-services-id="42" data-width="200" data-height="200"></jira-attachment-thumbnail></a></span></p>',
        ],
        doc(
          mediaSingle({ layout: 'center' })(
            media({
              id: '42',
              type: 'file',
              collection: '',
              width: 200,
              height: 200,
              __fileName: 'foo.png',
              __displayType: 'thumbnail',
            })(),
          ),
        ),
      );

      checkEncode(
        'thumbnail type (uploadContext)',
        schema,
        doc(
          mediaSingle({ layout: 'center' })(
            media({
              id: '42',
              type: 'file',
              collection: 'MediaServicesSample',
              width: 200,
              height: 200,
              __fileName: 'foo.png',
              __displayType: 'thumbnail',
            })(),
          ),
        ),
        '<p class="mediaSingle"><span class="image-wrap"><a><jira-attachment-thumbnail><img alt="foo.png" src="HOST/file/42/image?token=TOKEN&client=CLIENT_ID&collection=MediaServicesSample&width=200&height=200&mode=fit" data-attachment-type="thumbnail" data-attachment-name="foo.png" data-width="200" data-height="200" data-media-services-type="file" data-media-services-id="42" data-media-services-collection="MediaServicesSample"></jira-attachment-thumbnail></a></span></p>',
        {},
        {
          uploadContext: {
            baseUrl: 'HOST',
            clientId: 'CLIENT_ID',
            token: 'TOKEN',
            collection: 'MediaServicesSample',
          },
        },
      );

      checkEncode(
        'thumbnail type (without __displayType)',
        schema,
        doc(
          mediaSingle({ layout: 'center' })(
            media({
              id: '42',
              type: 'file',
              collection: 'MediaServicesSample',
              width: 200,
              height: 200,
              __fileName: 'foo.png',
              __displayType: null,
              __fileMimeType: 'image/png',
            })(),
          ),
        ),
        '<p class="mediaSingle"><span class="image-wrap"><a><jira-attachment-thumbnail><img alt="foo.png" data-attachment-type="thumbnail" data-attachment-name="foo.png" data-width="200" data-height="200" data-media-services-type="file" data-media-services-id="42" data-media-services-collection="MediaServicesSample"></jira-attachment-thumbnail></a></span></p>',
      );
    });
  });
});
