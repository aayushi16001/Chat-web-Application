const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search,{ignoreQueryPrefix: true})

const autoscroll = () => {
    // New messages
    const $newMessages = $messages.lastElementChild
    
    // Height of new messages
    const newMessageStyle = getComputedStyle($newMessages)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessagesHeight = $newMessages.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $newMessages.offsetHeight


    // Height of messages container
    const containerHeight = $newMessages.scrollHeight

    //How far have i scroll
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessagesHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight // only this line if you want to always scroll to the bottom
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm:a')
    })
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll()
})

socket.on('locationMessage', (location)=>{
    console.log(location)
    const html = Mustache.render(locationTemplate,{
        username : location.username,
        url : location.url,
        createdAt : moment(location.createdAt).format('h:mm:a')
    })
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll()
})

socket.on('roomUserList', ({ room, users}) => {
    const html = Mustache.render(sideBarTemplate, {
        room : room,
        users : users
    })
    document.querySelector('#sidebar').innerHTML = html
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    // disabled
    $messageFormButton.setAttribute('disabled','disabled');

    const message = e.target.elements.message.value
   
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = '';
        $messageFormInput.focus()
        if(error){
            return console.log(error);
        }
        console.log('Message Deliver')
    })
})


const $sendLocationButton = document.querySelector('#send-location')

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, ()=> {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared')
        })
    })
})

socket.emit("join",{ username, room }, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})
