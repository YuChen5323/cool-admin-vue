<template>
	<cl-view-group ref="ViewGroup">
		<template #left>
			<org-tree
				ref="OrgTreeRef"
				v-model="selectedOrgId"
				@select="onOrgSelect"
				@add-root="onAddRoot"
			/>
		</template>

		<template #right>
			<cl-crud ref="Crud">
				<cl-row>
					<cl-refresh-btn />
					<el-button type="primary" :icon="Plus" :disabled="!canAdd" @click="onAddChild">
						{{ $t('新增下级') }}
					</el-button>
					<cl-multi-delete-btn />
					<cl-flex1 />
					<cl-search-key :placeholder="$t('搜索组织名称、编码')" />
				</cl-row>

				<cl-row>
					<cl-table ref="Table">
						<template #column-type="{ scope }">
							<el-tag
								size="small"
								:style="{
									backgroundColor: getOrgTypeColor(scope.row.type) + '20',
									color: getOrgTypeColor(scope.row.type),
									borderColor: getOrgTypeColor(scope.row.type)
								}"
							>
								{{ getOrgTypeLabel(scope.row.type) }}
							</el-tag>
						</template>
					</cl-table>
				</cl-row>

				<cl-row>
					<cl-flex1 />
					<cl-pagination />
				</cl-row>

				<cl-upsert ref="Upsert">
					<template #slot-parent="{ scope }">
						<store-org-select
							v-model="scope.parentId"
							:check-strictly="true"
							@change="onParentChange"
						/>
					</template>

					<template #slot-type="{ scope }">
						<el-select v-model="scope.type" :placeholder="$t('请选择组织类型')">
							<el-option
								v-for="item in availableOrgTypes"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</template>
				</cl-upsert>
			</cl-crud>
		</template>
	</cl-view-group>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'store-config'
});

import { ref, computed } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { useTable, useUpsert, useCrud } from '@cool-vue/crud';
import { useViewGroup } from '/@/plugins/view';
import { useI18n } from 'vue-i18n';
import OrgTree from '../../components/org/tree.vue';
import StoreOrgSelect from '../../components/org/select.vue';
import { storeOrgService } from '../../service';
import {
	orgTypeOptions,
	getOrgTypeLabel,
	getOrgTypeColor,
	getAvailableChildOrgTypes
} from '../../utils';
import type { StoreOrgEntity, StoreOrgType } from '../../types';

const { t } = useI18n();
const { ViewGroup } = useViewGroup({
	title: t('组织列表')
});

const OrgTreeRef = ref<InstanceType<typeof OrgTree>>();
const selectedOrgId = ref<number>();
const currentOrg = ref<StoreOrgEntity>();
const availableOrgTypes = ref(orgTypeOptions);

// 是否可以新增下级
const canAdd = computed(() => {
	if (!currentOrg.value) return true;
	const childTypes = getAvailableChildOrgTypes(currentOrg.value.type);
	return childTypes.length > 0;
});

// 选择组织
function onOrgSelect(data: StoreOrgEntity) {
	currentOrg.value = data;
	Crud.value?.refresh({
		parentId: data.id
	});
}

// 新增根组织
function onAddRoot() {
	currentOrg.value = undefined;
	availableOrgTypes.value = orgTypeOptions.filter(e => e.value === 'headquarters');
	Upsert.value?.open({});
}

// 新增下级组织
function onAddChild() {
	if (currentOrg.value) {
		const childTypes = getAvailableChildOrgTypes(currentOrg.value.type);
		availableOrgTypes.value = orgTypeOptions.filter(e =>
			childTypes.includes(e.value as StoreOrgType)
		);
		Upsert.value?.open({
			parentId: currentOrg.value.id
		});
	}
}

// 父组织改变
function onParentChange(val: number) {
	// 可以根据父组织类型动态更新可选的组织类型
	console.log('parent changed:', val);
}

// CRUD
const Crud = useCrud(
	{
		service: storeOrgService as any
	},
	(app: any) => {
		app.refresh();
	}
);

// 表格
const Table = useTable({
	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			prop: 'name',
			label: t('组织名称'),
			minWidth: 150
		},
		{
			prop: 'code',
			label: t('组织编码'),
			minWidth: 150
		},
		{
			prop: 'type',
			label: t('组织类型'),
			minWidth: 120
		},
		{
			prop: 'managerName',
			label: t('负责人'),
			minWidth: 120
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
			prop: 'sort',
			label: t('排序'),
			minWidth: 80,
			sortable: 'custom'
		},
		{
			prop: 'createTime',
			label: t('创建时间'),
			minWidth: 170,
			sortable: 'desc'
		},
		{
			type: 'op'
		}
	]
});

// 表单
const Upsert = useUpsert({
	dialog: {
		width: '700px'
	},
	items: [
		{
			prop: 'parentId',
			label: t('上级组织'),
			component: {
				name: 'slot-parent'
			}
		},
		{
			prop: 'type',
			label: t('组织类型'),
			required: true,
			component: {
				name: 'slot-type'
			}
		},
		{
			prop: 'name',
			label: t('组织名称'),
			required: true,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'code',
			label: t('组织编码'),
			required: true,
			component: {
				name: 'el-input',
				props: {
					disabled: true
				}
			}
		},
		{
			prop: 'managerName',
			label: t('负责人'),
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'phone',
			label: t('联系电话'),
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'address',
			label: t('地址'),
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 2
				}
			}
		},
		{
			prop: 'sort',
			label: t('排序'),
			value: 0,
			component: {
				name: 'el-input-number',
				props: {
					min: 0
				}
			}
		},
		{
			prop: 'remark',
			label: t('备注'),
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 3
				}
			}
		}
	],
	onOpen() {
		// 自动生成编码
		const data = Upsert.value?.form;
		if (data && !data.id) {
			data.code = generateCode(data.type, currentOrg.value?.code);
		}
	},
	onSubmit(data: any, { next, done }: any) {
		// 确保编码存在
		if (!data.code) {
			data.code = generateCode(data.type, currentOrg.value?.code);
		}
		next(data);
		// 刷新树
		setTimeout(() => {
			OrgTreeRef.value?.refresh();
		}, 500);
	}
});

// 生成编码
function generateCode(type?: StoreOrgType, parentCode?: string): string {
	const prefixMap: Record<StoreOrgType, string> = {
		headquarters: 'HQ',
		region: 'RG',
		store: 'ST',
		franchisee: 'FR'
	};
	const prefix = type ? prefixMap[type] : 'ORG';
	const timestamp = Date.now().toString(36).toUpperCase().slice(-6);
	return parentCode ? `${parentCode}-${prefix}${timestamp}` : `${prefix}${timestamp}`;
}
</script>

<style lang="scss" scoped>
:deep(.cl-view-group__left) {
	width: 300px;
}
</style>
