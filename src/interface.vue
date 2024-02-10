<template>
	<div>
		<div v-for="field in schema" :key="field.key" class="key-value-item">
			<div class="key-value-item--key">{{ keyToLabel(field.key) }}</div>
			<div class="key-value-item--value">
				<component
					:is="field.interface ? `interface-${field.interface}` : 'interface-input'"
					v-bind="field.options || {}"
					:value="value?.[field.key]"
					:type="field.type"
					@input="updateValue(field.key, $event)"
				/>
			</div>
			<div v-if="allowOther" class="key-value-item--space"></div>
		</div>
		<template v-if="allowOther || asList">
			<div v-for="field in otherFields" class="key-value-item">
				<v-input v-if="!asList" class="key-value-item--key" v-model="field.key" />
				<div class="key-value-item--value">
					<template v-if="field.type === 'unknown'">
						<v-select v-model="field.type" :items="Object.keys(typeToInterface)" />
					</template>
					<component
						v-else
						:is="`interface-${typeToInterface[field.type]}`"
						v-bind="typeToOptions[field.type]"
						:value="field.value"
						:type="field.type"
						@input="field.value = $event"
					/>
				</div>
				<v-button rounded icon secondary @click="deleteField(field.key)">
					<v-icon name="delete" outline />
				</v-button>
			</div>
			<v-button @click="addNewField">{{ t('add_new') }}</v-button>
		</template>
	</div>
</template>

<script lang="ts">
import { PropType, defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

type Type = 'string' | 'integer' | 'float' | 'boolean' | 'list' | 'json' | 'unknown';

interface SchemaField {
	key: string;
	type: Type;
	interface: string;
	note: string;
	options: string;
}

export default defineComponent({
	props: {
		value: {
			type: null as unknown as PropType<Object | Array<any> | null>,
			default: null,
		},
		schema: {
			type: null as unknown as PropType<Array<SchemaField> | null>,
			default: null,
		},
		allowOther: {
			type: Boolean,
			default: false,
		},
		asList: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['input'],
	setup(props, { emit }) {
		const { t } = useI18n();

		const typeToInterface: Record<Type, string> = {
			string: 'input',
			integer: 'input',
			float: 'input',
			boolean: 'boolean',
			list: 'key-value',
			json: 'key-value',
			unknown: 'input',
		};
		const typeToOptions: Record<Type, Record<string, any>> = {
			string: {},
			integer: {},
			float: {},
			boolean: {},
			list: {
				asList: true,
			},
			json: {
				allowOther: true,
			},
			unknown: {},
		};

		const otherFields = ref<
			{
				key: string | number;
				value: any;
				type: Type;
			}[]
		>(
			Object.keys(props.value || {})
				.filter((key) => !props.schema?.find((field) => field.key === key))
				.map((key) => {
					const value = props.value?.[key];
					return {
						key,
						value,
						type: inferTypeFromValue(value),
					};
				})
		);

		watch(
			otherFields,
			() => {
				if (!props.asList) {
					const schemaKvs = props.schema?.reduce((acc, field) => {
						acc[field.key] = props.value?.[field.key];
						return acc;
					}, {});
					const otherKvs = otherFields.value.reduce((acc, field) => {
						acc[field.key] = field.value;
						return acc;
					}, {});
					emit('input', {
						...schemaKvs,
						...otherKvs,
					});
				} else {
					emit('input', otherFields.value.map((field) => field.value));
				}
			},
			{ deep: true }
		);

		return {
			t,
			typeToInterface,
			typeToOptions,
			otherFields,
			keyToLabel,
			updateValue,
			addNewField,
			deleteField,
		};

		function keyToLabel(str: string) {
			return str.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ');
		}

		function updateValue(key: string | null, value: any) {
			if (!key) return;

			const newValue = {
				...props.value,
			};
			newValue[key] = value;

			emit('input', newValue);
		}

		function addNewField() {
			otherFields.value.push({
				key: props.asList ? otherFields.value.length : '',
				value: null,
				type: 'unknown',
			});
		}

		function deleteField(key: string) {
			if (props.asList) {
				otherFields.value = otherFields.value
					.filter((field) => field.key !== key)
					.map((field, index) => ({
						...field,
						key: index,
					}));
			} else {
				otherFields.value = otherFields.value.filter((field) => field.key !== key);
			}
		}

		function inferTypeFromValue(value: any): Type {
			if (typeof value === 'string') {
				return 'string';
			}

			if (typeof value === 'number') {
				if (Number.isInteger(value)) {
					return 'integer';
				}
				return 'float';
			}

			if (typeof value === 'boolean') {
				return 'boolean';
			}

			if (Array.isArray(value)) {
				return 'list';
			}

			if (typeof value === 'object' && value !== null) {
				return 'json';
			}

			return 'unknown';
		}
	},
});
</script>

<style scoped>
.key-value-item {
	display: flex;
	align-items: center;
	gap: 20px;
	margin-bottom: 20px;
}

.key-value-item--key {
	text-transform: capitalize;
	flex: 0 0 150px;
}

.key-value-item--value {
	flex: 1 0 0;
}

.key-value-item--space {
	flex: 0 0 44px;
}
</style>
