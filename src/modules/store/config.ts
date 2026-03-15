import { type ModuleConfig } from '/@/cool';
import { t } from '/@/plugins/i18n';

export default (): ModuleConfig => {
	return {
		order: 50,
		components: Object.values(import.meta.glob('./components/**/*.{vue,tsx}')),
		views: [
			{
				path: '/store/config',
				meta: {
					label: t('门店权限基础配置')
				},
				component: () => import('./views/config/index.vue')
			},
			{
				path: '/store/user',
				meta: {
					label: t('门店用户账号管理')
				},
				component: () => import('./views/user/index.vue')
			},
			{
				path: '/store/role-template',
				meta: {
					label: t('角色权限模板管理')
				},
				component: () => import('./views/role-template/index.vue')
			}
		]
	};
};
