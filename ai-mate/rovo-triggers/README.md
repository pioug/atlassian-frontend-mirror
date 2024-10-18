# Rovo Triggers

_(formerly conversation-assistant-pubsub)_

Provides various trigger events to drive Rovo Chat functionality, such as a publish-subscribe and
URL parameter hooks

## Example usage

### Publish

```ts
import { usePublish } from "@atlaskit/rovo-triggers";

const YourComponent = () => {
    const publish = usePublish('ai-mate');

    const handleClick = () => {
        publish({
            type: "message-send",
            data: "hello Rovo Chat",
            source: "my-source", // source is used for analytics
        })
    }

    return (
        <div>
            <button onClick={handleClick}>
                Send message onbehalf of user in Rovo Chat
            </button>
        </div>
    );
}
```

### Subscribe

```ts
import { useSubscribe } from "@atlaskit/rovo-triggers";

const YourComponent = () => {
    const [message, setMessage] = useState('Waiting for messages...');

    useSubscribe({ topic: 'ai-mate' }, ({ type, data }) => {
        if(type === 'message-received') {
            setMessage(data)
        }
    });

    return (<div>{message}</div>);
}
```

#### Subscribe (TriggerLatest)

```ts
import { useSubscribe } from "@atlaskit/rovo-triggers";

const YourComponent = () => {
    const [message, setMessage] = useState('Waiting for messages...');

    // This subscription will trigger immediately if an event has already been published to the 'ai-mate' topic
    useSubscribe({ topic: 'ai-mate', triggerLatest: true }, ({ type, data, source }) => {
        if(type === 'message-received') {
            setMessage(data)
        }
    });

    return (<div>{message}</div>);
}
```

### Subscribe All

**Note** - Avoid using this. Right now it's only intended to be a proxy for Rovo Chat to trigger
open when new events are published, if it isn't already open.

```ts
import { useSubscribeAll } from "@atlaskit/rovo-triggers";

const YourComponent = () => {
    useSubscribeAll(() => {
        console.log('pubsub received an event')
        // do something like open the Rovo Chat panel
    });
  });
}
```

### Conditionally run subscriptions

You can conditionally call a subscription that uses `triggerLatest` by conditionally rendering the
`<Subscriber />` component. This can be useful to ensure your state is in the optimal place before
triggering it's the subscription (e.g no longer loading)

```ts
const YourComponent = ({ startSubscription }: { startSubscription: boolean }) => startSubscription ? (
        <Subscriber
          topic={topic}
          triggerLatest={true}
          onEvent={({ type, data }) => {
            if (type === 'message-send') {
              setMsg(`${data} received at ${new Date().toLocaleTimeString()}`);
              setCount(count + 1);
            }
          }}
        />
      ) : null
```

## Registering new events

Events are a combination of a topic and an event type. As such you can register a new event type by
either:

- Creating a new `Topic`, and leveraging the existing `EventTypes`
- Creating a new `Topic`, and also creating some new `EventTypes` to be used
- Creating another `EventType` to be used against an existing `Topic`

This may change as the utility and typings evolve when continuing to build integrations with this
package.

### Topics

The `ai-mate` topic is reserved for `conversation-assistant` events and is the only one that
currently exists. Watch this space.

### EventTypes

Event types represent actions that have taken place in Rovo Chat, or actions you'd like to trigger
within Rovo Chat. As long as there's a registered `publish` event to the `ai-mate` topic, you can
subscribe to it.

This will be documented as integrations are developed.

## Params utility

Rovo Chat uses a strongly typed set of query params encoded to `rovoChat` which can be used
consistently across products.

These values can be used to trigger state changes, routing, actions, for example.

- `clearPageRovoParams` - Removes rovoChat param and it’s value from the address bar.

- `updatePageRovoParams` - Easily add properties to the `rovoChat` param in the address bar; this is
  helpful to continually update the URL for bookmarking or sharing. This method uses
  `addRovoParamsToUrl` under the hood.

- `addRovoParamsToUrl` - The previous function uses this under the hood, but you can call it
  directly to add them to an arbitrary URL string, so let’s say you want to redirect from embedded
  panel to Atlas and do a certain thing, you can call this and pass all the required data to ensure
  its’ picked up and triggers the right thing on Atlas

- `getRovoParams` - The main method you’d use to execute on the values in the rovo params, so you
  can do Atlas page routing, or trigger actions in the embedded experience (differentiated by
  `UIConfig.fullScreen=false`)

Here are some examples of how you might use `getRovoParams` resulting value:

- Open new chat `{ pathway: 'chat' }`
- Open specific chat `{ pathway: 'chat', conversationId: '123' }`
- Open new chat with specific agent `{ pathway: 'chat', agentId: '456' }`
- Open specific chat with specific agent
  `{ pathway: 'chat', conversationId: '123', agentId: '456' }`
- Open new chat and send message `{ pathway: 'chat', prompt: 'What should I work on next?' }`
- Open specific chat and send message
  `{ pathway: 'chat', conversationId: '123', prompt: 'What should I work on next?' }`
- Open specific chat with specific agent and send message
  `{ pathway: 'chat', conversationId: '123', agentId: '456', prompt: 'What should I work on next?' }`
- Browse agents `{ pathway: 'agents-browse' }`
- View agent details `{ pathway: 'agents-browse', agentId: '456' }`
- Open create agent experience `{ pathway: 'agents-create' }`
