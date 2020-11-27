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
import {AbstractComponent, Page} from "./api/models";
import {Nullable} from "./api/models/nullable";

interface ComponentTreeItem extends TreeItem {
  parameters: Record<string, any>[],
  children: ComponentTreeItem[],
  handle: string
}

interface TreeModel {
  id: string,
  name?: Nullable<string>,
  treeData: ComponentTreeItem[]
}

/**
 * Converts the component object coming from server to the node object that react ui understands
 **/
export function componentToNode (component: AbstractComponent, handle?: string) {
  const node =
    ({
      id: `${component.name}-${getId()}`,
      jcrNodeName: component.name,
      type: component.type,
      title: component.description,
      label: component.label,
      xtype: component.xtype,
      expanded: true,
      parameters: [],
      children: [],
      handle: handle
    }) as ComponentTreeItem;

  isNotEmptyOrNull(component.components) &&
  component.components != null &&
  component.components.forEach(child => node.children.push((componentToNode(child, handle)) as ComponentTreeItem));

  component.parameters && Object.entries(component.parameters).forEach((value) => {
    node.parameters.push({
      key: value[0],
      value: value[1]
    });
  })
  // console.log(comp);
  return node;
}

function isPage (x: any): x is Page {
  return x.type === "page" || x.type == "xpage" || x.type === "abstract";
}

function isComponent (x: any): x is AbstractComponent {
  return x.type === "static" || x.type === "managed";
}

function isManagedComponent (x: any): x is AbstractComponent {
  return x.type === "managed";
}

function isStaticComponent (x: any): x is AbstractComponent {
  return x.type === "static";
}

export function getId () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random().toString(36).substr(2, 9);
}

export function isNotEmptyOrNull (array: any) {
  return (typeof array !== 'undefined' && array.length > 0);
}

export function convertComponentsToTreeDataArray (components: Array<AbstractComponent>) {
  const trees: Array<TreeModel> = [];
  if (isNotEmptyOrNull(components)) {
    components.forEach(component => {
      const handle = `${component.name}-${getId()}`
      trees.push({
          id: handle,
          name: component.description,
          treeData: [componentToNode(component, handle)]
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

/**
 * Perform a deep copy of a json
 */
export function deepCopy (obj: Object) {
  return JSON.parse(JSON.stringify(obj));
}