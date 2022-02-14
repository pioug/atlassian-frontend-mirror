# VisuallyHidden

A composable element that hides elements from the screen while keeping them accessible.

## Installation

```sh
yarn add @atlaskit/visually-hidden
```

## Usage

```jsx
import VisuallyHidden from '@atlaskit/visually-hidden';

export default () => (
  <div style={{ border: '1px solid black' }}>
     There is text hidden between the brackets [
     <VisuallyHidden>Can't see me!</VisuallyHidden>]
  </div>
);
```
