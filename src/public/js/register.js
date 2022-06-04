form.onsubmit = async event => {
    event.preventDefault()

    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()
    const file = uploadInput.files[0]

    if (!username) {
        return messageText.textContent = 'username is required!'
    }

    if (!password) {
        return messageText.textContent = 'password is required!'
    }

    if (!file) {
        return messageText.textContent = 'profile picture must be selected!'
    }

    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    formData.append('file', file)

    let response = await request('/register', 'POST', formData)

    if (response.status === 200) {
        window.localStorage.setItem('token', response.token)
        window.location = '/'
    } else {
        messageText.textContent = response.message
    }
}

showButton.onclick = () => {
    if (passwordInput.type === 'text') {
        passwordInput.type = 'password'
    } else if (passwordInput.type === 'password') {
        passwordInput.type = 'text'
    }
}