// 组织类型
export type StoreOrgType = 'headquarters' | 'region' | 'store' | 'franchisee';

// 数据权限范围
export type StoreDataScope = 'all' | 'children' | 'current' | 'self';

// 门店组织实体
export interface StoreOrgEntity {
	// 组织ID
	id: number;
	// 父组织ID
	parentId: number;
	// 组织名称
	name: string;
	// 组织编码
	code: string;
	// 组织类型
	type: StoreOrgType;
	// 组织层级
	level: number;
	// 组织路径
	path: string;
	// 负责人姓名
	managerName?: string;
	// 联系电话
	phone?: string;
	// 地址
	address?: string;
	// 状态 1:启用 0:禁用
	status: number;
	// 排序
	sort: number;
	// 备注
	remark?: string;
	// 创建时间
	createTime?: string;
	// 更新时间
	updateTime?: string;
	// 子组织
	children?: StoreOrgEntity[];
}

// 门店用户实体
export interface StoreUserEntity {
	// 用户ID
	id: number;
	// 用户名
	username: string;
	// 密码
	password?: string;
	// 姓名
	name: string;
	// 昵称
	nickName?: string;
	// 头像
	headImg?: string;
	// 手机号
	phone?: string;
	// 邮箱
	email?: string;
	// 所属组织ID
	orgId: number;
	// 所属组织名称
	orgName: string;
	// 组织类型
	orgType: StoreOrgType;
	// 角色ID列表
	roleIds: number[];
	// 角色名称列表（逗号分隔）
	roleNames?: string;
	// 状态 1:启用 0:禁用
	status: number;
	// 备注
	remark?: string;
	// 最后登录时间
	lastLoginTime?: string;
	// 创建时间
	createTime?: string;
	// 更新时间
	updateTime?: string;
}

// 角色权限模板实体
export interface StoreRoleTemplateEntity {
	// 模板ID
	id: number;
	// 模板名称
	name: string;
	// 适用组织类型
	orgType: StoreOrgType;
	// 数据权限范围
	dataScope: StoreDataScope;
	// 菜单权限ID列表
	menuIds: number[];
	// 描述
	description?: string;
	// 状态 1:启用 0:禁用
	status: number;
	// 排序
	sort: number;
	// 创建时间
	createTime?: string;
	// 更新时间
	updateTime?: string;
}
