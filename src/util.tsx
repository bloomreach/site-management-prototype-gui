/**
 * Converts the node object of react tree ui to the component object that server understands
 **/

// export function nodeToComponent (node) {
//   let component = {
//     name: node.jcrNodeName,
//     managed: node.type === 'container',
//     parameters: {},
//     label: node.label,
//     description: node.title,
//     xtype: node.xtype,
//     type: node.type
//   }
//   node.children && node.children.forEach(c => {
//     if (!component.components) {
//       component.components = []
//     }
//     component.components.push(nodeToComponent(c))
//   });
//
//   node.parameters && node.parameters.forEach(paramObj => {
//     component.parameters[paramObj['key']] = paramObj['value'];
//   })
//   return component;
// }

import {TreeItem} from "react-sortable-tree";
import {AbstractComponent, ManagedComponent, Page, StaticComponent} from "./api/models";
import {Nullable} from "./api/models/nullable";

export interface ComponentTreeItem extends TreeItem {
  id: string
  children: ComponentTreeItem[],
  component: Page | StaticComponent | ManagedComponent | AbstractComponent
  handle: string
}

export interface TreeModel {
  id: string,
  page: Page,
  name?: Nullable<string>,
  treeData: ComponentTreeItem[]
}

/**
 * Converts the component object coming from server to the node object that react ui understands
 **/
export function componentToNode (component: AbstractComponent | StaticComponent | Page | ManagedComponent, handle?: string) {
  const node =
    ({
      id: `${component.name}-${getId()}`,
      component: {...component},
      title: `${component.name}`,
      expanded: true,
      children: [],
      handle: handle
    }) as ComponentTreeItem;

  isNotEmptyOrNull(component.components) &&
  component.components != null &&
  component.components.forEach(child => node.children.push((componentToNode(child, handle)) as ComponentTreeItem));

  // component.parameters && Object.entries(component.parameters).forEach((value) => {
  //   node.parameters.push({
  //     key: value[0],
  //     value: value[1]
  //   });
  // })
  // console.log(node);
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

export function convertPagesToTreeDataArray (pages: Array<Page>) {
  const trees: Array<TreeModel> = [];
  if (isNotEmptyOrNull(pages)) {
    pages.forEach(page => {
      const handle = `${page.name}-${getId()}`
      trees.push({
          id: handle,
          page: {...page},
          name: page.name,
          treeData: [componentToNode(page, handle)]
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
