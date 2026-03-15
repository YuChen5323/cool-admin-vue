<template>
	<div class="store-user-tree">
		<div class="store-user-tree__header">
			<el-text>{{ t('门店组织架构') }}</el-text>

			<div class="store-user-tree__op">
				<div class="item" @click="refresh()">
					<el-tooltip :content="t('刷新')">
						<cl-svg name="refresh" />
					</el-tooltip>
				</div>
			</div>
		</div>

		<div class="store-user-tree__container" @contextmenu.stop.prevent="onContextMenu">
			<el-scrollbar>
				<el-tree
					v-loading="loading"
					node-key="id"
					default-expand-all
					:data="list"
					:props="{
						label: 'name'
					}"
					highlight-current
					:expand-on-click-node="false"
					@node-contextmenu="onContextMenu"
					@node-click="rowClick"
				>
					<template #default="{ node, data }">
						<div class="store-user-tree__node">
							<span class="store-user-tree__node-type">
								<el-tag :type="storeTypeTag(data.type)" size="small">
									{{ storeTypeLabel(data.type) }}
								</el-tag>
							</span>
							<span
								class="store-user-tree__node-label"
								:class="{
									'is-active': data.id == ViewGroup?.selected?.id
								}"
							>
								{{ node.label }}
							</span>
						</div>
					</template>
				</el-tree>
			</el-scrollbar>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'store-user-tree'
});

import { nextTick, onMounted, ref, computed } from 'vue';
import { useCool } from '/@/cool';
import { deepTree, revDeepTree } from '/@/cool/utils';
import { ContextMenu } from '@cool-vue/crud';
import { useViewGroup } from '/@/plugins/view';
import { useI18n } from 'vue-i18n';
import { useStore } from '/$/base/store';

interface StoreEntity {
	id?: number;
	name?: string;
	code?: string;
	type?: number;
	parentId?: number;
	parentName?: string;
	children?: StoreEntity[];
}

const emit = defineEmits(['refresh', 'user-add']);

const { service, browser } = useCool();
const { ViewGroup } = useViewGroup();
const { t } = useI18n();
const { menu } = useStore();

const list = ref<StoreEntity[]>([]);
const loading = ref(false);

const storeTypes = computed(() => [
	{ label: t('总部'), value: 0, type: 'danger' },
	{ label: t('区域'), value: 1, type: 'warning' },
	{ label: t('门店'), value: 2, type: 'success' },
	{ label: t('加盟商'), value: 3, type: 'info' }
]);

function storeTypeLabel(type?: number) {
	return storeTypes.value.find(e => e.value === type)?.label || '';
}

function storeTypeTag(type?: number): 'danger' | 'warning' | 'success' | 'info' | undefined {
	const typeMap: Record<number, 'danger' | 'warning' | 'success' | 'info'> = {
		0: 'danger',
		1: 'warning',
		2: 'success',
		3: 'info'
	};
	return typeMap[type ?? 2];
}

async function refresh() {
	loading.value = true;

	await service.base.sys.department.list().then(res => {
		list.value = deepTree(res);

		if (!ViewGroup.value?.selected) {
			rowClick();
		}
	});

	loading.value = false;
}

function rowClick(item?: StoreEntity) {
	if (!item) {
		item = list.value[0];
	}

	if (item) {
		const ids = item.children ? revDeepTree(item.children).map(e => e.id) : [];
		ids.unshift(item.id!);

		ViewGroup.value?.select(item);

		nextTick(() => {
			emit('refresh', { page: 1, departmentIds: ids });
		});
	}
}

function checkPerm(value: string) {
	if (typeof value == 'string') {
		return value ? menu.perms.some((e: any) => e.includes(value.replace(/\s/g, ''))) : false;
	}
	return false;
}

function onContextMenu(e: any, d?: any, n?: any) {
	if (!d) {
		d = list.value[0] || {};
	}

	const perm = service.base.sys.user.permission;

	ContextMenu.open(e, {
		list: [
			{
				label: t('新增成员'),
				hidden: !checkPerm(perm.add),
				callback(done) {
					emit('user-add', d);
					done();
				}
			}
		]
	});
}

onMounted(function () {
	refresh();
});
</script>

<style lang="scss" scoped>
.store-user-tree {
	height: 100%;
	width: 100%;

	:deep(.el-tree-node__label) {
		display: block;
		height: 100%;
		width: 100%;
	}

	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 40px;
		padding: 0 10px;
		border-bottom: 1px solid var(--el-border-color-extra-light);
	}

	&__op {
		display: flex;
		align-items: center;

		.item {
			display: flex;
			justify-content: center;
			align-items: center;
			list-style: none;
			margin-left: 5px;
			cursor: pointer;
			border-radius: 6px;
			font-size: 16px;
			height: 26px;
			width: 26px;
			color: var(--el-text-color-primary);

			.cl-svg {
				outline: none;
			}

			&:hover {
				background-color: var(--el-fill-color-light);
			}
		}
	}

	&__container {
		height: calc(100% - 40px);
		padding: 10px;

		:deep(.el-tree-node__content) {
			height: 38px;
			border-radius: 4px;

			.el-tree-node__expand-icon {
				margin-left: 5px;
			}
		}
	}

	&__node {
		display: flex;
		align-items: center;
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		gap: 8px;

		&-type {
			flex-shrink: 0;
		}

		&-label {
			display: flex;
			align-items: center;
			flex: 1;
			height: 100%;
			font-size: 14px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

			&.is-active {
				color: var(--el-color-primary);
			}
		}
	}
}
</style>
