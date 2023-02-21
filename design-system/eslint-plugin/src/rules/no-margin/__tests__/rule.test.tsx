import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-margin', rule, {
  valid: [
    // CSSObjectExpression
    { code: `const styles = css({padding: '8px'})` },
    { code: `const styles = css({padding: '8px', color: 'red'})` },
    // cssTemplateLiteral
    { code: `const cssTemplateLiteral = css\`color: red\`` },
    { code: `const cssTemplateLiteral = css\`padding: 8px; color: red\`` },
    // StyledTemplateLiteral
    { code: `const styledTemplateLiteral = styled.p\`color: red;\`;` },
    {
      code: `const styledTemplateLiteral = styled.p\`padding: 8px; color: red;\`;`,
    },
    // StyledObjectExpression
    {
      code: `const Container = styled.div({padding: '8px'});`,
    },
    {
      code: `const Container = styled.div({padding: '8px', color: 'red'});`,
    },
  ],
  invalid: [
    // CSSObjectExpression
    {
      code: `const styles = css({margin: '8px 2px'})`,
      errors: [{ messageId: 'noMargin' }],
    },
    {
      code: `const styles = css({margin: '8px 2px', color: 'red'})`,
      errors: [{ messageId: 'noMargin' }],
    },
    {
      code: `const styles = css({marginTop: '8px'})`,
      errors: [{ messageId: 'noMargin' }],
    },
    // cssTemplateLiteral
    {
      code: `const cssTemplateLiteral = css\`margin: 8px 2px\``,
      errors: [{ messageId: 'noMargin' }],
    },
    {
      code: `const cssTemplateLiteral = css\`margin: 8px 2px; color: red;\``,
      errors: [{ messageId: 'noMargin' }],
    },
    {
      code: `const cssTemplateLiteral = css\`margin-top: 8px\``,
      errors: [{ messageId: 'noMargin' }],
    },
    // StyledTemplateLiteral
    {
      code: `const styledTemplateLiteral = styled.p\`color: red;
      margin: 2px\`;`,
      errors: [{ messageId: 'noMargin' }],
    },
    {
      code: `const styledTemplateLiteral = styled.p\`color: red;
      margin-left: 2px\`;`,
      errors: [{ messageId: 'noMargin' }],
    },
    {
      code: `const Container = styled.div({fontSize: 12, margin: '8px'});`,
      errors: [{ messageId: 'noMargin' }],
    },
  ],
});
