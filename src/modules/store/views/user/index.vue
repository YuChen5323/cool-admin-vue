<template>
	<cl-view-group ref="ViewGroup">
		<template #left>
			<org-tree ref="OrgTreeRef" v-model="selectedOrgId" @select="onOrgSelect" />
		</template>

		<template #right>
			<cl-crud ref="Crud">
				<cl-row>
					<cl-refresh-btn />
					<cl-add-btn />
					<cl-multi-delete-btn />
					<el-button
						type="success"
						:icon="Switch"
						:disabled="Table?.selection.length == 0"
						@click="onBatchTransfer"
					>
						{{ $t('批量转移') }}
					</el-button>
					<cl-flex1 />
					<cl-search-key :placeholder="$t('搜索用户名、姓名、手机号')" />
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

						<template #column-roleNames="{ scope }">
							<el-tag
								v-for="role in scope.row.roleNames?.split(',')"
								:key="role"
								size="small"
								class="role-tag"
							>
								{{ role }}
							</el-tag>
						</template>

						<template #slot-op="{ scope }">
							<el-button text @click="onTransfer(scope.row)">
								{{ $t('转移') }}
							</el-button>
						</template>
					</cl-table>
				</cl-row>

				<cl-row>
					<cl-flex1 />
					<cl-pagination />
				</cl-row>

				<cl-upsert ref="Upsert">
					<template #slot-org="{ scope }">
						<store-org-select v-model="scope.orgId" @change="onOrgChange" />
					</template>

					<template #slot-roles="{ scope }">
						<el-select
							v-model="scope.roleIds"
							multiple
							collapse-tags
							:placeholder="$t('请选择角色')"
						>
							<el-option
								v-for="item in roleOptions"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							/>
						</el-select>
					</template>
				</cl-upsert>
			</cl-crud>
		</template>
	</cl-view-group>

	<!-- 转移弹窗 -->
	<transfer-dialog ref="TransferRef" :users="selectedUsers" @success="onTransferSuccess" />
</template>

<script lang="ts" setup>
defineOptions({
	name: 'store-user'
});

import { ref } from 'vue';
import { Switch } from '@element-plus/icons-vue';
import { useTable, useUpsert, useCrud } from '@cool-vue/crud';
import { useViewGroup } from '/@/plugins/view';
import { useI18n } from 'vue-i18n';
import OrgTree from '../../components/org/tree.vue';
import StoreOrgSelect from '../../components/org/select.vue';
import TransferDialog from './components/transfer-dialog.vue';
import { storeUserService, storeRoleTemplateService } from '../../service';
import { getOrgTypeLabel, getOrgTypeColor } from '../../utils';
import type { StoreOrgEntity, StoreUserEntity } from '../../types';

const { t } = useI18n();
const { ViewGroup } = useViewGroup({
	title: t('用户列表')
});

const OrgTreeRef = ref<InstanceType<typeof OrgTree>>();
const TransferRef = ref<InstanceType<typeof TransferDialog>>();
const selectedOrgId = ref<number>();
const currentOrg = ref<StoreOrgEntity>();
const roleOptions = ref<{ id: number; name: string }[]>([]);
const selectedUsers = ref<StoreUserEntity[]>([]);

// 选择组织
function onOrgSelect(data: StoreOrgEntity) {
	currentOrg.value = data;
	Crud.value?.refresh({
		orgId: data.id
	});
}

// 组织改变
function onOrgChange(val: number) {
	// 加载该组织可用的角色模板
	loadRoleOptions(val);
}

// 加载角色选项
async function loadRoleOptions(orgId?: number) {
	const res = await storeRoleTemplateService.list({
		orgId,
		status: 1
	});
	roleOptions.value = res;
}

// 批量转移
function onBatchTransfer() {
	selectedUsers.value = Table.value?.selection || [];
	TransferRef.value?.open();
}

// 单个转移
function onTransfer(row: StoreUserEntity) {
	selectedUsers.value = [row];
	TransferRef.value?.open();
}

// 转移成功
function onTransferSuccess() {
	Crud.value?.refresh();
	OrgTreeRef.value?.refresh();
}

// CRUD
const Crud = useCrud(
	{
		service: storeUserService as any
	},
	(app: any) => {
		app.refresh();
		loadRoleOptions();
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
			prop: 'headImg',
			label: t('头像'),
			component: {
				name: 'cl-avatar',
				props: {
					size: 32
				}
			}
		},
		{
			prop: 'username',
			label: t('用户名'),
			minWidth: 120
		},
		{
			prop: 'name',
			label: t('姓名'),
			minWidth: 100
		},
		{
			prop: 'nickName',
			label: t('昵称'),
			minWidth: 100
		},
		{
			prop: 'orgName',
			label: t('所属组织'),
			minWidth: 150
		},
		{
			prop: 'orgType',
			label: t('组织类型'),
			minWidth: 100
		},
		{
			prop: 'roleNames',
			label: t('角色'),
			minWidth: 200
		},
		{
			prop: 'phone',
			label: t('手机号'),
			minWidth: 120
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
			prop: 'lastLoginTime',
			label: t('最后登录'),
			minWidth: 170
		},
		{
			prop: 'createTime',
			label: t('创建时间'),
			minWidth: 170,
			sortable: 'desc'
		},
		{
			type: 'op',
			buttons: ['slot-op', 'edit', 'delete']
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
			prop: 'headImg',
			label: t('头像'),
			component: {
				name: 'cl-upload',
				props: {
					text: t('选择头像')
				}
			}
		},
		{
			prop: 'username',
			label: t('用户名'),
			required: true,
			span: 12,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'name',
			label: t('姓名'),
			required: true,
			span: 12,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'nickName',
			label: t('昵称'),
			span: 12,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'phone',
			label: t('手机号'),
			span: 12,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'email',
			label: t('邮箱'),
			span: 12,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'orgId',
			label: t('所属组织'),
			required: true,
			component: {
				name: 'slot-org'
			}
		},
		{
			prop: 'roleIds',
			label: t('角色'),
			required: true,
			value: [],
			component: {
				name: 'slot-roles'
			}
		},
		{
			prop: 'password',
			label: t('密码'),
			span: 12,
			hidden: ({ scope }: any) => scope.id,
			component: {
				name: 'el-input',
				props: {
					type: 'password',
					showPassword: true
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
		const data = Upsert.value?.form;
		if (data && data.id) {
			loadRoleOptions(data.orgId);
		}
	}
});
</script>

<style lang="scss" scoped>
.role-tag {
	margin-right: 4px;
	margin-bottom: 4px;
}
</style>
