/**
 * The MIT License
 * Copyright (c) 2019 Ivan Klimchuk. https://klimchuk.com
 * Full license text placed in the LICENSE file in the repository or in the license.txt file in the package.
 */

msDeliveryProps.grid.DeliveryProperties = function(config) {
    config = config || {};

    Ext.applyIf(config, {
        url: msDeliveryProps.ownConnector,
        baseParams: {
            action: 'mgr/properties/getlist',
            delivery: config.delivery
        },
        autoHeight: true,
        paging: true,
        remoteSort: false,
        stripeRows: true,
        pageSize: 5,
        tbar: this.getTopBar(),
        fields: ['key', 'value'],
        columns: [{
            header: _('property'),
            dataIndex: 'key',
            width: 55,
            editable: false,
            sortable: false,
            renderer: this.propertyKeyRenderer.createDelegate(this, [this], true),
        }, {
            header: _('value'),
            dataIndex: 'value',
            sortable: false,
            editable: true,
            width: 45
        }]
    });

    msDeliveryProps.grid.DeliveryProperties.superclass.constructor.call(this, config);
};

Ext.extend(msDeliveryProps.grid.DeliveryProperties, MODx.grid.Grid, {

    getTopBar: function getTopBar() {
        return [{
            cls: 'primary-button',
            text: '<i class="icon icon-large icon-wrench"></i>&nbsp;&nbsp;&nbsp;' + _('property_create'),
            handler: this.addProperty,
            scope: this
        }, '->', {
            text: '<i class="icon icon-large icon-remove"></i>&nbsp;&nbsp;&nbsp;' + _('ms2_menu_clear_all'),
            handler: this.clearAll,
            scope: this
        }];
    },

    propertyKeyRenderer: function propertyKeyRenderer(value, metaData, record) {
        var tpl = '{key}';

        record.data.human = _('setting_' + value);
        if (record.data.human) {
            tpl = '<div>' +
                '<span>{human}</span>' +
                '<br><small><b>{key}</b></small>' +
            '</div>';
        }

        return new Ext.XTemplate(tpl).applyTemplate(record.data);
    },

    addProperty: function addProperty() {
        MODx.load({
            xtype: 'mspp-window-delivery-property',
            new: true,
            grid: this,
            delivery: this.config.delivery,
            suffix: this.config.suffix,
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                }
            }
        }).show();
    },

    deleteProperty: function deleteProperty() {
        MODx.msg.confirm({
            title: _('mspp_remove_property'),
            text: _('mspp_remove_property_confirmation'),
            url: msDeliveryProps.ownConnector,
            params: {
                action: 'mgr/properties/delete',
                delivery: this.config.delivery,
                key: this.menu.record.key
            },
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                },
                failure: {
                    fn: function (response) {
                        MODx.msg.alert(response.message);
                    }, scope: this
                }
            }
        });
    },

    editProperty: function editProperty(btn, e) {
        var window = MODx.load({
            xtype: 'mspp-window-delivery-property',
            grid: this,
            delivery: this.config.delivery,
            suffix: this.config.suffix,
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                }
            }
        });

        window.reset();
        window.setValues(this.menu.record);
        window.show(e.target);
    },

    getMenu: function getMenu() {
        this.addContextMenuItem([{
            text: String.format('<span><i class="x-menu-item-icon icon {0}"></i>{1}</span>',
                'icon-edit', _('edit')),
            handler: this.editProperty
        },'-',{
            text: String.format('<span><i class="x-menu-item-icon icon {0}"></i>{1}</span>',
                'icon-trash-o', _('delete')),
            handler: this.deleteProperty
        }]);
    },

    clearAll: function clearAll() {
        MODx.msg.confirm({
            title: _('mspp_remove_all'),
            text: _('mspp_remove_all_confirmation'),
            url: msDeliveryProps.ownConnector,
            params: {
                action: 'mgr/properties/delete',
                delivery: this.config.delivery,
                key: 'all'
            },
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                },
                failure: {
                    fn: function (response) {
                        MODx.msg.alert(response.message);
                    }, scope: this
                }
            }
        });
    }

});
Ext.reg('mspp-grid-delivery-properties', msDeliveryProps.grid.DeliveryProperties);
