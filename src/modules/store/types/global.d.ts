// 扩展全局 Service 类型
export {};

declare global {
	interface Service {
		store?: {
			org: {
				delete(data?: { ids: number[] }): Promise<any>;
				update(data?: any): Promise<any>;
				list(): Promise<any[]>;
				page(data?: any): Promise<any>;
				add(data?: any): Promise<any>;
				info(data?: { id: number }): Promise<any>;
				permission: Record<string, string>;
				_permission: Record<string, boolean>;
				request: any;
			};
			user: {
				delete(data?: { ids: number[] }): Promise<any>;
				update(data?: any): Promise<any>;
				list(): Promise<any[]>;
				page(data?: any): Promise<any>;
				add(data?: any): Promise<any>;
				info(data?: { id: number }): Promise<any>;
				transfer(data?: { userIds: number[]; targetOrgId: number; targetRoleIds?: number[] }): Promise<any>;
				permission: Record<string, string>;
				_permission: Record<string, boolean>;
				request: any;
			};
			roleTemplate: {
				delete(data?: { ids: number[] }): Promise<any>;
				update(data?: any): Promise<any>;
				list(params?: any): Promise<any[]>;
				page(data?: any): Promise<any>;
				add(data?: any): Promise<any>;
				info(data?: { id: number }): Promise<any>;
				permission: Record<string, string>;
				_permission: Record<string, boolean>;
				request: any;
			};
		};
	}
}
