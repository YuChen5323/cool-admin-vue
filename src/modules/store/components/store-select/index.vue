<template>
	<div class="store-select">
		<el-tree-select
			v-model="value"
			:data="list"
			:props="{
				label: 'name',
				value: 'id',
				children: 'children'
			}"
			:placeholder="placeholder || t('选择门店')"
			check-strictly
			clearable
			filterable
			:disabled="disabled"
			@change="onChange"
		/>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'cl-store-select'
});

import { ref, onMounted, computed } from 'vue';
import { useCool } from '/@/cool';
import { deepTree } from '/@/cool/utils';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	modelValue: {
		type: [Number, String],
		default: null
	},
	placeholder: String,
	disabled: Boolean
});

const emit = defineEmits(['update:modelValue', 'change']);

const { service } = useCool();
const { t } = useI18n();

const list = ref<any[]>([]);

const value = computed({
	get() {
		return props.modelValue;
	},
	set(val) {
		emit('update:modelValue', val);
	}
});

async function refresh() {
	await service.base.sys.department.list().then(res => {
		list.value = deepTree(res);
	});
}

function onChange(val: any) {
	emit('change', val);
}

onMounted(() => {
	refresh();
});
</script>

<style lang="scss" scoped>
.store-select {
	width: 100%;
}
</style>
