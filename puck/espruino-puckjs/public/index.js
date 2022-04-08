const PORT = 4001
const URL = `http://localhost:${PORT}`

const deviceList = document.getElementById("devices")
const addDeviceButton = document.getElementById("addDeviceButton")

let deviceCounter = 0

// ------------------------------------------------------

const socket = io.connect(URL)

// ------------------------------------------------------ EVENTS

const addNewDevice = () => {
  Puck.connect((connection) => {
    if (connection === null) {
      console.log("Connection failed")
      return
    }

    deviceCounter++

    const deviceId = deviceCounter

    connection.write("\x03\x10reset();\n", () => {
      setTimeout(() => {
        connection.write('\x10setWatch(() => { console.log("Pressed") }, BTN, { edge: "rising", debounce: 50, repeat: true });NRF.on(\'disconnect\',()=>reset());\n', () => {
          console.log("Ready to listen to button press events...")
        })
      }, 500)
    })

    connection.on("data", () => {
      console.log(`Button ${deviceId} pressed`)
      socket.emit("button_pressed", deviceId)
    })


    // ------------------------------------------------------ DISPLAY NEW DEVICE (FRONT)
    const test = (id) => {
      let li = document.createElement("li")
      li.innerHTML = `<span>Device ${id}:</span><button id="toggleLedButton_${id}">LED</button>`

      return li
    }

    deviceList.append(test(deviceId))

    document.getElementById("toggleLedButton_" + deviceId).addEventListener("click", () => {
      connection.write("\x10LED.toggle()\n")
    })
    // ------------------------------------------------------
  })
}

// ------------------------------------------------------ EVENTS

addDeviceButton.addEventListener("click", addNewDevice)






