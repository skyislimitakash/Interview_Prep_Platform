import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/db";

export class Answer extends Model<
  InferAttributes<Answer>,
  InferCreationAttributes<Answer>
> {
  declare id: CreationOptional<number>;
  declare sessionId: number;
  declare questionId: number;
  declare userId: number;
  declare userAnswer: string;
  declare aiScore: CreationOptional<number | null>;
  declare aiFeedback: CreationOptional<string | null>;
  declare aiStrengths: CreationOptional<string | null>;
  declare aiImprovements: CreationOptional<string | null>;
  declare timeTakenSec: CreationOptional<number | null>;
  declare readonly answeredAt: CreationOptional<Date>;
}

Answer.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "sessions", key: "id" },
    },
    questionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "questions", key: "id" },
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    userAnswer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    aiScore: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
      defaultValue: null,
    },
    aiFeedback: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    aiStrengths: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    aiImprovements: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    timeTakenSec: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
    },
    answeredAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "answers",
    timestamps: false,
  }
);
