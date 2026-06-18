// Central place to import models and define all associations.
// Import this file once in server.ts — order matters for FK constraints.

import { User } from "./User";
import { Topic } from "./Topic";
import { Question } from "./Question";
import { Session } from "./Session";
import { Answer } from "./Answer";

// ── User associations ────────────────────────────────────────────────────────
User.hasMany(Session, { foreignKey: "userId", as: "sessions" });
User.hasMany(Answer,  { foreignKey: "userId", as: "answers"  });

// ── Topic associations ───────────────────────────────────────────────────────
Topic.hasMany(Question, { foreignKey: "topicId", as: "questions" });
Topic.hasMany(Session,  { foreignKey: "topicId", as: "sessions"  });

// ── Question associations ────────────────────────────────────────────────────
Question.belongsTo(Topic, { foreignKey: "topicId", as: "topic" });
Question.hasMany(Answer,  { foreignKey: "questionId", as: "answers" });

// ── Session associations ─────────────────────────────────────────────────────
Session.belongsTo(User,  { foreignKey: "userId",  as: "user"  });
Session.belongsTo(Topic, { foreignKey: "topicId", as: "topic" });
Session.hasMany(Answer,  { foreignKey: "sessionId", as: "answers" });

// ── Answer associations ──────────────────────────────────────────────────────
Answer.belongsTo(Session,  { foreignKey: "sessionId",  as: "session"  });
Answer.belongsTo(Question, { foreignKey: "questionId", as: "question" });
Answer.belongsTo(User,     { foreignKey: "userId",     as: "user"     });

export { User, Topic, Question, Session, Answer };
