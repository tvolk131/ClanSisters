const clan = require('./clan');
const {Sequelize, db} = require('../connection');

const ForumModel = db.define('forum', {
  name: {
    type: Sequelize.STRING(64),
    allowNull: false,
    unique: true
  },
});

const Forum = {model: ForumModel};

Forum.findAll = (query = {}) => {
  return ForumModel.findAll({where: query});
};

const MAX_FORUMS_PER_CLAN = 5;

/**
 * Forum crud methods.
 */
Forum.create = ({name, clanId}) => {
  return Forum.model.find({where: {name}})
    .then((clan) => {
      if (clan) {
        throw new Error('Clan already exists');
      }
      return Forum.model.findAll({where: {clanId}});
    })
    .then((clans) => {
      if (clans.length + 1 > MAX_FORUMS_PER_CLAN) {
        throw new Error(`A clan can only have ${MAX_FORUMS_PER_CLAN} forums!`);
      }
      return Forum.model.create({name, clanId});
    });
};

Forum.read = Forum.find = (query) => {
  return ForumModel.findOne({where: query});
};

Forum.update = (query, values) => {
  return ForumModel.update(values, {where: query});
};

Forum.delete = (query) => {
  return ForumModel.destroy({where: query});
};

module.exports = Forum;