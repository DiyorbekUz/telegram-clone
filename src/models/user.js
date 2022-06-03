import { Model, DataTypes } from 'sequelize'

export default async ({ sequelize }) => {
    class User extends Model { }
    
    User.init({
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        user_img: {
            type: DataTypes.STRING,
        },

        socket_id: {
            type: DataTypes.STRING
        }

    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        underscored: true
    })
}

