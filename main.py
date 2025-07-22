"""
## Control Interface

### Steering

The radio sends a key-value pair with key `"steer"` and a value between 0 and
180, with 90 meaning straight ahead.

### Speed

The radio sends a key-value pair with key `"speed"` and a value between 0 and
180, with 90 meaning no speed, higher values meaning forward speed, and lower
values meaning going backwards.
"""


STEERING_KEY = "steer"
SPEED_KEY = "speed"
MAX_SPEED = 120

class Utils:
    def drawSteeringArrow(self, aDirection: ArrowNames):
        """
        ArrowNames.EAST:
        o o o o o
        o o o o o
        o o o # .
        o o o # #
        o o o # .

        ArrowNames.WEST:
        o o o o o
        o o o o o
        o o o . #
        o o o # #
        o o o . #

        ArrowNames.NORTH:
        o o o o o
        o o o o o
        o o o # #
        o o o # #
        o o o # #
        """
        for myX in range(3, 5):
            led.unplot(myX, 2)
            led.unplot(myX, 4)
        for myX in range(3, 5):
            led.plot(myX, 3)

        if aDirection == ArrowNames.EAST:
            led.plot(3, 2)
            led.plot(3, 4)
        elif aDirection == ArrowNames.WEST:
            led.plot(4, 2)
            led.plot(4, 4)
        elif aDirection == ArrowNames.NORTH:
            for myX in range(3, 5):
                led.plot(myX, 2)
                led.plot(myX, 4)
        else:
            for myX in range(3, 5):
                led.plot(myX, 3)
    
    
    def drawSpeedBar(self, aBarHeight):
        """
        aBarHeight: int
            must be in range [-4, 4]
    
        Positive heights plotted from the bottom up, e.g., +3:
        . . o o o
        . . o o o
        # # o o o
        # # o o o
        # # o o o

        Negative heights plotted from the bottom up, e.g., -4:
        # # o o o
        # # o o o
        # # o o o
        # # o o o
        . . o o o
        """
        for myY in range(0, 5):
            led.unplot(0, myY)
            led.unplot(1, myY)

        if aBarHeight > 0:
            for myY in range(4, 4 - aBarHeight, -1):
                led.plot(0, myY)
                led.plot(1, myY)
        elif aBarHeight < 0:
            for myY in range(0, abs(aBarHeight)):
                led.plot(0, myY)
                led.plot(1, myY)


def on_forever():
    # steering control
    if input.button_is_pressed(Button.A):
        # steer left
        Utils().drawSteeringArrow(ArrowNames.WEST)
        radio.send_value(STEERING_KEY, 45)
    elif input.button_is_pressed(Button.B):
        # steer right
        Utils().drawSteeringArrow(ArrowNames.EAST)
        radio.send_value(STEERING_KEY, 135)
    else:
        # go straight
        Utils().drawSteeringArrow(ArrowNames.NORTH)
        radio.send_value(STEERING_KEY, 90)

    # speed control
    myAngle = input.rotation(Rotation.PITCH) # in range [-90, 90]
    mySpeed = -1 * myAngle + 90
    Utils().drawSpeedBar((mySpeed - 90) // 22)
    radio.send_value(SPEED_KEY, mySpeed)

basic.forever(on_forever)
