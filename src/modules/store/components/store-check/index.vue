<template>
	<div class="store-check">
		<div class="store-check__search">
			<el-input v-model="keyword" :placeholder="$t('输入关键字进行过滤')" />
		</div>

		<div class="store-check__tree">
			<el-scrollbar max-height="200px">
				<el-tree
					ref="Tree"
					node-key="id"
					show-checkbox
					:data="list"
					:props="{
						label: 'name',
						children: 'children'
					}"
					:filter-node-method="filterNode"
					:check-strictly="checkStrictly"
					@check="onCheckChange"
				>
					<template #default="{ data }">
						<span class="store-check__node">
							<el-tag :type="getStoreTypeTag(data.type)" size="small">
								{{ getStoreTypeLabel(data.type) }}
							</el-tag>
							<span style="margin-left: 8px">{{ data.name }}</span>
						</span>
					</template>
				</el-tree>
			</el-scrollbar>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'cl-store-check'
});

import { ref, watch, computed } from 'vue';
import { deepTree } from '/@/cool/utils';
import { useCool } from '/@/cool';
import { useUpsert } from '@cool-vue/crud';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
	modelValue: {
		type: Array,
		default: () => []
	},
	checkStrictly: Boolean
});

const emit = defineEmits(['update:modelValue']);

const { service } = useCool();

const Tree = ref();
const list = ref();
const keyword = ref('');

const storeTypes = computed(() => [
	{ label: t('总部'), value: 0 },
	{ label: t('区域'), value: 1 },
	{ label: t('门店'), value: 2 },
	{ label: t('加盟商'), value: 3 }
]);

function getStoreTypeLabel(type?: number) {
	return storeTypes.value.find(e => e.value === type)?.label || '';
}

function getStoreTypeTag(type?: number): 'danger' | 'warning' | 'success' | 'info' | undefined {
	const typeMap: Record<number, 'danger' | 'warning' | 'success' | 'info'> = {
		0: 'danger',
		1: 'warning',
		2: 'success',
		3: 'info'
	};
	return typeMap[type ?? 2];
}

async function refresh() {
	return service.base.sys.department.list().then(res => {
		list.value = deepTree(res);
	});
}

function filterNode(val: string, data: any) {
	if (!val) return true;
	return data.name.includes(val);
}

function onCheckChange(_: any, { checkedKeys }: any) {
	emit('update:modelValue', checkedKeys);
}

watch(keyword, (val: string) => {
	Tree.value?.filter(val);
});

useUpsert({
	async onOpened() {
		await refresh();
		Tree.value?.setCheckedKeys(props.modelValue || []);
	}
});
</script>

<style lang="scss" scoped>
.store-check {
	&__search {
		display: flex;
		align-items: center;

		.el-input {
			flex: 1;
		}
	}

	&__tree {
		border: 1px solid var(--el-border-color);
		margin-top: 5px;
		border-radius: 4px;
		box-sizing: border-box;
		padding: 5px 0;
	}

	&__node {
		display: flex;
		align-items: center;
	}
}
</style>
