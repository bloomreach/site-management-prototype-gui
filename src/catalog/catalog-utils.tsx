export const componentDefinitionSchema = {
  definitions: {
    ParameterContentPathType: {
      required: [
        "type"
      ],
      type: "object",
      allOf: [
        {
          $ref: "#/definitions/ParameterConfigType"
        },
        {
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
        }
      ]
    },
    ParameterDropdownType: {
      required: [
        "sourceId",
        "type",
        "value",
        "valueListProvider"
      ],
      type: "object",
      allOf: [
        {
          $ref: "#/definitions/ParameterConfigType"
        },
        {
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
        }
      ]
    },
    ParameterImageSetPathType: {
      required: [
        "type"
      ],
      type: "object",
      allOf: [
        {
          $ref: "#/definitions/ParameterConfigType"
        },
        {
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
        }
      ]
    },
    ParameterConfigType: {
      required: [
        "type"
      ],
      type: "object",
      properties: {
        type: {
          type: "string",
          readOnly: true,
          enum: [
            "contentpath",
            "dropdown",
            "imagesetpath"
          ]
        }
      },
      description: "Field Config",
      discriminator: {
        propertyName: "type",
        mapping: {
          contentpath: "#/definitions/ParameterContentPathType",
          dropdown: "#/definitions/ParameterDropdownType",
          imagesetpath: "#/definitions/ParameterImageSetPathType"
        }
      },
      oneOf: [
        {
          $ref: "#/definitions/ParameterContentPathType"
        },
        {
          $ref: "#/definitions/ParameterDropdownType"
        },
        {
          $ref: "#/definitions/ParameterImageSetPathType"
        }
      ]
    },
    ParameterType: {
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
          type: "object"
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
    }
  },
  "required": ["extends", "id"],
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
    },
    "extends": {
      "type": "string",
    },
    "hidden": {
      "type": "boolean",
    },
    "system": {
      "type": "boolean",
    },
    "xtype": {
      "type": "string",
    },
    "ctype": {
      "type": "string",
    },
    "label": {
      "type": "string",
    },
    "icon": {
      "type": "string",
    },
    parameters: {
      type: "array",
      description: "custom (residual) or customized (overlaying) parameters for this component definition",
      items: {
        $ref: "#/definitions/ParameterType"
      }
    }
  }
};