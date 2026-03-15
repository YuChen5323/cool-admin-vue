// 门店组织实体
declare interface StoreOrgEntity {
	id: number;
	parentId: number;
	name: string;
	code: string;
	type: 'headquarters' | 'region' | 'store' | 'franchisee';
	level: number;
	path: string;
	managerId?: number;
	managerName?: string;
	phone?: string;
	address?: string;
	status: number;
	sort: number;
	createTime: string;
	updateTime: string;
	remark?: string;
	children?: StoreOrgEntity[];
}

// 门店用户实体
declare interface StoreUserEntity {
	id: number;
	username: string;
	name: string;
	nickName?: string;
	phone?: string;
	email?: string;
	headImg?: string;
	orgId: number;
	orgName: string;
	orgType: 'headquarters' | 'region' | 'store' | 'franchisee';
	roleIds: number[];
	roleNames: string;
	status: number;
	lastLoginTime?: string;
	createTime: string;
	updateTime: string;
	remark?: string;
}

// 角色权限模板实体
declare interface StoreRoleTemplateEntity {
	id: number;
	name: string;
	code: string;
	orgType: 'headquarters' | 'region' | 'store' | 'franchisee';
	menuIdList: number[];
	menuNameList: string[];
	perms: string[];
	dataScope: 'all' | 'current' | 'children' | 'self';
	status: number;
	isSystem: number;
	createTime: string;
	updateTime: string;
	remark?: string;
}

// 门店组织服务
declare interface StoreOrgService {
	delete(data?: { ids: number[] }): Promise<any>;
	update(data?: Partial<StoreOrgEntity>): Promise<any>;
	list(data?: any): Promise<StoreOrgEntity[]>;
	page(data?: any): Promise<{ list: StoreOrgEntity[]; pagination: any }>;
	add(data?: Partial<StoreOrgEntity>): Promise<any>;
	info(data?: { id: number }): Promise<StoreOrgEntity>;
	permission: {
		delete: string;
		update: string;
		list: string;
		page: string;
		add: string;
		info: string;
	};
	_permission: {
		delete: boolean;
		update: boolean;
		list: boolean;
		page: boolean;
		add: boolean;
		info: boolean;
	};
	request: any;
}

// 门店用户服务
declare interface StoreUserService {
	delete(data?: { ids: number[] }): Promise<any>;
	update(data?: Partial<StoreUserEntity>): Promise<any>;
	list(data?: any): Promise<StoreUserEntity[]>;
	page(data?: any): Promise<{ list: StoreUserEntity[]; pagination: any }>;
	add(data?: Partial<StoreUserEntity>): Promise<any>;
	info(data?: { id: number }): Promise<StoreUserEntity>;
	transfer(data?: { userIds: number[]; targetOrgId: number; targetRoleIds?: number[] }): Promise<any>;
	permission: {
		delete: string;
		update: string;
		list: string;
		page: string;
		add: string;
		info: string;
		transfer: string;
	};
	_permission: {
		delete: boolean;
		update: boolean;
		list: boolean;
		page: boolean;
		add: boolean;
		info: boolean;
		transfer: boolean;
	};
	request: any;
}

// 角色权限模板服务
declare interface StoreRoleTemplateService {
	delete(data?: { ids: number[] }): Promise<any>;
	update(data?: Partial<StoreRoleTemplateEntity>): Promise<any>;
	list(data?: any): Promise<StoreRoleTemplateEntity[]>;
	page(data?: any): Promise<{ list: StoreRoleTemplateEntity[]; pagination: any }>;
	add(data?: Partial<StoreRoleTemplateEntity>): Promise<any>;
	info(data?: { id: number }): Promise<StoreRoleTemplateEntity>;
	permission: {
		delete: string;
		update: string;
		list: string;
		page: string;
		add: string;
		info: string;
	};
	_permission: {
		delete: boolean;
		update: boolean;
		list: boolean;
		page: boolean;
		add: boolean;
		info: boolean;
	};
	request: any;
}

// 扩展 Service 类型
declare module '/@/cool' {
	interface Service {
		store: {
			org: StoreOrgService;
			user: StoreUserService;
			roleTemplate: StoreRoleTemplateService;
		};
	}
}
