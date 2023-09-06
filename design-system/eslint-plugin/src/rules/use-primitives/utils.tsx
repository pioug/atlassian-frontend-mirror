import type { Rule, Scope } from 'eslint';
import {
  EslintNode,
  getIdentifierInParentScope,
  hasImportDeclaration,
  ImportDeclaration,
  insertImportDeclaration,
  insertImportSpecifier,
  isNodeOfType,
  jsxAttribute,
  JSXAttribute,
  JSXElement,
  JSXExpressionContainer,
  jsxIdentifier,
  JSXIdentifier,
  JSXOpeningElement,
  jsxOpeningElement,
  JSXSpreadAttribute,
  JSXText,
  literal,
  Property,
  SpreadElement,
} from 'eslint-codemod-utils';

export const shouldSuggestBox = (
  node: JSXElement,
  // scope: Scope.Scope,
): boolean => {
  if (!node) {
    return false;
  }

  if (!isValidPrimitiveElement(node)) {
    return false;
  }

  /**
   * Check for empty elements: `<div></div>` || `<span></span>`
   */
  if (node.children.length === 0) {
    return true;
  }

  /**
   * Check for elements containing only whitespace. e.g. `<div> </div>` || `<span> </span>`
   */
  if (containsOnlyWhitespace(node)) {
    return true;
  }

  /**
   * If an element contains more than one JSX child, then we don't want to convert it.
   */
  const JSXChildren = getChildrenByType(node, ['JSXElement']);
  if (JSXChildren.length > 1) {
    return false;
  }

  /**
   * Check for things like:
   * ```
   * <div>
   *   <h2>heading</h2>
   *   subheading <= rejected because of standalone piece of text
   * </div>
   * ```
   */
  const nonWhiteSpaceTextChildren = getChildrenByType(node, ['JSXText']).filter(
    (child: EslintNode) => !isWhiteSpace((child as JSXText).value),
  );
  if (nonWhiteSpaceTextChildren.length > 0) {
    return false;
  }

  // Possible since we now know the div only has one child
  // const singleChild = node.children[0];

  // // let's narrow down the type inside of the expression
  // if (isNodeOfType(singleChild, 'JSXExpressionContainer')) {
  //   const expression = singleChild.expression;

  //   // If an Identifier that is just a string then should be a <Text>, not <Box>
  //   const identifier =
  //     isNodeOfType(expression, 'Identifier') &&
  //     getIdentifierInParentScope(scope, expression.name);

  //   if (
  //     identifier &&
  //     (isVariableAnnotatedWithType(identifier, 'StringTypeAnnotation') ||
  //       isVariableAnnotatedWithType(identifier, 'TSStringKeyword'))
  //   ) {
  //     return false;
  //   }
  // }

  return true;
};

export const shouldSuggestInline = (
  node: JSXElement,
  context: Rule.RuleContext,
): boolean => {
  if (!node) {
    return false;
  }

  if (!isValidPrimitiveElement(node)) {
    return false;
  }

  const cssStyleObject = getCSSPropStyleObject(node, context);
  if (!cssStyleObject) {
    return false;
  }

  if (!hasInlineCompatibleStyles(cssStyleObject)) {
    return false;
  }

  const JSXChildren = getChildrenByType(node, ['JSXElement']);
  if (JSXChildren.length < 2) {
    return false;
  }

  return true;
};

export const shouldSuggestStack = (
  node: JSXElement,
  context: Rule.RuleContext,
): boolean => {
  if (!node) {
    return false;
  }

  if (!isValidPrimitiveElement(node)) {
    return false;
  }

  const cssStyleObject = getCSSPropStyleObject(node, context);
  if (!cssStyleObject) {
    return false;
  }

  if (!hasStackCompatibleStyles(cssStyleObject)) {
    return false;
  }

  const JSXChildren = getChildrenByType(node, ['JSXElement']);
  if (JSXChildren.length < 2) {
    return false;
  }

  return true;
};

export const shouldSuggestText = (
  node: JSXElement | undefined,
  scope: Scope.Scope,
): boolean => {
  if (!node) {
    return true;
  }

  // node doesn't have children then it should be a <Box>
  if (!node.children || node.children.length === 0) {
    return false;
  }

  const containsOnlyText = node.children.filter((child: EslintNode) => {
    return isNodeOfType(child, 'Literal') || isNodeOfType(child, 'JSXText');
  });

  if (containsOnlyText) {
    return true;
  }

  // if the element contains strictly a single child... let's see what we can discover
  if (node.children.length === 1) {
    const singleChild = node.children[0];

    // let's narrow down the type inside of the expression
    if (isNodeOfType(singleChild, 'JSXExpressionContainer')) {
      const expression = singleChild.expression;

      // A direct Literal is another case for only <Text>
      if (isNodeOfType(expression, 'Literal')) {
        return true;
      }

      // If an Identifier then we want to confirm it's just string to suggest only <Text>
      const identifier =
        isNodeOfType(expression, 'Identifier') &&
        getIdentifierInParentScope(scope, expression.name);
      if (
        identifier &&
        (isVariableAnnotatedWithType(identifier, 'StringTypeAnnotation') ||
          isVariableAnnotatedWithType(identifier, 'TSStringKeyword'))
      ) {
        return true;
      }
    }
  }

  return true;
};

export const primitiveFixer = (
  node: EslintNode,
  nodeName: string,
  context: Rule.RuleContext,
) => {
  return (fixer: Rule.RuleFixer) => {
    if (!isNodeOfType(node, 'JSXOpeningElement')) {
      return [];
    }

    const parent = node.parent as unknown as JSXElement;
    if (!isNodeOfType(parent, 'JSXElement')) {
      return [];
    }

    const fixes = [];
    const body = context.getSourceCode().ast.body;
    const imports = body.filter((node): node is ImportDeclaration =>
      isNodeOfType(node, 'ImportDeclaration'),
    );
    let primitivesNode = imports.find((node) =>
      hasImportDeclaration(node, '@atlaskit/primitives'),
    );

    if (!primitivesNode) {
      fixes.push(
        fixer.insertTextBefore(
          body[0],
          `${insertImportDeclaration('@atlaskit/primitives', [nodeName])};\n`,
        ),
      );
    } else {
      fixes.push(
        fixer.replaceText(
          primitivesNode,
          `${insertImportSpecifier(primitivesNode, nodeName)};\n`,
        ),
      );
    }

    const { closingElement } = parent;
    const jsxId = jsxIdentifier(nodeName);

    const attributes = [];

    // Box defaults to div. We only need to add an as prop if it's not a div
    if ((node.name as JSXIdentifier).name !== 'div' && nodeName === 'Box') {
      const asProp = jsxAttribute({
        name: jsxIdentifier('as'),
        value: literal({
          value: `${(node.name as JSXIdentifier).name}`,
          raw: `\"${(node.name as JSXIdentifier).name}\"`,
        }),
      });
      attributes.push(asProp);
    }

    const hasStylingProps =
      getJSXAttributeByName(node, 'style') ||
      getJSXAttributeByName(node, 'css') ||
      getJSXAttributeByName(node, 'class') ||
      getJSXAttributeByName(node, 'className');

    if (hasStylingProps) {
      fixes.push(
        fixer.insertTextBefore(
          node,
          '// TODO: Manually convert styling into props\n',
        ),
      );
    }

    const candidateAttributes = node.attributes
      .map((attr) => {
        // pull out any named attributes we can re-map
        if (isNodeOfType(attr, 'JSXAttribute')) {
          if (attr.name.name === 'data-testid') {
            return jsxAttribute({ ...attr, name: jsxIdentifier('testId') });
          }
        }
        return attr;
      })
      .filter(Boolean) as JSXAttribute[];

    fixes.push(
      fixer.replaceText(
        node as any,
        jsxOpeningElement({
          ...node,
          name: jsxId,
          attributes: candidateAttributes.concat(attributes),
        }).toString(),
      ),
    );

    if (closingElement && closingElement.name) {
      fixes.push(fixer.replaceText(closingElement.name as any, `${jsxId}`));
    }

    return fixes;
  };
};

const isVariableAnnotatedWithType = (
  identifier: Scope.Variable | null,
  typeAnnotation: string,
) => {
  if (!identifier || identifier.identifiers.length === 0) {
    return false;
  }

  const typeAnnotationObject = (identifier as any).identifiers[0]
    ?.typeAnnotation?.typeAnnotation;

  // variable declaration lacks type definitions
  if (!typeAnnotationObject) {
    return false;
  }

  // single type annotation
  if (typeAnnotationObject.type === typeAnnotation) {
    return true;
  }

  return false;
};

const getJSXAttributeByName = (
  node: JSXOpeningElement,
  attrName: string,
): JSXAttribute | undefined => {
  return node.attributes.find(
    (attr: JSXAttribute | JSXSpreadAttribute): boolean => {
      // Ignore JSXSpreadAttributes
      if (!isNodeOfType(attr, 'JSXAttribute')) {
        return false;
      }

      return attr.name.name === attrName;
    },
  ) as JSXAttribute | undefined;
};

export const isWhiteSpace = (value: string) => value.trim() === '';

function containsOnlyWhitespace(node: JSXElement) {
  return node.children.every((child: EslintNode) => {
    if (!isNodeOfType(child, 'JSXText')) {
      return false;
    }

    return isWhiteSpace(child.value);
  });
}

type JSXChild =
  | 'JSXElement'
  | 'JSXExpressionContainer'
  | 'JSXFragment'
  | 'JSXText'
  | 'JSXSpreadChild'[];

export const getChildrenByType = (node: JSXElement, types: JSXChild[]) => {
  return node.children.filter((child: EslintNode) => {
    return types.find((type) => isNodeOfType(child, type as any));
  });
};

// FIXME: This not correctly typed
type CSSPropStyleObject = { [key: string]: any };

const getCSSPropStyleObject = (
  node: JSXElement,
  context: Rule.RuleContext,
): CSSPropStyleObject | undefined => {
  const cssAttr = getJSXAttributeByName(node.openingElement, 'css');
  const styleObj: CSSPropStyleObject = {};

  if (cssAttr && cssAttr.value) {
    const scope = context.getScope();

    const { expression } = cssAttr.value as JSXExpressionContainer;
    const variableDeclarator = getIdentifierInParentScope(
      scope,
      (expression as any).name,
    );

    const defNode = variableDeclarator?.defs[0];
    if (!defNode) {
      return undefined;
    }

    // check if the variable declaration has a call expression init
    // eg we're looking for css() type inits
    if (
      !isNodeOfType(defNode.node, 'VariableDeclarator') &&
      !isNodeOfType(defNode.node.init!, 'CallExpression')
    ) {
      return undefined;
    }

    const { init } = defNode.node;

    // make the sure the init is called 'css'
    if (
      !(isNodeOfType(init.callee, 'Identifier') && init.callee.name === 'css')
    ) {
      return undefined;
    }

    const styles = init.arguments[0];

    if (!styles) {
      return undefined;
    }

    // make sure the styles are object styles (they should be but let's just double check)
    if (!isNodeOfType(styles, 'ObjectExpression')) {
      return undefined;
    }

    styles.properties.forEach((prop: Property | SpreadElement) => {
      if (!isNodeOfType(prop, 'Property')) {
        return;
      }

      if (!isNodeOfType(prop.key, 'Identifier')) {
        return;
      }

      if (!isNodeOfType(prop.value, 'Literal')) {
        return;
      }

      styleObj[prop.key.name] = prop.value.value;
    });
  }
  return styleObj;
};

export const validPrimitiveElements = new Set([
  'div',
  'span',
  'article',
  'aside',
  'dialog',
  'footer',
  'header',
  'li',
  'main',
  'nav',
  'ol',
  'section',
  'ul',
]);

export const isValidPrimitiveElement = (node: JSXElement) => {
  return validPrimitiveElements.has(
    (node.openingElement.name as JSXIdentifier).name,
  );
};

const hasInlineCompatibleStyles = (cssStyleObject: CSSPropStyleObject) => {
  if (!['flex', 'inline-flex'].includes(cssStyleObject['display'])) {
    return false;
  }

  /**
   * Default `flexDirection` is `'row'`, so we can recommend an Inline if
   * it's `undefined`, or if it's explicitly `'row'` or `'row-reverse'`.
   *
   * Note: Currently we are including `'row-reverse'` even though Inline doesn't support it
   * as an attempt to educate makers about accessibility concerns.   *
   */
  const flexDirection =
    cssStyleObject['flex-direction'] || cssStyleObject['flexDirection'];
  const validFlexDirectionValue = ['row', 'row-reverse', undefined].includes(
    flexDirection,
  );

  /**
   * Note: Currently we are including `'wrap-reverse'` even though Inline doesn't support it
   * as an attempt to educate makers about accessibility concerns.
   */
  const flexWrap = cssStyleObject['flex-wrap'] || cssStyleObject['flexWrap'];
  const validFlexWrapValue = ['wrap', 'wrap-reverse'].includes(flexWrap);
  if (validFlexDirectionValue || validFlexWrapValue) {
    return true;
  }

  return false;
};

const hasStackCompatibleStyles = (cssStyleObject: CSSPropStyleObject) => {
  if (!['flex', 'inline-flex'].includes(cssStyleObject['display'])) {
    return false;
  }

  /**
   * Note: Currently we are including `'column-reverse'` even though Stack doesn't support it
   * as an attempt to educate makers about accessibility concerns.
   */
  const flexDirection =
    cssStyleObject['flex-direction'] || cssStyleObject['flexDirection'];
  const validFlexDirectionValue = ['column', 'column-reverse'].includes(
    flexDirection,
  );

  if (!validFlexDirectionValue) {
    return false;
  }

  return true;
};
