const users = []

// addUser, removeUser, getUsers, getUsersInRoom

const addUser = ({id, username, room}) => {
    // Clean the Data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //Validate the Data
    if(!username || !room){
        return {
            error : "Username and Room Required"
        }
    }

    //Check for Existing User
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username ;
    })

    // Validate Username
    if(existingUser){
        return {
            error : "Username is in use"
        }
    }

    // Store User
    const user  = { id, username, room }
    users.push(user);
    return { user }
}

//Remove User
const removeUser = (id) => {
    const index = users.findIndex((user)=> {
        return user.id === id;
    })

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

// get User
const getUser = (id)=>{
    return users.find((user)=> {
            return user.id === id;
    })
}

// getUsersInRoom

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => {
        return user.room === room
    })
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}