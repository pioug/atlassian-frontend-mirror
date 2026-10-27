# Rovo Agent Analytics

When adding or changing events, see [README.md](README.md#adding-a-new-action) for the workflow.

- Use `actionSubject: 'rovoAgent'` and distinguish operations by `action`; the
  `go/rovo-agent-analytics` dashboard groups events by this subject.
- Model each action as its own discriminated-union variant. Make attributes required, including
  `touchPoint`.
- Give each event only the attributes its action sets or changes. Other events carry the entity's
  stable ID so analysis can join them; do not add props or query fields just to repeat context.
- Identify entities by the owning service's stable ID, not a GraphQL record ID that can change
  between versions. Check the owning service's source for ID meaning and nullability; use `null`
  only where it can actually return null.
- Use a `touchPoint` unique to the UI surface. Search existing values before reusing one.
- Register every action in Data Portal before review and add its registry link comment to the
  variant.
- Emit from the component that owns the view or mutation, using its props and fragments rather than
  analytics props passed down. Emit completed-operation events only after confirmed success, never
  on optimistic updates or failures.
- Never include user content, configuration payloads, credentials, or tokens in attributes.
