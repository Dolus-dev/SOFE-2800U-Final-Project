import { HydratedDocument, Model, Schema, Types, model } from "mongoose";

export interface IUserSettings {}

export interface IUser {
	_id: Types.ObjectId;
	_version: number;
	UUID: string;
	fName: string;
	lName: string;
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
		UUID: { type: String, required: true, unique: true, index: true },
		fName: { type: String, required: true },
		lName: { type: String, required: true },
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
	name: string;
	description?: string;
	dueDate?: Date;
	priority?: "Low" | "Medium" | "High";
	completed: boolean;
}

export interface ITaskCategory {
	kind: "Category";
	categoryName: string;
	Tasks: ITask[];
}

export interface ITasks {
	_id: Types.ObjectId;
	OwnerUUID: string;
	categoryName: string;
	Tasks: ITaskCategory[] | ITask[];
	createdAt: Date;
	updatedAt: Date;
}

export type TasksDocument = HydratedDocument<ITasks>;

export interface TasksModel extends Model<ITasks> {
	findByOwnerUUID(OwnerUUID: string): Promise<TasksDocument[]>;
}

const taskSubSchema = new Schema<ITask>(
	{
		name: { type: String, required: true },
		description: { type: String, required: false },
		dueDate: { type: Date, required: false },
		priority: {
			type: String,
			enum: ["Low", "Medium", "High"],
			required: false,
		},
		completed: { type: Boolean, required: true, default: false },
	},
	{ _id: false }
);

const taskItemSchema = new Schema(
	{
		kind: { type: String, required: true, enum: ["Task", "Category"] },
		// fields for standalone task
		name: { type: String },
		description: { type: String },
		dueDate: { type: Date },
		priority: { type: String, enum: ["Low", "Medium", "High"] },
		completed: { type: Boolean },
		// fields for category
		categoryName: { type: String },
		categoryDescription: {type: String},
		Tasks: { type: [taskSubSchema], default: undefined },
	},
	{ _id: false }
);

taskItemSchema.path("kind").validate(function (value: string) {
	if (value === "Task") {
		return !!(this.name && typeof this.completed === "boolean");
	}
	if (value === "Category") {
		return !!(this.categoryName && Array.isArray(this.Tasks));
	}
	return false;
}, "Invalid task item: must be either a 'task' (name + completed) or a 'category' (categoryName + Tasks array).");

const taskSchema = new Schema<ITasks, TasksModel>(
	{
		_id: { type: Schema.Types.ObjectId, auto: true },
		OwnerUUID: { type: String, required: true, index: true },
		Tasks: { type: [taskItemSchema], default: [] },
	},
	{
		timestamps: true,
		statics: {
			async findByOwnerUUID(OwnerUUID: string): Promise<TasksDocument[]> {
				const doc = await this.find({ OwnerUUID: OwnerUUID });

				if (!doc) {
					throw new Error("Could not find Tasks");
				}
				return doc;
			},
		},
	}
);

export const Task = model("Tasks", taskSchema);
