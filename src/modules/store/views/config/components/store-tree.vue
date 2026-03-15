<template>
	<div class="store-tree">
		<div class="store-tree__header">
			<el-text>{{ t('门店组织架构') }}</el-text>

			<div class="store-tree__op">
				<div class="btns" v-if="isDrag">
					<div class="item" @click="treeOrder(true)">
						<cl-svg name="success" />
					</div>

					<div class="item" @click="treeOrder(false)">
						<cl-svg name="fail" />
					</div>
				</div>

				<template v-else>
					<div class="item" @click="refresh()">
						<el-tooltip :content="t('刷新')">
							<cl-svg name="refresh" />
						</el-tooltip>
					</div>

					<div class="item" v-if="!browser.isMini" @click="isDrag = true">
						<el-tooltip :content="t('拖动排序')">
							<cl-svg name="sort" />
						</el-tooltip>
					</div>
				</template>
			</div>
		</div>

		<div class="store-tree__container" @contextmenu.stop.prevent="onContextMenu">
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
					:draggable="isDrag"
					:allow-drag="allowDrag"
					:allow-drop="allowDrop"
					:expand-on-click-node="false"
					@node-contextmenu="onContextMenu"
					@node-click="rowClick"
				>
					<template #default="{ node, data }">
						<div class="store-tree__node">
							<span class="store-tree__node-type">
								<el-tag :type="storeTypeTag(data.type)" size="small">
									{{ storeTypeLabel(data.type) }}
								</el-tag>
							</span>
							<span
								class="store-tree__node-label"
								:class="{
									'is-active': data.id == ViewGroup?.selected?.id
								}"
							>
								{{ node.label }}
							</span>
							<span
								v-if="browser.isMini"
								class="store-tree__node-icon"
								@click="onContextMenu($event, data, node)"
							>
								<el-icon>
									<more-filled />
								</el-icon>
							</span>
						</div>
					</template>
				</el-tree>
			</el-scrollbar>
		</div>

		<cl-form ref="Form" />
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'store-tree'
});

import { nextTick, onMounted, ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useCool } from '/@/cool';
import { deepTree, revDeepTree } from '/@/cool/utils';
import { isArray } from 'lodash-es';
import { ContextMenu, useForm } from '@cool-vue/crud';
import { MoreFilled } from '@element-plus/icons-vue';
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
	manager?: string;
	phone?: string;
	address?: string;
	status?: number;
	orderNum?: number;
	remark?: string;
	children?: StoreEntity[];
}

const props = defineProps({
	drag: {
		type: Boolean,
		default: true
	},
	level: {
		type: Number,
		default: 99
	}
});

const emit = defineEmits(['refresh', 'store-add']);

const { service, browser } = useCool();
const Form = useForm();
const { ViewGroup } = useViewGroup();
const { t } = useI18n();

const list = ref<StoreEntity[]>([]);
const loading = ref(false);
const isDrag = ref(false);

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
	const tag = storeTypes.value.find(e => e.value === type)?.type;
	return tag as 'danger' | 'warning' | 'success' | 'info' | undefined;
}

function allowDrag({ data }: any) {
	return data.parentId !== null && data.parentId !== undefined;
}

function allowDrop(_: any, dropNode: any) {
	return dropNode.data.parentId !== null && dropNode.data.parentId !== undefined;
}

async function refresh() {
	loading.value = true;
	isDrag.value = false;

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
			emit('refresh', { page: 1, storeIds: ids });
		});
	}
}

function rowEdit(item: StoreEntity) {
	const method = item.id ? 'update' : 'add';

	Form.value?.open({
		title: t('编辑门店'),
		width: '600px',
		props: {
			labelWidth: '100px'
		},
		items: [
			{
				label: t('门店名称'),
				prop: 'name',
				component: {
					name: 'el-input'
				},
				required: true
			},
			{
				label: t('门店编码'),
				prop: 'code',
				component: {
					name: 'el-input'
				},
				required: true
			},
			{
				label: t('门店类型'),
				prop: 'type',
				value: 2,
				component: {
					name: 'el-select',
					options: storeTypes.value
				},
				required: true
			},
			{
				label: t('上级组织'),
				prop: 'parentName',
				component: {
					name: 'el-input',
					props: {
						disabled: true
					}
				}
			},
			{
				label: t('负责人'),
				prop: 'manager',
				component: {
					name: 'el-input'
				}
			},
			{
				label: t('联系电话'),
				prop: 'phone',
				component: {
					name: 'el-input'
				}
			},
			{
				label: t('地址'),
				prop: 'address',
				component: {
					name: 'el-input',
					props: {
						type: 'textarea',
						rows: 2
					}
				}
			},
			{
				label: t('排序'),
				prop: 'orderNum',
				value: 0,
				component: {
					name: 'el-input-number',
					props: {
						'controls-position': 'right',
						min: 0,
						max: 100
					}
				}
			},
			{
				label: t('状态'),
				prop: 'status',
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
				label: t('备注'),
				prop: 'remark',
				component: {
					name: 'el-input',
					props: {
						type: 'textarea',
						rows: 3
					}
				}
			}
		],
		form: {
			...item
		},
		on: {
			submit(data, { done, close }) {
				service.base.sys.department[method]({
					id: item.id,
					parentId: item.parentId,
					name: data.name,
					code: data.code,
					type: data.type,
					manager: data.manager,
					phone: data.phone,
					address: data.address,
					orderNum: data.orderNum,
					status: data.status,
					remark: data.remark
				})
					.then(() => {
						ElMessage.success(t('新增门店 "{name}" 成功', { name: data.name }));
						close();
						refresh();
					})
					.catch(err => {
						ElMessage.error(err.message);
						done();
					});
			}
		}
	});
}

function rowDel(item: StoreEntity) {
	async function del(f: boolean) {
		await service.base.sys.department
			.delete({
				ids: [item.id],
				deleteUser: f
			})
			.then(() => {
				if (ViewGroup.value?.selected?.id == item.id) {
					rowClick();
				}

				if (f) {
					ElMessage.success(t('删除成功'));
				} else {
					ElMessageBox.confirm(t('该门店的用户已成功转移到上级组织。'), t('删除成功'));
				}
			});

		refresh();
	}

	ElMessageBox.confirm(t('此操作将会删除该门店的所有用户，是否确认？'), t('提示'), {
		type: 'warning',
		confirmButtonText: t('确定'),
		cancelButtonText: t('取消'),
		distinguishCancelAndClose: true
	})
		.then(() => {
			del(true);
		})
		.catch(action => {
			if (action == 'cancel') {
				del(false);
			}
		});
}

function treeOrder(f: boolean) {
	if (f) {
		ElMessageBox.confirm(t('部门架构已发生改变，是否保存？'), t('提示'), {
			type: 'warning'
		})
			.then(async () => {
				const ids: any[] = [];

				function deep(list: any[], pid: any) {
					list.forEach(e => {
						e.parentId = pid;
						ids.push(e);

						if (e.children && isArray(e.children)) {
							deep(e.children, e.id);
						}
					});
				}

				deep(list.value, null);

				await service.base.sys.department
					.order(
						ids.map((e, i) => {
							return {
								id: e.id,
								parentId: e.parentId,
								orderNum: i
							};
						})
					)
					.then(() => {
						ElMessage.success(t('更新排序成功'));
					})
					.catch(err => {
						ElMessage.error(err.message);
					});

				refresh();
				isDrag.value = false;
			})
			.catch(() => null);
	} else {
		refresh();
	}
}

function onContextMenu(e: any, d?: any, n?: any) {
	if (!d) {
		d = list.value[0] || {};
	}

	const perm = service.base.sys.department.permission;

	ContextMenu.open(e, {
		list: [
			{
				label: t('新增'),
				hidden: (n && n.level >= props.level) || !checkPerm(perm.add),
				callback(done) {
					rowEdit({
						name: '',
						code: '',
						type: 2,
						parentName: d.name,
						parentId: d.id
					});
					done();
				}
			},
			{
				label: t('编辑'),
				hidden: !checkPerm(perm.update),
				callback(done) {
					rowEdit(d);
					done();
				}
			},
			{
				label: t('删除'),
				hidden: !d.parentId || !checkPerm(perm.delete),
				callback(done) {
					rowDel(d);
					done();
				}
			},
			{
				label: t('新增成员'),
				hidden: !checkPerm(perm.add),
				callback(done) {
					emit('store-add', d);
					done();
				}
			}
		]
	});
}

function checkPerm(value: string) {
	const { menu } = useStore();
	if (typeof value == 'string') {
		return value ? menu.perms.some((e: any) => e.includes(value.replace(/\s/g, ''))) : false;
	}
	return false;
}

onMounted(function () {
	refresh();
});
</script>

<style lang="scss" scoped>
.store-tree {
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

		.btns {
			display: flex;
			align-items: center;
			justify-content: center;

			.item {
				&:hover {
					&:first-child {
						color: var(--el-color-success);
					}

					&:last-child {
						color: var(--el-color-danger);
					}
				}
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

		&-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #eee;
			height: 26px;
			width: 26px;
			text-align: center;
			margin-right: 5px;
			border-radius: 6px;
		}
	}
}
</style>
