import {ParameterType, ParameterTypeValueTypeEnum} from "../api/models";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import React from "react";
import {JSONSchema7} from "json-schema";
import {SvgIcon} from "@material-ui/core";

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
    ParameterContentPathType: {
      "title": "Content Path",
      // required: [
      //   "type"
      // ],
      type: "object",
      properties: {
        type: {
          type: 'string',
          "default": 'contentpath',
        },
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
    // ParameterConfigType: {
    //   "title": "ParameterConfigType",
    //   required: [
    //     "type"
    //   ],
    //   type: "object",
    //   oneOf: [
    //     {
    //       title: 'Empty',
    //       type: ''
    //     },
    //     {
    //       title: 'Content Path',
    //       $ref: "#/definitions/ParameterContentPathType"
    //     },
    //     {
    //       title: 'Dropdown',
    //       $ref: "#/definitions/ParameterDropdownType"
    //     },
    //     {
    //       title: 'Image',
    //       $ref: "#/definitions/ParameterImageSetPathType"
    //     }
    //   ]
    // },
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
          "type": "object",
          oneOf: [
            {
              title: 'Empty',
              type: 'null'
            },
            {
              title: 'Content Path',
              properties: {
                type: {
                  type: 'string',
                  "default": 'contentpath',
                },
              },
              $ref: "#/definitions/ParameterContentPathType"
            },
            // {
            //   title: 'Dropdown',
            //   $ref: "#/definitions/ParameterDropdownType"
            // },
            // {
            //   title: 'Image',
            //   $ref: "#/definitions/ParameterImageSetPathType"
            // }
          ]
        }
      }
    },
  },
  type: "array",
  items: {
    $ref: "#/definitions/ParameterType"
  }
}

export const baseParameterDefinitionSchema: JSONSchema7 = {
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
      readOnly: true,
      description: "System readonly parameter"
    },
  }
};

enum ParameterTypeEnum {
  SIMPLE = 'simple',
  CONTENT_PATH = 'contentpath',
  DROPDOWN = 'dropdown',
  IMAGE_PATH = 'imagepath'
}

function getTypeFromParameter (parameter: ParameterType) {
  let type: ParameterTypeEnum = ParameterTypeEnum.SIMPLE;
  if (parameter.config !== null) {
    switch (parameter.config.type) {
      case ParameterTypeEnum.CONTENT_PATH:
        type = ParameterTypeEnum.CONTENT_PATH;
        break;
      case ParameterTypeEnum.DROPDOWN:
        type = ParameterTypeEnum.DROPDOWN;
        break;
      case ParameterTypeEnum.IMAGE_PATH:
        type = ParameterTypeEnum.IMAGE_PATH;
        break;
    }
  }
  return type
}

export function getSchemaFromParameter (parameter: ParameterType): JSONSchema7 {
  const typeFromParameter: ParameterTypeEnum = getTypeFromParameter(parameter);
  console.log('type', typeFromParameter);
  const schema: JSONSchema7 = {...baseParameterDefinitionSchema};
  switch (typeFromParameter) {
    case ParameterTypeEnum.CONTENT_PATH:
      if (schema.properties) {
        schema.properties.config = {
          "title": "Content Path",
          type: "object",
          properties: {
            type: {
              type: 'string',
              readOnly: true,
              "default": 'contentpath',
            },
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
        };
      }
      break;
    case ParameterTypeEnum.DROPDOWN:
      if (schema.properties) {
        schema.properties.config = {
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
        };
      }
      break;
    default:
      if (schema.properties) {
        delete schema.properties.config
      }
      break;
  }
  console.log('schema', schema);
  return schema;
}

const simpleParameterTemplate: ParameterType = {
  "name": "string",
  "valueType": ParameterTypeValueTypeEnum.String,
  "required": false,
  "hidden": false,
  "overlay": false,
  "defaultValue": "",
  "displayName": undefined,
  "system": false,
  "config": null
}

export const simpleStringParameterTemplate: ParameterType = {
  ...simpleParameterTemplate,
  "name": "string",
  "valueType": ParameterTypeValueTypeEnum.String,
};

export const simpleIntegerParameterTemplate: ParameterType = {
  ...simpleParameterTemplate,
  "name": "integer",
  "valueType": ParameterTypeValueTypeEnum.Integer,
};

export const simpleNumberParameterTemplate: ParameterType = {
  ...simpleParameterTemplate,
  "name": "number",
  "valueType": ParameterTypeValueTypeEnum.Number,
};

export const simpleDateParameterTemplate: ParameterType = {
  ...simpleParameterTemplate,
  "name": "calendar",
  "valueType": ParameterTypeValueTypeEnum.Calendar,
};

export const simpleBooleanParameterTemplate: ParameterType = {
  ...simpleParameterTemplate,
  "name": "boolean",
  "valueType": ParameterTypeValueTypeEnum.Boolean,
};

export function getParameterIcon (parameter: ParameterType) {
  let icon;
  if (parameter.config === null) {
    switch (parameter.valueType) {
      case ParameterTypeValueTypeEnum.String:
        icon = <TextFieldsIcon/>;
        break;
    }
  } else {

  }
  return icon;

}

export function DecimalIcon (props: any) {
  return (
    <SvgIcon {...props}>
      {/*<path d="M22,17L19,20V18H13V16H19V14L22,17M9,5A3,3 0 0,1 12,8V11A3,3 0 0,1 9,14A3,3 0 0,1 6,11V8A3,3 0 0,1 9,5M9,7A1,1 0 0,0 8,8V11A1,1 0 0,0 9,12A1,1 0 0,0 10,11V8A1,1 0 0,0 9,7M16,5A3,3 0 0,1 19,8V11A3,3 0 0,1 16,14A3,3 0 0,1 13,11V8A3,3 0 0,1 16,5M16,7A1,1 0 0,0 15,8V11A1,1 0 0,0 16,12A1,1 0 0,0 17,11V8A1,1 0 0,0 16,7M4,12A1,1 0 0,1 5,13A1,1 0 0,1 4,14A1,1 0 0,1 3,13A1,1 0 0,1 4,12Z"/>*/}
      <path d="M10 7A3 3 0 0 0 7 10V13A3 3 0 0 0 13 13V10A3 3 0 0 0 10 7M11 13A1 1 0 0 1 9 13V10A1 1 0 0 1 11 10M17 7A3 3 0 0 0 14 10V13A3 3 0 0 0 20 13V10A3 3 0 0 0 17 7M18 13A1 1 0 0 1 16 13V10A1 1 0 0 1 18 10M6 15A1 1 0 1 1 5 14A1 1 0 0 1 6 15Z" />
    </SvgIcon>
  );
}


