<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key :placeholder="$t('搜索角色名称')" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<template #column-orgType="{ scope }">
					<el-tag
						size="small"
						:style="{
							backgroundColor: getOrgTypeColor(scope.row.orgType) + '20',
							color: getOrgTypeColor(scope.row.orgType),
							borderColor: getOrgTypeColor(scope.row.orgType)
						}"
					>
						{{ getOrgTypeLabel(scope.row.orgType) }}
					</el-tag>
				</template>

				<template #column-dataScope="{ scope }">
					<el-tag size="small" :type="getDataScopeType(scope.row.dataScope)">
						{{ getDataScopeLabel(scope.row.dataScope) }}
					</el-tag>
				</template>

				<template #column-menuIds="{ scope }">
					<el-tooltip
						:content="getMenuNames(scope.row.menuIds).join(', ')"
						placement="top"
						:disabled="getMenuNames(scope.row.menuIds).length <= 3"
					>
						<div>
							<el-tag
								v-for="menu in getMenuNames(scope.row.menuIds).slice(0, 3)"
								:key="menu"
								size="small"
								class="menu-tag"
							>
								{{ menu }}
							</el-tag>
							<el-tag
								v-if="getMenuNames(scope.row.menuIds).length > 3"
								size="small"
								type="info"
							>
								+{{ getMenuNames(scope.row.menuIds).length - 3 }}
							</el-tag>
						</div>
					</el-tooltip>
				</template>
			</cl-table>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<cl-upsert ref="Upsert">
			<template #slot-orgType="{ scope }">
				<el-select v-model="scope.orgType" :placeholder="$t('请选择适用组织类型')">
					<el-option
						v-for="item in orgTypeOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</template>

			<template #slot-dataScope="{ scope }">
				<el-select v-model="scope.dataScope" :placeholder="$t('请选择数据权限范围')">
					<el-option
						v-for="item in dataScopeOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</template>

			<template #slot-menuIds="{ scope }">
				<el-tree
					ref="MenuTreeRef"
					:check-strictly="false"
					:data="menuTreeData"
					:props="{
						label: 'name',
						children: 'children'
					}"
					show-checkbox
					node-key="id"
					:default-checked-keys="scope.menuIds || []"
					@check-change="onMenuCheckChange"
				/>
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'store-role-template'
});

import { ref, onMounted } from 'vue';
import { useTable, useUpsert, useCrud } from '@cool-vue/crud';
import { useI18n } from 'vue-i18n';
import { deepTree } from '/@/cool/utils';
import { storeRoleTemplateService } from '../../service';
import {
	orgTypeOptions,
	dataScopeOptions,
	getOrgTypeLabel,
	getOrgTypeColor,
	getDataScopeLabel,
	getDataScopeType
} from '../../utils';
import type { StoreRoleTemplateEntity } from '../../types';

const { t } = useI18n();
const MenuTreeRef = ref();
const menuTreeData = ref<any[]>([]);

// 加载菜单树
async function loadMenuTree() {
	// 这里应该从系统菜单服务获取
	// 简化处理，使用模拟数据
	menuTreeData.value = [
		{
			id: 1,
			name: '门店管理',
			children: [
				{ id: 11, name: '门店权限基础配置' },
				{ id: 12, name: '门店用户账号管理' },
				{ id: 13, name: '角色权限模板管理' }
			]
		},
		{
			id: 2,
			name: '商品管理',
			children: [
				{ id: 21, name: '商品列表' },
				{ id: 22, name: '商品分类' },
				{ id: 23, name: '库存管理' }
			]
		},
		{
			id: 3,
			name: '订单管理',
			children: [
				{ id: 31, name: '订单列表' },
				{ id: 32, name: '订单统计' }
			]
		}
	];
}

// 获取菜单名称列表
function getMenuNames(menuIds: number[]): string[] {
	if (!menuIds || menuIds.length === 0) return [];

	const names: string[] = [];
	const findNames = (items: any[]) => {
		items.forEach(item => {
			if (menuIds.includes(item.id)) {
				names.push(item.name);
			}
			if (item.children) {
				findNames(item.children);
			}
		});
	};
	findNames(menuTreeData.value);
	return names;
}

// 菜单选择改变
function onMenuCheckChange() {
	// 可以在这里处理菜单选择逻辑
}

// CRUD
const Crud = useCrud(
	{
		service: storeRoleTemplateService as any
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
			label: t('角色名称'),
			minWidth: 150
		},
		{
			prop: 'orgType',
			label: t('适用组织类型'),
			minWidth: 120
		},
		{
			prop: 'dataScope',
			label: t('数据权限'),
			minWidth: 120
		},
		{
			prop: 'menuIds',
			label: t('菜单权限'),
			minWidth: 250
		},
		{
			prop: 'description',
			label: t('描述'),
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
		width: '800px'
	},
	items: [
		{
			prop: 'name',
			label: t('角色名称'),
			required: true,
			span: 12,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'orgType',
			label: t('适用组织类型'),
			required: true,
			span: 12,
			component: {
				name: 'slot-orgType'
			}
		},
		{
			prop: 'dataScope',
			label: t('数据权限范围'),
			required: true,
			value: 'current',
			component: {
				name: 'slot-dataScope'
			}
		},
		{
			prop: 'menuIds',
			label: t('菜单权限'),
			required: true,
			value: [],
			component: {
				name: 'slot-menuIds'
			}
		},
		{
			prop: 'sort',
			label: t('排序'),
			value: 0,
			span: 12,
			component: {
				name: 'el-input-number',
				props: {
					min: 0
				}
			}
		},
		{
			prop: 'status',
			label: t('状态'),
			value: 1,
			span: 12,
			component: {
				name: 'cl-switch'
			}
		},
		{
			prop: 'description',
			label: t('描述'),
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
		const data = Upsert.value?.form;
		// 设置菜单选中
		if (data && data.menuIds && MenuTreeRef.value) {
			MenuTreeRef.value.setCheckedKeys(data.menuIds);
		}
	},
	onSubmit(_data: any, { next }: any) {
		// 获取选中的菜单
		const data = { ..._data };
		if (MenuTreeRef.value) {
			data.menuIds = MenuTreeRef.value.getCheckedKeys();
		}
		next(data);
	}
});

onMounted(() => {
	loadMenuTree();
});
</script>

<style lang="scss" scoped>
.menu-tag {
	margin-right: 4px;
	margin-bottom: 4px;
}
</style>
