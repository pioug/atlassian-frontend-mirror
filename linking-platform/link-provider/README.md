# @atlaskit/link-provider

>

## Usage

```
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider'
import { Card } from '@atlaskit/smart-card'

<SmartCardProvider client={new CardClient()}>
  <Card />
</SmartCardProvider>
```

### Choreographing Smart Card experiments

Products supply a stable `choreographer` component to `SmartCardProvider`. Create it once at module
scope with `createChoreographedContent` and the product's existing `useChoreographer` hook:

```tsx
import { createChoreographedContent } from '@atlaskit/link-provider/create-choreographed-content';

const SmartCardChoreographer = createChoreographedContent(useChoreographer);
```

If the product obtains its choreographer from React context, pass a module-level custom hook that
reads that context and calls the native hook. Do not create the adapter during rendering. A nested
provider inherits the outer provider's component. The public package has no runtime dependency on
Post Office.

Experiments can use `ChoreographedContent` from `@atlaskit/link-provider/choreographed-content`:

```tsx
<ChoreographedContent
	messageId="my-smart-card-experiment"
	isActive={isEligible}
	onUnavailable={cancelOpportunity}
>
	{({ hasPermission }) => <MyPopup isOpen={hasPermission} trigger={normalAction} />}
</ChoreographedContent>
```

Keep the normal action rendered while permission is pending or unavailable. Close the opportunity
(`isActive={false}`) on action, dismissal, or loss of eligibility; unmounting also releases it. Use
a distinct message ID for each experiment. Concurrent instances receive distinct registration IDs.
Missing host integration, rejected delivery, and choreographer revocation fail closed. A blocked
request is not automatically retried. The adapter requests no automatic expiry. The current native
choreographer may apply its default five-minute expiry to queued requests; any expiry or host stop
hides the UI. Closing the opportunity or unmounting releases the claim.

This only coordinates participating in-app messages. The experiment still owns feature gates,
assignment, audience checks, impressions, dismissal history, and analytics. No portal message or
headless API is required.
