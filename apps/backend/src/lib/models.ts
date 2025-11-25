import { HydratedDocument, Model, Schema, Types, model } from "mongoose";

export interface IUserSettings {}

export interface IUser {
	_id: Types.ObjectId;
	_version: number;
	UUID: string;
	firstName: string;
	lastName: string;
	username: string;
	email?: string;
	passwordHash: string;
	settings: IUserSettings;
	createdAt: Date;
	updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

export interface UserModel extends Model<IUser> {
	findOneByUUID(UUID: string): Promise<UserDocument>;
	findOneByEmail(email: string): Promise<UserDocument>;
	findOneByUsername(username: string): Promise<UserDocument>;
}

export interface UserSettingsModel extends Model<IUserSettings> {
	// Define user settings fields here in the future
}

const userSchema = new Schema<IUser, UserModel>(
	{
		_version: { type: Number, default: 1, select: false },
		UUID: {
			type: String,
			required: true,
			unique: true,
			index: true,
			default: () => crypto.randomUUID(),
		},
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: {
			type: String,
			required: false,
			index: true,
			unique: true,
			sparse: true,
		},
		username: { type: String, required: true, unique: true, index: true },
		passwordHash: { type: String, required: true },
	},
	{
		statics: {
			async findOneByUUID(UUID: string): Promise<UserDocument> {
				const doc = await this.findOne({ UUID: UUID });

				if (!doc) {
					throw new Error("User not found");
				}

				return doc;
			},
			async findOneByEmail(email: string): Promise<UserDocument> {
				const doc = await this.findOne({ email: email });

				if (!doc) {
					throw new Error("User not found");
				}

				return doc;
			},
			async findOneByUsername(username: string): Promise<UserDocument> {
				const doc = await this.findOne({ username: username });

				if (!doc) {
					throw new Error("User not found");
				}

				return doc;
			},
		},
		timestamps: true,
	}
);

export const User = model<IUser, UserModel>("User", userSchema);

export interface ITask {
	id: string;
	userId: string;

	//core fields
	title: string;
	description?: string;
	notes?: string;

	categoryId: string;
	projectId?: string;
	tags: string[];

	// Status Tracking

	status: "pending" | "in-progress" | "completed" | "archived";
	priority: "low" | "medium" | "high";

	// Dates
	dueDate?: Date;
	startDate?: Date;
	createdAt: Date;
	updatedAt: Date;
	completedAt?: Date;

	// Subtasks (embedded documents)

	subtasks: Array<{
		id: string;
		text: string;
		completed: boolean;
		order: number;
	}>;

	// Metadata

	estimatedDuration?: number;
	actualDuration?: number;
	reminderDate?: Date;
	recurringPattern?: {
		frequency: "daily" | "weekly" | "monthly";
		interval: number;
		endDate?: Date;
	};
}

export interface Category {
	id: string;
	userId: string;
	name: string;
	color: string;
	icon?: string;
	isDefault: boolean;
	createdAt: Date;
}

export interface TaskStats {
	userId: string;
	totalTasks: number;
	completedTasks: number;

	pendingTasks: number;
	inProgressTasks: number;
}

export interface TaskModel extends Model<ITask> {
	getStatsByUserId(userId: string): Promise<TaskStats>;
}

const subtaskSchema = new Schema({
	id: { type: String, required: true, default: () => crypto.randomUUID() },
	text: { type: String, required: true },
	completed: { type: Boolean, default: false },
	order: { type: Number, required: true },
});

const taskSchema = new Schema<ITask, TaskModel>(
	{
		id: { type: String, required: true, default: () => crypto.randomUUID() },
		userId: { type: String, required: true, index: true },
		title: { type: String, required: true },
		description: { type: String },
		categoryId: { type: String, required: true, index: true },

		status: {
			type: String,
			enum: ["pending", "in-progress", "completed"],
			default: "pending",
			index: true,
		},

		priority: {
			type: String,
			enum: ["low", "medium", "high", "urgent"],
			default: "medium",
			index: true,
		},

		dueDate: { type: Date, index: true },
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
		completedAt: { type: Date, index: true },
	},
	{
		timestamps: true,
	}
);

taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, priority: 1 });

const categorySchema = new Schema<Category>(
	{
		id: { type: String, required: true, default: () => crypto.randomUUID() },
		userId: { type: String, required: true, index: true },
		name: { type: String, required: true },
		color: { type: String, required: true },
		icon: { type: String },
		isDefault: { type: Boolean, default: false },
		createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

categorySchema.index({ userId: 1, name: 1 }, { unique: true });

export const Task = model<ITask>("Task", taskSchema);
export const Category = model<Category>("Category", categorySchema);

export interface IProject {
	id: string;
	userId: string;
	name: string;
	description?: string;
	color: string;
	isArchived: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
	{
		id: { type: String, required: true, default: () => crypto.randomUUID() },
		userId: { type: String, required: true, index: true },
		name: { type: String, required: true },
		description: { type: String },
		color: { type: String, required: true },
		isArchived: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

projectSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Project = model<IProject>("Project", projectSchema);

export interface IActivityLog {
	id: string;
	userId: string;
	taskId: string;
	action: "created" | "updated" | "completed" | "deleted" | "archived";
	details?: string;
	timestamp: Date;
}

const activityLogSchema = new Schema<IActivityLog>({
	id: { type: String, required: true, default: () => crypto.randomUUID() },
	userId: { type: String, required: true, index: true },
	taskId: { type: String, required: true },
	action: {
		type: String,
		enum: ["created", "updated", "completed", "deleted", "archived"],
		required: true,
	},
	details: { type: String },
	timestamp: { type: Date, default: Date.now, index: true },
});

activityLogSchema.index({ userId: 1, timestamp: -1 });

export const ActivityLog = model<IActivityLog>(
	"ActivityLog",
	activityLogSchema
);
