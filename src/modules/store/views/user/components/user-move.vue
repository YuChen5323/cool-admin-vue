<template>
	<cl-dialog v-model="visible" :title="$t('转移用户')">
		<div class="user-move">
			<el-form label-width="100px">
				<el-form-item :label="$t('目标门店')">
					<el-tree-select
						v-model="storeId"
						:data="storeList"
						:props="{
							label: 'name',
							value: 'id',
							children: 'children'
						}"
						check-strictly
						clearable
						filterable
						:placeholder="$t('选择门店')"
						style="width: 100%"
					/>
				</el-form-item>
			</el-form>
		</div>

		<template #footer>
			<el-button @click="close">{{ $t('取消') }}</el-button>
			<el-button type="primary" @click="submit" :loading="loading">{{ $t('确定') }}</el-button>
		</template>
	</cl-dialog>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'user-move'
});

import { ref } from 'vue';
import { useCool } from '/@/cool';
import { deepTree } from '/@/cool/utils';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';

const { service } = useCool();
const { t } = useI18n();

const visible = ref(false);
const loading = ref(false);
const storeId = ref<number>();
const storeList = ref<any[]>([]);
const userIds = ref<number[]>([]);

async function open(ids: number[]) {
	userIds.value = ids;
	visible.value = true;
	storeId.value = undefined;

	await service.base.sys.department.list().then(res => {
		storeList.value = deepTree(res);
	});
}

function close() {
	visible.value = false;
}

async function submit() {
	if (!storeId.value) {
		return ElMessage.warning(t('请选择目标门店'));
	}

	loading.value = true;

	await service.base.sys.user
		.move({
			userIds: userIds.value,
			departmentId: storeId.value
		})
		.then(() => {
			ElMessage.success(t('转移成功'));
			close();
			emit('success');
		})
		.catch(err => {
			ElMessage.error(err.message);
		});

	loading.value = false;
}

const emit = defineEmits(['success']);

defineExpose({
	open
});
</script>

<style lang="scss" scoped>
.user-move {
	padding: 20px 0;
}
</style>
