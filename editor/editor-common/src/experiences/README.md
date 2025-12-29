# Experience Tracking

Production observability for UI correctness in the Atlassian Editor.

Experience tracking monitors critical user interactions in production, detecting when expected
outcomes fail to occur. It validates that specific actions (like opening a toolbar) result in
expected outcomes (like the toolbar appearing), failing if the outcome doesn't occur within a
specified timeframe.

**Use cases:** Silent failures (toolbars not rendering, empty menus, popups failing to open),
intermittent bugs, and regression detection.

## Documentation

For comprehensive documentation, including API reference, examples, best practices, and
troubleshooting, see:

**[Experience Tracking Documentation](https://hello.atlassian.net/wiki/spaces/EDITOR/pages/6262120313/HOWTO+Experience+tracking+in+Editor)**
