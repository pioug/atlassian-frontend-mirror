import React, { PureComponent } from 'react';

import Loadable from 'react-loadable';

import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import { navigationItemClicked } from '../common/analytics';
import RenderBlocker from '../components/common/RenderBlocker';
import BackItem from '../components/connected/BackItem';
import ConnectedItem from '../components/connected/ConnectedItem';
import GoToItem from '../components/connected/GoToItem';
import ContainerHeaderComponent from '../components/presentational/ContainerHeader';
import GroupComponent from '../components/presentational/Group';
import GroupHeadingComponent from '../components/presentational/GroupHeading';
import HeaderSectionComponent from '../components/presentational/HeaderSection';
import MenuSectionComponent from '../components/presentational/MenuSection';
import SectionComponent from '../components/presentational/Section';
import SectionHeadingComponent from '../components/presentational/SectionHeading';
import Separator from '../components/presentational/Separator';
import Wordmark from '../components/presentational/Wordmark';

const gridSize = gridSizeFn();
const loadSwitcher = () =>
  import(
    /* webpackChunkName: "@atlaskit/navigation-next/async-chunk/switcher" */ '../components/presentational/Switcher'
  );
const LazySwitcher = Loadable({
  loader: loadSwitcher,
  loading: () => null,
});

const loadSortableContextComponent = () =>
  import(
    /* webpackChunkName: "@atlaskit/navigation-next/async-chunk/sortable-context-component" */ '../components/connected/SortableContext'
  );
const LazySortableContextComponent = Loadable({
  loader: loadSortableContextComponent,
  loading: () => null,
});

const loadSortableGroupComponent = () =>
  import(
    /* webpackChunkName: "@atlaskit/navigation-next/async-chunk/sortable-group-component" */ '../components/connected/SortableGroup'
  );
export const LazySortableGroupComponent = Loadable({
  loader: loadSortableGroupComponent,
  loading: () => null,
});

const loadSortableItem = () =>
  import(
    /* webpackChunkName: "@atlaskit/navigation-next/async-chunk/sortable-item" */ '../components/connected/SortableItem'
  );
export const LazySortableItem = Loadable({
  loader: loadSortableItem,
  loading: () => null,
});
/**
 * ITEMS
 */

// Title
const GroupHeading = ({ text, ...props }) => (
  <GroupHeadingComponent {...props}>{text}</GroupHeadingComponent>
);

// SectionHeading
const SectionHeading = ({ text, ...props }) => (
  <SectionHeadingComponent {...props}>{text}</SectionHeadingComponent>
);

// ContainerHeader
const ContainerHeader = (props) => (
  // -2px here to account for the extra space at the top of a MenuSection for
  // the scroll hint.
  <div css={{ paddingBottom: gridSize * 2.5 - 2 }}>
    <ContainerHeaderComponent {...props} />
  </div>
);

const Debug = (props) => (
  <pre
    css={{
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      fontSize: '10px',
      overflowX: 'auto',
      padding: `${gridSize / 2}px`,
    }}
  >
    {JSON.stringify(props, null, 2)}
  </pre>
);

/**
 * GROUPS
 */

// Group
const Group = ({ customComponents, hasSeparator, heading, items, id }) =>
  items.length ? (
    <GroupComponent heading={heading} hasSeparator={hasSeparator} id={id}>
      <TypedItemsRenderer items={items} customComponents={customComponents} />
    </GroupComponent>
  ) : null;

const SortableGroup = ({
  customComponents,
  hasSeparator,
  heading,
  items,
  id,
}) =>
  items && items.length ? (
    <LazySortableGroupComponent
      heading={heading}
      hasSeparator={hasSeparator}
      id={id}
    >
      <RenderBlocker items={items} customComponents={customComponents}>
        <TypedItemsRenderer items={items} customComponents={customComponents} />
      </RenderBlocker>
    </LazySortableGroupComponent>
  ) : null;

// Section
const Section = ({
  alwaysShowScrollHint = false,
  customComponents,
  id,
  items,
  nestedGroupKey,
  parentId,
  shouldGrow,
}) =>
  items.length ? (
    <SectionComponent
      alwaysShowScrollHint={alwaysShowScrollHint}
      id={id}
      key={nestedGroupKey}
      parentId={parentId}
      shouldGrow={shouldGrow}
    >
      {({ className }) => (
        <div className={className}>
          <TypedItemsRenderer
            items={items}
            customComponents={customComponents}
          />
        </div>
      )}
    </SectionComponent>
  ) : null;

const HeaderSection = ({ customComponents, id, items, nestedGroupKey }) =>
  items.length ? (
    <HeaderSectionComponent id={id} key={nestedGroupKey}>
      {({ className }) => (
        <div className={className}>
          <TypedItemsRenderer
            items={items}
            customComponents={customComponents}
          />
        </div>
      )}
    </HeaderSectionComponent>
  ) : null;

const MenuSection = ({
  alwaysShowScrollHint,
  customComponents,
  id,
  items,
  nestedGroupKey,
  parentId,
}) => (
  <MenuSectionComponent
    alwaysShowScrollHint={alwaysShowScrollHint}
    id={id}
    key={nestedGroupKey}
    parentId={parentId}
  >
    {({ className }) => (
      <div className={className}>
        <TypedItemsRenderer items={items} customComponents={customComponents} />
      </div>
    )}
  </MenuSectionComponent>
);

const SortableContext = ({
  customComponents,
  id,
  items,
  onDragStart,
  onDragUpdate,
  onDragEnd,
}) =>
  items && items.length ? (
    <LazySortableContextComponent
      id={id}
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
      <TypedItemsRenderer items={items} customComponents={customComponents} />
    </LazySortableContextComponent>
  ) : null;

const itemComponents = {
  BackItem,
  ContainerHeader,
  Debug,
  GoToItem,
  GroupHeading,
  Item: ConnectedItem,
  SortableItem: LazySortableItem,
  SectionHeading,
  Separator,
  Switcher: LazySwitcher,
  Wordmark,
};

const renderItemComponent = (props, key, index) => {
  let element = null;
  // We need an explicit conditional against each type for flow type refinement to work
  if (props.type === 'BackItem') {
    const { type, ...compProps } = props;
    element = <BackItem key={key} {...compProps} index={index} />;
  } else if (props.type === 'ContainerHeader') {
    const { type, ...compProps } = props;
    element = <ContainerHeader key={key} {...compProps} />;
  } else if (props.type === 'Debug') {
    const { type, ...compProps } = props;
    element = <Debug key={key} {...compProps} />;
  } else if (props.type === 'GoToItem') {
    const { type, ...compProps } = props;
    element = <GoToItem key={key} {...compProps} index={index} />;
  } else if (props.type === 'Item') {
    const { type, ...compProps } = props;
    element = <ConnectedItem key={key} {...compProps} index={index} />;
  } else if (props.type === 'SortableItem') {
    const { type, ...compProps } = props;
    element = <LazySortableItem key={key} {...compProps} index={index} />;
  } else if (props.type === 'SectionHeading') {
    const { type, id, ...compProps } = props;
    element = <SectionHeading key={key} {...compProps} />;
  } else if (props.type === 'Separator') {
    const { type, id, ...compProps } = props;
    element = <Separator key={key} {...compProps} />;
  } else if (props.type === 'Switcher') {
    const { type, ...compProps } = props;
    element = <LazySwitcher key={key} {...compProps} />;
  } else if (props.type === 'Wordmark') {
    const { type, id, ...compProps } = props;
    element = <Wordmark key={key} {...compProps} />;
  }

  return element;
};

const groupComponents = {
  Group,
  HeaderSection,
  MenuSection,
  Section,
  SortableContext,
  SortableGroup,
};

const renderGroupComponent = (props, key, customComponents) => {
  let element = null;
  // We need an explicit conditional against each type for flow type refinement to work
  if (props.type === 'Group') {
    const { type, ...compProps } = props;
    element = (
      <Group key={key} {...compProps} customComponents={customComponents} />
    );
  } else if (props.type === 'HeaderSection') {
    const { type, ...compProps } = props;
    element = (
      <HeaderSection
        key={key}
        {...compProps}
        customComponents={customComponents}
      />
    );
  } else if (props.type === 'MenuSection') {
    const { type, ...compProps } = props;
    element = (
      <MenuSection
        key={key}
        {...compProps}
        customComponents={customComponents}
      />
    );
  } else if (props.type === 'Section') {
    const { type, ...compProps } = props;
    element = (
      <Section key={key} {...compProps} customComponents={customComponents} />
    );
  } else if (props.type === 'SortableContext') {
    const { type, ...compProps } = props;
    element = (
      <SortableContext
        key={key}
        {...compProps}
        customComponents={customComponents}
      />
    );
  } else if (props.type === 'SortableGroup') {
    const { type, ...compProps } = props;
    element = (
      <SortableGroup
        key={key}
        {...compProps}
        customComponents={customComponents}
      />
    );
  }

  return element;
};

// Exported for testing purposes only.
export const components = { ...itemComponents, ...groupComponents };

/**
 * RENDERER
 */
class TypedItemsRenderer extends PureComponent {
  customComponentsWithAnalytics = new Map();

  getCustomComponent = (component) => {
    // cache custom components wrapped with analytics
    // to prevent re-mounting of component on re-render
    const { customComponents = {} } = this.props;
    let cachedComponent = this.customComponentsWithAnalytics.get(component);
    if (!cachedComponent) {
      cachedComponent =
        typeof component === 'string'
          ? navigationItemClicked(customComponents[component], component)
          : navigationItemClicked(
              component,
              component.displayName || 'inlineCustomComponent',
            );
      this.customComponentsWithAnalytics.set(component, cachedComponent);
    }
    return cachedComponent;
  };

  render() {
    const { customComponents = {}, items } = this.props;

    // We cannot destructure props.type otherwise flow type refinment does not work
    // https://github.com/facebook/flow/issues/5259
    return items.map((props, index) => {
      const key =
        typeof props.nestedGroupKey === 'string'
          ? props.nestedGroupKey
          : props.id;

      if (props.type === 'InlineComponent') {
        const { type, component, ...componentProps } = props;
        // If they've provided a component as the type
        const CustomComponent = this.getCustomComponent(props.component);
        return (
          <CustomComponent
            key={key}
            {...componentProps}
            index={index}
            // We pass our in-built components through to custom components so
            // they can wrap/render them if they want to.
            components={components}
            customComponents={customComponents}
          />
        );
      }
      if (Object.keys(groupComponents).includes(props.type)) {
        // If they've provided a type which matches one of our in-built group
        // components
        return renderGroupComponent(props, key, customComponents);
        // If they've provided a type which matches one of our in-built item
        // components.
      }
      if (Object.keys(itemComponents).includes(props.type)) {
        return renderItemComponent(props, key, index);
      }
      if (Object.keys(customComponents).includes(props.type)) {
        const { type, ...componentProps } = props;
        // If they've provided a type which matches one of their defined custom
        // components.
        const CustomComponent = this.getCustomComponent(type);
        return (
          <CustomComponent
            key={key}
            {...componentProps}
            index={index}
            // We pass our in-built components through to custom components so
            // they can wrap/render them if they want to.
            components={components}
            customComponents={customComponents}
          />
        );
      }

      return <Debug key={key} type={props.type} {...props} />;
    });
  }
}

export default TypedItemsRenderer;
