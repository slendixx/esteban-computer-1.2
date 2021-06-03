scoreboard objectives remove interr
scoreboard objectives add interr dummy
# scoreboard objectives setdisplay sidebar interr

scoreboard players add interrRegister interr 1
scoreboard players add continue interr 0
scoreboard players add stepMode interr 0

# Interruption codes. The interruptionRegister contains the value of the interruption that ocurred
#0: ok
#1: pause
#2: continue
#3: call_stack_overflow 
#4: call_stack_ptr_neg
#5: unknown_insttruction

