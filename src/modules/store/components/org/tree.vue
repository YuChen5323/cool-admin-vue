<template>
	<div class="store-org-tree">
		<div class="store-org-tree__header">
			<el-input v-model="keyword" :placeholder="$t('输入关键字进行过滤')" clearable>
				<template #prefix>
					<cl-svg name="icon-search" :size="14" />
				</template>
			</el-input>
		</div>

		<div class="store-org-tree__content">
			<el-scrollbar>
				<el-tree
					ref="TreeRef"
					node-key="id"
					:data="treeData"
					:props="{
						label: 'name',
						children: 'children'
					}"
					:filter-node-method="filterNode"
					:expand-on-click-node="false"
					:default-expanded-keys="expandedKeys"
					@node-click="onNodeClick"
				>
					<template #default="{ node, data }">
						<div
							class="store-org-tree__node"
							:class="{ active: selectedId === data.id }"
						>
							<cl-svg
								:name="getOrgIcon(data.type)"
								:size="16"
								:style="{ color: getOrgTypeColor(data.type) }"
							/>
							<span class="store-org-tree__node-label">{{ node.label }}</span>
							<el-tag
								:size="'small'"
								:style="{
									backgroundColor: getOrgTypeColor(data.type) + '20',
									color: getOrgTypeColor(data.type),
									borderColor: getOrgTypeColor(data.type)
								}"
							>
								{{ getOrgTypeLabel(data.type) }}
							</el-tag>
						</div>
					</template>
				</el-tree>
			</el-scrollbar>
		</div>

		<div class="store-org-tree__footer">
			<el-button type="primary" :icon="Plus" @click="onAddRoot">
				{{ $t('新增总部') }}
			</el-button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { deepTree } from '/@/cool/utils';
import { storeOrgService } from '../../service';
import { getOrgTypeLabel, getOrgTypeColor } from '../../utils';
import type { StoreOrgEntity, StoreOrgType } from '../../types';

const props = defineProps({
	modelValue: {
		type: Number,
		default: undefined
	}
});

const emit = defineEmits(['update:modelValue', 'select', 'add-root']);

const TreeRef = ref();
const treeData = ref<StoreOrgEntity[]>([]);
const keyword = ref('');
const selectedId = ref<number>();
const expandedKeys = ref<number[]>([]);

// 获取组织图标
function getOrgIcon(type: StoreOrgType): string {
	const iconMap: Record<StoreOrgType, string> = {
		headquarters: 'icon-home',
		region: 'icon-map',
		store: 'icon-shop',
		franchisee: 'icon-team'
	};
	return iconMap[type] || 'icon-folder';
}

// 过滤节点
function filterNode(value: string, data: any) {
	if (!value) return true;
	return data.name.includes(value);
}

// 节点点击
function onNodeClick(data: StoreOrgEntity) {
	selectedId.value = data.id;
	emit('update:modelValue', data.id);
	emit('select', data);
}

// 新增根节点
function onAddRoot() {
	emit('add-root');
}

// 刷新树
async function refresh() {
	const res = await storeOrgService.list();
	treeData.value = deepTree(res);

	// 默认展开第一级
	if (treeData.value.length > 0) {
		expandedKeys.value = treeData.value.map(e => e.id);
	}

	// 如果有选中值，保持选中
	if (selectedId.value) {
		nextTick(() => {
			TreeRef.value?.setCurrentKey(selectedId.value);
		});
	}
}

// 设置选中
function setCurrentKey(id: number) {
	selectedId.value = id;
	nextTick(() => {
		TreeRef.value?.setCurrentKey(id);
	});
}

// 监听过滤
watch(keyword, val => {
	TreeRef.value?.filter(val);
});

// 监听选中值变化
watch(
	() => props.modelValue,
	val => {
		if (val) {
			setCurrentKey(val);
		}
	}
);

defineExpose({
	refresh,
	setCurrentKey,
	getCurrentNode: () => TreeRef.value?.getCurrentNode()
});
</script>

<style lang="scss" scoped>
.store-org-tree {
	display: flex;
	flex-direction: column;
	height: 100%;
	background-color: var(--el-bg-color);

	&__header {
		padding: 15px;
		border-bottom: 1px solid var(--el-border-color-light);
	}

	&__content {
		flex: 1;
		padding: 10px 0;
		overflow: hidden;
	}

	&__node {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px 0;
		cursor: pointer;

		&.active {
			color: var(--el-color-primary);
		}
	}

	&__node-label {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__footer {
		padding: 15px;
		border-top: 1px solid var(--el-border-color-light);
	}

	:deep(.el-tree-node__content) {
		height: 40px;
		padding-right: 10px;
	}

	:deep(.el-tree-node.is-current > .el-tree-node__content) {
		background-color: var(--el-color-primary-light-9);
	}
}
</style>
