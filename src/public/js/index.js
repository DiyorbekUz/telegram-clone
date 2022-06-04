const socket = io({
    auth: {
        token: window.localStorage.getItem('token')
    }
})

const lastSelectedUserId = () => window.localStorage.getItem('lastSelectedUserId')
let selected

async function getUsers() {
    const users = await request('/users')
    renderUsers(users)
}

async function getMessages(userId) {
    const messages = await request('/messages?userId=' + userId)
    renderMessages(messages, userId)
}

async function postMessage(messageBody, type) {
    const formData = new FormData()
    formData.append('messageTo', lastSelectedUserId())
    formData.append('messageBody', messageBody || 'hello world')
    if (type === 'file') {
        formData.append('messageBody', 'hello world')
        formData.append('file', messageBody)
    }
    
    const response = await request('/messages', 'POST', formData)
    if (response.status === 200) renderMessages([response.data])
    else alert(response.message)
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

        const div = document.createElement('div')
        div.classList.add('msg-wrapper')
        !isHisMessage && div.classList.add('msg-from')

        if (message.message_type === 'plain/text') {
            div.innerHTML += `
                <img src="${img}" alt="profile-picture">
                <div class="msg-text">
                    <p class="msg-author">${username}</p>
                    <p class="msg">${message.message_body}</p>
                    <p class="time">${time}</p>
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

            div.innerHTML += `
                <img src="${img}" alt="profile-picture">
                <div class="msg-text">
                    <p class="msg-author">${username}</p>
                    <object stopped data="${file}" type="${message.message_type}" class="msg object-class"></object>
                    <a href="${downloadLink}">
                        <img src="./img/download.png" width="25px">
                    </a>
                    <p class="time">${time}</p>
                </div>
            `
        }

        chatsMain.append(div);
    }
}

async function renderUsers(users) {
    for (let user of users) {
        const userImg = new String(`/getFile/${user.user_img}/${token}`)
        
        chatsList.innerHTML += `
            <li class="chats-item"
                onclick="(async function () {
                    window.localStorage.setItem('lastSelectedUserId', ${user.user_id})
                    selected = true

                    chatPhoto.src = '${userImg}'
                    chatUsername.textContent = '${user.username}'

                    setRead(${user.user_id})
                    
                    chatsMain.innerHTML = null
                    uploadedFiles.innerHTML = null
                    await getMessages(${user.user_id})
                })()"
            >
                <img src="${userImg}" alt="profile-picture">
                <p>
                    ${user.username}
                    <span data-actionid="${user.user_id}" id="personAction"></span> 
                    <span data-id="${user.user_id}" class="indicator ${user.socket_id ? 'online-indicator' : ''}">
                        ${user.unreadMessages > 0 ? user.unreadMessages : ''}
                    </span>
                </p>
            </li>
        `
    }
}

function setRead(userId) {
    socket.emit('messages read', { from: userId })
    const span = document.querySelector(`[data-id='${userId}']`)
    span.textContent = null
}

async function renderAvatarData() {
    profileAvatar.src = '/getPhoto/' + token
    let response = await request('/getUsername/' + token)
    profileUsername.textContent = response.username

}

logOut.onclick = () => {
    window.localStorage.clear()
    window.location = '/login'
}

form.onsubmit = async event => {
    event.preventDefault()

    if (textInput.value.trim() && selected) {
        await postMessage(textInput.value, 'text')
        form.reset()
    }
}

uploads.onchange = async event => {
    const file = uploads.files[0]

    if (file.size > 50 * 1024 * 1024) {
        return alert('File size must not be larger than 50MB!')
    }

    if (selected) {
        socket.emit('start sending file', { to: lastSelectedUserId() })
        await postMessage(uploads.files[0], 'file')
        form.reset()
    }
}

let timeOutId
textInput.onkeyup = () => {
    if (!selected || !lastSelectedUserId()) {
        textInput.value = ''
        return alert('select a chat first!')
    }

    if (timeOutId) return

    socket.emit('start typing', { to: lastSelectedUserId() })

    timeOutId = setTimeout(() => {
        clearTimeout(timeOutId)
        timeOutId = undefined

        socket.emit('stop typing', { to: lastSelectedUserId() })
    }, 2000)
}

socket.on('exit', () => {
    window.localStorage.clear()
    window.location = '/login'
})

socket.on('user offline', ({ userId }) => {
    const span = document.querySelector(`[data-id='${userId}']`)
    span.classList.remove('online-indicator')
})

socket.on('user online', ({ userId }) => {
    const span = document.querySelector(`[data-id='${userId}']`)
    span.classList.add('online-indicator')
})

socket.on('new message', ({ message, unreadMessages }) => {
    if (lastSelectedUserId() == message.message_from.user_id) {
        renderMessages([message], message.message_from.user_id)
    } else {
        const span = document.querySelector(`[data-id='${message.message_from.user_id}']`)
        span.textContent = unreadMessages
    }
})

socket.on('start typing', ({ from }) => {
    if (lastSelectedUserId() == from && selected) {
        chatUsernameAction.textContent = 'is typing...'
    } else {
        const span = document.querySelector(`[data-actionid='${from}']`)
        span.textContent = 'is typing...'
    }
})

socket.on('stop typing', ({ from }) => {
    if (lastSelectedUserId() == from && selected) {
        chatUsernameAction.textContent = ''
    } else {
        const span = document.querySelector(`[data-actionid='${from}']`)
        span.textContent = ''
    }
})

socket.on('start sending file', ({ from }) => {
    if (lastSelectedUserId() == from && selected) {
        chatUsernameAction.textContent = 'is sending file...'
    } else {
        const span = document.querySelector(`[data-actionid='${from}']`)
        span.textContent = 'is sending file...'
    }
})

socket.on('stop sending file', ({ from }) => {
    if (lastSelectedUserId() == from && selected) {
        chatUsernameAction.textContent = ''
    } else {
        const span = document.querySelector(`[data-actionid='${from}']`)
        span.textContent = ''
    }
})

renderAvatarData()
getUsers()