module.exports = (sequelize, DataTypes) => {
  const FormQuestion = sequelize.define(
    'FormQuestion',
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      responseType: {
        type: DataTypes.ENUM('MULTIPLE_CHOICE', 'SHORT_ANSWER', 'LONG_ANSWER'),
        allowNull: false,
      },
      options: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    },
  );

  FormQuestion.associate = (models) => {
    models.FormQuestion.hasMany(models.FormAnswer, {
      as: 'answers',
      foreignKey: 'formQuestionId',
    });
    models.FormQuestion.belongsTo(models.Form, {
      as: 'form',
      foreignKey: 'formId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return FormQuestion;
};