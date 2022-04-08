/**
 * Get DOM elements
 * @type {HTMLElement}
 */

const buttonList = document.getElementById("buttonList")
const addButton = document.getElementById("addButton")

const messageList = document.getElementById("messageList")

const dashboard = document.getElementById("dashboard")

const userSelectBlock = document.getElementById("dashboard_users")
const userSelectContainer = document.getElementById("dashboard_userSelect")
const userSelectOption = document.querySelectorAll(".dashboard_button-userSelectOption")

/**
 * Button counter
 * @type {number}
 */

let buttonCounter = 0

/**
 * User infos
 * @type {{user: string, room: string}}
 */

let currentUserInfos = {
  user: "",
  room: "telegraph-room"
}

/**
 * Is user selected on client interface
 * False by default
 * @type {boolean}
 */

let isUserSelected = false

/**
 * Websocket
 */

const socket = io.connect("http://localhost:4000")

socket.on("receive_message", (data) => {
  // console.log(data)

  const regex = /([^:]+)/g
  const tutu = {
    user: data.match(regex)[0].trim(),
    message: data.match(regex)[1].trim()
  }

  if (currentUserInfos.user !== tutu.user) {
    const message = document.createElement("li")
    message.innerHTML = `Message from ${tutu.user}: "${tutu.message}"`
    messageList.appendChild(message)
  }
})

/**
 * Create new button DOM element
 * @param buttonInfos
 * @returns {HTMLLIElement}
 */

const createNewButtonDomElement = (buttonInfos) => {
  let element = document.createElement("li")
  element.classList.add("dashboard_checkbox")
  element.innerHTML = `
    <input class="dashboard_input" id="${buttonInfos.id}" type="checkbox" />
    <label class="dashboard_label" for="${buttonInfos.id}">${buttonInfos.user}, ${buttonInfos.type}</label>
  `;

  return element
}

/**
 * Add new button
 * @param event
 */

const addNewButton = (event) => {
  if (event.currentTarget.classList.contains("isDisable")) return

  Puck.connect((connection) => {
    if (connection === null) {
      console.log("Connection failed")
      return
    }

    console.log("connection", connection)

    buttonCounter++

    if (buttonCounter === 4) {
      addButton.classList.add("isDisable")
      userSelectBlock.classList.remove("isHide")
    }

    const buttonInfos = {
      id: buttonCounter,
      user: "",
      userId: 0,
      type: "",
    }

    if (buttonCounter === 1 || buttonCounter === 2) {
      buttonInfos.user = "user-1"
      buttonInfos.userId = 1
    } else if (buttonCounter === 3 || buttonCounter === 4) {
      buttonInfos.user = "user-2"
      buttonInfos.userId = 2
    }

    if (buttonCounter % 2 !== 0) {
      buttonInfos.type = "submit"
    } else {
      buttonInfos.type = "delete"
    }

    buttonList.append(createNewButtonDomElement(buttonInfos))

    connection.write("\x03\x10reset();\n", () => {
      setTimeout(() => {
        connection.write('\x10setWatch(() => { console.log("Pressed") }, BTN, { edge: "rising", debounce: 50, repeat: true });NRF.on(\'disconnect\',()=>reset());\n', () => {
          console.log("Ready to listen to button press events...")
        })
      }, 500)
    })

    document.getElementById(`${buttonInfos.id}`).addEventListener("change", (event) => {
      connection.write("\x10LED.toggle()\n")
    })

    connection.on("data", (data) => {
      console.log("Button pressed", buttonInfos)
      socket.emit("button_pressed", buttonInfos)
    })
  })
}

/**
 * User select option handler
 * @param event
 */

const userSelectOptionHandler = (event) => {
  currentButton = event.currentTarget

  currentUserInfos.user = currentButton.value
  socket.emit("join_room", currentUserInfos)

  console.log(`${currentUserInfos.user} joined "${currentUserInfos.room}"`)

  currentButton.classList.add("isActive")
  userSelectContainer.classList.add("isDisable")
  dashboard.classList.remove("isActive")

  isUserSelected = true
}

/**
 * Events
 */

addButton.addEventListener("click", addNewButton)

for (const option of userSelectOption) {
  option.addEventListener("click", userSelectOptionHandler)
}

document.addEventListener("keydown", (event) => {
  if (event.keyCode !== 68 || !isUserSelected) return
  dashboard.classList.toggle("isActive")
})