# Before beginning with the next instruction cycle
# test for any interruptions 
# run ic if there are no interruptions
# if there's an interruption execute the respective function before the instruction cycle

# if we are in pause mode set interrRegister to trigger a pause before the execution of every instruction
execute if score stepMode interr matches 1 run scoreboard players set interrRegister interr 1 
execute if score interrRegister interr matches 0 run function ec1:ic/1_pc_to_mar
execute if score interrRegister interr matches 1 run function ec1:interr_handlers/pause/pause
execute if score interrRegister interr matches 2 run function ec1:interr_handlers/continue/continue
execute if score interrRegister interr matches 3 run function ec1:interr_handlers/call_stack_overflow/call_stack_overflow
execute if score interrRegister interr matches 4 run function ec1:interr_handlers/call_stack_ptr_neg/call_stack_ptr_neg
