import {ParameterType, ParameterTypeValueTypeEnum} from "../api/models";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import React from "react";
import {JSONSchema7} from "json-schema";
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import ArrowDropDownCircleOutlinedIcon from '@material-ui/icons/ArrowDropDownCircleOutlined';
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';

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
    defaultValue: {
      type: "string"
    },
    displayName: {
      type: "string"
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
    //todo add image
    default:
      if (schema.properties) {
        delete schema.properties.config
      }
      break;
  }
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
};

export const simpleStringParameterTemplate: ParameterType = {
  ...simpleParameterTemplate,
  "name": "string",
  "valueType": ParameterTypeValueTypeEnum.String,
};

export const contentPathParameterTemplate: ParameterType = {
  ...simpleParameterTemplate,
  "name": "string",
  "valueType": ParameterTypeValueTypeEnum.String,
  "config": {
    "pickerConfiguration": "cms-pickers/documents-only",
    "pickerInitialPath": "",
    "pickerRememberLastVisited": true,
    "pickerSelectableNodeTypes": [
      ""
    ],
    "relative": true,
    "pickerRootPath": null,
    "type": "contentpath"
  }
};

export const dropDownParameterTemplate: ParameterType = {
  ...simpleParameterTemplate,
  "name": "string",
  "valueType": ParameterTypeValueTypeEnum.String,
  "config": {
    "value": [
      "",
    ],
    "valueListProvider": null,
    "sourceId": null,
    "type": "dropdown"
  }
};

export function getParameterIcon (parameter: ParameterType) {
  let icon;
  if (parameter.config === null) {
    switch (parameter.valueType) {
      case ParameterTypeValueTypeEnum.String:
        icon = <TextFieldsIcon/>;
        break;
      case ParameterTypeValueTypeEnum.Number:
        icon = <DecimalIcon/>;
        break;
      case ParameterTypeValueTypeEnum.Integer:
        icon = <NumericIcon/>;
        break;
      case ParameterTypeValueTypeEnum.Calendar:
        icon = <CalendarTodayOutlinedIcon/>;
        break;
      case ParameterTypeValueTypeEnum.Boolean:
        icon = <CheckBoxOutlinedIcon/>;
        break;
    }
  } else {
    switch (parameter.config.type) {
      case ParameterTypeEnum.DROPDOWN:
        icon = <ArrowDropDownCircleOutlinedIcon/>;
        break;
      case ParameterTypeEnum.CONTENT_PATH:
        icon = <LinkOutlinedIcon/>;
        break;
      case ParameterTypeEnum.IMAGE_PATH:
        icon = <ImageOutlinedIcon/>;
        break;
    }
  }
  return icon;
}

export const fieldGroupSchema = {
  type: "string",
};

export const fieldGroupUiSchema = {
  "ui:autofocus": true
};

export const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function NumericIcon (props: any) {
  return (
    <span className="fa-stack fa-3x">
      <i className="fa fa-square-o fa-stack-2x"></i>
      <strong className="fa-stack-1x icon-text" style={{fontSize: '0.5em'}}>1</strong>
    </span>
  )
}

function DecimalIcon (props: any) {
  return (
    <span className="fa-stack fa-3x">
      <i className="fa fa-square-o fa-stack-2x"></i>
      <strong className="fa-stack-1x icon-text" style={{fontSize: '0.3em'}}>1.0</strong>
    </span>
  )
}


