import React from 'react';
import { code, md } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

import { Contents, ContentsProvider, IframeExample, H } from './shared';

export default (
  <ContentsProvider>{md`
If you're wondering how to manage the state of your navigation, this guide is for you. It will introduce you to some of the more advanced concepts in \`navigation-next\`.

${(<Contents listType="ol" />)}

${(<H>Navigation views</H>)}

If you've followed the previous guide you'll know how to use the UI components to compose a navigation. If your navigation is simple and will never change as the user navigates around your app, that's all you'll ever need to know. But what if we do want to change the state of our navigation?

We refer to each state the navigation can be in as a 'view'. As an example, here are some of Jira's navigation 'views':

${(
  <IframeExample
    source={require('!!raw-loader!./examples/views-controller/views-example')}
    title="Navigation views"
    id="views-example"
    path="/views-controller"
  />
)}

${(<H>Representing a view as data</H>)}

Representing a view as a Javascript array makes them really easy to work with. Let's start by taking the Product home view above and turning it into JSON.

${code`// Component representation
const componentView = (
  <Fragment>
    <HeaderSection>
      {({ className }) => (
        <div className={className}>
          <Wordmark wordmark={JiraWordmark} />
        </div>
      )}
    </HeaderSection>
    <MenuSection>
      {({ className }) => (
        <div className={className}>
          <Item before={DashboardIcon} text="Dashboards" />
          <Item before={FolderIcon} text="Projects" />
          <Item before={IssueIcon} text="Issues and filters" />
          <Item before={PortfolioIcon} text="Portfolio" />
        </div>
      )}
    </MenuSection>
  </Fragment>
);

// JSON representation
const jsonView = [
  {
    type: 'HeaderSection',
    id: 'header',
    items: [
      {
        type: 'Wordmark',
        wordmark: JiraWordmark,
        id: 'jira-wordmark',
      },
    ],
  },
  {
    type: 'MenuSection',
    id: 'menu',
    items: [
      {
        type: 'Item',
        id: 'dashboards',
        before: DashboardIcon,
        text: 'Dashboards',
      },
      { type: 'Item', id: 'projects', before: FolderIcon, text: 'Projects' },
      {
        type: 'Item',
        id: 'issues-and-filters',
        before: IssueIcon,
        text: 'Issues and filters',
      },
      {
        type: 'Item',
        id: 'portfolio',
        before: PortfolioIcon,
        text: 'Portfolio',
      },
    ],
  },
];`}

In this model a view is represented as an array of items. Each item in this array has a \`type\` property, an \`id\` property, and maybe an \`items\` property (if this item contains other items).

A few things to note:

* Some \`type\`s are built into the package (such as, 'Item' and 'HeaderSection') and these types can be provided as a string. If you need your own custom behaviour or presentation, you can provide your own component as the type instead.
* A view is expected to be an array of Sections. Sections should not be nested. As well as the generic \`Section\` component, the renderer includes two pre-configured Section components - \`HeaderSection\` and \`MenuSection\` - which we recommend using to get the correct spacing and scrolling behaviour in your navigation.
* You can find a complete [list of the in-built item types here](/packages/core/navigation-next/docs/state-controllers#built-in-view-item-types).

${(<H>A smart LayoutManager</H>)}

Let's have a quick refresher on the LayoutManager component. It takes the following props:

* **\`children\`** - This is your page content. The state of this component will probably be driven by a router.
* **\`globalNavigation\`** - This component should remain consistent no matter what state your application is in.
* **\`productNavigation\`** - This component will change in response to user interaction and route changes.
* **\`containerNavigation\`** - This component will change in response to user interaction and route changes, and may never be rendered at all depending on the route.

So there's some complexity in managing the state of the product and container navigation layers. A naive approach might be to connect these to the router as well. But what about 'nested navigation' states that don't trigger a page transition, where the active view gets out of sync with the route? What if we want to hold on to the previous view while asynchronously loading in a new one?

We provide a state manager to help you handle this, and a wrapped version of the \`LayoutManager\` which connects to this state container and takes care of rendering the product and container navigation.

${(
  <IframeExample
    source={require('!!raw-loader!./examples/views-controller/layoutmanagerwithviewcontroller')}
    title="LayoutManagerWithViewController"
    id="layoutmanagerwithviewcontroller"
    path="/views-controller"
  />
)}

We haven't set a view yet, so the component will simply render a skeleton. Let's give it a view to display!

${(<H>Managing the navigation state</H>)}

The View state controller contains the active view, and methods for adding and activating views. Since we often want to read this state or perform these actions in lifecycle methods it's easiest to use a higher-order component to access the state container.

${code`
import { withNavigationViewController } from '@atlaskit/navigation-next';

const myView = {
  id: 'my-view',
  type: 'product',
  getItems: () => [/* ... */],
};

class MyComponent extends React.Component {
  componentDidMount() {
    this.props.navigationViewController.addView(myView);
  }

  render() {
    /* ... */
  }
}

export default withNavigationViewController(MyComponent);`}

Let's update our app to add and set a navigation view. A 'view' is an object with the following properties:

* **\`id\`** - A unique ID for this view.
* **\`type\`** - Either 'product' or 'container', this denotes which navigation layer this view should be rendered on.
* **\`getItems\`** - A function which should return an array representing the view.

We call \`navigationViewController.addView(myView)\` to register that view. We then call \`navigationViewController.setView(myView.id)\` to set it as the active view.

${(
  <IframeExample
    source={require('!!raw-loader!./examples/views-controller/add-and-set-view')}
    title="Adding and setting a view"
    id="add-and-set-view"
    path="/views-controller"
  />
)}

${(<H>Transitioning between views</H>)}

Let's add a Project issues view to our navigation. Now when we click on the 'Issues and filters' item the view will update. Clicking the 'Back to Jira' item will take us back again.

${(
  <IframeExample
    source={require('!!raw-loader!./examples/views-controller/update-view')}
    title="Transitioning between views"
    id="update-view"
    path="/views-controller"
  />
)}

So how is this working? There are a few things going on.

#### 1. Adding a \`goTo\` property to Items

Our 'Issues and filters' item now looks like this:

${code`{
  before: IssueIcon,
+ goTo: 'product/issues',
  id: 'issues-and-filters',
  text: 'Issues and filters',
  type: 'Item',
},`}

This renders a special Item which will call \`navigationViewController.setView('product/issues')\` when it's clicked. The 'Back to Jira' item in the product issues view works the same way.

#### 2. Linking nested Sections

To get a nested navigation animation we need to add some information to our \`MenuSection\`s. They now look like this:

${code`// 'product/home' menu section
{
  items: [/* ... */],
  type: 'MenuSection',
  id: 'product/home:menu',
+ parentId: null,
+ nestedGroupKey: 'menu',
}

// 'product/issues' menu section
{
  items: [/* ... */],
  type: 'MenuSection',
  id: 'product/issues:menu',
  parentId: 'product/home:menu',
  nestedGroupKey: 'menu',
}`}

We've assigned each section a unique \`id\` prop. Because the 'product/issues' menu is conceptually a 'child' of the 'product/home' section, we set its \`parentId\` to 'product/home'. Finally, we need to give both sections a shared \`nestedGroupKey\`, which tells the renderer that it should perform a transition animation when one of these sections is replaced by another.

${(<H>Updating the view on route changes</H>)}

Let's add some routing to our app. In this example we'll use \`react-router\`.

${(
  <IframeExample
    source={require('!!raw-loader!./examples/views-controller/adding-routes')}
    title="Adding routing to our app"
    id="adding-routes"
    path="/views-controller"
  />
)}

Clicking on the 'Dashboards' item in the product home view will change the route to \`'/'\`. Clicking on the 'Search issues' item in the product issues view will change the route to \`'/issues'\`. If we reload the app on the Issues and filters route it should initialise with the product issues view active. Let's look at how we did this.

#### 1. Add a LinkItem component

We created a custom LinkItem component and updated our view to use it.

${code`const LinkItem = ({ components: { Item }, to, ...props }) => {
  return (
    <Route
      render={({ location: { pathname } }) => (
        <Item
          component={({ children, className }) => (
            <Link className={className} to={to}>
              {children}
            </Link>
          )}
          isSelected={pathname === to}
          {...props}
        />
      )}
    />
  );
};`}

${code`// Project home view Dashboards item
{
- type: 'Item',
+ type: 'InlineComponent',
+ component: LinkItem,
  id: 'dashboards',
  before: DashboardIcon,
  text: 'Dashboards',
+ to: '/',
}`}

This component renders a \`react-router\` \`Link\`. It also connects to the router and will appear selected when the current route matches its \`to\` property.

An alternative way to specify a custom component is using the \`customComponents\` prop of \`LayoutManagerWithViewcontroller\` component and then referencing the custom component type directly as a string, similar to a built-in type.

#### 2. Add routes to our app which set their view on mount

We create components for the Dashboards and Issues and Filters routes which look like this:

${code`class MyRouteBase extends Component {
  componentDidMount() {
    const { navigationViewController } = this.props;
    navigationViewController.setView(myView.id);
  }

  render() {
    /* ... */
  }
}
const MyRoute = withNavigationViewController(MyRouteBase);`}

We update our app like so:

${code`class App extends Component {
  componentDidMount() {
    const { navigationViewController } = this.props;
    navigationViewController.addView(productHomeView);
    navigationViewController.addView(productIssuesView);
-   navigationViewController.setView(productHomeView.id); // We don't need to set views here any more
  }

  render() {
    return (
      <LayoutManagerWithViewController
        globalNavigation={MyGlobalNavigation}
      >
-       <div>Page content goes here.</div>
+       <Switch>
+         <Route path="/issues" component={IssuesAndFiltersRoute} />
+         <Route path="/" component={DashboardsRoute} />
+       </Switch>
      </LayoutManagerWithViewController>
    );
  }
}
const AppWithNavigationViewController = withNavigationViewController(App);

export default () => (
  /* Note: in this example we're using HashRouter from react-router, but you
  can use any routing solution you wish. */
+ <HashRouter>
    <NavigationProvider>
      <AppWithNavigationViewController />
    </NavigationProvider>
+ </HashRouter>
);`}

We've introduced an important concept here - navigation decomposition. There's no reason that all possible views should be known and registered at a central point in your application. It's an encouraged pattern for each 'sub-app' in a large application to register and set their own views dynamically. This becomes especially important when you start thinking about splitting your bundle based on the route.

${(<H>Asynchronous views</H>)}

What if your view needs some data to render, but you don't want to fetch that data until you know you need to render the view? The view controller supports returning a Promise from the \`getItems\` function, which will put your navigation into a temporary loading state. Let's make our product issues view asynchronous.

${(
  <IframeExample
    source={require('!!raw-loader!./examples/views-controller/asynchronous-views')}
    title="Asynchronous views"
    id="asynchronous-views"
    path="/views-controller"
  />
)}

As you can see, the current view will hang around until the new active view has finished loading, at which point the transition will be performed. If an Item's \`goTo\` property matches the ID of the incoming view, the renderer will automatically display a spinner as well!

${(<H>Container views</H>)}

So far we've only been dealing with 'product' navigation. When we enter a 'container' we bring in another layer of navigation:

${(
  <IframeExample
    source={require('!!raw-loader!./examples/views-controller/container-views')}
    title="Container views"
    id="container-views"
    path="/views-controller"
  />
)}

Here's what changed:

1. We added a view called \`'project/home'\` with the \`'container'\` type. We register this view along with the rest of the views in our App's \`componentDidMount\` method.
2. We created a new component for the projects route, which sets the \`project/home\` view when it mounts. We added a \`Link\` to this route in the Dashboards component.

${(<H>Using reducers</H>)}

You may run into situations in your application where one part of the app wants to affect a view without directly editing its \`getItems\` function. The view controller exposes a mechanism for 'reducing' the items in a view before they're rendered.

${(
  <IframeExample
    source={require('!!raw-loader!./examples/views-controller/reducing-views')}
    title="Container views"
    id="reducing-views"
    path="/views-controller"
  />
)}

In this example we imagine that the Growth team wants to add a Lozenge to one of the items to see if it increases click-through rates. They could have modified the \`getItems\` function directly, but this quickly becomes quite messy. By using a 'reducer' they can keep their experimental code isolated and easy to remove. Here's how it works:

#### 1. Create a component which adds the reducer

We added a \`GrowthExperiment\` component:

${code`import {
  viewReducerUtils,
  withNavigationViewController,
} from '@atlaskit/navigation-next';

class GrowthExperimentBase extends Component {
  componentDidMount() {
    const { navigationViewController } = this.props;
    navigationViewController.addReducer(productHomeView.id, this.reducer);
  }

  componentWillUnmount() {
    const { navigationViewController } = this.props;
    navigationViewController.removeReducer(productHomeView.id, this.reducer);
  }

  reducer = viewItems => {
    const addBadge = item => ({
      ...item,
      after: () => (
        <Lozenge appearance="success" isBold>
          New
        </Lozenge>
      ),
    });
    return viewReducerUtils.findId('portfolio')(addBadge)(viewItems);
  };

  render() {
    return null;
  }
}
const GrowthExperiment = withNavigationViewController(GrowthExperimentBase);`}

This component doesn't render anything, but when it mounts it registers a reducer which runs against the \`'product/home'\` view. The reducer walks the items in that view, finds the one with the \`'portfolio'\` ID, and adds an \`after\` prop to that item.

The \`findId\` function is provided by the library. You can find a full list of [reducer utility functions here](/packages/core/navigation-next/docs/state-controllers).

#### 2. Drop it in

It's then as simple as rendering the \`GrowthExperiment\` component as long as we want the reducer to be active. Our App's \`render\` function now looks like this:

${code`render() {
  return (
    <LayoutManagerWithViewController
      globalNavigation={MyGlobalNavigation}
    >
      <Switch>
        <Route path="/projects/my-project" component={ProjectBacklogRoute} />
        <Route path="/issues" component={IssuesAndFiltersRoute} />
        <Route path="/" component={DashboardsRoute} />
      </Switch>
+     <GrowthExperiment />
    </LayoutManagerWithViewController>
  );
}`}

&nbsp;

${(
  <SectionMessage
    appearance="warning"
    title="Reducers should only be used as an escape hatch."
  >
    Recommended uses for this feature are pretty much limited to experiments and
    legacy (non-React) integrations. If {`you're`} trying to create a stateful
    view, either control the state externally and pass arguments to the{' '}
    <code>getItems</code> function, or use a custom item in the view which
    manages some internal state.
  </SectionMessage>
)}

`}</ContentsProvider>
);
