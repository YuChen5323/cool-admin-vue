<template>
	<cl-dialog v-model="visible" title="用户转移" width="600px">
		<el-form ref="FormRef" :model="form" :rules="rules" label-width="100px">
			<el-form-item label="待转移用户">
				<div class="transfer-users">
					<el-tag
						v-for="user in props.users"
						:key="user.id"
						size="small"
						class="user-tag"
					>
						{{ user.name }} ({{ user.username }})
					</el-tag>
				</div>
			</el-form-item>

			<el-form-item label="目标组织" prop="targetOrgId">
				<store-org-select v-model="form.targetOrgId" @change="onTargetOrgChange" />
			</el-form-item>

			<el-form-item label="目标角色" prop="targetRoleIds">
				<el-select
					v-model="form.targetRoleIds"
					multiple
					collapse-tags
					placeholder="请选择新角色（可选）"
					style="width: 100%"
				>
					<el-option
						v-for="item in targetRoleOptions"
						:key="item.id"
						:label="item.name"
						:value="item.id"
					/>
				</el-select>
			</el-form-item>
		</el-form>

		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" :loading="loading" @click="onSubmit">确认转移</el-button>
		</template>
	</cl-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import StoreOrgSelect from '../../../components/org/select.vue';
import { storeRoleTemplateService, storeUserService } from '../../../service';
import type { StoreUserEntity } from '../../../types';

const props = defineProps({
	users: {
		type: Array as () => StoreUserEntity[],
		default: () => []
	}
});

const emit = defineEmits(['success']);

const visible = ref(false);
const loading = ref(false);
const FormRef = ref();
const targetRoleOptions = ref<{ id: number; name: string }[]>([]);

const form = reactive({
	targetOrgId: undefined as number | undefined,
	targetRoleIds: [] as number[]
});

const rules = {
	targetOrgId: [{ required: true, message: '请选择目标组织', trigger: 'change' }]
};

// 目标组织改变
async function onTargetOrgChange(val: number) {
	form.targetRoleIds = [];
	if (val) {
		const res = await storeRoleTemplateService.list({
			orgId: val,
			status: 1
		});
		targetRoleOptions.value = res;
	}
}

// 打开弹窗
function open() {
	visible.value = true;
	form.targetOrgId = undefined;
	form.targetRoleIds = [];
	targetRoleOptions.value = [];
}

// 提交
async function onSubmit() {
	await FormRef.value?.validate();

	if (props.users.length === 0) {
		ElMessage.warning('请选择要转移的用户');
		return;
	}

	loading.value = true;
	try {
		await storeUserService.transfer({
			userIds: props.users.map(e => e.id),
			targetOrgId: form.targetOrgId!,
			targetRoleIds: form.targetRoleIds
		});
		ElMessage.success('转移成功');
		visible.value = false;
		emit('success');
	} finally {
		loading.value = false;
	}
}

defineExpose({
	open
});
</script>

<style lang="scss" scoped>
.transfer-users {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	padding: 8px;
	background-color: var(--el-fill-color-light);
	border-radius: 4px;
}

.user-tag {
	margin: 0;
}
</style>
