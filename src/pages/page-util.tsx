import {TreeItem} from "react-sortable-tree";
import {AbstractComponent, ManagedComponent, Page, StaticComponent} from "../api/models";
import {getId, isNotEmptyOrNull} from "../common/common-utils";

export interface ComponentTreeItem extends TreeItem {
  id: string
  children: ComponentTreeItem[],
  component: Page | StaticComponent | ManagedComponent | AbstractComponent
}

export interface TreeModel {
  page: Readonly<Page>,
  treeData: ComponentTreeItem[]
}

/**
 * Converts the node object of react tree ui to the component object that server understands
 **/

export function nodeToComponent (node: ComponentTreeItem) {
  const component: Page | StaticComponent | ManagedComponent | AbstractComponent = {
    ...node.component,
    components: undefined
  };

  node.children && node.children.forEach(nodeChild => {
    if (!component.components) {
      component.components = []
    }
    component.components.push(nodeToComponent(nodeChild))
  });

  return component;
}

/**
 * Converts the component object coming from server to the node object that react ui understands
 **/
export function componentToNode (component: AbstractComponent | StaticComponent | Page | ManagedComponent) {
  const node =
    ({
      id: `${component.name}-${getId()}`,
      component: {...component, components: []},
      title: `${component.name}`,
      expanded: true,
      children: [],
      // handle: handle
    }) as ComponentTreeItem;

  // node.component.components = [];

  isNotEmptyOrNull(component.components) &&
  component.components != null &&
  component.components.forEach(child => node.children.push((componentToNode(child)) as ComponentTreeItem));
  return node;
}

// function isPage (x: any): x is Page {
//   return x.type === "page" || x.type === "xpage" || x.type === "abstract";
// }
//
// function isComponent (x: any): x is AbstractComponent {
//   return x.type === "static" || x.type === "managed";
// }
//
// function isManagedComponent (x: any): x is AbstractComponent {
//   return x.type === "managed";
// }
//
// function isStaticComponent (x: any): x is AbstractComponent {
//   return x.type === "static";
// }

export function convertPagesToTreeModelArray (pages: Array<Page>) {
  const trees: Array<TreeModel> = [];
  if (isNotEmptyOrNull(pages)) {
    pages.forEach(page => {
      trees.push({
          page: page,
          treeData: [componentToNode(page)]
        }
      )
    })
  }
  return trees;
}
