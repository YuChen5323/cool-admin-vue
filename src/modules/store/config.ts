import { type ModuleConfig } from '/@/cool';
import { t } from '/@/plugins/i18n';
import { install } from './index';

export default (): ModuleConfig => {
	return {
		components: Object.values(import.meta.glob('./components/**/*.{vue,tsx}')),
		views: [
			{
				path: '/store/config',
				meta: {
					label: t('门店权限基础配置'),
					keepAlive: true
				},
				component: () => import('./views/config/index.vue')
			},
			{
				path: '/store/user',
				meta: {
					label: t('门店用户账号管理'),
					keepAlive: true
				},
				component: () => import('./views/user/index.vue')
			},
			{
				path: '/store/role-template',
				meta: {
					label: t('角色权限模板管理'),
					keepAlive: true
				},
				component: () => import('./views/role-template/index.vue')
			}
		],
		install
	};
};
