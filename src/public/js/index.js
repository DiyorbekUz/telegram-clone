async function getUsers() {
    const users = await request('/users')
    renderUsers(users)
}

async function getMessages(userId) {
    const messages = await request('/messages?userId=' + userId)
    renderMessages(messages, userId)
}

async function renderMessages(messages, hisId) {
    for (let message of messages) {
        const isHisMessage = message.message_from.user_id == hisId

        const img = '/getFile/' + message.message_from.user_img + '/' + token
        const file = '/getFile/' + message.message_body + '/' + token
        const downloadLink = '/download/' + message.message_body + '/' + token
        const username = message.message_from.username

        const date = new Date(message.created_at)
        const hour = date.getHours().toString().padStart(2, 0)
        const minute = date.getMinutes().toString().padStart(2, 0)
        const time = hour + ':' + minute

        if (message.message_type === 'plain/text') {
            chatsMain.innerHTML += `
                <div class="msg-wrapper ${isHisMessage ? '' : 'msg-from'}">
                    <img src="${img}" alt="profile-picture">
                    <div class="msg-text">
                        <p class="msg-author">${username}</p>
                        <p class="msg">${message.message_body}</p>
                        <p class="time">${time}</p>
                    </div>
                </div>
            `
        } else {
            uploadedFiles.innerHTML += `
                <li class="uploaded-file-item">
                    <a target="__blank" href="${file}">
                        <img src="./img/file.png" alt="file" width="30px">
                        <p>${message.message_body}</p>
                    </a>
                </li>
            `


            chatsMain.innerHTML += `
                <div class="msg-wrapper ${isHisMessage ? '' : 'msg-from'}">
                    <img src="${img}" alt="profile-picture">
                    <div class="msg-text">
                        <p class="msg-author">${username}</p>
                        <object paused data="${file}" type="${message.message_type}" class="msg object-class"></object>
                        <a href="${downloadLink}">
                            <img src="./img/download.png" width="25px">
                        </a>
                        <p class="time">${time}</p>
                    </div>
                </div>
            `
        }
    }
}

async function renderUsers(users) {
    for (let user of users) {
        const userImg = new String(`/getFile/${user.user_img}/${token}`)
        
        chatsList.innerHTML += `
            <li class="chats-item"
                onclick="(async function () {
                    await setChat('${userImg}', '${user.username}')

                    chatsMain.innerHTML = null
                    uploadedFiles.innerHTML = null
                    await getMessages(${user.user_id})
                })()"
            >
                <img src="${userImg}" alt="profile-picture">
                <p>${user.username} <span class=" ${user.socket_id ? 'online-indicator' : ''}"></span></p>
            </li>
        `
    }
}

async function renderAvatarData() {
    profileAvatar.src = '/getPhoto/' + token
    let response = await request('/getUsername/' + token)
    profileUsername.textContent = response.username

}

function setChat(img, username) {
    chatPhoto.src = img
    chatUsername.textContent = username
}

logOut.onclick = () => {
    window.localStorage.clear()
    window.location = '/login'
}

renderAvatarData()
getUsers()