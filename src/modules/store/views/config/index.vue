<template>
	<cl-view-group ref="ViewGroup">
		<template #left>
			<store-tree @refresh="refresh" @store-add="onStoreAdd" />
		</template>

		<template #right>
			<cl-crud ref="Crud">
				<cl-row>
					<cl-refresh-btn />
					<cl-add-btn />
					<cl-multi-delete-btn />
					<cl-flex1 />
					<cl-search-key :placeholder="$t('搜索门店名称、编码')" />
				</cl-row>

				<cl-row>
					<cl-table ref="Table">
						<template #column-type="{ scope }">
							<el-tag :type="getStoreTypeTag(scope.row.type)" size="small">
								{{ getStoreTypeLabel(scope.row.type) }}
							</el-tag>
						</template>
					</cl-table>
				</cl-row>

				<cl-row>
					<cl-flex1 />
					<cl-pagination />
				</cl-row>

				<cl-upsert ref="Upsert" />
			</cl-crud>
		</template>
	</cl-view-group>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'store-config'
});

import { useTable, useUpsert, useCrud } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import StoreTree from './components/store-tree.vue';
import { useViewGroup } from '/@/plugins/view';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { service } = useCool();
const { t } = useI18n();

const { ViewGroup } = useViewGroup({
	title: t('门店列表')
});

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

const Crud = useCrud({
	service: service.base.sys.department
});

const Table = useTable({
	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			prop: 'name',
			label: t('门店名称'),
			minWidth: 150
		},
		{
			prop: 'code',
			label: t('门店编码'),
			minWidth: 120
		},
		{
			prop: 'type',
			label: t('门店类型'),
			minWidth: 100
		},
		{
			prop: 'manager',
			label: t('负责人'),
			minWidth: 100
		},
		{
			prop: 'phone',
			label: t('联系电话'),
			minWidth: 120
		},
		{
			prop: 'address',
			label: t('地址'),
			minWidth: 200,
			showOverflowTooltip: true
		},
		{
			prop: 'status',
			label: t('状态'),
			minWidth: 100,
			component: {
				name: 'cl-switch'
			}
		},
		{
			prop: 'orderNum',
			label: t('排序号'),
			width: 100,
			sortable: 'asc'
		},
		{
			prop: 'createTime',
			label: t('创建时间'),
			sortable: 'desc',
			minWidth: 170
		},
		{
			prop: 'updateTime',
			label: t('更新时间'),
			sortable: 'custom',
			minWidth: 170
		},
		{
			type: 'op',
			buttons: ['edit', 'delete'],
			width: 200
		}
	]
});

const Upsert = useUpsert({
	dialog: {
		width: '600px'
	},

	items: [
		{
			prop: 'name',
			label: t('门店名称'),
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				props: {
					placeholder: t('请输入门店名称')
				}
			}
		},
		{
			prop: 'code',
			label: t('门店编码'),
			span: 12,
			required: true,
			component: {
				name: 'el-input',
				props: {
					placeholder: t('请输入门店编码')
				}
			}
		},
		{
			prop: 'type',
			label: t('门店类型'),
			span: 12,
			value: 2,
			required: true,
			component: {
				name: 'el-select',
				options: storeTypes.value
			}
		},
		{
			prop: 'parentId',
			label: t('上级组织'),
			span: 12,
			component: {
				name: 'cl-dept-select'
			}
		},
		{
			prop: 'manager',
			label: t('负责人'),
			span: 12,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'phone',
			label: t('联系电话'),
			span: 12,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'address',
			label: t('地址'),
			span: 24,
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 2
				}
			}
		},
		{
			prop: 'orderNum',
			label: t('排序号'),
			span: 12,
			value: 0,
			component: {
				name: 'el-input-number',
				props: {
					min: 0,
					max: 99,
					'controls-position': 'right'
				}
			}
		},
		{
			prop: 'status',
			label: t('状态'),
			span: 12,
			value: 1,
			component: {
				name: 'el-radio-group',
				options: [
					{ label: t('启用'), value: 1 },
					{ label: t('禁用'), value: 0 }
				]
			}
		},
		{
			prop: 'remark',
			label: t('备注'),
			span: 24,
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 3
				}
			}
		}
	],

	onSubmit(data, { next }) {
		next({
			departmentId: ViewGroup.value?.selected?.id,
			...data
		});
	}
});

function refresh(params?: any) {
	Crud.value?.refresh(params);
}

function onStoreAdd({ id }: any) {
	Crud.value?.rowAppend({
		parentId: id,
		type: 2,
		status: 1
	});
}
</script>
