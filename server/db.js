const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
 'QA',
 'kevinvar',
 '',
  {
    dialect: 'mysql',
    logging: false
  }
);

const Questions = sequelize.define('Questions', {
    ProductId: { type: DataTypes.INTEGER, index: true, allowNull: false},
    body: {type: DataTypes.STRING(1000), allowNull: false},
    asker_name: {type: DataTypes.STRING(60), allowNull: false},
    asker_email: {type: DataTypes.STRING(60), allowNull: false},
    reported: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    helpful: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0}
  },
  {
    indexes:[{unique: false, fields:['ProductId']}]
  }
);

const Answers = sequelize.define('Answers', {
  body: {type: DataTypes.STRING(1000), allowNull: false},
  answerer_name: {type: DataTypes.STRING(60), allowNull: false},
  answerer_email: {type: DataTypes.STRING(60), allowNull: false},
  reported: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
  helpful: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
});

const Photos = sequelize.define('Photos', {
  url: {type: DataTypes.STRING(), allowNull: false},
});

Questions.hasMany(Answers);
Answers.belongsTo(Questions);
Answers.hasMany(Photos);
Photos.belongsTo(Answers);

Questions.sync();
Answers.sync();
Photos.sync();

module.exports.Questions = Questions;
module.exports.Answers = Answers;
module.exports.Photos = Photos;
module.exports.sequelize = sequelize;

sequelize.authenticate().then(() => {
  //console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});
