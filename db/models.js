import { Schema, model } from 'mongoose'

const studentSchema = new Schema(
	{
		matricNo: { type: String, required: true, unique: true },
		fullName: String,
		password: String,
		phoneNumber: String,
		departmentName: String,
		subDepartmentName: String,
		semester: Number
	},
	{
		toJSON: {
			transform: function (doc, ret) {
				delete ret._id
				delete ret.__v
                delete ret.password
			}
		}
	}
)

export const StudentModel = model('Student', studentSchema)