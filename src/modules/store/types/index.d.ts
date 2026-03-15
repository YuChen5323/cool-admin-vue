declare namespace Store {
	interface Entity {
		id?: number;
		name?: string;
		code?: string;
		type?: number;
		parentId?: number;
		parentName?: string;
		manager?: string;
		phone?: string;
		address?: string;
		status?: number;
		orderNum?: number;
		remark?: string;
		createTime?: string;
		updateTime?: string;
		children?: Entity[];
	}

	interface RoleTemplate {
		id?: number;
		name?: string;
		label?: string;
		type?: number;
		applyStoreType?: number;
		dataScope?: number;
		remark?: string;
		menuIdList?: number[];
		departmentIdList?: number[];
		relevance?: number;
		createTime?: string;
		updateTime?: string;
	}

	interface User {
		id?: number;
		username?: string;
		name?: string;
		nickName?: string;
		headImg?: string;
		phone?: string;
		email?: string;
		departmentId?: number;
		departmentName?: string;
		roleIdList?: number[];
		roleName?: string;
		status?: number;
		remark?: string;
		createTime?: string;
		updateTime?: string;
	}
}

interface Menu {
	List: Menu.Item[];
}

declare namespace Menu {
	interface Item {
		id?: number;
		name?: string;
		path?: string;
		type?: number;
		parentId?: number;
		router?: string;
		viewPath?: string;
		icon?: string;
		orderNum?: number;
		isShow?: boolean;
		keepAlive?: number;
		perms?: string[];
		meta?: {
			label?: string;
			keepAlive?: number;
			[key: string]: any;
		};
		children?: Item[];
		[key: string]: any;
	}
}
