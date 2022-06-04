import sha256 from 'sha256'

export default async function ({ sequelize }) {
    try {
        const user = await sequelize.models.User.findOne()
        const message = await sequelize.models.Message.findOne()
        
        !user && await sequelize.models.User.bulkCreate([
            {
                username: 'ali',
                password: sha256('olma'),
                user_img: 'ali.jpg',
            },
            {
                username: 'nosir',
                password: sha256('olma'),
                user_img: 'nosir.jpg',
            },
            {
                username: 'alisherjon',
                password: sha256('olma'),
                user_img: 'alisherjon.jpg',
            }
        ])

        !message && await sequelize.models.Message.bulkCreate([
            {
                message_body: 'Salom',
                message_type: 'plain/text',
                message_from: 1,
                message_to: 2,
            },
            {
                message_body: 'Salom, ali qalesan',
                message_type: 'plain/text',
                message_from: 2,
                message_to: 1,
            },
            {
                message_body: 'Yaxshi rahmat',
                message_type: 'plain/text',
                message_from: 1,
                message_to: 2,
            },
            {
                message_body: '36069picture1.jpg',
                message_type: 'image/jpg',
                message_from: 2,
                message_to: 3,
            },
            {
                message_body: 'Wow, to\'larni rasmimi?',
                message_type: 'plain/text',
                message_from: 3,
                message_to: 2,
            },
            {
                message_body: 'Ha. bir toqqa bormaymizmi?',
                message_type: 'plain/text',
                message_from: 2,
                message_to: 3,
            },
            {
                message_body: 'Ketdik.',
                message_type: 'plain/text',
                message_from: 3,
                message_to: 2,
            },
            {
                message_body: 'kalyan.mp4',
                message_type: 'video/mp4',
                message_from: 1,
                message_to: 3,
            },
            {
                message_body: 'ooom nice!',
                message_type: 'plain/text',
                message_from: 3,
                message_to: 1,
            },
        ])
    } catch (error) {
        console.log('error name: ', error.name)
        console.log('error message: ', error.message)
    }
}