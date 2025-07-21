/** 
## Control Interface

### Steering

The radio sends a key-value pair with key `"steer"` and a value between 0 and
180, with 90 meaning straight ahead.

### Speed

The radio sends a key-value pair with key `"speed"` and a value between 0 and
180, with 90 meaning no speed, higher values meaning forward speed, and lower
values meaning going backwards.

 */
let STEERING_KEY = "steer"
let SPEED_KEY = "speed"
let MAX_SPEED = 120
class Utils {
    public drawSteeringArrow(aDirection: number) {
        let myX: number;
        /** 
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
        
 */
        for (myX = 3; myX < 5; myX++) {
            led.unplot(myX, 2)
            led.unplot(myX, 4)
        }
        for (myX = 3; myX < 5; myX++) {
            led.plot(myX, 3)
        }
        if (aDirection == ArrowNames.East) {
            led.plot(3, 2)
            led.plot(3, 4)
        } else if (aDirection == ArrowNames.West) {
            led.plot(4, 2)
            led.plot(4, 4)
        } else if (aDirection == ArrowNames.North) {
            for (myX = 3; myX < 5; myX++) {
                led.plot(myX, 2)
                led.plot(myX, 4)
            }
        } else {
            for (myX = 3; myX < 5; myX++) {
                led.plot(myX, 3)
            }
        }
        
    }
    
    public drawSpeedBar(aBarHeight: number) {
        let myY: number;
        /** 
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
        
 */
        for (myY = 0; myY < 5; myY++) {
            led.unplot(0, myY)
            led.unplot(1, myY)
        }
        if (aBarHeight > 0) {
            for (myY = 4; myY > 4 - aBarHeight; myY += -1) {
                led.plot(0, myY)
                led.plot(1, myY)
            }
        } else if (aBarHeight < 0) {
            for (myY = 0; myY < Math.abs(aBarHeight); myY++) {
                led.plot(0, myY)
                led.plot(1, myY)
            }
        }
        
    }
    
}

basic.forever(function on_forever() {
    let speed_val = 90
    //  steering control
    if (input.buttonIsPressed(Button.A)) {
        //  steer left
        new Utils().drawSteeringArrow(ArrowNames.West)
        radio.sendValue(STEERING_KEY, 45)
    } else if (input.buttonIsPressed(Button.B)) {
        //  steer right
        new Utils().drawSteeringArrow(ArrowNames.East)
        radio.sendValue(STEERING_KEY, 135)
    } else {
        //  go straight
        new Utils().drawSteeringArrow(ArrowNames.North)
        radio.sendValue(STEERING_KEY, 90)
    }
    
    //  speed control
    let myAngle = input.rotation(Rotation.Pitch)
    if (myAngle < -30) {
        speed_val += 10
        new Utils().drawSpeedBar(Math.idiv(speed_val - 90, 22))
        radio.sendValue(SPEED_KEY, speed_val)
    } else if (myAngle > 30) {
        speed_val -= 10
        new Utils().drawSpeedBar(Math.idiv(speed_val - 90, 22))
        radio.sendValue(SPEED_KEY, speed_val)
    } else {
        new Utils().drawSpeedBar(0)
        radio.sendValue(SPEED_KEY, 90)
    }
    
})
