import { hmr } from '/@/cool/hooks';
import {
	storeOrgService,
	storeUserService,
	storeRoleTemplateService
} from './service';

// 注册服务到全局 service
export function install() {
	const service = hmr.getData('service');
	if (service) {
		service.store = {
			org: storeOrgService,
			user: storeUserService,
			roleTemplate: storeRoleTemplateService
		};
	}
}

export * from './types';
export * from './utils';
