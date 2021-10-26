const users = document.getElementById('users')
const button = document.getElementById('fetch')

button.addEventListener('click', fetchUsers)

async function fetchUsers() {
    const response = await fetch('/users')
    const { data } = await response.json()    
    const userList = document.createElement('ul')

    data.map(user => {
        const userItem = document.createElement('li')
        userItem.innerText = user.firstName + ' ' + user.lastName
        userList.append(userItem)
    })

    // TODO: to improve a performance (reflow/repaint) 
    button.remove()
    users.append(userList)
}
