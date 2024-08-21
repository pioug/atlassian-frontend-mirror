# Migration guide

This component will observe the current width, and it will call the \`setWidth\` callback every time
this changes.

The only requirement is that the parent \`HTMLElement\` should have \`position: relative\` because
this is an absolute element.

## Before:

```tsx
<WidthDetector>
	{(width: number | void) => <WrappedComponent {...props} containerWidth={width} />}
</WidthDetector>
```

### After:

```tsx
const [width, setWidth] = useState<number | void>(undefined);
const throttledSetWidth = _.throttle(setWidth, 50);

return (
	<>
		<RelativeWrapper>
			<WidthObserver setWidth={throttledSetWidth} />
		</RelativeWrapper>
		<WrappedComponent {...props} containerWidth={width} />
	</>
);
```
