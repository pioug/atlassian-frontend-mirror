# What is _remounting_

Lets say we have this `draggable`

```ts
const cleanup = draggable({
  element: myElement,
  onDrop: () => console.log('A'),
});
```

Later, a user starts dragging our `draggable`. But we want to change our `onDrop` function. What can we do? Remount the `draggable`!

```ts
// draggable is removed
cleanup();

// a new draggable is created
// The old `draggable` and the new one are treated as the same entity are their `element`
// is the same. So when a drop occurs, we will see `console.log('B')`
const cleanup2 = draggable({
  element: myElement,
  onDrop: () => console.log('B'),
});
```

Remounting is common in `react` where you _might_ do something like this:

```tsx
function Card() {
  const ref = useRef();
  const [dragCount, setCount] = useState(0);

  useEffect(() => {
    return draggable({
      element,
      onDragStart: () => setCount(dragCount + 1),
    });
    // when dragCount changes our `draggable` will be remounted
  }, [dragCount]);

  return <div ref={ref}>I have been dragged {dragCount} times</div>;
}
```

That is a contrived example, because you _could_ avoid the remounting in this case by doing this:

```tsx
function Card() {
  const ref = useRef();
  const [dragCount, setCount] = useState(0);

  useEffect(() => {
    return draggable({
      element,
      onDragStart: () => setCount(current => current + 1),
    });
    // no longer need to remount when `dragCount` changes
  }, []);

  return <div ref={ref}>I have been dragged {dragCount} times</div>;
}
```
