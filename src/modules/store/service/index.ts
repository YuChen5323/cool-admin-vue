// 门店组织服务
class StoreOrgService {
	namespace = '/admin/store/org';

	// 模拟数据
	private mockData = [
		{
			id: 1,
			parentId: 0,
			name: '总部',
			code: 'HQ001',
			type: 'headquarters',
			level: 1,
			path: '1',
			managerName: '张三',
			phone: '13800138000',
			address: '北京市朝阳区总部大厦',
			status: 1,
			sort: 0,
			createTime: '2024-01-01 00:00:00',
			updateTime: '2024-01-01 00:00:00'
		},
		{
			id: 2,
			parentId: 1,
			name: '华北区域',
			code: 'HQ001-RG001',
			type: 'region',
			level: 2,
			path: '1,2',
			managerName: '李四',
			phone: '13800138001',
			address: '北京市朝阳区',
			status: 1,
			sort: 1,
			createTime: '2024-01-01 00:00:00',
			updateTime: '2024-01-01 00:00:00'
		},
		{
			id: 3,
			parentId: 1,
			name: '华南区域',
			code: 'HQ001-RG002',
			type: 'region',
			level: 2,
			path: '1,3',
			managerName: '王五',
			phone: '13800138002',
			address: '广州市天河区',
			status: 1,
			sort: 2,
			createTime: '2024-01-01 00:00:00',
			updateTime: '2024-01-01 00:00:00'
		},
		{
			id: 4,
			parentId: 2,
			name: '北京朝阳门店',
			code: 'HQ001-RG001-ST001',
			type: 'store',
			level: 3,
			path: '1,2,4',
			managerName: '赵六',
			phone: '13800138003',
			address: '北京市朝阳区望京',
			status: 1,
			sort: 1,
			createTime: '2024-01-01 00:00:00',
			updateTime: '2024-01-01 00:00:00'
		},
		{
			id: 5,
			parentId: 3,
			name: '广州天河加盟商',
			code: 'HQ001-RG002-FR001',
			type: 'franchisee',
			level: 3,
			path: '1,3,5',
			managerName: '孙七',
			phone: '13800138004',
			address: '广州市天河区珠江新城',
			status: 1,
			sort: 1,
			createTime: '2024-01-01 00:00:00',
			updateTime: '2024-01-01 00:00:00'
		}
	];

	// 列表查询
	async list(): Promise<any[]> {
		return this.mockData;
	}

	// 分页查询
	async page(params: any): Promise<any> {
		const { parentId, page = 1, size = 20 } = params || {};
		let list = this.mockData;

		if (parentId !== undefined) {
			list = list.filter((item) => item.parentId === parentId);
		}

		return {
			list: list.slice((page - 1) * size, page * size),
			pagination: {
				page,
				size,
				total: list.length
			}
		};
	}

	// 新增
	async add(data: any): Promise<any> {
		const newItem = {
			...data,
			id: Date.now(),
			createTime: new Date().toISOString(),
			updateTime: new Date().toISOString()
		};
		this.mockData.push(newItem);
		return newItem;
	}

	// 修改
	async update(data: any): Promise<any> {
		const index = this.mockData.findIndex((item) => item.id === data.id);
		if (index > -1) {
			this.mockData[index] = {
				...this.mockData[index],
				...data,
				updateTime: new Date().toISOString()
			};
		}
		return data;
	}

	// 删除
	async delete(data: { ids: number[] }): Promise<any> {
		this.mockData = this.mockData.filter((item) => !data.ids.includes(item.id));
		return { success: true };
	}

	// 权限标识
	permission = {
		delete: 'store:org:delete',
		update: 'store:org:update',
		list: 'store:org:list',
		page: 'store:org:page',
		add: 'store:org:add',
		info: 'store:org:info'
	};

	_permission = {
		delete: true,
		update: true,
		list: true,
		page: true,
		add: true,
		info: true
	};

	request = async (options: any) => {
		return { data: {} };
	};
}

// 门店用户服务
class StoreUserService {
	namespace = '/admin/store/user';

	private mockData = [
		{
			id: 1,
			username: 'admin',
			name: '管理员',
			nickName: '系统管理员',
			phone: '13800138000',
			email: 'admin@example.com',
			orgId: 1,
			orgName: '总部',
			orgType: 'headquarters',
			roleIds: [1],
			roleNames: '超级管理员',
			status: 1,
			lastLoginTime: '2024-03-15 10:00:00',
			createTime: '2024-01-01 00:00:00',
			updateTime: '2024-03-15 10:00:00'
		},
		{
			id: 2,
			username: 'region_manager',
			name: '区域经理',
			nickName: '华北经理',
			phone: '13800138001',
			email: 'region@example.com',
			orgId: 2,
			orgName: '华北区域',
			orgType: 'region',
			roleIds: [2],
			roleNames: '区域经理',
			status: 1,
			lastLoginTime: '2024-03-14 15:30:00',
			createTime: '2024-01-01 00:00:00',
			updateTime: '2024-03-14 15:30:00'
		},
		{
			id: 3,
			username: 'store_manager',
			name: '门店店长',
			nickName: '朝阳店长',
			phone: '13800138002',
			email: 'store@example.com',
			orgId: 4,
			orgName: '北京朝阳门店',
			orgType: 'store',
			roleIds: [3],
			roleNames: '门店店长',
			status: 1,
			lastLoginTime: '2024-03-13 09:00:00',
			createTime: '2024-01-01 00:00:00',
			updateTime: '2024-03-13 09:00:00'
		}
	];

	async list(): Promise<any[]> {
		return this.mockData;
	}

	async page(params: any): Promise<any> {
		const { orgId, page = 1, size = 20 } = params || {};
		let list = this.mockData;

		if (orgId !== undefined) {
			list = list.filter((item) => item.orgId === orgId);
		}

		return {
			list: list.slice((page - 1) * size, page * size),
			pagination: {
				page,
				size,
				total: list.length
			}
		};
	}

	async add(data: any): Promise<any> {
		const newItem = {
			...data,
			id: Date.now(),
			createTime: new Date().toISOString(),
			updateTime: new Date().toISOString()
		};
		this.mockData.push(newItem);
		return newItem;
	}

	async update(data: any): Promise<any> {
		const index = this.mockData.findIndex((item) => item.id === data.id);
		if (index > -1) {
			this.mockData[index] = {
				...this.mockData[index],
				...data,
				updateTime: new Date().toISOString()
			};
		}
		return data;
	}

	async delete(data: { ids: number[] }): Promise<any> {
		this.mockData = this.mockData.filter((item) => !data.ids.includes(item.id));
		return { success: true };
	}

	async transfer(data: { userIds: number[]; targetOrgId: number; targetRoleIds?: number[] }): Promise<any> {
		data.userIds.forEach((userId) => {
			const index = this.mockData.findIndex((item) => item.id === userId);
			if (index > -1) {
				this.mockData[index].orgId = data.targetOrgId;
				if (data.targetRoleIds) {
					this.mockData[index].roleIds = data.targetRoleIds;
				}
				this.mockData[index].updateTime = new Date().toISOString();
			}
		});
		return { success: true };
	}

	permission = {
		delete: 'store:user:delete',
		update: 'store:user:update',
		list: 'store:user:list',
		page: 'store:user:page',
		add: 'store:user:add',
		info: 'store:user:info',
		transfer: 'store:user:transfer'
	};

	_permission = {
		delete: true,
		update: true,
		list: true,
		page: true,
		add: true,
		info: true,
		transfer: true
	};

	request = async (options: any) => {
		return { data: {} };
	};
}

// 角色权限模板服务
class StoreRoleTemplateService {
	namespace = '/admin/store/roleTemplate';

	private mockData = [
		{
			id: 1,
			name: '超级管理员',
			code: 'super_admin',
			orgType: 'headquarters',
			menuIdList: [1, 2, 3, 4, 5],
			menuNameList: '系统管理,组织管理,用户管理,角色管理,菜单管理',
			perms: ['*'],
			dataScope: 'all',
			status: 1,
			isSystem: 1,
			createTime: '2024-01-01 00:00:00',
			updateTime: '2024-01-01 00:00:00',
			remark: '总部超级管理员，拥有所有权限'
		},
		{
			id: 2,
			name: '区域经理',
			code: 'region_manager',
			orgType: 'region',
			menuIdList: [2, 3, 4],
			menuNameList: '组织管理,用户管理,角色管理',
			perms: ['store:org:list', 'store:user:list', 'store:user:update'],
			dataScope: 'children',
			status: 1,
			isSystem: 1,
			createTime: '2024-01-01 00:00:00',
			updateTime: '2024-01-01 00:00:00',
			remark: '区域经理，可管理本区域及下级组织'
		},
		{
			id: 3,
			name: '门店店长',
			code: 'store_manager',
			orgType: 'store',
			menuIdList: [3],
			menuNameList: '用户管理',
			perms: ['store:user:list', 'store:user:add'],
			dataScope: 'current',
			status: 1,
			isSystem: 1,
			createTime: '2024-01-01 00:00:00',
			updateTime: '2024-01-01 00:00:00',
			remark: '门店店长，仅可管理本门店'
		}
	];

	async list(params?: any): Promise<any[]> {
		let list = this.mockData;
		if (params?.orgId) {
			list = list.filter((item) => item.orgType === params.orgType || !params.orgType);
		}
		if (params?.status !== undefined) {
			list = list.filter((item) => item.status === params.status);
		}
		return list;
	}

	async page(params: any): Promise<any> {
		const { page = 1, size = 20 } = params || {};
		return {
			list: this.mockData.slice((page - 1) * size, page * size),
			pagination: {
				page,
				size,
				total: this.mockData.length
			}
		};
	}

	async add(data: any): Promise<any> {
		const newItem = {
			...data,
			id: Date.now(),
			createTime: new Date().toISOString(),
			updateTime: new Date().toISOString()
		};
		this.mockData.push(newItem);
		return newItem;
	}

	async update(data: any): Promise<any> {
		const index = this.mockData.findIndex((item) => item.id === data.id);
		if (index > -1) {
			this.mockData[index] = {
				...this.mockData[index],
				...data,
				updateTime: new Date().toISOString()
			};
		}
		return data;
	}

	async delete(data: { ids: number[] }): Promise<any> {
		this.mockData = this.mockData.filter((item) => !data.ids.includes(item.id));
		return { success: true };
	}

	permission = {
		delete: 'store:roleTemplate:delete',
		update: 'store:roleTemplate:update',
		list: 'store:roleTemplate:list',
		page: 'store:roleTemplate:page',
		add: 'store:roleTemplate:add',
		info: 'store:roleTemplate:info'
	};

	_permission = {
		delete: true,
		update: true,
		list: true,
		page: true,
		add: true,
		info: true
	};

	request = async (options: any) => {
		return { data: {} };
	};
}

export const storeOrgService = new StoreOrgService();
export const storeUserService = new StoreUserService();
export const storeRoleTemplateService = new StoreRoleTemplateService();
