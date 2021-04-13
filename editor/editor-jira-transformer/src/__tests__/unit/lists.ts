import {
  doc,
  p,
  ul,
  li,
  ol,
  strong,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from './_test-helpers';
import { createJIRASchema } from '@atlaskit/adf-schema';

const schema = createJIRASchema({ allowLists: true });

describe('JIRATransformer', () => {
  describe('lists', () => {
    checkParseEncodeRoundTrips(
      'bullet list',
      schema,
      '<ul class="alternate" type="disc"><li data-parent="ul">one</li><li data-parent="ul">two</li></ul>',
      doc(ul(li(p('one')), li(p('two')))),
    );

    checkParseEncodeRoundTrips(
      'ordered list',
      schema,
      '<ol><li data-parent="ol">one</li><li data-parent="ol">two</li></ol>',
      doc(ol(li(p('one')), li(p('two')))),
    );

    checkParseEncodeRoundTrips(
      'bullet list with strong',
      schema,
      '<ul class="alternate" type="disc"><li data-parent="ul">A piggy</li><li data-parent="ul"><b>Bigger</b> piggy</li></ul>',
      doc(ul(li(p('A piggy')), li(p(strong('Bigger'), ' piggy')))),
    );

    checkParseEncodeRoundTrips(
      'ordered list with strong',
      schema,
      '<ol><li data-parent="ol">A piggy</li><li data-parent="ol"><b>Bigger</b> piggy</li></ol>',
      doc(ol(li(p('A piggy')), li(p(strong('Bigger'), ' piggy')))),
    );

    checkParseEncodeRoundTrips(
      'nested unordered list with no text content',
      schema,
      '<ul class="alternate" type="disc"><li data-parent="ul"><ul class="alternate" type="circle"><li data-parent="ul"><ul class="alternate" type="square"><li data-parent="ul">test</li></ul></li></ul></li></ul>',
      doc(ul(li(p(''), ul(li(p(''), ul(li(p('test')))))))),
    );

    checkParseEncodeRoundTrips(
      'nested ordered list with no text content',
      schema,
      '<ol><li data-parent="ol"><ol><li data-parent="ol"><ol><li data-parent="ol">test</li></ol></li></ol></li></ol>',
      doc(ol(li(p(''), ol(li(p(''), ol(li(p('test')))))))),
    );

    checkParseEncodeRoundTrips(
      'nested ordered list',
      schema,
      '<ol><li data-parent="ol">one</li><li data-parent="ol">two<ol><li data-parent="ol">two.one</li><li data-parent="ol">two.two</li><li data-parent="ol">two.three</li></ol></li><li data-parent="ol">three</li></ol>',
      doc(
        ol(
          li(p('one')),
          li(
            p('two'),
            ol(li(p('two.one')), li(p('two.two')), li(p('two.three'))),
          ),
          li(p('three')),
        ),
      ),
    );

    checkParseEncodeRoundTrips(
      'nested bullet list',
      schema,
      '<ul class="alternate" type="disc"><li data-parent="ul">one</li><li data-parent="ul">two<ul class="alternate" type="circle"><li data-parent="ul">two.one</li><li data-parent="ul">two.two</li><li data-parent="ul">two.three<ul class="alternate" type="square"><li data-parent="ul">two.three.one</li><li data-parent="ul">two.three.two</li></ul></li><li data-parent="ul">two.four</li></ul></li><li data-parent="ul">three</li></ul>',
      doc(
        ul(
          li(p('one')),
          li(
            p('two'),
            ul(
              li(p('two.one')),
              li(p('two.two')),
              li(
                p('two.three'),
                ul(li(p('two.three.one')), li(p('two.three.two'))),
              ),
              li(p('two.four')),
            ),
          ),
          li(p('three')),
        ),
      ),
    );

    checkParseEncodeRoundTrips(
      'nested mixed list',
      schema,
      '<ul class="alternate" type="disc"><li data-parent="ul">one</li><li data-parent="ul">two<ol><li data-parent="ol">two.one</li><li data-parent="ol">two.two</li><li data-parent="ol">two.three</li></ol></li><li data-parent="ul">three</li></ul>',
      doc(
        ul(
          li(p('one')),
          li(
            p('two'),
            ol(li(p('two.one')), li(p('two.two')), li(p('two.three'))),
          ),
          li(p('three')),
        ),
      ),
    );
  });
});
