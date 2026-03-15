import { useStore } from '/$/base/store';

/**
 * 数据权限检查
 * 根据用户的组织层级和数据权限范围，判断是否有权访问特定数据
 */
export function checkDataPermission(
	dataOrgId: number,
	dataOrgPath: string,
	userOrgId: number,
	userOrgPath: string,
	dataScope: 'all' | 'current' | 'children' | 'self'
): boolean {
	// 全部数据权限
	if (dataScope === 'all') {
		return true;
	}

	// 仅本人数据权限
	if (dataScope === 'self') {
		// 这里需要结合创建者ID判断，简化处理
		return false;
	}

	// 仅本组织数据权限
	if (dataScope === 'current') {
		return dataOrgId === userOrgId;
	}

	// 本组织及子组织数据权限
	if (dataScope === 'children') {
		// 检查数据组织路径是否包含用户组织路径
		return dataOrgPath.startsWith(userOrgPath);
	}

	return false;
}

/**
 * 检查用户是否可以管理指定组织
 */
export function canManageOrg(
	targetOrgPath: string,
	userOrgPath: string,
	userDataScope: 'all' | 'current' | 'children' | 'self'
): boolean {
	// 全部权限
	if (userDataScope === 'all') {
		return true;
	}

	// 仅本人，不能管理任何组织
	if (userDataScope === 'self') {
		return false;
	}

	// 仅本组织，只能管理相同组织
	if (userDataScope === 'current') {
		return targetOrgPath === userOrgPath;
	}

	// 本组织及子组织
	if (userDataScope === 'children') {
		return targetOrgPath.startsWith(userOrgPath) || targetOrgPath === userOrgPath;
	}

	return false;
}

/**
 * 获取用户的数据权限范围
 */
export function getUserDataScope(): 'all' | 'current' | 'children' | 'self' {
	const { user } = useStore();
	// 从用户信息中获取数据权限范围
	// 实际项目中应该从后端返回的用户角色信息中获取
	return user.info?.dataScope || 'self';
}

/**
 * 获取用户的组织ID
 */
export function getUserOrgId(): number {
	const { user } = useStore();
	return user.info?.orgId || 0;
}

/**
 * 获取用户的组织路径
 */
export function getUserOrgPath(): string {
	const { user } = useStore();
	return user.info?.orgPath || '';
}
