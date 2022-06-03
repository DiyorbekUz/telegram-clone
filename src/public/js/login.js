form.onsubmit = async event => {
    event.preventDefault()

    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()

    if (!username || !password) return
    
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