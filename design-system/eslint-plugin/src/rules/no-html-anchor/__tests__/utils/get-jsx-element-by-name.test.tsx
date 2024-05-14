import type { Scope } from 'eslint';
import j from 'jscodeshift';

import { getJsxElementByName } from '../../utils/get-jsx-element-by-name';

describe('getJsxElementByName', () => {
  it('finds element by name', () => {
    const root = j(`
    import { styled } from '@compiled/react';
    const MyContainer = styled.a({ padding: '8px' });
    <MyContainer>Hello, World!</MyContainer>
    `);
    const jsxRef = root.find(j.JSXIdentifier).get().value;
    jsxRef.parent = root.find(j.JSXOpeningElement).get().value;
    const dummyScope = {
      variables: [
        {
          name: 'MyContainer',
          references: [
            undefined, // not used
            {
              identifier: jsxRef,
            },
          ],
        },
      ],
    } as Scope.Scope;

    const result = getJsxElementByName('MyContainer', dummyScope);

    expect(result).toBeDefined();
  });

  it('finds element by name when styled declaration comes after JSX', () => {
    const root = j(`
    import { styled } from '@compiled/react';
    <MyContainer>Hello, World!</MyContainer>
    const MyContainer = styled.a({ padding: '8px' });
    `);
    const jsxRef = root.find(j.JSXIdentifier).get().value;
    jsxRef.parent = root.find(j.JSXOpeningElement).get().value;
    const dummyScope = {
      variables: [
        {
          name: 'MyContainer',
          references: [
            {
              identifier: jsxRef,
            },
            undefined, // not used
          ],
        },
      ],
    } as Scope.Scope;

    const result = getJsxElementByName('MyContainer', dummyScope);

    expect(result).toBeDefined();
  });

  it('skips if more than two references are found', () => {
    const root = j(`
    import { styled } from '@compiled/react';
    const MyContainer = styled.a({ padding: '8px' });
    <MyContainer>Hello, World!</MyContainer>
    `);
    const jsxRef = root.find(j.JSXIdentifier).get().value;
    jsxRef.parent = root.find(j.JSXOpeningElement).get().value;
    const dummyScope = {
      variables: [
        {
          name: 'MyContainer',
          references: [
            undefined, // not used
            {
              identifier: jsxRef,
            },
            undefined, // a third reference to the `MyContainer` variable
          ],
        },
      ],
    } as Scope.Scope;

    const result = getJsxElementByName('MyContainer', dummyScope);

    expect(result).toBeUndefined();
  });

  it('skips if a single reference is found, ie, an unused styled component', () => {
    const root = j(`
    import { styled } from '@compiled/react';
    const MyContainer = styled.a({ padding: '8px' });
    <MyContainer>Hello, World!</MyContainer>
    `);
    const jsxRef = root.find(j.JSXIdentifier).get().value;
    jsxRef.parent = root.find(j.JSXOpeningElement).get().value;
    const dummyScope = {
      variables: [
        {
          name: 'MyContainer',
          references: [
            undefined, // the value itself is meaningless, we just count the number of entries in the array
          ],
        },
      ],
    } as unknown as Scope.Scope;

    const result = getJsxElementByName('MyContainer', dummyScope);

    expect(result).toBeUndefined();
  });
});
