import {ParameterType, ParameterTypeValueTypeEnum} from "../api/models";

export const componentDefinitionSchema = {
  "required": ["extends", "id"],
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      readOnly: true
    },
    "extends": {
      "type": "string",
    },
    "label": {
      "type": "string",
    },
    "icon": {
      "type": ["string", 'null'],
      // format: "data-url",
    },
    "ctype": {
      "type": "string",
    },
    "xtype": {
      "type": "string",
    },
    "hidden": {
      "type": "boolean",
    },
    "system": {
      "type": "boolean",
    }
  }
};

export const componentParameterDefinitionSchema = {
  definitions: {
    None: {
      "title": "None",
      type: "null",
    },
    ParameterContentPathType: {
      "title": "Content Path",
      required: [
        "type"
      ],
      type: "object",
      properties: {
        pickerConfiguration: {
          type: "string"
        },
        pickerInitialPath: {
          type: "string"
        },
        pickerRememberLastVisited: {
          type: "boolean"
        },
        pickerSelectableNodeTypes: {
          type: "array",
          items: {
            type: "string"
          }
        },
        relative: {
          type: "boolean"
        },
        pickerRootPath: {
          type: "string"
        }
      }
    },
    ParameterDropdownType: {
      "title": "Dropdown",
      required: [
        "sourceId",
        "type",
        "value",
        "valueListProvider"
      ],
      type: "object",
      properties: {
        value: {
          type: "array",
          items: {
            type: "string"
          }
        },
        valueListProvider: {
          type: "string"
        },
        sourceId: {
          type: "string"
        }
      }
    },
    ParameterImageSetPathType: {
      "title": "ParameterImageSetPathType",
      required: [
        "type"
      ],
      type: "object",
      properties: {
        pickerConfiguration: {
          type: "string"
        },
        pickerInitialPath: {
          type: "string"
        },
        pickerRememberLastVisited: {
          type: "boolean"
        },
        pickerSelectableNodeTypes: {
          type: "array",
          items: {
            type: "string"
          }
        },
        previewVariant: {
          type: "string"
        }
      }
    },
    ParameterConfigType: {
      "title": "ParameterConfigType",
      required: [
        "type"
      ],
      type: "object",
      anyOf: [
        {
          title: 'Empty',
        },
        {
          title: 'Content Path',
          $ref: "#/definitions/ParameterContentPathType"
        },
        {
          title: 'Dropdown',
          $ref: "#/definitions/ParameterDropdownType"
        },
        {
          title: 'Image',
          $ref: "#/definitions/ParameterImageSetPathType"
        }
      ]
    },
    ParameterType: {
      "title": "ParameterType",
      required: [
        "name",
        "valueType"
      ],
      type: "object",
      properties: {
        name: {
          type: "string"
        },
        valueType: {
          type: "string",
          enum: [
            "string",
            "calendar",
            "boolean",
            "integer",
            "number"
          ]
        },
        required: {
          type: "boolean"
        },
        hidden: {
          type: "boolean"
        },
        overlay: {
          type: "boolean"
        },
        defaultValue: {
          type: "string"
        },
        displayName: {
          type: "string"
        },
        system: {
          type: "boolean",
          description: "System readonly parameter"
        },
        config: {
          $ref: "#/definitions/ParameterConfigType"
        }
      }
    },
  },
  type: "array",
  items: {
    $ref: "#/definitions/ParameterType"
  }
}

export const simpleStringParameterTemplate : ParameterType = {
  "name": "string",
  "valueType": ParameterTypeValueTypeEnum.String,
  "required": false,
  "hidden": false,
  "overlay": false,
  "defaultValue": "",
  "displayName": undefined,
  "system": false,
  "config": null
};

