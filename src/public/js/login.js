form.onsubmit = async event => {
    event.preventDefault()

    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()

    if (!username) {
        return messageText.textContent = 'username is required!'
    }

    if (!password) {
        return messageText.textContent = 'password is required!'
    }
    
    let response = await request('/login', 'POST', {
        username,
        password
    })

    if(response.status === 200) {
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