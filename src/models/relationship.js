import { Model, DataTypes } from 'sequelize'

export default async function ({ sequelize }) {
    console.log(sequelize.models)
    const Message = sequelize.models.Message
    const User = sequelize.models.User


    await Message.belongsTo(sequelize.models.User, {
        foreignKey: 'message_to',
    })

    await Message.belongsTo(sequelize.models.User, {
        foreignKey: 'message_from',
    })

}