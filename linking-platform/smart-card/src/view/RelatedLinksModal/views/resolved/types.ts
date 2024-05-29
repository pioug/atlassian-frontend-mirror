export type RelatedLinksProps = {
  /* a list of links that are incoming from the resource, renders underneath `Found In` heading */
  incomingLinks?: string[],
  /* a list of links that are outgoing from the resource, renders underneath `Includes Links To` heading */
  outgoingLinks?: string[]
}
