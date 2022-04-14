from RPi import GPIO
from time import sleep
import alsaaudio

m = alsaaudio.Mixer()

clk = 17
dt = 18

GPIO.setmode(GPIO.BCM)
GPIO.setup(clk, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(dt, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

counter = 50
clkLastState = GPIO.input(clk)

try:

    while True:
        clkState = GPIO.input(clk)
        dtState = GPIO.input(dt)
        if clkState != clkLastState:
            if dtState != clkState:
                if counter < 100:
                    counter += 1
            else:
                if counter > 0:
                    counter -= 1
            m.setvolume(counter)
            print(m.getvolume())
        clkLastState = clkState
        sleep(0.01)
finally:
    GPIO.cleanup()
