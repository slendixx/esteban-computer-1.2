scoreboard objectives remove callStackInst
scoreboard objectives add callStackInst dummy

scoreboard players add call callStackInst 0
scoreboard players add ret callStackInst 0
