import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/db";
import { SessionStatus } from "../types";

export class Session extends Model<
  InferAttributes<Session>,
  InferCreationAttributes<Session>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare topicId: number;
  declare totalQuestions: CreationOptional<number>;
  declare answered: CreationOptional<number>;
  declare avgScore: CreationOptional<number | null>;
  declare status: CreationOptional<SessionStatus>;
  declare readonly startedAt: CreationOptional<Date>;
  declare endedAt: CreationOptional<Date | null>;
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    topicId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "topics", key: "id" },
    },
    totalQuestions: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    answered: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    avgScore: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM("in_progress", "completed", "abandoned"),
      defaultValue: "in_progress",
    },
    startedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    endedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "sessions",
    timestamps: false,
  }
);
