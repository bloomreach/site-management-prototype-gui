import {TreeItem} from "react-sortable-tree";
import {AbstractComponent, ManagedComponent, Page, StaticComponent} from "./api/models";

export interface ComponentTreeItem extends TreeItem {
  id: string
  children: ComponentTreeItem[],
  component: Page | StaticComponent | ManagedComponent | AbstractComponent
}

export interface TreeModel {
  page: Readonly<Page>,
  treeData: ComponentTreeItem[]
}

export const getNodeKey = ({node}: any) => node.id;

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

export function getId () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random().toString(36).substr(2, 9);
}

export function isNotEmptyOrNull (array: any) {
  return (typeof array !== 'undefined' && array.length > 0);
}

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

/**
 * Update ids of a node and its children. Useful for avoiding clash of ids when adding nodes under same nodes
 * @param node
 */
// export function updateNodeIds (node) {
//   node.id = node.title + getId();
//   node.children && node.children.forEach(childNode => {
//     updateNodeIds(childNode);
//   });
// }
