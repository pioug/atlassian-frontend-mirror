# Experience Tracking

Production observability for UI correctness in the Atlassian Editor.

## Overview

Experience tracking monitors critical user interactions in production, detecting when expected
outcomes fail to occur. It validates that specific actions (like opening a toolbar) result in
expected outcomes (like the toolbar appearing), failing if the outcome doesn't occur within a
specified timeframe.

**Example use cases:**

- **Silent failures**: Toolbars not rendering, empty menus, popups failing to open
- **Intermittent bugs**: Issues that only occur under specific conditions in production
- **Regression detection**: Catching when working experiences start failing after deployments

## What is an Experience?

A complete user interaction flow from start to expected end state.

General flow:

User interaction -> Event -> State change -> Render -> DOM update

Start tracking an experience at the earliest possible code execution point after the user
interaction (e.g. button click event handler / prose mirror selection state change), and then
monitor for the expected outcome by observing DOM or state changes.

Examples:

- After user makes a text selection confirm the contextual toolbar appears
- After user clicks a toolbar button to insert an element, confirm it gets added to the DOM

## Usage

### 1. Create an Experience

Define your experience with checks that determine when it completes:

```typescript
import {
	Experience,
	ExperienceCheckTimeout,
	ExperienceCheckDomMutation,
} from '@atlaskit/editor-common/experiences';

const toolbarExperience = new Experience('toolbar-open-experience', {
	checks: [
		new ExperienceCheckTimeout(500), // Fail after 500ms

		// Check DOM for toolbar element
		new ExperienceCheckDomMutation({
			onDomMutation: ({ mutations }) => {
				if (mutations.some(/* check if toolbar added */)) {
					return { status: 'success' };
				}
				// Don't return anything - keep monitoring
			},
			observeConfig: () => ({
				target: document.querySelector('[data-testid="popup-container"]'),
				options: {
					childList: true,
					subtree: true,
				},
			}),
		}),
	],
});
```

### 2. Integrate with ProseMirror Plugin

If your experience is tied to editor state changes, it's recommended to encapsulate the experience
within a ProseMirror plugin to manage lifecycle, using the apply hook to start/abort based on state:

```typescript
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

export default () => {
	const fancyExperience = new Experience(/* ... */);

	return new SafePlugin({
		state: {
			apply: (_tr, pluginState, _, newState) => {
				const shouldStart = /* determine from newState */;

				if (shouldStart && !pluginState.isStarted) {
					fancyExperience.start();
				} else if (!shouldStart && pluginState.isStarted) {
					fancyExperience.abort();
				}

				return { ...pluginState, isStarted: shouldStart };
			},
		},
		view: () => ({
			destroy: () => fancyExperience.abort(), // Always abort on unmount to prevent leaks
		}),
	});
};
```

### 3. Manual Control (Optional)

If you prefer not to control experience lifecycle via checks, or need to override outcomes based on
custom logic, then you can manually control experience outcomes as follows:

```typescript
// Start tracking
experience.start();

// Mark as successful (stops all checks)
experience.success();

// Mark as failed (stops all checks)
experience.failure({ reason: 'custom-error' });

// Abort tracking (for user-initiated cancellations)
experience.abort();
```

## Experience Checks

Experiences can use multiple checks to monitor for expected outcomes. You can use built-in checks or
create custom ones for your specific needs.

### ExperienceCheckTimeout

Fails the experience after a specified duration:

```typescript
import { ExperienceCheckTimeout } from '@atlaskit/editor-common/experiences';

new ExperienceCheckTimeout(500); // Fail after 500ms
```

### ExperienceCheckDomMutation

Validates DOM changes using MutationObserver.

**Performance-first design:** This check requires explicit configuration to ensure developers make
conscious decisions about what to observe. MutationObserver can have significant performance
overhead if not properly scoped.

```typescript
import { ExperienceCheckDomMutation } from '@atlaskit/editor-common/experiences';

new ExperienceCheckDomMutation({
	onDomMutation: ({ mutations }) => {
		// Check each mutation batch
		const found = mutations.some((mutation) => {
			if (mutation.type === 'childList') {
				return Array.from(mutation.addedNodes).some(/* check if expected node added */);
			}

			if (mutation.type === 'attributes') {
				const target = mutation.target as HTMLElement;
				return target.classList.contains('expected-class');
			}

			return false;
		});

		if (/* some incorrect state detected */) {
			return { status: 'failure', reason: 'unexpected-dom-change' };
		}

		if (found) {
			return { status: 'success' };
		}

		// otherwise do nothing to keep monitoring
	},
	observeConfig: () => ({
		// Narrow scope improves performance
		target: document.querySelector('[data-testid="toolbar-container"]'),
		// Only observe what you need
		options: {
			childList: true, // Watch for added/removed nodes
			subtree: true, // Include descendants
		},
	}),
});
```

**Configuration guidelines:**

The `observeConfig` callback returns an object with `target` and `options`, or `null` if the target
cannot be found:

- **`target`**: The DOM element to observe
  - **Performance tip**: Use the most specific container possible (not `document.body` unless
    necessary)
  - Narrower scope = better performance and fewer false positives
  - **Return `null`** if element doesn't exist - experience will fail immediately with
    `'target-not-found'`
- **`options`**: MutationObserver configuration
  - **Performance tip**: Only enable mutation types you need
  - See
    [MutationObserver.observe() documentation](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe)
    for all available options

**Common patterns:**

```typescript
// Pattern 1: Watch for element appearing in a specific container
new ExperienceCheckDomMutation({
	onDomMutation: ({ mutations }) => {
		const hasToolbar = mutations.some((m) =>
			Array.from(m.addedNodes).some((node) => node.dataset?.testid === 'toolbar'),
		);
		if (hasToolbar) {
			return { status: 'success' };
		}
	},
	observeConfig: () => ({
		target: document.querySelector('[data-testid="editor"]'),
		options: {
			childList: true, // Only child additions/removals
			subtree: true, // Include nested elements
		},
	}),
});

// Pattern 2: Watch for attribute changes on a specific element
new ExperienceCheckDomMutation({
	onDomMutation: ({ mutations }) => {
		const target = mutations[0].target as HTMLElement;
		if (target.classList.contains('is-open')) {
			return { status: 'success' };
		}
	},
	observeConfig: () => ({
		target: document.querySelector('[data-testid="popup"]'),
		options: {
			attributes: true, // Only attribute changes
			attributeFilter: ['class'], // Only 'class' attribute (not all attributes)
		},
	}),
});

// Pattern 3: Watch only direct children (not nested)
new ExperienceCheckDomMutation({
	onDomMutation: ({ mutations }) => {
		// Check for toolbar in direct children only
		if (/* toolbar found */) {
			return { status: 'success' };
		}
	},
	observeConfig: () => ({
		target: document.querySelector('[data-testid="editor"]'),
		options: {
			childList: true,
			subtree: false, // Only direct children, better performance
		},
	}),
});
```

**Performance considerations:**

- ❌ **Avoid**: `{ target: document.body, options: { attributes: true, subtree: true } }` (observes
  every attribute change on the entire page)
- ✅ **Prefer**: `{ target: specificContainer, options: { childList: true } }` (observes only child
  changes in a specific container)
- ⚠️ **Use sparingly**: `attributeOldValue`, `characterData`, `characterDataOldValue` (increase
  memory overhead)

### Custom Checks

You can create custom checks by implementing the `ExperienceCheck` interface:

```typescript
import type {
	ExperienceCheck,
	ExperienceCheckCompleteHandler,
} from '@atlaskit/editor-common/experiences';

/**
 * Custom check that polls for a condition at regular intervals
 */
class PollingCheck implements ExperienceCheck {
	private intervalId: ReturnType<typeof setInterval> | undefined;
	private checkFn: () => boolean;
	private intervalMs: number;

	constructor(checkFn: () => boolean, intervalMs: number = 50) {
		this.checkFn = checkFn;
		this.intervalMs = intervalMs;
	}

	start(callback: ExperienceCheckCallback) {
		this.stop();

		this.intervalId = setInterval(() => {
			if (this.checkFn()) {
				callback({ status: 'success' });
			}
		}, this.intervalMs);
	}

	stop() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = undefined;
		}
	}
}

// Usage
const experience = new Experience('custom-polling-experience', {
	checks: [
		new PollingCheck(() => {
			const element = document.querySelector('[data-testid="my-element"]');
			return element !== null;
		}),
		new ExperienceCheckTimeout(1000),
	],
});
```

## UFO Integration

Under the hood, Experiences are tracked using UFO (Universal Frontend Observability) and
automatically emit events for analysis:

```typescript
{
  id: 'platform-editor-contextual-toolbar-open-experience',
  uuid: '550e8400-e29b-41d4-a716-446655440000', // Unique per instance
  type: 'experience',
  performanceType: 'inline-result',
  state: 'SUCCEEDED' | 'FAILED' | 'ABORTED',
  metadata: {
    reason: 'timeout' | 'target-not-found' | 'check-dom-mutation-error' | 'custom-reason', // For failures
  },
  metrics: {
    startTime: 1234567890,
    endTime: 1234567900,
    marks: [], // Custom performance marks
  },
  result: {
    success: true | false,
    startTime: 1234567890,
    duration: 10, // milliseconds
  }
}
```

## Best Practices

### Always Abort on Unmount

Prevent memory leaks by aborting experiences when plugins are destroyed:

```typescript
view: () => {
	return {
		destroy: () => {
			experience.abort();
		},
	};
};
```

### Set Appropriate Timeouts

Choose timeout values based on expected operation duration:

```typescript
// Fast UI operations (toolbar open, menu show)
new ExperienceCheckTimeout(500);

// Complex rendering (table insert, large content load)
new ExperienceCheckTimeout(2000);

// Network-dependent operations
new ExperienceCheckTimeout(5000);
```

### Abort on State Changes

If an experience should be cancelled when editor state changes:

```typescript
apply: (_tr, pluginState, _, newState) => {
	const shouldTrack = checkCondition(newState);
	const wasTracking = checkCondition(oldState);

	if (shouldTrack && !wasTracking) {
		experience.start();
	} else if (!shouldTrack && wasTracking) {
		experience.abort(); // Clean cancellation, not a failure
	}

	return pluginState;
};
```

## Troubleshooting

### Experience not completing

1. Check timeout values - may be too short for the operation
2. Verify DOM mutation check logic is correct (use browser DevTools to inspect mutations)
3. Ensure `start()` is being called at the right time
4. Check browser console for UFO warnings/errors

### Memory leaks

1. Ensure `abort()` is called in plugin's `view.destroy()`
2. Verify custom checks properly clean up in their `stop()` methods
3. Don't hold references to experiences after they complete

### High failure rates in production

1. Increase timeout values considering slower devices/networks
2. Review DOM mutation check logic for edge cases
3. Consider if feature flags are affecting the experience

### Performance overhead

1. Optimize DOM mutation checks - avoid expensive queries
2. Limit the number of concurrent experiences
3. Use `isInProgress()` to avoid starting duplicate experiences

---

## See Also

- [UFO Documentation](https://atlassian.design/components/ufo/usage)
