const features: any = {
    'cpt': {
        'feature': {
            'type': 'cpt',
            'singular': 'Custom Post Type',
            'plural': 'Custom Post Types',
            'isPluginHook': false
        },
        'route': {
            'method': 'POST',
            'url': 'https://pluginmachine.app/api/v1/code/cpt'
        }
    },
    'adminPage': {
        'feature': {
            'type': 'adminPage',
            'singular': 'Admin Menu Page',
            'plural': 'Admin Menu Pages',
            'isPluginHook': false
        },
        'route': {
            'method': 'POST',
            'url': 'https://pluginmachine.app/api/v1/code/adminPage'
        }
    },
    'block': {
        'feature': {
            'type': 'block',
            'singular': 'Blocks',
            'plural': 'Blocks',
            'isPluginHook': false
        },
        'route': {
            'method': 'POST',
            'url': 'https://pluginmachine.app/api/v1/code/block'
        }
    },
    'blockPlugin': {
        'feature': {
            'type': 'blockPlugin',
            'singular': 'Block Plugin',
            'plural': 'Block Plugins',
            'isPluginHook': false
        },
        'route': {
            'method': 'POST',
            'url': 'https://pluginmachine.app/api/v1/code/blockPlugin'
        }
    },
    'hook': {
        'feature': {
            'type': 'hook',
            'singular': 'Action or Filter',
            'plural': 'Actions and Filters',
            'isPluginHook': false
        },
        'route': {
            'method': 'POST',
            'url': 'https://pluginmachine.app/api/v1/code/hook'
        }
    },
    'meta_field': {
        'feature': {
            'type': 'meta_field',
            'singular': 'Register Meta Field',
            'plural': 'Register Meta Fields',
            'isPluginHook': false
        },
        'route': {
            'method': 'POST',
            'url': 'https://pluginmachine.app/api/v1/code/meta_field'
        }
    },
    'gravityview': {
        'feature': {
            'type': 'gravityview',
            'singular': 'GravityView',
            'plural': 'GravityView',
            'isPluginHook': true
        },
        'route': {
            'method': 'POST',
            'url': 'https://pluginmachine.app/api/v1/code/gravityview'
        }
    },
    'woocommerceHook': {
        'feature': {
            'type': 'woocommerceHook',
            'singular': 'WooCommerce',
            'plural': 'WooCommerce',
            'isPluginHook': true
        },
        'route': {
            'method': 'POST',
            'url': 'https://pluginmachine.app/api/v1/code/woocommerceHook'
        }
    },
    'generic_core_filter': {
        'feature': {
            'type': 'generic_core_filter',
            'singular': 'Add Filter',
            'plural': 'Add Filters',
            'isPluginHook': false
        },
        'route': {
            'method': 'POST',
            'url': 'https://pluginmachine.app/api/v1/code/generic_core_filter'
        }
    },
    'generic_core_action': {
        'feature': {
            'type': 'generic_core_action',
            'singular': 'Add Action',
            'plural': 'Add Actions',
            'isPluginHook': false
        },
        'route': {
            'method': 'POST',
            'url': 'https://pluginmachine.app/api/v1/code/generic_core_action'
        }
    },
    'composer': {
        'feature': {
            'type': 'composer',
            'singular': 'Composer',
            'plural': 'Composer and PHP Tests',
            'isPluginHook': false
        },
        'route': {
            'method': 'POST',
            'url': 'https://pluginmachine.app/api/v1/code/composer'
        }
    },
    'local_dev': {
        'feature': {
            'type': 'local_dev',
            'singular': 'Local Development',
            'plural': 'Local Developments',
            'isPluginHook': false
        },
        'route': {
            'method': 'POST',
            'url': 'https://pluginmachine.app/api/v1/code/local_dev'
        }
    },
    'updater': {
        'feature': {
            'type': 'updater',
            'singular': 'Remote Updater',
            'plural': 'Remote Updater',
            'isPluginHook': false
        },
        'route': {
            'method': 'POST',
            'url': 'https://pluginmachine.app/api/v1/code/updater'
        }
    },
    'php_test': {
        'feature': {
            'type': 'php_test',
            'singular': 'PHP Tests',
            'plural': 'PHP Tests',
            'isPluginHook': false
        },
        'route': {
            'method': 'POST',
            'url': 'https://pluginmachine.app/api/v1/code/php_test'
        }
    }
}
export default features;
