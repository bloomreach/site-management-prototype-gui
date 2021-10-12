import {Channel, Page} from "../api/models/site";
import {TreeItem} from "react-sortable-tree";

export const exampleSiteMapTreeData: TreeItem[] = [
  {
    "id": "_any_-va7hn6b1l",
    "siteMapItem": {
      "name": "_any_",
      "page": null,
      "pageTitle": null,
      "relativeContentPath": "xpages/${1}",
      "parameters": {},
      "doctypePages": {},
      "items": []
    },
    "title": "_any_",
    "expanded": true,
    "children": []
  },
  {
    "id": "articles-84q7ntb27",
    "siteMapItem": {
      "name": "articles",
      "page": null,
      "pageTitle": null,
      "relativeContentPath": "xpages/articles",
      "parameters": {},
      "doctypePages": {},
      "items": []
    },
    "title": "articles",
    "expanded": true,
    "children": [
      {
        "id": "_any_-413zib60b",
        "siteMapItem": {
          "name": "_any_",
          "page": "content",
          "pageTitle": null,
          "relativeContentPath": "content/articles/${1}",
          "parameters": {},
          "doctypePages": {},
          "items": []
        },
        "title": "_any_",
        "expanded": true,
        "children": []
      }
    ]
  },
  {
    "id": "products-ok80swipg",
    "siteMapItem": {
      "name": "products",
      "page": null,
      "pageTitle": null,
      "relativeContentPath": null,
      "parameters": {},
      "doctypePages": {},
      "items": []
    },
    "title": "products",
    "expanded": true,
    "children": [
      {
        "id": "_any_-pz973iuit",
        "siteMapItem": {
          "name": "_any_",
          "page": "product",
          "pageTitle": null,
          "relativeContentPath": "xpages/products/${1}",
          "parameters": {},
          "doctypePages": {},
          "items": []
        },
        "title": "_any_",
        "expanded": true,
        "children": []
      }
    ]
  },
  {
    "id": "root-b10gldtzy",
    "siteMapItem": {
      "name": "root",
      "page": null,
      "pageTitle": null,
      "relativeContentPath": "xpages/home",
      "parameters": {},
      "doctypePages": {},
      "items": []
    },
    "title": "root",
    "expanded": true,
    "children": []
  }
];

export const exampleChannels: Array<Channel> = [
  {
    "id": "brxsaas:vT9bR",
    "name": "BrX SaaS",
    "branch": "vT9bR",
    "branchOf": "brxsaas",
    "contentRootPath": "/content/documents/brxsaas",
    "locale": null,
    "devices": [],
    "defaultDevice": null,
    "responseHeaders": null,
    "linkurlPrefix": null,
    "cdnHost": null,
    "parameters": {
      "spaUrl": "https://brxm-react-spa.herokuapp.com/"
    }
  },
  {
    "id": "brxsaas",
    "name": "BrX SaaS",
    "branch": null,
    "branchOf": null,
    "contentRootPath": "/content/documents/brxsaas",
    "locale": null,
    "devices": [],
    "defaultDevice": null,
    "responseHeaders": null,
    "linkurlPrefix": null,
    "cdnHost": null,
    "parameters": {
      "spaUrl": "https://brxm-react-spa.herokuapp.com/"
    }
  }
]

export const examplePages: Array<Page> = [
  {
    "name": "base",
    "description": null,
    "parameters": {},
    "type": "abstract",
    "extends": null,
    "components": [
      {
        "name": "menu",
        "description": null,
        "parameters": {
          "selectedMenu": "on",
          "menu": "main",
          "level": "2"
        },
        "xtype": null,
        "definition": null,
        "components": [],
        "type": "static"
      },
      {
        "name": "top",
        "description": null,
        "parameters": {},
        "xtype": null,
        "definition": null,
        "components": [],
        "type": "static"
      },
      {
        "name": "main",
        "description": null,
        "parameters": {},
        "xtype": null,
        "definition": null,
        "components": [],
        "type": "static"
      },
      {
        "name": "bottom",
        "description": null,
        "parameters": {},
        "xtype": null,
        "definition": null,
        "components": [],
        "type": "static"
      },
      {
        "name": "footer",
        "description": null,
        "parameters": {},
        "xtype": null,
        "definition": null,
        "components": [
          {
            "name": "container",
            "description": null,
            "parameters": {},
            "xtype": "hst.nomarkup",
            "label": "Footer",
            "type": "managed"
          }
        ],
        "type": "static"
      }
    ]
  },
  {
    "name": "content",
    "description": null,
    "parameters": {},
    "type": "page",
    "extends": "base",
    "components": [
      {
        "name": "main",
        "description": null,
        "parameters": {},
        "xtype": null,
        "definition": null,
        "components": [
          {
            "name": "container",
            "description": null,
            "parameters": {},
            "xtype": "hst.nomarkup",
            "label": null,
            "type": "managed"
          }
        ],
        "type": "static"
      },
      {
        "name": "right",
        "description": null,
        "parameters": {},
        "xtype": null,
        "definition": null,
        "components": [
          {
            "name": "container",
            "description": null,
            "parameters": {},
            "xtype": "hst.nomarkup",
            "label": null,
            "type": "managed"
          }
        ],
        "type": "static"
      }
    ]
  },
  {
    "name": "one-column",
    "description": null,
    "parameters": {},
    "type": "xpage",
    "extends": "base",
    "components": [
      {
        "name": "top",
        "description": null,
        "parameters": {},
        "xtype": null,
        "definition": null,
        "components": [
          {
            "name": "container",
            "description": null,
            "parameters": {},
            "xtype": "hst.nomarkup",
            "label": "Top",
            "type": "managed"
          }
        ],
        "type": "static"
      },
      {
        "name": "main",
        "description": null,
        "parameters": {},
        "xtype": null,
        "definition": null,
        "components": [
          {
            "name": "container",
            "description": null,
            "parameters": {},
            "xtype": "hst.nomarkup",
            "label": "Main",
            "type": "managed"
          }
        ],
        "type": "static"
      },
      {
        "name": "bottom",
        "description": null,
        "parameters": {},
        "xtype": null,
        "definition": null,
        "components": [
          {
            "name": "container",
            "description": null,
            "parameters": {},
            "xtype": "hst.nomarkup",
            "label": "Bottom",
            "type": "managed"
          }
        ],
        "type": "static"
      }
    ]
  },
  {
    "name": "two-column",
    "description": null,
    "parameters": {},
    "type": "xpage",
    "extends": "base",
    "components": [
      {
        "name": "top",
        "description": null,
        "parameters": {},
        "xtype": null,
        "definition": null,
        "components": [
          {
            "name": "container",
            "description": null,
            "parameters": {},
            "xtype": "hst.nomarkup",
            "label": "Top",
            "type": "managed"
          }
        ],
        "type": "static"
      },
      {
        "name": "main",
        "description": null,
        "parameters": {},
        "xtype": null,
        "definition": null,
        "components": [
          {
            "name": "container",
            "description": null,
            "parameters": {},
            "xtype": "hst.nomarkup",
            "label": "Main",
            "type": "managed"
          }
        ],
        "type": "static"
      },
      {
        "name": "right",
        "description": null,
        "parameters": {},
        "xtype": null,
        "definition": null,
        "components": [
          {
            "name": "container",
            "description": null,
            "parameters": {},
            "xtype": "hst.nomarkup",
            "label": "Right",
            "type": "managed"
          }
        ],
        "type": "static"
      },
      {
        "name": "bottom",
        "description": null,
        "parameters": {},
        "xtype": null,
        "definition": null,
        "components": [
          {
            "name": "container",
            "description": null,
            "parameters": {},
            "xtype": "hst.nomarkup",
            "label": "Bottom",
            "type": "managed"
          }
        ],
        "type": "static"
      }
    ]
  }
]

export const exampleComponentDefintionParameters = [
  {
    "name": "document1",
    "valueType": "string",
    "required": true,
    "hidden": false,
    "overlay": false,
    "defaultValue": "",
    "displayName": null,
    "system": false,
    "config": {
      "pickerConfiguration": "cms-pickers/documents-only",
      "pickerInitialPath": "banners",
      "pickerRememberLastVisited": true,
      "pickerSelectableNodeTypes": [
        "brxsaas:banner"
      ],
      "relative": true,
      "pickerRootPath": null,
      "type": "contentpath"
    }
  },
  {
    "name": "document2",
    "valueType": "string",
    "required": false,
    "hidden": false,
    "overlay": false,
    "defaultValue": "",
    "displayName": null,
    "system": false,
    "config": {
      "pickerConfiguration": "cms-pickers/documents-only",
      "pickerInitialPath": "banners",
      "pickerRememberLastVisited": true,
      "pickerSelectableNodeTypes": [
        "brxsaas:banner"
      ],
      "relative": true,
      "pickerRootPath": null,
      "type": "contentpath"
    }
  },
  {
    "name": "document3",
    "valueType": "string",
    "required": false,
    "hidden": false,
    "overlay": false,
    "defaultValue": "",
    "displayName": null,
    "system": false,
    "config": {
      "pickerConfiguration": "cms-pickers/documents-only",
      "pickerInitialPath": "banners",
      "pickerRememberLastVisited": true,
      "pickerSelectableNodeTypes": [
        "brxsaas:banner"
      ],
      "relative": true,
      "pickerRootPath": null,
      "type": "contentpath"
    }
  },
  {
    "name": "document4",
    "valueType": "string",
    "required": false,
    "hidden": false,
    "overlay": false,
    "defaultValue": "",
    "displayName": null,
    "system": false,
    "config": {
      "pickerConfiguration": "cms-pickers/documents-only",
      "pickerInitialPath": "banners",
      "pickerRememberLastVisited": true,
      "pickerSelectableNodeTypes": [
        "brxsaas:banner"
      ],
      "relative": true,
      "pickerRootPath": null,
      "type": "contentpath"
    }
  },
  {
    "name": "document5",
    "valueType": "string",
    "required": false,
    "hidden": false,
    "overlay": false,
    "defaultValue": "",
    "displayName": null,
    "system": false,
    "config": {
      "pickerConfiguration": "cms-pickers/documents-only",
      "pickerInitialPath": "banners",
      "pickerRememberLastVisited": true,
      "pickerSelectableNodeTypes": [
        "brxsaas:banner"
      ],
      "relative": true,
      "pickerRootPath": null,
      "type": "contentpath"
    }
  },
  {
    "name": "document6",
    "valueType": "string",
    "required": false,
    "hidden": false,
    "overlay": false,
    "defaultValue": "",
    "displayName": null,
    "system": false,
    "config": {
      "pickerConfiguration": "cms-pickers/documents-only",
      "pickerInitialPath": "banners",
      "pickerRememberLastVisited": true,
      "pickerSelectableNodeTypes": [
        "brxsaas:banner"
      ],
      "relative": true,
      "pickerRootPath": null,
      "type": "contentpath"
    }
  },
  {
    "name": "document7",
    "valueType": "string",
    "required": false,
    "hidden": false,
    "overlay": false,
    "defaultValue": "",
    "displayName": null,
    "system": false,
    "config": {
      "pickerConfiguration": "cms-pickers/documents-only",
      "pickerInitialPath": "banners",
      "pickerRememberLastVisited": true,
      "pickerSelectableNodeTypes": [
        "brxsaas:banner"
      ],
      "relative": true,
      "pickerRootPath": null,
      "type": "contentpath"
    }
  },
  {
    "name": "document8",
    "valueType": "string",
    "required": false,
    "hidden": false,
    "overlay": false,
    "defaultValue": "",
    "displayName": null,
    "system": false,
    "config": {
      "pickerConfiguration": "cms-pickers/documents-only",
      "pickerInitialPath": "banners",
      "pickerRememberLastVisited": true,
      "pickerSelectableNodeTypes": [
        "brxsaas:banner"
      ],
      "relative": true,
      "pickerRootPath": null,
      "type": "contentpath"
    }
  },
  {
    "name": "title",
    "valueType": "string",
    "required": false,
    "hidden": false,
    "overlay": false,
    "defaultValue": "",
    "displayName": null,
    "system": false,
    "config": null
  }
]