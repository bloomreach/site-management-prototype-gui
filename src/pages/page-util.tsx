import {TreeItem} from "react-sortable-tree";
import {AbstractComponent, ManagedComponent, Page, StaticComponent} from "../api/models";
import {getId, isNotEmptyOrNull} from "../common/common-utils";
import {JSONSchema7} from "json-schema";
import {Nullable} from "../api/models/nullable";

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
    }) as ComponentTreeItem;

  isNotEmptyOrNull(component.components) &&
  component.components != null &&
  component.components.forEach(child => node.children.push((componentToNode(child)) as ComponentTreeItem));
  return node;
}

enum ComponentType {
  PAGE = 'page',
  XPAGE = 'xpage',
  ABSTRACT = 'abstract',
  MANAGED = 'managed',
  STATIC = 'static',
}

export function getSchemaForComponentType (type: Nullable<string>) {
  let schema = componentSchema;
  switch (type) {
    case ComponentType.PAGE:
    case ComponentType.XPAGE:
    case ComponentType.ABSTRACT:
      schema = pageSchema as JSONSchema7;
      Object.assign(schema.properties?.name, {readOnly: true});
      break;
    case ComponentType.MANAGED:
      Object.assign(schema.properties, {
        xtype: {
          type: "string",
        },
        label: {
          type: "string",
        }
      });
      delete schema.properties?.definition;
      break;
    case ComponentType.STATIC:
      Object.assign(schema.properties, {
        definition: {
          type: "string",
        }
      });
      delete schema.properties?.xtype;
      delete schema.properties?.label;
      break;
  }
  return schema
}

export const componentSchema: JSONSchema7 = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    description: {
      type: "string"
    },
    parameters: {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    }
  }
};

export const pageSchema = {
  type: "object",
  properties: {
    type: {
      type: "string",
      "enum":
        [
          "abstract",
          "page",
          "xpage",
        ],
      "enumNames":
        [
          "Abstract Page",
          "Page",
          "X Page",
        ]
    },
    extends: {
      type: "string"
    },
    name: {
      type: "string",
    },
    description: {
      type: "string"
    },
    parameters: {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    }
  }
};

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
