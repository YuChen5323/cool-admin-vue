<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key :placeholder="$t('搜索模板名称')" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<template #column-applyStoreType="{ scope }">
					<template v-if="scope.row.applyStoreType === -1">
						<el-tag type="info" size="small">{{ t('全部') }}</el-tag>
					</template>
					<template v-else>
						<el-tag
							v-for="type in parseStoreTypes(scope.row.applyStoreType)"
							:key="type"
							:type="getStoreTypeTag(type)"
							size="small"
							style="margin-right: 4px"
						>
							{{ getStoreTypeLabel(type) }}
						</el-tag>
					</template>
				</template>
			</cl-table>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<cl-upsert ref="Upsert">
			<template #slot-menuIdList="{ scope }">
				<cl-menu-check v-model="scope.menuIdList" />
			</template>

			<template #slot-dataScope="{ scope }">
				<div>
					<el-row>
						<cl-switch v-model="scope.relevance" />

						<span
							:style="{
								marginLeft: '10px',
								fontSize: '12px'
							}"
						>
							{{ t('是否关联上下级') }}
						</span>
					</el-row>

					<cl-dept-check
						v-model="scope.departmentIdList"
						:check-strictly="scope.relevance == 0"
					/>
				</div>
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'store-role-template'
});

import { useTable, useUpsert, useCrud } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n();
const { service } = useCool();

const storeTypes = computed(() => [
	{ label: t('总部'), value: 0 },
	{ label: t('区域'), value: 1 },
	{ label: t('门店'), value: 2 },
	{ label: t('加盟商'), value: 3 }
]);

const dataScopes = computed(() => [
	{ label: t('仅本人数据'), value: 0 },
	{ label: t('本门店数据'), value: 1 },
	{ label: t('本门店及下级数据'), value: 2 },
	{ label: t('全部数据'), value: 3 }
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

function parseStoreTypes(value?: number): number[] {
	if (value === undefined || value === null || value === -1) {
		return [];
	}
	return [value];
}

const Crud = useCrud({ service: service.base.sys.role }, app => {
	app.refresh();
});

const Upsert = useUpsert({
	dialog: {
		width: '800px'
	},

	items: [
		{
			prop: 'name',
			label: t('模板名称'),
			span: 12,
			required: true,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'label',
			label: t('模板标识'),
			span: 12,
			required: true,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'applyStoreType',
			label: t('适用门店类型'),
			span: 12,
			value: -1,
			component: {
				name: 'el-select',
				options: [
					{ label: t('全部'), value: -1 },
					...storeTypes.value
				]
			}
		},
		{
			prop: 'dataScope',
			label: t('数据范围'),
			span: 12,
			value: 1,
			component: {
				name: 'el-select',
				options: dataScopes.value
			}
		},
		{
			prop: 'remark',
			label: t('模板描述'),
			span: 24,
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 3
				}
			}
		},
		{
			label: t('功能权限'),
			prop: 'menuIdList',
			value: [],
			component: {
				name: 'slot-menuIdList'
			}
		},
		{
			label: t('数据权限'),
			prop: 'relevance',
			component: {
				name: 'slot-dataScope'
			}
		}
	],

	onSubmit(data, { next }) {
		next({
			...data,
			type: 2,
			departmentIdList: data.departmentIdList || []
		});
	}
});

const Table = useTable({
	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			prop: 'name',
			label: t('模板名称'),
			minWidth: 150
		},
		{
			prop: 'label',
			label: t('模板标识'),
			minWidth: 120
		},
		{
			prop: 'applyStoreType',
			label: t('适用门店类型'),
			minWidth: 180
		},
		{
			prop: 'dataScope',
			label: t('数据范围'),
			minWidth: 120,
			dict: dataScopes.value
		},
		{
			prop: 'remark',
			label: t('模板描述'),
			showOverflowTooltip: true,
			minWidth: 150
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
</script>
