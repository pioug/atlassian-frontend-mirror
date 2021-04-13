import {
  doc,
  h3,
  hardBreak,
  p,
  panel,
  strong,
  underline,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from '../../_test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('panel with bold mark', () => {
    const WIKI_NOTATION = `{panel}Some *bold* code here{panel}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(panel({})(p('Some ', strong('bold'), ' code here'))),
    );
  });

  // @TODO Title not supported. Confirm with JIRA
  describe('panel with title', () => {
    const WIKI_NOTATION = `{panel:title=Hello}Just a hello world here{panel}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(panel({})(p('Just a hello world here'))),
    );
  });

  // @TODO Styles not supported. Confirm with JIRA
  describe('panel with styles and underline mark', () => {
    const WIKI_NOTATION = `{panel:borderStyle=dashed|borderColor=blue}some +block+ here{panel}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(panel({})(p('some ', underline('block'), ' here'))),
    );
  });

  // @TODO Styles not supported. Confirm with JIRA (convert red to 'error' panel?)
  describe('panel with styles and underline mark', () => {
    const WIKI_NOTATION = `{panel:bgColor=red}this panel has only background color{panel}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(panel({})(p('this panel has only background color'))),
    );
  });

  // @TODO Styles not supported. Confirm with JIRA
  describe('panel with styles and bold mark', () => {
    const WIKI_NOTATION = `{panel:title=My Title|borderStyle=dashed|borderColor=#ccc|bgColor=#FFFFCE|titleBGColor=#F7D6C1}a block of text surrounded with a *panel*{panel}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(panel({})(p('a block of text surrounded with a ', strong('panel')))),
    );
  });

  // @TODO Title not supported. Confirm with JIRA
  describe('panel with title and list-like text', () => {
    const WIKI_NOTATION = `{panel:title=Technical Question 1}
Some explanations here:

1a. step one
1b. step two
1c. step three
1d. step four
{panel}
h3. Response To Technical Question 1`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        panel({})(
          p('Some explanations here:'),
          p(
            '1a. step one',
            hardBreak(),
            '1b. step two',
            hardBreak(),
            '1c. step three',
            hardBreak(),
            '1d. step four',
          ),
        ),
        h3('Response To Technical Question 1'),
      ),
    );
  });

  // @TODO Title not supported. Confirm with JIRA
  describe('panel with emoji in title', () => {
    const WIKI_NOTATION = `{panel:title=(!) I like cheese}Some *bold* code here{panel}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(panel({})(p('Some ', strong('bold'), ' code here'))),
    );
  });
});
