import type { StoreOrgType, StoreDataScope } from '../types';

/**
 * 组织类型选项
 */
export const orgTypeOptions = [
	{ label: '总部', value: 'headquarters' },
	{ label: '区域', value: 'region' },
	{ label: '门店', value: 'store' },
	{ label: '加盟商', value: 'franchisee' }
];

/**
 * 数据权限范围选项
 */
export const dataScopeOptions = [
	{ label: '全部数据', value: 'all' },
	{ label: '本组织及子组织', value: 'children' },
	{ label: '仅本组织', value: 'current' },
	{ label: '仅本人', value: 'self' }
];

/**
 * 获取组织类型标签
 */
export function getOrgTypeLabel(type: StoreOrgType): string {
	const map: Record<StoreOrgType, string> = {
		headquarters: '总部',
		region: '区域',
		store: '门店',
		franchisee: '加盟商'
	};
	return map[type] || type;
}

/**
 * 获取组织类型颜色
 */
export function getOrgTypeColor(type: StoreOrgType): string {
	const colorMap: Record<StoreOrgType, string> = {
		headquarters: '#409EFF',
		region: '#67C23A',
		store: '#E6A23C',
		franchisee: '#F56C6C'
	};
	return colorMap[type] || '#909399';
}

/**
 * 获取数据权限范围标签
 */
export function getDataScopeLabel(scope: StoreDataScope): string {
	const map: Record<StoreDataScope, string> = {
		all: '全部数据',
		children: '本组织及子组织',
		current: '仅本组织',
		self: '仅本人'
	};
	return map[scope] || scope;
}

/**
 * 获取数据权限范围标签类型
 */
export function getDataScopeType(scope: StoreDataScope): 'success' | 'warning' | 'info' | 'danger' {
	const typeMap: Record<StoreDataScope, 'success' | 'warning' | 'info' | 'danger'> = {
		all: 'success',
		children: 'warning',
		current: 'info',
		self: 'danger'
	};
	return typeMap[scope] || 'info';
}

/**
 * 获取可用的下级组织类型
 */
export function getAvailableChildOrgTypes(parentType: StoreOrgType): StoreOrgType[] {
	switch (parentType) {
		case 'headquarters':
			return ['region', 'store', 'franchisee'];
		case 'region':
			return ['store', 'franchisee'];
		case 'store':
			return ['franchisee'];
		case 'franchisee':
			return [];
		default:
			return [];
	}
}

/**
 * 生成组织编码
 */
export function generateOrgCode(type: StoreOrgType, parentCode?: string): string {
	const prefixMap: Record<StoreOrgType, string> = {
		headquarters: 'HQ',
		region: 'RG',
		store: 'ST',
		franchisee: 'FR'
	};
	const prefix = prefixMap[type] || 'ORG';
	const timestamp = Date.now().toString(36).toUpperCase().slice(-6);
	return parentCode ? `${parentCode}-${prefix}${timestamp}` : `${prefix}${timestamp}`;
}
