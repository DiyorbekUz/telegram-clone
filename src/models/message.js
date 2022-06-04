import { Model, DataTypes } from 'sequelize'

export default async ({ sequelize }) => {
    class Message extends Model {}

    await Message.init({
        message_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        message_body: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        message_type: {
            type: DataTypes.STRING,
            allowNull: false
        },

        message_read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Message',
        tableName: 'messages',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        underscored: true
    })

    await Message.belongsTo(sequelize.models.User, {
        foreignKey: 'message_to',
    })

    await Message.belongsTo(sequelize.models.User, {
        foreignKey: 'message_from',
    })
}

