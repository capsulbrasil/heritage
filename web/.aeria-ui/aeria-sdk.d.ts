import type {
  InferProperty,
  InferProperties,
  SchemaWithId,
  PackReferences,
  MakeEndpoint,
  RequestMethod,
  CollectionFunctionsSDK

} from '@aeriajs/types'

declare type MirrorDescriptions = {
  "asset": {
    "$id": "asset",
    "properties": {
      "name": {
        "type": "string"
      },
      "code": {
        "type": "string"
      },
      "includes_accessories": {
        "type": "boolean"
      },
      "registered_by": {
        "$ref": "user",
        "indexes": [
          "name"
        ]
      },
      "observation": {
        "type": "string"
      },
      "created_at": {
        "type": "string",
        "format": "date-time",
        "noForm": true,
        "readOnly": true,
        "isTimestamp": true
      },
      "updated_at": {
        "type": "string",
        "format": "date-time",
        "noForm": true,
        "readOnly": true,
        "isTimestamp": true
      }
    },
    "icon": "desktop-tower",
    "table": [
      "name",
      "code",
      "includes_accessories",
      "registered_by",
      "observation"
    ],
    "required": [
      "name",
      "code",
      "includes_accessories",
      "registered_by"
    ],
    "filters": [
      "name",
      "includes_accessories",
      "registered_by"
    ],
    "presets": [
      "crud"
    ],
    "search": {
      "indexes": [
        "name",
        "code"
      ],
      "placeholder": "Insira a pesquisa aqui"
    },
    "actions": {
      "spawnAdd": {
        "label": "action.add",
        "event": "spawnAdd",
        "icon": "plus",
        "button": true,
        "translate": true
      }
    },
    "individualActions": {
      "spawnEdit": {
        "label": "action.edit",
        "event": "spawnEdit",
        "icon": "pencil-simple",
        "translate": true
      },
      "viewItem": {
        "label": "action.view",
        "icon": "eye",
        "translate": true,
        "route": {
          "name": "/dashboard/:collection/:id",
          "setItem": true
        }
      },
      "remove": {
        "label": "action.remove",
        "icon": "trash",
        "ask": true,
        "translate": true
      }
    }
  },
  "employee": {
    "$id": "employee",
    "properties": {
      "name": {
        "type": "string"
      },
      "corporate_email": {
        "type": "string"
      },
      "contact": {
        "type": "string"
      },
      "is_active": {
        "type": "boolean"
      },
      "picture_file": {
        "$ref": "file",
        "accept": [
          "image/*"
        ],
        "indexes": [
          "name",
          "link",
          "type",
          "size"
        ]
      },
      "admission_date": {
        "type": "string",
        "format": "date"
      },
      "exit_date": {
        "type": "string",
        "format": "date"
      },
      "created_at": {
        "type": "string",
        "format": "date-time",
        "noForm": true,
        "readOnly": true,
        "isTimestamp": true
      },
      "updated_at": {
        "type": "string",
        "format": "date-time",
        "noForm": true,
        "readOnly": true,
        "isTimestamp": true
      }
    },
    "icon": "folder-user",
    "table": [
      "name",
      "corporate_email",
      "is_active",
      "admission_date",
      "exit_date"
    ],
    "required": [
      "name",
      "corporate_email",
      "contact"
    ],
    "presets": [
      "crud"
    ],
    "formLayout": {
      "fields": {
        "exit_date": {
          "if": {
            "not": {
              "operator": "equal",
              "term1": "is_active",
              "term2": true
            }
          }
        }
      }
    },
    "actions": {
      "spawnAdd": {
        "label": "action.add",
        "event": "spawnAdd",
        "icon": "plus",
        "button": true,
        "translate": true
      }
    },
    "individualActions": {
      "spawnEdit": {
        "label": "action.edit",
        "event": "spawnEdit",
        "icon": "pencil-simple",
        "translate": true
      },
      "viewItem": {
        "label": "action.view",
        "icon": "eye",
        "translate": true,
        "route": {
          "name": "/dashboard/:collection/:id",
          "setItem": true
        }
      },
      "remove": {
        "label": "action.remove",
        "icon": "trash",
        "ask": true,
        "translate": true
      }
    }
  },
  "equipmentRelease": {
    "$id": "equipmentRelease",
    "properties": {
      "equipments": {
        "type": "array",
        "items": {
          "$ref": "asset",
          "populate": [
            "name",
            "code"
          ],
          "indexes": [
            "name"
          ]
        }
      },
      "delivered_to": {
        "$ref": "employee",
        "populate": [
          "name",
          "corporate_email",
          "contact",
          "is_active",
          "picture_file",
          "admission_date",
          "exit_date"
        ],
        "constraints": {
          "operator": "equal",
          "term1": "is_active",
          "term2": true
        },
        "indexes": [
          "name"
        ]
      },
      "delivered_by": {
        "$ref": "user",
        "populate": [
          "name",
          "email"
        ],
        "indexes": [
          "name"
        ]
      },
      "allocation_date": {
        "type": "string",
        "format": "date-time"
      },
      "was_collected": {
        "type": "boolean"
      },
      "collection_date": {
        "type": "string",
        "format": "date-time"
      },
      "created_at": {
        "type": "string",
        "format": "date-time",
        "noForm": true,
        "readOnly": true,
        "isTimestamp": true
      },
      "updated_at": {
        "type": "string",
        "format": "date-time",
        "noForm": true,
        "readOnly": true,
        "isTimestamp": true
      }
    },
    "icon": "gauge",
    "table": [
      "delivered_to"
    ],
    "required": [
      "equipments",
      "delivered_to",
      "delivered_by",
      "allocation_date"
    ],
    "filters": [
      "equipments",
      "delivered_to",
      "delivered_by",
      "allocation_date",
      "collection_date"
    ],
    "search": {
      "indexes": [
        "delivered_to"
      ],
      "placeholder": "Insira a pesquisa aqui"
    },
    "individualActions": {
      "viewContent": {
        "label": "Ver Mais",
        "icon": "eye",
        "requires": [
          "_id",
          "delivered_to"
        ]
      },
      "spawnEdit": {
        "label": "action.edit",
        "event": "spawnEdit",
        "icon": "pencil-simple",
        "translate": true
      },
      "viewItem": {
        "label": "action.view",
        "icon": "eye",
        "translate": true,
        "route": {
          "name": "/dashboard/:collection/:id",
          "setItem": true
        }
      },
      "remove": {
        "label": "action.remove",
        "icon": "trash",
        "ask": true,
        "translate": true
      }
    },
    "tableLayout": {
      "actions": {
        "viewContent": {
          "button": true
        }
      }
    },
    "formLayout": {
      "fields": {
        "collection_date": {
          "if": {
            "operator": "equal",
            "term1": "was_collected",
            "term2": true
          }
        }
      }
    },
    "presets": [
      "add",
      "crud"
    ],
    "actions": {
      "spawnAdd": {
        "label": "action.add",
        "event": "spawnAdd",
        "icon": "plus",
        "button": true,
        "translate": true
      }
    }
  },
  "file": {
    "$id": "file",
    "icon": "paperclip",
    "owned": "always",
    "presets": [
      "owned"
    ],
    "indexes": [
      "name",
      "link",
      "type",
      "size"
    ],
    "properties": {
      "type": {
        "type": "string"
      },
      "size": {
        "type": "number"
      },
      "last_modified": {
        "type": "string",
        "format": "date-time"
      },
      "name": {
        "type": "string"
      },
      "absolute_path": {
        "type": "string"
      },
      "relative_path": {
        "type": "string"
      },
      "immutable": {
        "type": "boolean"
      },
      "link": {
        "readOnly": true
      },
      "download_link": {
        "readOnly": true
      },
      "owner": {
        "$ref": "user",
        "noForm": true,
        "indexes": [
          "name"
        ]
      },
      "created_at": {
        "type": "string",
        "format": "date-time",
        "noForm": true,
        "readOnly": true,
        "isTimestamp": true
      },
      "updated_at": {
        "type": "string",
        "format": "date-time",
        "noForm": true,
        "readOnly": true,
        "isTimestamp": true
      }
    },
    "actions": {
      "deleteAll": {
        "label": "Remover",
        "ask": true,
        "selection": true
      }
    },
    "individualActions": {
      "remove": {
        "label": "Remover",
        "icon": "trash",
        "ask": true
      }
    }
  },
  "tempFile": {
    "$id": "tempFile",
    "icon": "file",
    "hidden": true,
    "temporary": {
      "index": "created_at",
      "expireAfterSeconds": 3600
    },
    "properties": {
      "created_at": {
        "type": "string",
        "format": "date-time",
        "noForm": true,
        "readOnly": true,
        "isTimestamp": true
      },
      "absolute_path": {
        "type": "string"
      },
      "size": {
        "type": "number"
      },
      "mime": {
        "type": "number"
      },
      "collection": {
        "type": "string"
      },
      "filename": {
        "type": "string"
      },
      "updated_at": {
        "type": "string",
        "format": "date-time",
        "noForm": true,
        "readOnly": true,
        "isTimestamp": true
      }
    }
  },
  "user": {
    "$id": "user",
    "icon": "users",
    "required": [
      "name",
      "roles",
      "email"
    ],
    "form": [
      "name",
      "active",
      "roles",
      "email",
      "phone_number",
      "picture_file"
    ],
    "indexes": [
      "name"
    ],
    "unique": [
      "email"
    ],
    "properties": {
      "name": {
        "type": "string"
      },
      "given_name": {
        "readOnly": true
      },
      "family_name": {
        "readOnly": true
      },
      "active": {
        "type": "boolean"
      },
      "roles": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": [
            "rh"
          ]
        },
        "uniqueItems": true,
        "minItems": 1
      },
      "email": {
        "type": "string",
        "inputType": "email"
      },
      "password": {
        "type": "string",
        "inputType": "password",
        "hidden": true
      },
      "phone_number": {
        "type": "string",
        "mask": "(##) #####-####"
      },
      "picture_file": {
        "$ref": "file",
        "accept": [
          "image/*"
        ],
        "indexes": [
          "name",
          "link",
          "type",
          "size"
        ]
      },
      "picture": {
        "readOnly": true
      },
      "self_registered": {
        "type": "boolean",
        "readOnly": true
      },
      "updated_at": {
        "type": "string",
        "format": "date-time",
        "noForm": true,
        "readOnly": true,
        "isTimestamp": true
      },
      "created_at": {
        "type": "string",
        "format": "date-time",
        "noForm": true,
        "readOnly": true,
        "isTimestamp": true
      }
    },
    "presets": [
      "crud",
      "duplicate"
    ],
    "layout": {
      "name": "grid",
      "options": {
        "title": "name",
        "badge": "roles",
        "picture": "picture_file",
        "information": "email",
        "active": "active"
      }
    },
    "individualActions": {
      "changePassword": {
        "label": "change_password",
        "icon": "key",
        "translate": true,
        "route": {
          "name": "/dashboard/user/changepass",
          "fetchItem": true
        }
      },
      "copyRedefinePasswordLink": {
        "label": "copy_redefine_password_link",
        "icon": "link",
        "translate": true
      },
      "copyActivationLink": {
        "label": "copy_activation_link",
        "icon": "link",
        "translate": true
      },
      "spawnEdit": {
        "label": "action.edit",
        "event": "spawnEdit",
        "icon": "pencil-simple",
        "translate": true
      },
      "viewItem": {
        "label": "action.view",
        "icon": "eye",
        "translate": true,
        "route": {
          "name": "/dashboard/:collection/:id",
          "setItem": true
        }
      },
      "remove": {
        "label": "action.remove",
        "icon": "trash",
        "ask": true,
        "translate": true
      },
      "duplicate": {
        "label": "action.duplicate",
        "event": "duplicate",
        "icon": "copy",
        "translate": true
      }
    },
    "filters": [
      "name",
      "roles",
      "email",
      "phone_number"
    ],
    "table": [
      "name",
      "roles",
      "picture_file",
      "active",
      "updated_at"
    ],
    "tableMeta": [
      "email"
    ],
    "formLayout": {
      "fields": {
        "given_name": {
          "span": 3
        },
        "family_name": {
          "span": 3
        }
      }
    },
    "actions": {
      "spawnAdd": {
        "label": "action.add",
        "event": "spawnAdd",
        "icon": "plus",
        "button": true,
        "translate": true
      }
    }
  }
}


declare type MirrorRouter = {
  "/asset/get": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/asset/getAll": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/asset/insert": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/asset/remove": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/employee/get": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/employee/getAll": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/employee/insert": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/employee/remove": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/employee/upload": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/equipmentRelease/get": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/equipmentRelease/getAll": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/equipmentRelease/insert": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/equipmentRelease/remove": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/file/get": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/file/insert": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/file/download": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ]
    }
  },
  "/file/remove": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/file/removeAll": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/user/get": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/user/getAll": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/user/remove": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/user/upload": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/user/removeFile": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/user/insert": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "builtin": true
    }
  },
  "/user/editProfile": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ]
    }
  },
  "/user/authenticate": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ]
    }
  },
  "/user/activate": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ]
    }
  },
  "/user/createAccount": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ]
    }
  },
  "/user/getInfo": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ]
    }
  },
  "/user/getCurrentUser": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ],
      "response": {
        "$ref": "user"
      }
    }
  },
  "/user/getActivationLink": {
    "POST": {
      "roles": [
        "root"
      ]
    }
  },
  "/user/getRedefinePasswordLink": {
    "POST": {
      "roles": [
        "root"
      ]
    }
  },
  "/user/redefinePassword": {
    "POST": {
      "roles": [
        "unauthenticated",
        "root"
      ]
    }
  },
  "/equipmentEmployee/getEquipmentsBorrowedByUser": {
    "POST": {
      "payload": {
        "type": "object",
        "properties": {
          "employeeId": {
            "type": "string"
          }
        }
      },
      "response": [
        {
          "type": "object",
          "properties": {
            "_tag": {
              "const": "Error"
            },
            "result": {},
            "error": {
              "type": "object",
              "required": [
                "httpStatus",
                "code"
              ],
              "properties": {
                "httpStatus": {
                  "type": "number"
                },
                "code": {
                  "type": "string"
                },
                "message": {
                  "type": "string"
                },
                "details": {
                  "type": "object",
                  "additionalProperties": true
                }
              }
            }
          }
        },
        {
          "type": "object",
          "properties": {
            "_tag": {
              "const": "Result"
            },
            "error": {},
            "result": {
              "type": "array",
              "items": {
                "type": "object",
                "additionalProperties": true
              }
            }
          }
        }
      ]
    }
  }
}


declare global {
  type Collections = {
    [K in keyof MirrorDescriptions]: {
      item: SchemaWithId<MirrorDescriptions[K]>
    }
  }
}

declare module 'aeria-sdk' {
  import { TopLevelObject } from 'aeria-sdk'

  type UnionToIntersection<T> = (T extends unknown ? ((x: T) => 0) : never) extends ((x: infer R) => 0)
    ? R
    : never

  type InferEndpoint<Route extends keyof MirrorRouter> = {
    [Method in keyof MirrorRouter[Route]]: Method extends RequestMethod
      ? MirrorRouter[Route][Method] extends infer Contract
        ? Contract extends
        | { response: infer RouteResponse }
        | { payload: infer RoutePayload  }
        | { query: infer RoutePayload  }
          ? MakeEndpoint<
            Route,
            Method,
            InferProperties<RouteResponse>,
            RoutePayload extends {}
              ? PackReferences<InferProperty<RoutePayload>>
              : undefined
          >
          : MakeEndpoint<Route, Method>
        : never
      : never
    } extends infer Methods
      ? Methods[keyof Methods]
      : never

  type Endpoints = {
    [Route in keyof MirrorRouter]: Route extends `/${infer Coll}/${infer Fn}`
      ? Coll extends keyof Collections
        ? Fn extends keyof CollectionFunctionsSDK
          ? Record<Coll, Record<
              Fn, {
              POST: CollectionFunctionsSDK<MirrorDescriptions[Coll]>[Fn]
            }
            >>
          : InferEndpoint<Route>
        : InferEndpoint<Route>
      : InferEndpoint<Route>
  } extends infer Endpoints
    ? UnionToIntersection<Endpoints[keyof Endpoints]>
    : never

  type TopLevelAeria = 
    & ((bearerToken?: string) => TopLevelObject & Endpoints)
    & TopLevelObject & Endpoints

  const topLevelAeria: TopLevelAeria

  export const url: string
  export const aeria: TopLevelAeria
  export default topLevelAeria
}

