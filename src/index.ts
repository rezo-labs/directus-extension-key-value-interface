import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';
import { FIELD_TYPES_SELECT } from './constants';

export default defineInterface({
	id: 'key-value',
	name: 'Key-value',
	icon: 'data_object',
	description: 'Edit JSON value in a key-value format',
	component: InterfaceComponent,
	types: ['json'],
	group: 'other',
	options: [
		{
			field: 'schema',
			type: 'json',
			name: 'Schema',
			meta: {
				width: 'full',
				interface: 'list',
				options: {
					template: '{{ key }} - {{ type }}',
					fields: [
						{
							name: 'Key',
							field: 'key',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'half',
							},
						},
						{
							name: '$t:type',
							field: 'type',
							type: 'string',
							meta: {
								interface: 'select-dropdown',
								width: 'half',
								options: {
									choices: FIELD_TYPES_SELECT,
								},
							},
							schema: {
								default_value: 'string',
							},
						},
						{
							name: '$t:interface_label',
							field: 'interface',
							type: 'string',
							meta: {
								interface: 'system-interface',
								width: 'half',
								options: {
									typeField: 'type',
								},
							},
							schema: null,
						},
						{
							name: '$t:note',
							field: 'note',
							type: 'string',
							meta: {
								interface: 'system-input-translated-string',
								width: 'full',
								options: {
									placeholder: '$t:interfaces.list.field_note_placeholder',
								},
							},
							schema: null,
						},
						{
							name: '$t:options',
							field: 'options',
							type: 'string',
							meta: {
								interface: 'system-interface-options',
								width: 'full',
								options: {
									interfaceField: 'interface',
								},
							},
						},
					],
				},
			},
		},
		{
			field: 'allowOther',
			name: 'Allow Other',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
				options: {
					label: 'Allow Other Keys',
				},
			},
			schema: {
				default_value: false,
			},
		},
		{
			field: 'asList',
			name: 'As List',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
				options: {
					label: 'Render as List',
				},
			},
			schema: {
				default_value: false,
			},
		}
	],
});
