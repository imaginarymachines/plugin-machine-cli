const rules :any = {
    'cpt': {
        'cptName': {
            'rules': [
                'string',
                'required',
                'slug'
            ],
            'label': 'Post Type Slug',
            'options': null
        },
        'cptNAME_SINGLULAR': {
            'rules': [
                'string'
            ],
            'label': 'Label: Singular Name',
            'options': null
        },
        'cptNAME_MENU': {
            'rules': [
                'string'
            ],
            'label': 'Label: Menu Name',
            'options': null
        },
        'cptNAME_ADMIN_BAR': {
            'rules': [
                'string'
            ],
            'label': 'Label: Admin Bar Name',
            'options': null
        },
        'cptADD_NEW': {
            'rules': [
                'string'
            ],
            'label': 'Label: Add New',
            'options': null
        },
        'cptADD_NEW_ITEM': {
            'rules': [
                'string'
            ],
            'label': 'Label: Add New Item',
            'options': null
        },
        'cptNEW_ITEM': {
            'rules': [
                'string'
            ],
            'label': 'Label: New Item',
            'options': null
        },
        'cptEDIT_ITEM': {
            'rules': [
                'string'
            ],
            'label': 'Label: Edit Item',
            'options': null
        },
        'cptView_item': {
            'rules': [
                'string'
            ],
            'label': 'Label: View Item',
            'options': null
        },
        'cptAll_items': {
            'rules': [
                'string'
            ],
            'label': 'Label: All Items',
            'options': null
        },
        'cptSearch_items': {
            'rules': [
                'string'
            ],
            'label': 'Label: Search Items',
            'options': null
        },
        'cptNot_found': {
            'rules': [
                'string'
            ],
            'label': 'Label: Item Not Found',
            'options': null
        },
        'cptNOT_FOUND_IN_TRASH': {
            'rules': [
                'string'
            ],
            'label': 'Label: Not Found In Trash',
            'options': null
        },
        'cptFeatured_image': {
            'rules': [
                'string'
            ],
            'label': 'Label: Featured Image',
            'options': null
        },
        'cptSet_featured_image': {
            'rules': [
                'string'
            ],
            'label': 'Label: Set Featured Image',
            'options': null
        },
        'cptRemove_featured_image': {
            'rules': [
                'string'
            ],
            'label': 'Label: Remove Featured Image',
            'options': null
        },
        'cptFEATURE_IMAGE': {
            'rules': [
                'string'
            ],
            'label': 'Label: Featured Image',
            'options': null
        },
        'cptUSE_FEATURE_IMAGE': {
            'rules': [
                'string'
            ],
            'label': 'Label: Use Featured Image',
            'options': null
        },
        'cptSET_FEATURE_IMAGE': {
            'rules': [
                'string'
            ],
            'label': 'Label: Set Featured Image',
            'options': null
        },
        'cptREMOVE_FEATURE_IMAGE': {
            'rules': [
                'string'
            ],
            'label': 'Label: Remove Featured Image',
            'options': null
        },
        'cptARCHIVES': {
            'rules': [
                'string'
            ],
            'label': 'Label: Archives',
            'options': null
        },
        'cptINSERT_INTO_ITEM': {
            'rules': [
                'string'
            ],
            'label': 'Label: Insert In To Item',
            'options': null
        },
        'cptUPLOAD_TO_THIS_ITEM': {
            'rules': [
                'string'
            ],
            'label': 'Label: Upload To Item',
            'options': null
        },
        'cptFILTER_ITEM_LIST': {
            'rules': [
                'string'
            ],
            'label': 'Label: Filtet Item List',
            'options': null
        },
        'cptITEM_LIST_NAVIGATION': {
            'rules': [
                'string'
            ],
            'label': 'Label: Items List Navigation',
            'options': null
        },
        'cptITEMS_LIST': {
            'rules': [
                'string'
            ],
            'label': 'Label: Items List',
            'options': null
        },
        'cptPUBLIC': {
            'rules': [
                'boolean'
            ],
            'label': 'cptCptPUBLIC',
            'options': null
        },
        'cptPUBLIC_QUERYABLE': {
            'rules': [
                'boolean'
            ],
            'label': 'cptCptPUBLIC_QUERYABLE',
            'options': null
        },
        'cptShow_ui': {
            'rules': [
                'boolean'
            ],
            'label': 'cptCptShow_ui',
            'options': null
        },
        'cptShow_in_menu': {
            'rules': [
                'boolean'
            ],
            'label': 'cptCptShow_in_menu',
            'options': null
        },
        'cptQuery_var': {
            'rules': [
                'boolean'
            ],
            'label': 'cptCptQuery_var',
            'options': null
        },
        'cptRewrite': {
            'rules': [
                'boolean'
            ],
            'label': 'cptCptRewrite',
            'options': null
        },
        'cptCAPABILITY_TYPE': {
            'rules': [
                'string'
            ],
            'label': 'cptCptCAPABILITY_TYPE',
            'options': null
        },
        'cptHas_archive': {
            'rules': [
                'boolean'
            ],
            'label': 'cptCptHas_archive',
            'options': null
        },
        'cptHIERARCHICAL': {
            'rules': [
                'boolean'
            ],
            'label': 'Hierarchical',
            'options': null
        },
        'cptSHOW_IN_REST': {
            'rules': [
                'boolean'
            ],
            'label': 'cptCptSHOW_IN_REST',
            'options': null
        },
        'cptMenu_position': {
            'rules': [
                'number'
            ],
            'label': 'cptCptMenu_position',
            'options': null
        },
        'cptSUPPORTS': {
            'rules': [
                'array',
                []
            ],
            'label': 'cptCptSUPPORTS',
            'options': [
                'title',
                'editor',
                'author',
                'thumbnail',
                'excerpt',
                'trackbacks',
                'comments',
                'custom-fields'
            ]
        }
    },
    'adminPage': {
        'adminPageName': {
            'rules': [
                'string',
                'required',
                'slug'
            ],
            'label': 'Menu slug',
            'options': null
        },
        'adminPageTitle': {
            'rules': [
                'string',
                'required'
            ],
            'label': 'Menu title',
            'options': null
        },
        'adminPageType': {
            'rules': [
                'string',
                'required'
            ],
            'label': 'What kind of page?',
            'options': {
                'React': 'REACT',
                'PHP + jQuery': 'PHP'
            }
        }
    },
    'block': {
        'blockName': {
            'rules': [
                'string',
                'required',
                'slug'
            ],
            'label': 'Block Slug',
            'options': null
        },
        'blockTitle': {
            'rules': [
                'string',
                'required'
            ],
            'label': 'Block Title',
            'options': null
        },
        'blockCategory': {
            'rules': [
                'string',
                'required'
            ],
            'label': 'Block Category',
            'options': {
                'Text': 'text',
                'Media': 'media',
                'Design': 'design',
                'Embed': 'embed',
                'Widgets': 'widgets',
                'Theme': 'theme',
                'Common': 'common'
            }
        },
        'blockRenderCallbackType': {
            'rules': [
                'string',
                'required'
            ],
            'label': 'Render With',
            'options': {
                'PHP': 'php',
                'JSX': 'jsx'
            }
        },
        'blockBLOCK_DESCRIPTION': {
            'rules': [
                'string'
            ],
            'label': 'Block Description',
            'options': null
        }
    },
    'blockPlugin': {
        'blockPluginBLOCK_PLUGIN_NAME': {
            'rules': [
                'string',
                'required',
                'slug'
            ],
            'label': 'Block Plugin Slug',
            'options': null
        },
        'blockPluginBLOCK_PLUGIN_TITLE': {
            'rules': [
                'string',
                'required'
            ],
            'label': 'Block Plugin Title',
            'options': null
        },
        'blockPluginType': {
            'rules': [
                'string',
                'required'
            ],
            'label': 'Block Plugin Panel Location',
            'options': {
                'Sidebar': 'sidebar'
            }
        },
        'blockPluginBLOCK_PLUGIN_NAME_META_KEY': {
            'rules': [
                'string',
                'required',
                'slug'
            ],
            'label': 'Meta Key',
            'options': null
        },
        'blockPluginBLOCK_PLUGIN_SETTING_LABEL': {
            'rules': [
                'string',
                'required'
            ],
            'label': 'Setting Label',
            'options': null
        }
    },
    'hook': {
        'hookType': {
            'rules': [
                'string',
                'required'
            ],
            'label': 'Action or Filter',
            'options': {
                'filter': 'Filter',
                'action': 'Action'
            }
        }
    },
    'meta_field': {
        'metaFieldMeta_key': {
            'rules': [
                'string',
                'required',
                'max:255'
            ],
            'label': 'Meta Key',
            'options': null
        },
        'metaFieldObject_type': {
            'rules': [
                'string',
                'required'
            ],
            'label': 'Object Type',
            'options': null
        },
        'metaFieldType': {
            'rules': [],
            'label': 'Type',
            'options': {
                'String': 'string',
                'Boolean': 'boolean',
                'Integer': 'integer',
                'Number': 'number',
                'Array': 'array',
                'Object': 'object'
            }
        },
        'metaFieldShow_in_rest': {
            'rules': [
                'booolean'
            ],
            'label': 'Show in REST API',
            'options': null
        },
        'metaFieldSingle': {
            'rules': [
                'booolean'
            ],
            'label': 'Single',
            'options': null
        }
    },
    'gravityview': {
        'gravityviewHook': {
            'rules': [
                'string',
                'required'
            ],
            'label': 'Hook',
            'options': {
                'DataTable JS Options': 'gravityview_datatables_js_options',
                'Edit calendar options': 'gravityview/calendar/options',
                'Force exact search match': 'gravityview_search_operator',
                'Limit Entry Revisions option': 'gravityview/entry-revisions/add-revision',
                'Custom Delete Entry Message': 'gravityview/delete-entry/confirm-text',
                'Increase import timeout': 'gravityview/import/processor/args'
            }
        }
    },
    'woocommerceHook': {
        'woocommerceHookHook': {
            'rules': [
                'string',
                'required'
            ],
            'label': 'Hook',
            'options': {
                'Change checkout field labels.': 'woocommerce_checkout_fields',
                'Ovveride coupon valid or not': 'coupon_is_valid_for_product'
            }
        }
    },
    'generic_core_filter': {
        'genericCoreFilterHook': {
            'rules': [
                'string'
            ],
            'label': 'Which hook?',
            'options': null
        },
        'genericCoreFilterCallbackType': {
            'rules': [
                'string'
            ],
            'label': 'Callback type',
            'options': {
                'annonymous function': 'annonymous',
                'callback function': 'callback'
            }
        },
        'genericCoreFilterCallback': {
            'rules': [
                'string'
            ],
            'label': 'Name of callback function',
            'options': null
        }
    },
    'generic_core_action': {
        'genericCoreActionHook': {
            'rules': [
                'string'
            ],
            'label': 'Which hook?',
            'options': null
        },
        'genericCoreActionCallbackType': {
            'rules': [
                'string'
            ],
            'label': 'Callback type',
            'options': {
                'annonymous function': 'annonymous',
                'callback function': 'callback'
            }
        },
        'genericCoreActionCallback': {
            'rules': [
                'string'
            ],
            'label': 'Name of callback function',
            'options': null
        }
    },
    'composer': {
        'composerPhpNamespace': {
            'rules': [
                'required',
                'string'
            ],
            'label': 'PHP Namespace',
            'options': null
        },
        'composerDescription': {
            'rules': [
                'required',
                'string'
            ],
            'label': 'Description of plugin',
            'options': null
        },
        'composerAutoload': {
            'rules': [
                'boolean'
            ],
            'label': 'PHP Autoloader',
            'options': null
        },
        'composerUnit_tests': {
            'rules': [
                'boolean'
            ],
            'label': 'Unit Tests',
            'options': null
        },
        'composerWordpress_tests': {
            'rules': [
                'boolean'
            ],
            'label': 'WordPress Integration Tests',
            'options': null
        },
        'composerLint': {
            'rules': [
                'boolean'
            ],
            'label': 'Linter',
            'options': null
        }
    },
    'local_dev': {
        'localDevWithWpcli': {
            'rules': [
                'boolean'
            ],
            'label': 'Add container for wpcli',
            'options': null
        },
        'localDevWithTestContainer': {
            'rules': [
                'boolean'
            ],
            'label': 'Add container for WordPress integration tests',
            'options': null
        }
    },
    'updater': [],
    'php_test': {
        'phpTestClassName': {
            'rules': [
                'string',
                'required',
                'max:255'
            ],
            'label': 'Test Class Name',
            'options': null
        },
        'phpTestTestType': {
            'rules': [],
            'label': 'Test Type',
            'options': {
                'Unit': 'unit',
                'Integration': 'integration',
                'Integer': 'integer',
                'Number': 'number',
                'Array': 'array',
                'Object': 'object'
            }
        }
    }
}
export default rules;
