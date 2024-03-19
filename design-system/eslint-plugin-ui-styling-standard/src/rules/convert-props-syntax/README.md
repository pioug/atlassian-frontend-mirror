Convert props syntax that is unsupported by `styled-components` <4.x to props syntax that is supported. This is useful when used in conjunction with `no-styled-tagged-template-expression`, as output from the latter may use props syntax unsupported by `styled-components`.

`styled-components` <4.x does not support having an arrow function inside a CSS value:

```js
styled.div({
  color: ({ myColor }) => myColor,
  backgroundColor: (props) => props.someColor,
});
```

However, refactoring the arrow function so that it is the argument to `styled.div` will fix the issue:

```js
styled.div((props) => ({
  color: props.myColor,
  backgroundColor: props.someColor,
}));
```

This ESLint rule will only run on usages of the `styled` API when imported from `styled-components`.

## About the autofixer

This rule has an autofixer that will automatically perform the above arrow function refactoring for the majority of cases, including for nested selectors and any props used in template literal values.

However, there are a few situations where the autofixer will not be run. For these, you will need to manually fix the output, or migrate the code to `@compiled/react`.

### Type annotations

Type annotations in the arrow function are not supported; you will need to remediate the lint error manually. For example:

```js
type Props = {
  myColor: string,
  someColor: string,
};

styled.div({
  color: ({ myColor }: Props) => myColor,
  backgroundColor: (props: Props) => props.someColor,
});
```

will need to be manually refactored to

```js
type Props = {
  myColor: string,
  someColor: string,
};

styled.div((props: Props) => ({
  color: props.myColor,
  backgroundColor: props.someColor,
}));
```

### Special syntax in the arrow function parameter(s)

Rest elements, default values, and so on in the parameter of an arrow function will need to be remediated manually. For example:

```js
styled.div({
  color: ({ myColor = '#fff' }) => myColor,
  backgroundColor: ({ myColor = '#aaa' }) => myColor,
});
```

could potentially be remediated with

```js
styled.div((props) => ({
  color: myColor ?? '#fff',
  backgroundColor: myColor ?? '#aaa',
}));
```

## Examples

### Incorrect

```js
import styled from 'styled-components';

styled.div({
  color: ({ myColor }) => myColor,
  backgroundColor: (props) => props.someColor,
});

styled.div({
  color: `url(/tmp/${({ coolProp }) => coolProp}.png)`,
});
```

### Correct

```js
import styled from 'styled-components';

styled.div((props) => ({
  color: props.myColor,
  backgroundColor: props.someColor,
}));

styled.div((props) => ({
  color: url(`/tmp/${coolProp}.png`),
}));
```

## When not to use it

You do not need this rule if you are not using a codebase that has an old version of `styled-components` (<4.x).
