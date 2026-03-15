<template>
	<div class="store-org-select">
		<el-tree-select
			v-model="selectedValue"
			:loading="loading"
			:data="treeData"
			:props="{
				label: 'name',
				children: 'children',
				value: 'id'
			}"
			:placeholder="$t('请选择组织')"
			:filterable="true"
			:check-strictly="checkStrictly"
			:disabled="disabled"
			:clearable="clearable"
			@change="onChange"
		/>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, type PropType } from 'vue';
import { deepTree } from '/@/cool/utils';
import { storeOrgService } from '../../service';
import type { StoreOrgEntity } from '../../types';

const props = defineProps({
	modelValue: {
		type: [Number, Array] as PropType<number | number[]>,
		default: undefined
	},
	checkStrictly: {
		type: Boolean,
		default: false
	},
	disabled: {
		type: Boolean,
		default: false
	},
	clearable: {
		type: Boolean,
		default: true
	},
	// 限制组织类型
	orgType: {
		type: String as PropType<StoreOrgEntity['type']>,
		default: undefined
	}
});

const emit = defineEmits(['update:modelValue', 'change']);

const loading = ref(false);
const treeData = ref<StoreOrgEntity[]>([]);
const selectedValue = ref(props.modelValue);

// 加载组织数据
async function loadData() {
	loading.value = true;
	try {
		const res = await storeOrgService.list();
		let data = deepTree(res);

		// 如果限制了组织类型，过滤数据
		if (props.orgType) {
			data = filterByOrgType(data, props.orgType);
		}

		treeData.value = data;
	} finally {
		loading.value = false;
	}
}

// 根据组织类型过滤
function filterByOrgType(data: StoreOrgEntity[], type: string): StoreOrgEntity[] {
	return data
		.map((item) => {
			const newItem = { ...item };
			if (item.children) {
				newItem.children = filterByOrgType(item.children, type);
			}
			return newItem;
		})
		.filter((item) => item.type === type || (item.children && item.children.length > 0));
}

// 值改变
function onChange(val: any) {
	emit('update:modelValue', val);
	emit('change', val);
}

// 监听值变化
watch(
	() => props.modelValue,
	(val) => {
		selectedValue.value = val;
	}
);

onMounted(() => {
	loadData();
});

defineExpose({
	refresh: loadData
});
</script>

<style lang="scss" scoped>
.store-org-select {
	width: 100%;
}
</style>
