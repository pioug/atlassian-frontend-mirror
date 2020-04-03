export const ShownWhenCollapsed = ({ isCollapsed = false, children }) => {
  return isCollapsed ? children : null;
};

export const HiddenWhenCollapsed = ({ isCollapsed = false, children }) => {
  return isCollapsed ? null : children;
};
