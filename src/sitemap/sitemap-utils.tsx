import {SitemapItem} from "../api/models/site";
import {getId, isNotEmptyOrNull} from "../common/common-utils";
import {TreeItem} from "react-sortable-tree";

export function nodeToSiteMapItems (treeData: TreeItem[]): SitemapItem[] {
  const siteMapItems: Array<SitemapItem> = treeData.map(treeItem => {

    const siteMapItem: SitemapItem = {
      ...treeItem.siteMapItem,
      items: []
    };

    // @ts-ignore
    treeItem.children && treeItem.children.forEach((nodeChild: TreeItem) => {
      const smi: SitemapItem[] = nodeToSiteMapItems([nodeChild]);
      siteMapItem.items?.push(smi[0]);
    });

    return siteMapItem;
  });
  return siteMapItems;
}

export function siteMapItemToTreeItem (siteMapItem: SitemapItem): TreeItem {
  const treeItem = ({
    id: `${siteMapItem.name}-${getId()}`,
    siteMapItem: {...siteMapItem, items: []},
    title: `/${replaceWildCards(siteMapItem.name)}`,
    subtitle: hasWildCardOrReserved(siteMapItem.name) && `/${siteMapItem.name}`,
    expanded: true,
    children: [],
  }) as TreeItem;

  // @ts-ignore
  isNotEmptyOrNull(siteMapItem.items) && siteMapItem.items.forEach(child => treeItem.children.push((siteMapItemToTreeItem(child)) as TreeItem));
  return treeItem;
}

export function replaceWildCards (name: string) {
  return name.replace('_any_', '**')
    .replace('_default_', '*')
    .replace('root', '')
    .replace('home', '')
      .replace('_index_', './')
}

export function hasWildCardOrReserved (name: string) {
  return name.includes('_any_') || name.includes('_default_') || name === 'root' || name ==='home' || name.includes('_index_');
}

export function convertSiteMapToTreeData (siteMapItems: Array<SitemapItem>): TreeItem[] {
  const treeData: TreeItem[] = [];
  if (isNotEmptyOrNull(siteMapItems)) {
    siteMapItems.forEach(siteMapItem => {
      treeData.push(siteMapItemToTreeItem(siteMapItem));
    })
  }
  return treeData;
}

export const simpleSiteMapItemSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    }
  }
};

export const siteMapItemSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    pageTitle: {
      type: ["string", 'null']
    },
    layout: {
      type: ["string", 'null']
    },
    relativeContentPath: {
      type: ["string", 'null']
    },
    parameters: {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    documentRequired:{
      type: "boolean"
    },
    doctypePages:{
      type: "array",
      items: {
        type: "string"
      }
    }
  }
};

export const siteMapItemUiSchema = {
  name: {
    "ui:autofocus": true
  }
};