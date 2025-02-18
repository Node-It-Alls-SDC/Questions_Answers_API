const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
 'QA',
 'kevinvar',
 '',
  {
    dialect: 'mysql',
    // logging: false,
    define: {
      underscored: true,
    }
  }
);

const questions = sequelize.define('Questions', {
    question_id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    product_id: { type: DataTypes.INTEGER, index: true, allowNull: false},
    question_body: {type: DataTypes.STRING(1000), allowNull: false},
    asker_name: {type: DataTypes.STRING(60), allowNull: false},
    asker_email: {type: DataTypes.STRING(60), allowNull: false, validate: {isEmail:true}},
    reported: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    question_helpfulness: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0}
  },
  {
    updatedAt: false,
    createdAt: 'question_date',
    cache: true,
    cacheExpiration: 60000,
    indexes:[{unique:false, fields:['product_id'], where:{reported:false}}]
  }
);

const answers = sequelize.define('Answers', {
    answer_id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    body: {type: DataTypes.STRING(1000), allowNull: false},
    answerer_name: {type: DataTypes.STRING(60), allowNull: false},
    answerer_email: {type: DataTypes.STRING(60), allowNull: false, validate: {isEmail:true}},
    reported: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    helpfulness: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
  },
  {
    cache: true,
    cacheExpiration: 60000,
    updatedAt:  false,
    createdAt: 'date'
  }
);

const photos = sequelize.define('Photos', {
  url: {type: DataTypes.STRING(), allowNull: false},
  },
  {
    cache: true,
    cacheExpiration: 60000,
    timestamps: false
  }
);

questions.hasMany(answers, {foreignKey: 'question_id', as: 'answers'});
answers.belongsTo(questions, {foreignKey: 'question_id'});
answers.hasMany(photos, {foreignKey: 'answer_id', as:'photos'});
photos.belongsTo(answers, {foreignKey: 'answer_id'});

questions.sync();
answers.sync();
photos.sync();

module.exports.Questions = questions;
module.exports.Answers = answers;
module.exports.Photos = photos;

sequelize.authenticate().then(() => {
  //console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});
